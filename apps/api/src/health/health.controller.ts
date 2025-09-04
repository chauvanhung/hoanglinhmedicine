import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HealthService } from './health.service';
import { HealthDataDto } from './dto/health-data.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('data')
  @UseGuards(JwtAuthGuard)
  async receiveHealthData(@Body() healthData: HealthDataDto, @Request() req) {
    const userId = req.user.id;
    
    try {
      // Lưu dữ liệu vào database
      const savedData = await this.healthService.saveHealthData(userId, healthData);
      
      // Gửi notification cho user
      await this.healthService.sendHealthNotification(userId, savedData);
      
      return {
        success: true,
        message: 'Health data received successfully',
        data: savedData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save health data',
        error: error.message
      };
    }
  }

  @Get('data')
  @UseGuards(JwtAuthGuard)
  async getHealthData(@Request() req) {
    const userId = req.user.id;
    
    try {
      const healthData = await this.healthService.getUserHealthData(userId);
      return {
        success: true,
        data: healthData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch health data',
        error: error.message
      };
    }
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncHealthData(@Request() req) {
    const userId = req.user.id;
    
    try {
      // Trigger sync với Apple Health
      const syncResult = await this.healthService.syncWithAppleHealth(userId);
      
      return {
        success: true,
        message: 'Health data synced successfully',
        data: syncResult
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sync health data',
        error: error.message
      };
    }
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getHealthStats(@Request() req) {
    const userId = req.user.id;
    
    try {
      const stats = await this.healthService.getHealthStats(userId);
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch health stats',
        error: error.message
      };
    }
  }
}