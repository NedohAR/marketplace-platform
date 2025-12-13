'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage, Conversation } from '@/types'
import { useAuthStore } from '@/store/useAuthStore'
import { FaPaperPlane, FaSpinner, FaComments } from 'react-icons/fa'

interface ChatWindowProps {
  conversationId: string | null
  conversation?: Conversation
  onBack?: () => void
}

export default function ChatWindow({
  conversationId,
}: ChatWindowProps) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    if (!conversationId || !user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }
      const data = await response.json()
      setMessages(data.messages || [])
      setError(null)
      setTimeout(scrollToBottom, 100)
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setError(err.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (conversationId) {
      loadMessages()
    } else {
      setMessages([])
      setLoading(false)
    }
  }, [conversationId, user])

  useEffect(() => {
    if (!conversationId || !user) return

    const pollMessages = () => {
      if (document.hidden) return
      
      fetch(`/api/messages?conversationId=${conversationId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages((prevMessages) => {
              const lastPrevId = prevMessages[prevMessages.length - 1]?.id
              const lastNewId = data.messages[data.messages.length - 1]?.id
              
              if (lastPrevId !== lastNewId || prevMessages.length !== data.messages.length) {
                const container = messagesContainerRef.current
                if (container) {
                  const isNearBottom =
                    container.scrollHeight - container.scrollTop - container.clientHeight < 100
                  if (isNearBottom) {
                    setTimeout(scrollToBottom, 100)
                  }
                }
                return data.messages
              }
              return prevMessages
            })
          }
        })
        .catch((err) => console.error('Error polling messages:', err))
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollMessages()
      }
    }

    const interval = setInterval(pollMessages, 3000) 

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [conversationId, user])

  const sendMessage = async () => {
    if (!conversationId || !messageContent.trim() || sending || !user) return

    const content = messageContent.trim()
    setMessageContent('')
    setSending(true)

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content,
          parentMessageId: replyingTo?.id || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      setMessages((prev) => [...prev, data.message])
      setReplyingTo(null)
      setTimeout(scrollToBottom, 100)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
      setMessageContent(content) 
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (dateString: string) => {
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
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">
            Select a conversation
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    )
  }

  if (loading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[75%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    {message.parentMessage && (
                      <div className="mb-1 px-3 py-1 bg-gray-100 rounded text-xs text-gray-600 border-l-2 border-gray-300">
                        <div className="font-medium">
                          {message.parentMessage.senderId === user?.id
                            ? 'You'
                            : 'User'}
                        </div>
                        <div className="truncate max-w-[200px]">
                          {message.parentMessage.content}
                        </div>
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            style={{ minHeight: '44px', maxHeight: '120px' }}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={!messageContent.trim() || sending}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {sending ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

