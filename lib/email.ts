// Mô phỏng gửi email (không gửi thật)
export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
  try {
    // Mô phỏng thời gian gửi email
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log email để debug
    console.log('📧 Email simulation:', {
      to: data.to,
      subject: data.subject,
      timestamp: new Date().toISOString()
    })
    
    return { 
      success: true, 
      message: 'Email sent successfully (simulation)' 
    }
  } catch (error) {
    console.error('Email simulation error:', error)
    return { 
      success: false, 
      message: `Email sending failed: ${error}` 
    }
  }
}

// Template cho email xác nhận đặt lịch
export function generateConsultationConfirmationEmail(data: {
  patientName: string
  doctorName: string
  specialty: string
  date: string
  time: string
  bookingId: string
  paymentId: string
  amount: number
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(data.amount)

  return {
    subject: `Xác nhận đặt lịch tư vấn - ${data.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Xác nhận đặt lịch tư vấn</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .success { color: #059669; font-weight: bold; }
          .info { margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hoàng Linh Medicine</h1>
            <p>Xác nhận đặt lịch tư vấn thành công</p>
          </div>
          
          <div class="content">
            <h2 class="success">✅ Đặt lịch tư vấn thành công!</h2>
            
            <p>Xin chào <strong>${data.patientName}</strong>,</p>
            
            <p>Cảm ơn bạn đã đặt lịch tư vấn với chúng tôi. Dưới đây là thông tin chi tiết:</p>
            
            <div class="details">
              <div class="info"><strong>Mã đặt lịch:</strong> ${data.bookingId}</div>
              <div class="info"><strong>Mã thanh toán:</strong> ${data.paymentId}</div>
              <div class="info"><strong>Bác sĩ:</strong> ${data.doctorName}</div>
              <div class="info"><strong>Chuyên khoa:</strong> ${data.specialty}</div>
              <div class="info"><strong>Ngày tư vấn:</strong> ${formattedDate}</div>
              <div class="info"><strong>Giờ tư vấn:</strong> ${data.time}</div>
              <div class="info"><strong>Phí tư vấn:</strong> ${formattedAmount}</div>
            </div>
            
            <h3>Những bước tiếp theo:</h3>
            <ol>
              <li>Bác sĩ sẽ liên hệ trước giờ tư vấn 30 phút</li>
              <li>Cuộc tư vấn sẽ diễn ra qua video call hoặc điện thoại</li>
              <li>Vui lòng chuẩn bị các câu hỏi và thông tin sức khỏe cần thiết</li>
            </ol>
            
            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:</p>
            <p><strong>Hotline:</strong> 1900-xxxx<br>
            <strong>Email:</strong> support@hoanglinhmedicine.com</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Hoàng Linh Medicine. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

// Template cho email nhắc nhở
export function generateReminderEmail(data: {
  patientName: string
  doctorName: string
  specialty: string
  date: string
  time: string
  reminderType: string
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    subject: `Nhắc nhở: Lịch tư vấn ${data.reminderType}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nhắc nhở lịch tư vấn</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #F59E0B; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .reminder { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #F59E0B; }
          .warning { color: #DC2626; font-weight: bold; }
          .info { margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hoàng Linh Medicine</h1>
            <p>Nhắc nhở lịch tư vấn</p>
          </div>
          
          <div class="content">
            <h2 class="warning">⏰ Nhắc nhở: ${data.reminderType}</h2>
            
            <p>Xin chào <strong>${data.patientName}</strong>,</p>
            
            <p>Đây là nhắc nhở về lịch tư vấn sắp tới của bạn:</p>
            
            <div class="reminder">
              <div class="info"><strong>Bác sĩ:</strong> ${data.doctorName}</div>
              <div class="info"><strong>Chuyên khoa:</strong> ${data.specialty}</div>
              <div class="info"><strong>Ngày tư vấn:</strong> ${formattedDate}</div>
              <div class="info"><strong>Giờ tư vấn:</strong> ${data.time}</div>
            </div>
            
            <h3>Lưu ý quan trọng:</h3>
            <ul>
              <li>Vui lòng chuẩn bị sẵn sàng trước giờ tư vấn</li>
              <li>Kiểm tra kết nối internet nếu tư vấn qua video call</li>
              <li>Chuẩn bị danh sách câu hỏi và thông tin sức khỏe</li>
            </ul>
            
            <p>Nếu cần hủy hoặc thay đổi lịch, vui lòng liên hệ ngay:</p>
            <p><strong>Hotline:</strong> 1900-xxxx</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Hoàng Linh Medicine. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
} 