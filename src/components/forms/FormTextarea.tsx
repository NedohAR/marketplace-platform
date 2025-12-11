import { TextareaHTMLAttributes, forwardRef, useState, useEffect } from 'react'

interface FormTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label: string
  error?: string
  containerClassName?: string
  textareaClassName?: string
  showCharCount?: boolean
  helperText?: string
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      containerClassName = '',
      textareaClassName = '',
      showCharCount = false,
      helperText,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0)

    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length)
      }
      onChange?.(e)
    }

    const isNearLimit = maxLength && charCount > maxLength * 0.9
    const isOverLimit = maxLength && charCount > maxLength

    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
          {showCharCount && maxLength && (
            <span
              className={`text-xs ${
                isOverLimit
                  ? 'text-red-600 font-semibold'
                  : isNearLimit
                  ? 'text-orange-500'
                  : 'text-gray-500'
              }`}
            >
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          {...props}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            error ? 'focus:ring-red-500' : ''
          } transition-colors ${textareaClassName}`}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea
