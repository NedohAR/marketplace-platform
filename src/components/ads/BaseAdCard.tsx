'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Ad } from '@/types'
import { FaHeart, FaEye } from 'react-icons/fa'
import { useFavorite } from '@/hooks/useFavorite'
import { useMounted } from '@/hooks/useMounted'
import { formatPrice, formatDate } from '@/utils/format'
import AdBadges from './AdBadges'

export type AdCardVariant = 'default' | 'compact' | 'promoted'

interface BaseAdCardProps {
  ad: Ad
  variant?: AdCardVariant
  showFavorite?: boolean
  showViews?: boolean
  showDescription?: boolean
  showBadges?: boolean
}

function BaseAdCard({
  ad,
  variant = 'default',
  showFavorite = true,
  showViews = true,
  showDescription = true,
  showBadges = true,
}: BaseAdCardProps) {
  const { favorite, toggleFavorite } = useFavorite(ad.id)
  const isMounted = useMounted()

  const isCompact = variant === 'compact'
  const isPromoted = variant === 'promoted'
  const isDefault = variant === 'default'

  const imageSizes = {
    default: {
      width: 'w-full sm:w-32',
      height: 'h-48 sm:h-32',
      sizes: '(max-width: 640px) 100vw, 128px',
    },
    compact: {
      width: 'w-full',
      height: 'h-40',
      sizes: '(max-width: 768px) 50vw, 20vw',
    },
    promoted: {
      width: 'w-full',
      height: 'h-48',
      sizes: '(max-width: 768px) 50vw, 25vw',
    },
  }

  const imageConfig = imageSizes[variant]

  const containerClasses = {
    default:
      'relative flex gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-orange-500',
    compact:
      'relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500 flex flex-col group',
    promoted:
      'bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-orange-500',
  }

  const favoriteButtonClasses = {
    default:
      'absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all',
    compact:
      'absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100',
    promoted: 'hidden', // Promoted не показывает избранное
  }

  return (
    <Link
      href={`/ad/${ad.id}`}
      className={containerClasses[variant]}
      aria-label={`View ad: ${ad.title}`}
      prefetch={true}
    >
      {showFavorite && !isPromoted && (
        <button
          onClick={toggleFavorite}
          className={favoriteButtonClasses[variant]}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          suppressHydrationWarning
        >
          <FaHeart
            className={`${isCompact ? 'text-sm' : 'text-lg'} ${
              favorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
            suppressHydrationWarning
          />
        </button>
      )}

      <div
        className={`relative ${imageConfig.width} ${imageConfig.height} ${
          isDefault ? 'sm:flex-shrink-0' : 'w-full'
        } ${isDefault ? 'rounded-lg' : ''} overflow-hidden bg-gray-100`}
      >
        <Image
          src={ad.image}
          alt={ad.title}
          fill
          className="object-cover"
          sizes={imageConfig.sizes}
        />
      </div>

      <div
        className={`${
          isDefault ? 'flex-1 flex flex-col justify-between' : ''
        } ${isCompact ? 'p-3 flex-1 flex flex-col' : ''} ${
          isPromoted ? 'p-3' : ''
        }`}
      >
        <div>
          <h3
            className={`${
              isDefault
                ? 'text-lg font-semibold'
                : isCompact
                ? 'text-sm font-medium min-h-[2.5rem]'
                : 'text-sm font-medium min-h-[2.5rem]'
            } text-gray-800 mb-1 line-clamp-2`}
          >
            {ad.title}
          </h3>

          {showBadges &&
            ((ad.condition &&
              ad.condition !== 'new' &&
              ad.condition !== 'used') ||
              (ad.dealType &&
                ad.dealType !== 'exchange' &&
                ad.dealType !== 'buy')) && (
              <div className="mb-2">
                <AdBadges
                  condition={
                    ad.condition &&
                    ad.condition !== 'new' &&
                    ad.condition !== 'used'
                      ? ad.condition
                      : undefined
                  }
                  dealType={
                    ad.dealType &&
                    ad.dealType !== 'exchange' &&
                    ad.dealType !== 'buy' &&
                    ad.dealType !== 'sell'
                      ? ad.dealType
                      : undefined
                  }
                  size={isCompact || isPromoted ? 'sm' : 'sm'}
                />
              </div>
            )}

          <p
            className={`${
              isDefault ? 'text-2xl' : 'text-lg'
            } font-bold text-orange-500 mb-2`}
            suppressHydrationWarning
          >
            {isMounted
              ? formatPrice(ad.price)
              : `${ad.price.toLocaleString('en-US')} $`}
          </p>

          {showDescription && !isCompact && !isPromoted && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {ad.description}
            </p>
          )}
        </div>

        <div
          className={`flex items-center justify-between ${
            isDefault ? 'mt-2 text-sm' : 'text-xs'
          } text-gray-500 ${isCompact ? 'mt-auto' : ''}`}
        >
          <span className={isCompact || isPromoted ? 'truncate' : ''}>
            {ad.location}
          </span>
          <span suppressHydrationWarning>
            {isMounted ? formatDate(ad.date) : ad.date}
          </span>
          {showViews && isDefault && (
            <span
              className="flex items-center gap-1"
              aria-label={`${ad.views} views`}
            >
              <FaEye className="text-gray-400" aria-hidden="true" />
              {ad.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default memo(BaseAdCard, (prevProps, nextProps) => {
  return (
    prevProps.ad.id === nextProps.ad.id &&
    prevProps.variant === nextProps.variant
  )
})
