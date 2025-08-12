import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { useAuthStore } from '@/store/auth'

export interface Consultation {
  id: string
  userId: string
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  date: Date
  time: string
  duration: number // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  symptoms: string
  notes?: string
  price: number
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
  createdAt: Date
  updatedAt: Date
}

export interface CreateConsultationData {
  doctorName: string
  doctorSpecialty: string
  doctorImage: string
  date: string
  time: string
  duration: number
  symptoms: string
  notes?: string
  price: number
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
}

// Tạo lịch tư vấn mới
export const createConsultation = async (consultationData: CreateConsultationData): Promise<{ success: boolean; consultationId?: string; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập để đặt lịch tư vấn' }
    }

    const consultation = {
      userId: user.id,
      doctorName: consultationData.doctorName || '',
      doctorSpecialty: consultationData.doctorSpecialty || '',
      doctorImage: consultationData.doctorImage || '',
      date: new Date(consultationData.date),
      time: consultationData.time || '',
      duration: consultationData.duration || 30,
      status: 'pending',
      symptoms: consultationData.symptoms || '',
      notes: consultationData.notes || null,
      price: consultationData.price || 0,
      paymentStatus: 'pending',
      paymentMethod: consultationData.paymentMethod || 'cod',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'consultations'), consultation)
    
    return { 
      success: true, 
      consultationId: docRef.id, 
      message: 'Đặt lịch tư vấn thành công!' 
    }
  } catch (error) {
    console.error('Error creating consultation:', error)
    return { success: false, message: 'Có lỗi xảy ra khi đặt lịch tư vấn: ' + (error instanceof Error ? error.message : 'Lỗi không xác định') }
  }
}

// Lấy tất cả lịch tư vấn của user
export const getUserConsultations = async (): Promise<Consultation[]> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return []
    }

    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    )
    
    const consultationsSnapshot = await getDocs(q)
    const consultations: Consultation[] = []
    
    consultationsSnapshot.forEach((doc) => {
      const data = doc.data()
      consultations.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Consultation)
    })
    
    return consultations
  } catch (error) {
    console.error('Error fetching user consultations:', error)
    return []
  }
}

// Lấy lịch tư vấn theo ID
export const getConsultationById = async (consultationId: string): Promise<Consultation | null> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return null
    }

    const consultationDoc = await getDoc(doc(db, 'consultations', consultationId))
    
    if (!consultationDoc.exists()) {
      return null
    }

    const data = consultationDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return null
    }

    return {
      id: consultationDoc.id,
      ...data,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Consultation
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return null
  }
}

// Cập nhật trạng thái lịch tư vấn
export const updateConsultationStatus = async (consultationId: string, status: Consultation['status']): Promise<{ success: boolean; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập' }
    }

    const consultationDoc = await getDoc(doc(db, 'consultations', consultationId))
    
    if (!consultationDoc.exists()) {
      return { success: false, message: 'Không tìm thấy lịch tư vấn' }
    }

    const data = consultationDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return { success: false, message: 'Bạn không có quyền cập nhật lịch tư vấn này' }
    }

    await updateDoc(doc(db, 'consultations', consultationId), {
      status,
      updatedAt: new Date()
    })

    return { success: true, message: 'Cập nhật trạng thái thành công' }
  } catch (error) {
    console.error('Error updating consultation status:', error)
    return { success: false, message: 'Có lỗi xảy ra khi cập nhật' }
  }
}

// Hủy lịch tư vấn
export const cancelConsultation = async (consultationId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập' }
    }

    const consultationDoc = await getDoc(doc(db, 'consultations', consultationId))
    
    if (!consultationDoc.exists()) {
      return { success: false, message: 'Không tìm thấy lịch tư vấn' }
    }

    const data = consultationDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return { success: false, message: 'Bạn không có quyền hủy lịch tư vấn này' }
    }

    // Chỉ cho phép hủy lịch tư vấn đang pending
    if (data.status !== 'pending') {
      return { success: false, message: 'Chỉ có thể hủy lịch tư vấn đang chờ xác nhận' }
    }

    await updateDoc(doc(db, 'consultations', consultationId), {
      status: 'cancelled',
      updatedAt: new Date()
    })

    return { success: true, message: 'Hủy lịch tư vấn thành công' }
  } catch (error) {
    console.error('Error cancelling consultation:', error)
    return { success: false, message: 'Có lỗi xảy ra khi hủy lịch tư vấn' }
  }
}

// Lấy lịch tư vấn gần đây
export const getRecentConsultations = async (limitCount: number = 5): Promise<Consultation[]> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return []
    }

    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const consultationsSnapshot = await getDocs(q)
    const consultations: Consultation[] = []
    
    consultationsSnapshot.forEach((doc) => {
      const data = doc.data()
      consultations.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Consultation)
    })
    
    return consultations
  } catch (error) {
    console.error('Error fetching recent consultations:', error)
    return []
  }
} 