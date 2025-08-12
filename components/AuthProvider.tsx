'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { onAuthStateChange } from '@/lib/firebaseAuth'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập từ Firebase
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        useAuthStore.setState({ user, isAuthenticated: true })
      } else {
        useAuthStore.setState({ user: null, isAuthenticated: false })
      }
      setIsLoading(false)
    })

    // Cleanup listener khi component unmount
    return () => unsubscribe()
  }, [])

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Đang kiểm tra đăng nhập...</h3>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 