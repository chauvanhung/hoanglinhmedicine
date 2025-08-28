export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <h1>Xin chào, Nguyễn Văn A!</h1>
              <p>Hôm nay là ngày thứ 15 của hành trình giảm cân</p>
            </div>
          </div>
          <div className="header-actions">
            <a href="/profile" className="btn btn-outline">⚙️ Cài đặt</a>
            <a href="/" className="btn btn-outline">🏠 Trang chủ</a>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="quick-stats">
        <div className="stats-container">
          <div className="stat-card primary">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <div className="stat-number">72.5 kg</div>
              <div className="stat-label">Cân nặng hiện tại</div>
              <div className="stat-change positive">-2.5 kg</div>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-number">65 kg</div>
              <div className="stat-label">Mục tiêu</div>
              <div className="stat-progress">75% hoàn thành</div>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">22.1</div>
              <div className="stat-label">BMI hiện tại</div>
              <div className="stat-status normal">Bình thường</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">1,850</div>
              <div className="stat-label">Calo tiêu thụ</div>
              <div className="stat-target">Mục tiêu: 2,000</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="dashboard-main">
        <div className="dashboard-container">
          {/* Progress Chart */}
          <div className="dashboard-card large">
            <div className="card-header">
              <h3>📈 Tiến độ giảm cân</h3>
              <div className="card-actions">
                <select className="time-selector">
                  <option value="7">7 ngày</option>
                  <option value="30" selected>30 ngày</option>
                  <option value="90">90 ngày</option>
                </select>
              </div>
            </div>
            <div className="card-content">
              <div className="progress-chart">
                <div className="chart-container">
                  <div className="chart-line">
                    <div className="chart-point" style={{left: '10%', bottom: '20%'}}></div>
                    <div className="chart-point" style={{left: '20%', bottom: '25%'}}></div>
                    <div className="chart-point" style={{left: '30%', bottom: '30%'}}></div>
                    <div className="chart-point" style={{left: '40%', bottom: '35%'}}></div>
                    <div className="chart-point" style={{left: '50%', bottom: '40%'}}></div>
                    <div className="chart-point" style={{left: '60%', bottom: '45%'}}></div>
                    <div className="chart-point" style={{left: '70%', bottom: '50%'}}></div>
                    <div className="chart-point" style={{left: '80%', bottom: '55%'}}></div>
                    <div className="chart-point" style={{left: '90%', bottom: '60%'}}></div>
                    <div className="chart-point" style={{left: '100%', bottom: '65%'}}></div>
                  </div>
                  <div className="chart-labels">
                    <span>Ngày 1</span>
                    <span>Ngày 30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>✅ Nhiệm vụ hôm nay</h3>
              <span className="task-progress">3/5 hoàn thành</span>
            </div>
            <div className="card-content">
              <div className="task-list">
                <div className="task-item completed">
                  <div className="task-checkbox">✓</div>
                  <div className="task-content">
                    <div className="task-title">Đo cân nặng</div>
                    <div className="task-time">8:00 AM</div>
                  </div>
                </div>
                
                <div className="task-item completed">
                  <div className="task-checkbox">✓</div>
                  <div className="task-content">
                    <div className="task-title">Uống 2 lít nước</div>
                    <div className="task-time">Cả ngày</div>
                  </div>
                </div>
                
                <div className="task-item completed">
                  <div className="task-checkbox">✓</div>
                  <div className="task-content">
                    <div className="task-title">Tập cardio 30 phút</div>
                    <div className="task-time">6:00 PM</div>
                  </div>
                </div>
                
                <div className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-content">
                    <div className="task-title">Ăn bữa tối ít calo</div>
                    <div className="task-time">7:00 PM</div>
                  </div>
                </div>
                
                <div className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-content">
                    <div className="task-title">Đi ngủ trước 11 PM</div>
                    <div className="task-time">11:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition Tracking */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🍽️ Theo dõi dinh dưỡng</h3>
              <span className="nutrition-date">Hôm nay</span>
            </div>
            <div className="card-content">
              <div className="nutrition-summary">
                <div className="nutrition-item">
                  <div className="nutrition-label">Calo đã ăn</div>
                  <div className="nutrition-value">1,250 / 2,000</div>
                  <div className="nutrition-bar">
                    <div className="nutrition-fill" style={{width: '62.5%'}}></div>
                  </div>
                </div>
                
                <div className="nutrition-item">
                  <div className="nutrition-label">Protein</div>
                  <div className="nutrition-value">85g / 120g</div>
                  <div className="nutrition-bar">
                    <div className="nutrition-fill" style={{width: '70.8%'}}></div>
                  </div>
                </div>
                
                <div className="nutrition-item">
                  <div className="nutrition-label">Carbohydrate</div>
                  <div className="nutrition-value">150g / 200g</div>
                  <div className="nutrition-bar">
                    <div className="nutrition-fill" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="nutrition-item">
                  <div className="nutrition-label">Chất béo</div>
                  <div className="nutrition-value">45g / 65g</div>
                  <div className="nutrition-bar">
                    <div className="nutrition-fill" style={{width: '69.2%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="nutrition-actions">
                <a href="/nutrition" className="btn btn-outline btn-small">📝 Ghi chép bữa ăn</a>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📱 Hoạt động gần đây</h3>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">⚖️</div>
                  <div className="activity-content">
                    <div className="activity-title">Cập nhật cân nặng</div>
                    <div className="activity-time">2 giờ trước</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🏃‍♀️</div>
                  <div className="activity-content">
                    <div className="activity-title">Hoàn thành bài tập cardio</div>
                    <div className="activity-time">4 giờ trước</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🍎</div>
                  <div className="activity-content">
                    <div className="activity-title">Ghi chép bữa trưa</div>
                    <div className="activity-time">6 giờ trước</div>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">💧</div>
                  <div className="activity-content">
                    <div className="activity-title">Đạt mục tiêu uống nước</div>
                    <div className="activity-time">8 giờ trước</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>🤖 AI Coach</h3>
              <span className="coach-status online">Trực tuyến</span>
            </div>
            <div className="card-content">
              <div className="coach-message">
                <div className="coach-avatar">🤖</div>
                <div className="message-content">
                  <p>Chào bạn! Hôm nay bạn đã hoàn thành 60% nhiệm vụ. Hãy cố gắng hoàn thành bữa tối ít calo và đi ngủ sớm nhé! 💪</p>
                </div>
              </div>
              
              <div className="coach-actions">
                <a href="/chat" className="btn btn-primary btn-small">💬 Chat với AI</a>
                <a href="/tips" className="btn btn-outline btn-small">💡 Lời khuyên</a>
              </div>
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📅 Mục tiêu tuần này</h3>
              <span className="week-progress">Tuần 3</span>
            </div>
            <div className="card-content">
              <div className="weekly-goals">
                <div className="goal-item">
                  <div className="goal-icon">⚖️</div>
                  <div className="goal-content">
                    <div className="goal-title">Giảm 0.5kg</div>
                    <div className="goal-status in-progress">Đang thực hiện</div>
                  </div>
                </div>
                
                <div className="goal-item">
                  <div className="goal-icon">🏃‍♀️</div>
                  <div className="goal-content">
                    <div className="goal-title">Tập luyện 5 ngày</div>
                    <div className="goal-status completed">Hoàn thành</div>
                  </div>
                </div>
                
                <div className="goal-item">
                  <div className="goal-icon">🍽️</div>
                  <div className="goal-content">
                    <div className="goal-title">Ăn đúng calo mục tiêu</div>
                    <div className="goal-status in-progress">Đang thực hiện</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="actions-container">
          <a href="/nutrition" className="action-card">
            <div className="action-icon">🍽️</div>
            <div className="action-title">Ghi chép bữa ăn</div>
          </a>
          
          <a href="/exercise" className="action-card">
            <div className="action-icon">💪</div>
            <div className="action-title">Ghi chép tập luyện</div>
          </a>
          
          <a href="/measurements" className="action-card">
            <div className="action-icon">📏</div>
            <div className="action-title">Cập nhật số đo</div>
          </a>
          
          <a href="/chat" className="action-card">
            <div className="action-icon">💬</div>
            <div className="action-title">Chat với AI</div>
          </a>
          
          <a href="/consultation" className="action-card">
            <div className="action-icon">👨‍⚕️</div>
            <div className="action-title">Đặt lịch bác sĩ</div>
          </a>
          
          <a href="/progress" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-title">Xem tiến độ chi tiết</div>
          </a>
        </div>
      </section>
    </div>
  )
}
