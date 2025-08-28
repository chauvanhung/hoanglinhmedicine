export default function OnboardingPage() {
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
          <div className="step active">
            <div className="step-number">1</div>
            <div className="step-label">Thông tin cơ bản</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-label">Mục tiêu giảm cân</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">Lối sống & Sở thích</div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-label">Kế hoạch cá nhân</div>
          </div>
        </div>
      </section>

      {/* Step 1: Basic Information */}
      <section className="onboarding-step active" id="step-1">
        <div className="step-container">
          <div className="step-header">
            <h2>👤 Thông tin cơ bản</h2>
            <p>Hãy cho chúng tôi biết một chút về bạn</p>
          </div>

          <form className="onboarding-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Tuổi</label>
                <input 
                  type="number" 
                  id="age" 
                  name="age" 
                  placeholder="Tuổi của bạn"
                  min="16"
                  max="80"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Giới tính</label>
                <select id="gender" name="gender" required>
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height">Chiều cao (cm)</label>
                <input 
                  type="number" 
                  id="height" 
                  name="height" 
                  placeholder="Ví dụ: 170"
                  min="100"
                  max="250"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentWeight">Cân nặng hiện tại (kg)</label>
                <input 
                  type="number" 
                  id="currentWeight" 
                  name="currentWeight" 
                  placeholder="Ví dụ: 75"
                  min="30"
                  max="300"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel">Mức độ hoạt động</label>
              <select id="activityLevel" name="activityLevel" required>
                <option value="">Chọn mức độ hoạt động</option>
                <option value="sedentary">Ít vận động (ngồi nhiều)</option>
                <option value="lightly">Vận động nhẹ (1-3 lần/tuần)</option>
                <option value="moderately">Vận động vừa (3-5 lần/tuần)</option>
                <option value="very">Vận động nhiều (6-7 lần/tuần)</option>
                <option value="extremely">Vận động rất nhiều (2 lần/ngày)</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick="nextStep()">
                Tiếp theo →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Step 2: Weight Loss Goals */}
      <section className="onboarding-step" id="step-2">
        <div className="step-container">
          <div className="step-header">
            <h2>🎯 Mục tiêu giảm cân</h2>
            <p>Đặt mục tiêu thực tế và có thể đạt được</p>
          </div>

          <form className="onboarding-form">
            <div className="form-group">
              <label htmlFor="targetWeight">Cân nặng mục tiêu (kg)</label>
              <input 
                type="number" 
                id="targetWeight" 
                name="targetWeight" 
                placeholder="Ví dụ: 65"
                min="30"
                max="300"
                required
              />
              <div className="form-help">
                <span id="weight-loss-display">Bạn sẽ giảm: 0 kg</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="timeframe">Thời gian đạt mục tiêu</label>
              <select id="timeframe" name="timeframe" required>
                <option value="">Chọn thời gian</option>
                <option value="1">1 tháng</option>
                <option value="2">2 tháng</option>
                <option value="3">3 tháng</option>
                <option value="6">6 tháng</option>
                <option value="12">1 năm</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weeklyGoal">Mục tiêu giảm cân mỗi tuần</label>
              <select id="weeklyGoal" name="weeklyGoal" required>
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
                  <span className="goal-value" id="current-weight-display">0 kg</span>
                </div>
                <div className="goal-item">
                  <span className="goal-label">Cân nặng mục tiêu:</span>
                  <span className="goal-value" id="target-weight-display">0 kg</span>
                </div>
                <div className="goal-item">
                  <span className="goal-label">Tổng giảm:</span>
                  <span className="goal-value" id="total-loss-display">0 kg</span>
                </div>
                <div className="goal-item">
                  <span className="goal-label">Thời gian:</span>
                  <span className="goal-value" id="timeframe-display">0 tháng</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick="prevStep()">
                ← Quay lại
              </button>
              <button type="button" className="btn btn-primary" onClick="nextStep()">
                Tiếp theo →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Step 3: Lifestyle & Preferences */}
      <section className="onboarding-step" id="step-3">
        <div className="step-container">
          <div className="step-header">
            <h2>🏃‍♀️ Lối sống & Sở thích</h2>
            <p>Giúp chúng tôi tạo kế hoạch phù hợp với bạn</p>
          </div>

          <form className="onboarding-form">
            <div className="form-group">
              <label>Loại bài tập yêu thích</label>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" name="exercises" value="cardio" />
                  <span className="checkmark">🏃‍♀️ Cardio (chạy, đạp xe)</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="exercises" value="strength" />
                  <span className="checkmark">💪 Tập tạ, thể hình</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="exercises" value="yoga" />
                  <span className="checkmark">🧘‍♀️ Yoga, pilates</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="exercises" value="swimming" />
                  <span className="checkmark">🏊‍♀️ Bơi lội</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="exercises" value="dancing" />
                  <span className="checkmark">💃 Nhảy múa</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Chế độ ăn ưa thích</label>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" name="diets" value="low-carb" />
                  <span className="checkmark">🥑 Low-carb</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="diets" value="vegetarian" />
                  <span className="checkmark">🥬 Ăn chay</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="diets" value="mediterranean" />
                  <span className="checkmark">🐟 Địa Trung Hải</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="diets" value="intermittent" />
                  <span className="checkmark">⏰ Nhịn ăn gián đoạn</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cookingTime">Thời gian nấu ăn mỗi ngày</label>
              <select id="cookingTime" name="cookingTime" required>
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
              <select id="budget" name="budget" required>
                <option value="">Chọn ngân sách</option>
                <option value="low">Tiết kiệm (50-100k/ngày)</option>
                <option value="medium">Trung bình (100-200k/ngày)</option>
                <option value="high">Cao cấp (200k+/ngày)</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick="prevStep()">
                ← Quay lại
              </button>
              <button type="button" className="btn btn-primary" onClick="nextStep()">
                Tiếp theo →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Step 4: Personal Plan */}
      <section className="onboarding-step" id="step-4">
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
                  <span className="plan-value" id="summary-current">0 kg</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Cân nặng mục tiêu:</span>
                  <span className="plan-value" id="summary-target">0 kg</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Tổng giảm:</span>
                  <span className="plan-value" id="summary-total">0 kg</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Thời gian:</span>
                  <span className="plan-value" id="summary-time">0 tháng</span>
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
                  <span className="plan-value" id="summary-calories">0 kcal</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Protein:</span>
                  <span className="plan-value" id="summary-protein">0g</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Carbohydrate:</span>
                  <span className="plan-value" id="summary-carbs">0g</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Chất béo:</span>
                  <span className="plan-value" id="summary-fat">0g</span>
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
                  <span className="plan-value" id="summary-frequency">0 lần/tuần</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Thời gian:</span>
                  <span className="plan-value" id="summary-duration">0 phút</span>
                </div>
                <div className="plan-item">
                  <span className="plan-label">Loại bài tập:</span>
                  <span className="plan-value" id="summary-exercises">-</span>
                </div>
              </div>
            </div>
          </div>

          <div className="plan-actions">
            <button type="button" className="btn btn-outline" onClick="prevStep()">
              ← Quay lại
            </button>
            <button type="button" className="btn btn-primary btn-large" onClick="completeOnboarding()">
              ✅ Hoàn thành & Tạo tài khoản
            </button>
          </div>
        </div>
      </section>

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
