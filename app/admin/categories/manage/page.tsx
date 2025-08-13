'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/firebaseData'
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  icon: string
  description: string
  count: number
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    description: ''
  })

  // Check admin access
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Bạn không có quyền truy cập trang này')
      router.push('/')
      return
    }
  }, [user, router])

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [])

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories)
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCategories(filtered)
    }
  }, [searchTerm, categories])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await getCategories()
      setCategories(data)
      setFilteredCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Có lỗi khi tải danh mục')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục')
      return
    }

    if (categories.some(cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      toast.error('Danh mục này đã tồn tại')
      return
    }

    try {
      await addCategory(formData.name.trim())
      toast.success('Thêm danh mục thành công')
      setShowAddModal(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Có lỗi khi thêm danh mục')
    }
  }

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục')
      return
    }

    if (categories.some(cat => 
      cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      cat.id !== selectedCategory.id
    )) {
      toast.error('Danh mục này đã tồn tại')
      return
    }

    try {
      await updateCategory(selectedCategory.name, formData.name.trim())
      toast.success('Cập nhật danh mục thành công')
      setShowEditModal(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Có lỗi khi cập nhật danh mục')
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast.error('Không tìm thấy danh mục để xóa')
      return
    }

    try {
      await deleteCategory(selectedCategory.name)
      toast.success('Xóa danh mục thành công')
      setShowDeleteModal(false)
      setSelectedCategory(null)
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Có lỗi khi xóa danh mục')
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📦',
      description: ''
    })
    setSelectedCategory(null)
  }

  if (user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/admin')}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
              <p className="text-gray-600">Thêm, sửa, xóa danh mục sản phẩm</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm danh mục
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải danh mục...</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số sản phẩm
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{category.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {category.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {category.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => openEditModal(category)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => openDeleteModal(category)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm ? 'Không tìm thấy danh mục nào phù hợp' : 'Chưa có danh mục nào'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📦"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả danh mục"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleAddCategory}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Sửa danh mục</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên danh mục"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📦"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả danh mục"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={handleEditCategory}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Cập nhật
              </Button>
              <Button
                onClick={() => {
                  setShowEditModal(false)
                  resetForm()
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Xóa danh mục</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={handleDeleteCategory}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Xóa
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedCategory(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 