'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Search, Upload, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Product } from '@/types/product'
import { addProduct, updateProduct, deleteProduct } from '@/lib/firebaseData'
import toast from 'react-hot-toast'

export default function AdminProductManagePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{name: string, isPrescription: boolean}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  })

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

  // Load products and categories
  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'))
      const categoriesData: {name: string, isPrescription: boolean}[] = []
      
      categoriesSnapshot.forEach((doc) => {
        const categoryData = doc.data()
        if (categoryData.name) {
          categoriesData.push({
            name: categoryData.name,
            isPrescription: categoryData.isPrescription || false
          })
        }
      })
      
      setCategories(categoriesData.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to hardcoded categories if database is empty
      setCategories([
        { name: 'Thuốc giảm đau', isPrescription: false },
        { name: 'Thuốc kháng sinh', isPrescription: false },
        { name: 'Thuốc tim mạch', isPrescription: false },
        { name: 'Thuốc tiêu hóa', isPrescription: false },
        { name: 'Thuốc hô hấp', isPrescription: false },
        { name: 'Thuốc kê đơn', isPrescription: false },
        { name: 'Vitamin và khoáng chất', isPrescription: false },
        { name: 'Thực phẩm chức năng', isPrescription: false },
        { name: 'Dụng cụ y tế', isPrescription: false }
      ])
    }
  }

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const productsSnapshot = await getDocs(collection(db, 'products'))
      const productsData: Product[] = []
      
      productsSnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        } as Product)
      })
      
      setProducts(productsData.sort((a, b) => a.name.localeCompare(b.name)))
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Lỗi khi tải danh sách sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB')
        return
      }

      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: ''
    })
    setSelectedImage(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that either image file or URL is provided
    if (!selectedImage && !formData.image.trim()) {
      toast.error('Vui lòng chọn hình ảnh hoặc nhập URL hình ảnh')
      return
    }
    
    try {
      let imageUrl = formData.image // Use URL if provided
      
      // If file is selected, convert to base64 for now (in production, upload to cloud storage)
      if (selectedImage) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64String = e.target?.result as string
          
          const productData = {
            ...formData,
            price: parseInt(formData.price),
            originalPrice: parseInt(formData.price),
            stock: parseInt(formData.stock),
            rating: 4.5,
            reviews: [],
            images: [base64String],
            image: base64String, // Use base64 as image URL
            prescription: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }

          await addProduct(productData)
          toast.success('Thêm sản phẩm thành công!')
          setShowAddModal(false)
          resetForm()
          loadProducts()
        }
        reader.readAsDataURL(selectedImage)
        return
      }

      // If no file selected, use URL
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: parseInt(formData.price),
        stock: parseInt(formData.stock),
        rating: 4.5,
        reviews: [],
        images: [imageUrl],
        prescription: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await addProduct(productData)
      toast.success('Thêm sản phẩm thành công!')
      setShowAddModal(false)
      resetForm()
      loadProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Lỗi khi thêm sản phẩm')
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingProduct) return

    // Validate that either image file or URL is provided
    if (!selectedImage && !formData.image.trim()) {
      toast.error('Vui lòng chọn hình ảnh hoặc nhập URL hình ảnh')
      return
    }

    try {
      let imageUrl = formData.image // Use URL if provided
      
      // If file is selected, convert to base64
      if (selectedImage) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const base64String = e.target?.result as string
          
          const productData = {
            ...formData,
            price: parseInt(formData.price),
            originalPrice: parseInt(formData.price),
            stock: parseInt(formData.stock),
            image: base64String,
            updatedAt: new Date()
          }

          await updateProduct(editingProduct.id, productData)
          toast.success('Cập nhật sản phẩm thành công!')
          setEditingProduct(null)
          resetForm()
          loadProducts()
        }
        reader.readAsDataURL(selectedImage)
        return
      }

      // If no file selected, use URL
      const productData = {
        ...formData,
        price: parseInt(formData.price),
        originalPrice: parseInt(formData.price),
        stock: parseInt(formData.stock),
        updatedAt: new Date()
      }

      await updateProduct(editingProduct.id, productData)
      toast.success('Cập nhật sản phẩm thành công!')
      setEditingProduct(null)
      resetForm()
      loadProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Lỗi khi cập nhật sản phẩm')
    }
  }

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return

    try {
      await deleteProduct(deletingProduct.id)
      toast.success('Xóa sản phẩm thành công!')
      setDeletingProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Lỗi khi xóa sản phẩm')
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    })
    setSelectedImage(null) // Clear selected image when opening edit modal
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
              <p className="mt-2 text-gray-600">Thêm, sửa, xóa sản phẩm trong hệ thống</p>
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

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
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
            Thêm sản phẩm
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tồn kho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openEditModal(product)}
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          onClick={() => setDeletingProduct(product)}
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm mới</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
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
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tồn kho *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh sản phẩm *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Hoặc nhập URL hình ảnh"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Xóa hình ảnh"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Chọn hình
                    </Button>
                  </div>
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
                    Thêm sản phẩm
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Sửa sản phẩm</h2>
              <form onSubmit={handleEditProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
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
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tồn kho *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh sản phẩm *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Hoặc nhập URL hình ảnh"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Xóa hình ảnh"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Chọn hình
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null)
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

        {/* Delete Confirmation Modal */}
        {deletingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm "{deletingProduct.name}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setDeletingProduct(null)}
                  variant="outline"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleDeleteProduct}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 