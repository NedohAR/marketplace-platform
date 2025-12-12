// Хелперы для работы с NextAuth
// Обеспечивают совместимость с существующим кодом

import { auth } from '@/lib/auth-helpers'

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
