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
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

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
    
    // Simulate API call
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
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 3000)
    }, 1000)
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const contactInfo = [
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '1900 1238',
      description: 'Hỗ trợ 24/7'
    },
    {
      icon: '✉️',
      title: 'Email',
      content: 'support@hoanglinhmedicine.com',
      description: 'Phản hồi trong 24h'
    },
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      description: 'Trụ sở chính'
    },
    {
      icon: '🕒',
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
      description: 'Thứ 7: 8:00 - 12:00'
    }
  ]

  return (
    <div className="page-background">
      <div className="page-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1 className="page-title">Liên hệ với chúng tôi</h1>
            <p className="page-subtitle">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin, 
              đội ngũ chuyên gia của Hoang Linh Medicine sẽ liên hệ lại trong thời gian sớm nhất.
            </p>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="contact-info-section">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <h3 className="info-title">{info.title}</h3>
                  <p className="info-main">{info.content}</p>
                  <p className="info-desc">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất có thể</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
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
                    placeholder="Nhập địa chỉ email"
                    required
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
                    <option value="consultation">Tư vấn sức khỏe</option>
                    <option value="service">Dịch vụ</option>
                    <option value="billing">Thanh toán</option>
                    <option value="technical">Hỗ trợ kỹ thuật</option>
                    <option value="feedback">Góp ý</option>
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
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  rows={6}
                  required
                />
                <div className="char-count">
                  {formData.message.length}/1000 ký tự
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất có thể.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-faq-section">
          <div className="faq-container">
            <h2>Câu hỏi thường gặp</h2>
            <div className="faq-list">
              <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(0)}>
                  <h4>Thời gian phản hồi là bao lâu?</h4>
                  <span className="faq-toggle">{activeFaq === 0 ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Chúng tôi thường phản hồi trong vòng 24 giờ làm việc. Đối với các trường hợp khẩn cấp, vui lòng gọi hotline 1900 1238.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(1)}>
                  <h4>Tôi có thể đặt lịch tư vấn trực tiếp không?</h4>
                  <span className="faq-toggle">{activeFaq === 1 ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Có, bạn có thể đặt lịch tư vấn trực tiếp với bác sĩ chuyên khoa. Vui lòng gọi hotline hoặc điền form đặt lịch trên website.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(2)}>
                  <h4>Chi phí tư vấn như thế nào?</h4>
                  <span className="faq-toggle">{activeFaq === 2 ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Tư vấn qua điện thoại miễn phí. Tư vấn trực tiếp có phí theo từng gói dịch vụ. Vui lòng tham khảo bảng giá trên trang pricing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}