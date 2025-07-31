'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Clock, User, ArrowLeft, Download, Mail, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NotificationReminder from '@/components/NotificationReminder'

interface BookingDetails {
  paymentId: string
  bookingId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  patientName: string
  amount: number
  paymentMethod: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReminders, setShowReminders] = useState(false)

  useEffect(() => {
    // Get booking details from URL params and localStorage
    const paymentId = searchParams.get('paymentId')
    const bookingId = searchParams.get('bookingId')
    
    // Try to get booking details from localStorage first
    const storedBookingDetails = localStorage.getItem('lastBookingDetails')
    
    if (storedBookingDetails) {
      try {
        const parsedDetails = JSON.parse(storedBookingDetails)
        // Update with actual payment ID from URL
        const actualDetails: BookingDetails = {
          ...parsedDetails,
          paymentId: paymentId || parsedDetails.paymentId,
          bookingId: bookingId || parsedDetails.bookingId
        }
        setBookingDetails(actualDetails)
        setIsLoading(false)
        return
      } catch (error) {
        console.error('Error parsing stored booking details:', error)
      }
    }
    
    // Fallback to mock data if no stored details found
    const mockBookingDetails: BookingDetails = {
      paymentId: paymentId || 'PAY_1703123456789_abc123',
      bookingId: bookingId || 'CONS_1703123456789_abc123',
      doctorName: 'BS. Nguyễn Văn An',
      specialty: 'Tim mạch',
      date: '2024-01-20',
      time: '14:00',
      patientName: 'Nguyễn Văn A',
      amount: 500000,
      paymentMethod: 'MoMo'
    }

    setBookingDetails(mockBookingDetails)
    setIsLoading(false)
  }, [searchParams])

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    alert('Tính năng tải hóa đơn sẽ được cập nhật sớm!')
  }

  const handleSendEmail = () => {
    // In a real app, this would send confirmation email
    alert('Email xác nhận đã được gửi!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Đặt lịch tư vấn của bạn đã được xác nhận. 
            Chúng tôi sẽ liên hệ để xác nhận chi tiết.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              Mã đặt lịch: <span className="font-mono">{bookingDetails?.bookingId}</span>
            </p>
            <p className="text-green-800 font-medium">
              Mã thanh toán: <span className="font-mono">{bookingDetails?.paymentId}</span>
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Chi tiết đặt lịch</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bác sĩ</p>
                <p className="font-semibold text-gray-900">{bookingDetails?.doctorName}</p>
                <p className="text-sm text-gray-600">{bookingDetails?.specialty}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ngày tư vấn</p>
                <p className="font-semibold text-gray-900">
                  {bookingDetails?.date ? new Date(bookingDetails.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Giờ tư vấn</p>
                <p className="font-semibold text-gray-900">{bookingDetails?.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bệnh nhân</p>
                <p className="font-semibold text-gray-900">{bookingDetails?.patientName}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí tư vấn:</span>
              <span className="text-lg font-bold text-primary-600">
                {bookingDetails?.amount ? new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(bookingDetails.amount) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium text-gray-900">{bookingDetails?.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Những bước tiếp theo</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 font-bold text-xs">1</span>
              </div>
              <p>Chúng tôi sẽ gửi email xác nhận trong vòng 24 giờ</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 font-bold text-xs">2</span>
              </div>
              <p>Bác sĩ sẽ liên hệ trước giờ tư vấn 30 phút</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-800 font-bold text-xs">3</span>
              </div>
              <p>Cuộc tư vấn sẽ diễn ra qua video call hoặc điện thoại</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleDownloadReceipt} variant="outline" className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Tải hóa đơn
            </Button>
            <Button onClick={handleSendEmail} variant="outline" className="w-full">
              <Mail className="w-5 h-5 mr-2" />
              Gửi email xác nhận
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => setShowReminders(true)} className="w-full">
              <Bell className="w-5 h-5 mr-2" />
              Cài đặt nhắc nhở
            </Button>
            <Button onClick={() => router.push('/consultation')} variant="outline" className="w-full">
              Đặt lịch mới
            </Button>
          </div>
          
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Về trang chủ
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Cần hỗ trợ? Liên hệ chúng tôi:</p>
          <p className="font-medium">Hotline: 1900-xxxx | Email: support@hoanglinhmedicine.com</p>
        </div>
      </main>

      <Footer />

      {/* Notification Reminder Modal */}
      {showReminders && bookingDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Cài đặt nhắc nhở</h2>
                <button
                  onClick={() => setShowReminders(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <NotificationReminder
                  consultationInfo={{
                    doctorName: bookingDetails.doctorName,
                    date: bookingDetails.date,
                    time: bookingDetails.time,
                    patientName: bookingDetails.patientName
                  }}
                  bookingId={bookingDetails.bookingId}
                  onReminderSent={() => {
                    // Optionally close modal or show success message
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 