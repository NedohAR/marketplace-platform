'use client'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    const half = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, currentPage + half)

    if (end - start < maxVisiblePages - 1) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1)
      } else {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-500 border border-gray-300'
        }`}
      >
        <FaChevronLeft />
      </button>

      {visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          )
        }

        const pageNum = page as number
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              pageNum === currentPage
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-500 border border-gray-300'
            }`}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-500 border border-gray-300'
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

