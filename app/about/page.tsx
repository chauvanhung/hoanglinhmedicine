'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { 
  Shield, 
  Heart, 
  Truck, 
  Users, 
  Award, 
  Target, 
  CheckCircle, 
  Star,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react'
import Image from 'next/image'

const stats = [
  { label: 'Khách hàng phục vụ', value: '50,000+', icon: Users },
  { label: 'Sản phẩm chất lượng', value: '1,000+', icon: Shield },
  { label: 'Năm kinh nghiệm', value: '10+', icon: Award },
  { label: 'Đánh giá 5 sao', value: '98%', icon: Star }
]

const values = [
  {
    title: 'Chất lượng đảm bảo',
    description: 'Cam kết cung cấp sản phẩm chất lượng cao, có nguồn gốc rõ ràng và được kiểm định nghiêm ngặt.',
    icon: Shield
  },
  {
    title: 'Tư vấn chuyên nghiệp',
    description: 'Đội ngũ dược sĩ và AI tư vấn sẵn sàng hỗ trợ khách hàng 24/7 với kiến thức chuyên môn cao.',
    icon: Heart
  },
  {
    title: 'Giao hàng nhanh chóng',
    description: 'Dịch vụ giao hàng nhanh chóng, an toàn với thời gian giao hàng cam kết và theo dõi real-time.',
    icon: Truck
  },
  {
    title: 'Khách hàng là trung tâm',
    description: 'Luôn đặt lợi ích và sức khỏe của khách hàng lên hàng đầu trong mọi quyết định kinh doanh.',
    icon: Users
  }
]

const milestones = [
  {
    year: '2014',
    title: 'Thành lập công ty',
    description: 'Hoàng Linh Medicine được thành lập với mục tiêu cung cấp thuốc chất lượng cao cho người dân Việt Nam.'
  },
  {
    year: '2016',
    title: 'Mở rộng chuỗi cửa hàng',
    description: 'Phát triển thành chuỗi 10 cửa hàng tại Hà Nội và các tỉnh lân cận.'
  },
  {
    year: '2019',
    title: 'Ra mắt website bán hàng',
    description: 'Khởi chạy nền tảng thương mại điện tử để phục vụ khách hàng toàn quốc.'
  },
  {
    year: '2021',
    title: 'Tích hợp AI tư vấn',
    description: 'Triển khai hệ thống AI tư vấn sức khỏe 24/7, nâng cao trải nghiệm khách hàng.'
  },
  {
    year: '2024',
    title: 'Mục tiêu tương lai',
    description: 'Phấn đấu trở thành nhà thuốc online hàng đầu Việt Nam với dịch vụ chăm sóc sức khỏe toàn diện.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Về Hoàng Linh Medicine
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
                Chúng tôi cam kết mang đến sự chăm sóc sức khỏe tốt nhất cho mọi người 
                thông qua công nghệ hiện đại và dịch vụ chuyên nghiệp.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Câu chuyện của chúng tôi
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Hoàng Linh Medicine được thành lập vào năm 2014 với sứ mệnh cung cấp 
                    thuốc chất lượng cao và dịch vụ chăm sóc sức khỏe tốt nhất cho người dân Việt Nam.
                  </p>
                  <p>
                    Từ một cửa hàng nhỏ tại Hà Nội, chúng tôi đã phát triển thành một 
                    chuỗi nhà thuốc uy tín với hơn 10 cửa hàng và nền tảng thương mại điện tử hiện đại.
                  </p>
                  <p>
                    Với đội ngũ dược sĩ chuyên nghiệp và công nghệ AI tiên tiến, chúng tôi 
                    cam kết mang đến trải nghiệm mua sắm thuốc an toàn, tiện lợi và chuyên nghiệp.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
                  alt="Hoàng Linh Medicine Store"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Sứ mệnh</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Cung cấp thuốc chất lượng cao và dịch vụ chăm sóc sức khỏe toàn diện, 
                  giúp mọi người dân Việt Nam có thể tiếp cận dễ dàng với các sản phẩm 
                  y tế an toàn, hiệu quả và giá cả hợp lý.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-sm border">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Tầm nhìn</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành nhà thuốc online hàng đầu Việt Nam, tiên phong trong việc 
                  ứng dụng công nghệ AI và digital transformation để nâng cao chất lượng 
                  dịch vụ chăm sóc sức khỏe cộng đồng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Chặng đường phát triển
              </h2>
              <p className="text-xl text-gray-600">
                Những cột mốc quan trọng trong hành trình 10 năm của chúng tôi
              </p>
            </div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Liên hệ với chúng tôi
                </h2>
                <p className="text-gray-600">
                  Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Điện thoại</h3>
                  <p className="text-gray-600">1900-1234</p>
                  <p className="text-gray-600">Hỗ trợ 24/7</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">info@hoanglinh.com</p>
                  <p className="text-gray-600">support@hoanglinh.com</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Địa chỉ</h3>
                  <p className="text-gray-600">123 Đường ABC, Quận XYZ</p>
                  <p className="text-gray-600">Hà Nội, Việt Nam</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button size="lg">
                  Liên hệ ngay
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
} 