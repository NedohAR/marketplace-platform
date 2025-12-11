'use client'

import { useToastStore } from '@/store/useToastStore'
import ToastContainer from './Toast'

export default function ToastProvider() {
  const { toasts, removeToast } = useToastStore()

  return <ToastContainer toasts={toasts} onClose={removeToast} />
}

