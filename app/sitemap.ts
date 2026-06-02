import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } })
  const users = await prisma.user.findMany({ select: { username: true, createdAt: true } })
  const topics = await prisma.topic.findMany({ select: { slug: true } })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/post/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const userRoutes: MetadataRoute.Sitemap = users.map((u) => ({
    url: `${baseUrl}/u/${u.username}`,
    lastModified: u.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const topicRoutes: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${baseUrl}/topic/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [...staticRoutes, ...postRoutes, ...userRoutes, ...topicRoutes]
}
