export default function HomePage() {
  return (
    <div className="homepage">
      {/* Header Navigation */}
      <header className="header">
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-logo">
              <div className="logo-icon">🏥</div>
              <span className="logo-text">HoangLinh</span>
            </div>
            
            <ul className="nav-menu">
              <li><a href="#features" className="nav-link">Tính năng</a></li>
              <li><a href="#success" className="nav-link">Thành công</a></li>
              <li><a href="#pricing" className="nav-link">Gói cước</a></li>
              <li><a href="#contact" className="nav-link">Liên hệ</a></li>
            </ul>
            
                                <div className="nav-buttons">
                      <a href="/bmi" className="btn btn-outline">📊 Tính BMI</a>
                      <a href="/onboarding" className="btn btn-primary">🚀 Bắt đầu</a>
                      <a href="/dashboard" className="btn btn-outline">🏠 Dashboard</a>
                    </div>
          </div>
        </nav>
      </header>

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
                      <a href="/onboarding" className="btn btn-primary btn-large">🚀 Bắt đầu hành trình</a>
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

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">20,000+</div>
            <div className="stat-label">Người dùng thành công</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">98%</div>
            <div className="stat-label">Tỷ lệ thành công</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div className="stat-number">-8kg</div>
            <div className="stat-label">Giảm cân trung bình</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🕒</div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">Hỗ trợ khách hàng</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Tính năng nổi bật</h2>
            <p className="section-description">
              Giải pháp toàn diện cho hành trình giảm cân khoa học và hiệu quả
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Coaching thông minh</h3>
              <p>Tư vấn dinh dưỡng và tập luyện cá nhân hóa dựa trên dữ liệu sức khỏe thực tế</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Tư vấn Bác sĩ chuyên môn</h3>
              <p>Kết nối trực tiếp với bác sĩ chuyên khoa dinh dưỡng và nội tiết</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Theo dõi tiến độ chi tiết</h3>
              <p>Biểu đồ trực quan theo dõi cân nặng, calo và hoạt động hàng ngày</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Đồng bộ thiết bị sức khỏe</h3>
              <p>Kết nối Apple Health, Google Fit để theo dõi sức khỏe toàn diện</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Kế hoạch dinh dưỡng cá nhân</h3>
              <p>Thực đơn cá nhân hóa theo mục tiêu, sở thích và tình trạng sức khỏe</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3>Chương trình tập luyện tùy chỉnh</h3>
              <p>Bài tập phù hợp với thể trạng, mục tiêu và thời gian của bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success" className="success">
        <div className="success-container">
          <div className="section-header">
            <h2 className="section-title">Câu chuyện thành công</h2>
            <p className="section-description">
              Hàng nghìn người đã thay đổi cuộc sống với HoangLinh
            </p>
          </div>
          
          <div className="success-grid">
            <div className="success-card">
              <div className="success-avatar">👩‍💼</div>
              <h3>Nguyễn Thị Mai</h3>
              <div className="success-info">32 tuổi • 3 tháng</div>
              <div className="success-result">-8kg</div>
              <p className="success-story">"Từ 75kg xuống 67kg, tôi cảm thấy tự tin và khỏe mạnh hơn bao giờ hết!"</p>
            </div>
            
            <div className="success-card">
              <div className="success-avatar">👨‍💻</div>
              <h3>Trần Văn Nam</h3>
              <div className="success-info">28 tuổi • 2 tháng</div>
              <div className="success-result">-6kg</div>
              <p className="success-story">"AI coaching giúp tôi hiểu rõ về dinh dưỡng và có thói quen tập luyện tốt."</p>
            </div>
            
            <div className="success-card">
              <div className="success-avatar">👩‍⚕️</div>
              <h3>Lê Thị Hoa</h3>
              <div className="success-info">35 tuổi • 4 tháng</div>
              <div className="success-result">-10kg</div>
              <p className="success-story">"Kết hợp với bác sĩ tư vấn, tôi đã đạt được mục tiêu giảm cân một cách an toàn."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2>Sẵn sàng thay đổi cuộc sống? 🚀</h2>
          <p>
            Tham gia cùng hàng nghìn người đã thành công trong hành trình giảm cân. 
            Bắt đầu ngay hôm nay để nhận kế hoạch miễn phí!
          </p>
          <div className="cta-buttons">
            <a href="/onboarding" className="btn btn-white btn-large">🎯 Bắt đầu hành trình</a>
            <a href="/bmi" className="btn btn-outline-white btn-large">📊 Tính BMI ngay</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">🏥</div>
              <span>HoangLinh</span>
            </div>
            <p>
              Giải pháp chăm sóc sức khỏe thông minh hàng đầu Việt Nam, 
              giúp mọi người đạt được mục tiêu sức khỏe một cách khoa học và hiệu quả.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Tính năng</h4>
            <ul>
              <li><a href="#">AI Coaching</a></li>
              <li><a href="#">Tư vấn Bác sĩ</a></li>
              <li><a href="#">Theo dõi tiến độ</a></li>
              <li><a href="#">Đồng bộ thiết bị</a></li>
              <li><a href="#">Kế hoạch dinh dưỡng</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <ul>
              <li>📧 info@hoanglinh.com</li>
              <li>📞 1900-xxxx</li>
              <li>🏢 Hà Nội, Việt Nam</li>
              <li>🕒 Hỗ trợ 24/7</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 Hoang Linh Medicine. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  )
}
