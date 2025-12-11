'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAdStore } from '@/store/useAdStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useState, useEffect } from 'react'
import { FaSearch, FaPlus, FaUser, FaHeart, FaEnvelope } from 'react-icons/fa'
import SearchAutocomplete from '../filters/SearchAutocomplete'
import MessagesDropdown from '../messages/MessagesDropdown'

export default function Header() {
  const router = useRouter()
  const { searchQuery, setSearchQuery, favorites, resetFilters } = useAdStore()
  const { user, isAuthenticated } = useAuthStore()
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            prefetch={true}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
              Marketplace
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
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
                className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
              >
                <FaSearch />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Link
              href="/favorites"
              className="relative p-2.5 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center group"
              prefetch={true}
            >
              <FaHeart className="text-lg" />
              {mounted && favorites.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm"
                  suppressHydrationWarning
                >
                  {favorites.length}
                </span>
              )}
            </Link>
            {mounted && isAuthenticated && user && (
              <div className="relative">
                <button
                  onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                  className={`relative p-2.5 rounded-lg text-gray-600 hover:text-orange-500 transition-all duration-200 flex items-center justify-center group ${
                    isMessagesOpen
                      ? 'bg-orange-50 text-orange-500'
                      : 'hover:bg-orange-50'
                  }`}
                >
                  <FaEnvelope className="text-lg" />
                  {unreadMessagesCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-sm"
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
              className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md font-medium"
              prefetch={true}
            >
              <FaPlus />
              <span className="hidden sm:inline">Post Ad</span>
            </Link>
            {!mounted ? (
              <div className="px-3 py-2.5 text-gray-600 flex items-center gap-2 rounded-lg">
                <FaUser />
                <span className="hidden md:inline">Sign In</span>
              </div>
            ) : isAuthenticated && user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
                suppressHydrationWarning
                prefetch={true}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="hidden md:inline font-medium">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2.5 text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center gap-2 rounded-lg font-medium"
                prefetch={true}
              >
                <FaUser />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
