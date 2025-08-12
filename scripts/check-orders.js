const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

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

async function checkOrders() {
  try {
    console.log('🔍 Kiểm tra tất cả orders trong Firestore...');
    
    // Lấy tất cả orders
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    
    console.log(`📊 Tổng số orders: ${ordersSnapshot.size}`);
    
    if (ordersSnapshot.size === 0) {
      console.log('❌ Không có orders nào trong database');
      return;
    }
    
    console.log('\n📋 Chi tiết các orders:');
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n🆔 Order ID: ${doc.id}`);
      console.log(`👤 User ID: ${data.userId}`);
      console.log(`📦 Items count: ${data.items?.length || 0}`);
      console.log(`💰 Total Amount: ${data.totalAmount}`);
      console.log(`📅 Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
      console.log(`📊 Status: ${data.status}`);
      
      if (data.items && data.items.length > 0) {
        console.log('📦 Items:');
        data.items.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.productName} - Qty: ${item.quantity} - Price: ${item.price}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra orders:', error);
  }
}

// Run the check function
checkOrders(); 