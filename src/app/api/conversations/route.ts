import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth-helpers'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
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
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    })

    const transformedConversations = conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1
      const lastMessage = conv.messages[0] || null

      return {
        id: conv.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.name || otherUser.username,
          username: otherUser.username,
          avatar: otherUser.avatar,
        },
        ad: conv.ad,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              senderName: lastMessage.sender.name || lastMessage.sender.username,
              isRead: lastMessage.isRead,
              createdAt: lastMessage.createdAt,
            }
          : null,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
      }
    })

    const conversationIds = transformedConversations.map((c) => c.id)
    const unreadCounts = await prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversationIds },
        recipientId: userId,
        isRead: false,
      },
      _count: {
        id: true,
      },
    })

    const unreadCountMap = new Map(
      unreadCounts.map((uc) => [uc.conversationId, uc._count.id])
    )

    const result = transformedConversations.map((conv) => ({
      ...conv,
      unreadCount: unreadCountMap.get(conv.id) || 0,
    }))

    return NextResponse.json({ conversations: result })
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error)
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
    const { userId: otherUserId, adId } = body

    if (!otherUserId) {
      return NextResponse.json(
        { error: 'Other user ID is required' },
        { status: 400 }
      )
    }

    if (otherUserId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      )
    }

    const currentUserId = session.user.id

    const user1Id = currentUserId < otherUserId ? currentUserId : otherUserId
    const user2Id = currentUserId < otherUserId ? otherUserId : currentUserId

    const existing = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id_adId: {
          user1Id,
          user2Id,
          adId: adId || null,
        },
      },
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

    if (existing) {
      const otherUser = existing.user1Id === currentUserId ? existing.user2 : existing.user1
      return NextResponse.json({
        conversation: {
          id: existing.id,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name || otherUser.username,
            username: otherUser.username,
            avatar: otherUser.avatar,
          },
          ad: existing.ad,
          lastMessage: null,
          lastMessageAt: existing.lastMessageAt,
          createdAt: existing.createdAt,
          unreadCount: 0,
        },
      })
    }

    const conversation = await prisma.conversation.create({
      data: {
        user1Id,
        user2Id,
        adId: adId || null,
      },
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

    const otherUser = conversation.user1Id === currentUserId ? conversation.user2 : conversation.user1

    return NextResponse.json(
      {
        conversation: {
          id: conversation.id,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name || otherUser.username,
            username: otherUser.username,
            avatar: otherUser.avatar,
          },
          ad: conversation.ad,
          lastMessage: null,
          lastMessageAt: conversation.lastMessageAt,
          createdAt: conversation.createdAt,
          unreadCount: 0,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error in POST /api/conversations:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

