'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function Loading() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    // Kiểm tra lastPath từ localStorage
    const lastPath = localStorage.getItem('navigation-storage')
    let targetPath = '/'

    if (lastPath) {
      try {
        const parsed = JSON.parse(lastPath)
        const savedPath = parsed.state?.lastPath
        
        if (savedPath && savedPath !== '/') {
          targetPath = savedPath
        }
      } catch (error) {
        console.error('Error parsing navigation storage:', error)
      }
    }

    // Clear localStorage
    localStorage.removeItem('navigation-storage')

    // Redirect sau 100ms
    setTimeout(() => {
      router.replace(targetPath)
    }, 100)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Đang chuyển hướng...</h3>
      </div>
    </div>
  )
} 