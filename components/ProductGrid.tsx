'use client'

import ProductCard from './ProductCard'
import { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
  viewMode?: 'grid' | 'list'
}

export default function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="group">
            <ProductCard product={product} viewMode="list" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="group">
          <ProductCard product={product} viewMode="grid" />
        </div>
      ))}
    </div>
  )
} 