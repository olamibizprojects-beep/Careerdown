'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { createComment } from '@/lib/actions/comments'
import { relativeTime } from '@/lib/utils'

interface CommentData {
  id: string
  body: string
  createdAt: Date
  author: { username: string; displayName: string; avatarUrl: string | null }
  replies: CommentData[]
}

function CommentItem({ comment, postId }: { comment: CommentData; postId: string }) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyBody, setReplyBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localReplies, setLocalReplies] = useState<CommentData[]>(comment.replies)
  const { data: session } = useSession()

  const submitReply = async () => {
    if (!replyBody.trim()) return
    setSubmitting(true)
    const result = await createComment(postId, replyBody, comment.id)
    setSubmitting(false)
    if ('success' in result) {
      setReplyBody('')
      setShowReplyForm(false)
      setShowReplies(true)
      // Optimistic: add placeholder reply
      setLocalReplies((prev) => [
        ...prev,
        {
          id: result.commentId ?? Date.now().toString(),
          body: replyBody,
          createdAt: new Date(),
          author: {
            username: (session?.user as { username?: string })?.username ?? 'you',
            displayName: session?.user?.name ?? 'You',
            avatarUrl: session?.user?.image ?? null,
          },
          replies: [],
        },
      ])
    }
  }

  return (
    <div className="border-l-2 border-slate-800 pl-4">
      <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-300">{comment.author.displayName}</span>
        <span>@{comment.author.username}</span>
        <span>&middot;</span>
        <span>{relativeTime(new Date(comment.createdAt))}</span>
      </div>
      <p className="mb-2 text-sm text-slate-300 whitespace-pre-line">{comment.body}</p>
      <div className="flex gap-3">
        {session && (
          <button
            onClick={() => setShowReplyForm((v) => !v)}
            className="text-xs text-slate-500 hover:text-indigo-400"
          >
            Reply
          </button>
        )}
        {localReplies.length > 0 && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="text-xs text-slate-500 hover:text-indigo-400"
          >
            {showReplies ? 'Hide replies' : `Show ${localReplies.length} ${localReplies.length === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-2 flex gap-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write a reply…"
            rows={2}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
          />
          <button
            onClick={submitReply}
            disabled={submitting || !replyBody.trim()}
            className="self-end rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? '…' : 'Reply'}
          </button>
        </div>
      )}

      {showReplies && localReplies.length > 0 && (
        <div className="mt-3 space-y-3">
          {localReplies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CommentsSection({
  postId,
  initialComments,
}: {
  postId: string
  initialComments: CommentData[]
}) {
  const { data: session } = useSession()
  const [newBody, setNewBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [comments, setComments] = useState<CommentData[]>(initialComments)

  const submitComment = async () => {
    if (!newBody.trim()) return
    setError('')
    setSubmitting(true)
    const result = await createComment(postId, newBody)
    setSubmitting(false)
    if ('error' in result) {
      setError(result.error ?? 'Unknown error')
    } else {
      const optimistic: CommentData = {
        id: result.commentId ?? Date.now().toString(),
        body: newBody,
        createdAt: new Date(),
        author: {
          username: (session?.user as { username?: string })?.username ?? 'you',
          displayName: session?.user?.name ?? 'You',
          avatarUrl: session?.user?.image ?? null,
        },
        replies: [],
      }
      setComments((prev) => [optimistic, ...prev])
      setNewBody('')
    }
  }

  return (
    <section id="comments" className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-slate-100">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      {session ? (
        <div className="mb-6">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
          <button
            onClick={submitComment}
            disabled={submitting || !newBody.trim()}
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      ) : (
        <p className="mb-6 text-sm text-slate-400">
          <a href="/login" className="text-indigo-400 hover:underline">Sign in</a> to comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </section>
  )
}
