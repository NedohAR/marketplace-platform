'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdStore } from '@/store/useAdStore'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { FaSearch, FaPlus, FaUser, FaHeart, FaEnvelope } from 'react-icons/fa'
import SearchAutocomplete from '../filters/SearchAutocomplete'
import MessagesDropdown from '../messages/MessagesDropdown'

export default function Header() {
  const router = useRouter()
  const { searchQuery, setSearchQuery, favorites, resetFilters } = useAdStore()
  const { data: session, status } = useSession()
  const user = session?.user
  const isAuthenticated = status === 'authenticated'
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [mounted, setMounted] = useState(false)
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user && typeof window !== 'undefined') {
      const loadUnreadCount = () => {
        try {
          const stored = localStorage.getItem(`messages-${user.id}`)
          if (stored) {
            const messages = JSON.parse(stored)
            const unread = messages.filter((msg: any) => !msg.read).length
            setUnreadMessagesCount(unread)
          } else {
            setUnreadMessagesCount(0)
          }
        } catch (e) {
          setUnreadMessagesCount(0)
        }
      }

      loadUnreadCount()
      const interval = setInterval(loadUnreadCount, 10000)
      return () => clearInterval(interval)
    }
  }, [mounted, user])

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = localSearch.trim()
    setSearchQuery(trimmedQuery)
    if (trimmedQuery && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath !== '/') {
        window.location.href = '/'
      }
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    resetFilters()
    setLocalSearch('')
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              prefetch={true}
            >
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Marketplace
              </span>
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-1 w-full sm:max-w-2xl order-3 sm:order-2"
          >
            <div className="flex gap-2">
              <SearchAutocomplete
                value={localSearch}
                onChange={setLocalSearch}
                onSearch={(query) => {
                  setSearchQuery(query)
                }}
                placeholder="Search ads..."
              />
              <button
                type="submit"
                className="px-3 sm:px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium flex-shrink-0"
              >
                <FaSearch />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="flex flex-row items-center gap-1 sm:gap-2 order-2 sm:order-3 w-full sm:w-auto">
            <Link
              href="/favorites"
              className="relative flex-1 sm:flex-none px-3 py-2.5 sm:p-2.5 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 group"
              prefetch={true}
            >
              <FaHeart className="text-base sm:text-lg" />
              <span className="hidden xs:inline sm:hidden text-xs font-medium">
                Favorites
              </span>
              {mounted && favorites.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold shadow-sm text-[10px] sm:text-xs"
                  suppressHydrationWarning
                >
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>
            {mounted && isAuthenticated && user && (
              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                  className={`relative w-full sm:w-auto px-3 py-2.5 sm:p-2.5 rounded-lg text-gray-600 hover:text-orange-500 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 group ${
                    isMessagesOpen
                      ? 'bg-orange-50 text-orange-500'
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <FaEnvelope className="text-base sm:text-lg" />
                  <span className="hidden xs:inline sm:hidden text-xs font-medium">
                    Messages
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold shadow-sm text-[10px] sm:text-xs"
                      suppressHydrationWarning
                    >
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </button>
                <MessagesDropdown
                  isOpen={isMessagesOpen}
                  onClose={() => setIsMessagesOpen(false)}
                  onUpdateCount={() => {
                    if (user && typeof window !== 'undefined') {
                      try {
                        const stored = localStorage.getItem(
                          `messages-${user.id}`
                        )
                        if (stored) {
                          const messages = JSON.parse(stored)
                          const unread = messages.filter(
                            (msg: any) => !msg.read
                          ).length
                          setUnreadMessagesCount(unread)
                        } else {
                          setUnreadMessagesCount(0)
                        }
                      } catch (e) {
                        setUnreadMessagesCount(0)
                      }
                    }
                  }}
                />
              </div>
            )}
            <Link
              href="/post-ad"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
              prefetch={true}
            >
              <FaPlus className="text-sm sm:text-base" />
              <span className="hidden xs:inline sm:inline">Post Ad</span>
            </Link>
            {!mounted ? (
              <div className="flex-1 sm:flex-none px-3 sm:px-3 py-2.5 sm:py-2.5 text-gray-600 flex items-center justify-center gap-1 sm:gap-2 rounded-lg">
                <FaUser className="text-sm sm:text-base" />
                <span className="hidden xs:inline sm:hidden text-xs">
                  Sign In
                </span>
                <span className="hidden sm:inline md:hidden">Sign In</span>
                <span className="hidden md:inline">Sign In</span>
              </div>
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1 sm:gap-2 px-3 sm:px-3 py-2.5 sm:py-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
                suppressHydrationWarning
                prefetch={true}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hidden xs:inline sm:inline font-medium text-xs sm:text-base">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-2.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 rounded-lg font-medium text-sm sm:text-base"
                prefetch={true}
              >
                <FaUser className="text-sm sm:text-base" />
                <span className="hidden xs:inline sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
