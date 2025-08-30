// Firebase service functions - using dynamic imports to avoid build issues
let firebaseConfig: any;
let COLLECTIONS: any;

// Dynamic imports to avoid build-time module resolution issues
let app: any;
let auth: any;
let db: any;

// Initialize Firebase dynamically
const initializeFirebase = async () => {
  if (!app) {
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    
    // Import config
    const config = await import('../firebase.config');
    firebaseConfig = config.firebaseConfig;
    COLLECTIONS = config.COLLECTIONS;
    
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
};

// Export initialized instances
export const getFirebaseInstances = () => ({ app, auth, db });

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeFirebase();
}

class FirebaseService {
  private isInitialized: boolean;
  private currentUser: any;

  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.initialize();
  }

  async initialize() {
    try {
      const { auth: authInstance } = await initializeFirebase();
      
      // Listen for auth state changes
      const { onAuthStateChanged } = await import('firebase/auth');
      onAuthStateChanged(authInstance, (user) => {
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
      this.isInitialized = true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
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
          const { auth: authInstance } = await initializeFirebase();
          // Get current user from Firebase Auth
          const currentUser = authInstance.currentUser;
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
  async initializeFirebase(): Promise<boolean> {
    return this.isInitialized;
  }

  // Authentication methods
  async createUserWithEmailAndPassword(email: string, password: string) {
    try {
      const { createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
      const { auth: authInstance } = await initializeFirebase();
      const result = await createUser(authInstance, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Tạo tài khoản thất bại: ${error.message}`);
    }
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      const { signInWithEmailAndPassword: signIn } = await import('firebase/auth');
      const { auth: authInstance } = await initializeFirebase();
      const result = await signIn(authInstance, email, password);
      return { user: result.user };
    } catch (error: any) {
      throw new Error(`Đăng nhập thất bại: ${error.message}`);
    }
  }

  async signOut() {
    try {
      const { signOut: signOutFn } = await import('firebase/auth');
      const { auth: authInstance } = await initializeFirebase();
      await signOutFn(authInstance);
      return true;
    } catch (error: any) {
      throw new Error(`Đăng xuất thất bại: ${error.message}`);
    }
  }

  // User profile methods
  async createUserProfile(userId: string, profileData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.PROFILES), {
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
      const { db: dbInstance } = await initializeFirebase();
      const docRef = doc(dbInstance, COLLECTIONS.PROFILES, userId);
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

  async updateUserProfile(userId: string, updateData: any) {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const docRef = doc(dbInstance, COLLECTIONS.PROFILES, userId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return true;
    } catch (error: any) {
      throw new Error(`Cập nhật profile thất bại: ${error.message}`);
    }
  }

  // Goal methods
  async createGoal(userId: string, goalData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.GOALS), {
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
      const { db: dbInstance } = await initializeFirebase();
      const q = query(collection(dbInstance, COLLECTIONS.GOALS), where('userId', '==', userId));
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

  // Measurement methods
  async createMeasurement(userId: string, measurementData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.MEASUREMENTS), {
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
      const { db: dbInstance } = await initializeFirebase();
      const q = query(
        collection(dbInstance, COLLECTIONS.MEASUREMENTS), 
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

  // Plan methods
  async createPlan(userId: string, planData: any) {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.PLANS), {
        userId,
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id };
    } catch (error: any) {
      throw new Error(`Tạo kế hoạch thất bại: ${error.message}`);
    }
  }

  async getUserPlans(userId: string) {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db: dbInstance } = await initializeFirebase();
      const q = query(collection(dbInstance, COLLECTIONS.PLANS), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const plans: any[] = [];
      querySnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() });
      });
      
      return plans;
    } catch (error: any) {
      throw new Error(`Lấy kế hoạch thất bại: ${error.message}`);
    }
  }

  // Get current user
  getCurrentUser(): any {
    return this.currentUser;
  }

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return this.isInitialized && this.currentUser !== null;
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
  updateUserProfile,
  createGoal,
  getUserGoals,
  createMeasurement,
  getUserMeasurements,
  createPlan,
  getUserPlans,
  getCurrentUser,
  isUserLoggedIn
} = firebaseService;
