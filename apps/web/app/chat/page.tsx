export default function ChatPage() {
  return (
    <div className="chat-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <a href="/dashboard" className="back-link">← Quay lại Dashboard</a>
          <h1>🤖 AI Coach - Tư vấn dinh dưỡng</h1>
          <p>Nhận tư vấn cá nhân hóa từ AI coach thông minh</p>
        </div>
      </header>

      {/* Chat Content */}
      <section className="chat-content">
        <div className="chat-container">
          {/* Chat Sidebar */}
          <div className="chat-sidebar">
            <div className="sidebar-header">
              <h3>💬 Cuộc trò chuyện</h3>
              <button className="new-chat-btn">➕ Cuộc trò chuyện mới</button>
            </div>
            
            <div className="chat-sessions">
              <div className="chat-session active">
                <div className="session-icon">🍎</div>
                <div className="session-info">
                  <div className="session-title">Tư vấn dinh dưỡng tuần này</div>
                  <div className="session-time">2 giờ trước</div>
                </div>
              </div>
              
              <div className="chat-session">
                <div className="session-icon">🏃‍♂️</div>
                <div className="session-info">
                  <div className="session-title">Kế hoạch tập luyện</div>
                  <div className="session-time">1 ngày trước</div>
                </div>
              </div>
              
              <div className="chat-session">
                <div className="session-icon">⚖️</div>
                <div className="session-info">
                  <div className="session-title">Theo dõi tiến độ</div>
                  <div className="session-time">3 ngày trước</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Main */}
          <div className="chat-main">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="coach-info">
                <div className="coach-avatar">🤖</div>
                <div className="coach-details">
                  <h3>AI Coach - Chuyên gia dinh dưỡng</h3>
                  <span className="coach-status online">🟢 Đang hoạt động</span>
                </div>
              </div>
              
              <div className="chat-actions">
                <button className="action-btn">📊 Xem hồ sơ</button>
                <button className="action-btn">📋 Lịch sử</button>
                <button className="action-btn">⚙️ Cài đặt</button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              <div className="message coach-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">AI Coach</span>
                    <span className="message-time">10:30</span>
                  </div>
                  <div className="message-text">
                    Xin chào! Tôi là AI Coach của bạn. Dựa trên hồ sơ sức khỏe, tôi thấy bạn đang trong hành trình giảm cân. 
                    Hôm nay bạn muốn tư vấn về vấn đề gì? Tôi có thể giúp bạn về:
                    <br/>• Kế hoạch dinh dưỡng
                    <br/>• Bài tập thể dục
                    <br/>• Theo dõi tiến độ
                    <br/>• Giải đáp thắc mắc
                  </div>
                </div>
              </div>

              <div className="message user-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">Bạn</span>
                    <span className="message-time">10:32</span>
                  </div>
                  <div className="message-text">
                    Chào coach! Tôi muốn biết thực đơn dinh dưỡng cho tuần này. Tôi đang muốn giảm 0.5kg/tuần.
                  </div>
                </div>
                <div className="message-avatar">👤</div>
              </div>

              <div className="message coach-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">AI Coach</span>
                    <span className="message-time">10:33</span>
                  </div>
                  <div className="message-text">
                    Tuyệt vời! Dựa trên mục tiêu giảm 0.5kg/tuần, tôi sẽ tạo thực đơn dinh dưỡng phù hợp. 
                    Bạn cần giảm khoảng 500 calo/ngày để đạt mục tiêu này.
                  </div>
                  
                  <div className="nutrition-plan">
                    <h4>🍽️ Thực đơn mẫu cho tuần này:</h4>
                    <div className="meal-suggestions">
                      <div className="meal-item">
                        <div className="meal-time">🌅 Bữa sáng (7:00)</div>
                        <div className="meal-content">
                          • Bánh mì đen + trứng luộc + rau xanh
                          • Sữa chua không đường + hạt chia
                          • <strong>Calo: 350 kcal</strong>
                        </div>
                      </div>
                      
                      <div className="meal-item">
                        <div className="meal-time">☀️ Bữa trưa (12:00)</div>
                        <div className="meal-content">
                          • Cơm gạo lứt + thịt gà luộc + rau cải
                          • Canh bí đao + trái cây
                          • <strong>Calo: 450 kcal</strong>
                        </div>
                      </div>
                      
                      <div className="meal-item">
                        <div className="meal-time">🌆 Bữa tối (18:00)</div>
                        <div className="meal-content">
                          • Cá hồi nướng + rau xanh + khoai lang
                          • Salad rau củ + dầu olive
                          • <strong>Calo: 400 kcal</strong>
                        </div>
                      </div>
                      
                      <div className="meal-item">
                        <div className="meal-time">🌙 Bữa phụ (15:00 & 21:00)</div>
                        <div className="meal-content">
                          • Hạt hạnh nhân + táo
                          • <strong>Calo: 150 kcal</strong>
                        </div>
                      </div>
                    </div>
                    
                    <div className="plan-summary">
                      <strong>Tổng calo: 1,350 kcal/ngày</strong>
                      <br/>Mục tiêu giảm: 0.5kg/tuần ✅
                    </div>
                  </div>
                </div>
              </div>

              <div className="message user-message">
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">Bạn</span>
                    <span className="message-time">10:35</span>
                  </div>
                  <div className="message-text">
                    Cảm ơn coach! Thực đơn này có phù hợp với người bị tiểu đường không?
                  </div>
                </div>
                <div className="message-avatar">👤</div>
              </div>

              <div className="message coach-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">AI Coach</span>
                    <span className="message-time">10:36</span>
                  </div>
                  <div className="message-text">
                    Cảm ơn bạn đã hỏi! Với người bị tiểu đường, tôi cần điều chỉnh thực đơn một chút:
                    <br/><br/>⚠️ <strong>Lưu ý quan trọng:</strong>
                    <br/>• Giảm lượng tinh bột (cơm, bánh mì)
                    <br/>• Tăng cường protein và chất xơ
                    <br/>• Chia nhỏ bữa ăn (5-6 bữa/ngày)
                    <br/>• Theo dõi đường huyết thường xuyên
                    <br/><br/>🔄 <strong>Thực đơn điều chỉnh:</strong>
                    <br/>• Bữa sáng: Trứng + rau xanh + hạt chia
                    <br/>• Bữa trưa: Thịt gà + rau cải + canh bí
                    <br/>• Bữa tối: Cá hồi + rau xanh + hạt quinoa
                    <br/>• Bữa phụ: Hạt hạnh nhân + táo xanh
                    <br/><br/>📊 <strong>Chỉ số dinh dưỡng:</strong>
                    <br/>• Tổng calo: 1,200 kcal/ngày
                    <br/>• Carb: 80g (giảm 30%)
                    <br/>• Protein: 120g (tăng 20%)
                    <br/>• Chất xơ: 35g (tăng 40%)
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="chat-input">
              <div className="input-container">
                <input 
                  type="text" 
                  placeholder="Nhập câu hỏi của bạn..." 
                  className="message-input"
                />
                <div className="input-actions">
                  <button className="action-btn">📎</button>
                  <button className="action-btn">📷</button>
                  <button className="send-btn">📤</button>
                </div>
              </div>
              
              <div className="quick-questions">
                <button className="quick-btn">🍎 Thực đơn dinh dưỡng</button>
                <button className="quick-btn">🏃‍♂️ Bài tập thể dục</button>
                <button className="quick-btn">⚖️ Theo dõi tiến độ</button>
                <button className="quick-btn">❓ Giải đáp thắc mắc</button>
              </div>
            </div>
          </div>

          {/* Chat Info Panel */}
          <div className="chat-info-panel">
            <div className="info-header">
              <h3>ℹ️ Thông tin hồ sơ</h3>
            </div>
            
            <div className="user-profile">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <h4>Nguyễn Văn A</h4>
                <p>Tuổi: 34 | Giới tính: Nam</p>
                <p>Chiều cao: 170cm | Cân nặng: 75kg</p>
                <p>BMI: 26.0 (Thừa cân)</p>
              </div>
            </div>

            <div className="health-goals">
              <h4>🎯 Mục tiêu sức khỏe</h4>
              <div className="goal-item">
                <span className="goal-label">Mục tiêu cân nặng:</span>
                <span className="goal-value">68 kg</span>
              </div>
              <div className="goal-item">
                <span className="goal-label">Thời gian:</span>
                <span className="goal-value">3 tháng</span>
              </div>
              <div className="goal-item">
                <span className="goal-label">Tốc độ giảm:</span>
                <span className="goal-value">0.5 kg/tuần</span>
              </div>
            </div>

            <div className="recent-activity">
              <h4>📊 Hoạt động gần đây</h4>
              <div className="activity-item">
                <span className="activity-label">Bước chân hôm nay:</span>
                <span className="activity-value">8,547</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Calo đốt cháy:</span>
                <span className="activity-value">320 kcal</span>
              </div>
              <div className="activity-item">
                <span className="activity-label">Cân nặng mới nhất:</span>
                <span className="activity-value">75.0 kg</span>
              </div>
            </div>

            <div className="ai-suggestions">
              <h4>💡 Gợi ý từ AI</h4>
              <div className="suggestion-item">
                <div className="suggestion-icon">🍎</div>
                <div className="suggestion-content">
                  <strong>Dinh dưỡng:</strong> Tăng cường protein và chất xơ
                </div>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-icon">🏃‍♂️</div>
                <div className="suggestion-content">
                  <strong>Vận động:</strong> Đi bộ 30 phút mỗi ngày
                </div>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-icon">💧</div>
                <div className="suggestion-content">
                  <strong>Nước uống:</strong> Uống 2-2.5 lít nước/ngày
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
