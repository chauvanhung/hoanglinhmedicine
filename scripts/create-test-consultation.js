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

// Test consultation data
const testConsultation = {
  userId: "test-user-id", // Replace with actual user ID
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
};

async function createTestConsultation() {
  try {
    console.log('🌱 Tạo test consultation...');
    
    const docRef = await addDoc(collection(db, 'consultations'), testConsultation);
    console.log(`✅ Đã tạo consultation với ID: ${docRef.id}`);
    
    console.log('🎉 Hoàn thành!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
  }
}

// Run the function
createTestConsultation(); 