'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getUserOrders, cancelOrder } from '@/lib/orderService'
import { Order } from '@/types/order'
import AuthGuard from '@/components/AuthGuard'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Eye,
  Calendar,
  MapPin,
  CreditCard,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'

export default function OrdersPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        console.log('Loading orders for user:', user?.id)
        const ordersData = await getUserOrders()
        console.log('Orders loaded:', ordersData)
        setOrders(ordersData)
        setFilteredOrders(ordersData)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user?.id])

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return sortOrder === 'asc' 
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy, sortOrder])

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        const result = await cancelOrder(orderId)
        if (result.success) {
          // Reload orders
          const updatedOrders = await getUserOrders()
          setOrders(updatedOrders)
          alert('Hủy đơn hàng thành công!')
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi hủy đơn hàng')
      }
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý'
      case 'confirmed':
        return 'Đã xác nhận'
      case 'shipped':
        return 'Đang giao'
      case 'delivered':
        return 'Đã giao'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodText = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng'
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
            <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
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
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Sắp xếp theo ngày</option>
                <option value="amount">Sắp xếp theo giá trị</option>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải đơn hàng...</h3>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {orders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng'}
              </h3>
              <p className="text-gray-600 mb-4">
                {orders.length === 0 
                  ? 'Hãy mua sắm để tạo đơn hàng đầu tiên'
                  : 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                }
              </p>
              {orders.length === 0 && (
                <Button onClick={() => router.push('/products')}>
                  Mua sắm ngay
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Mã đơn: #{order.id.slice(-8)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-500">
                              Số lượng: {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {formatPrice(item.total)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Địa chỉ giao hàng
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Thông tin thanh toán
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Phương thức:</span> {getPaymentMethodText(order.paymentMethod)}</p>
                          <p><span className="font-medium">Trạng thái:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </span>
                          </p>
                          {order.notes && (
                            <p><span className="font-medium">Ghi chú:</span> {order.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Cập nhật lần cuối: {formatDate(order.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Chi tiết
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
} 