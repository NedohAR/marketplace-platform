'use client'

import { useParams } from 'next/navigation'
import PageLayout from '@/components/layout/PageLayout'
import ImageGallery from '@/components/forms/ImageGallery'
import Modal from '@/components/ui/Modal'
import RelatedAds from '@/components/ads/RelatedAds'
import CompactAdCard from '@/components/ads/CompactAdCard'
import { useAdStore } from '@/store/useAdStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'
import { useMounted } from '@/hooks/useMounted'
import { useSession } from 'next-auth/react'
import { Ad, AdPageParams } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  FaEye,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaEdit,
  FaTrash,
  FaShare,
  FaLink,
} from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { formatPrice, formatDate } from '@/utils/format'
import MessageModal from '@/components/messages/MessageModal'

export default function AdPage() {
  const params = useParams() as AdPageParams
  const router = useRouter()
  const id = params.id
  const {
    getAdById,
    deleteAd,
    updateAd,
    addToViewHistory,
    getRelatedAds,
    getSellerAds,
    trackContact,
  } = useAdStore()
  const { user, isAuthenticated, addActivity } = useAuthStore()
  const { success, error } = useToastStore()
  const { data: session } = useSession()
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad?.title,
          text: ad?.description,
          url: url,
        })
        success('Shared successfully!')
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url)
      success('Link copied to clipboard!')
    }
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      success('Link copied to clipboard!')
    } catch (err) {
      error('Failed to copy link')
    }
  }
  const ad = getAdById(id)
  const mounted = useMounted()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [relatedAds, setRelatedAds] = useState<Ad[]>([])
  const [sellerAds, setSellerAds] = useState<Ad[]>([])
  const [viewsIncremented, setViewsIncremented] = useState(false)

  const isOwner = isAuthenticated && user && ad && ad.userId === user.id

  useEffect(() => {
    if (ad && mounted && !viewsIncremented) {
      const currentViews = ad.views || 0
      updateAd(ad.id, { views: currentViews + 1 }).catch(console.error)
      setViewsIncremented(true)
      const userId = session?.user?.id || user?.id
      if (userId) {
        addToViewHistory(ad.id, userId)
      }
      setRelatedAds(getRelatedAds(ad.id))
      setSellerAds(getSellerAds(ad.userId, ad.id, 4))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, ad?.id, viewsIncremented, session?.user?.id, user?.id])

  useEffect(() => {
    setViewsIncremented(false)
    setRelatedAds([])
    setSellerAds([])
  }, [id])

  const handleDelete = async () => {
    if (!ad || !user) return
    try {
      await deleteAd(ad.id)
      addActivity({
        userId: user.id,
        type: 'ad_archived',
        description: `Deleted ad: ${ad.title}`,
        adId: ad.id,
      })
      success('Ad successfully deleted')
      router.push('/profile?tab=ads')
    } catch (error) {
      console.error('Error deleting ad:', error)
      success('Ad deleted (local)')
      router.push('/profile?tab=ads')
    }
  }

  if (!ad) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Ad not found</p>
          <Link
            href="/"
            className="inline-block text-orange-500 hover:text-orange-600"
          >
            Return to Homepage
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex-1">
                {ad.title}
              </h1>
              {mounted && isOwner && (
                <div className="flex gap-2 flex-wrap" suppressHydrationWarning>
                  <Link
                    href={`/edit-ad/${ad.id}`}
                    className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaEdit />
                    <span className="hidden xs:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaTrash />
                    <span className="hidden xs:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>
            <ImageGallery
              images={
                ad.images && ad.images.length > 0 ? ad.images : [ad.image]
              }
              title={ad.title}
            />
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{ad.description}</p>
            </div>
          </div>

          <Modal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Confirm Deletion"
            size="sm"
          >
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this ad? This action cannot be
              undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </Modal>

          {relatedAds.length > 0 && <RelatedAds ads={relatedAds} />}

          {sellerAds.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                More from this seller
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {sellerAds.map((ad) => (
                  <div key={ad.id} className="flex-shrink-0 w-56">
                    <CompactAdCard ad={ad} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20 sm:top-24">
            <div className="mb-4 sm:mb-6">
              <p
                className="text-3xl sm:text-4xl font-bold text-orange-500 mb-3 sm:mb-4"
                suppressHydrationWarning
              >
                {mounted
                  ? formatPrice(ad.price)
                  : `${ad.price.toLocaleString('en-US')} $`}
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold">{ad.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Published:</span>
                  <span className="font-semibold" suppressHydrationWarning>
                    {mounted ? formatDate(ad.date, { year: true }) : ad.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Views:</span>
                  <span className="font-semibold flex items-center gap-1">
                    <FaEye className="text-gray-400" />
                    {ad.views}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6 mb-4 sm:mb-6">
              <div className="flex gap-2 mb-3 sm:mb-4">
                <button
                  onClick={handleShare}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaShare />
                  <span className="hidden xs:inline">Share</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <FaLink />
                  <span className="hidden xs:inline">Copy Link</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                Seller Contact
              </h3>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <FaUser className="text-lg sm:text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                    {ad.userName}
                    {isOwner && <span className="text-gray-500 font-normal"> (You)</span>}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    On Marketplace since 2023
                  </p>
                </div>
              </div>
              {!isOwner && (
                <>
                  <button
                    onClick={() => {
                      if (ad) {
                        trackContact(ad.id, 'phone')
                        success('Phone number: +1234567890')
                      }
                    }}
                    className="w-full py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FaPhone />
                    <span className="hidden xs:inline">Show Phone</span>
                    <span className="xs:hidden">Phone</span>
                  </button>
                  <button
                    onClick={() => {
                      if (ad && user) {
                        trackContact(ad.id, 'message')
                        setIsMessageModalOpen(true)
                      } else if (!user) {
                        router.push('/login')
                      }
                    }}
                    className="w-full mt-2 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <FaEnvelope />
                    <span className="hidden xs:inline">Send Message</span>
                    <span className="xs:hidden">Message</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div> 
      </>
  )
}