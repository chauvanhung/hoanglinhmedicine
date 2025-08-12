const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCtms4ro8NyEqMGlNyZFIi5uAiV0mfzIKE",
  authDomain: "hoanglinh-medicine.firebaseapp.com",
  projectId: "hoanglinh-medicine",
  storageBucket: "hoanglinh-medicine.firebasestorage.app",
  messagingSenderId: "150517241295",
  appId: "1:150517241295:web:56ef9aad6b82d00539eeba",
  measurementId: "G-5XXM4NMF1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dữ liệu mẫu cho categories
const categories = [
  {
    id: '1',
    name: 'Thuốc giảm đau',
    icon: '💊',
    description: 'Thuốc điều trị đau đầu, đau cơ, đau răng',
    count: 8
  },
  {
    id: '2',
    name: 'Thuốc kháng sinh',
    icon: '🦠',
    description: 'Thuốc điều trị nhiễm khuẩn',
    count: 6
  },
  {
    id: '3',
    name: 'Vitamin & Thực phẩm chức năng',
    icon: '🥗',
    description: 'Bổ sung vitamin và khoáng chất',
    count: 10
  },
  {
    id: '4',
    name: 'Thuốc tim mạch',
    icon: '❤️',
    description: 'Thuốc điều trị bệnh tim mạch',
    count: 4
  },
  {
    id: '5',
    name: 'Thuốc tiêu hóa',
    icon: '🫁',
    description: 'Thuốc điều trị bệnh đường tiêu hóa',
    count: 5
  }
];

// Dữ liệu mẫu cho products
const products = [
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
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Bổ sung vitamin C tăng cường miễn dịch',
    price: 45000,
    image: '/images/products/vitamin-c.jpg',
    category: 'Vitamin & Thực phẩm chức năng',
    stock: 75,
    prescription: false,
    manufacturer: 'Dược phẩm Traphaco',
    origin: 'Việt Nam',
    expiry: '24 tháng',
    dosage: '1 viên/ngày',
    ingredients: 'Vitamin C 1000mg',
    sideEffects: 'Tiêu chảy nhẹ (nếu dùng quá liều)',
    contraindications: 'Người mẫn cảm với Vitamin C',
    storage: 'Bảo quản nơi khô ráo, tránh ánh sáng',
    packaging: 'Hộp 30 viên',
    usage: 'Uống sau bữa ăn',
    target: 'Người lớn',
    benefits: [
      'Tăng cường hệ miễn dịch',
      'Chống oxy hóa',
      'Tốt cho da và tóc',
      'Hỗ trợ hấp thu sắt'
    ],
    reviews: [
      { user: 'Phạm Thị D', rating: 5, comment: 'Uống thường xuyên, ít bị cảm' },
      { user: 'Hoàng Văn E', rating: 4, comment: 'Sản phẩm chất lượng tốt' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedData() {
  console.log('🌱 Bắt đầu thêm dữ liệu mẫu...');

  try {
    // Thêm categories
    console.log('📂 Thêm categories...');
    for (const category of categories) {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`✅ Đã thêm category: ${category.name}`);
    }

    // Thêm products
    console.log('📦 Thêm products...');
    for (const product of products) {
      await setDoc(doc(db, 'products', product.id), product);
      console.log(`✅ Đã thêm product: ${product.name}`);
    }

    console.log('🎉 Hoàn thành thêm dữ liệu mẫu!');
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu:', error);
  }
}

// Chạy script
seedData(); 