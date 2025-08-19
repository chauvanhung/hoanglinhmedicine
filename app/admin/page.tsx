'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { getAllProducts, getAllOrders, getAllUsers } from '@/lib/firebaseData'
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
  AlertTriangle,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

// Import các component quản lý
import ProductsManagement from './components/ProductsManagement'
import CategoriesManagement from './components/CategoriesManagement'
import HealthArticlesManagement from './components/HealthArticlesManagement'
import OrdersManagement from './components/OrdersManagement'
import UsersManagement from './components/UsersManagement'
import ConsultationsManagement from './components/ConsultationsManagement'
import StatisticsDashboard from './components/StatisticsDashboard'

type TabType = 'dashboard' | 'products' | 'categories' | 'articles' | 'orders' | 'users' | 'consultations' | 'statistics'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isLoading, setIsLoading] = useState(false)

  // Check admin access
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này')
      router.push('/')
      return
    }
  }, [user, router])

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

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return <Grid className="w-5 h-5" />
      case 'products':
        return <Package className="w-5 h-5" />
      case 'categories':
        return <Package className="w-5 h-5" />
      case 'articles':
        return <FileText className="w-5 h-5" />
      case 'orders':
        return <ShoppingCart className="w-5 h-5" />
      case 'users':
        return <Users className="w-5 h-5" />
      case 'consultations':
        return <MessageCircle className="w-5 h-5" />
      case 'statistics':
        return <BarChart3 className="w-5 h-5" />
      default:
        return <Grid className="w-5 h-5" />
    }
  }

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard'
      case 'products':
        return 'Sản phẩm'
      case 'categories':
        return 'Danh mục'
      case 'articles':
        return 'Bài viết sức khỏe'
      case 'orders':
        return 'Đơn hàng'
      case 'users':
        return 'Người dùng'
      case 'consultations':
        return 'Tư vấn'
      case 'statistics':
        return 'Thống kê'
      default:
        return 'Dashboard'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard setActiveTab={setActiveTab} />
      case 'products':
        return <ProductsManagement />
      case 'categories':
        return <CategoriesManagement />
      case 'articles':
        return <HealthArticlesManagement />
      case 'orders':
        return <OrdersManagement />
      case 'users':
        return <UsersManagement />
      case 'consultations':
        return <ConsultationsManagement />
      case 'statistics':
        return <StatisticsDashboard />
      default:
        return <MainDashboard setActiveTab={setActiveTab} />
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
              {(['dashboard', 'products', 'categories', 'articles', 'orders', 'users', 'consultations', 'statistics'] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {getTabIcon(tab)}
                  <span className="ml-3">{getTabLabel(tab)}</span>
                </button>
              ))}
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
      <div className="ml-64">
        {renderTabContent()}
      </div>
    </div>
  )
}

// Main Dashboard Component
function MainDashboard({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load all data
      const [products, orders, users] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllUsers()
      ])

      // Calculate statistics
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)
      
      // Get recent orders (last 5)
      const recentOrdersData = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((order: any) => ({
          id: order.id,
          customerName: order.customerName,
          amount: order.totalAmount,
          status: order.status,
          date: new Date(order.createdAt).toLocaleDateString('vi-VN')
        }))

      // Get low stock products (stock < 10)
      const lowStockProductsData = products
        .filter((product: any) => product.stock < 10)
        .sort((a: any, b: any) => a.stock - b.stock)
        .slice(0, 5)
        .map((product: any) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          stock: product.stock
        }))

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalUsers: users.length
      })
      setRecentOrders(recentOrdersData)
      setLowStockProducts(lowStockProductsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
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
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-8">
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveTab('orders')}
                >
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveTab('products')}
                >
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
  )
} 