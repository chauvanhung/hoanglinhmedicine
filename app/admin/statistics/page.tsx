'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Users, Package, Calendar, DollarSign, ShoppingCart, FileText, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getAllProducts, getAllOrders, getAllUsers, getAllConsultations } from '@/lib/firebaseData'
import { getAllHealthArticles } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

interface Statistics {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalConsultations: number
  totalArticles: number
  totalRevenue: number
  pendingOrders: number
  completedConsultations: number
  recentOrders: any[]
  recentConsultations: any[]
  topProducts: any[]
  categoryStats: any[]
}

export default function AdminStatisticsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [stats, setStats] = useState<Statistics>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalConsultations: 0,
    totalArticles: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedConsultations: 0,
    recentOrders: [],
    recentConsultations: [],
    topProducts: [],
    categoryStats: []
  })
  const [isLoading, setIsLoading] = useState(true)

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

  // Load statistics
  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      setIsLoading(true)
      
      // Load all data
      const [products, orders, users, consultations, articles] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllUsers(),
        getAllConsultations(),
        getAllHealthArticles()
      ])

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
      const pendingOrders = orders.filter(order => order.status === 'pending').length
      const completedConsultations = consultations.filter(consultation => consultation.status === 'completed').length

      // Get recent orders (last 5)
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get recent consultations (last 5)
      const recentConsultations = consultations
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      // Get top products by sales
      const productSales = products.map(product => ({
        ...product,
        sales: orders.reduce((sum, order) => {
          const orderItem = order.items.find((item: any) => item.id === product.id)
          return sum + (orderItem ? orderItem.quantity : 0)
        }, 0)
      }))
      const topProducts = productSales
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)

      // Get category statistics
      const categoryStats = products.reduce((acc, product) => {
        const category = product.category
        if (!acc[category]) {
          acc[category] = { name: category, count: 0, revenue: 0 }
        }
        acc[category].count++
        
        // Calculate revenue for this category
        const categoryOrders = orders.filter(order => 
          order.items.some((item: any) => item.category === category)
        )
        acc[category].revenue = categoryOrders.reduce((sum, order) => {
          const categoryItems = order.items.filter((item: any) => item.category === category)
          return sum + categoryItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0)
        }, 0)
        
        return acc
      }, {} as any)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalConsultations: consultations.length,
        totalArticles: articles.length,
        totalRevenue,
        pendingOrders,
        completedConsultations,
        recentOrders,
        recentConsultations,
        topProducts,
        categoryStats: Object.values(categoryStats)
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
      toast.error('Lỗi khi tải thống kê')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
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
              <h1 className="text-3xl font-bold text-gray-900">Thống kê tổng quan</h1>
              <p className="mt-2 text-gray-600">Tổng quan về hoạt động của hệ thống</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng tư vấn</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue and Activity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đơn hàng chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bài viết sức khỏe</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
            </div>
            <div className="p-6">
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' ? 'Chờ xử lý' :
                           order.status === 'processing' ? 'Đang xử lý' :
                           order.status === 'shipped' ? 'Đã gửi hàng' :
                           order.status === 'delivered' ? 'Đã giao hàng' :
                           'Đã hủy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
              )}
            </div>
          </div>

          {/* Recent Consultations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tư vấn gần đây</h3>
            </div>
            <div className="p-6">
              {stats.recentConsultations.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {consultation.doctorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {consultation.doctorSpecialty} • {formatDate(consultation.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(consultation.price)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          consultation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {consultation.status === 'pending' ? 'Chờ xác nhận' :
                           consultation.status === 'confirmed' ? 'Đã xác nhận' :
                           consultation.status === 'completed' ? 'Hoàn thành' :
                           'Đã hủy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Chưa có tư vấn nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Category Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thống kê theo danh mục</h3>
          </div>
          <div className="p-6">
            {stats.categoryStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh thu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.categoryStats.map((category: any, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.count} sản phẩm
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(category.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu danh mục</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 