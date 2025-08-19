'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getAllConsultations, updateConsultationStatus } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

interface Consultation {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctorName: string
  doctorEmail: string
  doctorPhone: string
  subject: string
  message: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  scheduledDate: Date
  createdAt: Date
  updatedAt: Date
}

export default function ConsultationsManagement() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

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
    const matchesSearch = (consultation.patientName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (consultation.doctorName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (consultation.subject?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'confirmed':
        return <MessageCircle className="w-4 h-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
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
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (consultationId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateConsultationStatus(consultationId, newStatus)
      toast.success('Cập nhật trạng thái thành công!')
      loadConsultations()
    } catch (error) {
      console.error('Error updating consultation status:', error)
      toast.error('Lỗi khi cập nhật trạng thái')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý tư vấn</h1>
        <p className="mt-2 text-gray-600">Xem và quản lý tất cả yêu cầu tư vấn</p>
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
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hẹn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
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
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {consultation.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consultation.patientEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {consultation.doctorName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {consultation.doctorEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {consultation.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(consultation.scheduledDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                      {getStatusIcon(consultation.status)}
                      <span className="ml-1">{getStatusText(consultation.status)}</span>
                    </span>
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
                        Xem chi tiết
                      </Button>
                      <select
                        value={consultation.status}
                        onChange={(e) => handleStatusUpdate(consultation.id, e.target.value as 'pending' | 'confirmed' | 'completed' | 'cancelled')}
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
            <p className="text-gray-500">Không tìm thấy yêu cầu tư vấn nào</p>
          </div>
        )}
      </div>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chi tiết tư vấn #{selectedConsultation.id}</h2>
              <Button
                onClick={() => setSelectedConsultation(null)}
                variant="outline"
                size="sm"
              >
                Đóng
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin bệnh nhân</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tên:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.patientName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.patientEmail}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.patientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin bác sĩ</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Tên:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.doctorName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.doctorEmail}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedConsultation.doctorPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Chi tiết tư vấn</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Chủ đề:</span>
                  <span className="ml-2 text-sm text-gray-900">{selectedConsultation.subject}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Nội dung:</span>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedConsultation.message}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedConsultation.status)}`}>
                    {getStatusIcon(selectedConsultation.status)}
                    <span className="ml-1">{getStatusText(selectedConsultation.status)}</span>
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ngày hẹn:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatDate(selectedConsultation.scheduledDate)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatDate(selectedConsultation.createdAt)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Cập nhật lần cuối:</span>
                  <span className="ml-2 text-sm text-gray-900">{formatDate(selectedConsultation.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 