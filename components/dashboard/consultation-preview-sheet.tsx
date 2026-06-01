"use client"

import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useConsultationAnswers } from "@/hooks/auth-hooks"
import { ConsultationFormDisplay } from "@/components/consultation/consultation-form-display"
import { hydrateSavedAnswers } from "@/components/consultation/consultation-form-utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ConsultationPreviewSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consultationId: string | null
  departmentId: string | null
  departmentName?: string
  patientName?: string
  previewStartedAt?: number | null
}

const CONSULTATION_FORM_CONTEXT_PREFIX = 'consultation_form_context'

const getConsultationFormContextKey = (consultationId?: string | null, departmentId?: string | null) =>
  `${CONSULTATION_FORM_CONTEXT_PREFIX}:${String(consultationId || '')}:${String(departmentId || '')}`

export function ConsultationPreviewSheet({
  open,
  onOpenChange,
  consultationId,
  departmentId,
  departmentName,
  patientName,
  previewStartedAt,
}: ConsultationPreviewSheetProps) {
  const [previewContext, setPreviewContext] = useState<Record<string, any> | null>(null)
  const [previewFormId, setPreviewFormId] = useState<string | null>(null)
  const [contextChecked, setContextChecked] = useState(false)
  const [previewReadyLogged, setPreviewReadyLogged] = useState(false)
  const [isRendered, setIsRendered] = useState(open)
  const {
    consultationAnswers,
    loading: answersLoading,
    error: answersError,
    loadConsultationAnswers,
  } = useConsultationAnswers(consultationId, departmentId, previewFormId)
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({})
  const [previewTableShapes, setPreviewTableShapes] = useState<Record<string, { rows: number; columns: number }>>({})
  const [previewFieldActions, setPreviewFieldActions] = useState<Record<string, any[]>>({})
  const answersMap = (Object.keys(previewAnswers).length > 0 ? previewAnswers : (consultationAnswers?.answersMap || {})) as Record<string, unknown>
  const consultationForm = useMemo(() => consultationAnswers?.form || previewContext?.form || null, [consultationAnswers?.form, previewContext?.form])
  const answerStatus = consultationAnswers?.answer?.status || null

  useEffect(() => {
    if (open) {
      setIsRendered(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [open])

  useEffect(() => {
    if (!open || !consultationId || !departmentId || typeof window === 'undefined') {
      setContextChecked(false)
      setPreviewReadyLogged(false)
      return
    }

    setContextChecked(false)
    try {
      const raw = window.localStorage.getItem(getConsultationFormContextKey(consultationId, departmentId))
      if (!raw) {
        setPreviewContext(null)
        setPreviewFormId(null)
      } else {
        const context = JSON.parse(raw)
        setPreviewContext(context)
        setPreviewFormId(String(context?.formId || ''))
      }
    } catch {
      setPreviewContext(null)
      setPreviewFormId(null)
    } finally {
      setContextChecked(true)
    }
  }, [open, consultationId, departmentId])

  useEffect(() => {
    if (!open) {
      setPreviewReadyLogged(false)
      return
    }

    if (!consultationForm || !contextChecked || answersLoading || previewReadyLogged) return

    const elapsedMs = typeof previewStartedAt === 'number' ? Date.now() - previewStartedAt : null
    console.log('[ConsultationPreview] ready', {
      consultationId,
      departmentId,
      hasAnswers: Boolean(consultationAnswers?.answersMap),
      hasForm: Boolean(consultationForm),
      elapsedMs,
    })
    setPreviewReadyLogged(true)
  }, [answersLoading, consultationAnswers?.answersMap, consultationForm, consultationId, contextChecked, departmentId, open, previewReadyLogged, previewStartedAt])

  useEffect(() => {
    if (!open || !consultationId || !departmentId) return

    void loadConsultationAnswers({
      variables: {
        visitId: consultationId,
        visitDepartmentId: departmentId,
      },
    })
  }, [open, consultationId, departmentId, loadConsultationAnswers])

  useEffect(() => {
    const previewForm = consultationAnswers?.form || previewContext?.form || null
    const savedAnswers = consultationAnswers?.answersMap || null
    if (!open || !previewForm || !savedAnswers) return

    hydrateSavedAnswers(
      savedAnswers,
      previewForm,
      setPreviewAnswers,
      setPreviewFieldActions,
      setPreviewTableShapes,
    )
  }, [open, previewContext?.form, consultationAnswers?.form, consultationAnswers?.answersMap])
  const isLoading = answersLoading || (!contextChecked && !consultationForm)

  if (!isRendered || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[88]">
      <div
        className={`absolute top-16 bottom-0 left-0 md:left-[420px] right-0 bg-transparent transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Consultation Preview"
        className={`absolute right-0 top-16 h-[calc(100vh-4rem)] w-[min(92vw,56rem)] border-l border-border bg-background shadow-2xl transition-transform duration-200 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border/70 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-foreground">Consultation Preview</h2>
                  {answerStatus && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${answerStatus === 'FINAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {answerStatus.toLowerCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {patientName ? `${patientName} • ` : ""}
                  {departmentName || "Department"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-88px)] px-4 py-4">
            <div className="space-y-4 pr-4">
              {isLoading && <p className="text-sm text-muted-foreground">Loading consultation answers...</p>}

              {!isLoading && !consultationForm && !previewFormId && (
                <p className="text-sm text-muted-foreground">No saved consultation form context found for this visit.</p>
              )}

              {!isLoading && !consultationForm && previewFormId && answersError && (
                <p className="text-sm text-destructive">Failed to load consultation answers: {answersError}</p>
              )}

              {!isLoading && !consultationForm && previewFormId && !answersError && (
                <p className="text-sm text-muted-foreground">Saved consultation form context was found, but the form could not be loaded.</p>
              )}

              {!isLoading && consultationForm && !answersError && (
                <div className="space-y-4">
                  <ConsultationFormDisplay
                    departmentForm={consultationForm}
                    formLoading={false}
                    formLoadFailed={false}
                    formAnswers={answersMap as Record<string, any>}
                    setFormAnswers={undefined}
                    tableShapes={previewTableShapes}
                    setTableShapes={undefined}
                    diagnosticDrafts={{}}
                    setDiagnosticDrafts={undefined}
                    medicationLongDrafts={{}}
                    setMedicationLongDrafts={undefined}
                    medicationMiniDrafts={{}}
                    setMedicationMiniDrafts={undefined}
                    fieldActions={previewFieldActions as Record<string, any>}
                    readOnly={true}
                    hideActionListenerAddButton={true}
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
