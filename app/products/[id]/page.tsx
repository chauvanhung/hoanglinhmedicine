'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Star, 
  Truck, 
  Shield, 
  Clock, 
  Heart, 
  Share2, 
  ShoppingCart,
  ChevronRight,
  Check,
  AlertCircle,
  Package,
  Calendar,
  Users,
  Award
} from 'lucide-react'

// Import dữ liệu sản phẩm từ lib/products
import { allProducts } from '@/lib/products'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = allProducts.find(p => p.id === params?.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
            <Button onClick={() => router.push('/products')}>
              Quay lại trang sản phẩm
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const averageRating = product.reviews ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-primary-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Trang chủ
          </button>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => router.push('/products')}
            className="hover:text-primary-600"
          >
            Sản phẩm
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="relative aspect-square mb-4">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
              {product.prescription && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Thuốc kê đơn
                </div>
              )}
            </div>
            
            {/* Image Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                                 <span className="text-sm text-gray-600">
                   {averageRating.toFixed(1)} ({product.reviews?.length || 0} đánh giá)
                 </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price)}
                </span>
                <span className="text-sm text-gray-500 ml-2">/ {product.packaging}</span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Còn hàng ({product.stock} sản phẩm)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Hết hàng</span>
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant={isWishlisted ? "default" : "outline"}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="w-4 h-4 mr-2 text-green-500" />
                  <span>Giao hàng miễn phí</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Chất lượng đảm bảo</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  <span>Giao hàng trong 2h</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Đóng gói cẩn thận</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Mô tả', icon: Package },
                { id: 'specifications', label: 'Thông số', icon: Award },
                { id: 'usage', label: 'Hướng dẫn', icon: Users },
                { id: 'reviews', label: 'Đánh giá', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                
                                 {product.benefits && (
                   <div>
                     <h4 className="font-medium text-gray-900 mb-3">Lợi ích chính:</h4>
                     <ul className="space-y-2">
                       {product.benefits.map((benefit, index) => (
                         <li key={index} className="flex items-start">
                           <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                           <span className="text-gray-600">{benefit}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
              </div>
            )}

                         {selectedTab === 'specifications' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div>
                     <h4 className="font-medium text-gray-900 mb-2">Thông tin cơ bản</h4>
                     <div className="space-y-2 text-sm">
                       {product.manufacturer && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Nhà sản xuất:</span>
                           <span className="font-medium">{product.manufacturer}</span>
                         </div>
                       )}
                       {product.origin && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Xuất xứ:</span>
                           <span className="font-medium">{product.origin}</span>
                         </div>
                       )}
                       {product.expiry && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Hạn sử dụng:</span>
                           <span className="font-medium">{product.expiry}</span>
                         </div>
                       )}
                       {product.packaging && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Đóng gói:</span>
                           <span className="font-medium">{product.packaging}</span>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   {product.ingredients && (
                     <div>
                       <h4 className="font-medium text-gray-900 mb-2">Thành phần</h4>
                       <p className="text-sm text-gray-600">{product.ingredients}</p>
                     </div>
                   )}
                   
                   {product.storage && (
                     <div>
                       <h4 className="font-medium text-gray-900 mb-2">Bảo quản</h4>
                       <p className="text-sm text-gray-600">{product.storage}</p>
                     </div>
                   )}
                 </div>
               </div>
             )}

                         {selectedTab === 'usage' && (
               <div className="space-y-6">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn sử dụng</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       {product.dosage && (
                         <div>
                           <h4 className="font-medium text-gray-900 mb-2">Liều dùng</h4>
                           <p className="text-gray-600">{product.dosage}</p>
                         </div>
                       )}
                       {product.usage && (
                         <div>
                           <h4 className="font-medium text-gray-900 mb-2">Cách dùng</h4>
                           <p className="text-gray-600">{product.usage}</p>
                         </div>
                       )}
                       {product.target && (
                         <div>
                           <h4 className="font-medium text-gray-900 mb-2">Đối tượng sử dụng</h4>
                           <p className="text-gray-600">{product.target}</p>
                         </div>
                       )}
                     </div>
                     
                     <div className="space-y-4">
                       {product.sideEffects && (
                         <div>
                           <h4 className="font-medium text-gray-900 mb-2">Tác dụng phụ</h4>
                           <p className="text-gray-600">{product.sideEffects}</p>
                         </div>
                       )}
                       {product.contraindications && (
                         <div>
                           <h4 className="font-medium text-gray-900 mb-2">Chống chỉ định</h4>
                           <p className="text-gray-600">{product.contraindications}</p>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             )}

            {selectedTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Đánh giá từ khách hàng</h3>
                  <Button variant="outline" size="sm">
                    Viết đánh giá
                  </Button>
                </div>

                                 {product.reviews && product.reviews.length > 0 ? (
                   <div className="space-y-4">
                     {product.reviews.map((review, index) => (
                       <div key={index} className="border border-gray-200 rounded-lg p-4">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center space-x-2">
                             <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                               <span className="text-primary-600 font-medium text-sm">
                                 {review.user.charAt(0)}
                               </span>
                             </div>
                             <span className="font-medium text-gray-900">{review.user}</span>
                           </div>
                           <div className="flex items-center">
                             {[1, 2, 3, 4, 5].map((star) => (
                               <Star
                                 key={star}
                                 className={`w-4 h-4 ${
                                   star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                 }`}
                               />
                             ))}
                           </div>
                         </div>
                         <p className="text-gray-600">{review.comment}</p>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-8">
                     <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 