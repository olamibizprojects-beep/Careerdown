'use client'
import { useState } from 'react'
import ThoughtComposer from '@/components/posts/ThoughtComposer'
import ArticleComposer from '@/components/posts/ArticleComposer'

interface Topic {
  id: string
  name: string
  slug: string
}

export default function ComposeTabs({ topics }: { topics: Topic[] }) {
  const [tab, setTab] = useState<'thought' | 'article'>('thought')

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
        {(['thought', 'article'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md py-2 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === 'thought' ? (
        <ThoughtComposer topics={topics} />
      ) : (
        <ArticleComposer topics={topics} />
      )}
    </div>
  )
}
