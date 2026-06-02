'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const tabs = [
  { label: 'Hot', value: 'hot', icon: '🔥' },
  { label: 'New', value: 'new', icon: '✨' },
  { label: 'Top', value: 'top', icon: '⭐' },
  { label: 'Rising', value: 'rising', icon: '📈' },
]

export function SortTabs() {
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') ?? 'hot'

  return (
    <div className="flex flex-1 gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
      {tabs.map((tab) => {
        const isActive = current === tab.value
        return (
          <Link
            key={tab.value}
            href={`/?sort=${tab.value}`}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
