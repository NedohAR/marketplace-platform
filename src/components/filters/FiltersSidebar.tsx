'use client'

import { useAdStore } from '@/store/useAdStore'
import { useMounted } from '@/hooks/useMounted'
import { FaTimes } from 'react-icons/fa'
import { AdCondition, DealType } from '@/types'
import QuickFilters from './QuickFilters'
import PriceFilter from './PriceFilter'
import LocationFilter from './LocationFilter'
import SortFilter from './SortFilter'
import CategoryFilter from './CategoryFilter'
import ConditionFilter from './ConditionFilter'
import DealTypeFilter from './DealTypeFilter'
import DateFilterGroup from './DateFilterGroup'

export default function FiltersSidebar() {
  const { filters, setFilters, categories, sortBy, setSortBy } = useAdStore()
  const mounted = useMounted()

  const clearFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      location: null,
      category: null,
      categories: [],
      condition: null,
      dealType: null,
      dateFilter: null,
      customDate: null,
    })
  }

  const hasActiveFilters =
    mounted &&
    (filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.location !== null ||
      filters.category !== null ||
      (filters.categories && filters.categories.length > 0) ||
      filters.condition !== null ||
      filters.dealType !== null ||
      (filters.dateFilter !== null && filters.dateFilter !== 'all') ||
      filters.customDate !== null)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters & Sort</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-orange-500 flex items-center gap-1"
            suppressHydrationWarning
          >
            <FaTimes />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-6">
        <QuickFilters
          dateFilter={filters.dateFilter}
          onFilterChange={(filter) => setFilters({ dateFilter: filter })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PriceFilter
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMinPriceChange={(price) => setFilters({ minPrice: price })}
            onMaxPriceChange={(price) => setFilters({ maxPrice: price })}
          />
          <LocationFilter
            location={filters.location}
            onLocationChange={(location) => setFilters({ location })}
          />
          <SortFilter sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategories={filters.categories || []}
          onCategoriesChange={(categories) => setFilters({ categories })}
        />

        <ConditionFilter
          condition={filters.condition as AdCondition | null}
          onConditionChange={(condition) =>
            setFilters({ condition: condition as string | null })
          }
        />

        <DealTypeFilter
          dealType={filters.dealType as DealType | null}
          onDealTypeChange={(dealType) =>
            setFilters({ dealType: dealType as string | null })
          }
        />

        <DateFilterGroup
          dateFilter={filters.dateFilter}
          customDate={filters.customDate}
          onDateFilterChange={(filter) => setFilters({ dateFilter: filter })}
          onCustomDateChange={(date) => setFilters({ customDate: date })}
        />
      </div>
    </div>
  )
}
