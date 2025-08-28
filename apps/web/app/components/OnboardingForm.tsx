'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

const onboardingSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  birthYear: z.number().min(1950).max(2010),
  heightCm: z.number().min(100).max(250),
  weightKg: z.number().min(30).max(300),
  waistCm: z.number().min(50).max(200),
  activityLevel: z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

interface OnboardingFormProps {
  onComplete: () => void
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Call API to register user
      console.log('Form data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete()
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tạo tài khoản</h2>
        <p className="text-gray-600">Bắt đầu hành trình chăm sóc sức khỏe của bạn</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            {...register('email')}
            className={`input-field ${errors.email ? 'border-danger-500' : ''}`}
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-danger-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            {...register('password')}
            className={`input-field ${errors.password ? 'border-danger-500' : ''}`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-danger-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`input-field ${errors.confirmPassword ? 'border-danger-500' : ''}`}
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-danger-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <button
        onClick={nextStep}
        disabled={!isValid}
        className="btn-primary w-full flex items-center justify-center"
      >
        Tiếp theo
        <ArrowRightIcon className="ml-2 h-5 w-5" />
      </button>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h2>
        <p className="text-gray-600">Giúp chúng tôi tạo kế hoạch phù hợp với bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Giới tính</label>
          <select
            {...register('gender')}
            className="input-field"
          >
            <option value="">Chọn giới tính</option>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div>
          <label className="form-label">Năm sinh</label>
          <input
            type="number"
            {...register('birthYear', { valueAsNumber: true })}
            className="input-field"
            placeholder="1990"
            min="1950"
            max="2010"
          />
        </div>

        <div>
          <label className="form-label">Chiều cao (cm)</label>
          <input
            type="number"
            {...register('heightCm', { valueAsNumber: true })}
            className="input-field"
            placeholder="170"
            min="100"
            max="250"
          />
        </div>

        <div>
          <label className="form-label">Cân nặng (kg)</label>
          <input
            type="number"
            {...register('weightKg', { valueAsNumber: true })}
            className="input-field"
            placeholder="70"
            min="30"
            max="300"
          />
        </div>

        <div>
          <label className="form-label">Vòng bụng (cm)</label>
          <input
            type="number"
            {...register('waistCm', { valueAsNumber: true })}
            className="input-field"
            placeholder="80"
            min="50"
            max="200"
          />
        </div>

        <div>
          <label className="form-label">Mức độ hoạt động</label>
          <select
            {...register('activityLevel')}
            className="input-field"
          >
            <option value="">Chọn mức độ</option>
            <option value="SEDENTARY">Ít vận động</option>
            <option value="LIGHTLY_ACTIVE">Vận động nhẹ</option>
            <option value="MODERATELY_ACTIVE">Vận động vừa phải</option>
            <option value="VERY_ACTIVE">Vận động nhiều</option>
            <option value="EXTREMELY_ACTIVE">Vận động rất nhiều</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="btn-secondary flex-1 flex items-center justify-center"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Quay lại
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Hoàn thành'}
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Bước {step}/2</span>
              <span className="text-sm text-gray-500">Tài khoản → Thông tin</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Form content */}
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  )
}
