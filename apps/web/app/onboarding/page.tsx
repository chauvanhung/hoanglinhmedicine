'use client'

import { useState } from 'react'

interface UserData {
  fullName: string
  email: string
  age: string
  gender: string
  height: string
  currentWeight: string
  activityLevel: string
  targetWeight: string
  timeframe: string
  weeklyGoal: string
  exercises: string[]
  diets: string[]
  cookingTime: string
  budget: string
  password: string
  confirmPassword: string
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    currentWeight: '',
    activityLevel: '',
    targetWeight: '',
    timeframe: '',
    weeklyGoal: '',
    exercises: [],
    diets: [],
    cookingTime: '',
    budget: '',
    password: '',
    confirmPassword: ''
  })

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      updateProgressSteps()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      updateProgressSteps()
    }
  }

  const updateProgressSteps = () => {
    const steps = document.querySelectorAll('.step')
    steps.forEach((step, index) => {
      if (index + 1 <= currentStep) {
        step.classList.add('active')
      } else {
        step.classList.remove('active')
      }
    })
  }

  const handleInputChange = (field: keyof UserData, value: string | string[]) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExerciseChange = (exercise: string, checked: boolean) => {
    if (checked) {
      setUserData(prev => ({
        ...prev,
        exercises: [...prev.exercises, exercise]
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        exercises: prev.exercises.filter(e => e !== exercise)
      }))
    }
  }

  const handleDietChange = (diet: string, checked: boolean) => {
    if (checked) {
      setUserData(prev => ({
        ...prev,
        diets: [...prev.diets, diet]
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        diets: prev.diets.filter(d => d !== diet)
      }))
    }
  }

  const calculateWeightLoss = () => {
    const current = parseFloat(userData.currentWeight)
    const target = parseFloat(userData.targetWeight)
    return current - target
  }

  const calculateCalories = () => {
    const weight = parseFloat(userData.currentWeight)
    const height = parseFloat(userData.height)
    const age = parseInt(userData.age)
    const gender = userData.gender
    
    // Công thức BMR cơ bản
    let bmr = 0
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
    
    // Điều chỉnh theo mức độ hoạt động
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly': 1.375,
      'moderately': 1.55,
      'very': 1.725,
      'extremely': 1.9
    }
    
    const tdee = bmr * (activityMultipliers[userData.activityLevel as keyof typeof activityMultipliers] || 1.2)
    
    // Điều chỉnh cho mục tiêu giảm cân
    const weeklyGoal = parseFloat(userData.weeklyGoal)
    const dailyDeficit = weeklyGoal * 7700 / 7 // 7700 cal = 1kg
    
    return Math.round(tdee - dailyDeficit)
  }

  const validateForm = () => {
    if (!userData.password || userData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return false
    }
    if (userData.password !== userData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return false
    }
    if (!userData.email || !userData.fullName) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return false
    }
    return true
  }

  const completeOnboarding = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // Import Firebase service
      const { initializeFirebase, createUser, addDocument } = await import('../../lib/firebase.js');
      const { COLLECTIONS } = await import('../../firebase.config.js');
      
      // Initialize Firebase
      await initializeFirebase();

      // Tạo user với Firebase Auth
      const { user } = await createUser(userData.email, userData.password);
      
      // Tạo user profile
      const profileData = {
        name: userData.fullName,
        age: parseInt(userData.age),
        gender: userData.gender,
        height: parseFloat(userData.height),
        currentWeight: parseFloat(userData.currentWeight),
        activityLevel: userData.activityLevel,
        exercises: userData.exercises,
        diets: userData.diets,
        cookingTime: parseInt(userData.cookingTime),
        budget: userData.budget
      };
      
      await addDocument(COLLECTIONS.PROFILES, { userId: user.uid, ...profileData });
      
      // Tạo user goal
      const goalData = {
        targetWeight: parseFloat(userData.targetWeight),
        targetLossKg: calculateWeightLoss(),
        timeframe: parseInt(userData.timeframe),
        weeklyGoal: parseFloat(userData.weeklyGoal),
        startAt: new Date().toISOString(),
        endAt: new Date(Date.now() + parseInt(userData.timeframe) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE'
      };
      
      await addDocument(COLLECTIONS.GOALS, { userId: user.uid, ...goalData });
      
      // Tạo initial measurement
      const measurementData = {
        type: 'WEIGHT',
        value: parseFloat(userData.currentWeight),
        unit: 'kg',
        at: new Date().toISOString()
      };
      
      await addDocument(COLLECTIONS.MEASUREMENTS, { userId: user.uid, ...measurementData });
      
      // Lưu thông tin user và plan vào localStorage
      localStorage.setItem('firebase_user', JSON.stringify(user));
      localStorage.setItem('weightLossPlan', JSON.stringify({
        ...userData,
        weightLoss: calculateWeightLoss(),
        dailyCalories: calculateCalories(),
        createdAt: new Date().toISOString(),
        userId: user.uid
      }));

      // Hiển thị thông báo thành công
      alert('🎉 Tạo tài khoản Firebase thành công! Bạn sẽ được chuyển đến dashboard.')
      
      // Chuyển đến dashboard
      window.location.href = '/dashboard'
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="onboarding-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <a href="/" className="back-link">← Quay lại trang chủ</a>
          <h1>🚀 Bắt đầu hành trình giảm cân</h1>
          <p>Tạo hồ sơ cá nhân và nhận kế hoạch giảm cân khoa học</p>
        </div>
      </header>

      {/* Progress Steps */}
      <section className="progress-steps">
        <div className="steps-container">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Thông tin cơ bản</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Mục tiêu giảm cân</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Lối sống & Sở thích</div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Kế hoạch cá nhân</div>
          </div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-label">Tạo tài khoản</div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <section className="onboarding-step active" id="step-1">
          <div className="step-container">
            <div className="step-header">
              <h2>👤 Thông tin cơ bản</h2>
              <p>Hãy cho chúng tôi biết một chút về bạn</p>
            </div>

            <form className="onboarding-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    placeholder="Nhập họ và tên đầy đủ"
                    value={userData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="example@email.com"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Tuổi *</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    placeholder="Tuổi của bạn"
                    min="16"
                    max="80"
                    value={userData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Giới tính *</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    value={userData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    required
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">Chiều cao (cm) *</label>
                  <input 
                    type="number" 
                    id="height" 
                    name="height" 
                    placeholder="Ví dụ: 170"
                    min="100"
                    max="250"
                    value={userData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currentWeight">Cân nặng hiện tại (kg) *</label>
                  <input 
                    type="number" 
                    id="currentWeight" 
                    name="currentWeight" 
                    placeholder="Ví dụ: 75"
                    min="30"
                    max="300"
                    value={userData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="activityLevel">Mức độ hoạt động *</label>
                <select 
                  id="activityLevel" 
                  name="activityLevel" 
                  value={userData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  required
                >
                  <option value="">Chọn mức độ hoạt động</option>
                  <option value="sedentary">Ít vận động (ngồi nhiều)</option>
                  <option value="lightly">Vận động nhẹ (1-3 lần/tuần)</option>
                  <option value="moderately">Vận động vừa (3-5 lần/tuần)</option>
                  <option value="very">Vận động nhiều (6-7 lần/tuần)</option>
                  <option value="extremely">Vận động rất nhiều (2 lần/ngày)</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Tiếp theo →
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Step 2: Weight Loss Goals */}
      {currentStep === 2 && (
        <section className="onboarding-step active" id="step-2">
          <div className="step-container">
            <div className="step-header">
              <h2>🎯 Mục tiêu giảm cân</h2>
              <p>Đặt mục tiêu thực tế và có thể đạt được</p>
            </div>

            <form className="onboarding-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="form-group">
                <label htmlFor="targetWeight">Cân nặng mục tiêu (kg) *</label>
                <input 
                  type="number" 
                  id="targetWeight" 
                  name="targetWeight" 
                  placeholder="Ví dụ: 65"
                  min="30"
                  max="300"
                  value={userData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  required
                />
                <div className="form-help">
                  <span id="weight-loss-display">
                    Bạn sẽ giảm: {userData.currentWeight && userData.targetWeight ? 
                      (parseFloat(userData.currentWeight) - parseFloat(userData.targetWeight)).toFixed(1) : 0} kg
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="timeframe">Thời gian đạt mục tiêu *</label>
                <select 
                  id="timeframe" 
                  name="timeframe" 
                  value={userData.timeframe}
                  onChange={(e) => handleInputChange('timeframe', e.target.value)}
                  required
                >
                  <option value="">Chọn thời gian</option>
                  <option value="1">1 tháng</option>
                  <option value="2">2 tháng</option>
                  <option value="3">3 tháng</option>
                  <option value="6">6 tháng</option>
                  <option value="12">1 năm</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="weeklyGoal">Mục tiêu giảm cân mỗi tuần *</label>
                <select 
                  id="weeklyGoal" 
                  name="weeklyGoal" 
                  value={userData.weeklyGoal}
                  onChange={(e) => handleInputChange('weeklyGoal', e.target.value)}
                  required
                >
                  <option value="">Chọn mục tiêu</option>
                  <option value="0.25">0.25 kg/tuần (an toàn)</option>
                  <option value="0.5">0.5 kg/tuần (khuyến nghị)</option>
                  <option value="0.75">0.75 kg/tuần (nhanh)</option>
                  <option value="1">1 kg/tuần (rất nhanh)</option>
                </select>
              </div>

              <div className="goal-preview">
                <h4>📊 Tóm tắt mục tiêu</h4>
                <div className="goal-summary">
                  <div className="goal-item">
                    <span className="goal-label">Cân nặng hiện tại:</span>
                    <span className="goal-value">{userData.currentWeight || 0} kg</span>
                  </div>
                  <div className="goal-item">
                    <span className="goal-label">Cân nặng mục tiêu:</span>
                    <span className="goal-value">{userData.targetWeight || 0} kg</span>
                  </div>
                  <div className="goal-item">
                    <span className="goal-label">Tổng giảm:</span>
                    <span className="goal-value">
                      {userData.currentWeight && userData.targetWeight ? 
                        (parseFloat(userData.currentWeight) - parseFloat(userData.targetWeight)).toFixed(1) : 0} kg
                    </span>
                  </div>
                  <div className="goal-item">
                    <span className="goal-label">Thời gian:</span>
                    <span className="goal-value">{userData.timeframe || 0} tháng</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  ← Quay lại
                </button>
                <button type="submit" className="btn btn-primary">
                  Tiếp theo →
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Step 3: Lifestyle & Preferences */}
      {currentStep === 3 && (
        <section className="onboarding-step active" id="step-3">
          <div className="step-container">
            <div className="step-header">
              <h2>🏃‍♀️ Lối sống & Sở thích</h2>
              <p>Giúp chúng tôi tạo kế hoạch phù hợp với bạn</p>
            </div>

            <form className="onboarding-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
              <div className="form-group">
                <label>Loại bài tập yêu thích</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="exercises" 
                      value="cardio"
                      checked={userData.exercises.includes('cardio')}
                      onChange={(e) => handleExerciseChange('cardio', e.target.checked)}
                    />
                    <span className="checkmark">🏃‍♀️ Cardio (chạy, đạp xe)</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="exercises" 
                      value="strength"
                      checked={userData.exercises.includes('strength')}
                      onChange={(e) => handleExerciseChange('strength', e.target.checked)}
                    />
                    <span className="checkmark">💪 Tập tạ, thể hình</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="exercises" 
                      value="yoga"
                      checked={userData.exercises.includes('yoga')}
                      onChange={(e) => handleExerciseChange('yoga', e.target.checked)}
                    />
                    <span className="checkmark">🧘‍♀️ Yoga, pilates</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="exercises" 
                      value="swimming"
                      checked={userData.exercises.includes('swimming')}
                      onChange={(e) => handleExerciseChange('swimming', e.target.checked)}
                    />
                    <span className="checkmark">🏊‍♀️ Bơi lội</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="exercises" 
                      value="dancing"
                      checked={userData.exercises.includes('dancing')}
                      onChange={(e) => handleExerciseChange('dancing', e.target.checked)}
                    />
                    <span className="checkmark">💃 Nhảy múa</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Chế độ ăn ưa thích</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="diets" 
                      value="low-carb"
                      checked={userData.diets.includes('low-carb')}
                      onChange={(e) => handleDietChange('low-carb', e.target.checked)}
                    />
                    <span className="checkmark">🥑 Low-carb</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="diets" 
                      value="vegetarian"
                      checked={userData.diets.includes('vegetarian')}
                      onChange={(e) => handleDietChange('vegetarian', e.target.checked)}
                    />
                    <span className="checkmark">🥬 Ăn chay</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="diets" 
                      value="mediterranean"
                      checked={userData.diets.includes('mediterranean')}
                      onChange={(e) => handleDietChange('mediterranean', e.target.checked)}
                    />
                    <span className="checkmark">🐟 Địa Trung Hải</span>
                  </label>
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      name="diets" 
                      value="intermittent"
                      checked={userData.diets.includes('intermittent')}
                      onChange={(e) => handleDietChange('intermittent', e.target.checked)}
                    />
                    <span className="checkmark">⏰ Nhịn ăn gián đoạn</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cookingTime">Thời gian nấu ăn mỗi ngày</label>
                <select 
                  id="cookingTime" 
                  name="cookingTime" 
                  value={userData.cookingTime}
                  onChange={(e) => handleInputChange('cookingTime', e.target.value)}
                  required
                >
                  <option value="">Chọn thời gian</option>
                  <option value="15">15 phút</option>
                  <option value="30">30 phút</option>
                  <option value="45">45 phút</option>
                  <option value="60">1 giờ</option>
                  <option value="90">1.5 giờ</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Ngân sách cho thực phẩm</label>
                <select 
                  id="budget" 
                  name="budget" 
                  value={userData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  required
                >
                  <option value="">Chọn ngân sách</option>
                  <option value="low">Tiết kiệm (50-100k/ngày)</option>
                  <option value="medium">Trung bình (100-200k/ngày)</option>
                  <option value="high">Cao cấp (200k+/ngày)</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  ← Quay lại
                </button>
                <button type="submit" className="btn btn-primary">
                  Tiếp theo →
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Step 4: Personal Plan */}
      {currentStep === 4 && (
        <section className="onboarding-step active" id="step-4">
          <div className="step-container">
            <div className="step-header">
              <h2>📋 Kế hoạch cá nhân của bạn</h2>
              <p>Dựa trên thông tin đã cung cấp, đây là kế hoạch giảm cân tối ưu</p>
            </div>

            <div className="plan-summary">
              <div className="plan-card">
                <div className="plan-header">
                  <h3>🎯 Mục tiêu tổng quan</h3>
                </div>
                <div className="plan-content">
                  <div className="plan-item">
                    <span className="plan-label">Cân nặng hiện tại:</span>
                    <span className="plan-value">{userData.currentWeight} kg</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Cân nặng mục tiêu:</span>
                    <span className="plan-value">{userData.targetWeight} kg</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Tổng giảm:</span>
                    <span className="plan-value">{calculateWeightLoss().toFixed(1)} kg</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Thời gian:</span>
                    <span className="plan-value">{userData.timeframe} tháng</span>
                  </div>
                </div>
              </div>

              <div className="plan-card">
                <div className="plan-header">
                  <h3>🍽️ Khuyến nghị dinh dưỡng</h3>
                </div>
                <div className="plan-content">
                  <div className="plan-item">
                    <span className="plan-label">Lượng calo/ngày:</span>
                    <span className="plan-value">{calculateCalories()} kcal</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Protein:</span>
                    <span className="plan-value">{Math.round(parseFloat(userData.currentWeight) * 1.6)}g</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Carbohydrate:</span>
                    <span className="plan-value">{Math.round(calculateCalories() * 0.45 / 4)}g</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Chất béo:</span>
                    <span className="plan-value">{Math.round(calculateCalories() * 0.25 / 9)}g</span>
                  </div>
                </div>
              </div>

              <div className="plan-card">
                <div className="plan-header">
                  <h3>💪 Kế hoạch tập luyện</h3>
                </div>
                <div className="plan-content">
                  <div className="plan-item">
                    <span className="plan-label">Tần suất:</span>
                    <span className="plan-value">3-5 lần/tuần</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Thời gian:</span>
                    <span className="plan-value">45-60 phút</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-label">Loại bài tập:</span>
                    <span className="plan-value">{userData.exercises.join(', ') || 'Cardio + Tập tạ'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="plan-actions">
              <button type="button" className="btn btn-outline" onClick={prevStep}>
                ← Quay lại
              </button>
              <button type="button" className="btn btn-primary btn-large" onClick={nextStep}>
                🔐 Tạo tài khoản →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 5: Create Account */}
      {currentStep === 5 && (
        <section className="onboarding-step active" id="step-5">
          <div className="step-container">
            <div className="step-header">
              <h2>🔐 Tạo tài khoản</h2>
              <p>Đặt mật khẩu để hoàn tất việc tạo tài khoản</p>
            </div>

            <form className="onboarding-form" onSubmit={(e) => { e.preventDefault(); completeOnboarding(); }}>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Tối thiểu 6 ký tự"
                  minLength={6}
                  value={userData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <div className="form-help">
                  Mật khẩu phải có ít nhất 6 ký tự
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Nhập lại mật khẩu"
                  value={userData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <div className="account-summary">
                <h4>📋 Tóm tắt thông tin tài khoản</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Họ tên:</span>
                    <span className="summary-value">{userData.fullName}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Email:</span>
                    <span className="summary-value">{userData.email}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Tuổi:</span>
                    <span className="summary-value">{userData.age} tuổi</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Mục tiêu:</span>
                    <span className="summary-value">Giảm {calculateWeightLoss().toFixed(1)} kg</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  ← Quay lại
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large" 
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Đang tạo tài khoản...' : '✅ Hoàn thành & Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Success Modal */}
      <div className="success-modal" id="success-modal" style={{display: 'none'}}>
        <div className="modal-content">
          <div className="modal-icon">🎉</div>
          <h3>Chúc mừng!</h3>
          <p>Bạn đã hoàn thành quá trình thiết lập. Hãy kiểm tra email để xác nhận tài khoản.</p>
          <div className="modal-actions">
            <a href="/dashboard" className="btn btn-primary">🚀 Vào Dashboard</a>
            <a href="/" className="btn btn-outline">🏠 Về trang chủ</a>
          </div>
        </div>
      </div>
    </div>
  )
}
