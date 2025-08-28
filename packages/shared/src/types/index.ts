export enum UserRole {
  USER = 'USER',
  COACH = 'COACH',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'OTHER'
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  EXTREMELY_ACTIVE = 'EXTREMELY_ACTIVE'
}

export enum BMICategory {
  UNDERWEIGHT = 'UNDERWEIGHT',
  NORMAL = 'NORMAL',
  OVERWEIGHT = 'OVERWEIGHT',
  OBESE_CLASS_I = 'OBESE_CLASS_I',
  OBESE_CLASS_II = 'OBESE_CLASS_II',
  OBESE_CLASS_III = 'OBESE_CLASS_III'
}

export enum MeasurementType {
  WEIGHT = 'WEIGHT',
  BODY_FAT = 'BODY_FAT',
  WAIST = 'WAIST',
  STEPS = 'STEPS',
  CALORIES_IN = 'CALORIES_IN',
  CALORIES_OUT = 'CALORIES_OUT',
  HEART_RATE = 'HEART_RATE'
}

export enum PlanType {
  NUTRITION = 'NUTRITION',
  WORKOUT = 'WORKOUT',
  HABIT = 'HABIT'
}

export enum PlanCreator {
  AI = 'AI',
  COACH = 'COACH'
}

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  MOCK = 'MOCK'
}

export enum DevicePlatform {
  HEALTHKIT = 'HEALTHKIT',
  GOOGLEFIT = 'GOOGLEFIT'
}

export enum ChatKind {
  AI = 'AI',
  DOCTOR = 'DOCTOR'
}

export enum MessageSender {
  USER = 'USER',
  AI = 'AI',
  DOCTOR = 'DOCTOR'
}

export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Core entities
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  userId: string;
  gender: Gender;
  birthYear: number;
  heightCm: number;
  waistCm: number;
  activityLevel: ActivityLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface Measurement {
  id: string;
  userId: string;
  type: MeasurementType;
  value: number;
  unit: string;
  at: Date;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  targetWeightKg: number;
  targetLossKg: number;
  startAt: Date;
  endAt: Date;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  userId: string;
  type: PlanType;
  title: string;
  description: string;
  weekIndex: number;
  createdBy: PlanCreator;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanTask {
  id: string;
  planId: string;
  date: Date;
  name: string;
  kcal?: number;
  minutes?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceLink {
  id: string;
  userId: string;
  platform: DevicePlatform;
  status: string;
  lastSyncAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  kind: ChatKind;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  sender: MessageSender;
  text: string;
  meta?: Record<string, any>;
  at: Date;
  createdAt: Date;
}

export interface Consultation {
  id: string;
  userId: string;
  doctorId: string;
  startAt: Date;
  endAt: Date;
  status: ConsultationStatus;
  meetingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  provider: PaymentProvider;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentLog {
  id: string;
  userId: string;
  provider: PaymentProvider;
  raw: Record<string, any>;
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  kcalPer100g: number;
  macrosJson: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealLog {
  id: string;
  userId: string;
  itemsJson: string;
  totalKcal: number;
  at: Date;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  diff?: Record<string, any>;
  at: Date;
}

// DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateProfileDto {
  gender: Gender;
  birthYear: number;
  heightCm: number;
  waistCm: number;
  activityLevel: ActivityLevel;
}

export interface BMICalculationDto {
  heightCm: number;
  weightKg: number;
}

export interface BMICalculationResult {
  bmi: number;
  category: BMICategory;
  message: string;
  isOverweight: boolean;
}

export interface CreateGoalDto {
  targetWeightKg: number;
  targetLossKg: number;
  startAt: Date;
  endAt: Date;
}

export interface CreateMeasurementDto {
  type: MeasurementType;
  value: number;
  unit: string;
  at: Date;
}

export interface CreatePlanDto {
  type: PlanType;
  title: string;
  description: string;
  weekIndex: number;
}

export interface CreatePlanTaskDto {
  date: Date;
  name: string;
  kcal?: number;
  minutes?: number;
}

export interface CreateConsultationDto {
  doctorId: string;
  startAt: Date;
  endAt: Date;
}

export interface ChatMessageDto {
  text: string;
  meta?: Record<string, any>;
}

export interface HealthSyncDto {
  platform: DevicePlatform;
  data: Array<{
    type: MeasurementType;
    value: number;
    unit: string;
    at: string;
  }>;
}

// AI Planning
export interface AIPlanContext {
  user: User;
  profile: Profile;
  goal: Goal;
  recentMeasurements: Measurement[];
  preferences?: Record<string, any>;
}

export interface AIPlanResponse {
  nutrition: {
    dailyMeals: Array<{
      meal: string;
      suggestions: string[];
      targetKcal: number;
    }>;
  };
  workout: {
    dailyExercises: Array<{
      name: string;
      duration: number;
      intensity: string;
      calories: number;
    }>;
  };
  habits: {
    water: number; // liters per day
    sleep: number; // hours per day
    other: string[];
  };
}

// Payment
export interface CheckoutSessionDto {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
