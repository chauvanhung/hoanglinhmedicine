import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Check authentication status on page load
              (function() {
                try {
                  const storedUser = localStorage.getItem('firebase_user');
                  const authStatus = localStorage.getItem('firebase_auth_status');
                  
                  if (storedUser && authStatus === 'logged_in') {
                    // User is logged in, set a flag for components to use
                    window.__AUTH_CHECKED__ = true;
                    window.__USER_LOGGED_IN__ = true;
                  } else {
                    window.__AUTH_CHECKED__ = true;
                    window.__USER_LOGGED_IN__ = false;
                  }
                } catch (error) {
                  console.error('Auth check error:', error);
                  window.__AUTH_CHECKED__ = true;
                  window.__USER_LOGGED_IN__ = false;
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
