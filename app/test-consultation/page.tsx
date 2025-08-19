'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { createTestConsultation, getUserConsultations } from '@/lib/consultationService'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TestConsultationPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCreateTestData = async () => {
    if (!isAuthenticated || !user) {
      setMessage('Bạn cần đăng nhập trước')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const result = await createTestConsultation()
      if (result.success) {
        setMessage('✅ ' + result.message)
      } else {
        setMessage('❌ ' + result.message)
      }
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckConsultations = async () => {
    if (!isAuthenticated || !user) {
      setMessage('Bạn cần đăng nhập trước')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const consultations = await getUserConsultations()
      setMessage(`📊 Tìm thấy ${consultations.length} lịch tư vấn cho user ${user.id}`)
      console.log('All consultations:', consultations)
    } catch (error) {
      setMessage('❌ Có lỗi xảy ra: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cần đăng nhập</h1>
          <p className="text-gray-600">Vui lòng đăng nhập để sử dụng trang test này</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Consultation Data</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-blue-900 mb-2">Thông tin User:</h2>
              <p className="text-blue-700">ID: {user?.id}</p>
              <p className="text-blue-700">Name: {user?.name}</p>
              <p className="text-blue-700">Email: {user?.email}</p>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleCreateTestData}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Đang tạo...' : 'Tạo dữ liệu test'}
              </Button>
              
              <Button 
                onClick={handleCheckConsultations}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra lịch tư vấn'}
              </Button>
            </div>

            {message && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{message}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Hướng dẫn:</h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Bấm "Tạo dữ liệu test" để tạo một lịch tư vấn mẫu</li>
                <li>• Bấm "Kiểm tra lịch tư vấn" để xem có bao nhiêu lịch tư vấn</li>
                <li>• Sau đó vào trang "Lịch sử tư vấn" để kiểm tra</li>
                <li>• Mở Developer Console (F12) để xem log chi tiết</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 