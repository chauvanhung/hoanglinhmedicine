'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, BarChart3 } from 'lucide-react'
import { getAllProducts, getAllOrders, getAllUsers, getAllConsultations, getAllHealthArticles } from '@/lib/firebaseData'
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

export default function StatisticsDashboard() {
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
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
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

      // Get top products (by stock - lowest first)
      const topProducts = products
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)

      // Calculate category statistics
      const categoryStats = products.reduce((acc, product) => {
        const category = product.category || 'Không phân loại'
        if (!acc[category]) {
          acc[category] = { name: category, count: 0, totalValue: 0 }
        }
        acc[category].count++
        acc[category].totalValue += product.price * product.stock
        return acc
      }, {} as Record<string, { name: string; count: number; totalValue: number }>)

      const categoryStatsArray = Object.values(categoryStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

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
        categoryStats: categoryStatsArray
      })
    } catch (error) {
      console.error('Error loading statistics:', error)
      toast.error('Lỗi khi tải thống kê')
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <h1 className="text-3xl font-bold text-gray-900">Thống kê tổng quan</h1>
        <p className="mt-2 text-gray-600">Tổng quan về hoạt động của hệ thống</p>
      </div>

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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tư vấn</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Hoàn thành: {stats.completedConsultations}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Bài viết sức khỏe</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng chờ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Cần xử lý</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Đơn hàng #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customerName} • {formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                        order.status === 'confirmed' ? 'text-blue-600 bg-blue-100' :
                        order.status === 'delivered' ? 'text-green-600 bg-green-100' :
                        'text-gray-600 bg-gray-100'
                      }`}>
                        {order.status === 'pending' ? 'Chờ xử lý' :
                         order.status === 'confirmed' ? 'Đã xác nhận' :
                         order.status === 'delivered' ? 'Đã giao' : order.status}
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

        {/* Recent Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Tư vấn gần đây</h3>
          </div>
          <div className="p-6">
            {stats.recentConsultations.length > 0 ? (
              <div className="space-y-4">
                {stats.recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{consultation.subject}</p>
                        <p className="text-sm text-gray-500">{consultation.patientName} • {formatDate(consultation.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                        consultation.status === 'confirmed' ? 'text-blue-600 bg-blue-100' :
                        consultation.status === 'completed' ? 'text-green-600 bg-green-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {consultation.status === 'pending' ? 'Chờ xác nhận' :
                         consultation.status === 'confirmed' ? 'Đã xác nhận' :
                         consultation.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có tư vấn nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Thống kê theo danh mục</h3>
          </div>
          <div className="p-6">
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
                      Tổng giá trị
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.categoryStats.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(category.totalValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 