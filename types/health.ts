export interface HealthArticle {
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
  likes?: number
  views?: number
  createdAt?: Date
  updatedAt?: Date
} 