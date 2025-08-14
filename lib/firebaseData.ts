import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Product } from '@/types/product'

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  count: number
}

// Fetch tất cả categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'))
    const categories: Category[] = []
    
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as Category)
    })
    
    return categories.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Fetch tất cả category names (for backward compatibility)
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const categories = await getCategories()
    return categories.map(cat => cat.name)
  } catch (error) {
    console.error('Error fetching category names:', error)
    return []
  }
}

// Add new category
export const addCategory = async (categoryName: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'categories'), {
      name: categoryName,
      icon: '📦',
      description: `Danh mục ${categoryName}`,
      count: 0,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

// Update category
export const updateCategory = async (oldName: string, newName: string): Promise<void> => {
  try {
    // Get category document by name
    const categoriesSnapshot = await getDocs(
      query(collection(db, 'categories'), where('name', '==', oldName))
    )
    
    if (categoriesSnapshot.empty) {
      throw new Error('Category not found')
    }
    
    const categoryDoc = categoriesSnapshot.docs[0]
    
    // Update category name
    await updateDoc(doc(db, 'categories', categoryDoc.id), {
      name: newName,
      description: `Danh mục ${newName}`,
      updatedAt: new Date()
    })
    
    // Update all products in this category
    const productsSnapshot = await getDocs(
      query(collection(db, 'products'), where('category', '==', oldName))
    )
    
    const updatePromises = productsSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { category: newName })
    )
    
    await Promise.all(updatePromises)
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

// Delete category
export const deleteCategory = async (categoryName: string): Promise<void> => {
  try {
    // Get category document by name
    const categoriesSnapshot = await getDocs(
      query(collection(db, 'categories'), where('name', '==', categoryName))
    )
    
    if (categoriesSnapshot.empty) {
      throw new Error('Category not found')
    }
    
    const categoryDoc = categoriesSnapshot.docs[0]
    
    // Delete category document
    await deleteDoc(doc(db, 'categories', categoryDoc.id))
    
    // Note: Products in this category will remain but without a valid category
    // You might want to handle this differently based on your business logic
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Fetch tất cả products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'))
    const products: Product[] = []
    
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product)
    })
    
    return products.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch products theo category
export const getProductsByCategory = async (categoryName: string, limitCount?: number): Promise<Product[]> => {
  try {
    let q = query(
      collection(db, 'products'),
      where('category', '==', categoryName)
    )
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }
    
    const productsSnapshot = await getDocs(q)
    const products: Product[] = []
    
    productsSnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product)
    })
    
    return products.sort((a, b) => a.name.localeCompare(b.name))
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

// Fetch product theo ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId))
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      } as Product
    }
    
    return null
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }
}

// Search products
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts()
    
    if (!searchTerm.trim()) return allProducts
    
    const searchLower = searchTerm.toLowerCase()
    
    return allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchLower)
      const descriptionMatch = product.description.toLowerCase().includes(searchLower)
      const categoryMatch = product.category.toLowerCase().includes(searchLower)
      const manufacturerMatch = product.manufacturer?.toLowerCase().includes(searchLower) || false
      
      return nameMatch || descriptionMatch || categoryMatch || manufacturerMatch
    })
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}

// Fetch featured products (top rated)
export const getFeaturedProducts = async (limitCount: number = 8): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts()
    
    // Sort by average rating
    const productsWithRating = allProducts.map(product => {
      const avgRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0
      
      return { ...product, avgRating }
    })
    
    return productsWithRating
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limitCount)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

// Fetch products by price range
export const getProductsByPriceRange = async (minPrice: number, maxPrice: number): Promise<Product[]> => {
  try {
    const allProducts = await getAllProducts()
    
    return allProducts.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )
  } catch (error) {
    console.error('Error fetching products by price range:', error)
    return []
  }
}

// Health Articles Types and Functions
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
  createdAt?: Date
  updatedAt?: Date
}

// Fetch all health articles
export const getAllHealthArticles = async (): Promise<HealthArticle[]> => {
  try {
    const articlesSnapshot = await getDocs(collection(db, 'health-articles'))
    const articles: HealthArticle[] = []
    
    articlesSnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as HealthArticle)
    })
    
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error fetching health articles:', error)
    return []
  }
}

// Fetch health articles by category
export const getHealthArticlesByCategory = async (category: string): Promise<HealthArticle[]> => {
  try {
    const articlesSnapshot = await getDocs(
      query(collection(db, 'health-articles'), where('category', '==', category))
    )
    const articles: HealthArticle[] = []
    
    articlesSnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as HealthArticle)
    })
    
    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  } catch (error) {
    console.error('Error fetching health articles by category:', error)
    return []
  }
}

// Search health articles
export const searchHealthArticles = async (searchTerm: string): Promise<HealthArticle[]> => {
  try {
    const allArticles = await getAllHealthArticles()
    
    if (!searchTerm.trim()) return allArticles
    
    const searchLower = searchTerm.toLowerCase()
    
    return allArticles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(searchLower)
      const excerptMatch = article.excerpt.toLowerCase().includes(searchLower)
      const contentMatch = article.content.toLowerCase().includes(searchLower)
      const authorMatch = article.author.toLowerCase().includes(searchLower)
      const categoryMatch = article.category.toLowerCase().includes(searchLower)
      const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      
      return titleMatch || excerptMatch || contentMatch || authorMatch || categoryMatch || tagsMatch
    })
  } catch (error) {
    console.error('Error searching health articles:', error)
    return []
  }
}

// Get health article categories with counts
export const getHealthArticleCategories = async (): Promise<{ name: string; count: number }[]> => {
  try {
    const allArticles = await getAllHealthArticles()
    const categoryCounts: { [key: string]: number } = {}
    
    allArticles.forEach(article => {
      categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1
    })
    
    return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
  } catch (error) {
    console.error('Error getting health article categories:', error)
    return []
  }
} 