'use client'

import PageLayout from '@/components/layout/PageLayout'
import CategoryCard from '@/components/categories/CategoryCard'
import AdCard from '@/components/ads/AdCard'
import PromotedAdCard from '@/components/ads/PromotedAdCard'
import Filters from '@/components/filters/Filters'
import RecentViews from '@/components/ads/RecentViews'
import { useAdStore } from '@/store/useAdStore'
import { useMounted } from '@/hooks/useMounted'
import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Ad } from '@/types'

export default function Home() {
  const {
    categories,
    ads,
    searchQuery,
    filters,
    sortBy,
    getFilteredAndSortedAds,
    getRecentViews,
  } = useAdStore()
  const mounted = useMounted()
  const [recentViews, setRecentViews] = useState<Ad[]>([])

  useEffect(() => {
    if (mounted) {
      setRecentViews(getRecentViews(5))
    }
  }, [mounted, getRecentViews])

  const promotedAds = useMemo(() => {
    if (!mounted) return []
    const promoted = ads.filter(
      (ad) => ad.promoted === true && (!ad.status || ad.status === 'active')
    )
    return promoted.slice(0, 8)
  }, [ads, mounted])

  const filteredAds = useMemo(() => {
    let result = ads.filter(
      (ad) => (!ad.status || ad.status === 'active') && !ad.promoted
    )

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      result = result.filter(
        (ad) =>
          ad.title.toLowerCase().includes(query) ||
          ad.description.toLowerCase().includes(query)
      )
    }

    result = getFilteredAndSortedAds(result)

    if (!searchQuery) {
      return result.slice(0, 12)
    }

    return result
  }, [ads, searchQuery, filters, sortBy, getFilteredAndSortedAds])

  return (
    <PageLayout showBackButton={false}>
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {!searchQuery && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Promoted Ads
          </h2>
          {mounted && promotedAds.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {promotedAds.map((ad) => (
                <PromotedAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : mounted ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">No promoted ads yet</p>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}
        </section>
      )}

      {!searchQuery && (
        <section className="mb-12">
          <div className="flex justify-center">
            <Link
              href="/ads"
              className="px-8 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg inline-block"
            >
              Show All Ads
            </Link>
          </div>
        </section>
      )}

      {searchQuery && searchQuery.trim() && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Search Results</h2>
            {mounted && (
              <span className="text-gray-600" suppressHydrationWarning>
                Found: {filteredAds.length}
              </span>
            )}
          </div>

          <Filters />

          {!mounted ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          ) : filteredAds.length > 0 ? (
            <>
              <div className="grid gap-4" suppressHydrationWarning>
                {filteredAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">
                Nothing found. Try changing filters.
              </p>
            </div>
          )}
        </section>
      )}

      {!searchQuery && mounted && recentViews.length > 0 && (
        <RecentViews ads={recentViews} />
      )}
    </PageLayout>
  )
}
