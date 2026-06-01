import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import RightRail from '@/components/layout/RightRail'
import PostCard from '@/components/feed/PostCard'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const posts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      topics: { include: { topic: true } },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  })

  // Check which posts current user has liked
  const likedPostIds = new Set<string>()
  if (currentUserId) {
    const likes = await prisma.like.findMany({
      where: { userId: currentUserId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    })
    likes.forEach((l) => likedPostIds.add(l.postId))
  }

  return (
    <div className="flex gap-6 py-6">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Feed */}
      <div className="min-w-0 flex-1">
        {/* New post button + Feed tabs */}
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
          <div className="flex flex-1 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            {['Hot', 'New', 'Top', 'Rising'].map((tab, i) => (
              <button
                key={tab}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
            <p className="mb-3">No posts yet.</p>
            <Link href="/compose" className="text-indigo-400 hover:underline">Be the first to post!</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                isLiked={likedPostIds.has(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Rail */}
      <RightRail />
    </div>
  )
}
