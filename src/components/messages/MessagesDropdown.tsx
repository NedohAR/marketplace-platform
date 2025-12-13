'use client'

import { useState, useEffect, useRef } from 'react'
import { Conversation } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { FaEnvelope, FaEnvelopeOpen, FaAd } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MessagesDropdownProps {
  isOpen: boolean
  onClose: () => void
  onUpdateCount?: () => void
}

export default function MessagesDropdown({
  isOpen,
  onClose,
  onUpdateCount,
}: MessagesDropdownProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && user) {
      loadConversations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const loadConversations = async () => {
    if (!user) return
    try {
      setLoading(true)
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
        if (onUpdateCount) {
          onUpdateCount()
        }
      }
    } catch (e) {
      console.error('Failed to load conversations:', e)
      setConversations([])
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-[80vh] overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Link
            href="/messages"
            onClick={onClose}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {!mounted || loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Messages from other users will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations
              .filter((conv) => conv.lastMessage)
              .slice(0, 5)
              .map((conversation) => {
                const hasUnread = conversation.unreadCount > 0
                const lastMessage = conversation.lastMessage!
                const isFromMe = lastMessage.senderId === user?.id

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      onClose()
                      router.push(`/messages?conversation=${conversation.id}`)
                    }}
                    className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                      hasUnread ? 'bg-orange-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {hasUnread ? (
                            <FaEnvelope className="text-orange-500 text-sm flex-shrink-0" />
                          ) : (
                            <FaEnvelopeOpen className="text-gray-400 text-sm flex-shrink-0" />
                          )}
                          <span
                            className={`font-semibold truncate ${
                              hasUnread ? 'text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            {conversation.otherUser.name}
                          </span>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatDate(lastMessage.createdAt)}
                          </span>
                        </div>

                        {conversation.ad && (
                          <div className="mb-2">
                            <div className="inline-flex items-center gap-1 text-sm text-orange-600 truncate">
                              <FaAd className="text-xs flex-shrink-0" />
                              <span className="truncate">{conversation.ad.title}</span>
                            </div>
                          </div>
                        )}

                        <p
                          className={`text-sm line-clamp-2 ${
                            hasUnread ? 'text-gray-800 font-medium' : 'text-gray-600'
                          }`}
                        >
                          {isFromMe && <span className="text-gray-500">You: </span>}
                          {lastMessage.content}
                        </p>

                        {hasUnread && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {conversation.unreadCount} new
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
