import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa'

type IconType = 'user' | 'email' | 'password' | 'phone' | 'location' | 'none'

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string
  icon?: IconType
  customIcon?: ReactNode
  error?: string
  containerClassName?: string
  inputClassName?: string
  helperText?: string
}

const iconMap = {
  user: FaUser,
  email: FaEnvelope,
  password: FaLock,
  phone: FaPhone,
  location: FaMapMarkerAlt,
  none: null,
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      icon = 'none',
      customIcon,
      error,
      containerClassName = '',
      inputClassName = '',
      helperText,
      ...props
    },
    ref
  ) => {
    const IconComponent = icon !== 'none' ? iconMap[icon] : null
    const hasIcon = IconComponent || customIcon

    return (
      <div className={containerClassName}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          {hasIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {customIcon || (IconComponent && <IconComponent />)}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              error ? 'focus:ring-red-500' : ''
            } transition-colors ${inputClassName}`}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput
