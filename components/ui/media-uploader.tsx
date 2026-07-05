'use client'

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from 'react'
import { uploadFile, type UploadResult } from '@/lib/storage-service'
import { Upload, X, ImageIcon, FileText, Film, FolderOpen } from 'lucide-react'
import { getMediaUrl } from '@/lib/media-url'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface MediaUploaderProps {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  label?: string
  hint?: string
  disabled?: boolean
  onUploaded: (files: UploadResult[]) => void
  onError?: (err: string) => void
  currentUrl?: string
  className?: string
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  return accept.split(',').some((token) => {
    const t = token.trim()
    if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', '/'))
    if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t.toLowerCase())
    return file.type === t
  })
}

function DropzoneIcon({ accept }: { accept?: string }) {
  const cls = 'size-10 text-muted-foreground/40'
  if (!accept) return <FolderOpen className={cls} />
  if (accept.includes('video')) return <Film className={cls} />
  if (accept.includes('image')) return <ImageIcon className={cls} />
  return <FileText className={cls} />
}

export function MediaUploader({
  accept,
  multiple = false,
  maxFiles,
  label,
  hint,
  disabled = false,
  onUploaded,
  onError,
  currentUrl,
  className,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [uploaded, setUploaded] = useState<UploadResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const isUploading =
    uploading || Object.values(progress).some((pct) => pct < 100)

  const handleFiles = useCallback(
    async (rawFiles: File[]) => {
      if (disabled) return
      setError(null)

      const valid = rawFiles.filter((f) => matchesAccept(f, accept))
      if (valid.length === 0) {
        const msg = accept
          ? `No valid files — expected ${accept}`
          : 'No files selected.'
        setError(msg)
        onError?.(msg)
        return
      }

      const batch = maxFiles ? valid.slice(0, maxFiles) : valid
      if (!multiple) batch.splice(1)

      setUploading(true)
      const results: UploadResult[] = []

      for (const file of batch) {
        const key = file.name
        setProgress((p) => ({ ...p, [key]: 0 }))

        try {
          const result = await uploadFile(file, (pct) =>
            setProgress((p) => ({ ...p, [key]: pct })),
          )
          results.push(result)
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Upload failed.'
          setError(msg)
          onError?.(msg)
          setProgress((p) => {
            const next = { ...p }
            delete next[key]
            return next
          })
        }
      }

      setUploading(false)

      if (results.length > 0) {
        setUploaded((prev) => [...prev, ...results])
        onUploaded(results)
      }
    },
    [accept, multiple, maxFiles, disabled, onUploaded, onError],
  )

  const onDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled],
  )

  const onDragLeave = useCallback(() => setIsDragOver(false), [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      void handleFiles(Array.from(e.dataTransfer.files))
    },
    [handleFiles],
  )

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      void handleFiles(Array.from(e.target.files ?? []))
      e.target.value = ''
    },
    [handleFiles],
  )

  const removeUploaded = (path: string) =>
    setUploaded((prev) => prev.filter((f) => f.path !== path))

  const browse = () => !disabled && inputRef.current?.click()

  if (currentUrl) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <img
          src={getMediaUrl(currentUrl)}
          alt='Current media'
          className='size-16 rounded-md object-cover border border-border shrink-0'
        />
        <div className='flex flex-col gap-1.5'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled || isUploading}
            onClick={browse}
          >
            {isUploading ? 'Uploading…' : 'Change'}
          </Button>
          <input
            ref={inputRef}
            type='file'
            accept={accept}
            multiple={multiple}
            className='hidden'
            onChange={onInputChange}
          />
          {error && <p className='text-xs text-destructive'>{error}</p>}
        </div>
      </div>
    )
  }

  const activeUploads = Object.entries(progress).filter(([, pct]) => pct < 100)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div>
          <p className='text-sm font-medium leading-none'>{label}</p>
          {hint && (
            <p className='mt-1 text-xs text-muted-foreground'>{hint}</p>
          )}
        </div>
      )}

      <div
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-label='Upload files'
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={browse}
        onKeyDown={(e) => e.key === 'Enter' && browse()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors select-none',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer',
          isDragOver && !disabled
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/20 hover:bg-muted/40',
        )}
      >
        <DropzoneIcon accept={accept} />

        <div className='flex flex-col gap-0.5'>
          <p className='text-sm font-medium'>
            Drop {multiple ? 'files' : 'a file'} here
          </p>
          <p className='text-xs text-muted-foreground'>or browse your device</p>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          disabled={disabled || isUploading}
          onClick={(e) => {
            e.stopPropagation()
            browse()
          }}
        >
          <Upload />
          Browse
        </Button>

        <input
          ref={inputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          className='hidden'
          onChange={onInputChange}
        />
      </div>

      {error && <p className='text-xs text-destructive'>{error}</p>}

      {activeUploads.length > 0 && (
        <ul className='flex flex-col gap-2'>
          {activeUploads.map(([name, pct]) => (
            <li key={name} className='flex flex-col gap-1'>
              <div className='flex items-center justify-between text-xs'>
                <span className='max-w-[80%] truncate text-muted-foreground'>
                  {name}
                </span>
                <span className='tabular-nums'>{pct}%</span>
              </div>
              <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full bg-primary transition-all duration-300'
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {uploaded.length > 0 && (
        <ul className='flex flex-col gap-1'>
          {uploaded.map((file) => (
            <li
              key={file.path}
              className='flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2'
            >
              <Upload className='size-3.5 shrink-0 text-green-600' />
              <span className='flex-1 truncate text-xs'>{file.name}</span>
              <button
                type='button'
                aria-label={`Remove ${file.name}`}
                onClick={() => removeUploaded(file.path)}
                className='shrink-0 text-muted-foreground transition-colors hover:text-destructive'
              >
                <X className='size-3.5' />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
