'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check localStorage first for immediate UI response
    const storedUser = localStorage.getItem('firebase_user');
    const authStatus = localStorage.getItem('firebase_auth_status');
    
    if (storedUser && authStatus === 'logged_in') {
      try {
        const parsedUser = JSON.parse(storedUser);
        // User data is already in localStorage, UI can access it
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('firebase_user');
        localStorage.removeItem('firebase_auth_status');
      }
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in - store user data and status
        localStorage.setItem('firebase_user', JSON.stringify(user));
        localStorage.setItem('firebase_auth_status', 'logged_in');
        console.log('User signed in:', user.email);
      } else {
        // User is signed out - clear stored data
        localStorage.removeItem('firebase_user');
        localStorage.removeItem('firebase_auth_status');
        console.log('User signed out');
      }
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="loading-container">
          <div className="loading-wave">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="loading-text text-lg">Đang khởi tạo ứng dụng...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
