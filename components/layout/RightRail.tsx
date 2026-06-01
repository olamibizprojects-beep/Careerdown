import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function RightRail() {
  const topicsRaw = await prisma.topic.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    orderBy: {
      posts: { _count: 'desc' },
    },
    take: 6,
  })

  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-16 space-y-4 pt-4">
        {/* Trending Topics */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Trending Topics</h2>
          <ul className="space-y-2">
            {topicsRaw.map((topic, i) => (
              <li key={topic.slug}>
                <Link
                  href={`/topic/${topic.slug}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-700/50"
                >
                  <div>
                    <span className="text-xs text-slate-500">#{i + 1} trending</span>
                    <p className="text-sm font-medium text-indigo-400">#{topic.name}</p>
                  </div>
                  <span className="text-xs text-slate-500">{topic._count.posts.toLocaleString()} posts</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/explore" className="mt-2 block text-xs text-indigo-400 hover:text-indigo-300">
            Explore all topics
          </Link>
        </div>

        {/* Footer links */}
        <p className="px-2 text-xs text-slate-600">
          &copy; {new Date().getFullYear()} CareerDown &middot;{" "}
          <Link href="/privacy" className="hover:text-slate-500">Privacy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-slate-500">Terms</Link>
        </p>
      </div>
    </aside>
  )
}
