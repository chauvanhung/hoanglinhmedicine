const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');

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

async function testCreateOrder() {
  try {
    console.log('🧪 Test tạo order...');
    
    // Test data
    const testOrderData = {
      userId: "test-user-123", // Thay bằng user ID thực tế
      items: [
        {
          productId: "test-product-1",
          productName: "Thuốc test 1",
          productImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
          price: 50000,
          quantity: 2,
          total: 100000
        },
        {
          productId: "test-product-2", 
          productName: "Thuốc test 2",
          productImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
          price: 75000,
          quantity: 1,
          total: 75000
        }
      ],
      totalAmount: 175000,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "cod",
      shippingAddress: {
        fullName: "Nguyễn Văn Test",
        phone: "0123456789",
        address: "123 Đường Test",
        city: "TP.HCM",
        district: "Quận 1",
        ward: "Phường Bến Nghé"
      },
      notes: "Test order",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating test order with data:', testOrderData);
    
    const docRef = await addDoc(collection(db, 'orders'), testOrderData);
    console.log('✅ Test order created with ID:', docRef.id);
    
    // Kiểm tra xem order có được tạo không
    console.log('\n🔍 Kiểm tra order vừa tạo...');
    const q = query(collection(db, 'orders'), where('userId', '==', 'test-user-123'));
    const snapshot = await getDocs(q);
    
    console.log(`📊 Tìm thấy ${snapshot.size} orders cho user test-user-123`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n🆔 Order ID: ${doc.id}`);
      console.log(`👤 User ID: ${data.userId}`);
      console.log(`📦 Items: ${data.items.length}`);
      console.log(`💰 Total: ${data.totalAmount}`);
      console.log(`📅 Created: ${data.createdAt.toDate()}`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi test tạo order:', error);
  }
}

// Run the test
testCreateOrder(); 