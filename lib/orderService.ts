import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from './firebase'
import { Order, CreateOrderData, OrderItem } from '@/types/order'
import { useAuthStore } from '@/store/auth'

// Tạo đơn hàng mới
export const createOrder = async (orderData: CreateOrderData): Promise<{ success: boolean; orderId?: string; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    console.log('Current user:', user)
    console.log('User ID:', user?.id)
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập để tạo đơn hàng' }
    }

    // Clean up data to avoid undefined values
    const cleanOrderData = {
      userId: user.id,
      items: orderData.items.map(item => ({
        productId: item.productId || '',
        productName: item.productName || '',
        productImage: item.productImage || '',
        price: item.price || 0,
        quantity: item.quantity || 0,
        total: item.total || 0
      })),
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      paymentStatus: 'pending', // Luôn để pending cho tất cả payment methods
      paymentMethod: orderData.paymentMethod || 'cod',
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName || '',
        phone: orderData.shippingAddress.phone || '',
        address: orderData.shippingAddress.address || '',
        city: orderData.shippingAddress.city || '',
        district: orderData.shippingAddress.district || '',
        ward: orderData.shippingAddress.ward || ''
      },
      notes: orderData.notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('Creating order:', cleanOrderData)
    const docRef = await addDoc(collection(db, 'orders'), cleanOrderData)
    console.log('Order created with ID:', docRef.id)
    
    return { 
      success: true, 
      orderId: docRef.id, 
      message: 'Đơn hàng đã được tạo thành công!' 
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, message: 'Có lỗi xảy ra khi tạo đơn hàng: ' + (error instanceof Error ? error.message : 'Lỗi không xác định') }
  }
}

// Lấy tất cả đơn hàng của user
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const { user } = useAuthStore.getState()
    
    console.log('Getting orders for user:', user?.id)
    
    if (!user) {
      console.log('No user found')
      return []
    }

    // Tạm thời không sử dụng orderBy để test
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.id)
    )
    
    console.log('Query created, fetching orders...')
    const ordersSnapshot = await getDocs(q)
    console.log('Orders snapshot size:', ordersSnapshot.size)
    
    const orders: Order[] = []
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data()
      console.log('Order data:', { id: doc.id, userId: data.userId, status: data.status })
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        estimatedDelivery: data.estimatedDelivery?.toDate()
      } as Order)
    })
    
    // Sort manually
    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    console.log('Returning orders:', orders.length)
    return orders
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

// Lấy đơn hàng theo ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return null
    }

    const orderDoc = await getDoc(doc(db, 'orders', orderId))
    
    if (!orderDoc.exists()) {
      return null
    }

    const data = orderDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return null
    }

    return {
      id: orderDoc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      estimatedDelivery: data.estimatedDelivery?.toDate()
    } as Order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<{ success: boolean; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập' }
    }

    const orderDoc = await getDoc(doc(db, 'orders', orderId))
    
    if (!orderDoc.exists()) {
      return { success: false, message: 'Không tìm thấy đơn hàng' }
    }

    const data = orderDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return { success: false, message: 'Bạn không có quyền cập nhật đơn hàng này' }
    }

    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date()
    })

    return { success: true, message: 'Cập nhật trạng thái thành công' }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { success: false, message: 'Có lỗi xảy ra khi cập nhật' }
  }
}

// Hủy đơn hàng
export const cancelOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return { success: false, message: 'Bạn cần đăng nhập' }
    }

    const orderDoc = await getDoc(doc(db, 'orders', orderId))
    
    if (!orderDoc.exists()) {
      return { success: false, message: 'Không tìm thấy đơn hàng' }
    }

    const data = orderDoc.data()
    
    // Kiểm tra quyền truy cập
    if (data.userId !== user.id) {
      return { success: false, message: 'Bạn không có quyền hủy đơn hàng này' }
    }

    // Chỉ cho phép hủy đơn hàng đang pending
    if (data.status !== 'pending') {
      return { success: false, message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý' }
    }

    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      updatedAt: new Date()
    })

    return { success: true, message: 'Hủy đơn hàng thành công' }
  } catch (error) {
    console.error('Error cancelling order:', error)
    return { success: false, message: 'Có lỗi xảy ra khi hủy đơn hàng' }
  }
}

// Lấy đơn hàng gần đây
export const getRecentOrders = async (limitCount: number = 5): Promise<Order[]> => {
  try {
    const { user } = useAuthStore.getState()
    
    if (!user) {
      return []
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const ordersSnapshot = await getDocs(q)
    const orders: Order[] = []
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data()
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        estimatedDelivery: data.estimatedDelivery?.toDate()
      } as Order)
    })
    
    return orders
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return []
  }
} 