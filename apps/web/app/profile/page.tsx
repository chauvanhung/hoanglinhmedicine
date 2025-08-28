export default function ProfilePage() {
  return (
    <div className="profile-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <a href="/dashboard" className="back-link">← Quay lại Dashboard</a>
          <h1>👤 Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
      </header>

      {/* Profile Content */}
      <section className="profile-content">
        <div className="profile-container">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-image">👤</div>
                <button className="avatar-edit">📷</button>
              </div>
              <div className="profile-info">
                <h2>Nguyễn Văn A</h2>
                <p>nguyenvana@email.com</p>
                <span className="member-since">Thành viên từ tháng 12/2024</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">15</div>
                <div className="stat-label">Ngày tham gia</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">-2.5kg</div>
                <div className="stat-label">Đã giảm</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">85%</div>
                <div className="stat-label">Hoàn thành mục tiêu</div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="info-section">
            <h3>📋 Thông tin cá nhân</h3>
            <div className="info-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" value="Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value="nguyenvana@email.com" disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input type="date" value="1990-05-15" />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chiều cao (cm)</label>
                  <input type="number" value="170" />
                </div>
                <div className="form-group">
                  <label>Cân nặng hiện tại (kg)</label>
                  <input type="number" value="75" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vòng bụng (cm)</label>
                  <input type="number" value="85" />
                </div>
                <div className="form-group">
                  <label>Mức độ hoạt động</label>
                  <select>
                    <option>Ít vận động</option>
                    <option>Vận động nhẹ</option>
                    <option>Vận động vừa phải</option>
                    <option>Vận động nhiều</option>
                    <option>Vận động rất nhiều</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-outline">❌ Hủy</button>
                <button className="btn btn-primary">💾 Lưu thay đổi</button>
              </div>
            </div>
          </div>

          {/* Health Goals */}
          <div className="goals-section">
            <h3>🎯 Mục tiêu sức khỏe</h3>
            <div className="goals-grid">
              <div className="goal-card">
                <div className="goal-header">
                  <div className="goal-icon">⚖️</div>
                  <h4>Mục tiêu cân nặng</h4>
                </div>
                <div className="goal-content">
                  <div className="goal-current">75 kg</div>
                  <div className="goal-target">68 kg</div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '35%'}}></div>
                    </div>
                    <span>35% hoàn thành</span>
                  </div>
                </div>
              </div>

              <div className="goal-card">
                <div className="goal-header">
                  <div className="goal-icon">📅</div>
                  <h4>Thời gian mục tiêu</h4>
                </div>
                <div className="goal-content">
                  <div className="goal-date">15/12/2024 - 15/03/2025</div>
                  <div className="goal-remaining">Còn 75 ngày</div>
                  <div className="goal-rate">Tốc độ: -0.33 kg/tuần</div>
                </div>
              </div>

              <div className="goal-card">
                <div className="goal-header">
                  <div className="goal-icon">🏃‍♂️</div>
                  <h4>Hoạt động thể chất</h4>
                </div>
                <div className="goal-content">
                  <div className="goal-target">150 phút/tuần</div>
                  <div className="goal-current">120 phút/tuần</div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '80%'}}></div>
                    </div>
                    <span>80% hoàn thành</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="settings-section">
            <h3>⚙️ Cài đặt tài khoản</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Thông báo</h4>
                  <p>Nhận thông báo về mục tiêu và tiến độ</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Đồng bộ thiết bị</h4>
                  <p>Tự động đồng bộ dữ liệu từ Apple Health/Google Fit</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Chế độ riêng tư</h4>
                  <p>Chia sẻ dữ liệu với bác sĩ/coach</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Ngôn ngữ</h4>
                  <p>Tiếng Việt</p>
                </div>
                <select className="setting-select">
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="danger-zone">
            <h3>⚠️ Khu vực nguy hiểm</h3>
            <div className="danger-actions">
              <button className="btn btn-danger">🗑️ Xóa tài khoản</button>
              <button className="btn btn-warning">📤 Xuất dữ liệu</button>
            </div>
            <p className="danger-note">
              ⚠️ Các hành động này không thể hoàn tác. Hãy cẩn thận khi thực hiện.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
