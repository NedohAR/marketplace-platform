'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ad } from '@/types'
import { FaEdit, FaArchive, FaTrash } from 'react-icons/fa'
import AdCard from '../ads/AdCard'

interface UserAdsListProps {
  ads: Ad[]
  onArchive: (adId: string, adTitle: string) => void
  onDelete: (adId: string, adTitle: string) => void
}

export default function UserAdsList({
  ads,
  onArchive,
  onDelete,
}: UserAdsListProps) {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'active' | 'archived'
  >('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const activeAds = ads.filter((ad) => !ad.status || ad.status === 'active')
  const archivedAds = ads.filter((ad) => ad.status === 'archived')

  const filteredAds =
    activeFilter === 'all'
      ? ads
      : activeFilter === 'active'
      ? activeAds
      : archivedAds

  const handleDelete = (adId: string, adTitle: string) => {
    onDelete(adId, adTitle)
    setDeleteConfirmId(null)
  }

  return (
    <>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'all'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({ads.length})
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'active'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({activeAds.length})
        </button>
        <button
          onClick={() => setActiveFilter('archived')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeFilter === 'archived'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Archived ({archivedAds.length})
        </button>
      </div>

      {filteredAds.length > 0 ? (
        <div className="grid gap-4">
          {filteredAds.map((ad) => (
            <div key={ad.id} className="relative">
              <AdCard ad={ad} />
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                {ad.status !== 'archived' && (
                  <>
                    <Link
                      href={`/edit-ad/${ad.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center gap-2 shadow-md"
                      prefetch={true}
                    >
                      <FaEdit />
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onArchive(ad.id, ad.title)
                      }}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm flex items-center gap-2 shadow-md"
                    >
                      <FaArchive />
                      Archive
                    </button>
                  </>
                )}
                {deleteConfirmId === ad.id ? (
                  <div className="bg-white border-2 border-red-500 rounded-lg p-3 shadow-lg">
                    <p className="text-sm text-gray-700 mb-2">Delete?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(ad.id, ad.title)
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setDeleteConfirmId(null)
                        }}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setDeleteConfirmId(ad.id)
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-2 shadow-md"
                  >
                    <FaTrash />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {activeFilter === 'all'
              ? "You don't have any ads yet"
              : activeFilter === 'active'
              ? 'No active ads'
              : 'No archived ads'}
          </p>
        </div>
      )}
    </>
  )
}
