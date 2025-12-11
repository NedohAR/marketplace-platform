'use client'

import { useState, useEffect, useRef } from 'react'
import { FaSearch, FaHistory, FaTimes, FaClock } from 'react-icons/fa'
import { useAdStore } from '@/store/useAdStore'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSearch,
  placeholder = 'Search ads...',
}: SearchAutocompleteProps) {
  const { searchHistory, getSearchSuggestions, clearSearchHistory } =
    useAdStore()
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    if (debouncedValue.trim()) {
      const newSuggestions = getSearchSuggestions(debouncedValue)
      setSuggestions(newSuggestions)
      setShowHistory(false)
    } else {
      setSuggestions([])
      setShowHistory(true)
    }
  }, [debouncedValue, getSearchSuggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    const trimmedSuggestion = suggestion.trim()
    onChange(trimmedSuggestion)
    onSearch(trimmedSuggestion)
    setIsOpen(false)
  }

  const handleHistoryClick = (historyItem: string) => {
    const trimmedItem = historyItem.trim()
    onChange(trimmedItem)
    onSearch(trimmedItem)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedValue = value.trim()
      onSearch(trimmedValue)
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const displayItems = showHistory ? searchHistory : suggestions
  const hasItems = displayItems.length > 0

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {showHistory && searchHistory.length > 0 && (
            <div className="p-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaHistory className="text-gray-400" />
                <span>Recent Searches</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearSearchHistory()
                }}
                className="text-xs text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1"
              >
                <FaTimes className="text-xs" />
                Clear
              </button>
            </div>
          )}

          {hasItems ? (
            <div className="py-2">
              {displayItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    showHistory
                      ? handleHistoryClick(item)
                      : handleSuggestionClick(item)
                  }
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                >
                  {showHistory ? (
                    <FaClock className="text-gray-400 group-hover:text-orange-500" />
                  ) : (
                    <FaSearch className="text-gray-400 group-hover:text-orange-500" />
                  )}
                  <span className="flex-1 text-gray-700 group-hover:text-orange-500">
                    {item}
                  </span>
                </button>
              ))}
            </div>
          ) : value.trim() ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No suggestions found
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Start typing to see suggestions
            </div>
          )}
        </div>
      )}
    </div>
  )
}
