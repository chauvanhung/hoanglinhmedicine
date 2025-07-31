import { NextRequest, NextResponse } from 'next/server'

interface NotificationRequest {
  type: 'sms' | 'email'
  recipient: string
  subject?: string
  message: string
  bookingId?: string
  consultationInfo?: {
    doctorName: string
    date: string
    time: string
    patientName: string
  }
}

interface NotificationResponse {
  success: boolean
  message: string
  notificationId?: string
  sentAt?: string
}

// Mock SMS service
async function sendSMS(phone: string, message: string): Promise<boolean> {
  // Simulate SMS sending
  console.log(`📱 SMS sent to ${phone}: ${message}`)
  await new Promise(resolve => setTimeout(resolve, 1000))
  return Math.random() > 0.1 // 90% success rate
}

// Mock Email service
async function sendEmail(email: string, subject: string, message: string): Promise<boolean> {
  // Simulate email sending
  console.log(`📧 Email sent to ${email}`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  await new Promise(resolve => setTimeout(resolve, 1500))
  return Math.random() > 0.05 // 95% success rate
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json()
    
    // Validate required fields
    if (!body.type || !body.recipient || !body.message) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      }, { status: 400 })
    }

    const notificationId = `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    let success = false

    if (body.type === 'sms') {
      // Validate phone number format (Vietnamese)
      const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
      if (!phoneRegex.test(body.recipient)) {
        return NextResponse.json({
          success: false,
          message: 'Số điện thoại không hợp lệ'
        }, { status: 400 })
      }
      
      success = await sendSMS(body.recipient, body.message)
    } else if (body.type === 'email') {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.recipient)) {
        return NextResponse.json({
          success: false,
          message: 'Email không hợp lệ'
        }, { status: 400 })
      }
      
      success = await sendEmail(body.recipient, body.subject || 'Thông báo từ Hoàng Linh Medicine', body.message)
    } else {
      return NextResponse.json({
        success: false,
        message: 'Loại thông báo không hợp lệ'
      }, { status: 400 })
    }

    if (success) {
      console.log('Notification sent successfully:', {
        id: notificationId,
        type: body.type,
        recipient: body.recipient,
        bookingId: body.bookingId,
        timestamp: new Date().toISOString()
      })

      return NextResponse.json({
        success: true,
        message: body.type === 'sms' ? 'SMS đã được gửi thành công' : 'Email đã được gửi thành công',
        notificationId,
        sentAt: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: body.type === 'sms' ? 'Không thể gửi SMS' : 'Không thể gửi email'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({
      success: false,
      message: 'Có lỗi xảy ra khi gửi thông báo'
    }, { status: 500 })
  }
}

// Get notification history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')
  const type = searchParams.get('type')

  // Mock notification history
  const mockNotifications = [
    {
      id: 'NOTIF_1234567890_abc123',
      type: 'sms',
      recipient: '0901234567',
      message: 'Nhắc nhở: Bạn có lịch tư vấn với BS. Nguyễn Văn A vào ngày 15/12/2024 lúc 14:00',
      bookingId: 'CONS_1234567890_abc123',
      status: 'sent',
      sentAt: '2024-12-14T10:00:00Z'
    },
    {
      id: 'NOTIF_1234567891_def456',
      type: 'email',
      recipient: 'patient@example.com',
      message: 'Nhắc nhở: Bạn có lịch tư vấn với BS. Nguyễn Văn A vào ngày 15/12/2024 lúc 14:00',
      bookingId: 'CONS_1234567890_abc123',
      status: 'sent',
      sentAt: '2024-12-14T10:00:00Z'
    },
    {
      id: 'NOTIF_1234567892_ghi789',
      type: 'sms',
      recipient: '0909876543',
      message: 'Nhắc nhở: Bạn có lịch tư vấn với BS. Trần Thị B vào ngày 16/12/2024 lúc 09:00',
      bookingId: 'CONS_1234567891_def456',
      status: 'failed',
      sentAt: '2024-12-15T08:00:00Z'
    }
  ]

  let filteredNotifications = mockNotifications

  if (bookingId) {
    filteredNotifications = filteredNotifications.filter(n => n.bookingId === bookingId)
  }

  if (type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === type)
  }

  return NextResponse.json({
    success: true,
    notifications: filteredNotifications
  })
} 