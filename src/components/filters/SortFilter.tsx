'use client'

import CustomSelect from '../forms/CustomSelect'
import { SortOption } from '@/store/useAdStore'

interface SortFilterProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function SortFilter({ sortBy, onSortChange }: SortFilterProps) {
  return (
    <CustomSelect
      label="Sort By"
      value={sortBy}
      onChange={(value) => onSortChange(value as SortOption)}
      options={[
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'views', label: 'Most Popular' },
      ]}
    />
  )
}
