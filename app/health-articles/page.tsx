'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Clock, User, ArrowRight, Heart, Brain, Shield, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllHealthArticles, getHealthArticleCategories, searchHealthArticles, getHealthArticlesByCategory, HealthArticle } from '@/lib/firebaseData'

export default function HealthCornerPage() {
  const [articles, setArticles] = useState<HealthArticle[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<HealthArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // Load articles and categories on component mount
  useEffect(() => {
    loadArticlesAndCategories()
  }, [])

  const loadArticlesAndCategories = async () => {
    try {
      setIsLoading(true)
      const [articlesData, categoriesData] = await Promise.all([
        getAllHealthArticles(),
        getHealthArticleCategories()
      ])
      
      setArticles(articlesData)
      setFilteredArticles(articlesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading articles and categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle category selection
  useEffect(() => {
    const filterArticles = async () => {
      if (selectedCategory === 'Tất cả') {
        if (searchQuery.trim()) {
          setIsSearching(true)
          const searchResults = await searchHealthArticles(searchQuery)
          setFilteredArticles(searchResults)
          setIsSearching(false)
        } else {
          setFilteredArticles(articles)
        }
      } else {
        setIsSearching(true)
        const categoryResults = await getHealthArticlesByCategory(selectedCategory)
        
        if (searchQuery.trim()) {
          // Filter category results by search query
          const searchLower = searchQuery.toLowerCase()
          const filtered = categoryResults.filter(article => {
            const titleMatch = article.title.toLowerCase().includes(searchLower)
            const excerptMatch = article.excerpt.toLowerCase().includes(searchLower)
            const contentMatch = article.content.toLowerCase().includes(searchLower)
            const authorMatch = article.author.toLowerCase().includes(searchLower)
            const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(searchLower))
            
            return titleMatch || excerptMatch || contentMatch || authorMatch || tagsMatch
          })
          setFilteredArticles(filtered)
        } else {
          setFilteredArticles(categoryResults)
        }
        setIsSearching(false)
      }
    }

    filterArticles()
  }, [selectedCategory, searchQuery, articles])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Miễn dịch':
        return Shield
      case 'Tim mạch':
        return Heart
      case 'Thể dục':
        return Activity
      case 'Nội tiết':
      case 'Tâm thần':
        return Brain
      default:
        return Activity
    }
  }

  const allCategoriesWithCounts = [
    { name: 'Tất cả', count: articles.length },
    ...categories
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Góc Sức Khỏe
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Khám phá những kiến thức y tế hữu ích, lời khuyên từ chuyên gia và cách chăm sóc sức khỏe tốt nhất
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết sức khỏe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh mục</h2>
          <div className="flex flex-wrap gap-4">
            {allCategoriesWithCounts.map((category) => {
              const Icon = category.name === 'Tất cả' ? Activity : getCategoryIcon(category.name)
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span>{category.name}</span>
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải bài viết...</h3>
          </div>
        )}

        {/* Searching State */}
        {isSearching && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tìm kiếm...</h3>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Health+Article'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="w-4 h-4 mr-1" />
                    <span>{article.author}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      Đọc thêm
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isSearching && filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {articles.length === 0 ? 'Chưa có bài viết nào' : 'Không tìm thấy bài viết'}
            </h3>
            <p className="text-gray-500 mb-6">
              {articles.length === 0 
                ? 'Hãy quay lại sau để xem những bài viết sức khỏe mới nhất'
                : 'Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác'
              }
            </p>
            {articles.length > 0 && (
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('Tất cả')
                }}
                variant="outline"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        )}

        {/* Featured Health Tips */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Lời Khuyên Sức Khỏe Hàng Ngày
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Uống Đủ Nước
              </h3>
              <p className="text-gray-600">
                Uống ít nhất 2 lít nước mỗi ngày để duy trì sức khỏe tốt và hỗ trợ các chức năng cơ thể.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Vận Động Thường Xuyên
              </h3>
              <p className="text-gray-600">
                Tập thể dục ít nhất 30 phút mỗi ngày để tăng cường sức khỏe tim mạch và cơ bắp.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ngủ Đủ Giấc
              </h3>
              <p className="text-gray-600">
                Ngủ 7-9 giờ mỗi đêm để cơ thể phục hồi và duy trì sức khỏe tinh thần tốt.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 