'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Dữ liệu mẫu sản phẩm mở rộng
const allProducts: Product[] = [
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
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    description: 'Thuốc chống viêm, giảm đau',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    category: 'Thuốc giảm đau',
    stock: 60,
    prescription: false,
  },
  {
    id: '6',
    name: 'Vitamin D3 1000IU',
    description: 'Bổ sung vitamin D, tăng cường xương',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'Vitamin',
    stock: 40,
    prescription: false,
  },
  {
    id: '7',
    name: 'Lansoprazole 30mg',
    description: 'Điều trị loét dạ dày, tá tràng',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    category: 'Thuốc tiêu hóa',
    stock: 25,
    prescription: true,
  },
  {
    id: '8',
    name: 'Loratadine 10mg',
    description: 'Thuốc kháng histamine, không gây buồn ngủ',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop',
    category: 'Thuốc dị ứng',
    stock: 80,
    prescription: false,
  },
]

const categories = ['Tất cả', 'Thuốc giảm đau', 'Vitamin', 'Thuốc tiêu hóa', 'Thuốc dị ứng']

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)

  useEffect(() => {
    filterProducts()
  }, [searchQuery, selectedCategory, priceRange, prescriptionOnly])

  const filterProducts = () => {
    let filtered = allProducts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter by prescription requirement
    if (prescriptionOnly) {
      filtered = filtered.filter(product => product.prescription)
    }

    setProducts(filtered)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('Tất cả')
    setPriceRange([0, 200000])
    setPrescriptionOnly(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
          <p className="text-gray-600">Tìm kiếm và mua thuốc chất lượng cao</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm thuốc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Category Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bộ lọc</h3>
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Xóa bộ lọc
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Prescription Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại thuốc
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={prescriptionOnly}
                      onChange={(e) => setPrescriptionOnly(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Chỉ hiển thị thuốc kê đơn
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy {products.length} sản phẩm
            {searchQuery && ` cho "${searchQuery}"`}
            {selectedCategory !== 'Tất cả' && ` trong danh mục "${selectedCategory}"`}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-4">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
            <Button onClick={clearFilters} variant="outline">
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 