'use server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Not authenticated')
  const userId = (session.user as { id: string }).id

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { userId_postId: { userId, postId } } })
  } else {
    await prisma.like.create({ data: { userId, postId } })
  }

  const count = await prisma.like.count({ where: { postId } })
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } })

  revalidatePath('/')
  if (post?.slug) revalidatePath(`/post/${post.slug}`)

  return { liked: !existing, count }
}

export async function toggleRepost(postId: string): Promise<{ reposted: boolean; count: number }> {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Not authenticated')
  const userId = (session.user as { id: string }).id

  const existing = await prisma.repost.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  if (existing) {
    await prisma.repost.delete({ where: { userId_postId: { userId, postId } } })
  } else {
    await prisma.repost.create({ data: { userId, postId } })
  }

  const count = await prisma.repost.count({ where: { postId } })
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } })

  revalidatePath('/')
  if (post?.slug) revalidatePath(`/post/${post.slug}`)

  return { reposted: !existing, count }
}

export async function toggleFollow(targetUserId: string): Promise<{ following: boolean }> {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Not authenticated')
  const followerId = (session.user as { id: string }).id

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: targetUserId } },
  })

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId: targetUserId } },
    })
  } else {
    await prisma.follow.create({ data: { followerId, followingId: targetUserId } })
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { username: true },
  })
  if (targetUser?.username) revalidatePath(`/u/${targetUser.username}`)

  return { following: !existing }
}

export async function getFollowStatus(targetUserId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return false
  const followerId = (session.user as { id: string }).id

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: targetUserId } },
  })

  return !!existing
}
