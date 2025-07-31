// Mô phỏng gửi SMS (không gửi thật)
export interface SMSData {
  to: string
  message: string
}

export async function sendSMS(data: SMSData): Promise<{ success: boolean; message: string }> {
  try {
    // Mô phỏng thời gian gửi SMS
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Log SMS để debug
    console.log('📱 SMS simulation:', {
      to: data.to,
      message: data.message.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    })
    
    return { 
      success: true, 
      message: 'SMS sent successfully (simulation)' 
    }
  } catch (error) {
    console.error('SMS simulation error:', error)
    return { 
      success: false, 
      message: `SMS sending failed: ${error}` 
    }
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
    message: `Hoang Linh Medicine: Xac nhan dat lich tu van thanh cong! Ma: ${data.bookingId}. Bac si: ${data.doctorName}. Ngay: ${formattedDate} luc ${data.time}. Hotline: 1900-xxxx`
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
    message: `Hoang Linh Medicine: Nhac nho lich tu van ${data.reminderType}! Bac si: ${data.doctorName}. Ngay: ${formattedDate} luc ${data.time}. Vui long chuan bi san sang. Hotline: 1900-xxxx`
  }
} 