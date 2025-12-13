'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { useToastStore } from '@/store/useToastStore'
import { useRouter } from 'next/navigation'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  recipientId: string
  recipientName: string
  adId?: string
  adTitle?: string
}

export default function MessageModal({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  adId,
  adTitle,
}: MessageModalProps) {
  const [messageContent, setMessageContent] = useState('')
  const [sending, setSending] = useState(false)
  const { success, error } = useToastStore()
  const router = useRouter()

  const handleSend = async () => {
    if (!messageContent.trim() || sending) return

    setSending(true)

    try {
      const convResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: recipientId,
          adId: adId || null,
        }),
      })

      if (!convResponse.ok) {
        throw new Error('Failed to create conversation')
      }

      const convData = await convResponse.json()
      const conversationId = convData.conversation.id

      const messageResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: messageContent.trim(),
          adId: adId || null,
        }),
      })

      if (!messageResponse.ok) {
        throw new Error('Failed to send message')
      }

      success('Message sent successfully!')
      setMessageContent('')
      onClose()
      router.push(`/messages?conversation=${conversationId}`)
    } catch (e: any) {
      console.error('Error sending message:', e)
      error(e.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Message" size="md">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="message-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message-input"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            disabled={sending}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </Modal> 
  )
}
