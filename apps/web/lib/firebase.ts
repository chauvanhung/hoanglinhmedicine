// Simple Firebase configuration for Render compatibility
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  GOALS: 'goals',
  MEASUREMENTS: 'measurements',
  PLANS: 'plans',
  EXERCISES: 'exercises',
  DIETS: 'diets'
};

// Simple service class
class FirebaseService {
  async createUserWithEmailAndPassword(email: string, password: string) {
    try {
      const { createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
      const result = await createUser(auth, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Tạo tài khoản thất bại: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const { signInWithEmailAndPassword: signIn } = await import('firebase/auth');
      const result = await signIn(auth, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async signOut() {
    try {
      const { signOut: signOutFn } = await import('firebase/auth');
      await signOutFn(auth);
      return true;
    } catch (error: any) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  async createUserProfile(userId: string, profileData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, COLLECTIONS.PROFILES), {
        userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id };
    } catch (error: any) {
      throw new Error(`Tạo profile thất bại: ${error.message}`);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const { doc, getDoc, collection } = await import('firebase/firestore');
      const docRef = doc(db, COLLECTIONS.PROFILES, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error: any) {
      throw new Error(`Lấy profile thất bại: ${error.message}`);
    }
  }

  async createGoal(userId: string, goalData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, COLLECTIONS.GOALS), {
        userId,
        ...goalData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id };
    } catch (error: any) {
      throw new Error(`Tạo mục tiêu thất bại: ${error.message}`);
    }
  }

  async getUserGoals(userId: string) {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const q = query(collection(db, COLLECTIONS.GOALS), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const goals: any[] = [];
      querySnapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() });
      });
      
      return goals;
    } catch (error: any) {
      throw new Error(`Lấy mục tiêu thất bại: ${error.message}`);
    }
  }

  async createMeasurement(userId: string, measurementData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, COLLECTIONS.MEASUREMENTS), {
        userId,
        ...measurementData,
        createdAt: new Date()
      });
      return { id: docRef.id };
    } catch (error: any) {
      throw new Error(`Tạo đo lường thất bại: ${error.message}`);
    }
  }

  async getUserMeasurements(userId: string) {
    try {
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
      const q = query(
        collection(db, COLLECTIONS.MEASUREMENTS), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const measurements: any[] = [];
      querySnapshot.forEach((doc) => {
        measurements.push({ id: doc.id, ...doc.data() });
      });
      
      return measurements;
    } catch (error: any) {
      throw new Error(`Lấy đo lường thất bại: ${error.message}`);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  isUserLoggedIn() {
    return auth.currentUser !== null;
  }
}

// Create and export service instance
const firebaseService = new FirebaseService();
export default firebaseService;

// Export individual methods for convenience
export const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  createUserProfile,
  getUserProfile,
  createGoal,
  getUserGoals,
  createMeasurement,
  getUserMeasurements,
  getCurrentUser,
  isUserLoggedIn
} = firebaseService;
