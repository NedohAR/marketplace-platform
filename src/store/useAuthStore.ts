import { create } from 'zustand'
import { User, UserSettings, Activity } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  settings: UserSettings
  activities: Activity[]
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updateSettings: (settings: Partial<UserSettings>) => void
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void
  getActivities: () => Activity[]
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  newMessageNotifications: true,
  priceChangeNotifications: false,
}

const loadFromStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return null
}

const saveToStorage = (state: Partial<AuthStore>) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('auth-storage', JSON.stringify(state))
  } catch (e) {}
}

const stored = loadFromStorage()

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: stored?.user || null,
  isAuthenticated: stored?.isAuthenticated || false,
  settings: stored?.settings || defaultSettings,
  activities: stored?.activities || [],

  login: async (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          phone: '+380501234567',
          createdAt: new Date().toISOString(),
          location: 'Киев',
        }
        const state = { user, isAuthenticated: true }
        set(state)
        saveToStorage({ ...get(), ...state })
        get().addActivity({
          userId: user.id,
          type: 'ad_created',
          description: 'Вход в систему',
        })
        resolve(true)
      }, 500)
    })
  },

  register: async (email: string, password: string, name: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          email,
          name,
          createdAt: new Date().toISOString(),
          location: 'Киев',
        }
        const state = { user, isAuthenticated: true }
        set(state)
        saveToStorage({ ...get(), ...state })
        get().addActivity({
          userId: user.id,
          type: 'ad_created',
          description: 'Регистрация в системе',
        })
        resolve(true)
      }, 500)
    })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
    saveToStorage({ ...get(), user: null, isAuthenticated: false })
  },

  updateProfile: (data) => {
    const { user } = get()
    if (user) {
      const updatedUser = { ...user, ...data }
      set({ user: updatedUser })
      saveToStorage({ ...get(), user: updatedUser })
      get().addActivity({
        userId: user.id,
        type: 'ad_updated',
        description: 'Обновлен профиль',
      })
    }
  },

  updateSettings: (settings) => {
    const newSettings = { ...get().settings, ...settings }
    set({ settings: newSettings })
    saveToStorage({ ...get(), settings: newSettings })
  },

  addActivity: (activity) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    const activities = [newActivity, ...get().activities].slice(0, 50)
    set({ activities })
    saveToStorage({ ...get(), activities })
  },

  getActivities: () => {
    const { user, activities } = get()
    if (!user) return []
    return activities.filter((activity) => activity.userId === user.id)
  },
}))
