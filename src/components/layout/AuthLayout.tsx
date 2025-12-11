import { ReactNode } from 'react'
import Header from './Header'
import BackButton from './BackButton'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        {showBackButton && (
          <div className="mb-6">
            <BackButton />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  )
}
