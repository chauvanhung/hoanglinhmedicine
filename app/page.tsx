'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import AIConsultation from '@/components/AIConsultation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Product } from '@/types/product'
import { getProductsByCategory, getAllCategories, addCategory } from '@/lib/firebaseData'
import { useAuthStore } from '@/store/auth'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [showAIConsultation, setShowAIConsultation] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [productsByCategory, setProductsByCategory] = useState<{ [key: string]: Product[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Load categories and products
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load categories
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
        
        // Load products for each category
        const productsData: { [key: string]: Product[] } = {}
        for (const category of categoriesData) {
          const products = await getProductsByCategory(category, 4) // Limit to 4 products per category
          productsData[category] = products
        }
        setProductsByCategory(productsData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Có lỗi khi tải dữ liệu')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Vui lòng nhập tên danh mục')
      return
    }

    if (categories.includes(newCategoryName.trim())) {
      toast.error('Danh mục này đã tồn tại')
      return
    }

    try {
      await addCategory(newCategoryName.trim())
      setCategories([...categories, newCategoryName.trim()])
      setNewCategoryName('')
      setShowAddCategory(false)
      toast.success('Thêm danh mục thành công')
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Có lỗi khi thêm danh mục')
    }
  }

  const handleViewAllProducts = () => {
    window.location.href = '/products'
  }

  const handleViewCategory = (category: string) => {
    window.location.href = `/products?category=${encodeURIComponent(category)}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero onConsultationClick={() => setShowAIConsultation(true)} />
        
        {/* Categories and Products Section */}
        <section className="py-8 sm:py-16 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Sản phẩm theo danh mục
              </h2>
              <p className="text-gray-600">
                Khám phá các sản phẩm chất lượng được phân loại theo danh mục
              </p>
            </div>
            
            {/* Admin: Add Category Button */}
            {user?.role === 'admin' && (
              <Button
                onClick={() => setShowAddCategory(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm danh mục
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải sản phẩm...</h3>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => {
                const products = productsByCategory[category] || []
                if (products.length === 0) return null

                return (
                  <div key={category} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                      <Button
                        onClick={() => handleViewCategory(category)}
                        variant="outline"
                        size="sm"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Xem tất cả
                      </Button>
                    </div>
                    
                    <ProductGrid products={products} />
                  </div>
                )
              })}
            </div>
          )}

          {/* View All Products Button */}
          <div className="text-center mt-12">
            <Button
              onClick={handleViewAllProducts}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
            >
              Xem tất cả sản phẩm
            </Button>
          </div>
        </section>

        {/* Doctor Consultation Section */}
        <section className="py-8 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Tư vấn với bác sĩ chuyên khoa
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Nhận tư vấn trực tuyến từ các bác sĩ chuyên khoa hàng đầu. 
                Tiện lợi, nhanh chóng và bảo mật thông tin.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tiết kiệm thời gian</h3>
                <p className="text-gray-600">Không cần di chuyển, chờ đợi. Tư vấn mọi lúc, mọi nơi chỉ với một cuộc gọi.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Chuyên gia hàng đầu</h3>
                <p className="text-gray-600">Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, được đào tạo bài bản.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tư vấn trực tuyến</h3>
                <p className="text-gray-600">Hình thức tư vấn hiện đại, tiện lợi và phù hợp với cuộc sống bận rộn.</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/consultation'}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Đặt lịch tư vấn ngay
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Tại sao chọn Hoàng Linh Medicine?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Chất lượng đảm bảo</h3>
                <p className="text-gray-600">Tất cả sản phẩm đều được kiểm định chất lượng và có giấy phép lưu hành.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh chóng</h3>
                <p className="text-gray-600">Giao hàng trong vòng 2-4 giờ tại Hà Nội và 1-2 ngày cho các tỉnh khác.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Tư vấn AI 24/7</h3>
                <p className="text-gray-600">Hệ thống AI thông minh tư vấn sức khỏe và thuốc men mọi lúc, mọi nơi.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Thêm danh mục mới</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nhập tên danh mục"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleAddCategory}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Thêm
              </Button>
              <Button
                onClick={() => {
                  setShowAddCategory(false)
                  setNewCategoryName('')
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

      {showAIConsultation && (
        <AIConsultation onClose={() => setShowAIConsultation(false)} />
      )}
    </div>
  )
} 