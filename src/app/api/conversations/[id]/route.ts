import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.id
    const userId = session.user.id

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        ad: {
          select: {
            id: true,
            title: true,
            price: true,
            images: {
              select: {
                url: true,
                thumbnail: true,
              },
              take: 1,
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    if (
      conversation.user1Id !== userId &&
      conversation.user2Id !== userId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const otherUser =
      conversation.user1Id === userId ? conversation.user2 : conversation.user1

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

    const unreadMessageIds = messages
      .filter((msg) => msg.recipientId === userId && !msg.isRead)
      .map((msg) => msg.id)

    if (unreadMessageIds.length > 0) {
      await prisma.message.updateMany({
        where: {
          id: { in: unreadMessageIds },
        },
        data: {
          isRead: true,
        },
      })
    }

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
      conversation: {
        id: conversation.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name || otherUser.username,
          username: otherUser.username,
          avatar: otherUser.avatar,
        },
        ad: conversation.ad,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
      },
      messages: transformedMessages,
    })
  } catch (error: any) {
    console.error('Error in GET /api/conversations/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

