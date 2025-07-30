import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ProductChat from '@/components/ProductChat'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B82F6',
}

export const metadata: Metadata = {
  title: 'Hoàng Linh Medicine - Bán thuốc & Tư vấn AI',
  description: 'Ứng dụng bán thuốc trực tuyến với tư vấn AI chuyên nghiệp. Mua thuốc an toàn, tư vấn sức khỏe 24/7.',
  keywords: 'thuốc, dược phẩm, tư vấn sức khỏe, AI, mua thuốc online',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hoàng Linh Medicine',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Hoàng Linh Medicine - Bán thuốc & Tư vấn AI',
    description: 'Ứng dụng bán thuốc trực tuyến với tư vấn AI chuyên nghiệp',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoàng Linh Medicine - Bán thuốc & Tư vấn AI',
    description: 'Ứng dụng bán thuốc trực tuyến với tư vấn AI chuyên nghiệp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <ProductChat />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
} 