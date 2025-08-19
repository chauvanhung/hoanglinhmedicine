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
      console.error('User not authenticated when creating consultation')
      return { success: false, message: 'Bạn cần đăng nhập để đặt lịch tư vấn' }
    }

    console.log('Creating consultation for user:', user.id, 'with data:', consultationData)

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
    
    console.log('Consultation created successfully with ID:', docRef.id)
    
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

// Tạo dữ liệu test cho consultation (chỉ dùng để debug)
export const createTestConsultation = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập' }
    }

    const testConsultation = {
      userId: user.id,
      doctorName: "Bác sĩ Nguyễn Văn An",
      doctorSpecialty: "Tim mạch",
      doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      date: new Date("2024-01-15"),
      time: "09:00",
      duration: 30,
      status: "completed",
      symptoms: "Đau ngực, khó thở khi vận động",
      notes: "Bệnh nhân cần theo dõi huyết áp thường xuyên",
      price: 500000,
      paymentStatus: "paid",
      paymentMethod: "bank_transfer",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-15")
    }

    const docRef = await addDoc(collection(db, 'consultations'), testConsultation)
    
    return { 
      success: true, 
      message: 'Đã tạo dữ liệu test thành công!' 
    }
  } catch (error) {
    console.error('Error creating test consultation:', error)
    return { success: false, message: 'Có lỗi xảy ra khi tạo dữ liệu test' }
  }
}

// Lấy tất cả lịch tư vấn của user
export const getUserConsultations = async (): Promise<Consultation[]> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      console.warn('User not authenticated when fetching consultations')
      return []
    }

    console.log('Fetching consultations for user:', user.id)

    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    )
    
    const consultationsSnapshot = await getDocs(q)
    const consultations: Consultation[] = []
    
    console.log('Found', consultationsSnapshot.size, 'consultations for user:', user.id)
    
    consultationsSnapshot.forEach((doc) => {
      try {
        const data = doc.data()
        console.log('Processing consultation document:', doc.id, data)
        
        // Handle Firestore Timestamp conversion
        const consultation: Consultation = {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as Consultation
        
        consultations.push(consultation)
      } catch (docError) {
        console.error('Error processing consultation document:', doc.id, docError)
      }
    })
    
    console.log('Successfully processed', consultations.length, 'consultations')
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
      console.warn('User not authenticated when fetching consultation by ID')
      return null
    }

    console.log('Fetching consultation by ID:', consultationId, 'for user:', user.id)

    const consultationDoc = await getDoc(doc(db, 'consultations', consultationId))
    
    if (!consultationDoc.exists()) {
      console.log('Consultation not found:', consultationId)
      return null
    }

    const data = consultationDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      console.warn('User', user.id, 'tried to access consultation', consultationId, 'belonging to user', data.userId)
      return null
    }

    const consultation: Consultation = {
      id: consultationDoc.id,
      ...data,
      date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
    } as Consultation

    console.log('Successfully fetched consultation:', consultation)
    return consultation
  } catch (error) {
    console.error('Error fetching consultation by ID:', error)
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
      console.warn('User not authenticated when fetching recent consultations')
      return []
    }

    console.log('Fetching recent consultations for user:', user.id, 'limit:', limitCount)

    const q = query(
      collection(db, 'consultations'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const consultationsSnapshot = await getDocs(q)
    const consultations: Consultation[] = []
    
    console.log('Found', consultationsSnapshot.size, 'recent consultations')
    
    consultationsSnapshot.forEach((doc) => {
      try {
        const data = doc.data()
        const consultation: Consultation = {
          id: doc.id,
          ...data,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as Consultation
        
        consultations.push(consultation)
      } catch (docError) {
        console.error('Error processing recent consultation document:', doc.id, docError)
      }
    })
    
    console.log('Successfully processed', consultations.length, 'recent consultations')
    return consultations
  } catch (error) {
    console.error('Error fetching recent consultations:', error)
    return []
  }
} 