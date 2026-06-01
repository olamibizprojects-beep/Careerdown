import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CommentsSection from '@/components/posts/CommentsSection'
import FollowButton from '@/components/posts/FollowButton'
import { AdSlot } from '@/components/ads/AdSlot'
import { JsonLd } from '@/components/seo/JsonLd'
import { relativeTime } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug }, include: { author: true } })
  if (!post) return { title: 'Post Not Found' }
  const title = post.title ?? post.body.slice(0, 60)
  const description = post.body.slice(0, 160)
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: post.type === 'ARTICLE' ? 'article' : 'website',
      authors: [post.author.displayName],
      publishedTime: post.createdAt.toISOString(),
    },
    twitter: { card: 'summary', title, description },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)
  const currentUserId = (session?.user as { id?: string } | null)?.id

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      topics: { include: { topic: true } },
      _count: { select: { likes: true, comments: true, reposts: true } },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          replies: {
            orderBy: { createdAt: 'asc' },
            include: {
              author: true,
              replies: {
                orderBy: { createdAt: 'asc' },
                include: { author: true, replies: { include: { author: true, replies: true } } },
              },
            },
          },
        },
      },
    },
  })

  if (!post) notFound()

  const jsonLd = post.type === 'ARTICLE' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.body.slice(0, 160),
    author: {
      '@type': 'Person',
      name: post.author.displayName,
      url: `${process.env.NEXTAUTH_URL}/u/${post.author.username}`,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'CareerDown',
    },
  } : {
    '@context': 'https://schema.org',
    '@type': 'SocialMediaPosting',
    text: post.body,
    author: {
      '@type': 'Person',
      name: post.author.displayName,
    },
    dateCreated: post.createdAt.toISOString(),
  }

  // Check follow status
  const isOwnPost = currentUserId === post.authorId
  let isFollowing = false
  if (currentUserId && !isOwnPost) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: post.authorId } },
    })
    isFollowing = !!follow
  }

  const authorInitials = post.author.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-2xl py-8">
      <JsonLd data={jsonLd} />
      {/* Back link */}
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back
      </Link>

      <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {/* Type badge */}
        <div className="mb-4 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.type === 'ARTICLE' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
            {post.type}
          </span>
          <time dateTime={post.createdAt.toISOString()} className="text-xs text-slate-500">
            {relativeTime(post.createdAt)}
          </time>
        </div>

        {/* Title (articles) */}
        {post.type === 'ARTICLE' && post.title && (
          <h1 className="mb-4 text-2xl font-bold text-slate-100">{post.title}</h1>
        )}

        {/* Body */}
        <div className="mb-6 whitespace-pre-line text-sm leading-relaxed text-slate-300">
          {post.body}
        </div>

        {/* Topics */}
        {post.topics.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.topics.map(({ topic }) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-indigo-400 hover:bg-slate-700"
              >
                #{topic.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author card */}
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-start gap-3">
            {post.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatarUrl} alt={post.author.displayName} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/30 text-sm font-bold text-indigo-300">
                {authorInitials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/u/${post.author.username}`} className="font-semibold text-slate-200 hover:text-indigo-300">
                    {post.author.displayName}
                  </Link>
                  <p className="text-xs text-slate-500">@{post.author.username}</p>
                </div>
                {!isOwnPost && (
                  <FollowButton
                    targetUserId={post.authorId}
                    initialFollowing={isFollowing}
                  />
                )}
              </div>
              {post.author.bio && (
                <p className="mt-2 text-xs text-slate-400">{post.author.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-xs text-slate-500">
          <span>{post._count.likes} likes</span>
          <span>{post._count.comments} comments</span>
          <span>{post._count.reposts} reposts</span>
        </div>
      </article>

      <AdSlot slot="below-article" className="mt-8" />

      {/* Comments */}
      <CommentsSection
        postId={post.id}
        initialComments={post.comments as Parameters<typeof CommentsSection>[0]['initialComments']}
      />
    </div>
  )
}
