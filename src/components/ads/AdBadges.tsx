'use client'

import { AdCondition, DealType } from '@/types'
import { FaTag, FaHandshake } from 'react-icons/fa'

interface AdBadgesProps {
  condition?: AdCondition
  dealType?: DealType
  className?: string
  size?: 'sm' | 'md'
}

const conditionLabels: Record<AdCondition, string> = {
  new: 'New',
  used: 'Used',
  'for-parts': 'For Parts',
  'needs-repair': 'Needs Repair',
}

const dealTypeLabels: Record<DealType, string> = {
  sell: 'Sell',
  buy: 'Buy',
  exchange: 'Exchange',
  rent: 'Rent',
  free: 'Free',
}

const conditionColors: Record<AdCondition, string> = {
  new: 'bg-green-100 text-green-700 border-green-300',
  used: 'bg-blue-100 text-blue-700 border-blue-300',
  'for-parts': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'needs-repair': 'bg-red-100 text-red-700 border-red-300',
}

const dealTypeColors: Record<DealType, string> = {
  sell: 'bg-orange-100 text-orange-700 border-orange-300',
  buy: 'bg-purple-100 text-purple-700 border-purple-300',
  exchange: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  rent: 'bg-teal-100 text-teal-700 border-teal-300',
  free: 'bg-gray-100 text-gray-700 border-gray-300',
}

export default function AdBadges({
  condition,
  dealType,
  className = '',
  size = 'sm',
}: AdBadgesProps) {
  if (!condition && !dealType) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {condition && (
        <span
          className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full border font-medium ${conditionColors[condition]}`}
          aria-label={`Condition: ${conditionLabels[condition]}`}
        >
          <FaTag className="text-xs" />
          {conditionLabels[condition]}
        </span>
      )}
      {dealType && (
        <span
          className={`inline-flex items-center gap-1 ${sizeClasses[size]} rounded-full border font-medium ${dealTypeColors[dealType]}`}
          aria-label={`Deal type: ${dealTypeLabels[dealType]}`}
        >
          <FaHandshake className="text-xs" />
          {dealTypeLabels[dealType]}
        </span>
      )}
    </div>
  )
}
