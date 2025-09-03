'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import firebaseService from '../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await firebaseService.signInWithEmailAndPassword(email, password);
      
      if (result.user) {
        // Store user data in localStorage
        localStorage.setItem('firebase_user', JSON.stringify(result.user));
        localStorage.setItem('firebase_auth_status', 'logged_in');
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-background">
      <div className="page-container">
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
<<<<<<< HEAD
=======
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
                disabled={isLoading}
              >
                {isLoading ? '⏳ Đang đăng nhập...' : '🔐 Đăng nhập'}
              </button>
            </form>

            <div className="login-footer">
              <p>Chưa có tài khoản? <a href="/onboarding" className="link-primary">Đăng ký ngay</a></p>
              <p><a href="/forgot-password" className="link-secondary">Quên mật khẩu?</a></p>
>>>>>>> e644bc1922005351acfe2849798171ec429fe851
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
