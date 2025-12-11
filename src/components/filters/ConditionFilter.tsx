'use client'

import { FaBox } from 'react-icons/fa'
import CustomSelect from '../forms/CustomSelect'
import { AdCondition } from '@/types'

interface ConditionFilterProps {
  condition: AdCondition | null
  onConditionChange: (condition: AdCondition | null) => void
}

export default function ConditionFilter({
  condition,
  onConditionChange,
}: ConditionFilterProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <FaBox className="text-orange-500" />
        Condition
      </label>
      <CustomSelect
        value={condition || ''}
        onChange={(value) => {
          if (!value) {
            onConditionChange(null)
          } else {
            onConditionChange(value as AdCondition)
          }
        }}
        options={[
          { value: '', label: 'All Conditions' },
          { value: 'new', label: 'New' },
          { value: 'used', label: 'Used' },
          { value: 'for-parts', label: 'For Parts' },
          { value: 'needs-repair', label: 'Needs Repair' },
        ]}
        placeholder="All Conditions"
      />
    </div>
  )
}
