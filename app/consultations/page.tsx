'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getUserConsultations, cancelConsultation, Consultation } from '@/lib/consultationService'
import { 
  Stethoscope, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  User,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  AlertCircle,
  Phone,
  MapPin
} from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ConsultationsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load consultations
  useEffect(() => {
    const loadConsultations = async () => {
      try {
        setIsLoading(true)
        console.log('Loading consultations for user:', user?.id)
        const consultationsData = await getUserConsultations()
        console.log('Fetched consultations:', consultationsData)
        setConsultations(consultationsData)
        setFilteredConsultations(consultationsData)
      } catch (error) {
        console.error('Error loading consultations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadConsultations()
    }
  }, [user?.id])

  // Filter and sort consultations
  useEffect(() => {
    let filtered = [...consultations]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(consultation => 
        consultation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter)
    }

    // Sort consultations
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime()
      } else {
        return sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price
      }
    })

    setFilteredConsultations(filtered)
  }, [consultations, searchTerm, statusFilter, sortBy, sortOrder])

  const handleCancelConsultation = async (consultationId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy lịch tư vấn này?')) {
      try {
        const result = await cancelConsultation(consultationId)
        if (result.success) {
          // Reload consultations
          const updatedConsultations = await getUserConsultations()
          setConsultations(updatedConsultations)
          alert('Hủy lịch tư vấn thành công!')
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi hủy lịch tư vấn')
      }
    }
  }

  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Stethoscope className="w-5 h-5 text-gray-500" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử tư vấn</h1>
              <p className="text-gray-600">Quản lý và theo dõi lịch tư vấn của bạn</p>
            </div>
            <Button onClick={() => window.location.href = '/consultation'}>
              <Plus className="w-4 h-4 mr-2" />
              Đặt lịch tư vấn mới
            </Button>
            <Button 
              onClick={async () => {
                try {
                  console.log('Creating test consultation for user:', user?.id)
                  const testConsultation = {
                    userId: user?.id || 'test-user',
                    doctorName: "Bác sĩ Nguyễn Văn An",
                    doctorSpecialty: "Tim mạch",
                    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
                    date: new Date("2024-01-15"),
                    time: "09:00",
                    duration: 30,
                    status: "completed",
                    symptoms: "Đau ngực, khó thở khi vận động",
                    notes: "Bệnh nhân cần theo dõi huyết áp thường xuyên",
                    price: 500000,
                    paymentStatus: "paid",
                    paymentMethod: "bank_transfer",
                    createdAt: new Date("2024-01-10"),
                    updatedAt: new Date("2024-01-15")
                  };
                  
                  console.log('Test consultation data:', testConsultation)
                  const docRef = await addDoc(collection(db, 'consultations'), testConsultation);
                  console.log('Created consultation with ID:', docRef.id)
                  alert('Đã tạo test consultation!');
                  window.location.reload();
                } catch (error) {
                  console.error('Error creating test consultation:', error)
                  alert('Lỗi: ' + (error as Error).message);
                }
              }}
              variant="outline"
              className="ml-2"
            >
              Tạo test data
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm lịch tư vấn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="date">Sắp xếp theo ngày</option>
              <option value="price">Sắp xếp theo giá</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              <span className="ml-2">{sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải lịch tư vấn...</h3>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {consultations.length === 0 ? 'Chưa có lịch tư vấn nào' : 'Không tìm thấy lịch tư vấn'}
            </h3>
            <p className="text-gray-600 mb-4">
              {consultations.length === 0 
                ? 'Hãy đặt lịch tư vấn đầu tiên với bác sĩ chuyên môn'
                : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
              }
            </p>
            {consultations.length === 0 && (
              <Button onClick={() => router.push('/consultation')}>
                Đặt lịch tư vấn ngay
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Consultation Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(consultation.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {getStatusText(consultation.status)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Mã lịch: #{consultation.id.slice(-8)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(consultation.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(consultation.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor Info */}
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                        <Image
                          src={consultation.doctorImage}
                          alt={consultation.doctorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{consultation.doctorName}</h3>
                        <p className="text-sm text-gray-500">{consultation.doctorSpecialty}</p>
                      </div>
                    </div>

                    {/* Appointment Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Ngày: {formatDate(consultation.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Giờ: {consultation.time} ({consultation.duration} phút)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span>Bệnh nhân: {user?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {consultation.symptoms && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Triệu chứng:</h4>
                      <p className="text-sm text-gray-600">{consultation.symptoms}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {consultation.notes && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Ghi chú:</h4>
                      <p className="text-sm text-blue-700">{consultation.notes}</p>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Thông tin thanh toán:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-900">Phương thức:</span>
                        <p className="text-green-700">{getPaymentMethodText(consultation.paymentMethod)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-900">Trạng thái:</span>
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
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật lần cuối: {formatDateTime(consultation.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/consultations/${consultation.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                      {consultation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelConsultation(consultation.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Hủy lịch
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Cần hỗ trợ về lịch tư vấn?</h3>
              <p className="text-blue-700 mb-3">
                Nếu bạn có câu hỏi về lịch tư vấn hoặc cần thay đổi lịch hẹn, hãy liên hệ với chúng tôi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Hotline: 1900-xxxx</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Giờ làm việc: 8:00 - 20:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 