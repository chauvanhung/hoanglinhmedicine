'use client'
import { useState, useEffect } from 'react'
import { Bell, Clock, Calendar, User, Smartphone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from './Toast'

interface ReminderProps {
  consultationInfo: {
    doctorName: string
    date: string
    time: string
    patientName: string
  }
  bookingId?: string
  onReminderSent?: () => void
}

interface ScheduledReminder {
  id: string
  type: 'sms' | 'email'
  timing: string
  scheduledFor: string
  status: 'pending' | 'sent' | 'failed'
  recipient: string
}

export default function NotificationReminder({ consultationInfo, bookingId, onReminderSent }: ReminderProps) {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { success, error: showError } = useToast()

  useEffect(() => {
    // Generate default reminders based on consultation date
    const consultationDate = new Date(consultationInfo.date + ' ' + consultationInfo.time)
    const now = new Date()
    
    const defaultReminders: ScheduledReminder[] = [
      {
        id: 'reminder_1',
        type: 'sms',
        timing: '1 giờ trước',
        scheduledFor: new Date(consultationDate.getTime() - 60 * 60 * 1000).toISOString(),
        status: 'pending',
        recipient: ''
      },
      {
        id: 'reminder_2',
        type: 'email',
        timing: '1 ngày trước',
        scheduledFor: new Date(consultationDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        recipient: ''
      }
    ]

    setReminders(defaultReminders)
  }, [consultationInfo])

  const handleSendNow = async (reminder: ScheduledReminder) => {
    if (!reminder.recipient) {
      showError(`Vui lòng nhập ${reminder.type === 'sms' ? 'số điện thoại' : 'email'} để gửi nhắc nhở`)
      return
    }

    setIsLoading(true)
    try {
      const message = `Nhắc nhở: Bạn có lịch tư vấn với ${consultationInfo.doctorName} vào ${consultationInfo.date} lúc ${consultationInfo.time}. Vui lòng đến đúng giờ.`

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reminder.type,
          recipient: reminder.recipient,
          subject: reminder.type === 'email' ? 'Nhắc nhở lịch tư vấn - Hoàng Linh Medicine' : undefined,
          message,
          bookingId,
          consultationInfo
        })
      })

      const result = await response.json()
      if (result.success) {
        // Update reminder status
        setReminders(prev => prev.map(r => 
          r.id === reminder.id ? { ...r, status: 'sent' } : r
        ))
        success(`${reminder.type.toUpperCase()} nhắc nhở đã được gửi thành công!`)
        onReminderSent?.()
      } else {
        setReminders(prev => prev.map(r => 
          r.id === reminder.id ? { ...r, status: 'failed' } : r
        ))
        showError(result.message || `Không thể gửi ${reminder.type.toUpperCase()} nhắc nhở`)
      }
    } catch (error) {
      setReminders(prev => prev.map(r => 
        r.id === reminder.id ? { ...r, status: 'failed' } : r
      ))
      showError(`Có lỗi xảy ra khi gửi ${reminder.type.toUpperCase()} nhắc nhở`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRecipient = (reminderId: string, recipient: string) => {
    setReminders(prev => prev.map(r => 
      r.id === reminderId ? { ...r, recipient } : r
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Đã gửi'
      case 'failed':
        return 'Thất bại'
      case 'pending':
        return 'Chờ gửi'
      default:
        return 'Không xác định'
    }
  }

  const formatScheduledTime = (scheduledFor: string) => {
    const date = new Date(scheduledFor)
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isPastScheduledTime = (scheduledFor: string) => {
    return new Date(scheduledFor) <= new Date()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Nhắc nhở lịch tư vấn</h3>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {reminder.type === 'sms' ? (
                  <Smartphone className="w-5 h-5 text-green-600" />
                ) : (
                  <Mail className="w-5 h-5 text-blue-600" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {reminder.type === 'sms' ? 'SMS' : 'Email'} nhắc nhở
                  </h4>
                  <p className="text-sm text-gray-600">{reminder.timing}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(reminder.status)}
                <span className="text-sm font-medium text-gray-700">
                  {getStatusText(reminder.status)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {reminder.type === 'sms' ? 'Số điện thoại' : 'Email'}
                </label>
                <input
                  type={reminder.type === 'sms' ? 'tel' : 'email'}
                  value={reminder.recipient}
                  onChange={(e) => handleUpdateRecipient(reminder.id, e.target.value)}
                  placeholder={reminder.type === 'sms' ? '0901234567' : 'example@email.com'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Dự kiến gửi: {formatScheduledTime(reminder.scheduledFor)}</span>
                </div>
                
                {isPastScheduledTime(reminder.scheduledFor) && reminder.status === 'pending' && (
                  <span className="text-orange-600 font-medium">Quá hạn</span>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => handleSendNow(reminder)}
                  disabled={isLoading || !reminder.recipient || reminder.status === 'sent'}
                  className="flex-1"
                  variant={reminder.status === 'sent' ? 'outline' : 'default'}
                >
                  {reminder.status === 'sent' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Đã gửi
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Gửi ngay
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Lưu ý:</p>
            <ul className="space-y-1">
              <li>• Nhắc nhở sẽ được gửi tự động theo lịch trình</li>
              <li>• Bạn có thể gửi nhắc nhở ngay lập tức bằng nút "Gửi ngay"</li>
              <li>• Đảm bảo thông tin liên hệ chính xác để nhận được nhắc nhở</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 