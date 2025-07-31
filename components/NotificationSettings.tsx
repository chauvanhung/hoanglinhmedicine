'use client'
import { useState, useEffect } from 'react'
import { Bell, Smartphone, Mail, Clock, CheckCircle, XCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from './Toast'

interface NotificationSettingsProps {
  bookingId?: string
  consultationInfo?: {
    doctorName: string
    specialty?: string
    date: string
    time: string
    patientName: string
  }
  onClose?: () => void
}

interface NotificationPreference {
  type: 'sms' | 'email'
  enabled: boolean
  timing: '1_hour' | '3_hours' | '1_day' | '1_week'
  recipient: string
}

export default function NotificationSettings({ bookingId, consultationInfo, onClose }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      type: 'sms',
      enabled: true,
      timing: '1_hour',
      recipient: ''
    },
    {
      type: 'email',
      enabled: true,
      timing: '1_day',
      recipient: ''
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const { success, error: showError } = useToast()

  const timingOptions = [
    { value: '1_hour', label: '1 giờ trước', description: 'Nhắc nhở 1 giờ trước lịch hẹn' },
    { value: '3_hours', label: '3 giờ trước', description: 'Nhắc nhở 3 giờ trước lịch hẹn' },
    { value: '1_day', label: '1 ngày trước', description: 'Nhắc nhở 1 ngày trước lịch hẹn' },
    { value: '1_week', label: '1 tuần trước', description: 'Nhắc nhở 1 tuần trước lịch hẹn' }
  ]

  const handlePreferenceChange = (index: number, field: keyof NotificationPreference, value: any) => {
    const newPreferences = [...preferences]
    newPreferences[index] = { ...newPreferences[index], [field]: value }
    setPreferences(newPreferences)
  }

  const handleTestNotification = async (type: 'sms' | 'email') => {
    const preference = preferences.find(p => p.type === type)
    if (!preference || !preference.recipient) {
      showError(`Vui lòng nhập ${type === 'sms' ? 'số điện thoại' : 'email'} để test`)
      return
    }

    setIsLoading(true)
    try {
      const message = testMode 
        ? `Test: Nhắc nhở lịch tư vấn với ${consultationInfo?.doctorName || 'bác sĩ'} vào ${consultationInfo?.date || 'ngày'} lúc ${consultationInfo?.time || 'giờ'}`
        : `Nhắc nhở: Bạn có lịch tư vấn với ${consultationInfo?.doctorName || 'bác sĩ'} vào ${consultationInfo?.date || 'ngày'} lúc ${consultationInfo?.time || 'giờ'}. Vui lòng đến đúng giờ.`

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          recipient: preference.recipient,
          subject: type === 'email' ? 'Nhắc nhở lịch tư vấn - Hoàng Linh Medicine' : undefined,
          message,
          bookingId,
          consultationInfo
        })
      })

      const result = await response.json()
      if (result.success) {
        success(`${type.toUpperCase()} test đã được gửi thành công!`)
      } else {
        showError(result.message || `Không thể gửi ${type.toUpperCase()} test`)
      }
    } catch (error) {
      showError(`Có lỗi xảy ra khi gửi ${type.toUpperCase()} test`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Send test notifications for enabled preferences
      const enabledPreferences = preferences.filter(p => p.enabled && p.recipient)
      
      for (const preference of enabledPreferences) {
        const message = `Cài đặt thông báo: Bạn sẽ nhận ${preference.type === 'sms' ? 'SMS' : 'Email'} nhắc nhở ${timingOptions.find(t => t.value === preference.timing)?.label} cho lịch tư vấn.`
        
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: preference.type,
            recipient: preference.recipient,
            subject: preference.type === 'email' ? 'Cài đặt thông báo - Hoàng Linh Medicine' : undefined,
            message,
            bookingId,
            consultationInfo
          })
        })
      }

      success('Cài đặt thông báo đã được lưu thành công!')
      if (onClose) onClose()
    } catch (error) {
      showError('Có lỗi xảy ra khi lưu cài đặt')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Cài đặt thông báo</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      {consultationInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Thông tin lịch tư vấn</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><span className="font-medium">Bác sĩ:</span> {consultationInfo.doctorName}</p>
            <p><span className="font-medium">Ngày:</span> {consultationInfo.date}</p>
            <p><span className="font-medium">Giờ:</span> {consultationInfo.time}</p>
            <p><span className="font-medium">Bệnh nhân:</span> {consultationInfo.patientName}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {preferences.map((preference, index) => (
          <div key={preference.type} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {preference.type === 'sms' ? (
                  <Smartphone className="w-5 h-5 text-green-600" />
                ) : (
                  <Mail className="w-5 h-5 text-blue-600" />
                )}
                <h3 className="font-medium text-gray-900">
                  {preference.type === 'sms' ? 'SMS' : 'Email'} nhắc nhở
                </h3>
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preference.enabled}
                  onChange={(e) => handlePreferenceChange(index, 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Bật</span>
              </label>
            </div>

            {preference.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {preference.type === 'sms' ? 'Số điện thoại' : 'Email'}
                  </label>
                  <input
                    type={preference.type === 'sms' ? 'tel' : 'email'}
                    value={preference.recipient}
                    onChange={(e) => handlePreferenceChange(index, 'recipient', e.target.value)}
                    placeholder={preference.type === 'sms' ? '0901234567' : 'example@email.com'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian nhắc nhở
                  </label>
                  <select
                    value={preference.timing}
                    onChange={(e) => handlePreferenceChange(index, 'timing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {timingOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleTestNotification(preference.type)}
                    disabled={isLoading || !preference.recipient}
                    className="flex-1"
                    variant="outline"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Test {preference.type.toUpperCase()}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={testMode}
            onChange={(e) => setTestMode(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Chế độ test (gửi ngay lập tức)</span>
        </label>

        <div className="flex space-x-3">
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
            >
              Hủy
            </Button>
          )}
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Lưu cài đặt
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 