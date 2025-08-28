import { Module } from '@nestjs/common';
import { BMIController } from './bmi.controller';
import { BMIService } from './bmi.service';

@Module({
  controllers: [BMIController],
  providers: [BMIService],
  exports: [BMIService],
})
export class BMIModule {}
