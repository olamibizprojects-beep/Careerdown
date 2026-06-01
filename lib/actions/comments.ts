'use server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createComment(postId: string, body: string, parentId?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not authenticated' }

  const trimmed = body.trim()
  if (!trimmed) return { error: 'Comment body is required' }
  if (trimmed.length > 2000) return { error: 'Comment must be 2000 characters or fewer' }

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: (session.user as { id: string }).id,
        body: trimmed,
        parentId: parentId ?? null,
      },
    })

    revalidatePath(`/post`)
    return { success: true, commentId: comment.id }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create comment' }
  }
}
