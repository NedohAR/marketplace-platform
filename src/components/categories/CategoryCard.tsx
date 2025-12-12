'use client'

import Link from 'next/link'
import { Category } from '@/types'
import { getIcon } from '@/utils/icons'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = getIcon(category.iconName)

  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-orange-500 group"
      prefetch={true}
    >
      <div className="mb-2 sm:mb-3 text-4xl sm:text-5xl text-orange-500 group-hover:text-orange-600 transition-colors">
        <IconComponent />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
        {category.name}
      </h3>
    </Link>
  )
}
