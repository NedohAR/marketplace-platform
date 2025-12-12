import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/users-storage'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const user = await getUserByEmail(email)

  if (!user) {
    return NextResponse.json({ user: null })
  }

  const { password, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, location } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const newUser = await createUser(email, password, name, phone, location)

    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
