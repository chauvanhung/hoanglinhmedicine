import { NextRequest, NextResponse } from 'next/server'

interface PaymentRequest {
  bookingId: string
  amount: number
  paymentMethod: 'momo' | 'vnpay' | 'zalopay' | 'bank_transfer'
  patientInfo: {
    name: string
    phone: string
    email?: string
  }
  consultationInfo: {
    doctorName: string
    date: string
    time: string
  }
}

interface PaymentResponse {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  qrCode?: string
  message: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()
    
    // Validate required fields
    if (!body.bookingId || !body.amount || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Thiếu thông tin thanh toán' },
        { status: 400 }
      )
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      )
    }

    // Generate payment ID
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate payment processing based on method
    let paymentResponse: PaymentResponse

    switch (body.paymentMethod) {
      case 'momo':
        paymentResponse = {
          success: true,
          paymentId,
          paymentUrl: `https://momo.vn/pay/${paymentId}`,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo://payment?paymentId=${paymentId}`,
          message: 'Quét mã QR để thanh toán qua MoMo'
        }
        break

      case 'vnpay':
        paymentResponse = {
          success: true,
          paymentId,
          paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${body.amount * 100}&vnp_Command=pay&vnp_CreateDate=${Date.now()}&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+tu+van&vnp_OrderType=billpayment&vnp_ReturnUrl=${encodeURIComponent('https://yourdomain.com/payment/callback')}&vnp_TmnCode=DEMO&vnp_TxnRef=${paymentId}&vnp_Version=2.1.0`,
          message: 'Chuyển hướng đến VNPay để thanh toán'
        }
        break

      case 'zalopay':
        paymentResponse = {
          success: true,
          paymentId,
          paymentUrl: `https://zalopay.vn/pay/${paymentId}`,
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=zalopay://payment?paymentId=${paymentId}`,
          message: 'Quét mã QR để thanh toán qua ZaloPay'
        }
        break

      case 'bank_transfer':
        paymentResponse = {
          success: true,
          paymentId,
          message: 'Chuyển khoản ngân hàng',
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bank://transfer?account=123456789&amount=${body.amount}&content=${encodeURIComponent(`Thanh toan tu van ${paymentId}`)}`
        }
        break

      default:
        return NextResponse.json(
          { error: 'Phương thức thanh toán không được hỗ trợ' },
          { status: 400 }
        )
    }

    // Log payment attempt
    console.log('Payment initiated:', {
      paymentId,
      bookingId: body.bookingId,
      amount: body.amount,
      method: body.paymentMethod,
      timestamp: new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(paymentResponse)

  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xử lý thanh toán' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get('paymentId')

  if (!paymentId) {
    return NextResponse.json(
      { error: 'Thiếu mã thanh toán' },
      { status: 400 }
    )
  }

  // Simulate checking payment status
  // In real implementation, you would check with the payment provider
  const paymentStatus = Math.random() > 0.3 ? 'completed' : 'pending' // 70% success rate for demo

  return NextResponse.json({
    paymentId,
    status: paymentStatus,
    message: paymentStatus === 'completed' 
      ? 'Thanh toán thành công' 
      : 'Đang xử lý thanh toán'
  })
} 