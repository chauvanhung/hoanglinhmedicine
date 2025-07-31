import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateConsultationConfirmationEmail, generateReminderEmail } from '@/lib/email'
import { sendSMS, generateConsultationConfirmationSMS, generateReminderSMS } from '@/lib/sms'

interface NotificationRequest {
  type: 'sms' | 'email'
  recipient: string
  message?: string
  consultationInfo?: {
    doctorName: string
    specialty?: string
    date: string
    time: string
    patientName: string
    bookingId?: string
    paymentId?: string
    amount?: number
  }
  notificationType?: 'confirmation' | 'reminder'
  reminderType?: string
}

// Mock notification history (in real app, this would be in database)
const notificationHistory: any[] = [
  {
    id: 'notif_001',
    type: 'email',
    recipient: 'patient@example.com',
    message: 'Xác nhận đặt lịch tư vấn',
    status: 'sent',
    sentAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'notif_002',
    type: 'sms',
    recipient: '+84901234567',
    message: 'Nhắc nhở lịch tư vấn',
    status: 'sent',
    sentAt: '2024-01-15T09:00:00Z'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json()
    
    // Validate required fields
    if (!body.type || !body.recipient) {
      return NextResponse.json(
        { error: 'Thiếu thông tin thông báo' },
        { status: 400 }
      )
    }

    // Validate recipient format
    if (body.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.recipient)) {
        return NextResponse.json(
          { error: 'Email không hợp lệ' },
          { status: 400 }
        )
      }
    } else if (body.type === 'sms') {
      const phoneRegex = /^(\+84|84|0)[0-9]{9}$/
      if (!phoneRegex.test(body.recipient)) {
        return NextResponse.json(
          { error: 'Số điện thoại không hợp lệ' },
          { status: 400 }
        )
      }
    }

    let result: { success: boolean; message: string }
    let notificationMessage: string

    // Generate appropriate message based on notification type
    if (body.notificationType === 'confirmation' && body.consultationInfo) {
      if (body.type === 'email') {
        const emailData = generateConsultationConfirmationEmail({
          patientName: body.consultationInfo.patientName,
          doctorName: body.consultationInfo.doctorName,
          specialty: body.consultationInfo.specialty || 'Chuyên khoa',
          date: body.consultationInfo.date,
          time: body.consultationInfo.time,
          bookingId: body.consultationInfo.bookingId || 'N/A',
          paymentId: body.consultationInfo.paymentId || 'N/A',
          amount: body.consultationInfo.amount || 0
        })
        
        result = await sendEmail({
          to: body.recipient,
          subject: emailData.subject,
          html: emailData.html
        })
        notificationMessage = emailData.subject
      } else {
        const smsData = generateConsultationConfirmationSMS({
          patientName: body.consultationInfo.patientName,
          doctorName: body.consultationInfo.doctorName,
          date: body.consultationInfo.date,
          time: body.consultationInfo.time,
          bookingId: body.consultationInfo.bookingId || 'N/A'
        })
        
        result = await sendSMS({
          to: body.recipient,
          message: smsData.message
        })
        notificationMessage = smsData.message
      }
    } else if (body.notificationType === 'reminder' && body.consultationInfo) {
      if (body.type === 'email') {
        const emailData = generateReminderEmail({
          patientName: body.consultationInfo.patientName,
          doctorName: body.consultationInfo.doctorName,
          specialty: body.consultationInfo.specialty || 'Chuyên khoa',
          date: body.consultationInfo.date,
          time: body.consultationInfo.time,
          reminderType: body.reminderType || '30 phút trước'
        })
        
        result = await sendEmail({
          to: body.recipient,
          subject: emailData.subject,
          html: emailData.html
        })
        notificationMessage = emailData.subject
      } else {
        const smsData = generateReminderSMS({
          patientName: body.consultationInfo.patientName,
          doctorName: body.consultationInfo.doctorName,
          date: body.consultationInfo.date,
          time: body.consultationInfo.time,
          reminderType: body.reminderType || '30 phút trước'
        })
        
        result = await sendSMS({
          to: body.recipient,
          message: smsData.message
        })
        notificationMessage = smsData.message
      }
    } else {
      // Custom message
      if (body.type === 'email') {
        result = await sendEmail({
          to: body.recipient,
          subject: 'Thông báo từ Hoàng Linh Medicine',
          html: body.message || 'Thông báo từ hệ thống'
        })
      } else {
        result = await sendSMS({
          to: body.recipient,
          message: body.message || 'Thông báo từ Hoàng Linh Medicine'
        })
      }
      notificationMessage = body.message || 'Thông báo tùy chỉnh'
    }

    // Add to notification history
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: body.type,
      recipient: body.recipient,
      message: notificationMessage,
      status: result.success ? 'sent' : 'failed',
      sentAt: new Date().toISOString(),
      result: result.message
    }
    
    notificationHistory.push(notification)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      notificationId: notification.id
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi thông báo' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return notification history
    return NextResponse.json({
      notifications: notificationHistory.sort((a, b) => 
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy lịch sử thông báo' },
      { status: 500 }
    )
  }
} 