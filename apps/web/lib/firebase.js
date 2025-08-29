// Firebase service functions
import { firebaseConfig, COLLECTIONS } from '../firebase.config.js';

// Mock Firebase functions (sẽ thay thế bằng Firebase thực tế sau khi cài đặt)
class FirebaseService {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
  }

  // Initialize Firebase (sẽ thay thế bằng Firebase.initializeApp)
  async initialize() {
    try {
      // TODO: Thay thế bằng Firebase.initializeApp(firebaseConfig)
      console.log('Firebase initialized with config:', firebaseConfig);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  }

  // Authentication methods
  async createUserWithEmailAndPassword(email, password) {
    try {
      // TODO: Thay thế bằng Firebase Auth
      const user = {
        uid: `user_${Date.now()}`,
        email,
        emailVerified: false,
        displayName: email.split('@')[0],
        photoURL: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        }
      };
      
      this.currentUser = user;
      
      // Lưu vào localStorage để demo
      localStorage.setItem('firebase_user', JSON.stringify(user));
      
      return { user };
    } catch (error) {
      throw new Error(`Tạo tài khoản thất bại: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email, password) {
    try {
      // TODO: Thay thế bằng Firebase Auth
      const storedUser = localStorage.getItem('firebase_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          this.currentUser = user;
          return { user };
        }
      }
      throw new Error('Email hoặc mật khẩu không đúng');
    } catch (error) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async signOut() {
    try {
      // TODO: Thay thế bằng Firebase Auth
      this.currentUser = null;
      localStorage.removeItem('firebase_user');
      return true;
    } catch (error) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Firestore methods
  async addDocument(collection, data) {
    try {
      // TODO: Thay thế bằng Firestore
      const docId = `doc_${Date.now()}`;
      const document = {
        id: docId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Lưu vào localStorage để demo
      const key = `firebase_${collection}_${docId}`;
      localStorage.setItem(key, JSON.stringify(document));
      
      return { id: docId, ...document };
    } catch (error) {
      throw new Error(`Thêm document thất bại: ${error.message}`);
    }
  }

  async getDocument(collection, docId) {
    try {
      // TODO: Thay thế bằng Firestore
      const key = `firebase_${collection}_${docId}`;
      const document = localStorage.getItem(key);
      return document ? JSON.parse(document) : null;
    } catch (error) {
      throw new Error(`Lấy document thất bại: ${error.message}`);
    }
  }

  async updateDocument(collection, docId, data) {
    try {
      // TODO: Thay thế bằng Firestore
      const key = `firebase_${collection}_${docId}`;
      const existingDoc = localStorage.getItem(key);
      if (!existingDoc) {
        throw new Error('Document không tồn tại');
      }
      
      const updatedDoc = {
        ...JSON.parse(existingDoc),
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(key, JSON.stringify(updatedDoc));
      return updatedDoc;
    } catch (error) {
      throw new Error(`Cập nhật document thất bại: ${error.message}`);
    }
  }

  async deleteDocument(collection, docId) {
    try {
      // TODO: Thay thế bằng Firestore
      const key = `firebase_${collection}_${docId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      throw new Error(`Xóa document thất bại: ${error.message}`);
    }
  }

  async queryCollection(collection, where = [], orderBy = null, limit = null) {
    try {
      // TODO: Thay thế bằng Firestore
      const documents = [];
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith(`firebase_${collection}_`)) {
          const document = JSON.parse(localStorage.getItem(key));
          
          // Simple where filtering (sẽ thay thế bằng Firestore query)
          let include = true;
          for (const [field, operator, value] of where) {
            if (operator === '==') {
              include = include && document[field] === value;
            } else if (operator === '!=') {
              include = include && document[field] !== value;
            }
          }
          
          if (include) {
            documents.push(document);
          }
        }
      }
      
      // Simple ordering (sẽ thay thế bằng Firestore orderBy)
      if (orderBy) {
        const [field, direction] = orderBy;
        documents.sort((a, b) => {
          if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
          } else {
            return a[field] < b[field] ? 1 : -1;
          }
        });
      }
      
      // Simple limiting (sẽ thay thế bằng Firestore limit)
      if (limit) {
        return documents.slice(0, limit);
      }
      
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
