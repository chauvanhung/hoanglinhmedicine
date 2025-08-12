import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Cấu hình Firebase - Bạn cần thay thế bằng config thực tế từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCtms4ro8NyEqMGlNyZFIi5uAiV0mfzIKE",
    authDomain: "hoanglinh-medicine.firebaseapp.com",
    projectId: "hoanglinh-medicine",
    storageBucket: "hoanglinh-medicine.firebasestorage.app",
    messagingSenderId: "150517241295",
    appId: "1:150517241295:web:56ef9aad6b82d00539eeba",
    measurementId: "G-5XXM4NMF1F"
  };
  
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig)

// Khởi tạo Authentication và Firestore
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app 