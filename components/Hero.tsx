'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { MessageCircle, Shield, Truck, ArrowRight, Star, Users, Award } from 'lucide-react'

interface HeroProps {
  onConsultationClick: () => void
}

export default function Hero({ onConsultationClick }: HeroProps) {
  const router = useRouter()

  const categories = [
    { name: 'Omega 3', icon: '💊', color: 'bg-blue-500' },
    { name: 'Thuốc nhỏ mắt', icon: '👁️', color: 'bg-green-500' },
    { name: 'Dung dịch vệ sinh', icon: '🧴', color: 'bg-purple-500' },
    { name: 'Sữa rửa mặt', icon: '🧼', color: 'bg-pink-500' },
    { name: 'Men vi sinh', icon: '🦠', color: 'bg-yellow-500' },
    { name: 'Canxi', icon: '🦴', color: 'bg-orange-500' },
    { name: 'Kem chống nắng', icon: '☀️', color: 'bg-red-500' },
    { name: 'Kẽm', icon: '⚡', color: 'bg-indigo-500' },
  ]

  return (
    <div className="bg-white">
      {/* Main Banner */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-300 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-200">4.9/5 từ 10,000+ khách hàng</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                Chăm sóc sức khỏe
                <span className="block text-secondary-300">thông minh</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
                Mua thuốc an toàn, tư vấn AI 24/7. 
                <br />
                Giao hàng nhanh chóng, chất lượng đảm bảo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={onConsultationClick}
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Tư vấn AI ngay
                </Button>
                
                <Button 
                  onClick={() => router.push('/products')}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-lg"
                >
                  Xem sản phẩm
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-300">50,000+</div>
                  <div className="text-sm text-gray-200">Khách hàng tin tưởng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-300">10,000+</div>
                  <div className="text-sm text-gray-200">Sản phẩm chất lượng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-300">24/7</div>
                  <div className="text-sm text-gray-200">Hỗ trợ tư vấn</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Tư vấn AI thông minh
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Hỏi đáp về thuốc, tư vấn sức khỏe với AI chuyên nghiệp
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Tư vấn 24/7 miễn phí</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Chính xác cao với AI</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Đội ngũ chuyên gia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tra cứu hàng đầu</h2>
            <p className="text-gray-600">Tìm kiếm nhanh các sản phẩm phổ biến</p>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => router.push(`/products?category=${category.name}`)}
                className="group flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700 text-center font-medium group-hover:text-primary-600">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn Hoàng Linh Medicine?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến dịch vụ tốt nhất với chất lượng đảm bảo và giá cả hợp lý
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Tất cả sản phẩm đều được kiểm định chất lượng và có giấy phép lưu hành từ Bộ Y tế.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <Truck className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">Giao hàng trong vòng 2-4 giờ tại Hà Nội và 1-2 ngày cho các tỉnh khác trên toàn quốc.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                <MessageCircle className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Tư vấn AI 24/7</h3>
              <p className="text-gray-600">Hệ thống AI thông minh tư vấn sức khỏe và thuốc men mọi lúc, mọi nơi với độ chính xác cao.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 