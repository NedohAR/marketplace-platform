'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { FaComments, FaCircle } from 'react-icons/fa'
import Image from 'next/image'
import { formatPrice } from '@/utils/format'

interface ChatsListProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversationId?: string
}

export default function ChatsList({
  onSelectConversation,
  selectedConversationId,
}: ChatsListProps) {
  const { user } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadConversations = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/conversations')
      if (!response.ok) {
        throw new Error('Failed to load conversations')
      }
      const data = await response.json()
      setConversations(data.conversations || [])
      setError(null)
    } catch (err: any) {
      console.error('Error loading conversations:', err)
      setError(err.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])


  useEffect(() => {
    if (!user) return

    const handleVisibilityChange = () => {
      if (document.hidden) return
      loadConversations()
    }

    const interval = setInterval(() => {
      if (!document.hidden) {
        loadConversations()
      }
    }, 5000) 

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, loadConversations])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 8640000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading conversations...</p>
        </div>
      </div>
    )
  }

  if (error && conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={loadConversations}
            className="text-orange-500 hover:text-orange-600 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <FaComments className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No conversations yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Start a conversation by messaging a seller
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversationId
          const hasUnread = conversation.unreadCount > 0

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-orange-50 border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold truncate ${
                        hasUnread ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {conversation.otherUser.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {conversation.lastMessage
                        ? formatTime(conversation.lastMessage.createdAt)
                        : formatTime(conversation.createdAt)}
                    </span>
                  </div>

                  {conversation.ad && (
                    <div className="text-xs text-orange-600 mb-1 truncate">
                      {conversation.ad.title}
                    </div>
                  )}

                  {conversation.lastMessage ? (
                    <p
                      className={`text-sm truncate ${
                        hasUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {conversation.lastMessage.senderId === user?.id && (
                        <span className="text-gray-500">You: </span>
                      )}
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No messages yet
                    </p>
                  )}

                  {hasUnread && (
                    <div className="mt-1">
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
    </div>
  )
}

