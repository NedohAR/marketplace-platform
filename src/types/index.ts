export interface Category {
  id: string
  name: string
  iconName: string
  slug: string
}

export type AdCondition = 'new' | 'used' | 'for-parts' | 'needs-repair'
export type DealType = 'sell' | 'buy' | 'exchange' | 'rent' | 'free'

export interface Ad {
  id: string
  title: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  location: string
  date: string
  views: number
  userId: string
  userName: string
  status?: 'active' | 'archived' | 'sold'
  promoted?: boolean
  condition?: AdCondition
  dealType?: DealType
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: string
  location?: string
}

export interface UserSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  newMessageNotifications: boolean
  priceChangeNotifications: boolean
}

export interface Activity {
  id: string
  userId: string
  type:
    | 'ad_created'
    | 'ad_updated'
    | 'ad_archived'
    | 'ad_sold'
    | 'message_received'
    | 'favorite_added'
  description: string
  date: string
  adId?: string
}

export interface Message {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  adId?: string
  adTitle?: string
  content: string
  date: string
  read: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AdFormData {
  title: string
  description: string
  price: string
  category: string
  location: string
  image: string
  images?: string[]
  condition?: AdCondition
  dealType?: DealType
}

export interface ProfileFormData {
  name: string
  email: string
  phone: string
  location: string
}

export type AdPageParams = {
  id: string
}

export type CategoryPageParams = {
  slug: string
}

export type EditAdPageParams = {
  id: string
}
