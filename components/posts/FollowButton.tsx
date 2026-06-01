'use client'
import { useState, useTransition } from 'react'
import { toggleFollow } from '@/lib/actions/interactions'

interface FollowButtonProps {
  targetUserId: string
  initialFollowing: boolean
  className?: string
}

export default function FollowButton({ targetUserId, initialFollowing, className = '' }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [hovered, setHovered] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const optimistic = !following
      setFollowing(optimistic)
      try {
        const result = await toggleFollow(targetUserId)
        setFollowing(result.following)
      } catch {
        // revert on error
        setFollowing(following)
      }
    })
  }

  if (following) {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          hovered
            ? 'border border-rose-500 bg-rose-500/10 text-rose-400'
            : 'border border-indigo-600 bg-indigo-600 text-white'
        } ${className}`}
      >
        {isPending ? '…' : hovered ? 'Unfollow' : (
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Following
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full border border-indigo-600 px-3 py-1 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-600 hover:text-white disabled:opacity-50 ${className}`}
    >
      {isPending ? '…' : 'Follow'}
    </button>
  )
}
