import { BMICategory, BMICalculationResult } from '../types';

export function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return BMICategory.UNDERWEIGHT;
  if (bmi < 25) return BMICategory.NORMAL;
  if (bmi < 30) return BMICategory.OVERWEIGHT;
  if (bmi < 35) return BMICategory.OBESE_CLASS_I;
  if (bmi < 40) return BMICategory.OBESE_CLASS_II;
  return BMICategory.OBESE_CLASS_III;
}

export function getBMIMessage(category: BMICategory): string {
  const messages = {
    [BMICategory.UNDERWEIGHT]: 'Bạn đang thiếu cân. Hãy tham khảo ý kiến bác sĩ để có kế hoạch tăng cân lành mạnh.',
    [BMICategory.NORMAL]: 'Chỉ số BMI của bạn trong mức bình thường. Hãy duy trì lối sống lành mạnh!',
    [BMICategory.OVERWEIGHT]: 'Bạn đang thừa cân. Hãy bắt đầu kế hoạch giảm cân với chế độ ăn và tập luyện phù hợp.',
    [BMICategory.OBESE_CLASS_I]: 'Bạn đang ở mức béo phì độ I. Cần có kế hoạch giảm cân nghiêm túc và tham khảo ý kiến chuyên gia.',
    [BMICategory.OBESE_CLASS_II]: 'Bạn đang ở mức béo phì độ II. Cần can thiệp y tế và kế hoạch giảm cân chuyên nghiệp.',
    [BMICategory.OBESE_CLASS_III]: 'Bạn đang ở mức béo phì độ III. Cần can thiệp y tế ngay lập tức và theo dõi chặt chẽ.'
  };
  return messages[category];
}

export function calculateBMIResult(heightCm: number, weightKg: number): BMICalculationResult {
  const bmi = calculateBMI(heightCm, weightKg);
  const category = getBMICategory(bmi);
  const message = getBMIMessage(category);
  const isOverweight = bmi >= 25;

  return {
    bmi,
    category,
    message,
    isOverweight
  };
}

export function calculateRecommendedCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'MALE' | 'FEMALE',
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE'
): number {
  // Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'MALE') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Activity multipliers
  const activityMultipliers = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
    EXTREMELY_ACTIVE: 1.9
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}

export function calculateWeightLossCalories(maintenanceCalories: number, targetLossKgPerWeek: number): number {
  // 1kg fat = 7700 calories
  const dailyDeficit = (targetLossKgPerWeek * 7700) / 7;
  return Math.round(maintenanceCalories - dailyDeficit);
}
