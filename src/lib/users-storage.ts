import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface StoredUser {
  id: string
  email: string
  password: string
  name: string
  phone?: string | null
  location?: string | null
  createdAt: string
}

export async function getUsers(): Promise<StoredUser[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    })
    return users.map(
      (user: {
        id: string
        email: string
        password: string
        name: string | null
        phone: string | null
        createdAt: Date
      }) => ({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name || '',
        phone: user.phone,
        location: null,
        createdAt: user.createdAt.toISOString(),
      })
    )
  } catch (e) {
    console.error('Error loading users:', e)
    return []
  }
}

export async function getUserByEmail(
  email: string
): Promise<StoredUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name || '',
      phone: user.phone,
      location: null,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (e) {
    console.error('Error getting user by email:', e)
    return null
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  phone?: string,
  location?: string
): Promise<StoredUser> {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  let username = email.toLowerCase().split('@')[0]
  let usernameExists = await prisma.user.findUnique({
    where: { username },
  })

  if (usernameExists) {
    username = username + Math.random().toString(36).slice(2, 8)
  }

  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone,
      username,
    },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      phone: true,
      createdAt: true,
    },
  })

  return {
    id: newUser.id,
    email: newUser.email,
    password: newUser.password,
    name: newUser.name || '',
    phone: newUser.phone,
    location: location || null,
    createdAt: newUser.createdAt.toISOString(),
  }
}

export async function verifyPassword(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = await getUserByEmail(email)
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
