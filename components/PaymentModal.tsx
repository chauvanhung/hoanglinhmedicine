'use client'

import { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode, 
  CheckCircle, 
  X, 
  Loader2,
  ExternalLink,
  Copy,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from './Toast'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  bookingId: string
  amount: number
  patientInfo: {
    name: string
    phone: string
    email?: string
  }
  consultationInfo: {
    doctorName: string
    specialty?: string
    date: string
    time: string
  }
  onPaymentSuccess: (paymentId: string) => void
}

interface PaymentMethod {
  id: 'momo' | 'vnpay' | 'zalopay' | 'bank_transfer'
  name: string
  icon: React.ReactNode
  description: string
  color: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'momo',
    name: 'MoMo',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'Ví điện tử MoMo',
    color: 'bg-pink-500'
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Cổng thanh toán VNPay',
    color: 'bg-blue-600'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'Ví điện tử ZaloPay',
    color: 'bg-blue-500'
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Chuyển khoản ngân hàng',
    color: 'bg-green-600'
  }
]

export default function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  patientInfo,
  consultationInfo,
  onPaymentSuccess
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')
  const [error, setError] = useState<string>('')
  const { success, error: showError } = useToast()

  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod('')
      setPaymentData(null)
      setPaymentStatus('pending')
      setError('')
    }
  }, [isOpen])

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Vui lòng chọn phương thức thanh toán')
      showError('Vui lòng chọn phương thức thanh toán')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          paymentMethod: selectedMethod,
          patientInfo,
          consultationInfo
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setPaymentData(result)
        setPaymentStatus('processing')
        success('Đã khởi tạo thanh toán thành công!')
        
        // For methods with payment URL, redirect or open in new tab
        if (result.paymentUrl && (selectedMethod === 'vnpay' || selectedMethod === 'zalopay')) {
          window.open(result.paymentUrl, '_blank')
        }
        
        // Start polling for payment status
        pollPaymentStatus(result.paymentId)
      } else {
        const errorMsg = result.error || 'Có lỗi xảy ra khi xử lý thanh toán'
        setError(errorMsg)
        setPaymentStatus('failed')
        showError(errorMsg)
      }
    } catch (error) {
      console.error('Payment error:', error)
      const errorMsg = 'Có lỗi xảy ra khi kết nối thanh toán'
      setError(errorMsg)
      setPaymentStatus('failed')
      showError(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30 // 5 minutes with 10-second intervals
    let attempts = 0

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment?paymentId=${paymentId}`)
        const result = await response.json()

        if (result.status === 'completed') {
          setPaymentStatus('success')
          success('Thanh toán thành công! Đặt lịch tư vấn đã được xác nhận.')
          
          // Store booking details in localStorage for the success page
          const bookingDetails = {
            paymentId,
            bookingId,
            doctorName: consultationInfo.doctorName,
            specialty: consultationInfo.specialty || 'Chuyên khoa',
            date: consultationInfo.date,
            time: consultationInfo.time,
            patientName: patientInfo.name,
            amount,
            paymentMethod: selectedMethod
          }
          localStorage.setItem('lastBookingDetails', JSON.stringify(bookingDetails))
          
          onPaymentSuccess(paymentId)
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000) // Check every 10 seconds
        } else {
          setPaymentStatus('failed')
          const errorMsg = 'Hết thời gian chờ thanh toán. Vui lòng thử lại.'
          setError(errorMsg)
          showError(errorMsg)
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000)
        }
      }
    }

    setTimeout(checkStatus, 5000) // Start checking after 5 seconds
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Thanh toán</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'pending' && (
            <>
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin đặt lịch</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bác sĩ:</span>
                    <span className="font-medium">{consultationInfo.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium">{consultationInfo.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giờ:</span>
                    <span className="font-medium">{consultationInfo.time}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary-600 pt-2 border-t">
                    <span>Tổng tiền:</span>
                    <span>{new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(amount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        selectedMethod === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${method.color}`}>
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={!selectedMethod || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán ngay'
                )}
              </Button>
            </>
          )}

          {paymentStatus === 'processing' && paymentData && (
            <div className="text-center">
              <div className="mb-6">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang xử lý thanh toán</h3>
                <p className="text-gray-600">{paymentData.message}</p>
              </div>

              {/* QR Code for mobile payments */}
              {paymentData.qrCode && (
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-3">
                      <QrCode className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Quét mã QR</span>
                    </div>
                    <img
                      src={paymentData.qrCode}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Payment URL for redirect methods */}
              {paymentData.paymentUrl && (
                <div className="mb-6">
                  <Button
                    onClick={() => window.open(paymentData.paymentUrl, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Mở trang thanh toán
                  </Button>
                </div>
              )}

              {/* Bank transfer info */}
              {selectedMethod === 'bank_transfer' && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Thông tin chuyển khoản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-medium">Vietcombank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">123456789</span>
                        <button
                          onClick={() => copyToClipboard('123456789')}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-medium">HOANG LINH MEDICINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nội dung:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-xs">{paymentData.paymentId}</span>
                        <button
                          onClick={() => copyToClipboard(paymentData.paymentId)}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500">
                Vui lòng hoàn tất thanh toán để xác nhận đặt lịch
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán thành công!</h3>
                <p className="text-gray-600">Đặt lịch tư vấn của bạn đã được xác nhận</p>
              </div>
              <Button onClick={onClose} className="w-full">
                Hoàn tất
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center">
              <div className="mb-6">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán thất bại</h3>
                <p className="text-gray-600">{error}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setPaymentStatus('pending')} className="w-full">
                  Thử lại
                </Button>
                <Button onClick={onClose} variant="outline" className="w-full">
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 