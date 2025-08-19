import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginUser, registerUser, logoutUser, updateUserProfile, onAuthStateChange } from '@/lib/firebaseAuth'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const result = await loginUser(email, password)
          
          if (result.success && result.user) {
            // Cập nhật state ngay lập tức
            const newState = { user: result.user, isAuthenticated: true, isLoading: false }
            set(newState)
            
            // Đảm bảo localStorage được cập nhật đồng bộ
            const storageData = {
              state: newState,
              version: 0
            }
            localStorage.setItem('auth-storage', JSON.stringify(storageData))
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: 'Có lỗi xảy ra khi đăng nhập!' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        
        try {
          const result = await registerUser(userData.email, userData.password, {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: 'user'
          })
          
          if (result.success && result.user) {
            // Cập nhật state ngay lập tức
            const newState = { user: result.user, isAuthenticated: true, isLoading: false }
            set(newState)
            
            // Đảm bảo localStorage được cập nhật đồng bộ
            const storageData = {
              state: newState,
              version: 0
            }
            localStorage.setItem('auth-storage', JSON.stringify(storageData))
          } else {
            set({ isLoading: false })
          }
          
          return result
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: 'Có lỗi xảy ra khi đăng ký!' }
        }
      },

      logout: async () => {
        try {
          await logoutUser()
          set({ user: null, isAuthenticated: false })
        } catch (error) {
          console.error('Logout error:', error)
        }
      },

      updateProfile: async (userData) => {
        const currentUser = get().user
        if (currentUser) {
          try {
            const result = await updateUserProfile(currentUser.id, userData)
            if (result.success) {
              set({ user: { ...currentUser, ...userData } })
            }
            return result
          } catch (error) {
            return { success: false, message: 'Có lỗi xảy ra khi cập nhật!' }
          }
        }
        return { success: false, message: 'Không tìm thấy người dùng!' }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
) 