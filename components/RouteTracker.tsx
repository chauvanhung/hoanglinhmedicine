'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/store/navigation'

export default function RouteTracker() {
  const pathname = usePathname()
  const setLastPath = useNavigationStore((state) => state.setLastPath)

  useEffect(() => {
    // Chỉ lưu path nếu không phải trang chủ và không phải các trang không cần lưu
    if (pathname && 
        pathname !== '/' && 
        pathname !== '/loading' &&
        !pathname.startsWith('/login') && 
        !pathname.startsWith('/register') &&
        !pathname.startsWith('/admin') &&
        !pathname.startsWith('/checkout')) {
      console.log('Saving path:', pathname)
      setLastPath(pathname)
      // Lưu vào cookie để middleware có thể đọc
      document.cookie = `last-path=${pathname}; path=/; max-age=3600`
    }
  }, [pathname, setLastPath])

  return null // Component này không render gì
} 