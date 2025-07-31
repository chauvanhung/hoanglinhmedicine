'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import AIConsultation from '@/components/AIConsultation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Product } from '@/types/product'

// Mảng hình ảnh đa dạng cho sản phẩm
const productImages = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', // Thuốc viên
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', // Vitamin
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', // Thuốc dạ dày
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop', // Thuốc dị ứng
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', // Tim mạch
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', // Xương khớp
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop', // Thực phẩm chức năng
]

// Dữ liệu sản phẩm nổi bật
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Thuốc giảm đau, hạ sốt hiệu quả',
    price: 15000,
    image: productImages[0],
    category: 'Thuốc giảm đau',
    stock: 100,
    prescription: false,
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Tăng cường sức đề kháng, chống oxy hóa',
    price: 35000,
    image: productImages[1],
    category: 'Vitamin',
    stock: 50,
    prescription: false,
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    description: 'Điều trị viêm loét dạ dày, trào ngược axit',
    price: 45000,
    image: productImages[2],
    category: 'Thuốc tiêu hóa',
    stock: 30,
    prescription: true,
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    description: 'Thuốc kháng histamine, điều trị dị ứng',
    price: 28000,
    image: productImages[3],
    category: 'Thuốc dị ứng',
    stock: 75,
    prescription: false,
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    description: 'Thuốc chống viêm, giảm đau',
    price: 25000,
    image: productImages[0],
    category: 'Thuốc giảm đau',
    stock: 60,
    prescription: false,
  },
  {
    id: '6',
    name: 'Vitamin D3 1000IU',
    description: 'Bổ sung vitamin D, tăng cường xương',
    price: 35000,
    image: productImages[1],
    category: 'Vitamin',
    stock: 40,
    prescription: false,
  },
  {
    id: '7',
    name: 'Alendronate 70mg',
    description: 'Điều trị loãng xương',
    price: 120000,
    image: productImages[5],
    category: 'Thuốc xương khớp',
    stock: 20,
    prescription: true,
  },
  {
    id: '8',
    name: 'Omega-3 1000mg',
    description: 'Bổ sung omega-3, hỗ trợ tim mạch',
    price: 85000,
    image: productImages[6],
    category: 'Thực phẩm chức năng',
    stock: 50,
    prescription: false,
  },
]

export default function Home() {
  const router = useRouter()
  const [showAIConsultation, setShowAIConsultation] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero onConsultationClick={() => setShowAIConsultation(true)} />
        
        <section className="py-8 sm:py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Chúng tôi cung cấp đầy đủ các loại thuốc chất lượng cao, 
              được kiểm định nghiêm ngặt và có nguồn gốc rõ ràng.
            </p>
          </div>
          
          <ProductGrid products={sampleProducts} />
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
                onClick={() => router.push('/consultation')}
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

      {showAIConsultation && (
        <AIConsultation onClose={() => setShowAIConsultation(false)} />
      )}
    </div>
  )
} 