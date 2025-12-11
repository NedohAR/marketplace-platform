'use client'

import { useState, useRef, useEffect } from 'react'
import { FaCalendar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
  )
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!value) return false
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    )
  }

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    )
    if (!isDisabled(selectedDate)) {
      onChange(selectedDate)
      setIsOpen(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className="relative" ref={calendarRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center gap-2 bg-white"
      >
        <FaCalendar className="text-gray-400" />
        <span className={value ? 'text-gray-700' : 'text-gray-400'}>
          {value ? formatDate(value) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              )
              const disabled = isDisabled(date)
              const selected = isSelected(date)
              const today = isToday(date)

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                    selected
                      ? 'bg-orange-500 text-white'
                      : today
                      ? 'bg-orange-100 text-orange-600 font-bold'
                      : disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {value && (
            <div className="mt-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

