import { SelectHTMLAttributes, forwardRef } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface Option {
  value: string
  label: string
}

interface FormSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label: string
  options: Option[]
  error?: string
  containerClassName?: string
  selectClassName?: string
  placeholder?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      options,
      error,
      containerClassName = '',
      selectClassName = '',
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            {...props}
            className={`w-full px-4 py-2.5 pr-10 appearance-none border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-400 ${selectClassName}`}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaChevronDown className="text-gray-400 text-sm" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

export default FormSelect
