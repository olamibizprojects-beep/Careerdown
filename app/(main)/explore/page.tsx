import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import RightRail from '@/components/layout/RightRail'
import PostCard from '@/components/feed/PostCard'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata = { title: 'Explore — CareerDown' }

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams
  const topic = typeof params.topic === 'string' ? params.topic : undefined
  const q = typeof params.q === 'string' ? params.q.trim() : undefined

  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const [allTopics, posts, peopleResults] = await Promise.all([
    prisma.topic.findMany({ orderBy: { name: 'asc' } }),

    prisma.post.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      where: {
        ...(topic
          ? { topics: { some: { topic: { slug: topic } } } }
          : {}),
        ...(q
          ? {
              OR: [
                { body: { contains: q } },
                { title: { contains: q } },
              ],
            }
          : {}),
      },
      include: {
        author: true,
        topics: { include: { topic: true } },
        _count: { select: { likes: true, comments: true, reposts: true } },
      },
    }),

    q
      ? prisma.user.findMany({
          where: {
            OR: [
              { displayName: { contains: q } },
              { username: { contains: q } },
            ],
          },
          take: 6,
        })
      : Promise.resolve([]),
  ])

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
        <h1 className="mb-4 text-xl font-bold text-slate-100">Explore</h1>

        {/* Search bar */}
        <form method="GET" action="/explore" className="mb-4">
          {topic && <input type="hidden" name="topic" value={topic} />}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="search"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Search posts, topics, users..."
              className="block w-full rounded-full border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>

        {/* Topic filter pills */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/explore"
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              !topic ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </Link>
          {allTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/explore?topic=${t.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                topic === t.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              #{t.name}
            </Link>
          ))}
        </div>

        {/* People results */}
        {peopleResults.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wide">People</h2>
            <div className="space-y-2">
              {peopleResults.map((u) => {
                const initials = u.displayName
                  .split(' ')
                  .map((w: string) => w[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
                return (
                  <Link
                    key={u.id}
                    href={`/u/${u.username}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3 hover:border-slate-700 transition-colors"
                  >
                    {u.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatarUrl} alt={u.displayName} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/30 text-sm font-bold text-indigo-300">
                        {initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-200">{u.displayName}</p>
                      <p className="text-xs text-slate-500">@{u.username}</p>
                      {u.bio && <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{u.bio}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
            No posts found.
          </div>
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
