import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="mb-4 text-6xl">🔍</div>
      <h1 className="mb-2 text-3xl font-bold text-white">404 — Page Not Found</h1>
      <p className="mb-8 text-slate-400">The page you are looking for does not exist or has been moved.</p>
      <Link
        href="/"
        className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
