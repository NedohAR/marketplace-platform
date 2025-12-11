'use client'

import { Category } from '@/types'
import { FaTags } from 'react-icons/fa'
import CategoryMultiSelect from './CategoryMultiSelect'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoriesChange: (categories: string[]) => void
}

export default function CategoryFilter({
  categories,
  selectedCategories,
  onCategoriesChange,
}: CategoryFilterProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <FaTags className="text-orange-500" />
        Categories
      </label>
      <CategoryMultiSelect
        categories={categories}
        selectedCategories={selectedCategories}
        onChange={onCategoriesChange}
      />
    </div>
  )
}
