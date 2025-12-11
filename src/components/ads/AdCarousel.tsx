'use client'

import { memo } from 'react'
import { Ad } from '@/types'
import CompactAdCard from './CompactAdCard'

interface AdCarouselProps {
  ads: Ad[]
  title: string
  className?: string
  cardWidth?: string
}

function AdCarousel({
  ads,
  title,
  className = '',
  cardWidth = 'w-56',
}: AdCarouselProps) {
  if (ads.length === 0) return null

  return (
    <div className={`mt-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {ads.map((ad) => (
          <div key={ad.id} className={`flex-shrink-0 ${cardWidth}`}>
            <CompactAdCard ad={ad} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(AdCarousel)
