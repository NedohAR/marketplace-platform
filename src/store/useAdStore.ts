import { create } from 'zustand'
import { Ad, Category, AdCondition, DealType } from '@/types'

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-low'
  | 'price-high'
  | 'views'
export type DateFilter = 'all' | 'today' | 'week' | 'month' | null

interface Filters {
  minPrice: number | null
  maxPrice: number | null
  location: string | null
  category: string | null
  categories: string[] // Мультиселект категорий
  condition: string | null // Состояние товара
  dealType: string | null // Тип сделки
  dateFilter: DateFilter
  customDate: string | null
}

interface ViewHistoryItem {
  adId: string
  viewedAt: string
}

interface AdContact {
  adId: string
  contactType: 'phone' | 'message'
  contactedAt: string
}

interface SellerStats {
  adId: string
  views: number
  phoneClicks: number
  messageClicks: number
}

interface AdStore {
  ads: Ad[]
  categories: Category[]
  selectedCategory: string | null
  searchQuery: string
  sortBy: SortOption
  filters: Filters
  favorites: string[]
  searchHistory: string[]
  viewHistory: ViewHistoryItem[]
  sellerStats: Record<string, SellerStats>
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sort: SortOption) => void
  setFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
  toggleFavorite: (adId: string) => void
  isFavorite: (adId: string) => boolean
  getAdsByCategory: (categorySlug: string) => Ad[]
  getFilteredAndSortedAds: (ads: Ad[]) => Ad[]
  getAdById: (id: string) => Ad | undefined
  addAd: (ad: Omit<Ad, 'id' | 'date' | 'views' | 'status'>) => void
  updateAd: (id: string, updates: Partial<Ad>) => void
  archiveAd: (id: string) => void
  deleteAd: (id: string) => void
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  getSearchSuggestions: (query: string) => string[]
  addToViewHistory: (adId: string) => void
  getRecentViews: (limit?: number) => Ad[]
  getRelatedAds: (adId: string, limit?: number) => Ad[]
  getSellerAds: (userId: string, excludeAdId?: string, limit?: number) => Ad[]
  trackContact: (adId: string, contactType: 'phone' | 'message') => void
  getSellerStats: (userId: string) => SellerStats[]
}

const mockCategories: Category[] = [
  { id: '1', name: 'Transport', iconName: 'car', slug: 'transport' },
  { id: '2', name: 'Real Estate', iconName: 'home', slug: 'real-estate' },
  { id: '3', name: 'Electronics', iconName: 'mobile', slug: 'electronics' },
  { id: '4', name: 'Clothing', iconName: 'clothing', slug: 'clothing' },
  { id: '5', name: 'Furniture', iconName: 'furniture', slug: 'furniture' },
  { id: '6', name: 'Jobs', iconName: 'briefcase', slug: 'jobs' },
  { id: '7', name: 'Services', iconName: 'tools', slug: 'services' },
  { id: '8', name: 'Animals', iconName: 'dog', slug: 'animals' },
]

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Продам iPhone 13 Pro Max 256GB',
    description:
      'Отличное состояние, все работает, коробка и зарядка в комплекте',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    category: 'electronics',
    location: 'Киев',
    date: '2024-01-15',
    views: 234,
    userId: '1',
    userName: 'Иван',
    promoted: true,
  },
  {
    id: '2',
    title: 'Квартира 2 комнаты, центр',
    description: 'Уютная квартира в центре города, хороший ремонт',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    category: 'real-estate',
    location: 'Киев',
    date: '2024-01-14',
    views: 567,
    userId: '2',
    userName: 'Мария',
    promoted: true,
  },
  {
    id: '3',
    title: 'Toyota Camry 2018',
    description: 'Пробег 50000 км, один владелец, полная комплектация',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    category: 'transport',
    location: 'Одесса',
    date: '2024-01-13',
    views: 890,
    userId: '3',
    userName: 'Алексей',
    promoted: true,
  },
  {
    id: '4',
    title: 'Диван угловой, новый',
    description: 'Куплен месяц назад, не подошел по размеру',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    category: 'furniture',
    location: 'Харьков',
    date: '2024-01-12',
    views: 123,
    userId: '4',
    userName: 'Ольга',
    promoted: true,
  },
  {
    id: '5',
    title: 'Куртка зимняя, размер M',
    description: 'Отличное состояние, носилась один сезон',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    category: 'clothing',
    location: 'Львов',
    date: '2024-01-11',
    views: 67,
    userId: '5',
    userName: 'Дмитрий',
    promoted: true,
  },
  {
    id: '6',
    title: 'Щенок лабрадора',
    description: 'Щенки с документами, привиты, родители с родословной',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    category: 'animals',
    location: 'Киев',
    date: '2024-01-10',
    views: 445,
    userId: '6',
    userName: 'Елена',
    promoted: true,
  },
  {
    id: '7',
    title: 'MacBook Pro 14" M2',
    description: 'Новый, в упаковке, гарантия, все аксессуары',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    category: 'electronics',
    location: 'Киев',
    date: '2024-01-09',
    views: 789,
    userId: '7',
    userName: 'Андрей',
    promoted: true,
  },
  {
    id: '8',
    title: 'BMW X5 2020',
    description: 'Полный пакет, один владелец, сервисная книжка',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    category: 'transport',
    location: 'Одесса',
    date: '2024-01-08',
    views: 1200,
    userId: '8',
    userName: 'Сергей',
    promoted: true,
  },
]

