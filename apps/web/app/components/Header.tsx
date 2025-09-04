'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import firebaseService from '../../lib/firebase';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = () => {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      const storedUser = localStorage.getItem('firebase_user');
      const authStatus = localStorage.getItem('firebase_auth_status');
      
      if (storedUser && authStatus === 'logged_in') {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      // Đăng xuất khỏi Firebase Authentication
      await firebaseService.signOut();
      
      // Xóa dữ liệu local
      localStorage.removeItem('firebase_user');
      localStorage.removeItem('firebase_auth_status');
      
      // Reset state
      setUser(null);
      setIsLoggedIn(false);
      
      // Chuyển về trang chủ
      router.push('/');
      
      console.log('Đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      
      // Nếu Firebase lỗi, vẫn xóa local data
      localStorage.removeItem('firebase_user');
      localStorage.removeItem('firebase_auth_status');
      setUser(null);
      setIsLoggedIn(false);
      router.push('/');
    }
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <a href="/" className="logo">
            <div className="logo-icon">
              <div className="logo-symbol">🏥</div>
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-primary">Hoang Linh</span>
              <span className="logo-secondary">Medicine</span>
            </div>
          </a>
        </div>
        
        <nav className="header-nav">
          <div className="nav-links">
            <a href="/" className="nav-link">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Trang chủ</span>
            </a>
            <a href="/bmi" className="nav-link">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Tính BMI</span>
            </a>
            {isLoggedIn && (
              <>
                <a href="/dashboard" className="nav-link">
                  <span className="nav-icon">📈</span>
                  <span className="nav-text">Dashboard</span>
                </a>
                <a href="/progress" className="nav-link">
                  <span className="nav-icon">🎯</span>
                  <span className="nav-text">Tiến độ</span>
                </a>
                <a href="/consultations" className="nav-link">
                  <span className="nav-icon">👨‍⚕️</span>
                  <span className="nav-text">Tư vấn</span>
                </a>
              </>
            )}
            <a href="/pricing" className="nav-link">
              <span className="nav-icon">💎</span>
              <span className="nav-text">Gói cước</span>
            </a>
            <a href="/contact" className="nav-link">
              <span className="nav-icon">📞</span>
              <span className="nav-text">Liên hệ</span>
            </a>
          </div>
        </nav>

        <div className="header-right">
          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  <div className="avatar-icon">👤</div>
                  <div className="avatar-status"></div>
                </div>
                <div className="user-details">
                  <span className="user-email">{user?.email}</span>
                  <span className="user-status">Đang hoạt động</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="/login" className="btn btn-outline">
                <span className="btn-icon">🔑</span>
                <span className="btn-text">Đăng nhập</span>
              </a>
              <a href="/onboarding" className="btn btn-primary">
                <span className="btn-icon">🚀</span>
                <span className="btn-text">Đăng ký</span>
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="header-decoration">
        <div className="decoration-dot decoration-dot-1"></div>
        <div className="decoration-dot decoration-dot-2"></div>
        <div className="decoration-dot decoration-dot-3"></div>
      </div>
    </header>
  );
}
