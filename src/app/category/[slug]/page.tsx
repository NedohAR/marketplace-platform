'use client'

import { useParams } from 'next/navigation'
import PageLayout from '@/components/layout/PageLayout'
import AdCard from '@/components/ads/AdCard'
import Filters from '@/components/filters/Filters'
import { useAdStore } from '@/store/useAdStore'
import { useMounted } from '@/hooks/useMounted'
import { CategoryPageParams } from '@/types'
import { useMemo, useEffect } from 'react'
import { getIcon } from '@/utils/icons'

export default function CategoryPage() {
  const params = useParams() as CategoryPageParams
  const slug = params.slug
  const {
    categories,
    getAdsByCategory,
    getFilteredAndSortedAds,
    setFilters,
    resetFilters,
    filters,
    sortBy,
  } = useAdStore()
  const mounted = useMounted()

  const category = categories.find((cat) => cat.slug === slug)
  const categoryAds = useMemo(() => {
    const ads = getAdsByCategory(slug)
    return getFilteredAndSortedAds(ads)
  }, [slug, getAdsByCategory, getFilteredAndSortedAds, filters, sortBy])

  useEffect(() => {
    setFilters({ category: slug })
  }, [slug, setFilters])

  const IconComponent = category ? getIcon(category.iconName) : null

  return (
    <PageLayout onBack={resetFilters}>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          {category && IconComponent ? (
            <>
              <span className="text-4xl text-orange-500">
                <IconComponent />
              </span>
              {category.name}
            </>
          ) : (
            'Category not found'
          )}
        </h1>
        {mounted && (
          <p className="text-gray-600" suppressHydrationWarning>
            Found ads: {categoryAds.length}
          </p>
        )}
      </div>

      <Filters />

      {!mounted ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      ) : categoryAds.length > 0 ? (
        <div className="grid gap-4" suppressHydrationWarning>
          {categoryAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No ads in this category yet</p>
        </div>
      )}
    </PageLayout>
  )
}
