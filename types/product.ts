export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  prescription: boolean
  manufacturer?: string
  origin?: string
  expiry?: string
  dosage?: string
  ingredients?: string
  sideEffects?: string
  contraindications?: string
  storage?: string
  packaging?: string
  usage?: string
  target?: string
  benefits?: string[]
  reviews?: Array<{
    user: string
    rating: number
    comment: string
  }>
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