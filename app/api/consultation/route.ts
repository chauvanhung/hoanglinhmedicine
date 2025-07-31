import { NextRequest, NextResponse } from 'next/server'

interface ConsultationRequest {
  doctorId: string
  doctorName: string
  date: string
  time: string
  patient: {
    name: string
    phone: string
    email?: string
    symptoms: string
    notes?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json()
    
    // Validate required fields
    if (!body.doctorId || !body.date || !body.time || !body.patient.name || !body.patient.phone) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Validate date format
    const appointmentDate = new Date(body.date)
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: 'Ngày không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if date is in the future
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (appointmentDate < today) {
      return NextResponse.json(
        { error: 'Ngày đặt lịch phải trong tương lai' },
        { status: 400 }
      )
    }

    // Generate booking ID
    const bookingId = `CONS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email/SMS
    // 3. Notify the doctor
    // 4. Check for conflicts
    
    // For now, we'll just log and return success
    console.log('New consultation booking:', {
      id: bookingId,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Đặt lịch tư vấn thành công! Vui lòng hoàn tất thanh toán.',
      bookingId: bookingId,
      appointment: {
        doctor: body.doctorName,
        date: body.date,
        time: body.time,
        patient: body.patient.name
      }
    })

  } catch (error) {
    console.error('Error processing consultation booking:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý yêu cầu' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Get available doctors and their schedules
  const doctors = [
    {
      id: '1',
      name: 'BS. Nguyễn Văn An',
      specialty: 'Tim mạch',
      experience: '15 năm kinh nghiệm',
      rating: 4.8,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face&q=80',
      availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      price: 500000,
      description: 'Chuyên gia tim mạch với hơn 15 năm kinh nghiệm trong điều trị các bệnh lý tim mạch, tăng huyết áp, suy tim.',
      qualifications: ['Bác sĩ chuyên khoa Tim mạch', 'Thành viên Hội Tim mạch Việt Nam', 'Chứng chỉ siêu âm tim']
    },
    {
      id: '2',
      name: 'BS. Trần Thị Bình',
      specialty: 'Nội tiết',
      experience: '12 năm kinh nghiệm',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1594824475544-3c0b0c0c0c0c?w=200&h=200&fit=crop&crop=face&q=80',
      availableSlots: ['08:00', '09:00', '13:00', '14:00', '15:00'],
      price: 450000,
      description: 'Chuyên gia nội tiết chuyên điều trị đái tháo đường, bệnh tuyến giáp và các rối loạn nội tiết khác.',
      qualifications: ['Bác sĩ chuyên khoa Nội tiết', 'Thành viên Hội Nội tiết Việt Nam', 'Chứng chỉ điều trị đái tháo đường']
    },
    {
      id: '3',
      name: 'BS. Lê Văn Cường',
      specialty: 'Tiêu hóa',
      experience: '18 năm kinh nghiệm',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&q=80',
      availableSlots: ['10:00', '11:00', '15:00', '16:00', '17:00'],
      price: 550000,
      description: 'Chuyên gia tiêu hóa với kinh nghiệm điều trị các bệnh lý dạ dày, gan mật, đại tràng.',
      qualifications: ['Bác sĩ chuyên khoa Tiêu hóa', 'Thành viên Hội Tiêu hóa Việt Nam', 'Chứng chỉ nội soi tiêu hóa']
    },
    {
      id: '4',
      name: 'BS. Phạm Thị Dung',
      specialty: 'Nhi khoa',
      experience: '10 năm kinh nghiệm',
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face&q=80',
      availableSlots: ['08:00', '09:00', '10:00', '14:00', '15:00'],
      price: 400000,
      description: 'Bác sĩ nhi khoa chuyên điều trị các bệnh lý thường gặp ở trẻ em, tư vấn dinh dưỡng và tiêm chủng.',
      qualifications: ['Bác sĩ chuyên khoa Nhi', 'Thành viên Hội Nhi khoa Việt Nam', 'Chứng chỉ dinh dưỡng nhi khoa']
    }
  ]

  return NextResponse.json({ doctors })
} 