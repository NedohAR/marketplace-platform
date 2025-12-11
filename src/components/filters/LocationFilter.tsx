'use client'

import { useFilterState } from '@/hooks/useFilterState'

interface LocationFilterProps {
  location: string | null
  onLocationChange: (location: string | null) => void
}

export default function LocationFilter({
  location,
  onLocationChange,
}: LocationFilterProps) {
  const [localLocation, setLocalLocation] = useFilterState(
    location || '',
    (value) => {
      onLocationChange(value.trim() || null)
    }
  )

  return (
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
  )
}
