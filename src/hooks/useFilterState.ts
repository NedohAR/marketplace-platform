import { useState, useEffect, useCallback } from 'react'

export function useFilterState<T>(
  initialValue: T,
  onUpdate: (value: T) => void,
  debounceDelay: number = 500
) {
  const [localValue, setLocalValue] = useState<T>(initialValue)

  useEffect(() => {
    setLocalValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== initialValue) {
        onUpdate(localValue)
      }
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [localValue, initialValue, onUpdate, debounceDelay])

  const updateValue = useCallback((value: T) => {
    setLocalValue(value)
  }, [])

  return [localValue, updateValue] as const
}
