// Экспорт auth, signIn, signOut для использования в других частях приложения
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-config'

export const { auth, signIn, signOut } = NextAuth(authConfig)
