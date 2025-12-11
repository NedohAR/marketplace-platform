'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { Message } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaAd } from 'react-icons/fa'
import Link from 'next/link'

interface MessagesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (user) {
      loadMessages()
    }
  }, [user])

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Messages" size="lg">
      {!mounted ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No messages yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Messages from other users will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border transition-colors ${
                message.read
                  ? 'bg-white border-gray-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {message.read ? (
                      <FaEnvelopeOpen className="text-gray-400 text-sm" />
                    ) : (
                      <FaEnvelope className="text-orange-500 text-sm" />
                    )}
                    <span
                      className={`font-semibold ${
                        message.read ? 'text-gray-700' : 'text-gray-900'
                      }`}
                    >
                      {message.fromUserName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.date)}
                    </span>
                  </div>

                  {message.adTitle && (
                    <div className="mb-2">
                      <Link
                        href={message.adId ? `/ad/${message.adId}` : '#'}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                      >
                        <FaAd className="text-xs" />
                        {message.adTitle}
                      </Link>
                    </div>
                  )}

                  <p
                    className={`text-sm ${
                      message.read ? 'text-gray-600' : 'text-gray-800'
                    }`}
                  >
                    {message.content}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <FaEnvelopeOpen className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {unreadCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Modal>
  )
}
