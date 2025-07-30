'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, Phone, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartItems = useCartStore((state) => state.items)
  const router = useRouter()
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Tư vấn: 1800 6928</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="hover:text-secondary-300 transition-colors">
                Đăng nhập
              </Link>
              <Link href="/register" className="hover:text-secondary-300 transition-colors">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Hoàng Linh Medicine</h1>
              <p className="text-xs text-gray-600">Chăm sóc sức khỏe thông minh</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm thuốc, thực phẩm chức năng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 text-sm"
              >
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <Link href="/profile" className="hidden md:block">
              <User className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm thuốc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Trang chủ
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Sản phẩm
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Danh mục
              </Link>
              <Link href="/health-articles" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Góc sức khỏe
              </Link>
              <Link href="/consultation" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Tư vấn
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                Liên hệ
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white text-sm">
                Tải ứng dụng
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Trang chủ
            </Link>
            <Link href="/products" className="block py-2 text-gray-700 hover:text-primary-600">
              Sản phẩm
            </Link>
            <Link href="/categories" className="block py-2 text-gray-700 hover:text-primary-600">
              Danh mục
            </Link>
            <Link href="/health-articles" className="block py-2 text-gray-700 hover:text-primary-600">
              Góc sức khỏe
            </Link>
            <Link href="/consultation" className="block py-2 text-gray-700 hover:text-primary-600">
              Tư vấn
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-primary-600">
              Liên hệ
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link href="/login" className="block py-2 text-gray-700 hover:text-primary-600">
                Đăng nhập
              </Link>
              <Link href="/register" className="block py-2 text-gray-700 hover:text-primary-600">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 