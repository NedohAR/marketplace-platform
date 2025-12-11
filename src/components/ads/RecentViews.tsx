'use client'

import { Ad } from '@/types'
import AdCarousel from './AdCarousel'

interface RecentViewsProps {
  ads: Ad[]
}

export default function RecentViews({ ads }: RecentViewsProps) {
  return <AdCarousel ads={ads} title="Recently Viewed" />
}