const loadAdsFromStorage = (): Ad[] => {
  if (typeof window === 'undefined') return mockAds
  try {
    const stored = localStorage.getItem('ads-storage')
    const version = localStorage.getItem('ads-storage-version')

    if (!stored || version !== '2') {
      if (typeof window !== 'undefined') {
        saveAdsToStorage(mockAds)
        localStorage.setItem('ads-storage-version', '2')
      }
      return mockAds
    }

    const parsed = JSON.parse(stored)
    const adsWithPromoted = parsed.map((ad: Ad) => ({
      ...ad,
      promoted: ad.promoted !== undefined ? ad.promoted : false,
    }))
    const mockIds = new Set(mockAds.map((ad) => ad.id))
    const userAds = adsWithPromoted.filter((ad: Ad) => !mockIds.has(ad.id))
    const result = [...mockAds, ...userAds]
    saveAdsToStorage(result)
    return result
  } catch (e) {
    if (typeof window !== 'undefined') {
      saveAdsToStorage(mockAds)
      localStorage.setItem('ads-storage-version', '2')
    }
  }
  return mockAds
}

const saveAdsToStorage = (ads: Ad[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('ads-storage', JSON.stringify(ads))
  } catch (e) {}
}

const loadFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('favorites-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return []
}

const loadFiltersFromStorage = (): Filters => {
  if (typeof window === 'undefined') {
    return {
      minPrice: null,
      maxPrice: null,
      location: null,
      category: null,
      categories: [],
      condition: null,
      dealType: null,
      dateFilter: null,
      customDate: null,
    }
  }
  try {
    const stored = localStorage.getItem('filters-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        categories: parsed.categories || [],
        condition: parsed.condition || null,
        dealType: parsed.dealType || null,
      }
    }
  } catch (e) {}
  return {
    minPrice: null,
    maxPrice: null,
    location: null,
    category: null,
    categories: [],
    condition: null,
    dealType: null,
    dateFilter: null,
    customDate: null,
  }
}

const saveFiltersToStorage = (filters: Filters) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('filters-storage', JSON.stringify(filters))
  } catch (e) {}
}

const loadSearchHistoryFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('search-history-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return []
}

const saveSearchHistoryToStorage = (history: string[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('search-history-storage', JSON.stringify(history))
  } catch (e) {}
}

const loadViewHistoryFromStorage = (): ViewHistoryItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('view-history-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return []
}

const saveViewHistoryToStorage = (history: ViewHistoryItem[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('view-history-storage', JSON.stringify(history))
  } catch (e) {}
}

