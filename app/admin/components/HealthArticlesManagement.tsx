'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getAllHealthArticles, getHealthArticleById, HealthArticle } from '@/lib/firebaseData'
import { addDoc, updateDoc, deleteDoc, collection, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function HealthArticlesManagement() {
  const [articles, setArticles] = useState<HealthArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<HealthArticle | null>(null)
  const [deletingArticle, setDeletingArticle] = useState<HealthArticle | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    publishedAt: '',
    category: '',
    image: '',
    tags: ''
  })

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setIsLoading(true)
      const articlesData = await getAllHealthArticles()
      setArticles(articlesData)
    } catch (error) {
      console.error('Error loading articles:', error)
      toast.error('Lỗi khi tải danh sách bài viết')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = (article.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (article.author?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      publishedAt: '',
      category: '',
      image: '',
      tags: ''
    })
  }

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addDoc(collection(db, 'health-articles'), articleData)
      toast.success('Thêm bài viết thành công!')
      setShowAddModal(false)
      resetForm()
      loadArticles()
    } catch (error) {
      console.error('Error adding article:', error)
      toast.error('Lỗi khi thêm bài viết')
    }
  }

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingArticle) return

    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date()
      }

      await updateDoc(doc(db, 'health-articles', editingArticle.id), articleData)
      toast.success('Cập nhật bài viết thành công!')
      setEditingArticle(null)
      resetForm()
      loadArticles()
    } catch (error) {
      console.error('Error updating article:', error)
      toast.error('Lỗi khi cập nhật bài viết')
    }
  }

  const handleDeleteArticle = async () => {
    if (!deletingArticle) return

    try {
      await deleteDoc(doc(db, 'health-articles', deletingArticle.id))
      toast.success('Xóa bài viết thành công!')
      setDeletingArticle(null)
      loadArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
      toast.error('Lỗi khi xóa bài viết')
    }
  }

  const openEditModal = (article: HealthArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      author: article.author,
      publishedAt: article.publishedAt,
      category: article.category,
      image: article.image,
      tags: article.tags.join(', ')
    })
  }

  const formatDate = (date: any) => {
    if (date?.toDate) {
      return date.toDate().toLocaleDateString('vi-VN')
    }
    return new Date(date).toLocaleDateString('vi-VN')
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết sức khỏe</h1>
        <p className="mt-2 text-gray-600">Thêm, sửa, xóa bài viết sức khỏe</p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
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
          Thêm bài viết
        </Button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {article.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {article.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedArticle(article)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                      <Button
                        onClick={() => openEditModal(article)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        onClick={() => setDeletingArticle(article)}
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
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy bài viết nào</p>
          </div>
        )}
      </div>

      {/* Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Thêm bài viết mới</h2>
            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tóm tắt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày xuất bản *
                  </label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Sức khỏe tổng quát">Sức khỏe tổng quát</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Bệnh tiểu đường">Bệnh tiểu đường</option>
                    <option value="Sức khỏe tinh thần">Sức khỏe tinh thần</option>
                    <option value="Thể dục">Thể dục</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (URL)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="sức khỏe, dinh dưỡng, bệnh tiểu đường"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button type="submit">
                  Thêm bài viết
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Sửa bài viết</h2>
            <form onSubmit={handleEditArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tóm tắt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tác giả *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày xuất bản *
                  </label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Sức khỏe tổng quát">Sức khỏe tổng quát</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Bệnh tiểu đường">Bệnh tiểu đường</option>
                    <option value="Sức khỏe tinh thần">Sức khỏe tinh thần</option>
                    <option value="Thể dục">Thể dục</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (URL)
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="sức khỏe, dinh dưỡng, bệnh tiểu đường"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null)
                    resetForm()
                  }}
                  variant="outline"
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

      {/* View Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
              <Button
                onClick={() => setSelectedArticle(null)}
                variant="outline"
                size="sm"
              >
                Đóng
              </Button>
            </div>
            
            {selectedArticle.image && (
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
              <div>
                <strong>Tác giả:</strong> {selectedArticle.author}
              </div>
              <div>
                <strong>Danh mục:</strong> {selectedArticle.category}
              </div>
              <div>
                <strong>Ngày xuất bản:</strong> {formatDate(selectedArticle.publishedAt)}
              </div>
              <div>
                <strong>Lượt xem:</strong> {selectedArticle.views}
              </div>
            </div>
            
            <div className="mb-4">
              <strong>Tóm tắt:</strong>
              <p className="text-gray-700 mt-1">{selectedArticle.excerpt}</p>
            </div>
            
            <div className="mb-4">
              <strong>Nội dung:</strong>
              <div 
                className="text-gray-700 mt-1 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            
            {selectedArticle.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết "{deletingArticle.title}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setDeletingArticle(null)}
                variant="outline"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteArticle}
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