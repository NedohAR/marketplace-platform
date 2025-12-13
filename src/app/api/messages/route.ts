import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (
      conversation.user1Id !== session.user.id &&
      conversation.user2Id !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            senderId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const transformedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.sender.name || msg.sender.username || 'Unknown',
      senderAvatar: msg.sender.avatar || undefined,
      recipientId: msg.recipientId || undefined,
      conversationId: msg.conversationId,
      adId: msg.adId || undefined,
      parentMessageId: msg.parentMessageId || undefined,
      parentMessage: msg.parentMessage
        ? {
            id: msg.parentMessage.id,
            content: msg.parentMessage.content,
            senderId: msg.parentMessage.senderId,
          }
        : undefined,
      isRead: msg.isRead,
      createdAt: msg.createdAt.toISOString(),
    }))

    return NextResponse.json({
      messages: transformedMessages,
    })
  } catch (error: any) {
    console.error('Error in GET /api/messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { conversationId, content, parentMessageId, adId } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    let finalConversationId = conversationId

    if (!finalConversationId) {
      if (!body.userId) {
        return NextResponse.json(
          { error: 'Either conversationId or userId is required' },
          { status: 400 }
        )
      }

      const otherUserId = body.userId
      if (otherUserId === session.user.id) {
        return NextResponse.json(
          { error: 'Cannot send message to yourself' },
          { status: 400 }
        )
      }

      const user1Id =
        session.user.id < otherUserId ? session.user.id : otherUserId
      const user2Id =
        session.user.id < otherUserId ? otherUserId : session.user.id

      let conversation = await prisma.conversation.findUnique({
        where: {
          user1Id_user2Id_adId: {
            user1Id,
            user2Id,
            adId: adId || null,
          },
        },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            user1Id,
            user2Id,
            adId: adId || null,
          },
        })
      }

      finalConversationId = conversation.id
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: finalConversationId },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (
      conversation.user1Id !== session.user.id &&
      conversation.user2Id !== session.user.id
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const recipientId =
      conversation.user1Id === session.user.id
        ? conversation.user2Id
        : conversation.user1Id

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: session.user.id,
        recipientId,
        conversationId: finalConversationId,
        adId: adId || conversation.adId || null,
        parentMessageId: parentMessageId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        parentMessage: {
          select: {
            id: true,
            content: true,
            senderId: true,
          },
        },
      },
    })

    await prisma.conversation.update({
      where: { id: finalConversationId },
      data: { lastMessageAt: new Date() },
    })

    const transformedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || message.sender.username || 'Unknown',
      senderAvatar: message.sender.avatar || undefined,
      recipientId: message.recipientId || undefined,
      conversationId: message.conversationId,
      adId: message.adId || undefined,
      parentMessageId: message.parentMessageId || undefined,
      parentMessage: message.parentMessage
        ? {
            id: message.parentMessage.id,
            content: message.parentMessage.content,
            senderId: message.parentMessage.senderId,
          }
        : undefined,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    }

    return NextResponse.json({ message: transformedMessage }, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/messages:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

