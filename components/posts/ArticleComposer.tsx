'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createArticle } from '@/lib/actions/posts'
import { ImageUploader } from './ImageUploader'

interface Topic {
  id: string
  name: string
  slug: string
}

export default function ArticleComposer({ topics }: { topics: Topic[] }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!session) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
        <p>
          <a href="/login" className="text-indigo-400 hover:underline">Sign in</a> to write an article.
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
    fd.append('title', title)
    fd.append('body', body)
    fd.append('imageUrls', JSON.stringify(imageUrls))
    selectedTopics.forEach((id) => fd.append('topicIds', id))
    const result = await createArticle(fd)
    setSubmitting(false)
    if ('error' in result) {
      setError(result.error ?? 'Unknown error')
    } else {
      router.push('/')
    }
  }

  const titleOver = title.length > 100
  const canSubmit = title.trim().length > 0 && body.trim().length > 0 && !titleOver && !submitting

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title…"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <div className={`mt-1 text-right text-xs ${titleOver ? 'text-rose-400 font-semibold' : title.length > 80 ? 'text-rose-400' : 'text-slate-500'}`}>
          {title.length} / 100
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Body (Markdown supported)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your article…"
          rows={12}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y font-mono"
        />
      </div>

      <ImageUploader urls={imageUrls} onChange={setImageUrls} />

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
        {submitting ? 'Publishing…' : 'Publish Article'}
      </button>
    </form>
  )
}
