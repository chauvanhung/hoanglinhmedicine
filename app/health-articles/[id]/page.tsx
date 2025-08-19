'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, User, Eye, Heart, Share2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getHealthArticleById, getHealthArticlesByCategory } from '@/lib/firebaseData'
import type { HealthArticle } from '@/types/health'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast } from 'sonner'

export default function HealthArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<HealthArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<HealthArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const articleId = params?.id as string

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true)
        const articleData = await getHealthArticleById(articleId)
        if (articleData) {
          setArticle(articleData)
          setLikeCount(articleData.likes || 0)
          
          // Fetch related articles from the same category
          if (articleData.category) {
            const related = await getHealthArticlesByCategory(articleData.category, 4)
            const filtered = related.filter(art => art.id !== articleId)
            setRelatedArticles(filtered.slice(0, 3))
          }
        } else {
          toast.error('Không tìm thấy bài viết')
          router.push('/health-articles')
        }
      } catch (error) {
        console.error('Error fetching article:', error)
        toast.error('Có lỗi xảy ra khi tải bài viết')
      } finally {
        setIsLoading(false)
      }
    }

    if (articleId) {
      fetchArticle()
    }
  }, [articleId, router])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    toast.success(isLiked ? 'Đã bỏ thích bài viết' : 'Đã thích bài viết')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || 'Bài viết sức khỏe',
        text: article?.excerpt || '',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Đã sao chép link bài viết')
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ''
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <Button onClick={() => router.push('/health-articles')}>
              Quay lại danh sách bài viết
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => router.push('/health-articles')}
            className="hover:text-blue-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Góc sức khỏe
          </button>
          <span>/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.createdAt)}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {article.views || 0} lượt xem
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {article.author || 'Dược sĩ Hoàng Linh'}
                        </p>
                        <p className="text-xs text-gray-500">Chuyên gia tư vấn</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${
                        isLiked ? 'text-red-600 border-red-600' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              {article.image && (
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              {/* Article Footer */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={`flex items-center space-x-1 ${
                        isLiked ? 'text-red-600 border-red-600' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Cập nhật lần cuối: {formatDate(article.updatedAt || article.createdAt)}
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Bài viết liên quan
                </h3>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Card 
                      key={relatedArticle.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => router.push(`/health-articles/${relatedArticle.id}`)}
                    >
                      <CardContent className="p-4">
                        {relatedArticle.image && (
                          <img
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(relatedArticle.createdAt)}</span>
                          <span>{relatedArticle.views || 0} lượt xem</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Category Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Danh mục</h3>
                <Badge variant="secondary" className="text-sm">
                  {article.category}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Bài viết thuộc danh mục {article.category}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 