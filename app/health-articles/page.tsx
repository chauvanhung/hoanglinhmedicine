'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Clock, User, ArrowRight, Heart, Brain, Shield, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HealthArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  readTime: string
  category: string
  image: string
  tags: string[]
}

const healthArticles: HealthArticle[] = [
  {
    id: '1',
    title: '10 Cách Tăng Cường Hệ Miễn Dịch Tự Nhiên',
    excerpt: 'Khám phá những phương pháp đơn giản và hiệu quả để tăng cường hệ miễn dịch, bảo vệ sức khỏe của bạn và gia đình.',
    content: 'Hệ miễn dịch là hàng rào bảo vệ tự nhiên của cơ thể chống lại các tác nhân gây bệnh. Dưới đây là 10 cách hiệu quả để tăng cường hệ miễn dịch...',
    author: 'BS. Nguyễn Văn An',
    publishedAt: '2024-01-15',
    readTime: '5 phút',
    category: 'Miễn dịch',
    image: '/images/health/immunity.jpg',
    tags: ['miễn dịch', 'sức khỏe', 'vitamin']
  },
  {
    id: '2',
    title: 'Chế Độ Ăn Uống Cho Người Bệnh Tim Mạch',
    excerpt: 'Hướng dẫn chi tiết về chế độ ăn uống khoa học cho người mắc bệnh tim mạch, giúp kiểm soát bệnh hiệu quả.',
    content: 'Bệnh tim mạch là một trong những nguyên nhân gây tử vong hàng đầu. Chế độ ăn uống đóng vai trò quan trọng trong việc phòng ngừa và điều trị...',
    author: 'TS. Trần Thị Bình',
    publishedAt: '2024-01-10',
    readTime: '8 phút',
    category: 'Tim mạch',
    image: '/images/health/heart.jpg',
    tags: ['tim mạch', 'dinh dưỡng', 'bệnh lý']
  },
  {
    id: '3',
    title: 'Tập Thể Dục Buổi Sáng: Lợi Ích Và Cách Thực Hiện',
    excerpt: 'Khám phá những lợi ích tuyệt vời của việc tập thể dục buổi sáng và hướng dẫn các bài tập phù hợp.',
    content: 'Tập thể dục buổi sáng không chỉ giúp tăng cường sức khỏe mà còn cải thiện tâm trạng và năng suất làm việc trong ngày...',
    author: 'ThS. Lê Văn Cường',
    publishedAt: '2024-01-08',
    readTime: '6 phút',
    category: 'Thể dục',
    image: '/images/health/exercise.jpg',
    tags: ['thể dục', 'sức khỏe', 'lối sống']
  },
  {
    id: '4',
    title: 'Cách Phòng Ngừa Bệnh Tiểu Đường Hiệu Quả',
    excerpt: 'Những biện pháp phòng ngừa bệnh tiểu đường type 2 thông qua lối sống và chế độ ăn uống lành mạnh.',
    content: 'Bệnh tiểu đường type 2 có thể phòng ngừa được thông qua việc duy trì lối sống lành mạnh và chế độ ăn uống hợp lý...',
    author: 'BS. Phạm Thị Dung',
    publishedAt: '2024-01-05',
    readTime: '7 phút',
    category: 'Nội tiết',
    image: '/images/health/diabetes.jpg',
    tags: ['tiểu đường', 'phòng bệnh', 'dinh dưỡng']
  },
  {
    id: '5',
    title: 'Chăm Sóc Sức Khỏe Tâm Thần Trong Thời Đại Số',
    excerpt: 'Hướng dẫn cách chăm sóc sức khỏe tâm thần và giảm stress trong cuộc sống hiện đại.',
    content: 'Trong thời đại số, áp lực công việc và cuộc sống có thể ảnh hưởng đến sức khỏe tâm thần. Dưới đây là những cách hiệu quả...',
    author: 'TS. Nguyễn Thị Em',
    publishedAt: '2024-01-03',
    readTime: '9 phút',
    category: 'Tâm thần',
    image: '/images/health/mental.jpg',
    tags: ['tâm thần', 'stress', 'sức khỏe']
  },
  {
    id: '6',
    title: 'Vitamin Và Khoáng Chất: Vai Trò Quan Trọng Với Sức Khỏe',
    excerpt: 'Tìm hiểu về vai trò của các vitamin và khoáng chất thiết yếu đối với sức khỏe con người.',
    content: 'Vitamin và khoáng chất là những chất dinh dưỡng thiết yếu mà cơ thể cần để hoạt động bình thường...',
    author: 'BS. Hoàng Văn Phúc',
    publishedAt: '2024-01-01',
    readTime: '10 phút',
    category: 'Dinh dưỡng',
    image: '/images/health/vitamins.jpg',
    tags: ['vitamin', 'khoáng chất', 'dinh dưỡng']
  }
]

const categories = [
  { name: 'Tất cả', icon: Activity, count: healthArticles.length },
  { name: 'Miễn dịch', icon: Shield, count: 1 },
  { name: 'Tim mạch', icon: Heart, count: 1 },
  { name: 'Thể dục', icon: Activity, count: 1 },
  { name: 'Nội tiết', icon: Brain, count: 1 },
  { name: 'Tâm thần', icon: Brain, count: 1 },
  { name: 'Dinh dưỡng', icon: Shield, count: 1 }
]

export default function HealthCornerPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<HealthArticle[]>(healthArticles)

  useEffect(() => {
    let filtered = healthArticles

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredArticles(filtered)
  }, [selectedCategory, searchQuery])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            {categories.map((category) => {
              const Icon = category.icon
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

        {/* Articles Grid */}
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

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-500 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
            </p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('Tất cả')
              }}
              variant="outline"
            >
              Xóa bộ lọc
            </Button>
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
    </div>
  )
} 