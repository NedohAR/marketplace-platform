'use client'

import { FaHandshake } from 'react-icons/fa'
import CustomSelect from '../forms/CustomSelect'
import { DealType } from '@/types'

interface DealTypeFilterProps {
  dealType: DealType | null
  onDealTypeChange: (dealType: DealType | null) => void
}

export default function DealTypeFilter({
  dealType,
  onDealTypeChange,
}: DealTypeFilterProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <FaHandshake className="text-orange-500" />
        Deal Type
      </label>
      <CustomSelect
        value={dealType || ''}
        onChange={(value) =>
          onDealTypeChange((value || null) as DealType | null)
        }
        options={[
          { value: '', label: 'All Types' },
          { value: 'sell', label: 'Sell' },
          { value: 'buy', label: 'Buy' },
          { value: 'exchange', label: 'Exchange' },
          { value: 'rent', label: 'Rent' },
          { value: 'free', label: 'Free' },
        ]}
        placeholder="All Types"
      />
    </div>
  )
}
