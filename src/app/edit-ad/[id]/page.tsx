'use client'

import PageLayout from '@/components/layout/PageLayout'
import FormInput from '@/components/forms/FormInput'
import FormTextarea from '@/components/forms/FormTextarea'
import FormSelect from '@/components/forms/FormSelect'
import ImageUpload from '@/components/forms/ImageUpload'
import MultipleImageUpload from '@/components/forms/MultipleImageUpload'
import { useAdStore } from '@/store/useAdStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'
import { AdFormData, EditAdPageParams, AdCondition, DealType } from '@/types'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default function EditAdPage() {
  const params = useParams() as EditAdPageParams
  const router = useRouter()
  const id = params.id
  const { getAdById, updateAd, categories } = useAdStore()
  const { user, isAuthenticated, addActivity } = useAuthStore()
  const { success } = useToastStore()
  const ad = getAdById(id)

  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    image: '',
    images: [],
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (ad) {
      if (ad.userId !== user?.id) {
        router.push(`/ad/${id}`)
        return
      }

      setFormData({
        title: ad.title,
        description: ad.description,
        price: ad.price.toString(),
        category: ad.category,
        location: ad.location,
        image: ad.image,
        images: ad.images || (ad.image ? [ad.image] : []),
        condition: ad.condition,
        dealType: ad.dealType,
      })
    }
  }, [ad, id, isAuthenticated, user, router])

  if (!ad || !user || ad.userId !== user.id) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const images =
      formData.images && formData.images.length > 0
        ? formData.images
        : formData.image
        ? [formData.image]
        : []
    const mainImage = images[0] || formData.image

    updateAd(id, {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      location: formData.location,
      image: mainImage,
      images: images.length > 1 ? images : undefined,
      condition: formData.condition,
      dealType: formData.dealType,
    })

    addActivity({
      userId: user.id,
      type: 'ad_updated',
      description: `Updated ad: ${formData.title}`,
      adId: id,
    })

    success('Ad successfully updated!')
    router.push(`/ad/${id}`)
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  }))

  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'for-parts', label: 'For Parts' },
    { value: 'needs-repair', label: 'Needs Repair' },
  ]

  const dealTypeOptions = [
    { value: 'sell', label: 'Sell' },
    { value: 'buy', label: 'Buy' },
    { value: 'exchange', label: 'Exchange' },
    { value: 'rent', label: 'Rent' },
    { value: 'free', label: 'Free' },
  ]

  return (
    <PageLayout maxWidth="3xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Edit Ad</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle />
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        <FormInput
          type="text"
          label="Ad Title *"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Selling iPhone 13"
        />

        <FormTextarea
          label="Description *"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={6}
          placeholder="Describe your item in detail..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            type="number"
            label="Price ($) *"
            required
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="0"
          />

          <FormSelect
            label="Category *"
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={categoryOptions}
            placeholder="Select Category"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Condition"
            value={formData.condition || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                condition: (e.target.value as AdCondition) || undefined,
              })
            }
            options={conditionOptions}
            placeholder="Select Condition"
          />

          <FormSelect
            label="Deal Type"
            value={formData.dealType || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                dealType: (e.target.value as DealType) || undefined,
              })
            }
            options={dealTypeOptions}
            placeholder="Select Deal Type"
          />
        </div>

        <FormInput
          type="text"
          label="Location *"
          icon="location"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          placeholder="New York"
        />

        <MultipleImageUpload
          value={formData.images || (formData.image ? [formData.image] : [])}
          onChange={(images) => {
            setFormData({
              ...formData,
              images: images,
              image: images[0] || '',
            })
          }}
          label="Images"
          maxImages={10}
        />

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </PageLayout>
  )
}
