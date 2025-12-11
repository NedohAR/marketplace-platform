'use client'

import { useFilterState } from '@/hooks/useFilterState'

interface PriceFilterProps {
  minPrice: number | null
  maxPrice: number | null
  onMinPriceChange: (price: number | null) => void
  onMaxPriceChange: (price: number | null) => void
}

export default function PriceFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) {
  const [localMinPrice, setLocalMinPrice] = useFilterState(
    minPrice?.toString() || '',
    (value) => {
      const numValue = value.trim() ? Number(value) : null
      onMinPriceChange(numValue)
    }
  )

  const [localMaxPrice, setLocalMaxPrice] = useFilterState(
    maxPrice?.toString() || '',
    (value) => {
      const numValue = value.trim() ? Number(value) : null
      onMaxPriceChange(numValue)
    }
  )

  return (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Min Price
        </label>
        <input
          type="number"
          value={localMinPrice}
          onChange={(e) => setLocalMinPrice(e.target.value)}
          placeholder="From"
          min="0"
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
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </>
  )
}
