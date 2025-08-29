'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      link: 'https://maps.google.com'
    },
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '1900 1234',
      link: 'tel:19001234'
    },
    {
      icon: '✉️',
      title: 'Email',
      content: 'info@hoanglinhmedicine.com',
      link: 'mailto:info@hoanglinhmedicine.com'
    },
    {
      icon: '🕒',
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 18:00\nThứ 7: 8:00 - 12:00',
      link: null
    }
  ]

  const departments = [
    {
      name: 'Tư vấn dinh dưỡng',
      phone: '1900 1235',
      email: 'nutrition@hoanglinhmedicine.com'
    },
    {
      name: 'Tư vấn tập luyện',
      phone: '1900 1236',
      email: 'fitness@hoanglinhmedicine.com'
    },
    {
      name: 'Hỗ trợ kỹ thuật',
      phone: '1900 1237',
      email: 'support@hoanglinhmedicine.com'
    },
    {
      name: 'Đặt lịch bác sĩ',
      phone: '1900 1238',
      email: 'booking@hoanglinhmedicine.com'
    }
  ]

  return (
    <div className="contact-page">
      {/* Header Navigation */}
      <header className="contact-header-nav">
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-logo">
              <div className="logo-icon">🏥</div>
              <span className="logo-text">HoangLinh</span>
            </div>
            
            <ul className="nav-menu">
              <li><a href="/" className="nav-link">Trang chủ</a></li>
              <li><a href="/dashboard" className="nav-link">Dashboard</a></li>
              <li><a href="/pricing" className="nav-link">Gói cước</a></li>
              <li><a href="/bmi" className="nav-link">Tính BMI</a></li>
            </ul>
            
            <div className="nav-buttons">
              <a href="/onboarding" className="btn btn-primary">🚀 Bắt đầu</a>
              <a href="/login" className="btn btn-outline">🔐 Đăng nhập</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Page Header */}
      <section className="contact-header">
        <div className="header-container">
          <h1>📞 Liên Hệ</h1>
          <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn trên hành trình chăm sóc sức khỏe</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info">
        <div className="info-container">
          <h2>📋 Thông Tin Liên Hệ</h2>
          <div className="info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-card">
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h3>{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="info-link">
                      {info.content}
                    </a>
                  ) : (
                    <p className="info-text">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="contact-main">
        <div className="main-container">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>📝 Gửi Tin Nhắn</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Chủ đề *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn chủ đề</option>
                    <option value="general">Thông tin chung</option>
                    <option value="pricing">Gói cước và giá cả</option>
                    <option value="technical">Hỗ trợ kỹ thuật</option>
                    <option value="nutrition">Tư vấn dinh dưỡng</option>
                    <option value="fitness">Tư vấn tập luyện</option>
                    <option value="booking">Đặt lịch bác sĩ</option>
                    <option value="feedback">Góp ý và phản hồi</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung tin nhắn *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Đang gửi...' : '📤 Gửi tin nhắn'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                </div>
              )}
            </form>
          </div>

          {/* Departments */}
          <div className="departments-section">
            <h2>🏢 Các Phòng Ban</h2>
            <div className="departments-list">
              {departments.map((dept, index) => (
                <div key={index} className="department-card">
                  <h3>{dept.name}</h3>
                  <div className="dept-contact">
                    <div className="dept-phone">
                      <span className="dept-icon">📞</span>
                      <a href={`tel:${dept.phone}`}>{dept.phone}</a>
                    </div>
                    <div className="dept-email">
                      <span className="dept-icon">✉️</span>
                      <a href={`mailto:${dept.email}`}>{dept.email}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="faq-container">
          <h2>❓ Câu Hỏi Thường Gặp</h2>
          
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">
                <h4>Thời gian phản hồi tin nhắn là bao lâu?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc. Với các vấn đề khẩn cấp, chúng tôi sẽ phản hồi ngay lập tức.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <h4>Tôi có thể đặt lịch tư vấn trực tiếp không?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>Có, bạn có thể đặt lịch tư vấn trực tiếp với bác sĩ hoặc chuyên gia dinh dưỡng. Vui lòng liên hệ qua số 1900 1238 để đặt lịch.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <h4>Dịch vụ có hoạt động vào cuối tuần không?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>Dịch vụ tư vấn online hoạt động 24/7. Tuy nhiên, tư vấn trực tiếp chỉ có vào giờ hành chính từ thứ 2 đến thứ 6.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question">
                <h4>Tôi có thể thanh toán qua những phương thức nào?</h4>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">
                <p>Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và tiền mặt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map">
        <div className="map-container">
          <h2>🗺️ Vị Trí Của Chúng Tôi</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <div className="map-icon">📍</div>
              <h3>Hoang Linh Medicine</h3>
              <p>123 Đường ABC, Quận 1, TP.HCM</p>
              <a href="https://maps.google.com" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                🗺️ Xem trên Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="contact-navigation">
        <div className="nav-container">
          <a href="/" className="btn btn-outline">🏠 Trang chủ</a>
          <a href="/pricing" className="btn btn-outline">💎 Gói cước</a>
          <a href="/dashboard" className="btn btn-outline">📊 Dashboard</a>
        </div>
      </section>
    </div>
  )
}
