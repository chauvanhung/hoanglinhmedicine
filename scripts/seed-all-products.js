const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'hoanglinh-medicine'
  });
}

const db = admin.firestore();

// Import all products from lib/products.ts
const { allProducts } = require('../lib/products.ts');

async function seedAllProducts() {
  try {
    console.log('🌱 Bắt đầu seed tất cả sản phẩm...');
    console.log(`📦 Tổng số sản phẩm: ${allProducts.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const product of allProducts) {
      try {
        // Remove the id field as Firestore will generate it
        const { id, ...productData } = product;
        
        // Add timestamps
        const productWithTimestamps = {
          ...productData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const docRef = await db.collection('products').add(productWithTimestamps);
        console.log(`✅ Đã tạo product "${product.name}" với ID: ${docRef.id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Lỗi khi tạo product "${product.name}":`, error);
        errorCount++;
      }
    }
    
    console.log('🎉 Hoàn thành seed dữ liệu!');
    console.log(`✅ Thành công: ${successCount} sản phẩm`);
    console.log(`❌ Lỗi: ${errorCount} sản phẩm`);
    
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
  }
}

// Run the seed function
seedAllProducts(); 