'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'
import { Button } from '@/components/ui/Button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (product.prescription) {
      toast.error('Sản phẩm này cần đơn thuốc. Vui lòng liên hệ dược sĩ.')
      return
    }

    setIsLoading(true)
    try {
      addItem(product, 1)
      toast.success('Đã thêm vào giỏ hàng!')
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const getUnitLabel = () => {
    if (product.category.includes('Thuốc bôi') || product.category.includes('Kem')) return 'Tuýp'
    if (product.category.includes('Thuốc uống') || product.category.includes('Viên')) return 'Hộp'
    return 'Hộp'
  }

  return (
    <div className={`group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden ${
      viewMode === 'list' ? 'flex' : 'h-full flex flex-col'
    }`}>
      {/* Image Container */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'h-32' : 'h-48 sm:h-52'}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className={`${viewMode === 'list' ? 'flex-1 p-4' : 'p-4 flex-1 flex flex-col'}`}>
        {/* Product Name */}
        <h3 className={`font-medium text-gray-900 mb-2 line-clamp-2 ${
          viewMode === 'list' ? 'text-base' : 'text-sm sm:text-base'
        }`}>
          {product.name}
        </h3>
        
        {/* Description */}
        <p className={`text-gray-600 line-clamp-2 mb-3 text-xs sm:text-sm`}>
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline space-x-1 mb-1">
            <span className={`font-bold text-gray-900 ${
              viewMode === 'list' ? 'text-lg' : 'text-base sm:text-lg'
            }`}>
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-500">
              / {getUnitLabel()}
            </span>
          </div>
          
          {/* Unit Label */}
          <div className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {getUnitLabel()}
          </div>
        </div>

        {/* Action Button */}
        <div className={`${viewMode === 'list' ? '' : 'mt-auto'}`}>
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.prescription || product.stock === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Chọn mua
          </Button>
        </div>
      </div>
    </div>
  )
} 