const loadSellerStatsFromStorage = (): Record<string, SellerStats> => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem('seller-stats-storage')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {}
  return {}
}

const saveSellerStatsToStorage = (stats: Record<string, SellerStats>) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('seller-stats-storage', JSON.stringify(stats))
  } catch (e) {}
}

export const useAdStore = create<AdStore>((set, get) => ({
  ads: loadAdsFromStorage(),
  categories: mockCategories,
  selectedCategory: null,
  searchQuery: '',
  sortBy: 'newest',
  filters: loadFiltersFromStorage(),
  favorites: loadFavoritesFromStorage(),
  searchHistory: loadSearchHistoryFromStorage(),
  viewHistory: loadViewHistoryFromStorage(),
  sellerStats: loadSellerStatsFromStorage(),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    if (query.trim()) {
      get().addToSearchHistory(query.trim())
    }
  },
  setSortBy: (sort) => set({ sortBy: sort }),
  setFilters: (newFilters) => {
    const updatedFilters = { ...get().filters, ...newFilters }
    set({ filters: updatedFilters })
    saveFiltersToStorage(updatedFilters)
  },
  resetFilters: () => {
    const defaultFilters = {
      minPrice: null,
      maxPrice: null,
      location: null,
      category: null,
      categories: [],
      condition: null,
      dealType: null,
      dateFilter: null,
      customDate: null,
    }
    set({
      searchQuery: '',
      selectedCategory: null,
      sortBy: 'newest',
      filters: defaultFilters,
    })
    saveFiltersToStorage(defaultFilters)
  },
  toggleFavorite: (adId) => {
    const newFavorites = get().favorites.includes(adId)
      ? get().favorites.filter((id) => id !== adId)
      : [...get().favorites, adId]
    set({ favorites: newFavorites })
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites-storage', JSON.stringify(newFavorites))
    }
  },
  isFavorite: (adId) => get().favorites.includes(adId),
  getAdsByCategory: (categorySlug) => {
    return get().ads.filter(
      (ad) =>
        ad.category === categorySlug && (!ad.status || ad.status === 'active')
    )
  },
  getFilteredAndSortedAds: (ads) => {
    const { filters, sortBy } = get()
    let filtered = [...ads]

    if (filters.minPrice !== null) {
      filtered = filtered.filter((ad) => ad.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== null) {
      filtered = filtered.filter((ad) => ad.price <= filters.maxPrice!)
    }

    if (filters.location) {
      filtered = filtered.filter((ad) =>
        ad.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }

    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((ad) =>
        filters.categories.includes(ad.category)
      )
    } else if (filters.category) {
      filtered = filtered.filter((ad) => ad.category === filters.category)
    }

    if (filters.condition) {
      filtered = filtered.filter((ad) => ad.condition === filters.condition)
    }

    if (filters.dealType) {
      filtered = filtered.filter((ad) => ad.dealType === filters.dealType)
    }

    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date()
      const adDate = new Date()

      filtered = filtered.filter((ad) => {
        const publishedDate = new Date(ad.date)

        switch (filters.dateFilter) {
          case 'today': {
            const todayStart = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            )
            return publishedDate >= todayStart
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return publishedDate >= weekAgo
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return publishedDate >= monthAgo
          }
          default:
            return true
        }
      })
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'views':
          return b.views - a.views
        default:
          return 0
      }
    })

    return filtered
  },
  getAdById: (id) => {
    return get().ads.find((ad) => ad.id === id)
  },
  addAd: (adData) => {
    const newAd: Ad = {
      ...adData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      views: 0,
      status: 'active',
    }
    const newAds = [newAd, ...get().ads]
    set({ ads: newAds })
    saveAdsToStorage(newAds)
  },
  updateAd: (id, updates) => {
    const newAds = get().ads.map((ad) =>
      ad.id === id ? { ...ad, ...updates } : ad
    )
    set({ ads: newAds })
    saveAdsToStorage(newAds)
  },
  archiveAd: (id) => {
    const newAds = get().ads.map((ad) =>
      ad.id === id ? { ...ad, status: 'archived' as const } : ad
    )
    set({ ads: newAds })
    saveAdsToStorage(newAds)
  },
  deleteAd: (id) => {
    const newAds = get().ads.filter((ad) => ad.id !== id)
    set({ ads: newAds })
    saveAdsToStorage(newAds)
  },
  addToSearchHistory: (query: string) => {
    const history = get().searchHistory
    const newHistory = [
      query,
      ...history.filter((item) => item !== query),
    ].slice(0, 10)
    set({ searchHistory: newHistory })
    saveSearchHistoryToStorage(newHistory)
  },
  clearSearchHistory: () => {
    set({ searchHistory: [] })
    saveSearchHistoryToStorage([])
  },
  getSearchSuggestions: (query: string) => {
    if (!query.trim()) return []
    const queryLower = query.toLowerCase()
    const { ads } = get()

    const suggestions = new Set<string>()

    ads.forEach((ad) => {
      const titleWords = ad.title.toLowerCase().split(/\s+/)
      titleWords.forEach((word) => {
        if (word.startsWith(queryLower) && word.length > queryLower.length) {
          suggestions.add(word)
        }
      })

      const descWords = ad.description.toLowerCase().split(/\s+/)
      descWords.forEach((word) => {
        if (word.startsWith(queryLower) && word.length > queryLower.length) {
          suggestions.add(word)
        }
      })

      const category = get().categories.find((cat) => cat.slug === ad.category)
      if (category && category.name.toLowerCase().includes(queryLower)) {
        suggestions.add(category.name)
      }
    })

    return Array.from(suggestions).slice(0, 5)
  },
  addToViewHistory: (adId: string) => {
    const history = get().viewHistory
    const newHistory = [
      { adId, viewedAt: new Date().toISOString() },
      ...history.filter((item) => item.adId !== adId),
    ].slice(0, 20)
    set({ viewHistory: newHistory })
    saveViewHistoryToStorage(newHistory)
  },
  getRecentViews: (limit = 5) => {
    const history = get().viewHistory.slice(0, limit)
    const { ads } = get()
    return history
      .map((item) => ads.find((ad) => ad.id === item.adId))
      .filter((ad): ad is Ad => ad !== undefined)
  },
  getRelatedAds: (adId: string, limit = 4) => {
    const ad = get().getAdById(adId)
    if (!ad) return []

    const { ads } = get()
    const related = ads
      .filter(
        (a) =>
          a.id !== adId &&
          a.category === ad.category &&
          (!a.status || a.status === 'active')
      )
      .slice(0, limit)

    return related
  },
  getSellerAds: (userId: string, excludeAdId?: string, limit = 4) => {
    const { ads } = get()
    const sellerAds = ads
      .filter(
        (a) =>
          a.userId === userId &&
          a.id !== excludeAdId &&
          (!a.status || a.status === 'active')
      )
      .slice(0, limit)

    return sellerAds
  },
  trackContact: (adId: string, contactType: 'phone' | 'message') => {
    const stats = get().sellerStats
    const currentStats = stats[adId] || {
      adId,
      views: 0,
      phoneClicks: 0,
      messageClicks: 0,
    }

    const updatedStats = {
      ...stats,
      [adId]: {
        ...currentStats,
        [contactType === 'phone' ? 'phoneClicks' : 'messageClicks']:
          currentStats[
            contactType === 'phone' ? 'phoneClicks' : 'messageClicks'
          ] + 1,
      },
    }

    set({ sellerStats: updatedStats })
    saveSellerStatsToStorage(updatedStats)
  },
  getSellerStats: (userId: string) => {
    const { ads, sellerStats } = get()
    const userAds = ads.filter((ad) => ad.userId === userId)

    return userAds.map((ad) => {
      const stats = sellerStats[ad.id] || {
        adId: ad.id,
        views: ad.views || 0,
        phoneClicks: 0,
        messageClicks: 0,
      }
      return {
        ...stats,
        adTitle: ad.title,
        views: ad.views || 0,
      }
    })
  },
}))
