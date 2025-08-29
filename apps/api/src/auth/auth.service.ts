import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  // Extended onboarding data
  age?: number;
  gender?: string;
  height?: number;
  currentWeight?: number;
  activityLevel?: string;
  targetWeight?: number;
  timeframe?: number;
  weeklyGoal?: number;
  exercises?: string[];
  diets?: string[];
  cookingTime?: number;
  budget?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { 
      email, 
      password, 
      name,
      age,
      gender,
      height,
      currentWeight,
      activityLevel,
      targetWeight,
      timeframe,
      weeklyGoal,
      exercises,
      diets,
      cookingTime,
      budget
    } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile and goal in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name: name || email.split('@')[0],
          role: 'USER',
        },
      });

      // Create profile if onboarding data is provided
      if (age && gender && height && currentWeight && activityLevel) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            gender: gender as any, // Cast to enum
            birthYear: new Date().getFullYear() - age,
            heightCm: height,
            waistCm: currentWeight * 0.4, // Estimate waist from weight
            activityLevel: activityLevel as any, // Cast to enum
          },
        });
      }

      // Create goal if target weight is provided
      if (targetWeight && currentWeight && timeframe && weeklyGoal) {
        const startAt = new Date();
        const endAt = new Date();
        endAt.setMonth(endAt.getMonth() + timeframe);

        await prisma.goal.create({
          data: {
            userId: user.id,
            targetWeightKg: targetWeight,
            targetLossKg: currentWeight - targetWeight,
            startAt,
            endAt,
            status: 'ACTIVE',
          },
        });
      }

      // Create initial measurement
      if (currentWeight) {
        await prisma.measurement.create({
          data: {
            userId: user.id,
            type: 'WEIGHT',
            value: currentWeight,
            unit: 'kg',
            at: new Date(),
          },
        });
      }

      return user;
    });

    return {
      message: 'Đăng ký thành công',
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: null, // Will be implemented later
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
