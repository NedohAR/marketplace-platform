'use client'

import { ReactNode } from 'react'
import Header from './Header'
import BackButton from './BackButton'

interface PageLayoutProps {
  children: ReactNode
  showBackButton?: boolean
  onBack?: () => void
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-full',
}

export default function PageLayout({
  children,
  showBackButton = true,
  onBack,
  maxWidth = 'full',
  className = '',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main
        className={`container mx-auto px-4 py-8 pt-24 ${maxWidthClasses[maxWidth]} ${className}`}
      >
        {showBackButton && (
          <div className="mb-6">
            <BackButton onBack={onBack} />
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
