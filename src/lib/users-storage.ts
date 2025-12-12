// Единое хранилище пользователей
// В продакшене заменить на БД

import bcrypt from 'bcryptjs'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface StoredUser {
  id: string
  email: string
  password: string // хешированный
  name: string
  phone?: string
  location?: string
  createdAt: string
}

const STORAGE_FILE = join(process.cwd(), 'users-data.json')

// Загрузка пользователей из файла
function loadUsers(): StoredUser[] {
  try {
    if (existsSync(STORAGE_FILE)) {
      const data = readFileSync(STORAGE_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error loading users:', e)
  }
  return []
}

// Сохранение пользователей в файл
function saveUsers(users: StoredUser[]) {
  try {
    writeFileSync(STORAGE_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (e) {
    console.error('Error saving users:', e)
  }
}

// Получить всех пользователей
export function getUsers(): StoredUser[] {
  return loadUsers()
}

// Получить пользователя по email
export function getUserByEmail(email: string): StoredUser | null {
  const users = loadUsers()
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  )
}

// Создать пользователя
export async function createUser(
  email: string,
  password: string,
  name: string,
  phone?: string,
  location?: string
): Promise<StoredUser> {
  const users = loadUsers()

  // Проверка существующего пользователя
  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    throw new Error('User already exists')
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser: StoredUser = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    email,
    password: hashedPassword,
    name,
    phone,
    location,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

// Проверить пароль
export async function verifyPassword(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = getUserByEmail(email)
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}
