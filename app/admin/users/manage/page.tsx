'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowLeft, Eye, User, Mail, Phone, Shield, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getAllUsers, updateUserRole, deleteUser } from '@/lib/firebaseData'
import { User as UserType } from '@/store/auth'
import toast from 'react-hot-toast'

interface ExtendedUser extends UserType {
  createdAt: any
  lastLoginAt?: any
  address?: string
}

export default function AdminUsersManagePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [users, setUsers] = useState<ExtendedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null)
  const [roleFilter, setRoleFilter] = useState('all')

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

  // Load users
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Lỗi khi tải danh sách người dùng')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      toast.success('Cập nhật vai trò người dùng thành công!')
      loadUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Lỗi khi cập nhật vai trò người dùng')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return

    try {
      await deleteUser(userId)
      toast.success('Xóa người dùng thành công!')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Lỗi khi xóa người dùng')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'user':
        return 'Người dùng'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'user':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
              <p className="mt-2 text-gray-600">Xem và quản lý tài khoản người dùng</p>
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={userItem.avatar || 'https://via.placeholder.com/40x40?text=U'}
                            alt={userItem.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {userItem.id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {userItem.email}
                        </div>
                        {userItem.phone && (
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {userItem.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRoleIcon(userItem.role)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                          {getRoleText(userItem.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(userItem.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setSelectedUser(userItem)}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                        <select
                          value={userItem.role}
                          onChange={(e) => handleRoleUpdate(userItem.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="user">Người dùng</option>
                          <option value="admin">Quản trị viên</option>
                        </select>
                        {userItem.id !== user?.id && (
                          <Button
                            onClick={() => handleDeleteUser(userItem.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
                <Button
                  onClick={() => setSelectedUser(null)}
                  variant="outline"
                  size="sm"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="text-center">
                  <img
                    className="h-20 w-20 rounded-full object-cover mx-auto mb-4"
                    src={selectedUser.avatar || 'https://via.placeholder.com/80x80?text=U'}
                    alt={selectedUser.name}
                  />
                  <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin liên hệ</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{selectedUser.phone}</span>
                      </div>
                    )}
                    {selectedUser.address && (
                      <div className="flex items-start">
                        <div className="w-4 h-4 mr-3 text-gray-400 mt-0.5">📍</div>
                        <span className="text-sm">{selectedUser.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Thông tin tài khoản</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Vai trò:</span>
                      <div className="flex items-center">
                        {getRoleIcon(selectedUser.role)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                          {getRoleText(selectedUser.role)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Ngày tham gia:</span>
                      <span className="text-sm">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    {selectedUser.lastLoginAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Đăng nhập cuối:</span>
                        <span className="text-sm">{formatDate(selectedUser.lastLoginAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Thao tác</h4>
                  <div className="space-y-2">
                    <select
                      value={selectedUser.role}
                      onChange={(e) => {
                        handleRoleUpdate(selectedUser.id, e.target.value)
                        setSelectedUser({ ...selectedUser, role: e.target.value as 'user' | 'admin' })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                    {selectedUser.id !== user?.id && (
                      <Button
                        onClick={() => {
                          handleDeleteUser(selectedUser.id)
                          setSelectedUser(null)
                        }}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Xóa người dùng
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 