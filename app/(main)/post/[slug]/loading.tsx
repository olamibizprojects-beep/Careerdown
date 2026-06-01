import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="py-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {/* Author row */}
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Title (article) */}
        <Skeleton className="mb-3 h-6 w-3/4" />

        {/* Body */}
        <div className="mb-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Comments skeleton */}
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}
