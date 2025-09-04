// Simple Firebase configuration for Render compatibility
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword as createUserFn, signInWithEmailAndPassword as signInFn, signOut as signOutFn, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, doc, QueryConstraint, OrderByDirection } from 'firebase/firestore';
import { firebaseConfig } from '../firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app);

console.log('Firebase initialized successfully');

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
      const result = await createUserFn(auth, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Tạo tài khoản thất bại: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const result = await signInFn(auth, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async signOut() {
    try {
      await signOutFn(auth);
      return true;
    } catch (error: any) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  async createUserProfile(userId: string, profileData: any) {
    try {
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
      console.log('🔍 getUserProfile called with userId:', userId);
      console.log('🔍 Firebase db:', db);
      
      console.log('🔍 Querying profiles collection for userId:', userId);
      const q = query(collection(db, COLLECTIONS.PROFILES), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      console.log('🔍 Query result size:', querySnapshot.size);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const profileData = { id: doc.id, ...doc.data() };
        console.log('✅ Found profile:', profileData);
        return profileData;
      } else {
        console.log('❌ No profile found for userId:', userId);
        return null;
      }
    } catch (error: any) {
      console.error('❌ getUserProfile error:', error);
      throw new Error(`Lấy profile thất bại: ${error.message}`);
    }
  }

  async createGoal(userId: string, goalData: any) {
    try {
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
      console.log('🔍 getUserGoals called with userId:', userId);
      
      const q = query(collection(db, COLLECTIONS.GOALS), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      console.log('🔍 Goals query result size:', querySnapshot.size);
      
      const goals: any[] = [];
      querySnapshot.forEach((doc) => {
        const goalData = { id: doc.id, ...doc.data() };
        console.log('✅ Found goal:', goalData);
        goals.push(goalData);
      });
      
      return goals;
    } catch (error: any) {
      console.error('❌ getUserGoals error:', error);
      throw new Error(`Lấy mục tiêu thất bại: ${error.message}`);
    }
  }

  async createMeasurement(userId: string, measurementData: any) {
    try {
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
      console.log('🔍 getUserMeasurements called with userId:', userId);
      console.log('🔍 Firebase db:', db);
      
      // Try simple query first without orderBy
      const q = query(
        collection(db, COLLECTIONS.MEASUREMENTS), 
        where('userId', '==', userId)
      );
      console.log('🔍 Query created successfully');
      
      const querySnapshot = await getDocs(q);
      console.log('🔍 Measurements query result size:', querySnapshot.size);
      
      const measurements: any[] = [];
      querySnapshot.forEach((doc) => {
        const measurementData = { id: doc.id, ...doc.data() };
        console.log('✅ Found measurement:', measurementData);
        measurements.push(measurementData);
      });
      
      console.log('🔍 Total measurements found:', measurements.length);
      return measurements;
    } catch (error: any) {
      console.error('❌ getUserMeasurements error:', error);
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
