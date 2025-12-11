import { useCallback } from 'react'
import { useAdStore } from '@/store/useAdStore'
import { useToastStore } from '@/store/useToastStore'
import { useMounted } from './useMounted'

export function useFavorite(adId: string) {
  const { toggleFavorite, isFavorite } = useAdStore()
  const { success, info } = useToastStore()
  const mounted = useMounted()

  const favorite = mounted ? isFavorite(adId) : false

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const wasFavorite = isFavorite(adId)
      toggleFavorite(adId)
      if (wasFavorite) {
        info('Removed from favorites')
      } else {
        success('Added to favorites')
      }
    },
    [adId, isFavorite, toggleFavorite, info, success]
  )

  return {
    favorite,
    toggleFavorite: handleToggle,
    mounted,
  }
}
