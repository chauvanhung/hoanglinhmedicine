'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import AIConsultation from '@/components/AIConsultation'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'

// Dữ liệu mẫu sản phẩm
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Thuốc giảm đau, hạ sốt hiệu quả',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'Thuốc giảm đau',
    stock: 100,
    prescription: false,
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Tăng cường sức đề kháng, chống oxy hóa',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'Vitamin',
    stock: 50,
    prescription: false,
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    description: 'Điều trị viêm loét dạ dày, trào ngược axit',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'Thuốc tiêu hóa',
    stock: 30,
    prescription: true,
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    description: 'Thuốc kháng histamine, điều trị dị ứng',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    category: 'Thuốc dị ứng',
    stock: 75,
    prescription: false,
  },
]

export default function Home() {
  const [showAIConsultation, setShowAIConsultation] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero onConsultationClick={() => setShowAIConsultation(true)} />
        
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các loại thuốc chất lượng cao, 
              được kiểm định nghiêm ngặt và có nguồn gốc rõ ràng.
            </p>
          </div>
          
          <ProductGrid products={sampleProducts} />
        </section>

        <section className="py-16 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tại sao chọn Hoàng Linh Medicine?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
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