'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')
  const [paymentId, setPaymentId] = useState('')

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get payment ID from URL params
        if (!searchParams) {
          setStatus('failed')
          setMessage('Không tìm thấy thông tin thanh toán')
          return
        }
        
        const paymentIdParam = searchParams.get('paymentId') || searchParams.get('vnp_TxnRef')
        if (!paymentIdParam) {
          setStatus('failed')
          setMessage('Không tìm thấy thông tin thanh toán')
          return
        }

        setPaymentId(paymentIdParam)

        // Check payment status from our API
        const response = await fetch(`/api/payment?paymentId=${paymentIdParam}`)
        const result = await response.json()

        if (result.status === 'completed') {
          setStatus('success')
          setMessage('Thanh toán thành công! Đặt lịch tư vấn của bạn đã được xác nhận.')
        } else {
          setStatus('failed')
          setMessage('Thanh toán chưa hoàn tất hoặc thất bại. Vui lòng thử lại.')
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
        setStatus('failed')
        setMessage('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán')
      }
    }

    checkPaymentStatus()
  }, [searchParams])

  const handleRetry = () => {
    router.push('/consultation')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {status === 'loading' && (
            <div>
              <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Đang kiểm tra thanh toán...
              </h1>
              <p className="text-gray-600">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              {paymentId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Mã thanh toán:</p>
                  <p className="font-mono text-lg font-semibold text-gray-900">
                    {paymentId}
                  </p>
                </div>
              )}
              <div className="space-y-3">
                <Button onClick={handleGoHome} className="w-full">
                  Về trang chủ
                </Button>
                <p className="text-sm text-gray-500">
                  Chúng tôi sẽ gửi email xác nhận trong thời gian sớm nhất
                </p>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Thử lại
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  Về trang chủ
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 