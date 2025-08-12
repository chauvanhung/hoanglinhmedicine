'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

export default function NavigationRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Chỉ redirect khi user đã đăng nhập và đang ở trang chủ
    if (!hasRedirected.current && user && pathname === '/') {
      // Lấy lastPath từ localStorage trực tiếp
      const lastPath = localStorage.getItem('navigation-storage')
      if (lastPath) {
        try {
          const parsed = JSON.parse(lastPath)
          const savedPath = parsed.state?.lastPath
          
          if (savedPath && savedPath !== '/' && savedPath !== pathname) {
            console.log('Redirecting from home to:', savedPath)
            hasRedirected.current = true
            
            // Thay đổi URL ngay lập tức mà không reload
            window.history.replaceState(null, '', savedPath)
            
            // Sau đó navigate để load component
            setTimeout(() => {
              router.push(savedPath)
            }, 100)
            
            // Clear sau khi redirect
            localStorage.removeItem('navigation-storage')
          }
        } catch (error) {
          console.error('Error parsing navigation storage:', error)
        }
      }
    }
  }, [pathname, router, user])

  return null
} 