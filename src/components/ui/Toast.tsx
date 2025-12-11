'use client'

import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id)
      }, toast.duration || 3000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onClose])

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle,
  }

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={`${colors[toast.type]} rounded-lg shadow-lg p-4 mb-3 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in-right`}
    >
      <Icon className="text-xl flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

