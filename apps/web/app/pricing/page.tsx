'use client'

import { useState } from 'react'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [activeFaq, setActiveFaq] = useState<number[]>([])
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      id: 'basic',
      name: 'Gói Cơ Bản',
      monthlyPrice: '299.000',
      yearlyPrice: '239.000',
      description: 'Bắt đầu hành trình giảm cân với những công cụ cơ bản',
      features: [
        'Tính toán BMI và theo dõi cân nặng',
        'Kế hoạch giảm cân cá nhân hóa',
        'Theo dõi calo và dinh dưỡng cơ bản',
        'Hướng dẫn tập luyện cơ bản',
        'Hỗ trợ qua email',
        'Báo cáo tiến độ hàng tuần'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'premium',
      name: 'Gói Premium',
      monthlyPrice: '599.000',
      yearlyPrice: '479.000',
      description: 'Trải nghiệm giảm cân toàn diện với AI và chuyên gia',
      features: [
        'Tất cả tính năng gói cơ bản',
        'AI Coach cá nhân hóa 24/7',
        'Tư vấn dinh dưỡng chi tiết',
        'Kế hoạch tập luyện nâng cao',
        'Theo dõi sức khỏe toàn diện',
        'Chat trực tiếp với AI',
        'Báo cáo chi tiết hàng ngày',
        'Hỗ trợ ưu tiên'
      ],
      popular: true,
      color: 'green'
    },
    {
      id: 'vip',
      name: 'Gói VIP',
      monthlyPrice: '1.299.000',
      yearlyPrice: '1.039.000',
      description: 'Dịch vụ cao cấp với bác sĩ chuyên khoa và huấn luyện viên',
      features: [
        'Tất cả tính năng gói Premium',
        'Tư vấn trực tiếp với bác sĩ chuyên khoa',
        'Huấn luyện viên cá nhân 1-1',
        'Kế hoạch dinh dưỡng chi tiết từ chuyên gia',
        'Theo dõi sức khỏe định kỳ',
        'Đặt lịch khám bác sĩ ưu tiên',
        'Hỗ trợ 24/7 qua điện thoại',
        'Báo cáo sức khỏe hàng tuần',
        'Tư vấn tâm lý và động lực'
      ],
      popular: false,
      color: 'gold'
    }
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = (planId: string) => {
    // TODO: Implement payment integration
    alert(`Bạn đã chọn gói ${plans.find(p => p.id === planId)?.name}. Chức năng thanh toán sẽ được cập nhật sớm!`)
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleToggleBilling = () => {
    setIsYearly(!isYearly)
  }

  const getCurrentPrice = (plan: any) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getCurrentPeriod = () => {
    return isYearly ? 'năm' : 'tháng'
  }

  return (
    <div className="page-background">
      <div className="page-container">
        {/* Page Header */}
        <section className="pricing-header">
          <div className="header-container">
            <h1>💎 Gói Cước Dịch Vụ</h1>
            <p>Chọn gói phù hợp với mục tiêu giảm cân của bạn</p>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="pricing-toggle">
          <div className="toggle-container">
            <span className="toggle-label">Thanh toán theo tháng</span>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="billing-toggle" 
                className="toggle-input"
                checked={isYearly}
                onChange={handleToggleBilling}
              />
              <label htmlFor="billing-toggle" className="toggle-label-switch"></label>
            </div>
            <span className="toggle-label">Thanh toán theo năm (Tiết kiệm 20%)</span>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="pricing-plans">
          <div className="plans-container">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.color}`}
              >
                {plan.popular && (
                  <div className="popular-badge">🔥 Phổ biến nhất</div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">₫{getCurrentPrice(plan)}</span>
                    <span className="price-period">/{getCurrentPeriod()}</span>
                  </div>
                  {isYearly && (
                    <div className="savings-badge">
                      <span className="savings-text">Tiết kiệm 20%</span>
                    </div>
                  )}
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="plan-actions">
                  <button 
                    className={`btn btn-${plan.color} ${selectedPlan === plan.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? '✓ Đã chọn' : 'Chọn gói này'}
                  </button>
                  
                  {selectedPlan === plan.id && (
                    <button 
                      className="btn btn-primary btn-subscribe"
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      🚀 Đăng ký ngay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pricing-faq">
          <div className="faq-container">
            <h2>❓ Câu hỏi thường gặp</h2>
            
            <div className="faq-list">
              <div className={`faq-item ${activeFaq.includes(0) ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(0)}>
                  <h4>Tôi có thể thay đổi gói cước không?</h4>
                  <span className="faq-toggle">{activeFaq.includes(0) ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Có, bạn có thể nâng cấp hoặc hạ cấp gói cước bất cứ lúc nào. Thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq.includes(1) ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(1)}>
                  <h4>Gói cước có bao gồm tư vấn bác sĩ không?</h4>
                  <span className="faq-toggle">{activeFaq.includes(1) ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Gói Premium và VIP bao gồm tư vấn AI, chỉ gói VIP mới có tư vấn trực tiếp với bác sĩ chuyên khoa.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq.includes(2) ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(2)}>
                  <h4>Tôi có thể hủy gói cước bất cứ lúc nào không?</h4>
                  <span className="faq-toggle">{activeFaq.includes(2) ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Có, bạn có thể hủy gói cước bất cứ lúc nào. Gói cước sẽ hoạt động đến hết chu kỳ đã thanh toán.</p>
                </div>
              </div>

              <div className={`faq-item ${activeFaq.includes(3) ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(3)}>
                  <h4>Có chính sách hoàn tiền không?</h4>
                  <span className="faq-toggle">{activeFaq.includes(3) ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>Chúng tôi có chính sách hoàn tiền trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="pricing-cta">
          <div className="cta-container">
            <h2>💬 Cần tư vấn thêm?</h2>
            <p>Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn gói cước phù hợp nhất</p>
            <div className="cta-actions">
              <a href="/contact" className="btn btn-primary">📞 Liên hệ tư vấn</a>
              <a href="/chat" className="btn btn-outline">💬 Chat với AI</a>
            </div>
          </div>
        </section>


      </div>
    </div>
  )
}
