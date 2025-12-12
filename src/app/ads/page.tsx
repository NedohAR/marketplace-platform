'use client'

import PageLayout from '@/components/layout/PageLayout'
import AdCard from '@/components/ads/AdCard'
import FiltersSidebar from '@/components/filters/FiltersSidebar'
import { useAdStore } from '@/store/useAdStore'
import { useMounted } from '@/hooks/useMounted'
import { useMemo, useEffect } from 'react'

export default function AllAdsPage() {
  const { ads, filters, sortBy, getFilteredAndSortedAds, loadAds } =
    useAdStore()
  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      loadAds()
    }
  }, [mounted, loadAds])

  const filteredAds = useMemo(() => {
    let result = ads.filter(
      (ad) => (!ad.status || ad.status === 'active') && !ad.promoted
    )

    result = getFilteredAndSortedAds(result)

    return result
  }, [ads, filters, sortBy, getFilteredAndSortedAds])

  return (
    <PageLayout>
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          All Ads
        </h1>
        {mounted && (
          <p
            className="text-sm sm:text-base text-gray-600"
            suppressHydrationWarning
          >
            Found: {filteredAds.length}
          </p>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <FiltersSidebar />

        <div>
          {!mounted ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          ) : filteredAds.length > 0 ? (
            <div className="grid gap-4" suppressHydrationWarning>
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">Ads will appear soon</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
