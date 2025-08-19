'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, Shield, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getAllUsers, updateUserRole, deleteUser } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  displayName: string
  phoneNumber: string
  role: 'user' | 'admin'
  createdAt: Date
  lastLoginAt: Date
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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
    const matchesSearch = (user.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'user':
        return <User className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'user':
        return 'Người dùng'
      default:
        return 'Không xác định'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100'
      case 'user':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
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

  const handleRoleUpdate = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, newRole)
      toast.success('Cập nhật vai trò thành công!')
      loadUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast.error('Lỗi khi cập nhật vai trò')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast.success('Xóa người dùng thành công!')
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Lỗi khi xóa người dùng')
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="mt-2 text-gray-600">Xem và quản lý tất cả người dùng</p>
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
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'Chưa có tên'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {user.phoneNumber || 'Chưa có số điện thoại'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{getRoleText(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedUser(user)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </Button>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value as 'user' | 'admin')}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
              <Button
                onClick={() => setSelectedUser(null)}
                variant="outline"
                size="sm"
              >
                Đóng
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500">ID:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedUser.id}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Tên hiển thị:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {selectedUser.displayName || 'Chưa có tên'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Số điện thoại:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {selectedUser.phoneNumber || 'Chưa có số điện thoại'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Vai trò:</span>
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                  {getRoleIcon(selectedUser.role)}
                  <span className="ml-1">{getRoleText(selectedUser.role)}</span>
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                <span className="ml-2 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Đăng nhập lần cuối:</span>
                <span className="ml-2 text-sm text-gray-900">{formatDate(selectedUser.lastLoginAt)}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa người dùng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 