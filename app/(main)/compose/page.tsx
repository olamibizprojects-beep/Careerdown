import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ComposeTabs from './ComposeTabs'

export default async function ComposePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const topics = await prisma.topic.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-100">Create Post</h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <ComposeTabs topics={topics} />
      </div>
    </div>
  )
}
