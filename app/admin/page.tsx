'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { 
  Grid, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  ArrowRight,
  TrendingUp,
  Calendar,
  DollarSign,
  User,
  Clock,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalUsers: number
}

interface RecentOrder {
  id: string
  customerName: string
  amount: number
  status: string
  date: string
}

interface LowStockProduct {
  id: string
  name: string
  stock: number
  category: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Check admin access
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này')
      router.push('/')
      return
    }
  }, [user, router])

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      // Simulate loading data - replace with actual API calls
      setTimeout(() => {
        setStats({
          totalProducts: 104,
          totalOrders: 2,
          totalRevenue: 400000,
          totalUsers: 25
        })
        setRecentOrders([
          {
            id: '1',
            customerName: 'Nguyễn Văn A',
            amount: 150000,
            status: 'Chờ xử lý',
            date: '13/08/2025 16:48'
          }
        ])
        setLowStockProducts([
          {
            id: '1',
            name: 'Paracetamol 500mg',
            stock: 5,
            category: 'Thuốc giảm đau'
          },
          {
            id: '2',
            name: 'Vitamin C 1000mg',
            stock: 3,
            category: 'Vitamin'
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Có lỗi khi tải dữ liệu')
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
      toast.success('Đăng xuất thành công')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Có lỗi khi đăng xuất')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xử lý':
        return 'text-yellow-600 bg-yellow-100'
      case 'Đã xác nhận':
        return 'text-blue-600 bg-blue-100'
      case 'Đã giao':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">Hoàng Linh Medicine</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <button className="w-full flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <Grid className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/admin/products/manage')}
                className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Package className="w-5 h-5 mr-3" />
                Sản phẩm
              </button>
              <button 
                onClick={() => router.push('/admin/categories/manage')}
                className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Package className="w-5 h-5 mr-3" />
                Danh mục
              </button>
              <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Đơn hàng
              </button>
              <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Users className="w-5 h-5 mr-3" />
                Người dùng
              </button>
              <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <MessageCircle className="w-5 h-5 mr-3" />
                Tư vấn
              </button>
              <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5 mr-3" />
                Thống kê
              </button>
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">CHÂU VĂN HƯNG</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <button className="w-full flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              Cài đặt
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-5 h-5 mr-2" />
            <span>13/8/2025</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải dữ liệu...</h3>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% so với tháng trước</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8% so với tháng trước</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15% so với tháng trước</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Người dùng</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5% so với tháng trước</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="p-6">
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <ShoppingCart className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Đơn hàng #{order.id}</p>
                              <p className="text-sm text-gray-500">{order.customerName} • {order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              <Clock className="w-3 h-3 mr-1" />
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Chưa có đơn hàng nào</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Low Stock Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Sản phẩm sắp hết hàng</h3>
                  <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                    Xem tất cả
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="p-6">
                  {lowStockProducts.length > 0 ? (
                    <div className="space-y-4">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Còn lại</p>
                            <p className="font-medium text-red-600">{product.stock} sản phẩm</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Không có sản phẩm nào sắp hết hàng</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 