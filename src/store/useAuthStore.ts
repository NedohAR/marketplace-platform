'use client'

import { create } from 'zustand'
import { User, UserSettings, Activity } from '@/types'

interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  phone?: string
  location?: string
  createdAt: string
}

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
  syncWithNextAuth: (session: any) => void
}

const defaultSettings: UserSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  newMessageNotifications: true,
  priceChangeNotifications: false,
}

const loadUsersFromStorage = (): StoredUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('users-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return []
}

const saveUsersToStorage = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('users-storage', JSON.stringify(users))
  } catch (e) {}
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

  syncWithNextAuth: (session) => {
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        createdAt: stored?.user?.createdAt || new Date().toISOString(),
        location: stored?.user?.location || 'Киев',
        phone: stored?.user?.phone,
      }
      set({ user, isAuthenticated: true })
      saveToStorage({ ...get(), user, isAuthenticated: true })
      
    } else {
      set({ user: null, isAuthenticated: false })
      saveToStorage({ ...get(), user: null, isAuthenticated: false })
      
      if (typeof window !== 'undefined') {
        const { useAdStore } = require('@/store/useAdStore')
        useAdStore.getState().loadFavoritesForUser('')
      }
    }
  },

  login: async (email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = loadUsersFromStorage()
        const storedUser = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        )

        if (storedUser) {
          const user: User = {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            phone: storedUser.phone,
            createdAt: storedUser.createdAt,
            location: storedUser.location || 'Киев',
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
        } else {
          resolve(false)
        }
      }, 500)
    })
  },

  register: async (email: string, password: string, name: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = loadUsersFromStorage()
        const existingUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )

        if (existingUser) {
          resolve(false)
          return
        }

        const newUser: StoredUser = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
          email,
          password,
          name,
          createdAt: new Date().toISOString(),
          location: 'Киев',
        }

        const updatedUsers = [...users, newUser]
        saveUsersToStorage(updatedUsers)

        const user: User = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          createdAt: newUser.createdAt,
          location: newUser.location || 'Киев',
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
    if (typeof window !== 'undefined') {
      import('next-auth/react').then(({ signOut }) => {
        signOut({ callbackUrl: '/' })
      })
    }
  },

  updateProfile: (data) => {
    const { user } = get()
    if (user) {
      const updatedUser = { ...user, ...data }
      set({ user: updatedUser })
      saveToStorage({ ...get(), user: updatedUser })

      if (typeof window !== 'undefined') {
        const users = loadUsersFromStorage()
        const userIndex = users.findIndex((u) => u.id === user.id)
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            name: updatedUser.name || users[userIndex].name,
            phone: updatedUser.phone || users[userIndex].phone,
            location: updatedUser.location || users[userIndex].location,
          }
          saveUsersToStorage(users)
        }
      }

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
