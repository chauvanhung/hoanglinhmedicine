// Firebase configuration with environment variable support
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY",
  authDomain: "hoanglinh-obesity-care.firebaseapp.com",
  projectId: "hoanglinh-obesity-care",
  storageBucket: "hoanglinh-obesity-care.firebasestorage.app",
  messagingSenderId: "860032582221",
  appId: "1:860032582221:web:e3c5923cbe504725d91204",
  measurementId: "G-T9Z1DMXE8P"
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
