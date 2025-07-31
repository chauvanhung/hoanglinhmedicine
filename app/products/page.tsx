'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'
import { Search, Filter, X, Grid, List, Star, Truck, Shield, ChevronRight, SlidersHorizontal, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Mảng hình ảnh thực tế cho 30 sản phẩm khác nhau
const productImages = [
  // Thuốc giảm đau
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Vitamin
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc tiêu hóa
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc dị ứng
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Kháng sinh
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc tiểu đường
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc tim mạch
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc xương khớp
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thuốc hô hấp
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Thực phẩm chức năng
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  
  // Hình ảnh thực tế từ Unsplash
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&crop=center&q=80',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&crop=center&q=80',
]

// Dữ liệu sản phẩm mở rộng với nhiều hình ảnh đa dạng
export const allProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Thuốc giảm đau, hạ sốt hiệu quả',
    price: 15000,
    image: '/images/products/paracetamol.jpg',
    category: 'Thuốc giảm đau',
    stock: 100,
    prescription: false,
    manufacturer: 'Dược phẩm Quốc tế',
    origin: 'Việt Nam',
    expiry: '36 tháng',
    dosage: '1-2 viên/lần, tối đa 4 lần/ngày',
    ingredients: 'Paracetamol 500mg',
    sideEffects: 'Buồn nôn, đau dạ dày (hiếm gặp)',
    contraindications: 'Người mẫn cảm với Paracetamol',
    storage: 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp',
    packaging: 'Hộp 10 vỉ x 10 viên',
    usage: 'Uống sau bữa ăn',
    target: 'Người lớn và trẻ em trên 12 tuổi',
    benefits: [
      'Giảm đau đầu, đau răng, đau cơ',
      'Hạ sốt nhanh chóng',
      'An toàn cho dạ dày',
      'Không gây buồn ngủ'
    ],
    reviews: [
      { user: 'Nguyễn Văn A', rating: 5, comment: 'Thuốc rất hiệu quả, giảm đau nhanh' },
      { user: 'Trần Thị B', rating: 4, comment: 'Giá cả hợp lý, chất lượng tốt' },
      { user: 'Lê Văn C', rating: 5, comment: 'Đã sử dụng nhiều lần, rất hài lòng' }
    ]
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Tăng cường sức đề kháng, chống oxy hóa',
    price: 35000,
    image: productImages[1],
    category: 'Vitamin',
    stock: 50,
    prescription: false,
    manufacturer: 'Công ty TNHH Dược phẩm ABC',
    origin: 'Việt Nam',
    expiry: '24 tháng',
    dosage: '1 viên/ngày',
    ingredients: 'Vitamin C 1000mg, tá dược vừa đủ',
    sideEffects: 'Tiêu chảy nhẹ (nếu dùng quá liều)',
    contraindications: 'Người bị sỏi thận',
    storage: 'Bảo quản nơi khô ráo, nhiệt độ dưới 30°C',
    packaging: 'Lọ 60 viên',
    usage: 'Uống sau bữa ăn sáng',
    target: 'Người lớn cần bổ sung vitamin C',
    benefits: [
      'Tăng cường hệ miễn dịch',
      'Chống oxy hóa, làm đẹp da',
      'Hỗ trợ hấp thu sắt',
      'Tăng sức đề kháng'
    ],
    reviews: [
      { user: 'Phạm Thị D', rating: 5, comment: 'Uống thường xuyên, ít bị cảm cúm' },
      { user: 'Hoàng Văn E', rating: 4, comment: 'Viên thuốc dễ uống, hiệu quả tốt' },
      { user: 'Vũ Thị F', rating: 5, comment: 'Da đẹp hơn sau khi uống vitamin C' }
    ]
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    description: 'Điều trị viêm loét dạ dày, trào ngược axit',
    price: 45000,
    image: productImages[2],
    category: 'Thuốc tiêu hóa',
    stock: 30,
    prescription: true,
    manufacturer: 'Công ty Dược phẩm XYZ',
    origin: 'Việt Nam',
    expiry: '36 tháng',
    dosage: '1 viên/ngày, uống trước bữa sáng',
    ingredients: 'Omeprazole 20mg',
    sideEffects: 'Đau đầu, buồn nôn, tiêu chảy',
    contraindications: 'Phụ nữ có thai, trẻ em dưới 18 tuổi',
    storage: 'Bảo quản nơi khô ráo, tránh ánh sáng',
    packaging: 'Hộp 3 vỉ x 10 viên',
    usage: 'Uống trước bữa sáng 30 phút',
    target: 'Người bị viêm loét dạ dày, trào ngược axit',
    benefits: [
      'Giảm tiết axit dạ dày',
      'Điều trị viêm loét dạ dày',
      'Chống trào ngược axit',
      'Bảo vệ niêm mạc dạ dày'
    ],
    reviews: [
      { user: 'Đỗ Văn G', rating: 4, comment: 'Giảm đau dạ dày rõ rệt' },
      { user: 'Ngô Thị H', rating: 5, comment: 'Bác sĩ kê đơn, hiệu quả tốt' },
      { user: 'Lý Văn I', rating: 4, comment: 'Uống đúng liều, không có tác dụng phụ' }
    ]
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    description: 'Thuốc kháng histamine, điều trị dị ứng',
    price: 28000,
    image: productImages[3],
    category: 'Thuốc dị ứng',
    stock: 75,
    prescription: false,
  },
  {
    id: '5',
    name: 'Ibuprofen 400mg',
    description: 'Thuốc chống viêm, giảm đau',
    price: 25000,
    image: productImages[4],
    category: 'Thuốc giảm đau',
    stock: 60,
    prescription: false,
  },
  {
    id: '6',
    name: 'Vitamin D3 1000IU',
    description: 'Bổ sung vitamin D, tăng cường xương',
    price: 35000,
    image: productImages[5],
    category: 'Vitamin',
    stock: 40,
    prescription: false,
  },
  {
    id: '7',
    name: 'Lansoprazole 30mg',
    description: 'Điều trị loét dạ dày, tá tràng',
    price: 68000,
    image: productImages[6],
    category: 'Thuốc tiêu hóa',
    stock: 25,
    prescription: true,
  },
  {
    id: '8',
    name: 'Loratadine 10mg',
    description: 'Thuốc kháng histamine, không gây buồn ngủ',
    price: 32000,
    image: productImages[7],
    category: 'Thuốc dị ứng',
    stock: 80,
    prescription: false,
  },
  {
    id: '9',
    name: 'Amoxicillin 500mg',
    description: 'Kháng sinh điều trị nhiễm khuẩn',
    price: 55000,
    image: productImages[8],
    category: 'Kháng sinh',
    stock: 45,
    prescription: true,
  },
  {
    id: '10',
    name: 'Metformin 500mg',
    description: 'Điều trị tiểu đường type 2',
    price: 85000,
    image: productImages[9],
    category: 'Thuốc tiểu đường',
    stock: 35,
    prescription: true,
  },
  {
    id: '11',
    name: 'Losartan 50mg',
    description: 'Điều trị tăng huyết áp',
    price: 95000,
    image: productImages[10],
    category: 'Thuốc tim mạch',
    stock: 30,
    prescription: true,
  },
  {
    id: '12',
    name: 'Atorvastatin 20mg',
    description: 'Giảm cholesterol, phòng ngừa bệnh tim mạch',
    price: 120000,
    image: productImages[11],
    category: 'Thuốc tim mạch',
    stock: 25,
    prescription: true,
  },
  {
    id: '13',
    name: 'Aspirin 100mg',
    description: 'Giảm đau, hạ sốt, chống đông máu',
    price: 18000,
    image: productImages[12],
    category: 'Thuốc giảm đau',
    stock: 90,
    prescription: false,
  },
  {
    id: '14',
    name: 'Ranitidine 150mg',
    description: 'Điều trị viêm loét dạ dày, trào ngược axit',
    price: 38000,
    image: productImages[13],
    category: 'Thuốc tiêu hóa',
    stock: 55,
    prescription: false,
  },
  {
    id: '15',
    name: 'Ciprofloxacin 500mg',
    description: 'Kháng sinh điều trị nhiễm khuẩn',
    price: 65000,
    image: productImages[14],
    category: 'Kháng sinh',
    stock: 40,
    prescription: true,
  },
  {
    id: '16',
    name: 'Azithromycin 500mg',
    description: 'Kháng sinh điều trị nhiễm khuẩn đường hô hấp',
    price: 72000,
    image: productImages[15],
    category: 'Kháng sinh',
    stock: 35,
    prescription: true,
  },
  {
    id: '17',
    name: 'Fexofenadine 180mg',
    description: 'Điều trị dị ứng, không gây buồn ngủ',
    price: 45000,
    image: productImages[16],
    category: 'Thuốc dị ứng',
    stock: 65,
    prescription: false,
  },
  {
    id: '18',
    name: 'Montelukast 10mg',
    description: 'Điều trị hen suyễn, viêm mũi dị ứng',
    price: 88000,
    image: productImages[17],
    category: 'Thuốc hô hấp',
    stock: 30,
    prescription: true,
  },
  {
    id: '19',
    name: 'Pantoprazole 40mg',
    description: 'Điều trị viêm loét dạ dày, trào ngược axit',
    price: 68000,
    image: productImages[18],
    category: 'Thuốc tiêu hóa',
    stock: 40,
    prescription: true,
  },
  {
    id: '20',
    name: 'Amlodipine 5mg',
    description: 'Điều trị tăng huyết áp, đau thắt ngực',
    price: 78000,
    image: productImages[19],
    category: 'Thuốc tim mạch',
    stock: 35,
    prescription: true,
  },
  {
    id: '21',
    name: 'Alendronate 70mg',
    description: 'Điều trị loãng xương',
    price: 120000,
    image: productImages[20],
    category: 'Thuốc xương khớp',
    stock: 20,
    prescription: true,
  },
  {
    id: '22',
    name: 'Risedronate 35mg',
    description: 'Điều trị loãng xương',
    price: 150000,
    image: productImages[21],
    category: 'Thuốc xương khớp',
    stock: 15,
    prescription: true,
  },
  {
    id: '23',
    name: 'Calcium Carbonate 500mg',
    description: 'Bổ sung canxi, phòng ngừa loãng xương',
    price: 25000,
    image: productImages[22],
    category: 'Vitamin',
    stock: 70,
    prescription: false,
  },
  {
    id: '24',
    name: 'Iron Sulfate 325mg',
    description: 'Bổ sung sắt, điều trị thiếu máu',
    price: 28000,
    image: productImages[23],
    category: 'Vitamin',
    stock: 60,
    prescription: false,
  },
  {
    id: '25',
    name: 'Folic Acid 5mg',
    description: 'Bổ sung axit folic, phòng ngừa dị tật thai nhi',
    price: 22000,
    image: productImages[24],
    category: 'Vitamin',
    stock: 80,
    prescription: false,
  },
  {
    id: '26',
    name: 'Vitamin B12 1000mcg',
    description: 'Bổ sung vitamin B12, điều trị thiếu máu',
    price: 45000,
    image: productImages[25],
    category: 'Vitamin',
    stock: 45,
    prescription: false,
  },
  {
    id: '27',
    name: 'Omega-3 1000mg',
    description: 'Bổ sung omega-3, hỗ trợ tim mạch',
    price: 85000,
    image: productImages[26],
    category: 'Thực phẩm chức năng',
    stock: 50,
    prescription: false,
  },
  {
    id: '28',
    name: 'Glucosamine 1500mg',
    description: 'Hỗ trợ điều trị viêm khớp, đau khớp',
    price: 120000,
    image: productImages[27],
    category: 'Thuốc xương khớp',
    stock: 30,
    prescription: false,
  },
  {
    id: '29',
    name: 'Melatonin 3mg',
    description: 'Hỗ trợ giấc ngủ, điều trị mất ngủ',
    price: 95000,
    image: productImages[28],
    category: 'Thực phẩm chức năng',
    stock: 40,
    prescription: false,
  },
  {
    id: '30',
    name: 'Probiotics 10 tỷ CFU',
    description: 'Bổ sung lợi khuẩn, hỗ trợ tiêu hóa',
    price: 75000,
    image: productImages[29],
    category: 'Thực phẩm chức năng',
    stock: 55,
    prescription: false,
  },
]

