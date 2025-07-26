import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hoàng Linh Medicine - Bán thuốc & Tư vấn AI',
  description: 'Ứng dụng bán thuốc trực tuyến với tư vấn AI chuyên nghiệp. Mua thuốc an toàn, tư vấn sức khỏe 24/7.',
  keywords: 'thuốc, dược phẩm, tư vấn sức khỏe, AI, mua thuốc online',
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