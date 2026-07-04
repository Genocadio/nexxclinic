'use client'

import { createPortal } from 'react-dom'
import { X, ImageIcon } from 'lucide-react'

export interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onPick: (file: { url: string; path: string; name: string }) => void
  title?: string
}

export function MediaPickerModal({
  open,
  onClose,
  title = 'Pick a file',
}: MediaPickerModalProps) {
  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='relative flex w-full max-w-2xl flex-col rounded-lg border bg-background shadow-xl max-h-[80vh]'>
        <div className='flex shrink-0 items-center justify-between border-b px-5 py-3'>
          <h2 className='text-base font-semibold'>{title}</h2>
          <button
            type='button'
            aria-label='Close'
            onClick={onClose}
            className='text-muted-foreground transition-colors hover:text-foreground'
          >
            <X className='size-4' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          <div className='flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground'>
            <ImageIcon className='size-10 opacity-25' />
            <p className='text-sm'>File browsing is not available yet.</p>
            <p className='text-xs'>Use the upload button to add files.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
