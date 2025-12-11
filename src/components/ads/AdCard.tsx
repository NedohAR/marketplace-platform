'use client'

import { memo } from 'react'
import { Ad } from '@/types'
import BaseAdCard from './BaseAdCard'

interface AdCardProps {
  ad: Ad
}

function AdCard({ ad }: AdCardProps) {
  return (
    <BaseAdCard
      ad={ad}
      variant="default"
      showFavorite={true}
      showViews={true}
      showDescription={true}
      showBadges={true}
    />
  )
}

export default memo(AdCard)
