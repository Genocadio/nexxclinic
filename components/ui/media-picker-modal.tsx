'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { listFiles, type StorageBucket } from '@/lib/storage-service'
import { X, RefreshCw, Image as ImageIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

// ─── Public interface ─────────────────────────────────────────────────────────

export interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  bucket: StorageBucket
  /** Folder prefix to list, e.g. `forms/${formId}/insert` */
  folder: string
  onPick: (file: { url: string; path: string; name: string }) => void
  /** "images" shows only recognised image extensions; "all" shows everything */
  accept?: 'images' | 'all'
  title?: string
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'avif',
])

function isImage(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return IMAGE_EXTS.has(ext)
}

type FileItem = { url: string; path: string; name: string }

// ─── Component ────────────────────────────────────────────────────────────────

export function MediaPickerModal({
  open,
  onClose,
  bucket,
  folder,
  onPick,
  accept = 'all',
  title = 'Pick a file',
}: MediaPickerModalProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const all = await listFiles(bucket, folder)
      const filtered =
        accept === 'images' ? all.filter((f) => isImage(f.name)) : all
      setFiles(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files.')
    } finally {
      setLoading(false)
    }
  }, [bucket, folder, accept])

  useEffect(() => {
    if (open) {
      setSelected(null)
      void load()
    }
  }, [open, load])

  // Guard: portal requires document
  if (!open || typeof document === 'undefined') return null

  const handlePick = (file: FileItem) => {
    onPick(file)
    onClose()
  }

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='relative flex w-full max-w-2xl flex-col rounded-lg border bg-background shadow-xl max-h-[80vh]'>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className='flex shrink-0 items-center justify-between border-b px-5 py-3'>
          <h2 className='text-base font-semibold'>{title}</h2>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              aria-label='Refresh'
              disabled={loading}
              onClick={() => void load()}
              className='text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50'
            >
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
            </button>
            <button
              type='button'
              aria-label='Close'
              onClick={onClose}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <X className='size-4' />
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className='flex-1 overflow-y-auto p-4'>

          {/* Loading */}
          {loading && (
            <div className='flex items-center justify-center py-16'>
              <Spinner className='size-6' />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
              <p className='text-sm text-destructive'>{error}</p>
              <Button variant='outline' size='sm' onClick={() => void load()}>
                Retry
              </Button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && files.length === 0 && (
            <div className='flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground'>
              <ImageIcon className='size-10 opacity-25' />
              <p className='text-sm'>No files yet. Upload one first.</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && files.length > 0 && (
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
              {files.map((file) => {
                const img = isImage(file.name)
                const isSel = selected === file.path

                return (
                  <div
                    key={file.path}
                    onClick={() => setSelected(file.path)}
                    className={cn(
                      'flex cursor-pointer flex-col gap-1.5 rounded-lg border p-2 transition-colors',
                      isSel
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40 hover:bg-muted/40',
                    )}
                  >
                    {/* Thumbnail / icon */}
                    <div className='flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-muted'>
                      {img ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          loading='lazy'
                          className='size-full object-cover'
                        />
                      ) : (
                        <FileText className='size-8 text-muted-foreground/40' />
                      )}
                    </div>

                    {/* Filename */}
                    <p className='truncate text-xs leading-none text-muted-foreground'>
                      {file.name}
                    </p>

                    {/* Action */}
                    <Button
                      type='button'
                      size='sm'
                      variant={isSel ? 'default' : 'outline'}
                      className='h-7 w-full text-xs'
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePick(file)
                      }}
                    >
                      Use this
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
