'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getConsultationById, cancelConsultation, Consultation } from '@/lib/consultationService'
import { 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Calendar,
  User,
  AlertCircle,
  Printer,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Video,
  MessageCircle
} from 'lucide-react'

export default function ConsultationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  // Load consultation details
  useEffect(() => {
    const loadConsultation = async () => {
      if (isAuthenticated && params?.id) {
        try {
          setIsLoading(true)
          const consultationData = await getConsultationById(params.id as string)
          if (consultationData) {
            setConsultation(consultationData)
          } else {
            router.push('/consultations')
          }
        } catch (error) {
          console.error('Error loading consultation:', error)
          router.push('/consultations')
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadConsultation()
  }, [isAuthenticated, params?.id, router])

  const handleCancelConsultation = async () => {
    if (!consultation) return

    if (confirm('Bạn có chắc chắn muốn hủy lịch tư vấn này?')) {
      try {
        setIsCancelling(true)
        const result = await cancelConsultation(consultation.id)
        if (result.success) {
          // Reload consultation
          const updatedConsultation = await getConsultationById(consultation.id)
          setConsultation(updatedConsultation)
          alert('Hủy lịch tư vấn thành công!')
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi hủy lịch tư vấn')
      } finally {
        setIsCancelling(false)
      }
    }
  }

  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Stethoscope className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusText = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'completed':
        return 'Đã hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodText = (method: Consultation['paymentMethod']) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi tư vấn'
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng'
      case 'momo':
        return 'Ví MoMo'
      case 'vnpay':
        return 'VNPay'
      default:
        return 'Không xác định'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải chi tiết lịch tư vấn...</h3>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch tư vấn</h3>
            <Button onClick={() => router.push('/consultations')}>
              Quay lại danh sách lịch tư vấn
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/consultations')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách lịch tư vấn
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết lịch tư vấn #{consultation.id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Đặt lịch lúc {formatDateTime(consultation.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="print:hidden"
              >
                <Printer className="w-4 h-4 mr-2" />
                In lịch tư vấn
              </Button>
              {consultation.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancelConsultation}
                  disabled={isCancelling}
                  className="text-red-600 border-red-300 hover:bg-red-50 print:hidden"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {isCancelling ? 'Đang hủy...' : 'Hủy lịch tư vấn'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Consultation Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                {getStatusIcon(consultation.status)}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Trạng thái lịch tư vấn
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Ngày tư vấn: {formatDate(consultation.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3" />
                  <span>Giờ tư vấn: {consultation.time} ({consultation.duration} phút)</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Đặt lịch: {formatDateTime(consultation.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Cập nhật lần cuối: {formatDateTime(consultation.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin bác sĩ
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden">
                  <Image
                    src={consultation.doctorImage}
                    alt={consultation.doctorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{consultation.doctorName}</h3>
                  <p className="text-gray-600 mb-2">{consultation.doctorSpecialty}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Video className="w-4 h-4 mr-1" />
                      <span>Tư vấn online</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>Chat trực tuyến</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin bệnh nhân
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-900">Họ và tên:</span>
                  <span className="ml-2 text-gray-600">{user?.name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="font-medium text-gray-900">Số điện thoại:</span>
                  <span className="ml-2 text-gray-600">{user?.phone}</span>
                </div>
                {user?.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="font-medium text-gray-900">Email:</span>
                    <span className="ml-2 text-gray-600">{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Symptoms and Notes */}
            <div className="space-y-6">
              {/* Symptoms */}
              {consultation.symptoms && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Triệu chứng
                  </h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{consultation.symptoms}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {consultation.notes && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ghi chú
                  </h2>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700">{consultation.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Thông tin thanh toán
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Phí tư vấn:</span>
                  <div className="text-lg font-bold text-primary-600 mt-1">
                    {formatPrice(consultation.price)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Phương thức:</span>
                  <p className="text-gray-600 mt-1">{getPaymentMethodText(consultation.paymentMethod)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Trạng thái:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consultation.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consultation.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chi tiết lịch hẹn
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">Ngày:</span>
                    <p className="text-gray-600">{formatDate(consultation.date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">Giờ:</span>
                    <p className="text-gray-600">{consultation.time}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Stethoscope className="w-4 h-4 mr-3 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">Thời gian:</span>
                    <p className="text-gray-600">{consultation.duration} phút</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Cần hỗ trợ?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Nếu bạn có câu hỏi về lịch tư vấn này, hãy liên hệ với chúng tôi.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Hotline: 1900-xxxx</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Email: support@hoanglinhmedicine.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {consultation.status === 'confirmed' && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Hướng dẫn tham gia tư vấn
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• Đăng nhập vào hệ thống 10 phút trước giờ hẹn</p>
                  <p>• Chuẩn bị thông tin bệnh án và thuốc đang dùng</p>
                  <p>• Đảm bảo kết nối internet ổn định</p>
                  <p>• Chuẩn bị không gian yên tĩnh</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 