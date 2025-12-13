import { NextRequest, NextResponse } from 'next/server'
import {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  getAdsByUserId,
} from '@/lib/ads-storage'
import { auth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (id) {
      const ad = await getAdById(id)
      if (!ad) {
        return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
      }
      return NextResponse.json({ ad })
    }

    if (userId) {
      const ads = await getAdsByUserId(userId)
      return NextResponse.json({ ads })
    }

    const ads = await getAds()
    return NextResponse.json({ ads })
  } catch (error: any) {
    console.error('Error in GET /api/ads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      image,
      images,
      category,
      location,
      condition,
      dealType,
      promoted,
    } = body

    if (
      !title ||
      !description ||
      price === undefined ||
      !category ||
      !location
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ad = await createAd({
      title,
      description,
      price: Number(price),
      image: image || '/placeholder-image.svg',
      images,
      category,
      location,
      userId: session.user.id,
      condition,
      dealType,
      promoted,
    })

    return NextResponse.json({ ad }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/ads:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 })
    }

    const existingAd = await getAdById(id)
    if (!existingAd) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    const isViewUpdate = Object.keys(updates).length === 1 && 'views' in updates

    if (isViewUpdate) {
      const ad = await updateAd(id, updates)
      if (!ad) {
        return NextResponse.json(
          { error: 'Failed to update ad' },
          { status: 500 }
        )
      }
      return NextResponse.json({ ad })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (existingAd.userId !== session.user.id) {
      console.error('Forbidden: User ID mismatch', {
        adUserId: existingAd.userId,
        sessionUserId: session.user.id,
        adId: id,
      })
      return NextResponse.json(
        {
          error: 'Forbidden',
          message: 'You can only update your own ads',
        },
        { status: 403 }
      )
    }

    const ad = await updateAd(id, updates)
    if (!ad) {
      return NextResponse.json(
        { error: 'Failed to update ad' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ad })
  } catch (error: any) {
    console.error('Error in PUT /api/ads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 })
    }

    const existingAd = await getAdById(id)
    if (!existingAd) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    if (existingAd.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const success = await deleteAd(id)
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete ad' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE /api/ads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
