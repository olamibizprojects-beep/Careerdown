'use client'
import { useState, useRef, useCallback } from 'react'

interface ImageUploaderProps {
  urls: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUploader({ urls, onChange, maxImages = 4 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload failed')
    }
    const data = await res.json()
    return data.url
  }

  const handleFiles = useCallback(async (files: FileList) => {
    const remaining = maxImages - urls.length
    if (remaining <= 0) return
    const selected = Array.from(files).slice(0, remaining)
    setUploading(true)
    setError('')
    try {
      const uploaded = await Promise.all(selected.map(uploadFile))
      const valid = uploaded.filter(Boolean) as string[]
      onChange([...urls, ...valid])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [urls, onChange, maxImages])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeImage = (index: number) => {
    onChange(urls.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className={`grid gap-2 ${urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {urls.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden bg-slate-800 aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {urls.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-700 p-4 text-slate-500 transition-colors hover:border-indigo-500 hover:text-indigo-400"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-sm font-medium">
                {urls.length === 0 ? 'Add photos' : `Add more (${maxImages - urls.length} remaining)`}
              </span>
              <span className="text-xs">Click or drag &amp; drop &middot; Max 10MB each</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  )
}
