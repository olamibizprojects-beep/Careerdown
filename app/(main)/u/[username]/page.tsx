import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/feed/PostCard'
import FollowButton from '@/components/posts/FollowButton'
import ProfileTabs from '@/components/profile/ProfileTabs'
import Sidebar from '@/components/layout/Sidebar'
import RightRail from '@/components/layout/RightRail'

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const postInclude = {
  author: true,
  topics: { include: { topic: true } },
  _count: { select: { likes: true, comments: true, reposts: true } },
} as const

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return {}
  return {
    title: `${user.displayName} (@${user.username}) — CareerDown`,
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params
  const sp = await searchParams
  const rawTab = typeof sp.tab === 'string' ? sp.tab : 'posts'
  const tab = ['posts', 'articles', 'likes'].includes(rawTab) ? (rawTab as 'posts' | 'articles' | 'likes') : 'posts'

  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const profileUser = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { followers: true, following: true },
      },
    },
  })

  if (!profileUser) notFound()

  const isOwnProfile = currentUserId === profileUser.id

  let isFollowing = false
  if (currentUserId && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: profileUser.id } },
    })
    isFollowing = !!follow
  }

  // Fetch posts based on tab
  let posts: Awaited<ReturnType<typeof prisma.post.findMany<{ include: typeof postInclude }>>> = []

  if (tab === 'posts') {
    posts = await prisma.post.findMany({
      where: { authorId: profileUser.id },
      orderBy: { createdAt: 'desc' },
      include: postInclude,
    })
  } else if (tab === 'articles') {
    posts = await prisma.post.findMany({
      where: { authorId: profileUser.id, type: 'ARTICLE' },
      orderBy: { createdAt: 'desc' },
      include: postInclude,
    })
  } else if (tab === 'likes') {
    const likes = await prisma.like.findMany({
      where: { userId: profileUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        post: { include: postInclude },
      },
    })
    posts = likes.map((l) => l.post)
  }

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

  const initials = profileUser.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex gap-6 py-6">
      <Sidebar />

      <div className="min-w-0 flex-1">
        {/* Profile header */}
        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-start gap-4">
            {profileUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileUser.avatarUrl}
                alt={profileUser.displayName}
                className="h-20 w-20 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-2xl font-bold text-indigo-300">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-100">{profileUser.displayName}</h1>
                  <p className="text-sm text-slate-500">@{profileUser.username}</p>
                </div>
                {!isOwnProfile && (
                  <FollowButton targetUserId={profileUser.id} initialFollowing={isFollowing} />
                )}
              </div>

              {profileUser.bio && (
                <p className="mt-2 text-sm text-slate-300">{profileUser.bio}</p>
              )}

              <div className="mt-3 flex gap-4 text-sm">
                <span>
                  <span className="font-semibold text-slate-200">{profileUser._count.following}</span>
                  <span className="ml-1 text-slate-500">Following</span>
                </span>
                <span>
                  <span className="font-semibold text-slate-200">{profileUser._count.followers}</span>
                  <span className="ml-1 text-slate-500">Followers</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProfileTabs activeTab={tab} username={profileUser.username} />

        {/* Posts */}
        <div className="mt-4 space-y-3">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-500">
              No posts yet.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                isLiked={likedPostIds.has(post.id)}
                isReposted={repostedPostIds.has(post.id)}
              />
            ))
          )}
        </div>
      </div>

      <RightRail />
    </div>
  )
}