const categories = [
  { name: 'Tất cả', icon: '🏥', count: allProducts.length },
  { name: 'Thuốc giảm đau', icon: '💊', count: allProducts.filter(p => p.category === 'Thuốc giảm đau').length },
  { name: 'Vitamin', icon: '🥗', count: allProducts.filter(p => p.category === 'Vitamin').length },
  { name: 'Thuốc tiêu hóa', icon: '🫀', count: allProducts.filter(p => p.category === 'Thuốc tiêu hóa').length },
  { name: 'Thuốc dị ứng', icon: '🤧', count: allProducts.filter(p => p.category === 'Thuốc dị ứng').length },
  { name: 'Kháng sinh', icon: '🦠', count: allProducts.filter(p => p.category === 'Kháng sinh').length },
  { name: 'Thuốc tiểu đường', icon: '🩸', count: allProducts.filter(p => p.category === 'Thuốc tiểu đường').length },
  { name: 'Thuốc tim mạch', icon: '❤️', count: allProducts.filter(p => p.category === 'Thuốc tim mạch').length },
  { name: 'Thuốc xương khớp', icon: '🦴', count: allProducts.filter(p => p.category === 'Thuốc xương khớp').length },
  { name: 'Thuốc hô hấp', icon: '🫁', count: allProducts.filter(p => p.category === 'Thuốc hô hấp').length },
  { name: 'Thực phẩm chức năng', icon: '💪', count: allProducts.filter(p => p.category === 'Thực phẩm chức năng').length },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>(allProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 150000])
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showSidebar, setShowSidebar] = useState(false)

  // Read search query from URL on component mount
  useEffect(() => {
    const searchFromUrl = searchParams?.get('search')
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, selectedCategory, priceRange, prescriptionOnly, sortBy])

  const filterProducts = () => {
    let filtered = allProducts

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter by prescription requirement
    if (prescriptionOnly) {
      filtered = filtered.filter(product => product.prescription)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'stock':
          return b.stock - a.stock
        default:
          return 0
      }
    })

    setProducts(filtered)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('Tất cả')
    setPriceRange([0, 150000])
    setPrescriptionOnly(false)
    setSortBy('name')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-primary-600">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Sản phẩm</span>
          {selectedCategory !== 'Tất cả' && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory !== 'Tất cả' ? selectedCategory : 'Tất cả sản phẩm'}
              </h1>
              <p className="text-gray-600">
                {selectedCategory !== 'Tất cả' 
                  ? `Khám phá các sản phẩm ${selectedCategory.toLowerCase()} chất lượng cao`
                  : 'Tìm kiếm và mua thuốc chất lượng cao'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                variant="outline"
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setViewMode('grid')}
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Danh mục
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.name} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.name}
                        onChange={() => setSelectedCategory(category.name)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedCategory === category.name
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedCategory === category.name && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm text-gray-700">{category.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Khoảng giá
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPriceRange([0, 50000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Dưới 50k
                    </button>
                    <button
                      onClick={() => setPriceRange([50000, 100000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      50k - 100k
                    </button>
                    <button
                      onClick={() => setPriceRange([100000, 150000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      100k - 150k
                    </button>
                    <button
                      onClick={() => setPriceRange([150000, 150000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Trên 150k
                    </button>
                  </div>
                </div>
              </div>

              {/* Prescription Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loại thuốc
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prescriptionOnly}
                    onChange={(e) => setPrescriptionOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Chỉ hiển thị thuốc kê đơn
                  </span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sắp xếp
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="name">Theo tên A-Z</option>
                  <option value="price-low">Giá tăng dần</option>
                  <option value="price-high">Giá giảm dần</option>
                  <option value="stock">Tồn kho cao nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Search and Filters */}
            <div className="lg:hidden mb-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thuốc, thực phẩm chức năng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="price-low">Giá tăng dần</option>
                  <option value="price-high">Giá giảm dần</option>
                  <option value="stock">Tồn kho</option>
                </select>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.name
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count and Features */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-600">
                  Tìm thấy <span className="font-semibold text-primary-600">{products.length}</span> sản phẩm
                  {searchQuery && ` cho "${searchQuery}"`}
                  {selectedCategory !== 'Tất cả' && ` trong danh mục "${selectedCategory}"`}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Chất lượng đảm bảo</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Giao hàng nhanh</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Đánh giá cao</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <ProductGrid products={products} viewMode={viewMode} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-4">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Filters Content */}
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tìm kiếm
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Danh mục
                    </label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category.name} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.name}
                            onChange={() => setSelectedCategory(category.name)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedCategory === category.name
                              ? 'border-primary-600 bg-primary-600'
                              : 'border-gray-300'
                          }`}>
                            {selectedCategory === category.name && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center justify-between flex-1">
                            <span className="text-sm text-gray-700">{category.name}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Khoảng giá
                    </label>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Prescription Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Loại thuốc
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prescriptionOnly}
                        onChange={(e) => setPrescriptionOnly(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Chỉ hiển thị thuốc kê đơn
                      </span>
                    </label>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Sắp xếp
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="name">Theo tên A-Z</option>
                      <option value="price-low">Giá tăng dần</option>
                      <option value="price-high">Giá giảm dần</option>
                      <option value="stock">Tồn kho cao nhất</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={() => setShowSidebar(false)}
                      className="flex-1"
                    >
                      Áp dụng
                    </Button>
                    <Button
                      onClick={() => {
                        clearFilters()
                        setShowSidebar(false)
                      }}
                      variant="outline"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 