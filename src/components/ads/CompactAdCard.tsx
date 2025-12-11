'use client'

import { memo } from 'react'
import { Ad } from '@/types'
import BaseAdCard from './BaseAdCard'

interface CompactAdCardProps {
  ad: Ad
}

function CompactAdCard({ ad }: CompactAdCardProps) {
  return (
    <BaseAdCard
      ad={ad}
      variant="compact"
      showFavorite={true}
      showViews={false}
      showDescription={false}
      showBadges={true}
    />
  )
}

export default memo(CompactAdCard)
