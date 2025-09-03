export default function ConsultationsPage() {
  return (
    <div className="page-background">
      <div className="page-container">
        {/* Consultations */}
        <section className="consultations-section">
          <div className="consultations-container">
            {/* Consultation Status */}
            <div className="consultation-status">
              <h2>📅 Trạng thái tư vấn</h2>
              <div className="status-overview">
                <div className="status-card active">
                  <div className="status-icon">✅</div>
                  <div className="status-info">
                    <h3>Buổi tư vấn sắp tới</h3>
                    <p>Thứ 6, 20/12/2024 - 14:00</p>
                    <span className="doctor-name">Bác sĩ Nguyễn Văn A</span>
                  </div>
                  <div className="status-actions">
                    <button className="btn btn-outline btn-small">📝 Chỉnh sửa</button>
                    <button className="btn btn-danger btn-small">❌ Hủy</button>
                  </div>
                </div>
                
                <div className="status-summary">
                  <div className="summary-item">
                    <span className="summary-label">Buổi đã sử dụng:</span>
                    <span className="summary-value">1/2 tháng này</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Buổi còn lại:</span>
                    <span className="summary-value">1 buổi</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Gói dịch vụ:</span>
                    <span className="summary-value">Pro - 2 buổi/tháng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Doctors */}
            <div className="available-doctors">
              <h2>👨‍⚕️ Đội ngũ bác sĩ</h2>
              <div className="doctors-grid">
                <div className="doctor-card">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <div className="doctor-info">
                    <h3>Bác sĩ Nguyễn Văn A</h3>
                    <p className="doctor-specialty">Chuyên khoa Dinh dưỡng & Giảm cân</p>
                    <p className="doctor-experience">15 năm kinh nghiệm</p>
                    <div className="doctor-rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-text">4.9/5 (127 đánh giá)</span>
                    </div>
                    <div className="doctor-availability">
                      <span className="availability-status available">🟢 Có lịch trống</span>
                      <span className="next-slot">Lịch sớm nhất: Hôm nay 16:00</span>
                    </div>
                  </div>
                  <div className="doctor-actions">
                    <button className="btn btn-primary">📅 Đặt lịch</button>
                    <button className="btn btn-outline">👁️ Xem hồ sơ</button>
                  </div>
                </div>

                <div className="doctor-card">
                  <div className="doctor-avatar">👩‍⚕️</div>
                  <div className="doctor-info">
                    <h3>Bác sĩ Trần Thị B</h3>
                    <p className="doctor-specialty">Chuyên khoa Nội tiết & Chuyển hóa</p>
                    <p className="doctor-experience">12 năm kinh nghiệm</p>
                    <div className="doctor-rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-text">4.8/5 (98 đánh giá)</span>
                    </div>
                    <div className="doctor-availability">
                      <span className="availability-status available">🟢 Có lịch trống</span>
                      <span className="next-slot">Lịch sớm nhất: Ngày mai 10:00</span>
                    </div>
                  </div>
                  <div className="doctor-actions">
                    <button className="btn btn-primary">📅 Đặt lịch</button>
                    <button className="btn btn-outline">👁️ Xem hồ sơ</button>
                  </div>
                </div>

                <div className="doctor-card">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <div className="doctor-info">
                    <h3>Bác sĩ Lê Văn C</h3>
                    <p className="doctor-specialty">Chuyên khoa Thể dục & Vận động</p>
                    <p className="doctor-experience">10 năm kinh nghiệm</p>
                    <div className="doctor-rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-text">4.7/5 (76 đánh giá)</span>
                    </div>
                    <div className="doctor-availability">
                      <span className="availability-status busy">🔴 Lịch đầy</span>
                      <span className="next-slot">Lịch sớm nhất: Tuần sau</span>
                    </div>
                  </div>
                  <div className="doctor-actions">
                    <button className="btn btn-outline" disabled>📅 Đặt lịch</button>
                    <button className="btn btn-outline">👁️ Xem hồ sơ</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Calendar */}
            <div className="booking-calendar">
              <h2>📅 Đặt lịch tư vấn</h2>
              <div className="calendar-container">
                <div className="calendar-header">
                  <h3>Tháng 12/2024</h3>
                  <div className="calendar-nav">
                    <button className="nav-btn">←</button>
                    <button className="nav-btn">→</button>
                  </div>
                </div>
                
                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    <div className="weekday">CN</div>
                    <div className="weekday">T2</div>
                    <div className="weekday">T3</div>
                    <div className="weekday">T4</div>
                    <div className="weekday">T5</div>
                    <div className="weekday">T6</div>
                    <div className="weekday">T7</div>
                  </div>
                  
                  <div className="calendar-days">
                    <div className="day disabled">1</div>
                    <div className="day disabled">2</div>
                    <div className="day disabled">3</div>
                    <div className="day disabled">4</div>
                    <div className="day disabled">5</div>
                    <div className="day disabled">6</div>
                    <div className="day">7</div>
                    <div className="day">8</div>
                    <div className="day">9</div>
                    <div className="day">10</div>
                    <div className="day">11</div>
                    <div className="day">12</div>
                    <div className="day">13</div>
                    <div className="day">14</div>
                    <div className="day">15</div>
                    <div className="day">16</div>
                    <div className="day">17</div>
                    <div className="day">18</div>
                    <div className="day">19</div>
                    <div className="day available">20</div>
                    <div className="day available">21</div>
                    <div className="day available">22</div>
                    <div className="day available">23</div>
                    <div className="day available">24</div>
                    <div className="day available">25</div>
                    <div className="day available">26</div>
                    <div className="day available">27</div>
                    <div className="day available">28</div>
                    <div className="day available">29</div>
                    <div className="day available">30</div>
                    <div className="day available">31</div>
                  </div>
                </div>
                
                <div className="time-slots">
                  <h4>Thời gian có sẵn - Thứ 6, 20/12/2024</h4>
                  <div className="slots-grid">
                    <button className="time-slot available">09:00</button>
                    <button className="time-slot available">10:00</button>
                    <button className="time-slot available">11:00</button>
                    <button className="time-slot booked">14:00</button>
                    <button className="time-slot available">15:00</button>
                    <button className="time-slot available">16:00</button>
                    <button className="time-slot available">17:00</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation History */}
            <div className="consultation-history">
              <h2>📋 Lịch sử tư vấn</h2>
              <div className="history-list">
                <div className="consultation-item completed">
                  <div className="consultation-icon">✅</div>
                  <div className="consultation-details">
                    <h4>Tư vấn dinh dưỡng tuần 1</h4>
                    <p>Bác sĩ Nguyễn Văn A - Thứ 6, 13/12/2024 - 14:00</p>
                    <p>📝 Đánh giá: Rất hài lòng với buổi tư vấn</p>
                    <div className="consultation-notes">
                      <h5>Ghi chú từ bác sĩ:</h5>
                      <p>"Bệnh nhân có tiến triển tốt, cần duy trì chế độ ăn hiện tại và tăng cường vận động. Hẹn tái khám sau 1 tuần."</p>
                    </div>
                  </div>
                  <div className="consultation-actions">
                    <button className="btn btn-outline btn-small">📄 Xem chi tiết</button>
                    <button className="btn btn-outline btn-small">📧 Gửi email</button>
                  </div>
                </div>
                
                <div className="consultation-item completed">
                  <div className="consultation-icon">✅</div>
                  <div className="consultation-details">
                    <h4>Tư vấn dinh dưỡng tuần 2</h4>
                    <p>Bác sĩ Trần Thị B - Thứ 6, 06/12/2024 - 15:00</p>
                    <p>📝 Đánh giá: Hài lòng với buổi tư vấn</p>
                    <div className="consultation-notes">
                      <h5>Ghi chú từ bác sĩ:</h5>
                      <p>"Cần điều chỉnh khẩu phần ăn, giảm tinh bột và tăng protein. Theo dõi cân nặng hàng tuần."</p>
                    </div>
                  </div>
                  <div className="consultation-actions">
                    <button className="btn btn-outline btn-small">📄 Xem chi tiết</button>
                    <button className="btn btn-outline btn-small">📧 Gửi email</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Preparation */}
            <div className="consultation-preparation">
              <h2>📋 Chuẩn bị cho buổi tư vấn</h2>
              <div className="preparation-container">
                <div className="preparation-checklist">
                  <h3>✅ Danh sách kiểm tra</h3>
                  <div className="checklist-items">
                    <div className="checklist-item completed">
                      <span className="check-icon">✅</span>
                      <span>Cập nhật thông tin cân nặng mới nhất</span>
                    </div>
                    <div className="checklist-item completed">
                      <span className="check-icon">✅</span>
                      <span>Ghi chép chế độ ăn 3 ngày qua</span>
                    </div>
                    <div className="checklist-item completed">
                      <span className="check-icon">✅</span>
                      <span>Chuẩn bị câu hỏi cần tư vấn</span>
                    </div>
                    <div className="checklist-item">
                      <span className="check-icon">⭕</span>
                      <span>Kiểm tra kết nối internet</span>
                    </div>
                    <div className="checklist-item">
                      <span className="check-icon">⭕</span>
                      <span>Chuẩn bị không gian yên tĩnh</span>
                    </div>
                  </div>
                </div>
                
                <div className="preparation-tips">
                  <h3>💡 Lời khuyên</h3>
                  <div className="tips-list">
                    <div className="tip-item">
                      <span className="tip-icon">⏰</span>
                      <p>Đăng nhập sớm 5 phút trước giờ hẹn</p>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">📝</span>
                      <p>Chuẩn bị sẵn giấy bút để ghi chép</p>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">📱</span>
                      <p>Đảm bảo thiết bị có đủ pin</p>
                    </div>
                    <div className="tip-item">
                      <span className="tip-icon">🔇</span>
                      <p>Tắt thông báo để tránh gián đoạn</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Support */}
            <div className="consultation-support">
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
                  <p>Gửi email đến: consultations@hoanglinh.com</p>
                  <button className="btn btn-primary">📧 Gửi email</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
