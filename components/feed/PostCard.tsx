'use client'
import { useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { relativeTime, truncate } from '@/lib/utils'
import { toggleLike, toggleRepost } from '@/lib/actions/interactions'

interface PostCardProps {
  post: {
    id: string
    type: string
    title: string | null
    body: string
    slug: string
    createdAt: Date
    author: { username: string; displayName: string; avatarUrl: string | null }
    topics: { topic: { name: string; slug: string } }[]
    _count: { likes: number; comments: number; reposts: number }
  }
  currentUserId?: string
  isLiked?: boolean
  isReposted?: boolean
}

function Avatar({ displayName, avatarUrl }: { displayName: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
    )
  }
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/30 text-xs font-bold text-indigo-300">
      {initials}
    </div>
  )
}

export default function PostCard({ post, isLiked = false, isReposted = false }: PostCardProps) {
  const isArticle = post.type === 'ARTICLE'

  const [isPending, startTransition] = useTransition()

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    { count: post._count.likes, liked: isLiked },
    (state, action: 'like' | 'unlike') => ({
      count: action === 'like' ? state.count + 1 : state.count - 1,
      liked: action === 'like',
    })
  )

  const [optimisticReposts, addOptimisticRepost] = useOptimistic(
    { count: post._count.reposts, reposted: isReposted },
    (state, action: 'repost' | 'unrepost') => ({
      count: action === 'repost' ? state.count + 1 : state.count - 1,
      reposted: action === 'repost',
    })
  )

  const handleLike = () => {
    startTransition(async () => {
      addOptimisticLike(optimisticLikes.liked ? 'unlike' : 'like')
      await toggleLike(post.id)
    })
  }

  const handleRepost = () => {
    startTransition(async () => {
      addOptimisticRepost(optimisticReposts.reposted ? 'unrepost' : 'repost')
      await toggleRepost(post.id)
    })
  }

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
      {/* Author row */}
      <div className="mb-3 flex items-center gap-2">
        <Link href={`/u/${post.author.username}`}>
          <Avatar displayName={post.author.displayName} avatarUrl={post.author.avatarUrl} />
        </Link>
        <div className="flex items-center gap-1.5 text-sm">
          <Link href={`/u/${post.author.username}`} className="font-semibold text-slate-200 hover:text-indigo-300">
            {post.author.displayName}
          </Link>
          <span className="text-slate-500">@{post.author.username}</span>
          <span className="text-slate-600">&middot;</span>
          <time dateTime={new Date(post.createdAt).toISOString()} className="text-xs text-slate-500">
            {relativeTime(new Date(post.createdAt))}
          </time>
        </div>
        {isArticle && (
          <span className="ml-auto rounded-full bg-indigo-600/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
            Article
          </span>
        )}
      </div>

      {/* Body */}
      <Link href={`/post/${post.slug}`} className="block">
        {isArticle && post.title && (
          <h2 className="mb-1.5 text-base font-bold text-slate-100 hover:text-indigo-300 transition-colors">
            {post.title}
          </h2>
        )}
        {isArticle ? (
          <p className="mb-3 line-clamp-2 text-sm text-slate-400">{post.body}</p>
        ) : (
          <p className="mb-3 text-sm text-slate-300 whitespace-pre-line">
            {post.body.length > 280 ? (
              <>
                {truncate(post.body, 280)}
                <span className="ml-1 text-indigo-400 hover:underline">more</span>
              </>
            ) : (
              post.body
            )}
          </p>
        )}
      </Link>

      {/* Topics */}
      {post.topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.topics.map(({ topic }) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-indigo-400 hover:bg-slate-700"
            >
              #{topic.name}
            </Link>
          ))}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-4 text-slate-500">
        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={isPending}
          className={`flex items-center gap-1.5 text-xs transition-colors hover:text-rose-400 disabled:opacity-70 ${
            optimisticLikes.liked ? 'text-rose-400' : ''
          }`}
        >
          {optimisticLikes.liked ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
          {optimisticLikes.count}
        </button>

        {/* Comment link */}
        <Link href={`/post/${post.slug}#comments`} className="flex items-center gap-1.5 text-xs hover:text-indigo-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          {post._count.comments}
        </Link>

        {/* Repost button */}
        <button
          onClick={handleRepost}
          disabled={isPending}
          className={`flex items-center gap-1.5 text-xs transition-colors hover:text-green-400 disabled:opacity-70 ${
            optimisticReposts.reposted ? 'text-green-400' : ''
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
          </svg>
          {optimisticReposts.count}
        </button>
      </div>
    </article>
  )
}
