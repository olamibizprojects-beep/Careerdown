import Link from "next/link";

const trendingTopics = [
  { tag: "layoffs", count: 2847 },
  { tag: "techcareers", count: 1923 },
  { tag: "wlb", count: 1541 },
  { tag: "salary", count: 1388 },
  { tag: "interviews", count: 1204 },
];

const suggestedUsers = [
  { name: "Alex Chen", title: "Staff Engineer @ Meta", handle: "alexchen" },
  { name: "Jordan Park", title: "Career Coach", handle: "jordanpark" },
  { name: "Sam Rivera", title: "Recruiter @ Google", handle: "samrivera" },
];

export default function RightRail() {
  return (
    <aside className="hidden w-72 shrink-0 xl:block">
      <div className="sticky top-16 space-y-4 pt-4">
        {/* Trending Topics */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Trending Topics</h2>
          <ul className="space-y-2">
            {trendingTopics.map((topic, i) => (
              <li key={topic.tag}>
                <Link
                  href={`/topics/${topic.tag}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-700/50"
                >
                  <div>
                    <span className="text-xs text-slate-500">#{i + 1} trending</span>
                    <p className="text-sm font-medium text-indigo-400">#{topic.tag}</p>
                  </div>
                  <span className="text-xs text-slate-500">{topic.count.toLocaleString()} posts</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/topics" className="mt-2 block text-xs text-indigo-400 hover:text-indigo-300">
            Show more
          </Link>
        </div>

        {/* Suggested Users */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">Suggested Users</h2>
          <ul className="space-y-3">
            {suggestedUsers.map((user) => (
              <li key={user.handle} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600/30 text-sm font-bold text-indigo-300">
                    {user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-200">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.title}</p>
                  </div>
                </div>
                <button className="shrink-0 rounded-full border border-indigo-600 px-2.5 py-1 text-xs font-medium text-indigo-400 hover:bg-indigo-600/20">
                  Follow
                </button>
              </li>
            ))}
          </ul>
          <Link href="/users" className="mt-2 block text-xs text-indigo-400 hover:text-indigo-300">
            Show more
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
  );
}
