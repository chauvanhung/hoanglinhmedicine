'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">
              <div className="logo-symbol">🏥</div>
            </div>
            <span>Hoang Linh Medicine</span>
          </div>
          <p className="footer-description">
            Ứng dụng chăm sóc sức khỏe, giảm cân khoa học với AI và chuyên gia y tế hàng đầu Việt Nam.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H6.721c-.537 0-.97.433-.97.97v7.558c0 .537.433.97.97.97h9.558c.537 0 .97-.433.97-.97V8.177c0-.537-.433-.97-.97-.97z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Dịch vụ</h4>
          <ul>
            <li><a href="/bmi">📊 Tính BMI</a></li>
            <li><a href="/dashboard">📈 Dashboard</a></li>
            <li><a href="/health">❤️ Apple Health</a></li>
            <li><a href="/progress">📋 Theo dõi tiến độ</a></li>
            <li><a href="/consultations">👨‍⚕️ Tư vấn bác sĩ</a></li>
            <li><a href="/chat">🤖 Chat với AI</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Gói cước</h4>
          <ul>
            <li><a href="/pricing">💎 Gói Cơ Bản</a></li>
            <li><a href="/pricing">⭐ Gói Premium</a></li>
            <li><a href="/pricing">👑 Gói VIP</a></li>
            <li><a href="/billing">💳 Thanh toán</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="/contact">📞 Liên hệ</a></li>
            <li><a href="/help">❓ Trợ giúp</a></li>
            <li><a href="/privacy">🔒 Chính sách bảo mật</a></li>
            <li><a href="/terms">📄 Điều khoản sử dụng</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-links">
            <a href="/privacy">Bảo mật</a>
            <a href="/terms">Điều khoản</a>
            <a href="/contact">Liên hệ</a>
          </div>
          <p>&copy; 2024 Hoang Linh Medicine. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
