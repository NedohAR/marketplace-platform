'use client'

import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

interface BackButtonProps {
  className?: string
  label?: string
  onBack?: () => void
}

export default function BackButton({
  className = '',
  label = 'Back',
  onBack,
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
    router.back()
  }

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-100 ${className}`}
    >
      <FaArrowLeft />
      <span>{label}</span>
    </button>
  )
}
