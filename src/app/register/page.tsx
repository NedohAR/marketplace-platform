'use client'

import AuthLayout from '@/components/layout/AuthLayout'
import FormInput from '@/components/forms/FormInput'
import { useAuthStore } from '@/store/useAuthStore'
import { RegisterFormData } from '@/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore((state) => state.register)
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.name
      )
      if (success) {
        router.push('/profile')
      } else {
        setError('Registration error')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title="Sign Up" subtitle="Create an account to post ads">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="text"
          label="Name"
          icon="user"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Your name"
        />

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
          placeholder="Minimum 6 characters"
        />

        <FormInput
          type="password"
          label="Confirm Password"
          icon="password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Repeat password"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
