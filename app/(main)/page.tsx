import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import RightRail from '@/components/layout/RightRail'
import PostCard from '@/components/feed/PostCard'
import { SortTabs } from '@/components/feed/SortTabs'
import { AdSlot } from '@/components/ads/AdSlot'
import { EmptyState } from '@/components/ui/EmptyState'

type PostResult = {
  id: string
  type: string
  title: string | null
  body: string
  slug: string
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    id: string
    username: string
    displayName: string
    avatarUrl: string | null
    bio: string | null
    email: string
    createdAt: Date
  }
  topics: { topic: { id: string; name: string; slug: string } }[]
  _count: { likes: number; comments: number; reposts: number }
}

function engagementScore(post: {
  _count: { likes: number; comments: number; reposts: number }
  createdAt: Date
}): number {
  const now = Date.now()
  const ageMs = now - new Date(post.createdAt).getTime()
  const ageH = ageMs / (1000 * 60 * 60)
  const recencyBoost = ageH < 24 ? 10 : ageH < 48 ? 5 : 0
  return post._count.likes * 2 + post._count.comments + post._count.reposts + recencyBoost
}

async function fetchPosts(sort: string, currentUserId?: string): Promise<PostResult[]> {
  const include = {
    author: true,
    topics: { include: { topic: true } },
    _count: { select: { likes: true, comments: true, reposts: true } },
  }

  // NEW: pure chronological
  if (sort === 'new') {
    return prisma.post.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      include,
    }) as Promise<PostResult[]>
  }

  // TOP: all-time most liked
  if (sort === 'top') {
    const posts = await prisma.post.findMany({
      take: 50,
      include,
    }) as PostResult[]
    posts.sort((a, b) => b._count.likes - a._count.likes)
    return posts.slice(0, 30)
  }

  // RISING: last 48h sorted by engagement
  if (sort === 'rising') {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)
    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: cutoff } },
      take: 50,
      include,
    }) as PostResult[]
    posts.sort((a, b) => engagementScore(b) - engagementScore(a))
    return posts.slice(0, 30)
  }

  // HOT (default): followed users first + engagement score
  if (!currentUserId) {
    const posts = await prisma.post.findMany({
      take: 50,
      include,
    }) as PostResult[]
    posts.sort((a, b) => engagementScore(b) - engagementScore(a))
    return posts.slice(0, 30)
  }

  const follows = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  })
  const followingIds = follows.map((f) => f.followingId)

  if (followingIds.length === 0) {
    const posts = await prisma.post.findMany({ take: 50, include }) as PostResult[]
    posts.sort((a, b) => engagementScore(b) - engagementScore(a))
    return posts.slice(0, 30)
  }

  const [followedPosts, globalPosts] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: followingIds } },
      take: 30,
      include,
    }),
    prisma.post.findMany({
      where: { authorId: { notIn: followingIds } },
      take: 20,
      include,
    }),
  ])

  const all = [...followedPosts, ...globalPosts] as PostResult[]
  all.sort((a, b) => engagementScore(b) - engagementScore(a))
  return all.slice(0, 30)
}

interface HomePageProps {
  searchParams: Promise<{ sort?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { sort: sortParam } = await searchParams
  const sort = ['hot', 'new', 'top', 'rising'].includes(sortParam ?? '') ? (sortParam ?? 'hot') : 'hot'

  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const posts = await fetchPosts(sort, currentUserId)

  const likedPostIds = new Set<string>()
  const repostedPostIds = new Set<string>()

  if (currentUserId && posts.length > 0) {
    const ids = posts.map((p) => p.id)
    const [likes, reposts] = await Promise.all([
      prisma.like.findMany({
        where: { userId: currentUserId, postId: { in: ids } },
        select: { postId: true },
      }),
      prisma.repost.findMany({
        where: { userId: currentUserId, postId: { in: ids } },
        select: { postId: true },
      }),
    ])
    likes.forEach((l) => likedPostIds.add(l.postId))
    reposts.forEach((r) => repostedPostIds.add(r.postId))
  }

  return (
    <div className="flex gap-6 py-6">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/compose"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Post
          </Link>
          <Suspense fallback={<div className="flex-1 h-10 rounded-xl bg-slate-900 animate-pulse" />}>
            <SortTabs />
          </Suspense>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No posts yet"
            description="Be the first to share your career story."
            action={{ label: 'Create a Post', href: '/compose' }}
          />
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCard
                  post={post}
                  currentUserId={currentUserId}
                  isLiked={likedPostIds.has(post.id)}
                  isReposted={repostedPostIds.has(post.id)}
                />
                {(i + 1) % 5 === 0 && <AdSlot slot="in-feed" className="my-4" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <RightRail />
    </div>
  )
}
