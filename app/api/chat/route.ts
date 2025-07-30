import { NextRequest, NextResponse } from 'next/server'

// Lưu trữ ngữ cảnh cuộc hội thoại (đơn giản)
let conversationContext = {
  lastTopic: '',
  lastProducts: [] as any[]
}

// Database sản phẩm mở rộng với thông tin chi tiết
const productsDB = [
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
  },
  {
    id: '6',
    name: 'Cetirizine',
    ingredient: 'Cetirizine 10mg',
    activeIngredient: 'Cetirizine',
    dosage: '10mg',
    uses: 'Điều trị dị ứng, mề đay',
    symptoms: ['dị ứng', 'mề đay', 'ngứa', 'chảy nước mũi', 'hắt hơi'],
    price: 28000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn ngủ', 'Khô miệng'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối'
  },
  {
    id: '7',
    name: 'Loratadine',
    ingredient: 'Loratadine 10mg',
    activeIngredient: 'Loratadine',
    dosage: '10mg',
    uses: 'Điều trị dị ứng, không gây buồn ngủ',
    symptoms: ['dị ứng', 'viêm mũi dị ứng', 'mề đay', 'ngứa'],
    price: 32000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau đầu', 'Khô miệng'],
    instructions: 'Uống 1 viên mỗi ngày'
  },
  {
    id: '8',
    name: 'Diclofenac',
    ingredient: 'Diclofenac 50mg',
    activeIngredient: 'Diclofenac',
    dosage: '50mg',
    uses: 'Giảm đau, chống viêm mạnh',
    symptoms: ['đau khớp', 'viêm khớp', 'đau lưng', 'đau cơ'],
    price: 38000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau dạ dày', 'Chóng mặt', 'Phù'],
    instructions: 'Uống 1 viên 2-3 lần/ngày sau bữa ăn'
  },
  {
    id: '9',
    name: 'Metformin',
    ingredient: 'Metformin 500mg',
    activeIngredient: 'Metformin',
    dosage: '500mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 42000,
    manufacturer: 'Dược phẩm Quốc tế',
    sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Chán ăn'],
    instructions: 'Uống 1 viên 2-3 lần/ngày sau bữa ăn, cần đơn thuốc'
  },
  {
    id: '10',
    name: 'Amlodipine',
    ingredient: 'Amlodipine 5mg',
    activeIngredient: 'Amlodipine',
    dosage: '5mg',
    uses: 'Điều trị tăng huyết áp',
    symptoms: ['tăng huyết áp', 'cao huyết áp'],
    price: 48000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Phù chân', 'Đau đầu', 'Chóng mặt'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi sáng, cần đơn thuốc'
  },
  {
    id: '11',
    name: 'Simvastatin',
    ingredient: 'Simvastatin 20mg',
    activeIngredient: 'Simvastatin',
    dosage: '20mg',
    uses: 'Hạ cholesterol máu',
    symptoms: ['tăng cholesterol', 'mỡ máu cao'],
    price: 52000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau cơ', 'Buồn nôn', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối, cần đơn thuốc'
  },
  {
    id: '12',
    name: 'Lansoprazole',
    ingredient: 'Lansoprazole 30mg',
    activeIngredient: 'Lansoprazole',
    dosage: '30mg',
    uses: 'Điều trị viêm loét dạ dày, trào ngược axit',
    symptoms: ['đau dạ dày', 'ợ chua', 'trào ngược', 'viêm loét'],
    price: 58000,
    manufacturer: 'Dược phẩm Quốc tế',
    sideEffects: ['Đau đầu', 'Buồn nôn', 'Tiêu chảy'],
    instructions: 'Uống 1 viên mỗi ngày trước bữa sáng'
  },
  {
    id: '13',
    name: 'Ciprofloxacin',
    ingredient: 'Ciprofloxacin 500mg',
    activeIngredient: 'Ciprofloxacin',
    dosage: '500mg',
    uses: 'Kháng sinh điều trị nhiễm khuẩn đường tiết niệu',
    symptoms: ['viêm bàng quang', 'nhiễm khuẩn đường tiết niệu', 'tiểu buốt'],
    price: 65000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Chóng mặt'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '14',
    name: 'Fluconazole',
    ingredient: 'Fluconazole 150mg',
    activeIngredient: 'Fluconazole',
    dosage: '150mg',
    uses: 'Điều trị nấm Candida',
    symptoms: ['nấm âm đạo', 'nấm miệng', 'nhiễm nấm'],
    price: 45000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau đầu', 'Buồn nôn', 'Đau bụng'],
    instructions: 'Uống 1 viên duy nhất hoặc theo chỉ định bác sĩ'
  },
  {
    id: '15',
    name: 'Dextromethorphan',
    ingredient: 'Dextromethorphan 15mg',
    activeIngredient: 'Dextromethorphan',
    dosage: '15mg',
    uses: 'Giảm ho khan',
    symptoms: ['ho khan', 'ho không đờm', 'ho dai dẳng'],
    price: 22000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn ngủ', 'Chóng mặt', 'Buồn nôn'],
    instructions: 'Uống 1 viên mỗi 4-6 giờ khi cần thiết'
  },
  {
    id: '16',
    name: 'Guaifenesin',
    ingredient: 'Guaifenesin 200mg',
    activeIngredient: 'Guaifenesin',
    dosage: '200mg',
    uses: 'Long đờm, giảm ho có đờm',
    symptoms: ['ho có đờm', 'đờm đặc', 'viêm phế quản'],
    price: 18000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Đau dạ dày'],
    instructions: 'Uống 1 viên 3-4 lần/ngày với nhiều nước'
  },
  {
    id: '17',
    name: 'Pseudoephedrine',
    ingredient: 'Pseudoephedrine 30mg',
    activeIngredient: 'Pseudoephedrine',
    dosage: '30mg',
    uses: 'Thông mũi, giảm nghẹt mũi',
    symptoms: ['nghẹt mũi', 'sổ mũi', 'cảm lạnh'],
    price: 25000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Mất ngủ', 'Tăng huyết áp', 'Tim đập nhanh'],
    instructions: 'Uống 1 viên mỗi 4-6 giờ, không dùng quá 7 ngày'
  },
  {
    id: '18',
    name: 'Bisacodyl',
    ingredient: 'Bisacodyl 5mg',
    activeIngredient: 'Bisacodyl',
    dosage: '5mg',
    uses: 'Thuốc nhuận tràng điều trị táo bón',
    symptoms: ['táo bón', 'khó đi ngoài'],
    price: 15000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau bụng', 'Tiêu chảy', 'Chuột rút'],
    instructions: 'Uống 1 viên vào buổi tối trước khi đi ngủ'
  },
  {
    id: '19',
    name: 'Loperamide',
    ingredient: 'Loperamide 2mg',
    activeIngredient: 'Loperamide',
    dosage: '2mg',
    uses: 'Điều trị tiêu chảy',
    symptoms: ['tiêu chảy', 'đi ngoài lỏng'],
    price: 20000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Táo bón', 'Đau bụng', 'Buồn nôn'],
    instructions: 'Uống 2 viên đầu tiên, sau đó 1 viên sau mỗi lần đi ngoài'
  },
  {
    id: '20',
    name: 'Calcium Carbonate',
    ingredient: 'Calcium Carbonate 500mg',
    activeIngredient: 'Calcium Carbonate',
    dosage: '500mg',
    uses: 'Bổ sung canxi, điều trị loãng xương',
    symptoms: ['thiếu canxi', 'loãng xương', 'đau xương'],
    price: 30000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Táo bón', 'Đầy hơi'],
    instructions: 'Uống 1-2 viên mỗi ngày sau bữa ăn'
  },
  {
    id: '21',
    name: 'Aspirin',
    ingredient: 'Aspirin 100mg',
    activeIngredient: 'Acetylsalicylic Acid',
    dosage: '100mg',
    uses: 'Giảm đau, hạ sốt, chống đông máu',
    symptoms: ['đau đầu', 'sốt', 'đau cơ', 'dự phòng đột quỵ'],
    price: 12000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau dạ dày', 'Chảy máu'],
    instructions: 'Uống 1 viên mỗi ngày sau bữa ăn'
  },
  {
    id: '22',
    name: 'Ranitidine',
    ingredient: 'Ranitidine 150mg',
    activeIngredient: 'Ranitidine',
    dosage: '150mg',
    uses: 'Điều trị viêm loét dạ dày, giảm tiết axit',
    symptoms: ['đau dạ dày', 'ợ chua', 'viêm loét'],
    price: 28000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau đầu', 'Chóng mặt'],
    instructions: 'Uống 1 viên 2 lần/ngày trước bữa ăn'
  },
  {
    id: '23',
    name: 'Famotidine',
    ingredient: 'Famotidine 20mg',
    activeIngredient: 'Famotidine',
    dosage: '20mg',
    uses: 'Điều trị viêm loét dạ dày, trào ngược axit',
    symptoms: ['đau dạ dày', 'ợ chua', 'trào ngược'],
    price: 32000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau đầu', 'Buồn nôn'],
    instructions: 'Uống 1 viên 2 lần/ngày'
  },
  {
    id: '24',
    name: 'Dimenhydrinate',
    ingredient: 'Dimenhydrinate 50mg',
    activeIngredient: 'Dimenhydrinate',
    dosage: '50mg',
    uses: 'Chống say tàu xe, chống nôn',
    symptoms: ['say tàu xe', 'buồn nôn', 'chóng mặt'],
    price: 18000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn ngủ', 'Khô miệng'],
    instructions: 'Uống 1 viên 30 phút trước khi đi xe'
  },
  {
    id: '25',
    name: 'Diphenhydramine',
    ingredient: 'Diphenhydramine 25mg',
    activeIngredient: 'Diphenhydramine',
    dosage: '25mg',
    uses: 'Điều trị dị ứng, gây buồn ngủ',
    symptoms: ['dị ứng', 'mề đay', 'ngứa', 'mất ngủ'],
    price: 15000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn ngủ', 'Khô miệng', 'Chóng mặt'],
    instructions: 'Uống 1 viên mỗi 4-6 giờ khi cần thiết'
  },
  {
    id: '26',
    name: 'Chlorpheniramine',
    ingredient: 'Chlorpheniramine 4mg',
    activeIngredient: 'Chlorpheniramine',
    dosage: '4mg',
    uses: 'Điều trị dị ứng, cảm lạnh',
    symptoms: ['dị ứng', 'sổ mũi', 'hắt hơi', 'ngứa'],
    price: 12000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn ngủ', 'Khô miệng'],
    instructions: 'Uống 1 viên 3-4 lần/ngày'
  },
  {
    id: '27',
    name: 'Phenylephrine',
    ingredient: 'Phenylephrine 10mg',
    activeIngredient: 'Phenylephrine',
    dosage: '10mg',
    uses: 'Thông mũi, giảm nghẹt mũi',
    symptoms: ['nghẹt mũi', 'sổ mũi', 'cảm lạnh'],
    price: 16000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tăng huyết áp', 'Tim đập nhanh'],
    instructions: 'Uống 1 viên mỗi 4 giờ'
  },
  {
    id: '28',
    name: 'Xylometazoline',
    ingredient: 'Xylometazoline 0.1%',
    activeIngredient: 'Xylometazoline',
    dosage: '0.1%',
    uses: 'Thuốc xịt mũi thông mũi',
    symptoms: ['nghẹt mũi', 'sổ mũi'],
    price: 25000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Kích ứng mũi', 'Phụ thuộc thuốc'],
    instructions: 'Xịt 1-2 lần mỗi bên mũi 3 lần/ngày'
  },
  {
    id: '29',
    name: 'Salbutamol',
    ingredient: 'Salbutamol 100mcg',
    activeIngredient: 'Salbutamol',
    dosage: '100mcg',
    uses: 'Thuốc xịt giãn phế quản',
    symptoms: ['hen suyễn', 'khó thở', 'ho'],
    price: 45000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Tim đập nhanh', 'Run tay'],
    instructions: 'Xịt 1-2 lần khi khó thở, cần đơn thuốc'
  },
  {
    id: '30',
    name: 'Budesonide',
    ingredient: 'Budesonide 200mcg',
    activeIngredient: 'Budesonide',
    dosage: '200mcg',
    uses: 'Thuốc xịt chống viêm phế quản',
    symptoms: ['hen suyễn', 'viêm phế quản'],
    price: 68000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Khàn giọng', 'Nhiễm nấm miệng'],
    instructions: 'Xịt 1-2 lần 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '31',
    name: 'Beclomethasone',
    ingredient: 'Beclomethasone 50mcg',
    activeIngredient: 'Beclomethasone',
    dosage: '50mcg',
    uses: 'Thuốc xịt mũi chống viêm',
    symptoms: ['viêm mũi dị ứng', 'nghẹt mũi'],
    price: 55000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Khô mũi', 'Chảy máu mũi'],
    instructions: 'Xịt 1-2 lần mỗi bên mũi 2 lần/ngày'
  },
  {
    id: '32',
    name: 'Mometasone',
    ingredient: 'Mometasone 50mcg',
    activeIngredient: 'Mometasone',
    dosage: '50mcg',
    uses: 'Thuốc xịt mũi chống viêm mạnh',
    symptoms: ['viêm mũi dị ứng', 'polyp mũi'],
    price: 75000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Khô mũi', 'Đau đầu'],
    instructions: 'Xịt 1-2 lần mỗi bên mũi 1 lần/ngày'
  },
  {
    id: '33',
    name: 'Fluticasone',
    ingredient: 'Fluticasone 50mcg',
    activeIngredient: 'Fluticasone',
    dosage: '50mcg',
    uses: 'Thuốc xịt mũi chống viêm',
    symptoms: ['viêm mũi dị ứng', 'nghẹt mũi'],
    price: 62000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Khô mũi', 'Chảy máu mũi'],
    instructions: 'Xịt 1-2 lần mỗi bên mũi 2 lần/ngày'
  },
  {
    id: '34',
    name: 'Ipratropium',
    ingredient: 'Ipratropium 20mcg',
    activeIngredient: 'Ipratropium',
    dosage: '20mcg',
    uses: 'Thuốc xịt giãn phế quản',
    symptoms: ['hen suyễn', 'viêm phế quản', 'khó thở'],
    price: 52000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Khô miệng', 'Ho'],
    instructions: 'Xịt 1-2 lần 3-4 lần/ngày'
  },
  {
    id: '35',
    name: 'Tiotropium',
    ingredient: 'Tiotropium 18mcg',
    activeIngredient: 'Tiotropium',
    dosage: '18mcg',
    uses: 'Thuốc xịt giãn phế quản tác dụng kéo dài',
    symptoms: ['COPD', 'hen suyễn', 'khó thở'],
    price: 85000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Khô miệng', 'Táo bón'],
    instructions: 'Xịt 1 lần mỗi ngày, cần đơn thuốc'
  },
  {
    id: '36',
    name: 'Formoterol',
    ingredient: 'Formoterol 12mcg',
    activeIngredient: 'Formoterol',
    dosage: '12mcg',
    uses: 'Thuốc xịt giãn phế quản tác dụng kéo dài',
    symptoms: ['hen suyễn', 'COPD', 'khó thở'],
    price: 92000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tim đập nhanh', 'Run tay'],
    instructions: 'Xịt 1 lần 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '37',
    name: 'Salmeterol',
    ingredient: 'Salmeterol 50mcg',
    activeIngredient: 'Salmeterol',
    dosage: '50mcg',
    uses: 'Thuốc xịt giãn phế quản tác dụng kéo dài',
    symptoms: ['hen suyễn', 'COPD', 'khó thở'],
    price: 88000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Tim đập nhanh', 'Đau đầu'],
    instructions: 'Xịt 1 lần 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '38',
    name: 'Montelukast',
    ingredient: 'Montelukast 10mg',
    activeIngredient: 'Montelukast',
    dosage: '10mg',
    uses: 'Điều trị hen suyễn, viêm mũi dị ứng',
    symptoms: ['hen suyễn', 'viêm mũi dị ứng', 'dị ứng'],
    price: 72000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau đầu', 'Buồn nôn', 'Thay đổi tâm trạng'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối'
  },
  {
    id: '39',
    name: 'Zafirlukast',
    ingredient: 'Zafirlukast 20mg',
    activeIngredient: 'Zafirlukast',
    dosage: '20mg',
    uses: 'Điều trị hen suyễn',
    symptoms: ['hen suyễn', 'khó thở'],
    price: 78000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau đầu', 'Buồn nôn', 'Đau bụng'],
    instructions: 'Uống 1 viên 2 lần/ngày trước bữa ăn'
  },
  {
    id: '40',
    name: 'Theophylline',
    ingredient: 'Theophylline 200mg',
    activeIngredient: 'Theophylline',
    dosage: '200mg',
    uses: 'Điều trị hen suyễn, COPD',
    symptoms: ['hen suyễn', 'COPD', 'khó thở'],
    price: 35000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Tim đập nhanh', 'Mất ngủ'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '41',
    name: 'Losartan',
    ingredient: 'Losartan 50mg',
    activeIngredient: 'Losartan',
    dosage: '50mg',
    uses: 'Điều trị tăng huyết áp',
    symptoms: ['tăng huyết áp', 'cao huyết áp'],
    price: 55000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Chóng mặt', 'Đau đầu', 'Mệt mỏi'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '42',
    name: 'Valsartan',
    ingredient: 'Valsartan 80mg',
    activeIngredient: 'Valsartan',
    dosage: '80mg',
    uses: 'Điều trị tăng huyết áp, suy tim',
    symptoms: ['tăng huyết áp', 'suy tim'],
    price: 68000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Chóng mặt', 'Đau đầu', 'Ho'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '43',
    name: 'Enalapril',
    ingredient: 'Enalapril 10mg',
    activeIngredient: 'Enalapril',
    dosage: '10mg',
    uses: 'Điều trị tăng huyết áp, suy tim',
    symptoms: ['tăng huyết áp', 'suy tim'],
    price: 42000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Ho khan', 'Chóng mặt', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '44',
    name: 'Lisinopril',
    ingredient: 'Lisinopril 10mg',
    activeIngredient: 'Lisinopril',
    dosage: '10mg',
    uses: 'Điều trị tăng huyết áp',
    symptoms: ['tăng huyết áp', 'cao huyết áp'],
    price: 38000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Ho khan', 'Chóng mặt', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '45',
    name: 'Carvedilol',
    ingredient: 'Carvedilol 25mg',
    activeIngredient: 'Carvedilol',
    dosage: '25mg',
    uses: 'Điều trị tăng huyết áp, suy tim',
    symptoms: ['tăng huyết áp', 'suy tim'],
    price: 72000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Mệt mỏi', 'Chóng mặt', 'Buồn nôn'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '46',
    name: 'Metoprolol',
    ingredient: 'Metoprolol 50mg',
    activeIngredient: 'Metoprolol',
    dosage: '50mg',
    uses: 'Điều trị tăng huyết áp, đau thắt ngực',
    symptoms: ['tăng huyết áp', 'đau thắt ngực'],
    price: 45000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Mệt mỏi', 'Chóng mặt', 'Buồn nôn'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '47',
    name: 'Atenolol',
    ingredient: 'Atenolol 50mg',
    activeIngredient: 'Atenolol',
    dosage: '50mg',
    uses: 'Điều trị tăng huyết áp, đau thắt ngực',
    symptoms: ['tăng huyết áp', 'đau thắt ngực'],
    price: 35000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Mệt mỏi', 'Chóng mặt', 'Lạnh tay chân'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '48',
    name: 'Propranolol',
    ingredient: 'Propranolol 40mg',
    activeIngredient: 'Propranolol',
    dosage: '40mg',
    uses: 'Điều trị tăng huyết áp, run tay',
    symptoms: ['tăng huyết áp', 'run tay', 'lo âu'],
    price: 28000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Mệt mỏi', 'Chóng mặt', 'Lạnh tay chân'],
    instructions: 'Uống 1 viên 2-3 lần/ngày, cần đơn thuốc'
  },
  {
    id: '49',
    name: 'Nifedipine',
    ingredient: 'Nifedipine 10mg',
    activeIngredient: 'Nifedipine',
    dosage: '10mg',
    uses: 'Điều trị tăng huyết áp, đau thắt ngực',
    symptoms: ['tăng huyết áp', 'đau thắt ngực'],
    price: 32000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau đầu', 'Chóng mặt', 'Phù chân'],
    instructions: 'Uống 1 viên 3 lần/ngày, cần đơn thuốc'
  },
  {
    id: '50',
    name: 'Diltiazem',
    ingredient: 'Diltiazem 60mg',
    activeIngredient: 'Diltiazem',
    dosage: '60mg',
    uses: 'Điều trị tăng huyết áp, đau thắt ngực',
    symptoms: ['tăng huyết áp', 'đau thắt ngực'],
    price: 48000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau đầu', 'Chóng mặt', 'Phù chân'],
    instructions: 'Uống 1 viên 3-4 lần/ngày, cần đơn thuốc'
  },
  {
    id: '51',
    name: 'Verapamil',
    ingredient: 'Verapamil 80mg',
    activeIngredient: 'Verapamil',
    dosage: '80mg',
    uses: 'Điều trị tăng huyết áp, đau thắt ngực',
    symptoms: ['tăng huyết áp', 'đau thắt ngực'],
    price: 52000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau đầu', 'Chóng mặt', 'Táo bón'],
    instructions: 'Uống 1 viên 3 lần/ngày, cần đơn thuốc'
  },
  {
    id: '52',
    name: 'Furosemide',
    ingredient: 'Furosemide 40mg',
    activeIngredient: 'Furosemide',
    dosage: '40mg',
    uses: 'Thuốc lợi tiểu, điều trị phù',
    symptoms: ['phù', 'tăng huyết áp', 'suy tim'],
    price: 18000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Tiểu nhiều', 'Chuột rút', 'Chóng mặt'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi sáng'
  },
  {
    id: '53',
    name: 'Hydrochlorothiazide',
    ingredient: 'Hydrochlorothiazide 25mg',
    activeIngredient: 'Hydrochlorothiazide',
    dosage: '25mg',
    uses: 'Thuốc lợi tiểu, điều trị tăng huyết áp',
    symptoms: ['tăng huyết áp', 'phù'],
    price: 15000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Tiểu nhiều', 'Chuột rút', 'Chóng mặt'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi sáng'
  },
  {
    id: '54',
    name: 'Spironolactone',
    ingredient: 'Spironolactone 25mg',
    activeIngredient: 'Spironolactone',
    dosage: '25mg',
    uses: 'Thuốc lợi tiểu, điều trị phù',
    symptoms: ['phù', 'suy tim'],
    price: 22000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tiểu nhiều', 'Rối loạn kinh nguyệt'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi sáng'
  },
  {
    id: '55',
    name: 'Digoxin',
    ingredient: 'Digoxin 0.25mg',
    activeIngredient: 'Digoxin',
    dosage: '0.25mg',
    uses: 'Điều trị suy tim, rối loạn nhịp tim',
    symptoms: ['suy tim', 'rối loạn nhịp tim'],
    price: 85000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Chán ăn', 'Rối loạn nhịp tim'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '56',
    name: 'Warfarin',
    ingredient: 'Warfarin 5mg',
    activeIngredient: 'Warfarin',
    dosage: '5mg',
    uses: 'Thuốc chống đông máu',
    symptoms: ['dự phòng đột quỵ', 'huyết khối'],
    price: 12000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Chảy máu', 'Bầm tím'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '57',
    name: 'Clopidogrel',
    ingredient: 'Clopidogrel 75mg',
    activeIngredient: 'Clopidogrel',
    dosage: '75mg',
    uses: 'Thuốc chống kết tập tiểu cầu',
    symptoms: ['dự phòng đột quỵ', 'nhồi máu cơ tim'],
    price: 45000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Chảy máu', 'Đau dạ dày'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '58',
    name: 'Atorvastatin',
    ingredient: 'Atorvastatin 20mg',
    activeIngredient: 'Atorvastatin',
    dosage: '20mg',
    uses: 'Hạ cholesterol máu',
    symptoms: ['tăng cholesterol', 'mỡ máu cao'],
    price: 68000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau cơ', 'Buồn nôn', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối, cần đơn thuốc'
  },
  {
    id: '59',
    name: 'Rosuvastatin',
    ingredient: 'Rosuvastatin 10mg',
    activeIngredient: 'Rosuvastatin',
    dosage: '10mg',
    uses: 'Hạ cholesterol máu',
    symptoms: ['tăng cholesterol', 'mỡ máu cao'],
    price: 75000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau cơ', 'Buồn nôn', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối, cần đơn thuốc'
  },
  {
    id: '60',
    name: 'Pravastatin',
    ingredient: 'Pravastatin 20mg',
    activeIngredient: 'Pravastatin',
    dosage: '20mg',
    uses: 'Hạ cholesterol máu',
    symptoms: ['tăng cholesterol', 'mỡ máu cao'],
    price: 58000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau cơ', 'Buồn nôn', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi tối, cần đơn thuốc'
  },
  {
    id: '61',
    name: 'Glimepiride',
    ingredient: 'Glimepiride 1mg',
    activeIngredient: 'Glimepiride',
    dosage: '1mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 38000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Hạ đường huyết', 'Tăng cân'],
    instructions: 'Uống 1 viên mỗi ngày trước bữa sáng, cần đơn thuốc'
  },
  {
    id: '62',
    name: 'Gliclazide',
    ingredient: 'Gliclazide 80mg',
    activeIngredient: 'Gliclazide',
    dosage: '80mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 42000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Hạ đường huyết', 'Tăng cân'],
    instructions: 'Uống 1 viên 2 lần/ngày trước bữa ăn, cần đơn thuốc'
  },
  {
    id: '63',
    name: 'Pioglitazone',
    ingredient: 'Pioglitazone 15mg',
    activeIngredient: 'Pioglitazone',
    dosage: '15mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 65000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tăng cân', 'Phù chân'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '64',
    name: 'Sitagliptin',
    ingredient: 'Sitagliptin 100mg',
    activeIngredient: 'Sitagliptin',
    dosage: '100mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 85000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau đầu', 'Buồn nôn'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '65',
    name: 'Vildagliptin',
    ingredient: 'Vildagliptin 50mg',
    activeIngredient: 'Vildagliptin',
    dosage: '50mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 78000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau đầu', 'Buồn nôn'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '66',
    name: 'Dapagliflozin',
    ingredient: 'Dapagliflozin 10mg',
    activeIngredient: 'Dapagliflozin',
    dosage: '10mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 92000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tiểu nhiều', 'Nhiễm trùng đường tiết niệu'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '67',
    name: 'Empagliflozin',
    ingredient: 'Empagliflozin 10mg',
    activeIngredient: 'Empagliflozin',
    dosage: '10mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 95000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Tiểu nhiều', 'Nhiễm trùng đường tiết niệu'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '68',
    name: 'Acarbose',
    ingredient: 'Acarbose 50mg',
    activeIngredient: 'Acarbose',
    dosage: '50mg',
    uses: 'Điều trị đái tháo đường type 2',
    symptoms: ['tiểu đường', 'đái tháo đường', 'tăng đường huyết'],
    price: 48000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đầy hơi', 'Tiêu chảy'],
    instructions: 'Uống 1 viên 3 lần/ngày trước bữa ăn, cần đơn thuốc'
  },
  {
    id: '69',
    name: 'Levothyroxine',
    ingredient: 'Levothyroxine 50mcg',
    activeIngredient: 'Levothyroxine',
    dosage: '50mcg',
    uses: 'Điều trị suy giáp',
    symptoms: ['suy giáp', 'mệt mỏi', 'tăng cân'],
    price: 35000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tim đập nhanh', 'Mất ngủ'],
    instructions: 'Uống 1 viên mỗi ngày vào buổi sáng, cần đơn thuốc'
  },
  {
    id: '70',
    name: 'Methimazole',
    ingredient: 'Methimazole 10mg',
    activeIngredient: 'Methimazole',
    dosage: '10mg',
    uses: 'Điều trị cường giáp',
    symptoms: ['cường giáp', 'tim đập nhanh', 'sụt cân'],
    price: 28000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Phát ban', 'Đau khớp'],
    instructions: 'Uống 1 viên 3 lần/ngày, cần đơn thuốc'
  },
  {
    id: '71',
    name: 'Propylthiouracil',
    ingredient: 'Propylthiouracil 50mg',
    activeIngredient: 'Propylthiouracil',
    dosage: '50mg',
    uses: 'Điều trị cường giáp',
    symptoms: ['cường giáp', 'tim đập nhanh', 'sụt cân'],
    price: 32000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Phát ban', 'Đau khớp'],
    instructions: 'Uống 1 viên 3 lần/ngày, cần đơn thuốc'
  },
  {
    id: '72',
    name: 'Prednisolone',
    ingredient: 'Prednisolone 5mg',
    activeIngredient: 'Prednisolone',
    dosage: '5mg',
    uses: 'Thuốc chống viêm, ức chế miễn dịch',
    symptoms: ['viêm khớp', 'dị ứng', 'hen suyễn'],
    price: 18000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tăng cân', 'Tăng huyết áp', 'Loãng xương'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '73',
    name: 'Dexamethasone',
    ingredient: 'Dexamethasone 0.5mg',
    activeIngredient: 'Dexamethasone',
    dosage: '0.5mg',
    uses: 'Thuốc chống viêm, ức chế miễn dịch',
    symptoms: ['viêm khớp', 'dị ứng', 'hen suyễn'],
    price: 15000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Tăng cân', 'Tăng huyết áp', 'Loãng xương'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '74',
    name: 'Hydrocortisone',
    ingredient: 'Hydrocortisone 20mg',
    activeIngredient: 'Hydrocortisone',
    dosage: '20mg',
    uses: 'Thuốc chống viêm, ức chế miễn dịch',
    symptoms: ['viêm khớp', 'dị ứng', 'suy thượng thận'],
    price: 22000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Tăng cân', 'Tăng huyết áp', 'Loãng xương'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '75',
    name: 'Methylprednisolone',
    ingredient: 'Methylprednisolone 4mg',
    activeIngredient: 'Methylprednisolone',
    dosage: '4mg',
    uses: 'Thuốc chống viêm, ức chế miễn dịch',
    symptoms: ['viêm khớp', 'dị ứng', 'hen suyễn'],
    price: 25000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tăng cân', 'Tăng huyết áp', 'Loãng xương'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '76',
    name: 'Azathioprine',
    ingredient: 'Azathioprine 50mg',
    activeIngredient: 'Azathioprine',
    dosage: '50mg',
    uses: 'Thuốc ức chế miễn dịch',
    symptoms: ['viêm khớp dạng thấp', 'bệnh tự miễn'],
    price: 85000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Giảm bạch cầu'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '77',
    name: 'Cyclosporine',
    ingredient: 'Cyclosporine 25mg',
    activeIngredient: 'Cyclosporine',
    dosage: '25mg',
    uses: 'Thuốc ức chế miễn dịch',
    symptoms: ['ghép tạng', 'bệnh tự miễn'],
    price: 120000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Tăng huyết áp', 'Tổn thương thận'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '78',
    name: 'Tacrolimus',
    ingredient: 'Tacrolimus 1mg',
    activeIngredient: 'Tacrolimus',
    dosage: '1mg',
    uses: 'Thuốc ức chế miễn dịch',
    symptoms: ['ghép tạng', 'bệnh tự miễn'],
    price: 150000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Tăng huyết áp', 'Tổn thương thận'],
    instructions: 'Uống theo chỉ định bác sĩ, cần đơn thuốc'
  },
  {
    id: '79',
    name: 'Mycophenolate',
    ingredient: 'Mycophenolate 500mg',
    activeIngredient: 'Mycophenolate',
    dosage: '500mg',
    uses: 'Thuốc ức chế miễn dịch',
    symptoms: ['ghép tạng', 'bệnh tự miễn'],
    price: 95000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Tiêu chảy'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '80',
    name: 'Leflunomide',
    ingredient: 'Leflunomide 20mg',
    activeIngredient: 'Leflunomide',
    dosage: '20mg',
    uses: 'Điều trị viêm khớp dạng thấp',
    symptoms: ['viêm khớp dạng thấp', 'đau khớp'],
    price: 88000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Tăng huyết áp'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '81',
    name: 'Sulfasalazine',
    ingredient: 'Sulfasalazine 500mg',
    activeIngredient: 'Sulfasalazine',
    dosage: '500mg',
    uses: 'Điều trị viêm khớp dạng thấp, viêm loét đại tràng',
    symptoms: ['viêm khớp dạng thấp', 'viêm loét đại tràng'],
    price: 45000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn nôn', 'Đau đầu', 'Phát ban'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '82',
    name: 'Hydroxychloroquine',
    ingredient: 'Hydroxychloroquine 200mg',
    activeIngredient: 'Hydroxychloroquine',
    dosage: '200mg',
    uses: 'Điều trị lupus, viêm khớp dạng thấp',
    symptoms: ['lupus', 'viêm khớp dạng thấp'],
    price: 35000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Đau đầu', 'Tổn thương mắt'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '83',
    name: 'Methotrexate',
    ingredient: 'Methotrexate 2.5mg',
    activeIngredient: 'Methotrexate',
    dosage: '2.5mg',
    uses: 'Điều trị viêm khớp dạng thấp, ung thư',
    symptoms: ['viêm khớp dạng thấp', 'ung thư'],
    price: 28000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn nôn', 'Giảm bạch cầu', 'Tổn thương gan'],
    instructions: 'Uống 1 viên mỗi tuần, cần đơn thuốc'
  },
  {
    id: '84',
    name: 'Allopurinol',
    ingredient: 'Allopurinol 100mg',
    activeIngredient: 'Allopurinol',
    dosage: '100mg',
    uses: 'Điều trị bệnh gút',
    symptoms: ['bệnh gút', 'tăng acid uric'],
    price: 22000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn nôn', 'Phát ban', 'Tổn thương gan'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '85',
    name: 'Colchicine',
    ingredient: 'Colchicine 0.5mg',
    activeIngredient: 'Colchicine',
    dosage: '0.5mg',
    uses: 'Điều trị cơn gút cấp',
    symptoms: ['cơn gút cấp', 'đau khớp'],
    price: 18000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Đau bụng'],
    instructions: 'Uống 1 viên 2 lần/ngày khi có cơn gút, cần đơn thuốc'
  },
  {
    id: '86',
    name: 'Probenecid',
    ingredient: 'Probenecid 500mg',
    activeIngredient: 'Probenecid',
    dosage: '500mg',
    uses: 'Điều trị bệnh gút',
    symptoms: ['bệnh gút', 'tăng acid uric'],
    price: 25000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn nôn', 'Đau đầu', 'Phát ban'],
    instructions: 'Uống 1 viên 2 lần/ngày, cần đơn thuốc'
  },
  {
    id: '87',
    name: 'Febuxostat',
    ingredient: 'Febuxostat 40mg',
    activeIngredient: 'Febuxostat',
    dosage: '40mg',
    uses: 'Điều trị bệnh gút',
    symptoms: ['bệnh gút', 'tăng acid uric'],
    price: 85000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn nôn', 'Đau đầu', 'Tổn thương gan'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '88',
    name: 'Alendronate',
    ingredient: 'Alendronate 70mg',
    activeIngredient: 'Alendronate',
    dosage: '70mg',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 65000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Đau dạ dày', 'Ợ chua', 'Đau xương'],
    instructions: 'Uống 1 viên mỗi tuần vào buổi sáng, cần đơn thuốc'
  },
  {
    id: '89',
    name: 'Risedronate',
    ingredient: 'Risedronate 35mg',
    activeIngredient: 'Risedronate',
    dosage: '35mg',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 72000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Đau dạ dày', 'Ợ chua', 'Đau xương'],
    instructions: 'Uống 1 viên mỗi tuần vào buổi sáng, cần đơn thuốc'
  },
  {
    id: '90',
    name: 'Ibandronate',
    ingredient: 'Ibandronate 150mg',
    activeIngredient: 'Ibandronate',
    dosage: '150mg',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 78000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau dạ dày', 'Ợ chua', 'Đau xương'],
    instructions: 'Uống 1 viên mỗi tháng vào buổi sáng, cần đơn thuốc'
  },
  {
    id: '91',
    name: 'Zoledronic Acid',
    ingredient: 'Zoledronic Acid 5mg',
    activeIngredient: 'Zoledronic Acid',
    dosage: '5mg',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 120000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Sốt', 'Đau cơ', 'Đau xương'],
    instructions: 'Truyền tĩnh mạch 1 lần mỗi năm, cần đơn thuốc'
  },
  {
    id: '92',
    name: 'Teriparatide',
    ingredient: 'Teriparatide 20mcg',
    activeIngredient: 'Teriparatide',
    dosage: '20mcg',
    uses: 'Điều trị loãng xương nặng',
    symptoms: ['loãng xương nặng', 'gãy xương nhiều'],
    price: 250000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn nôn', 'Chóng mặt', 'Đau xương'],
    instructions: 'Tiêm dưới da 1 lần mỗi ngày, cần đơn thuốc'
  },
  {
    id: '93',
    name: 'Denosumab',
    ingredient: 'Denosumab 60mg',
    activeIngredient: 'Denosumab',
    dosage: '60mg',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 180000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Đau xương', 'Đau cơ', 'Nhiễm trùng'],
    instructions: 'Tiêm dưới da 1 lần mỗi 6 tháng, cần đơn thuốc'
  },
  {
    id: '94',
    name: 'Raloxifene',
    ingredient: 'Raloxifene 60mg',
    activeIngredient: 'Raloxifene',
    dosage: '60mg',
    uses: 'Điều trị loãng xương sau mãn kinh',
    symptoms: ['loãng xương', 'mãn kinh'],
    price: 95000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Bốc hỏa', 'Chuột rút chân', 'Huyết khối'],
    instructions: 'Uống 1 viên mỗi ngày, cần đơn thuốc'
  },
  {
    id: '95',
    name: 'Calcitonin',
    ingredient: 'Calcitonin 200IU',
    activeIngredient: 'Calcitonin',
    dosage: '200IU',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 85000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Buồn nôn', 'Chóng mặt', 'Phản ứng tại chỗ tiêm'],
    instructions: 'Tiêm dưới da 1 lần mỗi ngày, cần đơn thuốc'
  },
  {
    id: '96',
    name: 'Strontium Ranelate',
    ingredient: 'Strontium Ranelate 2g',
    activeIngredient: 'Strontium Ranelate',
    dosage: '2g',
    uses: 'Điều trị loãng xương',
    symptoms: ['loãng xương', 'gãy xương'],
    price: 68000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Buồn nôn', 'Tiêu chảy', 'Đau đầu'],
    instructions: 'Uống 1 gói mỗi ngày vào buổi tối, cần đơn thuốc'
  },
  {
    id: '97',
    name: 'Vitamin D3',
    ingredient: 'Vitamin D3 1000IU',
    activeIngredient: 'Cholecalciferol',
    dosage: '1000IU',
    uses: 'Bổ sung vitamin D, hỗ trợ hấp thu canxi',
    symptoms: ['thiếu vitamin D', 'loãng xương', 'yếu xương'],
    price: 25000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Tăng canxi máu nếu dùng quá liều'],
    instructions: 'Uống 1 viên mỗi ngày sau bữa ăn'
  },
  {
    id: '98',
    name: 'Vitamin K2',
    ingredient: 'Vitamin K2 100mcg',
    activeIngredient: 'Menaquinone',
    dosage: '100mcg',
    uses: 'Hỗ trợ sức khỏe xương, tim mạch',
    symptoms: ['thiếu vitamin K', 'loãng xương'],
    price: 45000,
    manufacturer: 'Dược phẩm TP.HCM',
    sideEffects: ['Hiếm gặp tác dụng phụ'],
    instructions: 'Uống 1 viên mỗi ngày sau bữa ăn'
  },
  {
    id: '99',
    name: 'Omega-3',
    ingredient: 'Omega-3 1000mg',
    activeIngredient: 'EPA + DHA',
    dosage: '1000mg',
    uses: 'Bổ sung acid béo thiết yếu, hỗ trợ tim mạch',
    symptoms: ['thiếu omega-3', 'bệnh tim mạch'],
    price: 35000,
    manufacturer: 'Dược phẩm Việt Nam',
    sideEffects: ['Ợ hơi', 'Tiêu chảy nhẹ'],
    instructions: 'Uống 1 viên 2 lần/ngày sau bữa ăn'
  },
  {
    id: '100',
    name: 'Coenzyme Q10',
    ingredient: 'Coenzyme Q10 100mg',
    activeIngredient: 'Ubiquinone',
    dosage: '100mg',
    uses: 'Chống oxy hóa, hỗ trợ tim mạch',
    symptoms: ['mệt mỏi', 'bệnh tim mạch'],
    price: 55000,
    manufacturer: 'Dược phẩm Hà Nội',
    sideEffects: ['Buồn nôn nhẹ', 'Đau đầu'],
    instructions: 'Uống 1 viên mỗi ngày sau bữa ăn'
  }
]

