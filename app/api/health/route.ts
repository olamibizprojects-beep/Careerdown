import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {
    database_url: process.env.DATABASE_URL ? '✅ set' : '❌ missing',
    nextauth_secret: process.env.NEXTAUTH_SECRET ? '✅ set' : '❌ missing',
    nextauth_url: process.env.NEXTAUTH_URL ? '✅ set' : '❌ missing',
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.db_connection = '✅ connected'
  } catch (e: unknown) {
    checks.db_connection = `❌ failed: ${e instanceof Error ? e.message : String(e)}`
  }

  try {
    const count = await prisma.post.count()
    checks.post_count = `✅ ${count} posts`
  } catch (e: unknown) {
    checks.post_count = `❌ ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json(checks)
}
