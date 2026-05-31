import Sidebar from "@/components/layout/Sidebar";
import RightRail from "@/components/layout/RightRail";
import Link from "next/link";

// Placeholder feed posts for Phase 1
const placeholderPosts = [
  {
    id: "1",
    title: "Just got laid off from my FAANG job — here's what I learned",
    content:
      "After 4 years at a top tech company, I was part of the latest round of layoffs. Instead of panicking, I took stock of everything I gained and wanted to share my experience with this community...",
    author: "techprofessional",
    upvotes: 1243,
    comments: 89,
    time: "2h ago",
    tags: ["layoffs", "techcareers"],
  },
  {
    id: "2",
    title: "Negotiated my salary up 40% — here's exactly what I said",
    content:
      "I just closed an offer at $185k, up from the initial $132k offer. I want to document every step of the negotiation so others can replicate it. The key is understanding your BATNA...",
    author: "salaryadvice",
    upvotes: 876,
    comments: 134,
    time: "5h ago",
    tags: ["salary", "interviews"],
  },
  {
    id: "3",
    title: "WLB at startups vs FAANG: my honest comparison after doing both",
    content:
      "I've spent 3 years at a Series B startup and 2 years at a large tech company. The work-life balance differences are real, but maybe not what you'd expect...",
    author: "careerexplorer",
    upvotes: 654,
    comments: 67,
    time: "8h ago",
    tags: ["wlb", "techcareers"],
  },
  {
    id: "4",
    title: "How I passed 5 system design interviews in a row",
    content:
      "System design interviews used to terrify me. After failing 3 in a row, I developed a repeatable framework that helped me pass every one since. Sharing my notes here...",
    author: "designpro",
    upvotes: 521,
    comments: 45,
    time: "12h ago",
    tags: ["interviews"],
  },
];

function PostCard({
  post,
}: {
  post: (typeof placeholderPosts)[number];
}) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/30 text-xs font-bold text-indigo-300">
          {post.author[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-300">u/{post.author}</span>
        <span className="text-slate-600">&middot;</span>
        <span className="text-xs text-slate-500">{post.time}</span>
      </div>

      <Link href={`/post/${post.id}`}>
        <h2 className="mb-2 text-base font-semibold text-slate-100 hover:text-indigo-300">
          {post.title}
        </h2>
      </Link>
      <p className="mb-3 line-clamp-2 text-sm text-slate-400">{post.content}</p>

      <div className="flex items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/topics/${tag}`}
              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-indigo-400 hover:bg-slate-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-slate-500">
          <button className="flex items-center gap-1 text-xs hover:text-indigo-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
            </svg>
            {post.upvotes.toLocaleString()}
          </button>
          <button className="flex items-center gap-1 text-xs hover:text-indigo-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            {post.comments}
          </button>
          <button className="flex items-center gap-1 text-xs hover:text-indigo-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="flex gap-6 py-6">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Feed */}
      <div className="min-w-0 flex-1">
        {/* Feed tabs */}
        <div className="mb-4 flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {["Hot", "New", "Top", "Rising"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-3">
          {placeholderPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Rail */}
      <RightRail />
    </div>
  );
}
