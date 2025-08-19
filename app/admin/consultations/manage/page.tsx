'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, Eye, User, Calendar, Clock, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getAllConsultations, updateConsultationStatus } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

interface Consultation {
  id: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  symptoms: string
  notes?: string
  date: any
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  price: number
  paymentStatus: 'paid' | 'unpaid'
  paymentMethod?: string
}

export default function AdminConsultationsManagePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này')
      router.push('/')
      return
    }
  }, [isAuthenticated, user, router])

  // Load consultations
  useEffect(() => {
    loadConsultations()
  }, [])

  const loadConsultations = async () => {
    try {
      setIsLoading(true)
      const consultationsData = await getAllConsultations()
      setConsultations(consultationsData)
    } catch (error) {
      console.error('Error loading consultations:', error)
      toast.error('Lỗi khi tải danh sách tư vấn')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = async (consultationId: string, newStatus: string) => {
    try {
      await updateConsultationStatus(consultationId, newStatus)
      toast.success('Cập nhật trạng thái tư vấn thành công!')
      loadConsultations()
    } catch (error) {
      console.error('Error updating consultation status:', error)
      toast.error('Lỗi khi cập nhật trạng thái tư vấn')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'confirmed':
        return <Calendar className="w-4 h-4 text-blue-500" />
      case 'completed':
        return <Clock className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <Clock className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
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

  const formatDate = (date: any) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý tư vấn</h1>
              <p className="mt-2 text-gray-600">Xem và cập nhật trạng thái tư vấn</p>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Admin
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm tư vấn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {/* Consultations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin tư vấn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lịch hẹn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={consultation.doctorImage}
                          alt={consultation.doctorName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.doctorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {consultation.doctorSpecialty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">Triệu chứng:</div>
                        <div className="text-gray-500 max-w-xs truncate">
                          {consultation.symptoms}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(consultation.date)}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          {consultation.time} ({consultation.duration} phút)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(consultation.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {getStatusText(consultation.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatPrice(consultation.price)}</div>
                        <div className={`text-xs ${consultation.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {consultation.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setSelectedConsultation(consultation)}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                        <select
                          value={consultation.status}
                          onChange={(e) => handleStatusUpdate(consultation.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredConsultations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy tư vấn nào</p>
            </div>
          )}
        </div>

        {/* Consultation Detail Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Chi tiết tư vấn</h2>
                <Button
                  onClick={() => setSelectedConsultation(null)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Doctor Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin bác sĩ</h3>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={selectedConsultation.doctorImage}
                      alt={selectedConsultation.doctorName}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedConsultation.doctorName}</h4>
                      <p className="text-sm text-gray-500">{selectedConsultation.doctorSpecialty}</p>
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin tư vấn</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Triệu chứng:</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedConsultation.symptoms}</p>
                    </div>
                    {selectedConsultation.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ghi chú:</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedConsultation.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Lịch hẹn</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ngày:</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(selectedConsultation.date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời gian:</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedConsultation.time}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Thời lượng:</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedConsultation.duration} phút</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái:</label>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedConsultation.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedConsultation.status)}`}>
                          {getStatusText(selectedConsultation.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phí tư vấn:</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatPrice(selectedConsultation.price)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Trạng thái thanh toán:</label>
                      <p className={`text-sm font-medium mt-1 ${selectedConsultation.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedConsultation.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </p>
                    </div>
                    {selectedConsultation.paymentMethod && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phương thức thanh toán:</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedConsultation.paymentMethod}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Cập nhật trạng thái</h4>
                  <div className="flex space-x-2">
                    <select
                      value={selectedConsultation.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled'
                        handleStatusUpdate(selectedConsultation.id, newStatus)
                        setSelectedConsultation({ ...selectedConsultation, status: newStatus })
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 