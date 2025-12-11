'use client'

import { FaBolt } from 'react-icons/fa'
import { DateFilter } from '@/store/useAdStore'

interface QuickFiltersProps {
  dateFilter: DateFilter | null
  onFilterChange: (filter: DateFilter | null) => void
}

export default function QuickFilters({
  dateFilter,
  onFilterChange,
}: QuickFiltersProps) {
  const filters = [
    { value: null, label: 'All' },
    { value: 'today' as DateFilter, label: 'Today' },
    { value: 'week' as DateFilter, label: 'This Week' },
    { value: 'month' as DateFilter, label: 'This Month' },
  ]

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <FaBolt className="text-orange-500" />
        Quick Filters
      </label>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive =
            (filter.value === null && (!dateFilter || dateFilter === 'all')) ||
            dateFilter === filter.value

          return (
            <button
              key={filter.value || 'all'}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
