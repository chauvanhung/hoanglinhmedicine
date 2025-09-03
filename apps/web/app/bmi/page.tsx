'use client'

import { useState } from 'react'

export default function BMIPage() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('📊')
  const [calorieRecommendation, setCalorieRecommendation] = useState('')
  const [waterRecommendation, setWaterRecommendation] = useState('')
  const [exerciseRecommendation, setExerciseRecommendation] = useState('')

  const calculateBMI = () => {
    if (!height || !weight) return
    
    const heightM = parseFloat(height) / 100
    const weightKg = parseFloat(weight)
    const bmiValue = weightKg / (heightM * heightM)
    
    setBmi(Math.round(bmiValue * 10) / 10)
    
    // Phân loại BMI
    if (bmiValue < 18.5) {
      setCategory('Thiếu cân')
      setCategoryDescription('Bạn cần tăng cân để đạt mức BMI khỏe mạnh')
      setCategoryIcon('📉')
      setCalorieRecommendation(`${Math.round(weightKg * 35)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.04)} lít/ngày`)
      setExerciseRecommendation('30 phút/ngày (nhẹ nhàng)')
    } else if (bmiValue < 25) {
      setCategory('Bình thường')
      setCategoryDescription('Chúc mừng! Bạn đang ở mức BMI lý tưởng')
      setCategoryIcon('✅')
      setCalorieRecommendation(`${Math.round(weightKg * 30)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.035)} lít/ngày`)
      setExerciseRecommendation('45 phút/ngày (vừa phải)')
    } else if (bmiValue < 30) {
      setCategory('Thừa cân')
      setCategoryDescription('Bạn cần giảm cân để đạt mức BMI khỏe mạnh')
      setCategoryIcon('⚠️')
      setCalorieRecommendation(`${Math.round(weightKg * 25)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.035)} lít/ngày`)
      setExerciseRecommendation('60 phút/ngày (cường độ cao)')
    } else if (bmiValue < 35) {
      setCategory('Béo phì độ I')
      setCategoryDescription('Bạn cần giảm cân để cải thiện sức khỏe')
      setCategoryIcon('🚨')
      setCalorieRecommendation(`${Math.round(weightKg * 20)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.04)} lít/ngày`)
      setExerciseRecommendation('45 phút/ngày (vừa phải)')
    } else if (bmiValue < 40) {
      setCategory('Béo phì độ II')
      setCategoryDescription('Bạn cần giảm cân dưới sự giám sát y tế')
      setCategoryIcon('🚨')
      setCalorieRecommendation(`${Math.round(weightKg * 18)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.04)} lít/ngày`)
      setExerciseRecommendation('30 phút/ngày (nhẹ nhàng)')
    } else {
      setCategory('Béo phì độ III')
      setCategoryDescription('Bạn cần can thiệp y tế để giảm cân')
      setCategoryIcon('🚨')
      setCalorieRecommendation(`${Math.round(weightKg * 15)} kcal/ngày`)
      setWaterRecommendation(`${Math.round(weightKg * 0.04)} lít/ngày`)
      setExerciseRecommendation('20 phút/ngày (rất nhẹ)')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBMI()
  }

  return (
    <div className="page-background">
      <div className="page-container">
        {/* BMI Calculator */}
        <section className="bmi-section">
          <div className="calculator-container">
            <div className="calculator-card">
              <div className="calculator-header">
                <div className="calculator-icon">⚖️</div>
                <h2 className="page-title">Tính BMI của bạn</h2>
                <p className="page-subtitle">Nhập thông tin để nhận kết quả chính xác</p>
              </div>

              <form className="bmi-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="height">Chiều cao (cm)</label>
                  <input 
                    type="number" 
                    id="height" 
                    name="height" 
                    placeholder="Ví dụ: 170"
                    min="100"
                    max="250"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Cân nặng (kg)</label>
                  <input 
                    type="number" 
                    id="weight" 
                    name="weight" 
                    placeholder="Ví dụ: 65"
                    min="30"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="calculate-btn">
                  🧮 Tính BMI ngay
                </button>
              </form>
            </div>

            {/* BMI Result Display */}
            {bmi && (
              <div className="result-card" id="bmi-result">
                <div className="result-header">
                  <h3>Kết quả BMI của bạn</h3>
                  <div className="bmi-score">
                    <span className="score-number" id="bmi-number">{bmi}</span>
                    <span className="score-label">BMI</span>
                  </div>
                </div>

                <div className="bmi-category">
                  <div className="category-icon" id="category-icon">{categoryIcon}</div>
                  <div className="category-info">
                    <h4 id="category-title">{category}</h4>
                    <p id="category-description">{categoryDescription}</p>
                  </div>
                </div>

                <div className="bmi-recommendations">
                  <h4>Khuyến nghị dinh dưỡng</h4>
                  <div className="recommendation-item">
                    <div className="rec-icon">🍽️</div>
                    <div className="rec-content">
                      <h5>Lượng calo khuyến nghị</h5>
                      <p id="calorie-recommendation">{calorieRecommendation}</p>
                    </div>
                  </div>
                  
                  <div className="recommendation-item">
                    <div className="rec-icon">💧</div>
                    <div className="rec-content">
                      <h5>Lượng nước cần uống</h5>
                      <p id="water-recommendation">{waterRecommendation}</p>
                    </div>
                  </div>

                  <div className="recommendation-item">
                    <div className="rec-icon">🏃‍♀️</div>
                    <div className="rec-content">
                      <h5>Hoạt động thể chất</h5>
                      <p id="exercise-recommendation">{exerciseRecommendation}</p>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <a href="/onboarding" className="btn btn-primary">🎯 Tạo kế hoạch giảm cân</a>
                  <a href="/" className="btn btn-outline">🏠 Về trang chủ</a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BMI Information */}
        <section className="bmi-info">
          <div className="info-container">
            <h2>📚 Hiểu về chỉ số BMI</h2>
            
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">📊</div>
                <h3>BMI là gì?</h3>
                <p>Chỉ số BMI (Body Mass Index) là thước đo đánh giá tình trạng cân nặng dựa trên chiều cao và cân nặng của bạn.</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🧮</div>
                <h3>Cách tính BMI</h3>
                <p>BMI = Cân nặng (kg) / [Chiều cao (m)]²</p>
                <div className="formula-example">
                  <strong>Ví dụ:</strong> 65kg, 1.70m → BMI = 65 / (1.70)² = 22.5
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📈</div>
                <h3>Phân loại BMI</h3>
                <ul className="bmi-categories">
                  <li><span className="category underweight">Thiếu cân:</span> &lt; 18.5</li>
                  <li><span className="category normal">Bình thường:</span> 18.5 - 24.9</li>
                  <li><span className="category overweight">Thừa cân:</span> 25.0 - 29.9</li>
                  <li><span className="category obese">Béo phì:</span> ≥ 30.0</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Health Tips */}
        <section className="health-tips">
          <div className="tips-container">
            <h2>💡 Lời khuyên sức khỏe</h2>
            
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">🥗</div>
                <h3>Dinh dưỡng cân bằng</h3>
                <p>Ăn đa dạng thực phẩm, ưu tiên rau xanh, protein nạc và ngũ cốc nguyên hạt.</p>
              </div>

              <div className="tip-card">
                <div className="tip-icon">💪</div>
                <h3>Vận động thường xuyên</h3>
                <p>Tập luyện ít nhất 150 phút/tuần với cường độ vừa phải để duy trì sức khỏe.</p>
              </div>

              <div className="tip-card">
                <div className="tip-icon">😴</div>
                <h3>Ngủ đủ giấc</h3>
                <p>Ngủ 7-9 giờ mỗi đêm để cơ thể phục hồi và duy trì cân nặng khỏe mạnh.</p>
              </div>

              <div className="tip-card">
                <div className="tip-icon">💧</div>
                <h3>Uống đủ nước</h3>
                <p>Uống 2-3 lít nước mỗi ngày để hỗ trợ trao đổi chất và kiểm soát cân nặng.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bmi-cta">
          <div className="cta-container">
            <h2>🚀 Sẵn sàng thay đổi cuộc sống?</h2>
            <p>Đã biết BMI của mình? Hãy để HoangLinh giúp bạn tạo kế hoạch giảm cân khoa học!</p>
            <div className="cta-buttons">
              <a href="/onboarding" className="btn btn-primary btn-large">🎯 Bắt đầu hành trình</a>
              <a href="/" className="btn btn-secondary btn-large">🏠 Về trang chủ</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
