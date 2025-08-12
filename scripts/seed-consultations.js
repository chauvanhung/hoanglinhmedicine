const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBvOkJqHqHqHqHqHqHqHqHqHqHqHqHqHqHq",
  authDomain: "hoanglinh-medicine.firebaseapp.com",
  projectId: "hoanglinh-medicine",
  storageBucket: "hoanglinh-medicine.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample consultation data
const sampleConsultations = [
  {
    userId: "user123", // Replace with actual user ID
    doctorName: "Bác sĩ Nguyễn Văn An",
    doctorSpecialty: "Tim mạch",
    doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    date: new Date("2024-01-15"),
    time: "09:00",
    duration: 30,
    status: "completed",
    symptoms: "Đau ngực, khó thở khi vận động",
    notes: "Bệnh nhân cần theo dõi huyết áp thường xuyên",
    price: 500000,
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    userId: "user123", // Replace with actual user ID
    doctorName: "Bác sĩ Trần Thị Bình",
    doctorSpecialty: "Nội tiết",
    doctorImage: "https://images.unsplash.com/photo-1594824475545-9d0c7c4951c1?w=400&h=400&fit=crop&crop=face",
    date: new Date("2024-01-20"),
    time: "14:00",
    duration: 45,
    status: "confirmed",
    symptoms: "Mệt mỏi, khát nước, đi tiểu nhiều",
    notes: "Kiểm tra đường huyết định kỳ",
    price: 600000,
    paymentStatus: "paid",
    paymentMethod: "momo",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18")
  },
  {
    userId: "user123", // Replace with actual user ID
    doctorName: "Bác sĩ Lê Văn Cường",
    doctorSpecialty: "Thần kinh",
    doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    date: new Date("2024-01-25"),
    time: "10:30",
    duration: 60,
    status: "pending",
    symptoms: "Đau đầu, chóng mặt, mất ngủ",
    notes: "Cần nghỉ ngơi đầy đủ, tránh stress",
    price: 700000,
    paymentStatus: "pending",
    paymentMethod: "cod",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  },
  {
    userId: "user123", // Replace with actual user ID
    doctorName: "Bác sĩ Phạm Thị Dung",
    doctorSpecialty: "Da liễu",
    doctorImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    date: new Date("2024-01-08"),
    time: "16:00",
    duration: 30,
    status: "cancelled",
    symptoms: "Nổi mẩn đỏ, ngứa da",
    notes: "Bệnh nhân hủy lịch do bận việc",
    price: 400000,
    paymentStatus: "pending",
    paymentMethod: "vnpay",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-07")
  }
];

async function seedConsultations() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu consultations...');
    
    for (const consultation of sampleConsultations) {
      const docRef = await addDoc(collection(db, 'consultations'), consultation);
      console.log(`✅ Đã tạo consultation với ID: ${docRef.id}`);
    }
    
    console.log('🎉 Hoàn thành seed dữ liệu consultations!');
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  }
}

// Run the seed function
seedConsultations(); 