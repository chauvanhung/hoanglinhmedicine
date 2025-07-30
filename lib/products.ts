// Database sản phẩm mở rộng với thông tin chi tiết
export const productsDB = [
  {
    id: '1',
    name: 'Paracetamol',
    ingredient: 'Paracetamol 500mg',
    activeIngredient: 'Paracetamol',
    dosage: '500mg',
    uses: 'Giảm đau, hạ sốt',
    symptoms: ['đau đầu', 'đau răng', 'đau cơ', 'sốt', 'cảm lạnh'],
    price: 15000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Đau dạ dày'],
    instructions: 'Uống 1-2 viên mỗi 4-6 giờ khi cần thiết'
  },
  {
    id: '2',
    name: 'Vitamin C',
    ingredient: 'Vitamin C 1000mg',
    activeIngredient: 'Ascorbic Acid',
    dosage: '1000mg',
    uses: 'Tăng sức đề kháng, bổ sung vitamin C',
    symptoms: ['thiếu vitamin C', 'suy nhược', 'cảm lạnh', 'mệt mỏi'],
    price: 35000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Tiêu chảy nhẹ nếu dùng quá liều'],
    instructions: 'Uống 1 viên mỗi ngày sau bữa ăn'
  },
  {
    id: '3',
    name: 'Ibuprofen',
    ingredient: 'Ibuprofen 400mg',
    activeIngredient: 'Ibuprofen',
    dosage: '400mg',
    uses: 'Giảm đau, chống viêm',
    symptoms: ['đau khớp', 'đau lưng', 'viêm khớp', 'đau cơ'],
    price: 25000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau dạ dày', 'Chóng mặt'],
    instructions: 'Uống 1 viên mỗi 6-8 giờ khi cần thiết'
  },
  {
    id: '4',
    name: 'Omeprazole',
    ingredient: 'Omeprazole 20mg',
    activeIngredient: 'Omeprazole',
    dosage: '20mg',
    uses: 'Điều trị viêm loét dạ dày, trào ngược axit',
    symptoms: ['đau dạ dày', 'ợ chua', 'trào ngược', 'viêm loét'],
    price: 45000,
    manufacturer: 'Dược phẩm Quốc tế',
    sideEffects: ['Đau đầu', 'Buồn nôn'],
    instructions: 'Uống 1 viên mỗi ngày trước bữa sáng'
  },
  {
    id: '5',
    name: 'Amoxicillin',
    ingredient: 'Amoxicillin 500mg',
    activeIngredient: 'Amoxicillin',
    dosage: '500mg',
    uses: 'Kháng sinh điều trị nhiễm khuẩn',
    symptoms: ['viêm họng', 'viêm phổi', 'viêm tai giữa', 'nhiễm khuẩn đường hô hấp'],
    price: 55000,
    manufacturer: 'Dược phẩm Quốc tế',
    sideEffects: ['Tiêu chảy', 'Buồn nôn', 'Phát ban'],
    instructions: 'Uống 1 viên 3 lần/ngày sau bữa ăn, cần đơn thuốc'
  }
  // Thêm các sản phẩm khác ở đây...
]

export interface Product {
  id: string
  name: string
  ingredient: string
  activeIngredient: string
  dosage: string
  uses: string
  symptoms: string[]
  price: number
  manufacturer: string
  sideEffects: string[]
  instructions: string
} 