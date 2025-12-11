'use client'

import { FaCalendar } from 'react-icons/fa'
import CustomSelect from '../forms/CustomSelect'
import DatePicker from '../ui/DatePicker'
import { DateFilter } from '@/store/useAdStore'

interface DateFilterGroupProps {
  dateFilter: DateFilter | null
  customDate: string | null
  onDateFilterChange: (filter: DateFilter | null) => void
  onCustomDateChange: (date: string | null) => void
}

export default function DateFilterGroup({
  dateFilter,
  customDate,
  onDateFilterChange,
  onCustomDateChange,
}: DateFilterGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FaCalendar className="text-orange-500" />
          Publication Period
        </label>
        <CustomSelect
          value={dateFilter || 'all'}
          onChange={(value) => {
            onDateFilterChange(value === 'all' ? null : (value as DateFilter))
            onCustomDateChange(null)
          }}
          options={[
            { value: 'all', label: 'All Ads' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
          ]}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FaCalendar className="text-orange-500" />
          Or Select Date
        </label>
        <DatePicker
          value={customDate ? new Date(customDate) : null}
          onChange={(date) => {
            onCustomDateChange(date ? date.toISOString() : null)
            onDateFilterChange(null)
          }}
          placeholder="Select date"
          maxDate={new Date()}
        />
      </div>
    </div>
  )
}
