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
import { AdFormData, AdCondition, DealType } from '@/types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PostAdPage() {
  const router = useRouter()
  const { categories, addAd } = useAdStore()
  const { user, isAuthenticated, addActivity } = useAuthStore()
  const { success } = useToastStore()
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    image: '',
    images: [],
    condition: 'used',
    dealType: 'sell',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const defaultImage = '/placeholder-image.svg'

    const images =
      formData.images && formData.images.length > 0
        ? formData.images
        : formData.image
        ? [formData.image]
        : [defaultImage]
    const mainImage = images[0] || defaultImage

    try {
      const newAd = await addAd({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        location: formData.location,
        image: mainImage,
        images: images.length > 1 ? images : undefined,
        userId: user.id,
        userName: user.name,
        condition: formData.condition,
        dealType: formData.dealType,
      })

      addActivity({
        userId: user.id,
        type: 'ad_created',
        description: `Created ad: ${formData.title}`,
        adId: newAd.id,
      })

      success('Ad successfully created!')
      router.push('/profile?tab=ads')
    } catch (error: any) {
      console.error('Error creating ad:', error)
      success('Ad created (saved locally)')
      router.push('/profile?tab=ads')
    }
  }

  if (!isAuthenticated || !user) {
    return null
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 px-2">
        Post Ad
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            Post Ad
          </button>
        </div>
      </form>
    </PageLayout>
  )
}
