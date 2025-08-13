const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'hoanglinh-medicine'
  });
}

const db = admin.firestore();

// Sample products data
const products = [
  {
    name: "Paracetamol 500mg",
    description: "Thuốc giảm đau, hạ sốt hiệu quả, an toàn cho người lớn và trẻ em",
    price: 25000,
    originalPrice: 30000,
    category: "Thuốc giảm đau",
    manufacturer: "Dược phẩm Hậu Giang",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"
    ],
    stock: 150,
    rating: 4.5,
    reviews: [
      {
        id: "1",
        userId: "user1",
        userName: "Nguyễn Văn A",
        rating: 5,
        comment: "Thuốc rất hiệu quả, giảm đau nhanh",
        date: new Date("2024-01-15")
      },
      {
        id: "2",
        userId: "user2",
        userName: "Trần Thị B",
        rating: 4,
        comment: "Chất lượng tốt, giá hợp lý",
        date: new Date("2024-01-10")
      }
    ],
    ingredients: "Paracetamol 500mg",
    usage: "Uống 1-2 viên mỗi 4-6 giờ khi cần thiết",
    sideEffects: "Có thể gây buồn nôn, đau dạ dày",
    contraindications: "Không dùng cho người dị ứng với paracetamol",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vitamin C 1000mg",
    description: "Bổ sung vitamin C tăng cường sức đề kháng, chống oxy hóa",
    price: 45000,
    originalPrice: 55000,
    category: "Vitamin & Thực phẩm chức năng",
    manufacturer: "Công ty TNHH Dược phẩm VN",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
    ],
    stock: 200,
    rating: 4.8,
    reviews: [
      {
        id: "3",
        userId: "user3",
        userName: "Lê Văn C",
        rating: 5,
        comment: "Tăng sức đề kháng rất tốt",
        date: new Date("2024-01-12")
      }
    ],
    ingredients: "Vitamin C 1000mg, tá dược vừa đủ",
    usage: "Uống 1 viên mỗi ngày sau bữa ăn",
    sideEffects: "Có thể gây tiêu chảy nếu dùng quá liều",
    contraindications: "Không dùng cho người bị sỏi thận",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Omega-3 1000mg",
    description: "Bổ sung axit béo omega-3 tốt cho tim mạch và não bộ",
    price: 120000,
    originalPrice: 150000,
    category: "Vitamin & Thực phẩm chức năng",
    manufacturer: "Công ty Dược phẩm Traphaco",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"
    ],
    stock: 80,
    rating: 4.6,
    reviews: [
      {
        id: "4",
        userId: "user4",
        userName: "Phạm Thị D",
        rating: 4,
        comment: "Sản phẩm chất lượng, giá hơi cao",
        date: new Date("2024-01-08")
      }
    ],
    ingredients: "Dầu cá tự nhiên, EPA 180mg, DHA 120mg",
    usage: "Uống 1-2 viên mỗi ngày trong bữa ăn",
    sideEffects: "Có thể gây ợ hơi, khó tiêu",
    contraindications: "Không dùng cho người dị ứng với cá",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ibuprofen 400mg",
    description: "Thuốc chống viêm, giảm đau hiệu quả cho các bệnh viêm khớp",
    price: 35000,
    originalPrice: 42000,
    category: "Thuốc chống viêm",
    manufacturer: "Dược phẩm Mekophar",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
    ],
    stock: 120,
    rating: 4.3,
    reviews: [
      {
        id: "5",
        userId: "user5",
        userName: "Hoàng Văn E",
        rating: 4,
        comment: "Giảm đau khớp rất hiệu quả",
        date: new Date("2024-01-05")
      }
    ],
    ingredients: "Ibuprofen 400mg, tá dược vừa đủ",
    usage: "Uống 1-2 viên mỗi 6-8 giờ khi cần thiết",
    sideEffects: "Có thể gây đau dạ dày, buồn nôn",
    contraindications: "Không dùng cho người loét dạ dày",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Calcium + Vitamin D3",
    description: "Bổ sung canxi và vitamin D3 giúp xương chắc khỏe",
    price: 85000,
    originalPrice: 100000,
    category: "Vitamin & Thực phẩm chức năng",
    manufacturer: "Công ty Dược phẩm OPC",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"
    ],
    stock: 100,
    rating: 4.7,
    reviews: [
      {
        id: "6",
        userId: "user6",
        userName: "Vũ Thị F",
        rating: 5,
        comment: "Tốt cho xương, dễ uống",
        date: new Date("2024-01-03")
      }
    ],
    ingredients: "Canxi carbonat 500mg, Vitamin D3 400IU",
    usage: "Uống 1-2 viên mỗi ngày trong bữa ăn",
    sideEffects: "Có thể gây táo bón",
    contraindications: "Không dùng cho người tăng canxi máu",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Probiotic 10 tỷ CFU",
    description: "Bổ sung lợi khuẩn đường ruột, hỗ trợ tiêu hóa",
    price: 95000,
    originalPrice: 120000,
    category: "Vitamin & Thực phẩm chức năng",
    manufacturer: "Công ty Dược phẩm Sanofi",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
    ],
    stock: 90,
    rating: 4.4,
    reviews: [
      {
        id: "7",
        userId: "user7",
        userName: "Đỗ Văn G",
        rating: 4,
        comment: "Cải thiện tiêu hóa rõ rệt",
        date: new Date("2024-01-01")
      }
    ],
    ingredients: "Lactobacillus acidophilus, Bifidobacterium bifidum",
    usage: "Uống 1 viên mỗi ngày trước bữa ăn",
    sideEffects: "Có thể gây đầy hơi nhẹ",
    contraindications: "Không dùng cho người suy giảm miễn dịch",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Aspirin 100mg",
    description: "Thuốc chống đông máu, phòng ngừa đột quỵ",
    price: 28000,
    originalPrice: 35000,
    category: "Thuốc tim mạch",
    manufacturer: "Dược phẩm Bayer",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"
    ],
    stock: 200,
    rating: 4.6,
    reviews: [
      {
        id: "8",
        userId: "user8",
        userName: "Ngô Thị H",
        rating: 5,
        comment: "Thuốc tốt, giá hợp lý",
        date: new Date("2023-12-28")
      }
    ],
    ingredients: "Acetylsalicylic acid 100mg",
    usage: "Uống 1 viên mỗi ngày theo chỉ định bác sĩ",
    sideEffects: "Có thể gây chảy máu dạ dày",
    contraindications: "Không dùng cho người loét dạ dày",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Melatonin 3mg",
    description: "Hormone tự nhiên giúp cải thiện giấc ngủ",
    price: 75000,
    originalPrice: 90000,
    category: "Vitamin & Thực phẩm chức năng",
    manufacturer: "Công ty Dược phẩm Nature Made",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"
    ],
    stock: 60,
    rating: 4.2,
    reviews: [
      {
        id: "9",
        userId: "user9",
        userName: "Lý Văn I",
        rating: 4,
        comment: "Giúp ngủ ngon hơn",
        date: new Date("2023-12-25")
      }
    ],
    ingredients: "Melatonin 3mg, tá dược vừa đủ",
    usage: "Uống 1 viên 30 phút trước khi ngủ",
    sideEffects: "Có thể gây buồn ngủ ban ngày",
    contraindications: "Không dùng cho phụ nữ có thai",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu products...');
    
    for (const product of products) {
      const docRef = await db.collection('products').add(product);
      console.log(`✅ Đã tạo product "${product.name}" với ID: ${docRef.id}`);
    }
    
    console.log('🎉 Hoàn thành seed dữ liệu products!');
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  }
}

// Run the seed function
seedProducts(); 