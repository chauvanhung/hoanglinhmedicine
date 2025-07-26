'use client'

import { Button } from '@/components/ui/Button'
import { MessageCircle, Shield, Truck } from 'lucide-react'

interface HeroProps {
  onConsultationClick: () => void
}

export default function Hero({ onConsultationClick }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Chăm sóc sức khỏe
              <span className="block text-secondary-300">thông minh</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Mua thuốc an toàn, tư vấn AI 24/7. 
              Giao hàng nhanh chóng, chất lượng đảm bảo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onConsultationClick}
                className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Tư vấn AI ngay
              </Button>
              
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
              >
                Xem sản phẩm
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Chất lượng đảm bảo</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Giao hàng nhanh</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Tư vấn 24/7</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl transform rotate-6"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Tư vấn AI thông minh
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Hỏi đáp về thuốc, tư vấn sức khỏe với AI chuyên nghiệp
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Tư vấn 24/7</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Chính xác cao</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Miễn phí</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 