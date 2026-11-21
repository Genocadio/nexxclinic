"use client"

import { useCallback, useRef, useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

export function useUnsavedChangesGuard(onClose: () => void) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const pendingCloseRef = useRef<(() => void) | null>(null)

  const requestClose = useCallback(
    (afterClose?: () => void) => {
      if (isBusy) return
      const close = () => {
        onClose()
        afterClose?.()
      }

      if (hasUnsavedChanges) {
        pendingCloseRef.current = close
        setConfirmOpen(true)
        return
      }

      close()
    },
    [hasUnsavedChanges, isBusy, onClose],
  )

  const handleConfirmDiscard = useCallback(() => {
    const close = pendingCloseRef.current
    pendingCloseRef.current = null
    setConfirmOpen(false)
    setHasUnsavedChanges(false)
    close?.()
  }, [])

  const handleConfirmOpenChange = useCallback((open: boolean) => {
    setConfirmOpen(open)
    if (!open) pendingCloseRef.current = null
  }, [])

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setIsBusy,
    confirmOpen,
    requestClose,
    handleConfirmDiscard,
    handleConfirmOpenChange,
  }
}

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  title = "Discard unsaved changes?",
  description = "Some changes may already have been saved. Any remaining unsaved changes will be lost if you leave.",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiscard: () => void
  title?: string
  description?: string
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel="Discard changes"
      cancelLabel="Keep editing"
      destructive
      onConfirm={onDiscard}
    />
  )
}
