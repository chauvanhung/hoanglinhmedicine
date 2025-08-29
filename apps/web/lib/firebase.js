// Firebase service functions
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { firebaseConfig, COLLECTIONS } from '../firebase.config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class FirebaseService {
  constructor() {
    this.isInitialized = true;
    this.currentUser = null;
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        localStorage.setItem('firebase_user', JSON.stringify(user));
        localStorage.setItem('firebase_auth_status', 'logged_in');
      } else {
        localStorage.removeItem('firebase_user');
        localStorage.removeItem('firebase_auth_status');
      }
    });

    // Check for existing login on initialization
    this.checkExistingLogin();
  }

  // Check if user is already logged in
  async checkExistingLogin() {
    try {
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
      localStorage.removeItem('firebase_user');
      localStorage.removeItem('firebase_auth_status');
    }
  }

  // Initialize Firebase (kept for compatibility)
  async initialize() {
    return true;
  }

  // Authentication methods
  async createUserWithEmailAndPassword(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error) {
      throw new Error(`Tạo tài khoản thất bại: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Firestore methods
  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new Error(`Thêm document thất bại: ${error.message}`);
    }
  }

  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Lấy document thất bại: ${error.message}`);
    }
  }

  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id: docId, ...data };
    } catch (error) {
      throw new Error(`Cập nhật document thất bại: ${error.message}`);
    }
  }

  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Xóa document thất bại: ${error.message}`);
    }
  }

  async queryCollection(collectionName, whereConditions = [], orderByField = null, limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
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
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw new Error(`Query collection thất bại: ${error.message}`);
    }
  }

  // User profile methods
  async createUserProfile(userId, profileData) {
    return this.addDocument(COLLECTIONS.PROFILES, {
      userId,
      ...profileData
    });
  }

  async createUserGoal(userId, goalData) {
    return this.addDocument(COLLECTIONS.GOALS, {
      userId,
      ...goalData
    });
  }

  async createUserMeasurement(userId, measurementData) {
    return this.addDocument(COLLECTIONS.MEASUREMENTS, {
      userId,
      ...measurementData
    });
  }

  async getUserProfile(userId) {
    const profiles = await this.queryCollection(COLLECTIONS.PROFILES, [['userId', '==', userId]]);
    return profiles.length > 0 ? profiles[0] : null;
  }

  async getUserGoals(userId) {
    return this.queryCollection(COLLECTIONS.GOALS, [['userId', '==', userId]]);
  }

  async getUserMeasurements(userId) {
    return this.queryCollection(COLLECTIONS.MEASUREMENTS, [['userId', '==', userId]]);
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();

// Helper functions
export const initializeFirebase = () => firebaseService.initialize();
export const createUser = (email, password) => firebaseService.createUserWithEmailAndPassword(email, password);
export const signInUser = (email, password) => firebaseService.signInWithEmailAndPassword(email, password);
export const signOutUser = () => firebaseService.signOut();
export const getCurrentUser = () => firebaseService.getCurrentUser();
export const addDocument = (collection, data) => firebaseService.addDocument(collection, data);
export const getDocument = (collection, docId) => firebaseService.getDocument(collection, docId);
export const updateDocument = (collection, docId, data) => firebaseService.updateDocument(collection, docId, data);
export const deleteDocument = (collection, docId) => firebaseService.deleteDocument(collection, docId);
export const queryCollection = (collection, where, orderBy, limit) => firebaseService.queryCollection(collection, where, orderBy, limit);

// User profile methods
export const getUserProfile = (userId) => firebaseService.getUserProfile(userId);
export const getUserGoals = (userId) => firebaseService.getUserGoals(userId);
export const getUserMeasurements = (userId) => firebaseService.getUserMeasurements(userId);
export const createUserProfile = (userId, profileData) => firebaseService.createUserProfile(userId, profileData);
export const createUserGoal = (userId, goalData) => firebaseService.createUserGoal(userId, goalData);
export const createUserMeasurement = (userId, measurementData) => firebaseService.createUserMeasurement(userId, measurementData);
