'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <div className="logo-symbol">🏥</div>
            </div>
            <span>Hoang Linh Medicine</span>
          </div>
          <p>Ứng dụng chăm sóc sức khỏe, giảm cân khoa học với AI và chuyên gia y tế hàng đầu Việt Nam.</p>
        </div>
        
        <div className="footer-section">
          <h4>Dịch vụ</h4>
          <ul>
            <li><a href="/bmi">Tính BMI</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/progress">Theo dõi tiến độ</a></li>
            <li><a href="/consultations">Tư vấn bác sĩ</a></li>
            <li><a href="/chat">Chat với AI</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Gói cước</h4>
          <ul>
            <li><a href="/pricing">Gói Cơ Bản</a></li>
            <li><a href="/pricing">Gói Premium</a></li>
            <li><a href="/pricing">Gói VIP</a></li>
            <li><a href="/billing">Thanh toán</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/help">Trợ giúp</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Hoang Linh Medicine. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
