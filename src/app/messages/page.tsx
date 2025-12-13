'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import ChatWindow from '@/components/messages/ChatWindow'
import { Conversation } from '@/types'
import PageLayout from '@/components/layout/PageLayout'

function MessagesContent() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null)

  const handleSelectConversation = useCallback(async (conversationId: string) => {
    setSelectedConversationId(conversationId)

    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedConversation({
          id: data.conversation.id,
          otherUser: data.conversation.otherUser,
          ad: data.conversation.ad,
          lastMessage: null,
          lastMessageAt: data.conversation.lastMessageAt,
          createdAt: data.conversation.createdAt,
          unreadCount: 0,
        })
      }
    } catch (err) {
      console.error('Error loading conversation:', err)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const conversationParam = searchParams.get('conversation')
    if (conversationParam && isAuthenticated) {
      handleSelectConversation(conversationParam)
    }
  }, [searchParams, isAuthenticated, handleSelectConversation])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
          <div
            className={`${
              selectedConversationId ? 'block' : 'hidden lg:block'
            } flex-1 flex flex-col`}
          >
            <ChatWindow
              conversationId={selectedConversationId}
              conversation={selectedConversation || undefined}
              onBack={() => setSelectedConversationId(null)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <PageLayout showBackButton={false}>
      <Suspense fallback={
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }>
        <MessagesContent />
      </Suspense>
    </PageLayout>
  )
}

