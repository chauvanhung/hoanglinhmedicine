export default function HomePage() {
  return (
    <div className="page-background">
      <div className="page-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                ✨ Đã giúp hơn 20,000+ người giảm cân thành công
              </div>
              
              <h1 className="hero-title">
                Giải pháp <span className="title-highlight">giảm cân</span> thông minh
              </h1>
              
              <p className="hero-description">
                Kết hợp AI thông minh, tư vấn bác sĩ chuyên môn và công nghệ theo dõi sức khỏe tiên tiến. 
                Đạt được mục tiêu giảm 5-7kg một cách an toàn và bền vững chỉ trong 3 tháng.
              </p>
              
              <div className="hero-buttons">
                <a href="/onboarding" className="btn btn-primary btn-large">�� Bắt đầu hành trình</a>
                <a href="/bmi" className="btn btn-secondary btn-large">📊 Tính BMI miễn phí</a>
                <a href="/dashboard" className="btn btn-outline btn-large">🏠 Vào Dashboard</a>
              </div>
              
              <div className="hero-trust">
                <div className="trust-item">
                  <div className="trust-icon">✅</div>
                  <span>Không cần thuốc</span>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">🔒</div>
                  <span>Bảo mật 100%</span>
                </div>
                <div className="trust-item">
                  <div className="trust-icon">🕒</div>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-icon">📊</div>
                <h3>Theo dõi tiến độ thông minh</h3>
                <p>Biểu đồ trực quan, thống kê chi tiết và phân tích xu hướng</p>
                
                <div className="progress-chart">
                  <div className="chart-bar bar-1"></div>
                  <div className="chart-bar bar-2"></div>
                  <div className="chart-bar bar-3"></div>
                  <div className="chart-bar bar-4"></div>
                </div>
                
                <div className="progress-stats">
                  <div className="stat">
                    <div className="stat-number">-2.5kg</div>
                    <div className="stat-label">Tuần 1</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">-4.8kg</div>
                    <div className="stat-label">Tuần 2</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">-6.2kg</div>
                    <div className="stat-label">Tuần 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Statistics Section */}
        <section className="success-stats">
          <div className="stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <div className="icon-bg">
                    <span className="icon-symbol">👥</span>
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-number">20,000+</div>
                  <div className="stat-label">Người dùng thành công</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <div className="icon-bg">
                    <span className="icon-symbol">🎯</span>
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Tỷ lệ thành công</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <div className="icon-bg">
                    <span className="icon-symbol">⚖️</span>
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-number">-8kg</div>
                  <div className="stat-label">Giảm cân trung bình</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <div className="icon-bg">
                    <span className="icon-symbol">🕒</span>
                  </div>
                </div>
                <div className="stat-content">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Hỗ trợ khách hàng</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-container">
            <div className="section-header">
              <h2>Tính năng nổi bật</h2>
              <p>Những công cụ mạnh mẽ giúp bạn đạt được mục tiêu giảm cân</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI Coaching</h3>
                <p>Trợ lý AI thông minh tư vấn dinh dưỡng và tập luyện cá nhân hóa</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">👨‍⚕️</div>
                <h3>Tư vấn bác sĩ</h3>
                <p>Đội ngũ bác sĩ chuyên khoa dinh dưỡng và giảm cân</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>Theo dõi sức khỏe</h3>
                <p>Đồng bộ với Apple Health và Google Fit để theo dõi toàn diện</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3>Mục tiêu thông minh</h3>
                <p>Đặt mục tiêu thực tế và theo dõi tiến độ chi tiết</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section id="success" className="success">
          <div className="success-container">
            <div className="section-header">
              <h2>Câu chuyện thành công</h2>
              <p>Những người đã thay đổi cuộc sống nhờ Hoang Linh Medicine</p>
            </div>
            
            <div className="success-grid">
              <div className="success-card">
                <div className="success-avatar">👩‍🦰</div>
                <h3>Nguyễn Thị Mai</h3>
                <p className="success-result">Giảm 15kg trong 6 tháng</p>
                <p className="success-story">"Tôi đã thử nhiều cách giảm cân nhưng không thành công. Nhờ Hoang Linh Medicine, tôi đã tìm được phương pháp phù hợp và có kết quả bền vững."</p>
              </div>
              
              <div className="success-card">
                <div className="success-avatar">👨‍🦱</div>
                <h3>Trần Văn Nam</h3>
                <p className="success-result">Giảm 12kg trong 4 tháng</p>
                <p className="success-story">"AI coaching thực sự thông minh và hiệu quả. Tôi không còn phải lo lắng về việc ăn gì và tập luyện như thế nào."</p>
              </div>
              
              <div className="success-card">
                <div className="success-avatar">👩‍🦳</div>
                <h3>Lê Thị Hoa</h3>
                <p className="success-result">Giảm 8kg trong 3 tháng</p>
                <p className="success-story">"Dịch vụ tư vấn bác sĩ rất chuyên nghiệp. Tôi cảm thấy an tâm và có động lực để tiếp tục hành trình giảm cân."</p>
              </div>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  )
}
