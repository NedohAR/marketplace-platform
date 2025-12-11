'use client'

import { useState, useMemo } from 'react'
import { Category } from '@/types'
import { FaCheck, FaSearch, FaTimes } from 'react-icons/fa'

interface CategoryMultiSelectProps {
  categories: Category[]
  selectedCategories: string[]
  onChange: (categories: string[]) => void
}

export default function CategoryMultiSelect({
  categories,
  selectedCategories,
  onChange,
}: CategoryMultiSelectProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.slug.toLowerCase().includes(query)
    )
  }, [categories, searchQuery])

  const toggleCategory = (categorySlug: string) => {
    if (selectedCategories.includes(categorySlug)) {
      onChange(selectedCategories.filter((slug) => slug !== categorySlug))
    } else {
      onChange([...selectedCategories, categorySlug])
    }
  }

  const hasSearch = searchQuery.trim().length > 0

  return (
    <div className="space-y-3">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        {hasSearch && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>

      {filteredCategories.length > 0 ? (
        <div className="flex flex-wrap gap-2 w-full max-h-64 overflow-y-auto">
          {filteredCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.slug)
            return (
              <label
                key={category.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-300 transition-colors flex-1 min-w-[120px]"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category.slug)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <FaCheck className="text-white text-xs" />}
                  </div>
                </div>
                <span className="text-sm text-gray-700 whitespace-nowrap">
                  {category.name}
                </span>
              </label>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500">
          No categories found
        </div>
      )}
    </div>
  )
}
