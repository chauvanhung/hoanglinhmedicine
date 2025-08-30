'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì chuyển đến dashboard
    const checkExistingLogin = () => {
      const storedUser = localStorage.getItem('firebase_user');
      const authStatus = localStorage.getItem('firebase_auth_status');
      
      if (storedUser && authStatus === 'logged_in') {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData.email) {
            console.log('Đã đăng nhập, chuyển đến dashboard');
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra user data:', error);
          localStorage.removeItem('firebase_user');
          localStorage.removeItem('firebase_auth_status');
        }
      }
    };

    checkExistingLogin();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Đăng nhập với Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Lưu thông tin user vào localStorage
      localStorage.setItem('firebase_user', JSON.stringify(user));
      localStorage.setItem('firebase_auth_status', 'logged_in');
      
      console.log('Đăng nhập thành công:', user.email);
      
      // Chuyển đến dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      
      let errorMessage = 'Đăng nhập thất bại';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Tài khoản không tồn tại';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mật khẩu không đúng';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email không hợp lệ';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau';
      } else if (error.code === 'auth/api-key-not-valid') {
        errorMessage = 'Lỗi cấu hình Firebase. Vui lòng liên hệ admin';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <a href="/" className="back-link">← Quay lại trang chủ</a>
          <h1>🔐 Đăng nhập</h1>
          <p>Đăng nhập vào tài khoản của bạn để tiếp tục hành trình giảm cân</p>
        </div>
      </header>

      {/* Login Form */}
      <section className="login-section">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">🔐</div>
              <h2>Đăng nhập</h2>
              <p>Nhập thông tin đăng nhập của bạn</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-message">
                <div className="error-container">
                  <span className="error-icon">⚠️</span>
                  <span className="error-text">{error}</span>
                </div>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng nhập'}
              </button>
            </form>

            <div className="login-footer">
              <p>Chưa có tài khoản? <a href="/onboarding" className="link-primary">Đăng ký ngay</a></p>
              <p><a href="/forgot-password" className="link-secondary">Quên mật khẩu?</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
