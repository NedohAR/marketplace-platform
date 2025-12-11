'use client'

import PageLayout from '@/components/layout/PageLayout'
import AdCard from '@/components/ads/AdCard'
import Filters from '@/components/filters/Filters'
import { useAdStore } from '@/store/useAdStore'
import { useMounted } from '@/hooks/useMounted'
import { useMemo } from 'react'
import { FaHeart } from 'react-icons/fa'

export default function FavoritesPage() {
  const { ads, favorites, getFilteredAndSortedAds, filters, sortBy } =
    useAdStore()
  const mounted = useMounted()

  const favoriteAds = useMemo(() => {
    const favoriteList = ads.filter((ad) => favorites.includes(ad.id))
    return getFilteredAndSortedAds(favoriteList)
  }, [ads, favorites, getFilteredAndSortedAds, filters, sortBy])

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          Favorites
        </h1>
        {mounted && (
          <p className="text-gray-600" suppressHydrationWarning>
            Saved ads: {favoriteAds.length}
          </p>
        )}
      </div>

      {!mounted ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : favoriteAds.length > 0 ? (
        <>
          <Filters />
          <div className="grid gap-4 mt-6" suppressHydrationWarning>
            {favoriteAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">
            You don&apos;t have any favorite ads yet
          </p>
          <p className="text-gray-500 text-sm">
            Click the heart icon to save ads you like
          </p>
        </div>
      )}
    </PageLayout>
  )
}
