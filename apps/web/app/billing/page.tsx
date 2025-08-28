export default function BillingPage() {
  return (
    <div className="billing-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <a href="/dashboard" className="back-link">← Quay lại Dashboard</a>
          <h1>💳 Quản lý thanh toán & Gói dịch vụ</h1>
          <p>Quản lý gói dịch vụ, thanh toán và lịch sử giao dịch</p>
        </div>
      </header>

      {/* Billing Content */}
      <section className="billing-content">
        <div className="billing-container">
          {/* Current Subscription */}
          <div className="current-subscription">
            <h2>🎯 Gói dịch vụ hiện tại</h2>
            <div className="subscription-card active">
              <div className="subscription-header">
                <div className="subscription-icon">⭐</div>
                <div className="subscription-info">
                  <h3>Gói Pro - Tư vấn bác sĩ</h3>
                  <p>Gói dịch vụ cao cấp với tư vấn bác sĩ chuyên môn</p>
                </div>
                <div className="subscription-status">
                  <span className="status-badge active">🟢 Đang hoạt động</span>
                </div>
              </div>
              
              <div className="subscription-details">
                <div className="detail-item">
                  <span className="detail-label">Giá:</span>
                  <span className="detail-value">2,500,000 VNĐ/tháng</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ngày bắt đầu:</span>
                  <span className="detail-value">01/12/2024</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ngày gia hạn:</span>
                  <span className="detail-value">01/01/2025</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phương thức thanh toán:</span>
                  <span className="detail-value">💳 Visa ****1234</span>
                </div>
              </div>
              
              <div className="subscription-features">
                <h4>✨ Tính năng bao gồm:</h4>
                <div className="features-grid">
                  <div className="feature-item">
                    <span className="feature-icon">🤖</span>
                    <span>AI Coach không giới hạn</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">👨‍⚕️</span>
                    <span>2 buổi tư vấn bác sĩ/tháng</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📊</span>
                    <span>Báo cáo chi tiết nâng cao</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📱</span>
                    <span>Đồng bộ thiết bị không giới hạn</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📧</span>
                    <span>Hỗ trợ ưu tiên 24/7</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <span>Kế hoạch dinh dưỡng cá nhân hóa</span>
                  </div>
                </div>
              </div>
              
              <div className="subscription-actions">
                <button className="btn btn-outline">🔄 Gia hạn sớm</button>
                <button className="btn btn-outline">📝 Thay đổi gói</button>
                <button className="btn btn-danger">❌ Hủy gói</button>
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="available-plans">
            <h2>📦 Gói dịch vụ có sẵn</h2>
            <div className="plans-grid">
              <div className="plan-card">
                <div className="plan-header">
                  <h3>🚀 Gói Cơ bản</h3>
                  <div className="plan-price">
                    <span className="price">Miễn phí</span>
                    <span className="duration">/ vĩnh viễn</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>BMI Calculator</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Theo dõi cơ bản</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>AI Coach (5 câu hỏi/ngày)</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Mục tiêu đơn giản</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">❌</span>
                    <span>Tư vấn bác sĩ</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">❌</span>
                    <span>Báo cáo nâng cao</span>
                  </div>
                </div>
                
                <button className="btn btn-outline">Gói hiện tại</button>
              </div>

              <div className="plan-card popular">
                <div className="plan-badge">🔥 Phổ biến</div>
                <div className="plan-header">
                  <h3>⭐ Gói Pro</h3>
                  <div className="plan-price">
                    <span className="price">2,500,000 VNĐ</span>
                    <span className="duration">/ tháng</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Tất cả tính năng cơ bản</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>AI Coach không giới hạn</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>2 buổi tư vấn bác sĩ/tháng</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Báo cáo chi tiết</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Kế hoạch dinh dưỡng cá nhân hóa</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Hỗ trợ ưu tiên</span>
                  </div>
                </div>
                
                <button className="btn btn-primary">Gói hiện tại</button>
              </div>

              <div className="plan-card">
                <div className="plan-header">
                  <h3>👑 Gói Premium</h3>
                  <div className="plan-price">
                    <span className="price">5,000,000 VNĐ</span>
                    <span className="duration">/ tháng</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Tất cả tính năng Pro</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>5 buổi tư vấn bác sĩ/tháng</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Coach cá nhân 1-1</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Xét nghiệm sức khỏe định kỳ</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Thực đơn dinh dưỡng hàng tuần</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✅</span>
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
                
                <button className="btn btn-outline">Nâng cấp</button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods">
            <h2>💳 Phương thức thanh toán</h2>
            <div className="payment-container">
              <div className="current-payment">
                <h3>Phương thức hiện tại</h3>
                <div className="payment-card">
                  <div className="card-info">
                    <div className="card-icon">💳</div>
                    <div className="card-details">
                      <h4>Visa ****1234</h4>
                      <p>Hết hạn: 12/25</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-outline btn-small">✏️ Chỉnh sửa</button>
                    <button className="btn btn-outline btn-small">❌ Xóa</button>
                  </div>
                </div>
              </div>
              
              <div className="add-payment">
                <h3>Thêm phương thức mới</h3>
                <div className="payment-options">
                  <button className="payment-option">
                    <span className="option-icon">💳</span>
                    <span>Thẻ tín dụng/ghi nợ</span>
                  </button>
                  <button className="payment-option">
                    <span className="option-icon">🏦</span>
                    <span>Chuyển khoản ngân hàng</span>
                  </button>
                  <button className="payment-option">
                    <span className="option-icon">📱</span>
                    <span>Ví điện tử (Momo, ZaloPay)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="billing-history">
            <h2>📋 Lịch sử thanh toán</h2>
            <div className="history-container">
              <div className="history-filters">
                <select className="filter-select">
                  <option>Tất cả giao dịch</option>
                  <option>Thành công</option>
                  <option>Thất bại</option>
                  <option>Đang xử lý</option>
                </select>
                <input type="date" className="filter-date" />
                <button className="btn btn-outline">🔍 Lọc</button>
              </div>
              
              <div className="transactions-list">
                <div className="transaction-item success">
                  <div className="transaction-icon">✅</div>
                  <div className="transaction-details">
                    <h4>Gói Pro - Tháng 12/2024</h4>
                    <p>📅 01/12/2024 | 💳 Visa ****1234</p>
                    <p>📝 Gia hạn gói dịch vụ hàng tháng</p>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount">2,500,000 VNĐ</span>
                    <span className="status success">Thành công</span>
                  </div>
                  <div className="transaction-actions">
                    <button className="btn btn-outline btn-small">📄 Hóa đơn</button>
                  </div>
                </div>

                <div className="transaction-item success">
                  <div className="transaction-icon">✅</div>
                  <div className="transaction-details">
                    <h4>Gói Pro - Tháng 11/2024</h4>
                    <p>📅 01/11/2024 | 💳 Visa ****1234</p>
                    <p>📝 Gia hạn gói dịch vụ hàng tháng</p>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount">2,500,000 VNĐ</span>
                    <span className="status success">Thành công</span>
                  </div>
                  <div className="transaction-actions">
                    <button className="btn btn-outline btn-small">📄 Hóa đơn</button>
                  </div>
                </div>

                <div className="transaction-item success">
                  <div className="transaction-icon">✅</div>
                  <div className="transaction-details">
                    <h4>Gói Pro - Tháng 10/2024</h4>
                    <p>📅 01/10/2024 | 💳 Visa ****1234</p>
                    <p>📝 Đăng ký gói dịch vụ mới</p>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount">2,500,000 VNĐ</span>
                    <span className="status success">Thành công</span>
                  </div>
                  <div className="transaction-actions">
                    <button className="btn btn-outline btn-small">📄 Hóa đơn</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices */}
          <div className="invoices-section">
            <h2>📄 Hóa đơn & Biên lai</h2>
            <div className="invoices-grid">
              <div className="invoice-card">
                <div className="invoice-header">
                  <h4>Hóa đơn #INV-2024-001</h4>
                  <span className="invoice-date">01/12/2024</span>
                </div>
                <div className="invoice-details">
                  <p>Gói Pro - Tháng 12/2024</p>
                  <p>Phương thức: Visa ****1234</p>
                  <p>Trạng thái: Đã thanh toán</p>
                </div>
                <div className="invoice-amount">
                  <span className="amount">2,500,000 VNĐ</span>
                </div>
                <div className="invoice-actions">
                  <button className="btn btn-outline btn-small">📥 Tải PDF</button>
                  <button className="btn btn-outline btn-small">📧 Gửi email</button>
                </div>
              </div>

              <div className="invoice-card">
                <div className="invoice-header">
                  <h4>Hóa đơn #INV-2024-002</h4>
                  <span className="invoice-date">01/11/2024</span>
                </div>
                <div className="invoice-details">
                  <p>Gói Pro - Tháng 11/2024</p>
                  <p>Phương thức: Visa ****1234</p>
                  <p>Trạng thái: Đã thanh toán</p>
                </div>
                <div className="invoice-amount">
                  <span className="amount">2,500,000 VNĐ</span>
                </div>
                <div className="invoice-actions">
                  <button className="btn btn-outline btn-small">📥 Tải PDF</button>
                  <button className="btn btn-outline btn-small">📧 Gửi email</button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Support */}
          <div className="billing-support">
            <h2>❓ Cần hỗ trợ?</h2>
            <div className="support-container">
              <div className="support-card">
                <div className="support-icon">📞</div>
                <h4>Gọi điện hỗ trợ</h4>
                <p>Gọi trực tiếp đến hotline: 1900-xxxx</p>
                <button className="btn btn-primary">📞 Gọi ngay</button>
              </div>
              
              <div className="support-card">
                <div className="support-icon">💬</div>
                <h4>Chat với nhân viên</h4>
                <p>Chat trực tuyến với nhân viên hỗ trợ</p>
                <button className="btn btn-primary">💬 Bắt đầu chat</button>
              </div>
              
              <div className="support-card">
                <div className="support-icon">📧</div>
                <h4>Gửi email</h4>
                <p>Gửi email đến: support@hoanglinh.com</p>
                <button className="btn btn-primary">📧 Gửi email</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
