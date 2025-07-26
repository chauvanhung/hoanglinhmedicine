'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Pill, Heart, Shield, Eye, Brain, Baby, Activity } from 'lucide-react'

const categories = [
  {
    id: 'pain-relief',
    name: 'Thuốc giảm đau',
    description: 'Các loại thuốc giảm đau, hạ sốt hiệu quả',
    icon: Pill,
    color: 'bg-red-100 text-red-600',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    productCount: 15,
    popularProducts: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Aspirin 100mg']
  },
  {
    id: 'vitamins',
    name: 'Vitamin & Thực phẩm chức năng',
    description: 'Bổ sung vitamin và khoáng chất thiết yếu',
    icon: Heart,
    color: 'bg-green-100 text-green-600',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 25,
    popularProducts: ['Vitamin C 1000mg', 'Vitamin D3 1000IU', 'Omega-3']
  },
  {
    id: 'digestive',
    name: 'Thuốc tiêu hóa',
    description: 'Điều trị các vấn đề về dạ dày, đường ruột',
    icon: Activity,
    color: 'bg-blue-100 text-blue-600',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    productCount: 12,
    popularProducts: ['Omeprazole 20mg', 'Lansoprazole 30mg', 'Probiotics']
  },
  {
    id: 'allergy',
    name: 'Thuốc dị ứng',
    description: 'Điều trị các triệu chứng dị ứng',
    icon: Shield,
    color: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    productCount: 8,
    popularProducts: ['Cetirizine 10mg', 'Loratadine 10mg', 'Fexofenadine']
  },
  {
    id: 'eye-care',
    name: 'Thuốc mắt',
    description: 'Chăm sóc và điều trị các bệnh về mắt',
    icon: Eye,
    color: 'bg-yellow-100 text-yellow-600',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 10,
    popularProducts: ['Nước mắt nhân tạo', 'Thuốc nhỏ mắt', 'Vitamin A']
  },
  {
    id: 'mental-health',
    name: 'Sức khỏe tâm thần',
    description: 'Thuốc hỗ trợ điều trị các vấn đề tâm lý',
    icon: Brain,
    color: 'bg-indigo-100 text-indigo-600',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    productCount: 6,
    popularProducts: ['Melatonin', 'St. John\'s Wort', '5-HTP']
  },
  {
    id: 'children',
    name: 'Thuốc trẻ em',
    description: 'Thuốc đặc biệt dành cho trẻ em',
    icon: Baby,
    color: 'bg-pink-100 text-pink-600',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 18,
    popularProducts: ['Paracetamol siro', 'Vitamin D3 trẻ em', 'Probiotics trẻ em']
  },
  {
    id: 'first-aid',
    name: 'Sơ cứu & Y tế',
    description: 'Dụng cụ và thuốc sơ cứu cần thiết',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    productCount: 20,
    popularProducts: ['Băng gạc', 'Thuốc sát trùng', 'Nhiệt kế']
  }
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh mục sản phẩm
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá đầy đủ các danh mục thuốc và sản phẩm chăm sóc sức khỏe chất lượng cao
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} sản phẩm
                    </span>
                    <Link href={`/products?category=${category.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                        Xem tất cả
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Category Detail Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Sản phẩm phổ biến:</h4>
                    <ul className="space-y-1">
                      {categories.find(c => c.id === selectedCategory)?.popularProducts.map((product, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                          {product}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Link href={`/products?category=${selectedCategory}`}>
                      <Button className="flex-1">
                        Xem tất cả sản phẩm
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <section className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Tại sao chọn Hoàng Linh Medicine?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">
                Tất cả sản phẩm đều được kiểm định chất lượng và có giấy phép lưu hành
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tư vấn chuyên nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ dược sĩ và AI tư vấn sẵn sàng hỗ trợ 24/7
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đa dạng sản phẩm</h3>
              <p className="text-gray-600">
                Hơn 1000+ sản phẩm thuốc và chăm sóc sức khỏe chất lượng
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 