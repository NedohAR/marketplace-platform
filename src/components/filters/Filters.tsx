'use client'

import { useAdStore } from '@/store/useAdStore'
import { useState, useEffect } from 'react'
import { FaFilter, FaTimes, FaCalendar, FaBolt } from 'react-icons/fa'
import { DateFilter } from '@/store/useAdStore'
import DatePicker from '../ui/DatePicker'

export default function Filters() {
  const { filters, setFilters, categories, sortBy, setSortBy } = useAdStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [localMinPrice, setLocalMinPrice] = useState<string>(
    filters.minPrice?.toString() || ''
  )
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    filters.maxPrice?.toString() || ''
  )
  const [localLocation, setLocalLocation] = useState<string>(
    filters.location || ''
  )

  useEffect(() => {
    setLocalMinPrice(filters.minPrice?.toString() || '')
    setLocalMaxPrice(filters.maxPrice?.toString() || '')
    setLocalLocation(filters.location || '')
  }, [filters.minPrice, filters.maxPrice, filters.location])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localMinPrice.trim() ? Number(localMinPrice) : null
      if (value !== filters.minPrice) {
        setFilters({ minPrice: value })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localMinPrice, filters.minPrice, setFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localMaxPrice.trim() ? Number(localMaxPrice) : null
      if (value !== filters.maxPrice) {
        setFilters({ maxPrice: value })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localMaxPrice, filters.maxPrice, setFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = localLocation.trim() || null
      if (value !== filters.location) {
        setFilters({ location: value })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localLocation, filters.location, setFilters])

  const handleFilterChange = (key: string, value: string | number | null) => {
    setFilters({ [key]: value || null })
  }

  const clearFilters = () => {
    setLocalMinPrice('')
    setLocalMaxPrice('')
    setLocalLocation('')
    setFilters({
      minPrice: null,
      maxPrice: null,
      location: null,
      category: null,
      dateFilter: null,
      customDate: null,
    })
  }

  const applyQuickFilter = (dateFilter: DateFilter) => {
    setFilters({ dateFilter })
  }

  const hasActiveFilters =
    mounted &&
    (filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.location !== null ||
      filters.category !== null ||
      (filters.dateFilter !== null && filters.dateFilter !== 'all') ||
      filters.customDate !== null)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
        >
          <FaFilter />
          <span className="font-semibold">Filters & Sort</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
              Active
            </span>
          )}
        </button>
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

      {isOpen && (
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <FaBolt className="text-orange-500" />
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyQuickFilter(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !filters.dateFilter || filters.dateFilter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => applyQuickFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.dateFilter === 'today'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyQuickFilter('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.dateFilter === 'week'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => applyQuickFilter('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.dateFilter === 'month'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                placeholder="From"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                placeholder="To"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value)}
                placeholder="Enter city"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="views">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaCalendar className="text-orange-500" />
                Publication Period
              </label>
              <select
                value={filters.dateFilter || 'all'}
                onChange={(e) =>
                  setFilters({
                    dateFilter: (e.target.value === 'all'
                      ? null
                      : e.target.value) as DateFilter,
                    customDate: null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Ads</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaCalendar className="text-orange-500" />
                Or Select Date
              </label>
              <DatePicker
                value={filters.customDate ? new Date(filters.customDate) : null}
                onChange={(date) => {
                  setFilters({
                    customDate: date ? date.toISOString() : null,
                    dateFilter: null,
                  })
                }}
                placeholder="Select date"
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
