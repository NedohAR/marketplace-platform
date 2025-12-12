import { prisma } from './prisma'
import { Ad, AdCondition, DealType } from '@/types'

export interface StoredAd {
  id: string
  title: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  location: string
  date: string
  views: number
  userId: string
  userName: string
  status?: 'active' | 'archived' | 'sold'
  promoted?: boolean
  condition?: AdCondition
  dealType?: DealType
}

export async function getAds(): Promise<StoredAd[]> {
  try {
    const ads = await prisma.ad.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: Number(ad.price),
      image: ad.images[0]?.url || '/placeholder-image.svg',
      images:
        ad.images.length > 1 ? ad.images.map((img) => img.url) : undefined,
      category: ad.category.slug,
      location: ad.location,
      date: ad.createdAt.toISOString(),
      views: ad.views,
      userId: ad.userId,
      userName: ad.user.name || 'Unknown',
      status:
        ad.status === 'ACTIVE'
          ? 'active'
          : ad.status === 'ARCHIVED'
          ? 'archived'
          : ad.status === 'SOLD'
          ? 'sold'
          : 'active',
      promoted: ad.promoted,
      condition: ad.condition
        ? (ad.condition.toLowerCase().replace(/_/g, '-') as AdCondition)
        : undefined,
      dealType: ad.dealType
        ? (ad.dealType.toLowerCase() as DealType)
        : undefined,
    }))
  } catch (e) {
    console.error('Error loading ads:', e)
    return []
  }
}

export async function getAdById(id: string): Promise<StoredAd | null> {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!ad) return null

    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: Number(ad.price),
      image: ad.images[0]?.url || '/placeholder-image.svg',
      images:
        ad.images.length > 1 ? ad.images.map((img) => img.url) : undefined,
      category: ad.category.slug,
      location: ad.location,
      date: ad.createdAt.toISOString(),
      views: ad.views,
      userId: ad.userId,
      userName: ad.user.name || 'Unknown',
      status:
        ad.status === 'ACTIVE'
          ? 'active'
          : ad.status === 'ARCHIVED'
          ? 'archived'
          : ad.status === 'SOLD'
          ? 'sold'
          : 'active',
      promoted: ad.promoted,
      condition: ad.condition
        ? (ad.condition.toLowerCase().replace(/_/g, '-') as AdCondition)
        : undefined,
      dealType: ad.dealType
        ? (ad.dealType.toLowerCase() as DealType)
        : undefined,
    }
  } catch (e) {
    console.error('Error getting ad by id:', e)
    return null
  }
}

const categoryMap: Record<string, { name: string; icon?: string }> = {
  transport: { name: 'Transport', icon: 'car' },
  'real-estate': { name: 'Real Estate', icon: 'home' },
  electronics: { name: 'Electronics', icon: 'mobile' },
  clothing: { name: 'Clothing', icon: 'clothing' },
  furniture: { name: 'Furniture', icon: 'furniture' },
  jobs: { name: 'Jobs', icon: 'briefcase' },
  services: { name: 'Services', icon: 'tools' },
  animals: { name: 'Animals', icon: 'dog' },
}

async function getOrCreateCategory(slug: string) {
  let category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category && categoryMap[slug]) {
    category = await prisma.category.create({
      data: {
        name: categoryMap[slug].name,
        slug,
        icon: categoryMap[slug].icon,
      },
    })
  }

  if (!category) {
    throw new Error(`Category "${slug}" not found and cannot be created`)
  }

  return category
}

