export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  price: number
  quantity: number
  total: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
  }
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  estimatedDelivery?: Date
  trackingNumber?: string
}

export interface CreateOrderData {
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'cod' | 'bank_transfer' | 'momo' | 'vnpay'
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    district: string
    ward: string
  }
  notes?: string | null
} 