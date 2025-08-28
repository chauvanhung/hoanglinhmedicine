import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BMIService, BMICalculationDto, BMICalculationResult } from './bmi.service';

@ApiTags('BMI')
@Controller('bmi')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BMIController {
  constructor(private readonly bmiService: BMIService) {}

  @Post('calc')
  @ApiOperation({ summary: 'Tính toán BMI và đưa ra khuyến nghị' })
  @ApiResponse({ status: 200, description: 'Kết quả tính BMI' })
  async calculateBMI(@Body() bmiDto: BMICalculationDto): Promise<BMICalculationResult> {
    return this.bmiService.calculateBMI(bmiDto);
  }
}
