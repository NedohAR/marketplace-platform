import { create } from 'zustand'
import { ToastType } from '@/components/ui/Toast'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    const newToast: Toast = { id, message, type, duration }
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  success: (message, duration) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'success', duration }],
    }))
  },

  error: (message, duration) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'error', duration }],
    }))
  },

  info: (message, duration) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'info', duration }],
    }))
  },

  warning: (message, duration) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type: 'warning', duration }],
    }))
  },
}))
