import { Injectable } from '@nestjs/common';

export interface BMICalculationDto {
  heightCm: number;
  weightKg: number;
}

export interface BMICalculationResult {
  bmi: number;
  category: string;
  message: string;
  recommendedCalories: number;
}

@Injectable()
export class BMIService {
  calculateBMI(bmiDto: BMICalculationDto): BMICalculationResult {
    const { heightCm, weightKg } = bmiDto;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    const category = this.getBMICategory(bmi);
    const message = this.getBMIMessage(bmi);
    const recommendedCalories = this.calculateRecommendedCalories(weightKg, heightCm, bmi);
    
    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      message,
      recommendedCalories
    };
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường';
    if (bmi < 30) return 'Thừa cân';
    if (bmi < 35) return 'Béo phì độ I';
    if (bmi < 40) return 'Béo phì độ II';
    return 'Béo phì độ III';
  }

  private getBMIMessage(bmi: number): string {
    if (bmi < 18.5) return 'Bạn cần tăng cân để đạt chỉ số BMI khỏe mạnh';
    if (bmi < 25) return 'Chỉ số BMI của bạn ở mức khỏe mạnh, hãy duy trì';
    if (bmi < 30) return 'Bạn nên giảm cân để cải thiện sức khỏe';
    return 'Bạn cần giảm cân để tránh các vấn đề sức khỏe nghiêm trọng';
  }

  private calculateRecommendedCalories(weightKg: number, heightCm: number, bmi: number): number {
    // Công thức cơ bản: BMR = 10 × weight + 6.25 × height - 5 × age + 5 (nam) / -161 (nữ)
    // Giả sử tuổi trung bình 30 và nam
    const age = 30;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    
    // Hệ số hoạt động vừa phải
    const activityMultiplier = 1.55;
    
    // Nếu BMI > 25, giảm 500 calo để giảm cân
    const weightLossAdjustment = bmi > 25 ? -500 : 0;
    
    return Math.round(bmr * activityMultiplier + weightLossAdjustment);
  }
}
