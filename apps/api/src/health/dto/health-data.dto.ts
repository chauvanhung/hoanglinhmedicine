import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class HealthDataDto {
  @IsNumber()
  steps: number;

  @IsNumber()
  calories: number;

  @IsNumber()
  heartRate: number;

  @IsNumber()
  weight: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  source?: string; // 'apple_health', 'manual', etc.
}
