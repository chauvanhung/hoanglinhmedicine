'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Eye, AlertCircle } from 'lucide-react'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (product.prescription) {
      toast.error('Sản phẩm này cần đơn thuốc. Vui lòng liên hệ tư vấn.')
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-48 object-cover"
        />
        
        {product.prescription && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cần đơn thuốc
          </div>
        )}
        
        <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          
          <span className="text-sm text-gray-500">
            Còn {product.stock} sản phẩm
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || product.prescription}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 