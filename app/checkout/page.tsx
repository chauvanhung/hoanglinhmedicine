'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { createOrder } from '@/lib/orderService'
import { CreateOrderData } from '@/types/order'
import { 
  MapPin, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle,
  AlertCircle,
  ShoppingCart
} from 'lucide-react'

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'momo' | 'vnpay'>('cod')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    // Wait a bit for auth state to load
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login?redirect=/checkout')
        return
      }
      
      if (items.length === 0) {
        router.push('/cart')
        return
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, items.length, router])

  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const shippingFee = totalAmount > 200000 ? 0 : 30000
  const finalTotal = totalAmount + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Bạn cần đăng nhập để thanh toán')
      return
    }

    if (items.length === 0) {
      alert('Giỏ hàng trống')
      return
    }

    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || 
        !shippingAddress.city || !shippingAddress.district || !shippingAddress.ward) {
      alert('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng')
      return
    }

    try {
      setIsSubmitting(true)

      const orderData: CreateOrderData = {
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        totalAmount: finalTotal,
        paymentMethod,
        shippingAddress,
        notes: notes.trim() || null
      }

      console.log('Cart items:', items)
      console.log('Creating order with data:', orderData)
      const result = await createOrder(orderData)
      
      if (result.success) {
        alert('Đặt hàng thành công! Mã đơn hàng: ' + result.orderId)
        clearCart()
        router.push('/orders')
      } else {
        console.error('Order creation failed:', result.message)
        alert('Lỗi: ' + result.message)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Có lỗi xảy ra khi đặt hàng: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (!isAuthenticated || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Địa chỉ giao hàng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Số nhà, tên đường, phường/xã"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.ward}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, ward: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                    <div className="text-sm text-gray-500">Miễn phí</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <div className="font-medium text-gray-900">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">Thanh toán khi nhận hàng (COD) - Chuyển khoản</div>
                    </div>
                    <div className="text-sm text-gray-500">Miễn phí</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <div className="font-medium text-gray-900">Ví MoMo</div>
                      <div className="text-sm text-gray-500">Thanh toán khi nhận hàng (COD) - MoMo</div>
                    </div>
                    <div className="text-sm text-gray-500">Miễn phí</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div>
                      <div className="font-medium text-gray-900">VNPay</div>
                      <div className="text-sm text-gray-500">Thanh toán khi nhận hàng (COD) - VNPay</div>
                    </div>
                    <div className="text-sm text-gray-500">Miễn phí</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ghi chú</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tóm tắt đơn hàng
              </h2>
              
              <div className="space-y-4">
                                 {items.map((item) => (
                   <div key={item.product.id} className="flex items-center space-x-3">
                     <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                       <Image
                         src={item.product.image}
                         alt={item.product.name}
                         fill
                         className="object-cover"
                       />
                     </div>
                     <div className="flex-1">
                       <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                       <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                     </div>
                     <div className="text-right">
                       <div className="font-medium text-gray-900 text-sm">
                         {formatPrice(item.product.price * item.quantity)}
                       </div>
                     </div>
                   </div>
                 ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cam kết của chúng tôi</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  <span>Chất lượng đảm bảo 100%</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Giao hàng nhanh chóng</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Hỗ trợ đổi trả dễ dàng</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-lg"
            >
              {isSubmitting ? 'Đang xử lý...' : `Đặt hàng - ${formatPrice(finalTotal)}`}
            </Button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  )
} 