'use client'

import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdStore } from '@/store/useAdStore'
import { useEffect } from 'react'

export default function AuthSync() {
  const { data: session, status } = useSession()
  const syncWithNextAuth = useAuthStore((state) => state.syncWithNextAuth)
  const loadFavoritesForUser = useAdStore((state) => state.loadFavoritesForUser)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (status === 'authenticated' && session) {
      syncWithNextAuth(session)
    } else if (status === 'unauthenticated') {
      syncWithNextAuth(null)
      loadFavoritesForUser('')
    }
  }, [session, status, syncWithNextAuth, loadFavoritesForUser])

  useEffect(() => {
    if (user?.id) {
      loadFavoritesForUser(user.id)
    } else {
      loadFavoritesForUser('')
    }
  }, [user?.id, loadFavoritesForUser])

  return null
}
