'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock as ClockIcon,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react'

interface PaymentRecord {
  id: string
  bookingId: string
  amount: number
  paymentMethod: string
  status: 'completed' | 'pending' | 'failed'
  createdAt: string
  consultationInfo: {
    doctorName: string
    date: string
    time: string
    patientName: string
  }
}

// Mock data - in real app, this would come from API
const mockPaymentRecords: PaymentRecord[] = [
  {
    id: 'PAY_1703123456789_abc123',
    bookingId: 'CONS_1703123456789_abc123',
    amount: 500000,
    paymentMethod: 'MoMo',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    consultationInfo: {
      doctorName: 'BS. Nguyễn Văn An',
      date: '2024-01-20',
      time: '14:00',
      patientName: 'Nguyễn Văn A'
    }
  },
  {
    id: 'PAY_1703123456790_def456',
    bookingId: 'CONS_1703123456790_def456',
    amount: 450000,
    paymentMethod: 'VNPay',
    status: 'pending',
    createdAt: '2024-01-14T15:45:00Z',
    consultationInfo: {
      doctorName: 'BS. Trần Thị Bình',
      date: '2024-01-18',
      time: '09:00',
      patientName: 'Trần Thị B'
    }
  },
  {
    id: 'PAY_1703123456791_ghi789',
    bookingId: 'CONS_1703123456791_ghi789',
    amount: 550000,
    paymentMethod: 'ZaloPay',
    status: 'failed',
    createdAt: '2024-01-13T11:20:00Z',
    consultationInfo: {
      doctorName: 'BS. Lê Văn Cường',
      date: '2024-01-16',
      time: '16:00',
      patientName: 'Lê Văn C'
    }
  }
]

export default function PaymentHistoryPage() {
  const router = useRouter()
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(mockPaymentRecords)
  const [filteredRecords, setFilteredRecords] = useState<PaymentRecord[]>(mockPaymentRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Filter records based on search term and status
    let filtered = paymentRecords

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.consultationInfo.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.consultationInfo.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    setFilteredRecords(filtered)
  }, [paymentRecords, searchTerm, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Thành công'
      case 'pending':
        return 'Đang xử lý'
      case 'failed':
        return 'Thất bại'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-primary-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Trang chủ
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Lịch sử thanh toán</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lịch sử thanh toán</h1>
          <p className="text-gray-600">
            Xem lại các giao dịch thanh toán và đặt lịch tư vấn của bạn
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bác sĩ, bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Thành công</option>
                <option value="pending">Đang xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            {/* Total Records */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">
                Tổng cộng: <span className="font-semibold">{filteredRecords.length}</span> giao dịch
              </span>
            </div>
          </div>
        </div>

        {/* Payment Records */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy giao dịch nào
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Thử thay đổi bộ lọc tìm kiếm'
                  : 'Bạn chưa có giao dịch thanh toán nào'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => router.push('/consultation')}>
                  Đặt lịch tư vấn ngay
                </Button>
              )}
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Left side - Consultation info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {record.consultationInfo.doctorName}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{record.consultationInfo.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{record.consultationInfo.time}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Bệnh nhân: {record.consultationInfo.patientName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Payment info */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(record.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {record.paymentMethod}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      {formatDate(record.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Payment details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Mã đặt lịch:</span>
                      <div className="font-mono text-gray-900">{record.bookingId}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Mã thanh toán:</span>
                      <div className="font-mono text-gray-900">{record.id}</div>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      {record.status === 'failed' && (
                        <Button size="sm" variant="outline" onClick={() => router.push('/consultation')}>
                          Thử lại
                        </Button>
                      )}
                      {record.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => router.push('/consultation')}>
                          Đặt lịch mới
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 