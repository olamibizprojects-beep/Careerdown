'use client'
import { useRouter, usePathname } from 'next/navigation'

const TABS = [
  { key: 'posts', label: 'Posts' },
  { key: 'articles', label: 'Articles' },
  { key: 'likes', label: 'Likes' },
] as const

type TabKey = (typeof TABS)[number]['key']

interface ProfileTabsProps {
  activeTab: TabKey
  username: string
}

export default function ProfileTabs({ activeTab, username }: ProfileTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex gap-1 border-b border-slate-800">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(`${pathname}?tab=${tab.key}`)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === tab.key
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
