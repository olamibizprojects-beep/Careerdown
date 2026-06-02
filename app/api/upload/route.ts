import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'careerdown/posts',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        }
      ).end(buffer)
    })

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
