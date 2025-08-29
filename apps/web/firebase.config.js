// Firebase configuration
// Bạn cần thay thế các giá trị này bằng thông tin từ Firebase Console
export const firebaseConfig = {
  apiKey: "AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY",
  authDomain: "hoanglinh-obesity-care.firebaseapp.com",
  projectId: "hoanglinh-obesity-care",
  storageBucket: "hoanglinh-obesity-care.firebasestorage.app",
  messagingSenderId: "860032582221",
  appId: "1:860032582221:web:e3c5923cbe504725d91204",
  measurementId: "G-T9Z1DMXE8P"
};

// Các collection names cho Firestore
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  GOALS: 'goals',
  MEASUREMENTS: 'measurements',
  PLANS: 'plans',
  EXERCISES: 'exercises',
  DIETS: 'diets'
};
