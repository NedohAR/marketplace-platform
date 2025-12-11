'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { FaChevronDown, FaCheck, FaSearch, FaTimes } from 'react-icons/fa'
import { useDebounce } from '@/hooks/useDebounce'

interface Option {
  value: string
  label: string
  group?: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  label?: string
  error?: string
  searchable?: boolean
  searchPlaceholder?: string
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  label,
  error,
  searchable = false,
  searchPlaceholder = 'Search...',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebounce(searchQuery, 200)

  const selectedOption = options.find((opt) => opt.value === value)

  const groupedOptions = useMemo(() => {
    const hasGroups = options.some((opt) => opt.group)
    if (!hasGroups) return null

    const groups: Record<string, Option[]> = {}
    options.forEach((opt) => {
      const group = opt.group || 'Other'
      if (!groups[group]) groups[group] = []
      groups[group].push(opt)
    })
    return groups
  }, [options])

  const filteredOptions = useMemo(() => {
    if (!debouncedSearch.trim()) return options

    const query = debouncedSearch.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    )
  }, [options, debouncedSearch])

  const displayOptions = searchable ? filteredOptions : options

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, searchable])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={handleOpen}
          className={`w-full px-4 py-2.5 pr-10 text-left border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-400 flex items-center justify-between ${
            isOpen ? 'border-orange-500 ring-2 ring-orange-500' : ''
          }`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <FaChevronDown
            className={`text-gray-400 text-sm transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSearchQuery('')
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-y-auto max-h-52">
              {displayOptions.length > 0 ? (
                groupedOptions ? (
                  Object.entries(groupedOptions).map(
                    ([groupName, groupOptions]) => (
                      <div key={groupName}>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                          {groupName}
                        </div>
                        {groupOptions.map((option) => {
                          const isSelected = value === option.value
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleSelect(option.value)}
                              className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-orange-50 transition-colors ${
                                isSelected
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'text-gray-700'
                              }`}
                            >
                              <span>{option.label}</span>
                              {isSelected && (
                                <FaCheck className="text-orange-500 text-sm" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  )
                ) : (
                  displayOptions.map((option) => {
                    const isSelected = value === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-orange-50 transition-colors ${
                          isSelected
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-gray-700'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <FaCheck className="text-orange-500 text-sm" />
                        )}
                      </button>
                    )
                  })
                )
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
