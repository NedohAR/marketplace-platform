'use client'

import { memo } from 'react'
import { Ad } from '@/types'
import BaseAdCard from './BaseAdCard'

interface PromotedAdCardProps {
  ad: Ad
}

function PromotedAdCard({ ad }: PromotedAdCardProps) {
  return (
    <BaseAdCard
      ad={ad}
      variant="promoted"
      showFavorite={false}
      showViews={false}
      showDescription={false}
      showBadges={true}
    />
  )
}

export default memo(PromotedAdCard)
