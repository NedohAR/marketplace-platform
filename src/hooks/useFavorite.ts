import { useCallback } from 'react'
import { useAdStore } from '@/store/useAdStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'
import { useMounted } from './useMounted'

export function useFavorite(adId: string) {
  const { toggleFavorite, isFavorite } = useAdStore()
  const { user } = useAuthStore()
  const { success, info } = useToastStore()
  const mounted = useMounted()

  const favorite = mounted ? isFavorite(adId) : false

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!user?.id) {
        info('Please log in to add favorites')
        return
      }
      
      const wasFavorite = isFavorite(adId)
      toggleFavorite(adId, user.id)
      if (wasFavorite) {
        info('Removed from favorites')
      } else {
        success('Added to favorites')
      }
    },
    [adId, isFavorite, toggleFavorite, info, success, user]
  )

  return {
    favorite,
    toggleFavorite: handleToggle,
    mounted,
  }
}
