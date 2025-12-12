'use client'

import AuthLayout from '@/components/layout/AuthLayout'
import FormInput from '@/components/forms/FormInput'
import { LoginFormData } from '@/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/profile')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Sign in to your account to access your profile"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="email"
          label="Email"
          icon="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@email.com"
        />

        <FormInput
          type="password"
          label="Password"
          icon="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
