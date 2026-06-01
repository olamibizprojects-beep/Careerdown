'use client'
import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createThought } from '@/lib/actions/posts'

interface Topic {
  id: string
  name: string
  slug: string
}

export default function ThoughtComposer({ topics }: { topics: Topic[] }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [body, setBody] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (!session) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
        <p>
          <a href="/login" className="text-indigo-400 hover:underline">Sign in</a> to post a thought.
        </p>
      </div>
    )
  }

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const fd = new FormData()
    fd.append('body', body)
    selectedTopics.forEach((id) => fd.append('topicIds', id))
    const result = await createThought(fd)
    setSubmitting(false)
    if ('error' in result) {
      setError(result.error ?? 'Unknown error')
    } else {
      router.push('/')
    }
  }

  const overLimit = body.length > 1000
  const canSubmit = body.trim().length > 0 && !overLimit && !submitting

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind about your career?"
          rows={5}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
        />
        <div className={`mt-1 text-right text-xs ${overLimit ? 'text-rose-400 font-semibold' : body.length > 900 ? 'text-rose-400' : 'text-slate-500'}`}>
          {body.length} / 1000
        </div>
      </div>

      {topics.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-400">Topics (up to 3)</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const selected = selectedTopics.includes(topic.id)
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  #{topic.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Post Thought'}
      </button>
    </form>
  )
}
