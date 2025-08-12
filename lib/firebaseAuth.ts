import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/store/auth'

export interface UserData {
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

// Đăng ký người dùng mới
export const registerUser = async (email: string, password: string, userData: Omit<UserData, 'createdAt' | 'updatedAt'>) => {
  try {
    // Tạo tài khoản Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Cập nhật display name
    await updateProfile(user, {
      displayName: userData.name
    })

    // Lưu thông tin người dùng vào Firestore
    const userDoc = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', user.uid), userDoc)

    return {
      success: true,
      message: 'Đăng ký thành công!',
      user: {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role
      }
    }
  } catch (error: any) {
    let message = 'Có lỗi xảy ra khi đăng ký!'
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email đã được sử dụng!'
        break
      case 'auth/weak-password':
        message = 'Mật khẩu quá yếu!'
        break
      case 'auth/invalid-email':
        message = 'Email không hợp lệ!'
        break
    }

    return {
      success: false,
      message
    }
  }
}

// Đăng nhập
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Lấy thông tin người dùng từ Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData
      
      return {
        success: true,
        message: 'Đăng nhập thành công!',
        user: {
          id: user.uid,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        }
      }
    } else {
      return {
        success: false,
        message: 'Không tìm thấy thông tin người dùng!'
      }
    }
  } catch (error: any) {
    let message = 'Có lỗi xảy ra khi đăng nhập!'
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Email không tồn tại!'
        break
      case 'auth/wrong-password':
        message = 'Mật khẩu không đúng!'
        break
      case 'auth/invalid-email':
        message = 'Email không hợp lệ!'
        break
    }

    return {
      success: false,
      message
    }
  }
}

// Đăng xuất
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true, message: 'Đăng xuất thành công!' }
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi đăng xuất!' }
  }
}

// Cập nhật thông tin người dùng
export const updateUserProfile = async (userId: string, userData: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    })

    // Cập nhật display name trong Firebase Auth nếu có thay đổi name
    if (userData.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: userData.name
      })
    }

    return { success: true, message: 'Cập nhật thành công!' }
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra khi cập nhật!' }
  }
}

// Lắng nghe trạng thái đăng nhập
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Lấy thông tin người dùng từ Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData
        callback({
          id: firebaseUser.uid,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role
        })
      } else {
        callback(null)
      }
    } else {
      callback(null)
    }
  })
} 