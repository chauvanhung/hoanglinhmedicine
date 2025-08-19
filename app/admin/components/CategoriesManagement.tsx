'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getCategories, addCategory, updateCategory, deleteCategory, Category } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrescription: false
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Lỗi khi tải danh sách danh mục')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = (category.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isPrescription: false
    })
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await addCategory(formData.name, formData.isPrescription)
      toast.success('Thêm danh mục thành công!')
      setShowAddModal(false)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Lỗi khi thêm danh mục')
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingCategory) return

    try {
      await updateCategory(editingCategory.name, formData.name, formData.isPrescription)
      toast.success('Cập nhật danh mục thành công!')
      setEditingCategory(null)
      resetForm()
      loadCategories()
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Lỗi khi cập nhật danh mục')
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return

    try {
      await deleteCategory(deletingCategory.name)
      toast.success('Xóa danh mục thành công!')
      setDeletingCategory(null)
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Lỗi khi xóa danh mục')
    }
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      isPrescription: category.isPrescription || false
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
        <p className="mt-2 text-gray-600">Thêm, sửa và xóa danh mục sản phẩm</p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {category.count} sản phẩm
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.isPrescription 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {category.isPrescription ? 'Thuốc kê đơn' : 'Thuốc thường'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => openEditModal(category)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        onClick={() => setDeletingCategory(category)}
                        variant="outline"
                        size="sm"
                        className="flex items-center text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy danh mục nào</p>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Thêm danh mục mới</h2>
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPrescription"
                    checked={formData.isPrescription}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Đây là danh mục thuốc kê đơn
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  Thêm danh mục
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Sửa danh mục</h2>
            <form onSubmit={handleEditCategory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập tên danh mục"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập mô tả danh mục"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPrescription"
                    checked={formData.isPrescription}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Đây là danh mục thuốc kê đơn
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCategory(null)
                    resetForm()
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  Cập nhật
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa danh mục "{deletingCategory.name}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeletingCategory(null)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 