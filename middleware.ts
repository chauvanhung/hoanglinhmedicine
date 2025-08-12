import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Chỉ xử lý cho trang chủ
  if (pathname === '/') {
    // Kiểm tra xem có lastPath trong localStorage không
    const lastPath = request.cookies.get('last-path')?.value
    
    if (lastPath && lastPath !== '/' && lastPath !== pathname) {
      // Kiểm tra xem có token authentication không
      const token = request.cookies.get('auth-token')?.value
      
      if (token) {
        // Nếu đã đăng nhập và có lastPath, redirect ngay
        return NextResponse.redirect(new URL(lastPath, request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/']
} 