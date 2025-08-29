'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { initializeFirebase, signInUser } = await import('../../lib/firebase.js')
      await initializeFirebase()
      const { user } = await signInUser(email, password)
      
      // Set authentication status
      localStorage.setItem('firebase_user', JSON.stringify(user))
      localStorage.setItem('firebase_auth_status', 'logged_in')
      
      alert('🎉 Đăng nhập thành công! Bạn sẽ được chuyển đến dashboard.')
      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Đăng nhập thất bại, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

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

            <form className="login-form" onSubmit={handleLogin}>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
