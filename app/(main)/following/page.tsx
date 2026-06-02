import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/feed/PostCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Following',
  description: 'Posts from people you follow on CareerDown.',
}

export default async function FollowingPage() {
  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  if (!currentUserId) {
    return (
      <EmptyState
        icon="🔒"
        title="Sign in to see your feed"
        description="Follow people to see their posts here."
        action={{ label: 'Sign In', href: '/login' }}
      />
    )
  }

  const follows = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  })
  const followingIds = follows.map((f) => f.followingId)

  const include = {
    author: true,
    topics: { include: { topic: true } },
    _count: { select: { likes: true, comments: true, reposts: true } },
  }

  const posts = followingIds.length > 0
    ? await prisma.post.findMany({
        where: { authorId: { in: followingIds } },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include,
      })
    : []

  const likedPostIds = new Set<string>()
  const repostedPostIds = new Set<string>()
  if (posts.length > 0) {
    const ids = posts.map((p) => p.id)
    const [likes, reposts] = await Promise.all([
      prisma.like.findMany({ where: { userId: currentUserId, postId: { in: ids } }, select: { postId: true } }),
      prisma.repost.findMany({ where: { userId: currentUserId, postId: { in: ids } }, select: { postId: true } }),
    ])
    likes.forEach((l) => likedPostIds.add(l.postId))
    reposts.forEach((r) => repostedPostIds.add(r.postId))
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Following</h1>

      {posts.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No posts yet"
          description="Follow some people on CareerDown to see their posts here."
          action={{ label: 'Explore People', href: '/explore' }}
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              isLiked={likedPostIds.has(post.id)}
              isReposted={repostedPostIds.has(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
