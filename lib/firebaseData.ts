import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Product } from '@/types/product'

export interface Category {
  id: string
  name: string
  icon: string
  description: string
  count: number
  isPrescription?: boolean
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
export const addCategory = async (categoryName: string, isPrescription: boolean = false): Promise<void> => {
  try {
    await addDoc(collection(db, 'categories'), {
      name: categoryName,
      icon: '📦',
      description: `Danh mục ${categoryName}`,
      count: 0,
      isPrescription: isPrescription,
      createdAt: new Date()
    })
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

// Update category
export const updateCategory = async (oldName: string, newName: string, isPrescription?: boolean): Promise<void> => {
  try {
    // Get category document by name
    const categoriesSnapshot = await getDocs(
      query(collection(db, 'categories'), where('name', '==', oldName))
    )
    
    if (categoriesSnapshot.empty) {
      throw new Error('Category not found')
    }
    
    const categoryDoc = categoriesSnapshot.docs[0]
    
    // Update category data
    const updateData: any = {
      name: newName,
      description: `Danh mục ${newName}`,
      updatedAt: new Date()
    }
    
    if (isPrescription !== undefined) {
      updateData.isPrescription = isPrescription
    }
    
    await updateDoc(doc(db, 'categories', categoryDoc.id), updateData)
    
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
  likes?: number
  views?: number
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

// Fetch health article by ID
export const getHealthArticleById = async (id: string): Promise<HealthArticle | null> => {
  try {
    const articleDoc = await getDoc(doc(db, 'health-articles', id))
    
    if (articleDoc.exists()) {
      return {
        id: articleDoc.id,
        ...articleDoc.data()
      } as HealthArticle
    }
    
    return null
  } catch (error) {
    console.error('Error fetching health article by ID:', error)
    return null
  }
}

// Fetch health articles by category
export const getHealthArticlesByCategory = async (category: string, limitCount?: number): Promise<HealthArticle[]> => {
  try {
    let q = query(collection(db, 'health-articles'), where('category', '==', category))
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }
    
    const articlesSnapshot = await getDocs(q)
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

// Update category count when adding/removing products
export const updateCategoryCount = async (categoryName: string): Promise<void> => {
  try {
    // Count products in this category
    const productsSnapshot = await getDocs(
      query(collection(db, 'products'), where('category', '==', categoryName))
    )
    
    const productCount = productsSnapshot.size
    
    // Find and update the category document
    const categoriesSnapshot = await getDocs(
      query(collection(db, 'categories'), where('name', '==', categoryName))
    )
    
    if (!categoriesSnapshot.empty) {
      const categoryDoc = categoriesSnapshot.docs[0]
      await updateDoc(doc(db, 'categories', categoryDoc.id), {
        count: productCount,
        updatedAt: new Date()
      })
      console.log(`Updated category ${categoryName} count to ${productCount}`)
    }
  } catch (error) {
    console.error('Error updating category count:', error)
    throw error
  }
}

// Add new product and update category count
export const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  try {
    // Add the product
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Update category count
    await updateCategoryCount(productData.category)
    
    return docRef.id
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

// Delete product and update category count
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    // Get product to know its category before deleting
    const product = await getProductById(productId)
    if (!product) {
      throw new Error('Product not found')
    }
    
    // Delete the product
    await deleteDoc(doc(db, 'products', productId))
    
    // Update category count
    await updateCategoryCount(product.category)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Update product and update category count if category changed
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
  try {
    // Get current product to check if category changed
    const currentProduct = await getProductById(productId)
    if (!currentProduct) {
      throw new Error('Product not found')
    }
    
    // Update the product
    await updateDoc(doc(db, 'products', productId), {
      ...productData,
      updatedAt: new Date()
    })
    
    // If category changed, update counts for both old and new categories
    if (productData.category && productData.category !== currentProduct.category) {
      await updateCategoryCount(currentProduct.category) // Update old category count
      await updateCategoryCount(productData.category) // Update new category count
    } else if (productData.category) {
      // Category didn't change, just update current category count
      await updateCategoryCount(productData.category)
    }
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Get all orders
export const getAllOrders = async (): Promise<any[]> => {
  try {
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
    const orders: any[] = []
    
    ordersSnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// Get all users
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const users: any[] = []
    
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Get all consultations
export const getAllConsultations = async (): Promise<any[]> => {
  try {
    const consultationsSnapshot = await getDocs(collection(db, 'consultations'))
    const consultations: any[] = []
    
    consultationsSnapshot.forEach((doc) => {
      consultations.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return consultations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return []
  }
}

// Update consultation status
export const updateConsultationStatus = async (consultationId: string, status: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'consultations', consultationId), {
      status,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating consultation status:', error)
    throw error
  }
}

// Update user role
export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId))
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Order interface
export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: any[]
  subtotal: number
  shippingFee: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: any
  updatedAt?: any
}

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
} 