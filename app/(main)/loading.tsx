import { PostCardSkeleton } from '@/components/feed/PostCardSkeleton'

export default function Loading() {
  return (
    <div className="space-y-4 py-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
