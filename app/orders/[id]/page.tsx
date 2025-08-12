'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getOrderById, cancelOrder } from '@/lib/orderService'
import { Order } from '@/types/order'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  AlertCircle,
  Printer
} from 'lucide-react'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  // Load order details
  useEffect(() => {
    const loadOrder = async () => {
      if (isAuthenticated && params?.id) {
        try {
          setIsLoading(true)
          const orderData = await getOrderById(params.id as string)
          if (orderData) {
            setOrder(orderData)
          } else {
            router.push('/orders')
          }
        } catch (error) {
          console.error('Error loading order:', error)
          router.push('/orders')
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadOrder()
  }, [isAuthenticated, params?.id, router])

  const handleCancelOrder = async () => {
    if (!order) return

    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        setIsCancelling(true)
        const result = await cancelOrder(order.id)
        if (result.success) {
          // Reload order
          const updatedOrder = await getOrderById(order.id)
          setOrder(updatedOrder)
          alert('Hủy đơn hàng thành công!')
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('Có lỗi xảy ra khi hủy đơn hàng')
      } finally {
        setIsCancelling(false)
      }
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />
      default:
        return <Package className="w-6 h-6 text-gray-500" />
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải chi tiết đơn hàng...</h3>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <Button onClick={() => router.push('/orders')}>
              Quay lại danh sách đơn hàng
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
            onClick={() => router.push('/orders')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đơn hàng #{order.id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Đặt hàng lúc {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="print:hidden"
              >
                <Printer className="w-4 h-4 mr-2" />
                In đơn hàng
              </Button>
              {order.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="text-red-600 border-red-300 hover:bg-red-50 print:hidden"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                {getStatusIcon(order.status)}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Trạng thái đơn hàng
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Đặt hàng: {formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Cập nhật lần cuối: {formatDate(order.updatedAt)}</span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-3" />
                    <span>Dự kiến giao: {formatDate(order.estimatedDelivery)}</span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-3" />
                    <span>Mã vận đơn: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sản phẩm đã đặt ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
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

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="text-gray-900">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin khách hàng
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{order.shippingAddress.fullName}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
                {user?.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.city}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Thông tin thanh toán
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Phương thức:</span>
                  <p className="text-gray-600">{getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Trạng thái:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </div>
                {order.notes && (
                  <div>
                    <span className="font-medium text-gray-900">Ghi chú:</span>
                    <p className="text-gray-600 mt-1">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Cần hỗ trợ?
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Nếu bạn có câu hỏi về đơn hàng này, hãy liên hệ với chúng tôi.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>📞 Hotline: 1900-xxxx</p>
                <p>📧 Email: support@hoanglinhmedicine.com</p>
                <p>💬 Chat: 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 