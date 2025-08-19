'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Button } from '@/components/ui/Button'
import { updateCategoryCount, getCategories, getAllProducts } from '@/lib/firebaseData'
import { Category } from '@/lib/firebaseData'
import { Product } from '@/types/product'
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

export default function UpdateCategoryCountsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<{ [key: string]: 'success' | 'error' | 'pending' }>({})
  const [categoryCounts, setCategoryCounts] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getAllProducts()
        ])
        setCategories(categoriesData)
        setProducts(productsData)

        // Calculate current counts
        const counts: { [key: string]: number } = {}
        categoriesData.forEach(category => {
          counts[category.name] = productsData.filter(product => product.category === category.name).length
        })
        setCategoryCounts(counts)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  const updateAllCategoryCounts = async () => {
    setIsLoading(true)
    setUpdateStatus({})

    try {
      for (const category of categories) {
        setUpdateStatus(prev => ({ ...prev, [category.name]: 'pending' }))
        
        try {
          await updateCategoryCount(category.name)
          setUpdateStatus(prev => ({ ...prev, [category.name]: 'success' }))
          
          // Update local count
          const newCount = products.filter(product => product.category === category.name).length
          setCategoryCounts(prev => ({ ...prev, [category.name]: newCount }))
        } catch (error) {
          console.error(`Error updating category ${category.name}:`, error)
          setUpdateStatus(prev => ({ ...prev, [category.name]: 'error' }))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateSingleCategoryCount = async (categoryName: string) => {
    setUpdateStatus(prev => ({ ...prev, [categoryName]: 'pending' }))
    
    try {
      await updateCategoryCount(categoryName)
      setUpdateStatus(prev => ({ ...prev, [categoryName]: 'success' }))
      
      // Update local count
      const newCount = products.filter(product => product.category === categoryName).length
      setCategoryCounts(prev => ({ ...prev, [categoryName]: newCount }))
    } catch (error) {
      console.error(`Error updating category ${categoryName}:`, error)
      setUpdateStatus(prev => ({ ...prev, [categoryName]: 'error' }))
    }
  }

  const getStatusIcon = (status: 'success' | 'error' | 'pending' | undefined) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return null
    }
  }

  const getStatusText = (status: 'success' | 'error' | 'pending' | undefined) => {
    switch (status) {
      case 'success':
        return 'Thành công'
      case 'error':
        return 'Lỗi'
      case 'pending':
        return 'Đang cập nhật...'
      default:
        return 'Chưa cập nhật'
    }
  }

  return (
    <AdminLayout title="Cập nhật số lượng danh mục">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cập nhật số lượng sản phẩm trong danh mục
          </h1>
          <p className="text-gray-600">
            Cập nhật số lượng sản phẩm hiển thị trong mỗi danh mục
          </p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={updateAllCategoryCounts}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Cập nhật tất cả danh mục</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Danh sách danh mục
            </h2>
            
            <div className="space-y-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        Hiện tại: {category.count} sản phẩm | 
                        Thực tế: {categoryCounts[category.name] || 0} sản phẩm
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(updateStatus[category.name])}
                      <span className="text-sm text-gray-600">
                        {getStatusText(updateStatus[category.name])}
                      </span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSingleCategoryCount(category.name)}
                      disabled={updateStatus[category.name] === 'pending'}
                    >
                      Cập nhật
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Hướng dẫn:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Số lượng sản phẩm sẽ được cập nhật tự động khi thêm/xóa sản phẩm</li>
            <li>• Nếu số lượng không khớp, hãy nhấn "Cập nhật" để đồng bộ</li>
            <li>• Có thể cập nhật từng danh mục hoặc tất cả cùng lúc</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
} 