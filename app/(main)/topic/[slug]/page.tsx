import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/feed/PostCard'
import Sidebar from '@/components/layout/Sidebar'
import RightRail from '@/components/layout/RightRail'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const topic = await prisma.topic.findUnique({ where: { slug } })
  if (!topic) return { title: 'Topic Not Found' }
  const title = `#${topic.name}`
  const description = `Browse career posts and discussions tagged #${topic.name} on CareerDown.`
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const topic = await prisma.topic.findUnique({ where: { slug } })
  if (!topic) notFound()

  const posts = await prisma.post.findMany({
    where: { topics: { some: { topicId: topic.id } } },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      topics: { include: { topic: true } },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  })

  const postIds = posts.map((p) => p.id)
  const likedPostIds = new Set<string>()
  const repostedPostIds = new Set<string>()
  if (currentUserId && postIds.length > 0) {
    const [likes, reposts] = await Promise.all([
      prisma.like.findMany({
        where: { userId: currentUserId, postId: { in: postIds } },
        select: { postId: true },
      }),
      prisma.repost.findMany({
        where: { userId: currentUserId, postId: { in: postIds } },
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">
            <span className="text-indigo-400">#</span>{topic.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{posts.length} posts</p>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon="🏷️"
            title={`No posts tagged #${topic.name} yet`}
            description="Be the first to share something on this topic."
            action={{ label: 'Create a Post', href: '/compose' }}
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

      <RightRail />
    </div>
  )
}
