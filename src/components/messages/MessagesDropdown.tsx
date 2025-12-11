'use client'

import { useState, useEffect, useRef } from 'react'
import { Message } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaAd } from 'react-icons/fa'
import Link from 'next/link'

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
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    if (user) {
      loadMessages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (isOpen && user) {
      loadMessages()
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

  const loadMessages = () => {
    if (!user || typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(`messages-${user.id}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        setMessages(parsed)
      } else {
        setMessages([])
      }
    } catch (e) {
      setMessages([])
    }
  }

  const markAsRead = (messageId: string) => {
    if (!user || typeof window === 'undefined') return
    const updated = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    )
    setMessages(updated)
    try {
      localStorage.setItem(`messages-${user.id}`, JSON.stringify(updated))
      if (onUpdateCount) {
        onUpdateCount()
      }
    } catch (e) {
      console.error('Failed to save message:', e)
    }
  }

  const deleteMessage = (messageId: string) => {
    if (!user || typeof window === 'undefined') return
    const updated = messages.filter((msg) => msg.id !== messageId)
    setMessages(updated)
    try {
      localStorage.setItem(`messages-${user.id}`, JSON.stringify(updated))
      if (onUpdateCount) {
        onUpdateCount()
      }
    } catch (e) {
      console.error('Failed to delete message:', e)
    }
  }

  const unreadCount = messages.filter((msg) => !msg.read).length

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
        <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {!mounted ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FaEnvelope className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No messages yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Messages from other users will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 transition-colors ${
                  message.read ? 'bg-white' : 'bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {message.read ? (
                        <FaEnvelopeOpen className="text-gray-400 text-sm flex-shrink-0" />
                      ) : (
                        <FaEnvelope className="text-orange-500 text-sm flex-shrink-0" />
                      )}
                      <span
                        className={`font-semibold truncate ${
                          message.read ? 'text-gray-700' : 'text-gray-900'
                        }`}
                      >
                        {message.fromUserName}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(message.date)}
                      </span>
                    </div>

                    {message.adTitle && (
                      <div className="mb-2">
                        <Link
                          href={message.adId ? `/ad/${message.adId}` : '#'}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 truncate"
                        >
                          <FaAd className="text-xs flex-shrink-0" />
                          <span className="truncate">{message.adTitle}</span>
                        </Link>
                      </div>
                    )}

                    <p
                      className={`text-sm line-clamp-2 ${
                        message.read ? 'text-gray-600' : 'text-gray-800'
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>

                  <div className="flex items-start gap-1 flex-shrink-0">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                        title="Mark as read"
                      >
                        <FaEnvelopeOpen className="text-xs" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete message"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
