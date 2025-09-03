// Firebase service functions
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword as createUserFn, signInWithEmailAndPassword as signInFn, signOut as signOutFn, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, doc, QueryConstraint, OrderByDirection } from 'firebase/firestore';
import { firebaseConfig, COLLECTIONS } from '../firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

class FirebaseService {
  private isInitialized: boolean;
  private currentUser: User | null;

  constructor() {
    this.isInitialized = true;
    this.currentUser = null;
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('firebase_user', JSON.stringify(user));
          localStorage.setItem('firebase_auth_status', 'logged_in');
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
        }
      }
    });

    // Check for existing login on initialization
    this.checkExistingLogin();
  }

  // Check if user is already logged in
  async checkExistingLogin(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      
      // Check localStorage first
      const storedUser = localStorage.getItem('firebase_user');
      const authStatus = localStorage.getItem('firebase_auth_status');
      
      if (storedUser && authStatus === 'logged_in') {
        const user = JSON.parse(storedUser);
        
        // Verify the user is still valid with Firebase
        try {
          // Get current user from Firebase Auth
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === user.uid) {
            this.currentUser = currentUser;
            return;
          }
        } catch (error) {
          console.log('Firebase auth check failed, clearing stored data');
        }
        
        // If verification failed, clear stored data
        localStorage.removeItem('firebase_user');
        localStorage.removeItem('firebase_auth_status');
      }
    } catch (error) {
      console.error('Error checking existing login:', error);
      // Clear any corrupted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('firebase_user');
        localStorage.removeItem('firebase_auth_status');
      }
    }
  }

  // Initialize Firebase (kept for compatibility)
  async initialize(): Promise<boolean> {
    return true;
  }

  // Authentication methods
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

  async signOut(): Promise<boolean> {
    try {
      await signOutFn(auth);
      return true;
    } catch (error: any) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Firestore methods
  async addDocument(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error: any) {
      throw new Error(`Thêm document thất bại: ${error.message}`);
    }
  }

  async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error: any) {
      throw new Error(`Lấy document thất bại: ${error.message}`);
    }
  }

  async updateDocument(collectionName: string, docId: string, data: any) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id: docId, ...data };
    } catch (error: any) {
      throw new Error(`Cập nhật document thất bại: ${error.message}`);
    }
  }

  async deleteDocument(collectionName: string, docId: string): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error: any) {
      throw new Error(`Xóa document thất bại: ${error.message}`);
    }
  }

  async queryCollection(
    collectionName: string, 
    whereConditions: [string, any, any][] = [], 
    orderByField: [string, OrderByDirection] | null = null, 
    limitCount: number | null = null
  ) {
    try {
      let q: any = collection(db, collectionName);
      
      // Apply where conditions
      if (whereConditions.length > 0) {
        for (const [field, operator, value] of whereConditions) {
          q = query(q, where(field, operator, value));
        }
      }
      
      // Apply orderBy
      if (orderByField) {
        const [field, direction] = orderByField;
        q = query(q, orderBy(field, direction));
      }
      
      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data && typeof data === 'object') {
          documents.push({ id: doc.id, ...(data as Record<string, any>) });
        }
      });
      
      return documents;
    } catch (error: any) {
      throw new Error(`Query collection thất bại: ${error.message}`);
    }
  }

  // User profile methods
  async createUserProfile(userId: string, profileData: any) {
    return this.addDocument(COLLECTIONS.PROFILES, {
      userId,
      ...profileData
    });
  }

  async createUserGoal(userId: string, goalData: any) {
    return this.addDocument(COLLECTIONS.GOALS, {
      userId,
      ...goalData
    });
  }

  async createUserMeasurement(userId: string, measurementData: any) {
    return this.addDocument(COLLECTIONS.MEASUREMENTS, {
      userId,
      ...measurementData
    });
  }

  async getUserProfile(userId: string) {
    const profiles = await this.queryCollection(COLLECTIONS.PROFILES, [['userId', '==', userId]]);
    return profiles.length > 0 ? profiles[0] : null;
  }

  async getUserGoals(userId: string) {
    return this.queryCollection(COLLECTIONS.GOALS, [['userId', '==', userId]]);
  }

  async getUserMeasurements(userId: string) {
    return this.queryCollection(COLLECTIONS.MEASUREMENTS, [['userId', '==', userId]]);
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();

// Helper functions
export const initializeFirebase = () => firebaseService.initialize();
export const createUser = (email: string, password: string) => firebaseService.createUserWithEmailAndPassword(email, password);
export const signInUser = (email: string, password: string) => firebaseService.signInWithEmailAndPassword(email, password);
export const signOutUser = () => firebaseService.signOut();
export const getCurrentUser = () => firebaseService.getCurrentUser();
export const addDocument = (collection: string, data: any) => firebaseService.addDocument(collection, data);
export const getDocument = (collection: string, docId: string) => firebaseService.getDocument(collection, docId);
export const updateDocument = (collection: string, docId: string, data: any) => firebaseService.updateDocument(collection, docId, data);
export const deleteDocument = (collection: string, docId: string) => firebaseService.deleteDocument(collection, docId);
export const queryCollection = (collection: string, where: [string, any, any][], orderBy: [string, OrderByDirection] | null, limit: number | null) => firebaseService.queryCollection(collection, where, orderBy, limit);

// User profile methods
export const getUserProfile = (userId: string) => firebaseService.getUserProfile(userId);
export const getUserGoals = (userId: string) => firebaseService.getUserGoals(userId);
export const getUserMeasurements = (userId: string) => firebaseService.getUserMeasurements(userId);
export const createUserProfile = (userId: string, profileData: any) => firebaseService.createUserProfile(userId, profileData);
export const createUserGoal = (userId: string, goalData: any) => firebaseService.createUserGoal(userId, goalData);
export const createUserMeasurement = (userId: string, measurementData: any) => firebaseService.createUserMeasurement(userId, measurementData);
