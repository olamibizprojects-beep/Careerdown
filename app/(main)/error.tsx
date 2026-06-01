'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h2 className="mb-2 text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mb-6 text-slate-400">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
