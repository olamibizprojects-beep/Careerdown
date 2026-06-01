import { Skeleton } from '@/components/ui/Skeleton'

export function PostCardSkeleton() {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      {/* Author row */}
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Body */}
      <div className="mb-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </article>
  )
}
