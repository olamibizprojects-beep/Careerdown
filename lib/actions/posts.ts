'use server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
function generateSlug(base: string, suffix: string): string {
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug}-${suffix}`
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8)
}

export async function createThought(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not authenticated' }

  const body = (formData.get('body') as string)?.trim()
  if (!body) return { error: 'Body is required' }
  if (body.length > 1000) return { error: 'Body must be 1000 characters or fewer' }

  const topicIds = formData.getAll('topicIds') as string[]

  const words = body.split(/\s+/).slice(0, 6).join(' ')
  const slug = generateSlug(words, shortId())

  try {
    const post = await prisma.post.create({
      data: {
        authorId: (session.user as { id: string }).id,
        type: 'THOUGHT',
        body,
        slug,
        topics: topicIds.length > 0 ? {
          create: topicIds.map((topicId) => ({ topicId })),
        } : undefined,
      },
    })

    revalidatePath('/')
    return { success: true, slug: post.slug }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create post' }
  }
}

export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: 'Not authenticated' }

  const title = (formData.get('title') as string)?.trim()
  const body = (formData.get('body') as string)?.trim()

  if (!title) return { error: 'Title is required' }
  if (title.length > 100) return { error: 'Title must be 100 characters or fewer' }
  if (!body) return { error: 'Body is required' }

  const topicIds = formData.getAll('topicIds') as string[]

  const slug = generateSlug(title, shortId())

  try {
    const post = await prisma.post.create({
      data: {
        authorId: (session.user as { id: string }).id,
        type: 'ARTICLE',
        title,
        body,
        slug,
        topics: topicIds.length > 0 ? {
          create: topicIds.map((topicId) => ({ topicId })),
        } : undefined,
      },
    })

    revalidatePath('/')
    return { success: true, slug: post.slug }
  } catch (e) {
    console.error(e)
    return { error: 'Failed to create article' }
  }
}
