export default function AdminPage() {
  return (
    <div className="page-background">
      <div className="page-container">
        {/* Admin Dashboard */}
        <section className="admin-section">
          <div className="admin-container">
            {/* Quick Stats */}
            <div className="admin-stats">
              <div className="stat-card primary">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">1,247</div>
                  <div className="stat-label">Tổng người dùng</div>
                  <div className="stat-change positive">↑ 12% tháng này</div>
                </div>
              </div>
              
              <div className="stat-card success">
                <div className="stat-icon">💳</div>
                <div className="stat-content">
                  <div className="stat-number">856</div>
                  <div className="stat-label">Gói trả phí</div>
                  <div className="stat-change positive">↑ 8% tháng này</div>
                </div>
              </div>
              
              <div className="stat-card info">
                <div className="stat-content">
                  <div className="stat-number">2,847,500</div>
                  <div className="stat-label">Doanh thu (VNĐ)</div>
                  <div className="stat-change positive">↑ 15% tháng này</div>
                </div>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">73%</div>
                  <div className="stat-label">Tỷ lệ thành công</div>
                  <div className="stat-change positive">↑ 5% tháng này</div>
                </div>
              </div>
            </div>

            {/* Admin Navigation */}
            <div className="admin-nav">
              <h2>🚀 Quản lý hệ thống</h2>
              <div className="nav-grid">
                <a href="#users" className="nav-card">
                  <div className="nav-icon">👥</div>
                  <h3>Quản lý người dùng</h3>
                  <p>Xem, chỉnh sửa và quản lý tài khoản người dùng</p>
                </a>
                
                <a href="#coaches" className="nav-card">
                  <div className="nav-icon">👨‍⚕️</div>
                  <h3>Quản lý bác sĩ/Coach</h3>
                  <p>Quản lý đội ngũ tư vấn và chuyên gia</p>
                </a>
                
                <a href="#subscriptions" className="nav-card">
                  <div className="nav-icon">💳</div>
                  <h3>Gói dịch vụ</h3>
                  <p>Cấu hình và quản lý các gói dịch vụ</p>
                </a>
                
                <a href="#payments" className="nav-card">
                  <div className="nav-icon">💰</div>
                  <h3>Thanh toán</h3>
                  <p>Theo dõi giao dịch và quản lý thanh toán</p>
                </a>
                
                <a href="#analytics" className="nav-card">
                  <div className="nav-icon">📊</div>
                  <h3>Phân tích dữ liệu</h3>
                  <p>Báo cáo và thống kê chi tiết</p>
                </a>
                
                <a href="#settings" className="nav-card">
                  <div className="nav-icon">⚙️</div>
                  <h3>Cài đặt hệ thống</h3>
                  <p>Cấu hình chung và tùy chỉnh</p>
                </a>
              </div>
            </div>

            {/* Recent Users */}
            <div className="recent-users">
              <h2>👥 Người dùng mới nhất</h2>
              <div className="users-table">
                <div className="table-header">
                  <div className="header-cell">Người dùng</div>
                  <div className="header-cell">Gói dịch vụ</div>
                  <div className="header-cell">Ngày tham gia</div>
                  <div className="header-cell">Trạng thái</div>
                  <div className="header-cell">Hành động</div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                      <h4>Nguyễn Thị B</h4>
                      <p>nguyenthib@email.com</p>
                    </div>
                  </div>
                  <div className="table-cell">Gói Pro</div>
                  <div className="table-cell">Hôm nay</div>
                  <div className="table-cell">
                    <span className="status-badge active">🟢 Hoạt động</span>
                  </div>
                  <div className="table-cell">
                    <button className="btn btn-outline btn-small">👁️ Xem</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                      <h4>Trần Văn C</h4>
                      <p>tranvanc@email.com</p>
                    </div>
                  </div>
                  <div className="table-cell">Gói Cơ bản</div>
                  <div className="table-cell">Hôm qua</div>
                  <div className="table-cell">
                    <span className="status-badge pending">🟡 Chờ xác nhận</span>
                  </div>
                  <div className="table-cell">
                    <button className="btn btn-outline btn-small">👁️ Xem</button>
                  </div>
                </div>
                
                <div className="table-row">
                  <div className="table-cell user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                      <h4>Lê Thị D</h4>
                      <p>lethid@email.com</p>
                    </div>
                  </div>
                  <div className="table-cell">Gói Premium</div>
                  <div className="table-cell">2 ngày trước</div>
                  <div className="table-cell">
                    <span className="status-badge active">🟢 Hoạt động</span>
                  </div>
                  <div className="table-cell">
                    <button className="btn btn-outline btn-small">👁️ Xem</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Overview */}
            <div className="revenue-overview">
              <h2>💰 Tổng quan doanh thu</h2>
              <div className="revenue-grid">
                <div className="revenue-card">
                  <h3>Doanh thu tháng này</h3>
                  <div className="revenue-amount">2,847,500 VNĐ</div>
                  <div className="revenue-change positive">↑ 15% so với tháng trước</div>
                  <div className="revenue-chart">
                    <div className="chart-bar bar-1"></div>
                    <div className="chart-bar bar-2"></div>
                    <div className="chart-bar bar-3"></div>
                    <div className="chart-bar bar-4"></div>
                  </div>
                </div>
                
                <div className="revenue-card">
                  <h3>Gói dịch vụ phổ biến</h3>
                  <div className="plan-stats">
                    <div className="plan-stat">
                      <span className="plan-name">Gói Pro</span>
                      <span className="plan-count">456 người dùng</span>
                    </div>
                    <div className="plan-stat">
                      <span className="plan-name">Gói Premium</span>
                      <span className="plan-count">234 người dùng</span>
                    </div>
                    <div className="plan-stat">
                      <span className="plan-name">Gói Cơ bản</span>
                      <span className="plan-count">557 người dùng</span>
                    </div>
                  </div>
                </div>
                
                <div className="revenue-card">
                  <h3>Tỷ lệ chuyển đổi</h3>
                  <div className="conversion-stats">
                    <div className="conversion-item">
                      <span className="conversion-label">Từ miễn phí → Pro</span>
                      <span className="conversion-rate">23%</span>
                    </div>
                    <div className="conversion-item">
                      <span className="conversion-label">Từ Pro → Premium</span>
                      <span className="conversion-rate">12%</span>
                    </div>
                    <div className="conversion-item">
                      <span className="conversion-label">Tỷ lệ giữ chân</span>
                      <span className="conversion-rate">87%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="system-health">
              <h2>🏥 Sức khỏe hệ thống</h2>
              <div className="health-grid">
                <div className="health-card">
                  <h3>📊 Hiệu suất</h3>
                  <div className="health-status">
                    <div className="status-indicator good">🟢</div>
                    <span>Tốt</span>
                  </div>
                  <div className="health-metrics">
                    <div className="metric">
                      <span>Response Time:</span>
                      <span>120ms</span>
                    </div>
                    <div className="metric">
                      <span>Uptime:</span>
                      <span>99.9%</span>
                    </div>
                    <div className="metric">
                      <span>CPU Usage:</span>
                      <span>45%</span>
                    </div>
                  </div>
                </div>
                
                <div className="health-card">
                  <h3>🗄️ Cơ sở dữ liệu</h3>
                  <div className="health-status">
                    <div className="status-indicator good">🟢</div>
                    <span>Hoạt động</span>
                  </div>
                  <div className="health-metrics">
                    <div className="metric">
                      <span>Connections:</span>
                      <span>24/50</span>
                    </div>
                    <div className="metric">
                      <span>Storage:</span>
                      <span>2.4GB/10GB</span>
                    </div>
                    <div className="metric">
                      <span>Backup:</span>
                      <span>2 giờ trước</span>
                    </div>
                  </div>
                </div>
                
                <div className="health-card">
                  <h3>🔐 Bảo mật</h3>
                  <div className="health-status">
                    <div className="status-indicator good">🟢</div>
                    <span>An toàn</span>
                  </div>
                  <div className="health-metrics">
                    <div className="metric">
                      <span>SSL Status:</span>
                      <span>Valid</span>
                    </div>
                    <div className="metric">
                      <span>Firewall:</span>
                      <span>Active</span>
                    </div>
                    <div className="metric">
                      <span>Last Scan:</span>
                      <span>1 giờ trước</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="recent-activities">
              <h2>📝 Hoạt động gần đây</h2>
              <div className="activities-list">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <h4>Người dùng mới đăng ký</h4>
                    <p>Nguyễn Thị B đã đăng ký gói Pro</p>
                    <span className="activity-time">5 phút trước</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">💳</div>
                  <div className="activity-content">
                    <h4>Thanh toán thành công</h4>
                    <p>Giao dịch #TXN-2024-001 đã hoàn tất</p>
                    <span className="activity-time">15 phút trước</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">📊</div>
                  <div className="activity-content">
                    <h4>Báo cáo được tạo</h4>
                    <p>Báo cáo thống kê tháng 12 đã được tạo</p>
                    <span className="activity-time">1 giờ trước</span>
                  </div>
                </div>
                
                <div className="activity-item">
                  <div className="activity-icon">🔧</div>
                  <div className="activity-content">
                    <h4>Hệ thống được cập nhật</h4>
                    <p>Phiên bản 2.1.0 đã được triển khai</p>
                    <span className="activity-time">2 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>⚡ Hành động nhanh</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">📧</span>
                  <span>Gửi thông báo</span>
                </button>
                
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>Tạo báo cáo</span>
                </button>
                
                <button className="action-btn">
                  <span className="action-icon">👥</span>
                  <span>Thêm người dùng</span>
                </button>
                
                <button className="action-btn">
                  <span className="action-icon">💳</span>
                  <span>Quản lý gói</span>
                </button>
                
                <button className="action-btn">
                  <span className="action-icon">🔧</span>
                  <span>Cài đặt hệ thống</span>
                </button>
                
                <button className="action-btn">
                  <span className="action-icon">📈</span>
                  <span>Xem analytics</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
