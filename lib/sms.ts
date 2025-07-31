import twilio from 'twilio'

// Cấu hình Twilio
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Khởi tạo Twilio client
const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN 
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null

export interface SMSData {
  to: string
  message: string
}

export async function sendSMS(data: SMSData): Promise<{ success: boolean; message: string }> {
  try {
    if (!twilioClient) {
      return { success: false, message: 'Twilio not configured' }
    }

    if (!TWILIO_PHONE_NUMBER) {
      return { success: false, message: 'Twilio phone number not configured' }
    }

    // Format phone number for Vietnam (+84)
    let formattedPhone = data.to
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+84' + formattedPhone.substring(1)
    } else if (!formattedPhone.startsWith('+84')) {
      formattedPhone = '+84' + formattedPhone
    }

    const message = await twilioClient.messages.create({
      body: data.message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedPhone
    })

    console.log('SMS sent successfully:', message.sid)
    return { success: true, message: `SMS sent via Twilio (SID: ${message.sid})` }

  } catch (error) {
    console.error('SMS sending error:', error)
    return { success: false, message: `SMS sending failed: ${error}` }
  }
}

// Template cho SMS xác nhận đặt lịch
export function generateConsultationConfirmationSMS(data: {
  patientName: string
  doctorName: string
  date: string
  time: string
  bookingId: string
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return {
    message: `Hoang Linh Medicine: Xac nhan dat lich tu van thanh cong!\n\nBac si: ${data.doctorName}\nNgay: ${formattedDate}\nGio: ${data.time}\nMa dat lich: ${data.bookingId}\n\nBac si se lien he truoc 30 phut. Hotline: 1900-xxxx`
  }
}

// Template cho SMS nhắc nhở
export function generateReminderSMS(data: {
  patientName: string
  doctorName: string
  date: string
  time: string
  reminderType: string
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return {
    message: `Hoang Linh Medicine: Nhac nho lich tu van ${data.reminderType}!\n\nBac si: ${data.doctorName}\nNgay: ${formattedDate}\nGio: ${data.time}\n\nVui long chuan bi san sang. Hotline: 1900-xxxx`
  }
} 