'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, Menu, X, Phone, MapPin, User, LogOut, Settings, Stethoscope, Activity, Package, FolderOpen, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    // Use capture phase to handle clicks before they bubble
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
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
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Xin chào, {user?.name}</span>
                </div>
              ) : (
                <>
                  <Link href="/login" className="hover:text-secondary-300 transition-colors">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="hover:text-secondary-300 transition-colors">
                    Đăng ký
                  </Link>
                </>
              )}
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
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.location.href = '/profile'
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Thông tin tài khoản
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.location.href = '/orders'
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Đơn hàng của tôi
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.location.href = '/consultations'
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Stethoscope className="w-4 h-4 mr-3" />
                      Lịch sử tư vấn
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.location.href = '/history'
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Activity className="w-4 h-4 mr-3" />
                      Lịch sử tổng hợp
                    </button>
                           {user?.role === 'admin' && (
         <>
           <button
             onClick={() => {
               setShowUserMenu(false)
               window.location.href = '/admin/products/manage'
             }}
             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
           >
             <Package className="w-4 h-4 mr-3" />
             Quản lý sản phẩm
           </button>
           <button
             onClick={() => {
               setShowUserMenu(false)
               window.location.href = '/admin/categories/manage'
             }}
             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
           >
             <FolderOpen className="w-4 h-4 mr-3" />
             Quản lý danh mục
           </button>
         </>
       )}
                    <hr className="my-2" />
                    <button
                      onClick={async () => {
                        await logout()
                        setShowUserMenu(false)
                        router.push('/')
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <User className="w-6 h-6 text-gray-700 hover:text-primary-600 transition-colors" />
              </Link>
            )}

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
              <button 
                onClick={() => window.location.href = '/'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Trang chủ
              </button>
              <button 
                onClick={() => window.location.href = '/products'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Sản phẩm
              </button>
              <button 
                onClick={() => window.location.href = '/consultation'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Tư vấn bác sĩ
              </button>
              <button 
                onClick={() => window.location.href = '/payment/history'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Lịch sử thanh toán
              </button>
              <button 
                onClick={() => window.location.href = '/notifications'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Thông báo
              </button>
              <button 
                onClick={() => window.location.href = '/categories'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Danh mục
              </button>
              <button 
                onClick={() => window.location.href = '/health-articles'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Góc sức khỏe
              </button>
              <button 
                onClick={() => window.location.href = '/contact'}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Liên hệ
              </button>
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
            <button 
              onClick={() => window.location.href = '/'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Trang chủ
            </button>
            <button 
              onClick={() => window.location.href = '/products'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Sản phẩm
            </button>
            <button 
              onClick={() => window.location.href = '/categories'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Danh mục
            </button>
            <button 
              onClick={() => window.location.href = '/health-articles'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Góc sức khỏe
            </button>
            <button 
              onClick={() => window.location.href = '/consultation'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Tư vấn
            </button>
            <button 
              onClick={() => window.location.href = '/payment/history'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Lịch sử thanh toán
            </button>
            <button 
              onClick={() => window.location.href = '/notifications'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Thông báo
            </button>
            <button 
              onClick={() => window.location.href = '/contact'}
              className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
            >
              Liên hệ
            </button>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <button 
                onClick={() => window.location.href = '/login'}
                className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
              >
                Đăng nhập
              </button>
              <button 
                onClick={() => window.location.href = '/register'}
                className="block py-2 text-gray-700 hover:text-primary-600 w-full text-left"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 