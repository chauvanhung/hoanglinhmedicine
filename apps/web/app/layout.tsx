import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './providers/AuthProvider'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hoang Linh Medicine - Chăm sóc béo phì',
  description: 'Ứng dụng chăm sóc sức khỏe, giảm cân khoa học với AI và chuyên gia y tế',
  keywords: 'giảm cân, béo phì, dinh dưỡng, tập luyện, AI coaching, tư vấn bác sĩ',
  authors: [{ name: 'Hoang Linh Medicine' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
