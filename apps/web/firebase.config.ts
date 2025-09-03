// Firebase configuration with environment variable support
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hoanglinh-obesity-care.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hoanglinh-obesity-care",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hoanglinh-obesity-care.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "860032582221",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:860032582221:web:e3c5923cbe504725d91204",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-T9Z1DMXE8P"
};

export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  GOALS: 'goals',
  MEASUREMENTS: 'measurements',
  PLANS: 'plans',
  EXERCISES: 'exercises',
  DIETS: 'diets'
};
