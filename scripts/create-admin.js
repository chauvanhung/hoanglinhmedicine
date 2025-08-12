const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

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

async function createAdminUser(userId) {
  console.log(`🔧 Đang tạo admin user cho ID: ${userId}`);

  try {
    // Kiểm tra user có tồn tại không
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      console.log('❌ User không tồn tại! Vui lòng đăng ký tài khoản trước.');
      return;
    }

    // Cập nhật role thành admin
    await setDoc(doc(db, 'users', userId), {
      ...userDoc.data(),
      role: 'admin',
      updatedAt: new Date()
    }, { merge: true });

    console.log('✅ Đã tạo admin user thành công!');
    console.log('👤 Thông tin admin:', userDoc.data().name, userDoc.data().email);
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
  }
}

// Lấy userId từ command line argument
const userId = process.argv[2];

if (!userId) {
  console.log('❌ Vui lòng cung cấp User ID!');
  console.log('📝 Cách sử dụng: node scripts/create-admin.js <USER_ID>');
  console.log('💡 Ví dụ: node scripts/create-admin.js abc123def456');
  process.exit(1);
}

createAdminUser(userId); 