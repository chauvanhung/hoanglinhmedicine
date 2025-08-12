const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function listUsers() {
  console.log('👥 Danh sách tất cả users:');
  console.log('=' .repeat(50));

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    if (usersSnapshot.empty) {
      console.log('❌ Chưa có user nào trong database');
      return;
    }

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`🆔 User ID: ${doc.id}`);
      console.log(`👤 Tên: ${userData.name}`);
      console.log(`📧 Email: ${userData.email}`);
      console.log(`📱 Phone: ${userData.phone || 'Chưa cập nhật'}`);
      console.log(`🔑 Role: ${userData.role}`);
      console.log(`📅 Tạo lúc: ${userData.createdAt?.toDate?.() || 'N/A'}`);
      console.log('-'.repeat(30));
    });

    console.log('💡 Để tạo admin, sử dụng: npm run create:admin <USER_ID>');
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách users:', error);
  }
}

listUsers(); 