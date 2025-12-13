import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  try {
    const envContent = readFileSync(
      resolve(process.cwd(), '.env.local'),
      'utf-8'
    )
    const match = envContent.match(/DATABASE_URL=(.+)/)
    if (match) {
      connectionString = match[1].trim().replace(/^["']|["']$/g, '')
    }
  } catch (e) {
  }
}

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
})

const promotedAds = [
  {
    title: 'Продам iPhone 13 Pro Max 256GB',
    description:
      'Отличное состояние, все работает, коробка и зарядка в комплекте',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    category: 'electronics',
    location: 'Киев',
    condition: 'new' as const,
    dealType: 'sell' as const,
    userName: 'Александр',
  },
  {
    title: 'Квартира 2 комнаты, центр',
    description: 'Уютная квартира в центре города, хороший ремонт',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    category: 'real-estate',
    location: 'Киев',
    condition: undefined,
    dealType: 'sell' as const,
    userName: 'Мария',
  },
  {
    title: 'Toyota Camry 2018',
    description: 'Пробег 50000 км, один владелец, полная комплектация',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    category: 'transport',
    location: 'Одесса',
    condition: 'used' as const,
    dealType: 'sell' as const,
    userName: 'Дмитрий',
  },
  {
    title: 'Диван угловой, новый',
    description: 'Куплен месяц назад, не подошел по размеру',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    category: 'furniture',
    location: 'Харьков',
    condition: 'new' as const,
    dealType: 'sell' as const,
    userName: 'Ольга',
  },
  {
    title: 'Куртка зимняя, размер M',
    description: 'Отличное состояние, носилась один сезон',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'clothing',
    location: 'Львов',
    condition: 'used' as const,
    dealType: 'sell' as const,
    userName: 'Анна',
  },
  {
    title: 'Щенок лабрадора',
    description: 'Щенки с документами, привиты, родители с родословной',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    category: 'animals',
    location: 'Киев',
    condition: undefined,
    dealType: 'sell' as const,
    userName: 'Иван',
  },
  {
    title: 'MacBook Pro 14" M2',
    description: 'Новый, в упаковке, гарантия, все аксессуары',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'electronics',
    location: 'Киев',
    condition: 'new' as const,
    dealType: 'sell' as const,
    userName: 'Сергей',
  },
  {
    title: 'BMW X5 2020',
    description: 'Полный пакет, один владелец, сервисная книжка',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    category: 'transport',
    location: 'Одесса',
    condition: 'used' as const,
    dealType: 'sell' as const,
    userName: 'Елена',
  },
]

async function getOrCreateUser(name: string) {
  let user = await prisma.user.findFirst({
    where: { name },
  })

  if (!user) {
    const baseEmail = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
    const baseUsername = name.toLowerCase().replace(/\s+/g, '_')

    let email = baseEmail
    let username = baseUsername
    let counter = 1

    while (await prisma.user.findUnique({ where: { email } })) {
      email = `${name.toLowerCase().replace(/\s+/g, '.')}${counter}@example.com`
      counter++
    }

    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}_${counter}`
      counter++
    }

    const hashedPassword = await bcrypt.hash('password123', 10)

    user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
      },
    })

    console.log(`✅ Created user: ${name} (${email})`)
  }

  return user
}

async function main() {
  console.log('🌱 Starting seed...')

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

  for (const adData of promotedAds) {
    const user = await getOrCreateUser(adData.userName)

    let category = await prisma.category.findUnique({
      where: { slug: adData.category },
    })

    if (!category && categoryMap[adData.category]) {
      category = await prisma.category.create({
        data: {
          name: categoryMap[adData.category].name,
          slug: adData.category,
          icon: categoryMap[adData.category].icon,
        },
      })
      console.log(`✅ Created category: ${category.name}`)
    }

    if (!category) {
      console.log(
        `⚠️  Category "${adData.category}" not found, skipping ad: ${adData.title}`
      )
      continue
    }

    const existingAd = await prisma.ad.findFirst({
      where: {
        title: adData.title,
        userId: user.id,
      },
    })

    if (existingAd) {
      console.log(
        `⏭️  Ad already exists for user ${user.name}: ${adData.title}`
      )
      continue
    }

    const ad = await prisma.ad.create({
      data: {
        title: adData.title,
        description: adData.description,
        price: adData.price,
        categoryId: category.id,
        location: adData.location,
        userId: user.id,
        condition: adData.condition
          ? (adData.condition.toUpperCase().replace(/-/g, '_') as any)
          : null,
        dealType: adData.dealType
          ? (adData.dealType.toUpperCase() as any)
          : null,
        promoted: true,
        status: 'ACTIVE',
        images: {
          create: {
            url: adData.image,
            order: 0,
          },
        },
      },
    })

    console.log(`✅ Created promoted ad: ${ad.title} (owner: ${user.name})`)
  }

  console.log('✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
