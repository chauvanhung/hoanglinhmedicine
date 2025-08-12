'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { getUserOrders, createOrder } from '@/lib/orderService'
import { Order } from '@/types/order'
import { CreateOrderData } from '@/types/order'

export default function DebugPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const checkOrders = async () => {
    setLoading(true)
    try {
      const userOrders = await getUserOrders()
      setOrders(userOrders)
      console.log('Debug - User orders:', userOrders)
    } catch (error) {
      console.error('Debug - Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTestOrder = async () => {
    if (!user) {
      alert('Cần đăng nhập để tạo test order')
      return
    }

    try {
      const testOrderData: CreateOrderData = {
        items: [
          {
            productId: "test-product-1",
            productName: "Thuốc test 1",
            productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
            price: 50000,
            quantity: 2,
            total: 100000
          },
          {
            productId: "test-product-2",
            productName: "Thuốc test 2", 
            productImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
            price: 75000,
            quantity: 1,
            total: 75000
          }
        ],
        totalAmount: 175000,
        paymentMethod: "cod",
        shippingAddress: {
          fullName: "Nguyễn Văn Test",
          phone: "0123456789",
          address: "123 Đường Test",
          city: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé"
        },
        notes: "Test order từ debug page"
      }

      console.log('Creating test order:', testOrderData)
      const result = await createOrder(testOrderData)
      
      if (result.success) {
        alert(`Test order created successfully! Order ID: ${result.orderId}`)
        // Refresh orders list
        checkOrders()
      } else {
        alert(`Failed to create test order: ${result.message}`)
      }
    } catch (error) {
      console.error('Error creating test order:', error)
      alert('Error creating test order')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      checkOrders()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Debug Page</h1>
          <p className="text-gray-600">Vui lòng đăng nhập để xem debug info</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Page</h1>
        
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Info</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
          <div className="space-y-3">
            <button
              onClick={createTestOrder}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Tạo Test Order
            </button>
            <button
              onClick={checkOrders}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ml-3"
            >
              {loading ? 'Loading...' : 'Refresh Orders'}
            </button>
          </div>
        </div>

        {/* Orders Debug */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Orders Debug</h2>
          </div>
          
          <div className="space-y-4">
            <p><strong>Total Orders:</strong> {orders.length}</p>
            
            {orders.length === 0 ? (
              <p className="text-gray-500">Không có orders nào</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Order ID: {order.id}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>User ID:</strong> {order.userId}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                        <p><strong>Items Count:</strong> {order.items.length}</p>
                      </div>
                      <div>
                        <p><strong>Created:</strong> {order.createdAt.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                      </div>
                    </div>
                    
                    {order.items.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {index + 1}. {item.productName} - Qty: {item.quantity} - Price: {item.price}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 