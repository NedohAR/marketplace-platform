'use client'

import { Ad } from '@/types'
import AdCarousel from './AdCarousel'

interface RelatedAdsProps {
  ads: Ad[]
  title?: string
}

export default function RelatedAds({
  ads,
  title = 'See also',
}: RelatedAdsProps) {
  return <AdCarousel ads={ads} title={title} />
}
