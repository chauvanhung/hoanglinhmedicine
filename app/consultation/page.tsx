'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth'
import { createConsultation } from '@/lib/consultationService'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  CalendarDays,
  Users,
  Award,
  Stethoscope,
  Shield,
  CreditCard,
  Bell
} from 'lucide-react'

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  reviews: number
  image: string
  availableSlots: string[]
  price: number
  description: string
  qualifications: string[]
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'BS. Nguyễn Văn An',
    specialty: 'Tim mạch',
    experience: '15 năm kinh nghiệm',
    rating: 4.8,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face&q=80',
    availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
    price: 500000,
    description: 'Chuyên gia tim mạch với hơn 15 năm kinh nghiệm trong điều trị các bệnh lý tim mạch, tăng huyết áp, suy tim.',
    qualifications: ['Bác sĩ chuyên khoa Tim mạch', 'Thành viên Hội Tim mạch Việt Nam', 'Chứng chỉ siêu âm tim']
  },
  {
    id: '2',
    name: 'BS. Trần Thị Bình',
    specialty: 'Nội tiết',
    experience: '12 năm kinh nghiệm',
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=200&h=200&fit=crop&crop=face&q=80',
    availableSlots: ['08:00', '09:00', '13:00', '14:00', '15:00'],
    price: 450000,
    description: 'Chuyên gia nội tiết chuyên điều trị đái tháo đường, bệnh tuyến giáp và các rối loạn nội tiết khác.',
    qualifications: ['Bác sĩ chuyên khoa Nội tiết', 'Thành viên Hội Nội tiết Việt Nam', 'Chứng chỉ điều trị đái tháo đường']
  },
  {
    id: '3',
    name: 'BS. Lê Văn Cường',
    specialty: 'Tiêu hóa',
    experience: '18 năm kinh nghiệm',
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face&q=80',
    availableSlots: ['10:00', '11:00', '15:00', '16:00', '17:00'],
    price: 550000,
    description: 'Chuyên gia tiêu hóa với kinh nghiệm điều trị các bệnh lý dạ dày, gan mật, đại tràng.',
    qualifications: ['Bác sĩ chuyên khoa Tiêu hóa', 'Thành viên Hội Tiêu hóa Việt Nam', 'Chứng chỉ nội soi tiêu hóa']
  },
  {
    id: '4',
    name: 'BS. Phạm Thị Dung',
    specialty: 'Nhi khoa',
    experience: '10 năm kinh nghiệm',
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face&q=80',
    availableSlots: ['08:00', '09:00', '10:00', '14:00', '15:00'],
    price: 400000,
    description: 'Bác sĩ nhi khoa chuyên điều trị các bệnh lý thường gặp ở trẻ em, tư vấn dinh dưỡng và tiêm chủng.',
    qualifications: ['Bác sĩ chuyên khoa Nhi', 'Thành viên Hội Nhi khoa Việt Nam', 'Chứng chỉ dinh dưỡng nhi khoa']
  }
]

export default function ConsultationPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    symptoms: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn bác sĩ, ngày và giờ tư vấn')
      return
    }
    
    setIsSubmitting(true)
    try {
      const consultationData = {
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorImage: selectedDoctor.image,
        date: selectedDate,
        time: selectedTime,
        duration: 30,
        symptoms: formData.symptoms,
        notes: formData.notes,
        price: selectedDoctor.price,
        paymentMethod: 'cod' as const
      }

      const result = await createConsultation(consultationData)

      if (result.success) {
        alert('Đặt lịch tư vấn thành công!')
        router.push('/consultations')
      } else {
        alert(`Lỗi: ${result.message}`)
      }
    } catch (error) {
      console.error('Error booking consultation:', error)
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button 
            onClick={() => router.push('/')}
            className="hover:text-primary-600 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Trang chủ
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Đặt lịch tư vấn</span>
        </nav>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt lịch tư vấn với bác sĩ</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tư vấn trực tuyến với các bác sĩ chuyên khoa hàng đầu. 
            Nhận tư vấn nhanh chóng, tiện lợi và bảo mật thông tin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách bác sĩ */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Chọn bác sĩ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`bg-white rounded-lg shadow-sm border-2 p-6 cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-primary-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {selectedDoctor?.id === doctor.id && (
                        <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-primary-600 font-medium mb-2">{doctor.specialty}</p>
                      <p className="text-sm text-gray-600 mb-2">{doctor.experience}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= doctor.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {doctor.rating} ({doctor.reviews} đánh giá)
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(doctor.price)}
                        </span>
                        <span className="text-sm text-gray-500">/ lần tư vấn</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2">{doctor.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form đặt lịch */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin đặt lịch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Chọn ngày */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Chọn ngày</option>
                    {getAvailableDates().map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chọn giờ */}
                {selectedDoctor && selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn giờ
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedDoctor.availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                            selectedTime === time
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thông tin cá nhân */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Triệu chứng
                    </label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Mô tả triệu chứng của bạn..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú thêm
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Thông tin bổ sung..."
                    />
                  </div>
                </div>

                {/* Tổng tiền */}
                {selectedDoctor && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Phí tư vấn:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(selectedDoctor.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-primary-600">
                      <span>Tổng cộng:</span>
                      <span>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(selectedDoctor.price)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedDoctor || !selectedDate || !selectedTime || isSubmitting}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt lịch tư vấn'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tại sao chọn tư vấn trực tuyến?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Không cần di chuyển, chờ đợi. Tư vấn mọi lúc, mọi nơi chỉ với một cuộc gọi.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chuyên gia hàng đầu</h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, được đào tạo bài bản.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật thông tin</h3>
              <p className="text-gray-600">
                Thông tin cá nhân và hồ sơ bệnh án được bảo mật tuyệt đối.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 