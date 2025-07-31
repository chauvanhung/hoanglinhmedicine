'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import NotificationSettings from '@/components/NotificationSettings'
import { Bell, Smartphone, Mail, Clock, ArrowLeft, Search, Filter, Settings, Eye, RefreshCw } from 'lucide-react'

interface NotificationRecord {
  id: string
  type: 'sms' | 'email'
  recipient: string
  message: string
  bookingId?: string
  status: 'sent' | 'failed' | 'pending'
  sentAt: string
  consultationInfo?: {
    doctorName: string
    date: string
    time: string
    patientName: string
  }
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<NotificationRecord | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, typeFilter, statusFilter])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/notifications')
      const result = await response.json()
      if (result.success) {
        setNotifications(result.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = [...notifications]

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.consultationInfo?.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.consultationInfo?.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => notification.status === statusFilter)
    }

    setFilteredNotifications(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case 'failed':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case 'pending':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Đã gửi'
      case 'failed':
        return 'Thất bại'
      case 'pending':
        return 'Đang xử lý'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'pending':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewDetails = (notification: NotificationRecord) => {
    setSelectedNotification(notification)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <span>/</span>
          <span className="text-gray-900">Lịch sử thông báo</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử thông báo</h1>
            <p className="text-gray-600">Quản lý và theo dõi các thông báo đã gửi</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={fetchNotifications}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo số điện thoại, email, bác sĩ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại thông báo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="sms">SMS</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="sent">Đã gửi</option>
                <option value="failed">Thất bại</option>
                <option value="pending">Đang xử lý</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-gray-600">Chưa có thông báo nào được gửi hoặc không tìm thấy kết quả phù hợp.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {notification.type === 'sms' ? (
                          <Smartphone className="w-6 h-6 text-green-600" />
                        ) : (
                          <Mail className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.type === 'sms' ? 'SMS' : 'Email'} - {notification.recipient}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(notification.status)}
                            <span className={`text-sm font-medium ${getStatusColor(notification.status)}`}>
                              {getStatusText(notification.status)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {notification.consultationInfo && (
                          <div className="text-xs text-gray-500 space-y-1">
                            <p><span className="font-medium">Bác sĩ:</span> {notification.consultationInfo.doctorName}</p>
                            <p><span className="font-medium">Lịch hẹn:</span> {notification.consultationInfo.date} lúc {notification.consultationInfo.time}</p>
                            <p><span className="font-medium">Bệnh nhân:</span> {notification.consultationInfo.patientName}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(notification.sentAt)}</span>
                          </div>
                          {notification.bookingId && (
                            <span>ID: {notification.bookingId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <Button
                        onClick={() => handleViewDetails(notification)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-primary-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tổng thông báo</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Smartphone className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">SMS</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'sms').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'email').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Thành công</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'sent').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <NotificationSettings
              bookingId={selectedNotification?.bookingId}
              consultationInfo={selectedNotification?.consultationInfo}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
} 