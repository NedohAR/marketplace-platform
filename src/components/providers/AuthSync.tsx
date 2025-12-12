'use client'

import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

// Компонент для синхронизации NextAuth сессии с Zustand store
export default function AuthSync() {
  const { data: session, status } = useSession()
  const syncWithNextAuth = useAuthStore((state) => state.syncWithNextAuth)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      syncWithNextAuth(session)
    } else if (status === 'unauthenticated') {
      syncWithNextAuth(null)
    }
  }, [session, status, syncWithNextAuth])

  return null
}