// Hàm tìm kiếm sản phẩm theo từ khóa
function searchProducts(query: string) {
  const lowerQuery = query.toLowerCase()
  console.log('Searching for:', lowerQuery)
  
  // Tách câu hỏi thành các từ riêng biệt
  const words = lowerQuery.split(/\s+/).filter(word => word.length > 2)
  console.log('Search words:', words)
  
  const results = productsDB.filter(product => {
    // Kiểm tra từng từ trong câu hỏi
    const hasMatch = words.some(word => {
      const nameMatch = product.name.toLowerCase().includes(word)
      const ingredientMatch = product.activeIngredient.toLowerCase().includes(word)
      const symptomMatch = product.symptoms.some(symptom => symptom.toLowerCase().includes(word))
      const useMatch = product.uses.toLowerCase().includes(word)
      
      return nameMatch || ingredientMatch || symptomMatch || useMatch
    })
    
    console.log(`Product: ${product.name}, has match:`, hasMatch)
    return hasMatch
  })
  
  console.log('Found products:', results.map(p => p.name))
  return results
}

// Hàm xử lý câu hỏi và trả về câu trả lời
function processQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  // Kiểm tra câu hỏi về chẩn đoán bệnh hoặc thông tin ngoài sản phẩm
  const medicalKeywords = [
    'chẩn đoán', 'bệnh', 'khám', 'xét nghiệm', 'điều trị', 'phẫu thuật',
    'ung thư', 'tiểu đường', 'huyết áp', 'tim mạch', 'thần kinh', 'tâm thần',
    'có sao không', 'có nguy hiểm không', 'có nghiêm trọng không',
    'bác sĩ', 'bệnh viện', 'phòng khám', 'tư vấn sức khỏe',
    'tôi bị', 'tôi có', 'tôi mắc', 'tôi đang', 'tôi cảm thấy',
    'có phải', 'có phải tôi', 'tôi có bị', 'tôi có mắc'
  ]
  
  const hasMedicalQuestion = medicalKeywords.some(keyword => 
    lowerQuestion.includes(keyword)
  )
  
  if (hasMedicalQuestion) {
    return `⚠️ **Lưu ý quan trọng:**\n\n` +
           `Tôi là trợ lý AI chỉ có thể cung cấp thông tin về sản phẩm thuốc. Tôi không thể chẩn đoán bệnh hoặc đưa ra lời khuyên y tế.\n\n` +
           `**Để được tư vấn chuyên môn, vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx (24/7)\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]\n` +
           `⏰ **Giờ làm việc:** 7:00 - 22:00 (Thứ 2 - Chủ nhật)\n\n` +
           `**Hoặc đến trực tiếp nhà thuốc để được dược sĩ tư vấn chi tiết.**`
  }
  
  // Kiểm tra câu hỏi về sản phẩm khác tương tự
  const similarKeywords = ['khác', 'nữa', 'thêm', 'còn', 'tương tự', 'giống', 'khác loại']
  const isAskingForSimilar = similarKeywords.some(keyword => lowerQuestion.includes(keyword))
  
  // Tìm kiếm sản phẩm
  let products = searchProducts(question)
  
  // Nếu hỏi về sản phẩm khác và không tìm thấy sản phẩm cụ thể, sử dụng ngữ cảnh trước đó
  if (isAskingForSimilar && products.length === 0) {
    // Sử dụng ngữ cảnh cuộc hội thoại trước đó
    if (conversationContext.lastTopic && conversationContext.lastProducts.length > 0) {
      products = conversationContext.lastProducts
    } else {
      // Tìm kiếm các sản phẩm có công dụng tương tự
      const commonUses = [
        'loãng xương', 'xương', 'canxi', 'vitamin d',
        'đau đầu', 'đau', 'giảm đau', 'hạ sốt',
        'dị ứng', 'mề đay', 'ngứa',
        'tiểu đường', 'đái tháo đường', 'đường huyết',
        'huyết áp', 'tăng huyết áp', 'cao huyết áp',
        'viêm khớp', 'khớp', 'đau khớp',
        'dạ dày', 'đau dạ dày', 'viêm loét',
        'tim mạch', 'tim', 'mạch',
        'vitamin', 'bổ sung', 'tăng cường'
      ]
      
      const matchedUse = commonUses.find(use => lowerQuestion.includes(use))
      if (matchedUse) {
        products = productsDB.filter(product => 
          product.uses.toLowerCase().includes(matchedUse) ||
          product.symptoms.some(symptom => symptom.toLowerCase().includes(matchedUse)) ||
          product.activeIngredient.toLowerCase().includes(matchedUse)
        )
      }
    }
  }
  
  // Nếu vẫn không tìm thấy và đang hỏi về sản phẩm khác, tìm kiếm rộng hơn
  if (isAskingForSimilar && products.length === 0) {
    // Tìm kiếm tất cả sản phẩm có thể liên quan dựa trên ngữ cảnh
    let allRelatedProducts: any[] = []
    
    // Nếu có ngữ cảnh trước đó, tìm sản phẩm tương tự
    if (conversationContext.lastTopic) {
      if (conversationContext.lastTopic.includes('loãng xương') || conversationContext.lastTopic.includes('xương')) {
        allRelatedProducts = productsDB.filter(product => 
          product.uses.toLowerCase().includes('loãng xương') ||
          product.uses.toLowerCase().includes('xương') ||
          product.uses.toLowerCase().includes('canxi') ||
          product.uses.toLowerCase().includes('vitamin d') ||
          product.activeIngredient.toLowerCase().includes('calcium') ||
          product.activeIngredient.toLowerCase().includes('vitamin d') ||
          product.activeIngredient.toLowerCase().includes('alendronate') ||
          product.activeIngredient.toLowerCase().includes('risedronate')
        )
      } else if (conversationContext.lastTopic.includes('đau') || conversationContext.lastTopic.includes('giảm đau')) {
        allRelatedProducts = productsDB.filter(product => 
          product.uses.toLowerCase().includes('đau') ||
          product.uses.toLowerCase().includes('giảm đau') ||
          product.uses.toLowerCase().includes('hạ sốt') ||
          product.activeIngredient.toLowerCase().includes('paracetamol') ||
          product.activeIngredient.toLowerCase().includes('ibuprofen') ||
          product.activeIngredient.toLowerCase().includes('aspirin')
        )
      } else if (conversationContext.lastTopic.includes('dị ứng')) {
        allRelatedProducts = productsDB.filter(product => 
          product.uses.toLowerCase().includes('dị ứng') ||
          product.uses.toLowerCase().includes('mề đay') ||
          product.uses.toLowerCase().includes('ngứa') ||
          product.activeIngredient.toLowerCase().includes('cetirizine') ||
          product.activeIngredient.toLowerCase().includes('loratadine')
        )
      } else if (conversationContext.lastTopic.includes('tiểu đường')) {
        allRelatedProducts = productsDB.filter(product => 
          product.uses.toLowerCase().includes('tiểu đường') ||
          product.uses.toLowerCase().includes('đái tháo đường') ||
          product.activeIngredient.toLowerCase().includes('metformin') ||
          product.activeIngredient.toLowerCase().includes('glimepiride')
        )
      } else if (conversationContext.lastTopic.includes('huyết áp')) {
        allRelatedProducts = productsDB.filter(product => 
          product.uses.toLowerCase().includes('huyết áp') ||
          product.uses.toLowerCase().includes('tăng huyết áp') ||
          product.activeIngredient.toLowerCase().includes('losartan') ||
          product.activeIngredient.toLowerCase().includes('amlodipine')
        )
      }
    }
    
    if (allRelatedProducts.length > 0) {
      products = allRelatedProducts
    }
  }
  
  if (products.length === 0) {
    return `Xin lỗi, tôi không tìm thấy thông tin về sản phẩm này trong cơ sở dữ liệu của chúng tôi.\n\n` +
           `**Để được tư vấn chi tiết, vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]\n\n` +
           `Dược sĩ sẽ giúp bạn tìm sản phẩm phù hợp với nhu cầu.`
  }
  
  // Nếu hỏi về sản phẩm khác và có nhiều sản phẩm tương tự
  if (isAskingForSimilar && products.length > 1) {
    const productList = products.slice(0, 5).map(product => 
      `• **${product.name}** - ${product.activeIngredient} ${product.dosage}\n` +
      `  💰 Giá: ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
      `  🎯 Công dụng: ${product.uses}\n` +
      `  📋 Triệu chứng: ${product.symptoms.join(', ')}`
    ).join('\n\n')
    
    return `🔍 **Các sản phẩm tương tự có sẵn:**\n\n${productList}\n\n` +
           `**Tổng cộng:** ${products.length} sản phẩm\n\n` +
           `Bạn có muốn biết thông tin chi tiết về sản phẩm nào cụ thể không?`
  }
  
  // Nếu hỏi về sản phẩm khác và chỉ có 1 sản phẩm
  if (isAskingForSimilar && products.length === 1) {
    const product = products[0]
    return `🔍 **Sản phẩm tương tự khác:**\n\n` +
           `💊 **${product.name}** - ${product.activeIngredient} ${product.dosage}\n` +
           `💰 **Giá:** ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
           `🎯 **Công dụng:** ${product.uses}\n` +
           `📋 **Triệu chứng phù hợp:** ${product.symptoms.join(', ')}\n` +
           `⚠️ **Tác dụng phụ:** ${product.sideEffects.join(', ')}\n` +
           `📋 **Hướng dẫn:** ${product.instructions}\n\n` +
           `Bạn có muốn biết thêm thông tin gì về sản phẩm này không?`
  }
  
  // Nếu hỏi về sản phẩm khác nhưng không tìm thấy sản phẩm tương tự
  if (isAskingForSimilar && products.length === 0) {
    return `Xin lỗi, tôi không tìm thấy sản phẩm tương tự khác trong cơ sở dữ liệu của chúng tôi.\n\n` +
           `**Để được tư vấn chi tiết, vui lòng liên hệ:**\n` +
           `📞 **Hotline:** 1900-xxxx\n` +
           `🏥 **Nhà thuốc:** Hoàng Linh Medicine\n` +
           `📍 **Địa chỉ:** [Địa chỉ nhà thuốc]\n\n` +
           `Dược sĩ sẽ giúp bạn tìm sản phẩm phù hợp với nhu cầu.`
  }
  
  // Cập nhật ngữ cảnh cuộc hội thoại
  if (products.length > 0) {
    // Nếu tìm thấy sản phẩm cụ thể và không phải câu hỏi về sản phẩm khác, cập nhật ngữ cảnh mới
    if (!isAskingForSimilar) {
      conversationContext.lastProducts = products
      // Xác định chủ đề từ sản phẩm đầu tiên
      const firstProduct = products[0]
      if (firstProduct.uses.includes('loãng xương') || firstProduct.uses.includes('xương')) {
        conversationContext.lastTopic = 'loãng xương'
      } else if (firstProduct.uses.includes('đau') || firstProduct.uses.includes('giảm đau')) {
        conversationContext.lastTopic = 'giảm đau'
      } else if (firstProduct.uses.includes('dị ứng')) {
        conversationContext.lastTopic = 'dị ứng'
      } else if (firstProduct.uses.includes('tiểu đường')) {
        conversationContext.lastTopic = 'tiểu đường'
      } else if (firstProduct.uses.includes('huyết áp')) {
        conversationContext.lastTopic = 'huyết áp'
      } else {
        conversationContext.lastTopic = firstProduct.uses
      }
    }
    // Nếu là câu hỏi về sản phẩm khác, giữ nguyên ngữ cảnh hiện tại
  } else {
    // Reset ngữ cảnh nếu không tìm thấy sản phẩm và không phải câu hỏi về sản phẩm khác
    if (!isAskingForSimilar) {
      conversationContext.lastTopic = ''
      conversationContext.lastProducts = []
    }
  }
  
  const product = products[0]
  
  // Xử lý câu hỏi tổng quan (giống AI)
  if (lowerQuestion.includes('cho tôi biết') || 
      lowerQuestion.includes('thông tin') || 
      lowerQuestion.includes('tổng quan') ||
      lowerQuestion.includes('giới thiệu') ||
      lowerQuestion.includes('nói về') ||
      lowerQuestion.includes('là gì') ||
      lowerQuestion.includes('thế nào')) {
    
    return `Tôi sẽ giới thiệu cho bạn về ${product.name}:\n\n` +
           `💊 **Thông tin cơ bản:**\n` +
           `• Tên sản phẩm: ${product.name}\n` +
           `• Hoạt chất chính: ${product.activeIngredient} ${product.dosage}\n` +
           `• Nhà sản xuất: ${product.manufacturer}\n\n` +
           `🎯 **Công dụng chính:**\n` +
           `• ${product.uses}\n` +
           `• Phù hợp với các triệu chứng: ${product.symptoms.join(', ')}\n\n` +
           `💰 **Giá cả:** ${product.price.toLocaleString('vi-VN')} VNĐ\n\n` +
           `⚠️ **Lưu ý:**\n` +
           `• Tác dụng phụ có thể gặp: ${product.sideEffects.join(', ')}\n` +
           `• Hướng dẫn sử dụng: ${product.instructions}\n\n` +
           `Bạn có muốn tìm hiểu thêm về thông tin cụ thể nào không?`
  }
  
  // Xử lý các loại câu hỏi khác nhau
  if (lowerQuestion.includes('giá') || lowerQuestion.includes('bao nhiêu tiền')) {
    return `💰 ${product.name} có giá ${product.price.toLocaleString('vi-VN')} VNĐ.\n\n` +
           `Đây là mức giá tham khảo, có thể thay đổi tùy theo nhà thuốc và thời điểm mua.`
  }
  
  if (lowerQuestion.includes('hàm lượng') || lowerQuestion.includes('liều lượng')) {
    return `📊 ${product.name} có hàm lượng ${product.dosage} ${product.activeIngredient}.\n\n` +
           `Đây là hàm lượng chuẩn được khuyến nghị sử dụng cho người lớn.`
  }
  
  if (lowerQuestion.includes('hoạt chất') || lowerQuestion.includes('thành phần')) {
    return `🧪 ${product.name} có hoạt chất chính là **${product.activeIngredient}** với hàm lượng ${product.dosage}.\n\n` +
           `Hoạt chất này có tác dụng ${product.uses.toLowerCase()}.`
  }
  
  if (lowerQuestion.includes('dùng cho') || lowerQuestion.includes('triệu chứng') || lowerQuestion.includes('công dụng')) {
    return `🎯 ${product.name} được dùng để: **${product.uses}**\n\n` +
           `**Các triệu chứng phù hợp:**\n` +
           `• ${product.symptoms.join('\n• ')}\n\n` +
           `Nếu bạn gặp các triệu chứng trên, ${product.name} có thể giúp ích cho bạn.`
  }
  
  if (lowerQuestion.includes('tác dụng phụ') || lowerQuestion.includes('side effect')) {
    return `⚠️ ${product.name} có thể gây ra các tác dụng phụ:\n\n` +
           `• ${product.sideEffects.join('\n• ')}\n\n` +
           `**Lưu ý:** Tác dụng phụ thường nhẹ và sẽ hết khi ngừng thuốc. Nếu gặp tác dụng phụ nghiêm trọng, hãy ngừng sử dụng và tham khảo ý kiến bác sĩ.`
  }
  
  if (lowerQuestion.includes('cách dùng') || lowerQuestion.includes('hướng dẫn')) {
    return `📋 **Hướng dẫn sử dụng ${product.name}:**\n\n` +
           `• ${product.instructions}\n\n` +
           `**Lưu ý quan trọng:**\n` +
           `• Không dùng quá liều khuyến nghị\n` +
           `• Tham khảo ý kiến bác sĩ trước khi sử dụng\n` +
           `• Không dùng cho trẻ em dưới 12 tuổi mà không có chỉ định`
  }
  
  // Trả về thông tin tổng quan nếu không có câu hỏi cụ thể
  return `Tôi hiểu bạn đang tìm hiểu về ${product.name}. Đây là thông tin tổng quan:\n\n` +
         `💊 **${product.name}** - ${product.activeIngredient} ${product.dosage}\n` +
         `🎯 **Công dụng:** ${product.uses}\n` +
         `💰 **Giá:** ${product.price.toLocaleString('vi-VN')} VNĐ\n` +
         `📋 **Triệu chứng phù hợp:** ${product.symptoms.join(', ')}\n\n` +
         `Bạn có muốn biết thêm thông tin gì cụ thể không? Ví dụ: giá cả, cách dùng, tác dụng phụ...`
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    const response = processQuestion(message)
    
    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 