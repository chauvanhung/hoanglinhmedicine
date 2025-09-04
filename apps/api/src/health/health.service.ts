import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthData } from './entities/health-data.entity';
import { HealthDataDto } from './dto/health-data.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthData)
    private healthDataRepository: Repository<HealthData>,
    private notificationService: NotificationService,
  ) {}

  async saveHealthData(userId: string, healthDataDto: HealthDataDto): Promise<HealthData> {
    // Tạo hoặc cập nhật health data
    let healthData = await this.healthDataRepository.findOne({
      where: { userId, date: healthDataDto.date }
    });

    if (healthData) {
      // Cập nhật dữ liệu hiện có
      healthData.steps = healthDataDto.steps;
      healthData.calories = healthDataDto.calories;
      healthData.heartRate = healthDataDto.heartRate;
      healthData.weight = healthDataDto.weight;
      healthData.lastSync = new Date();
    } else {
      // Tạo dữ liệu mới
      healthData = this.healthDataRepository.create({
        userId,
        steps: healthDataDto.steps,
        calories: healthDataDto.calories,
        heartRate: healthDataDto.heartRate,
        weight: healthDataDto.weight,
        date: healthDataDto.date,
        lastSync: new Date(),
      });
    }

    return await this.healthDataRepository.save(healthData);
  }

  async getUserHealthData(userId: string): Promise<HealthData[]> {
    return await this.healthDataRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 30 // Lấy 30 ngày gần nhất
    });
  }

  async getHealthStats(userId: string): Promise<any> {
    const healthData = await this.healthDataRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: 7 // Lấy 7 ngày gần nhất
    });

    if (healthData.length === 0) {
      return {
        totalSteps: 0,
        totalCalories: 0,
        avgHeartRate: 0,
        weightChange: 0,
        lastSync: null
      };
    }

    const totalSteps = healthData.reduce((sum, data) => sum + data.steps, 0);
    const totalCalories = healthData.reduce((sum, data) => sum + data.calories, 0);
    const avgHeartRate = healthData.reduce((sum, data) => sum + data.heartRate, 0) / healthData.length;
    
    const latestWeight = healthData[0].weight;
    const oldestWeight = healthData[healthData.length - 1].weight;
    const weightChange = latestWeight - oldestWeight;

    return {
      totalSteps,
      totalCalories,
      avgHeartRate: Math.round(avgHeartRate),
      weightChange: Math.round(weightChange * 10) / 10,
      lastSync: healthData[0].lastSync
    };
  }

  async syncWithAppleHealth(userId: string): Promise<any> {
    // Đây là nơi sẽ tích hợp với Apple Health API
    // Hiện tại trả về mock data
    
    const mockData = {
      steps: Math.floor(Math.random() * 3000) + 7000,
      calories: Math.floor(Math.random() * 200) + 300,
      heartRate: Math.floor(Math.random() * 30) + 60,
      weight: 68.5 + (Math.random() - 0.5) * 1,
      date: new Date().toISOString().split('T')[0]
    };

    // Lưu dữ liệu sync
    await this.saveHealthData(userId, mockData);

    return mockData;
  }

  async sendHealthNotification(userId: string, healthData: HealthData): Promise<void> {
    // Gửi notification cho user về dữ liệu sức khỏe mới
    const message = `Dữ liệu sức khỏe đã được cập nhật: ${healthData.steps} bước, ${healthData.calories} calories`;
    
    await this.notificationService.sendNotification(userId, {
      title: 'Apple Health Sync',
      message,
      type: 'health_update',
      data: healthData
    });
  }

  async getHealthTrends(userId: string, days: number = 30): Promise<any> {
    const healthData = await this.healthDataRepository.find({
      where: { userId },
      order: { date: 'DESC' },
      take: days
    });

    // Phân tích xu hướng
    const trends = {
      steps: this.calculateTrend(healthData.map(d => d.steps)),
      calories: this.calculateTrend(healthData.map(d => d.calories)),
      heartRate: this.calculateTrend(healthData.map(d => d.heartRate)),
      weight: this.calculateTrend(healthData.map(d => d.weight))
    };

    return trends;
  }

  private calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const change = (secondAvg - firstAvg) / firstAvg;
    
    if (change > 0.05) return 'up';
    if (change < -0.05) return 'down';
    return 'stable';
  }
}
