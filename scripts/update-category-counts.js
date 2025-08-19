const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

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

async function updateAllCategoryCounts() {
  console.log('🔄 Bắt đầu cập nhật số lượng sản phẩm trong tất cả danh mục...');

  try {
    // Get all categories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = [];
    
    categoriesSnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📂 Tìm thấy ${categories.length} danh mục`);

    // Update count for each category
    for (const category of categories) {
      try {
        // Count products in this category
        const productsSnapshot = await getDocs(
          query(collection(db, 'products'), where('category', '==', category.name))
        );
        
        const productCount = productsSnapshot.size;
        
        // Update category count
        await updateDoc(doc(db, 'categories', category.id), {
          count: productCount,
          updatedAt: new Date()
        });
        
        console.log(`✅ ${category.name}: ${productCount} sản phẩm`);
      } catch (error) {
        console.error(`❌ Lỗi khi cập nhật danh mục ${category.name}:`, error);
      }
    }

    console.log('🎉 Hoàn thành cập nhật số lượng sản phẩm trong tất cả danh mục!');
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật danh mục:', error);
  }
}

// Chạy script
updateAllCategoryCounts(); 