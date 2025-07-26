export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  prescription: boolean
  dosage?: string
  sideEffects?: string[]
  ingredients?: string[]
  manufacturer?: string
  expiryDate?: string
  requiresPrescription?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  shippingAddress: Address
  paymentMethod: string
}

export interface Address {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  ward: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  addresses?: Address[]
  orders?: Order[]
} 