export async function createAd(adData: {
  title: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  location: string
  userId: string
  condition?: AdCondition
  dealType?: DealType
  promoted?: boolean
}): Promise<StoredAd> {
  try {
    const category = await getOrCreateCategory(adData.category)

    const defaultImage = '/placeholder-image.svg'
    const images =
      adData.images && adData.images.length > 0
        ? adData.images
        : adData.image
        ? [adData.image]
        : [defaultImage]

    const ad = await prisma.ad.create({
      data: {
        title: adData.title,
        description: adData.description,
        price: adData.price,
        categoryId: category.id,
        location: adData.location,
        userId: adData.userId,
        condition: adData.condition
          ? adData.condition.toUpperCase().replace(/-/g, '_')
          : null,
        dealType: adData.dealType ? adData.dealType.toUpperCase() : null,
        promoted: adData.promoted || false,
        status: 'ACTIVE',
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: Number(ad.price),
      image: ad.images[0]?.url || defaultImage,
      images:
        ad.images.length > 1 ? ad.images.map((img) => img.url) : undefined,
      category: ad.category.slug,
      location: ad.location,
      date: ad.createdAt.toISOString(),
      views: ad.views,
      userId: ad.userId,
      userName: ad.user.name || 'Unknown',
      status: 'active',
      promoted: ad.promoted,
      condition: ad.condition
        ? (ad.condition.toLowerCase().replace(/_/g, '-') as AdCondition)
        : undefined,
      dealType: ad.dealType
        ? (ad.dealType.toLowerCase() as DealType)
        : undefined,
    }
  } catch (e) {
    console.error('Error creating ad:', e)
    throw e
  }
}

export async function updateAd(
  id: string,
  updates: Partial<{
    title: string
    description: string
    price: number
    image: string
    images?: string[]
    category: string
    location: string
    condition?: AdCondition
    dealType?: DealType
    status?: 'active' | 'archived' | 'sold'
    promoted?: boolean
    views?: number
  }>
): Promise<StoredAd | null> {
  try {
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title
    if (updates.description) updateData.description = updates.description
    if (updates.price !== undefined) updateData.price = updates.price
    if (updates.location) updateData.location = updates.location
    if (updates.condition)
      updateData.condition = updates.condition.toUpperCase().replace(/-/g, '_')
    if (updates.dealType) updateData.dealType = updates.dealType.toUpperCase()
    if (updates.promoted !== undefined) updateData.promoted = updates.promoted
    if (updates.views !== undefined) updateData.views = updates.views
    if (updates.status) {
      updateData.status =
        updates.status.toUpperCase() === 'ACTIVE'
          ? 'ACTIVE'
          : updates.status.toUpperCase() === 'ARCHIVED'
          ? 'ARCHIVED'
          : updates.status.toUpperCase() === 'SOLD'
          ? 'SOLD'
          : 'ACTIVE'
    }

    if (updates.category) {
      const category = await getOrCreateCategory(updates.category)
      updateData.categoryId = category.id
    }

    const ad = await prisma.ad.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (updates.images || updates.image) {
      await prisma.image.deleteMany({
        where: { adId: id },
      })

      const images =
        updates.images && updates.images.length > 0
          ? updates.images
          : updates.image
          ? [updates.image]
          : ['/placeholder-image.svg']

      await prisma.image.createMany({
        data: images.map((url, index) => ({
          url,
          order: index,
          adId: id,
        })),
      })

      const updatedAd = await prisma.ad.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      if (updatedAd) {
        return {
          id: updatedAd.id,
          title: updatedAd.title,
          description: updatedAd.description,
          price: Number(updatedAd.price),
          image: updatedAd.images[0]?.url || '/placeholder-image.svg',
          images:
            updatedAd.images.length > 1
              ? updatedAd.images.map((img) => img.url)
              : undefined,
          category: ad.category.slug,
          location: updatedAd.location,
          date: updatedAd.createdAt.toISOString(),
          views: updatedAd.views,
          userId: updatedAd.userId,
          userName: ad.user.name || 'Unknown',
          status:
            updatedAd.status === 'ACTIVE'
              ? 'active'
              : updatedAd.status === 'ARCHIVED'
              ? 'archived'
              : updatedAd.status === 'SOLD'
              ? 'sold'
              : 'active',
          promoted: updatedAd.promoted,
          condition: updatedAd.condition
            ? (updatedAd.condition
                .toLowerCase()
                .replace('_', '-') as AdCondition)
            : undefined,
          dealType: updatedAd.dealType
            ? (updatedAd.dealType.toLowerCase() as DealType)
            : undefined,
        }
      }
    }

    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: Number(ad.price),
      image: ad.images[0]?.url || '/placeholder-image.svg',
      images:
        ad.images.length > 1 ? ad.images.map((img) => img.url) : undefined,
      category: ad.category.slug,
      location: ad.location,
      date: ad.createdAt.toISOString(),
      views: ad.views,
      userId: ad.userId,
      userName: ad.user.name || 'Unknown',
      status:
        ad.status === 'ACTIVE'
          ? 'active'
          : ad.status === 'ARCHIVED'
          ? 'archived'
          : ad.status === 'SOLD'
          ? 'sold'
          : 'active',
      promoted: ad.promoted,
      condition: ad.condition
        ? (ad.condition.toLowerCase().replace(/_/g, '-') as AdCondition)
        : undefined,
      dealType: ad.dealType
        ? (ad.dealType.toLowerCase() as DealType)
        : undefined,
    }
  } catch (e) {
    console.error('Error updating ad:', e)
    return null
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    await prisma.ad.delete({
      where: { id },
    })
    return true
  } catch (e) {
    console.error('Error deleting ad:', e)
    return false
  }
}

export async function getAdsByUserId(userId: string): Promise<StoredAd[]> {
  try {
    const ads = await prisma.ad.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: Number(ad.price),
      image: ad.images[0]?.url || '/placeholder-image.svg',
      images:
        ad.images.length > 1 ? ad.images.map((img) => img.url) : undefined,
      category: ad.category.slug,
      location: ad.location,
      date: ad.createdAt.toISOString(),
      views: ad.views,
      userId: ad.userId,
      userName: ad.user.name || 'Unknown',
      status:
        ad.status === 'ACTIVE'
          ? 'active'
          : ad.status === 'ARCHIVED'
          ? 'archived'
          : ad.status === 'SOLD'
          ? 'sold'
          : 'active',
      promoted: ad.promoted,
      condition: ad.condition
        ? (ad.condition.toLowerCase().replace(/_/g, '-') as AdCondition)
        : undefined,
      dealType: ad.dealType
        ? (ad.dealType.toLowerCase() as DealType)
        : undefined,
    }))
  } catch (e) {
    console.error('Error getting ads by user id:', e)
    return []
  }
}
