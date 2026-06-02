import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse all career topics on CareerDown.',
}

export default async function TopicsPage() {
  const topics = await prisma.topic.findMany({
    include: {
      _count: { select: { posts: true } },
    },
    orderBy: { posts: { _count: 'desc' } },
  })

  const topicIcons: Record<string, string> = {
    layoffs: '📉',
    'tech-careers': '💻',
    wlb: '⚖️',
    salary: '💰',
    interviews: '🎯',
    'remote-work': '🏠',
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Browse Topics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topic/${topic.slug}`}
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 hover:bg-slate-700 transition-all group"
          >
            <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-slate-700 group-hover:bg-slate-600">
              {topicIcons[topic.slug] ?? '🏷️'}
            </div>
            <div>
              <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                #{topic.name}
              </div>
              <div className="text-sm text-slate-400">
                {topic._count.posts} {topic._count.posts === 1 ? 'post' : 'posts'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
