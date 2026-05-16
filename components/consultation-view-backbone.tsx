"use client"

import { useEffect, useRef, useState } from "react"
import type { Patient } from "@/lib/types"
import { useAddActionToVisitDepartment, useAddConsumableToVisitDepartment, useUpsertConsultationAnswers } from "@/hooks/auth-hooks"
import { useConsultationAnswers, useLatestForm, useFormVersionHistory } from "@/hooks/forms"
import AddActionConsumableModal from "@/components/add-action-consumable-modal"
import FormActionsDisplay from "@/components/form-actions-display"
import { ConsultationSidePanels } from "@/components/consultation/consultation-side-panels"
import { ConsultationBottomDock } from "@/components/consultation/consultation-bottom-dock"
import { ConsultationFormDisplay } from "@/components/consultation/consultation-form-display"
import { useRemoveProductFromVisitDepartment, useUpdateProductQuantity } from "@/hooks/visits"
import {
  normalizeField,
  normalizeSection,
  buildAnswersForSubmission,
  hydrateSavedAnswers,
  type BackendDepartmentForm,
} from "@/components/consultation/consultation-form-utils"
import type { FormAction } from "@/lib/form-storage"

interface ConsultationViewBackboneProps {
  consultation: any
  patient: Patient
  departmentId?: string
  existingProducts?: FormAction[]
  onSave: (consultation: any) => void
  onBack: () => void
}

interface PanelState {
  pinned: boolean
  hover: boolean
}

export default function ConsultationViewBackbone({
  consultation: initialConsultation,
  patient,
  departmentId,
  existingProducts = [],
  onSave,
  onBack: _onBack,
}: ConsultationViewBackboneProps) {
  const [consultation, setConsultation] = useState<any>(initialConsultation)
  const [departmentForm, setDepartmentForm] = useState<BackendDepartmentForm | null>(null)
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})
  const [existingSubmissionStatus, setExistingSubmissionStatus] = useState<'DRAFT' | 'FINAL' | null>(null)
  const [answersLoaded, setAnswersLoaded] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formLoadFailed, setFormLoadFailed] = useState(false)
  const [formReloadKey, setFormReloadKey] = useState(0)
  const lastSavedFieldActionsRef = useRef<Record<string, string[]>>({}) // Store backendIds for comparison
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { loadLatestForm: loadForm } = useLatestForm(departmentId || null)
  const { loadConsultationAnswers: loadAnswers } = useConsultationAnswers(initialConsultation.consultationId || null, departmentId || null, departmentForm?.id || null)
  const { loadVersionHistory } = useFormVersionHistory(departmentId || null, null)
  const { upsertConsultationAnswers } = useUpsertConsultationAnswers()

  const mapBackendFormVersion = (raw: any): BackendDepartmentForm => ({
    id: String(raw?.id || ''),
    title: raw?.title || 'Consultation Form',
    description: raw?.description || '',
    status: raw?.status === 'FINAL' ? 'FINAL' : 'DRAFT',
    currentVersionNumber: raw?.version ? String(raw.version) : undefined,
    currentSchemaVersion: raw?.version ? String(raw.version) : undefined,
    fields: Array.isArray(raw?.fields) ? raw.fields.map((field: any, idx: number) => normalizeField(field, idx)) : [],
    sections: Array.isArray(raw?.sections) ? raw.sections.map((section: any, idx: number) => normalizeSection(section, idx)) : [],
  })

  // Product modal state
  const [showAddActionModal, setShowAddActionModal] = useState(false)
  const [actionListenerFieldId, setActionListenerFieldId] = useState<string | null>(null)
  const [fieldActions, setFieldActions] = useState<Record<string, FormAction[]>>({})
  const [showMissingProductsPrompt, setShowMissingProductsPrompt] = useState(false)
  const [missingProductsForField, setMissingProductsForField] = useState<Record<string, FormAction[]>>({})
  const [missingPromptHandled, setMissingPromptHandled] = useState(false)
  const [tableShapes, setTableShapes] = useState<Record<string, { rows: number; columns: number }>>({})
  const [diagnosticDrafts, setDiagnosticDrafts] = useState<Record<string, { diagnosis: string; description: string }>>({})

  const extractProductIdentifiers = (action: FormAction) => {
    const ids = new Set<string>()
    const add = (value: unknown) => {
      if (value !== null && value !== undefined) {
        ids.add(String(value))
      }
    }

    add(action.backendId)
    add(action.rawData?.id)
    add(action.rawData?.product?.id)
    add(action.rawData?.action?.id)
    add(action.rawData?.consumable?.id)
    add(action.rawData?.action?.product?.id)
    add(action.rawData?.consumable?.product?.id)

    return Array.from(ids)
  }

  const existingProductReferenceIds = Array.from(
    new Set([
      ...Object.values(fieldActions).flatMap((actions) => actions.flatMap(extractProductIdentifiers)),
      ...existingProducts.flatMap((product) => extractProductIdentifiers(product)),
    ])
  )
  const [medicationLongDrafts, setMedicationLongDrafts] = useState<Record<string, { name: string; frequency: string; amount: string; days: string; notes: string }>>({})
  const [medicationMiniDrafts, setMedicationMiniDrafts] = useState<Record<string, { name: string; notes: string }>>({})
  const { addAction } = useAddActionToVisitDepartment()
  const { addConsumable } = useAddConsumableToVisitDepartment()
  const { updateQuantity: updateProductQuantity } = useUpdateProductQuantity()
  const { removeProduct: removeVisitProduct } = useRemoveProductFromVisitDepartment()

  // Panel states
  const [idPanel, setIdPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [vitalsPanel, setVitalsPanel] = useState<PanelState>({ pinned: false, hover: false })
  const [historyPanel, setHistoryPanel] = useState<PanelState>({ pinned: false, hover: false })

  // Load form on department change
  useEffect(() => {
    const loadLatestFinalizedForm = async () => {
      if (!departmentId) {
        setDepartmentForm(null)
        return
      }

      try {
        setFormLoading(true)
        setFormLoadFailed(false)

        const formResult = await loadForm({
          variables: { departmentId },
          fetchPolicy: 'network-only',
        })

        const raw = formResult?.data?.getLatestForm?.data
        if (!raw) {
          setDepartmentForm(null)
          return
        }

        setDepartmentForm({
          id: String(raw.id),
          title: raw.title || 'Consultation Form',
          description: raw.description || '',
          status: raw.status === 'FINAL' ? 'FINAL' : 'DRAFT',
          currentVersionNumber: raw.version || undefined,
          currentSchemaVersion: raw.version || undefined,
          fields: Array.isArray(raw.fields) ? raw.fields.map((field: any, idx: number) => normalizeField(field, idx)) : [],
          sections: Array.isArray(raw.sections) ? raw.sections.map((section: any, idx: number) => normalizeSection(section, idx)) : [],
        })
      } catch (err) {
        console.error('Failed to load finalized department form', err)
        setDepartmentForm(null)
        setFormLoadFailed(true)
      } finally {
        setFormLoading(false)
      }
    }

    loadLatestFinalizedForm()
  }, [departmentId, loadForm, formReloadKey])

  // Load existing answers on form/consultation change
  useEffect(() => {
    const loadExistingAnswers = async () => {
      if (!departmentId || !consultation.consultationId || !departmentForm) {
        return
      }

      try {
        const answersResult = await loadAnswers({
          variables: {
            consultationId: consultation.consultationId,
            departmentId,
            formId: departmentForm.id,
          },
          fetchPolicy: 'network-only',
        })

        const answerData = answersResult?.data?.getConsultationAnswers?.data
        const rawAnswers = answerData?.answers
        const storedStatus = answerData?.status
        const storedFormId = answerData?.formId ? String(answerData.formId) : ''
        const storedSchemaVersion = answerData?.formVersion ? String(answerData.formVersion) : ''

        setExistingSubmissionStatus(storedStatus === 'FINAL' ? 'FINAL' : storedStatus === 'DRAFT' ? 'DRAFT' : null)

        if (!rawAnswers) {
          return
        }

        const parsed = JSON.parse(rawAnswers)
        const answerMap = parsed?.values && typeof parsed.values === 'object' ? parsed.values : parsed
        const currentVersion = String(departmentForm.currentSchemaVersion || departmentForm.currentVersionNumber || '')
        const shouldResolveHistoricalVersion = Boolean(storedFormId && storedSchemaVersion && currentVersion && storedSchemaVersion !== currentVersion)

        let formForHydration = departmentForm
        if (shouldResolveHistoricalVersion) {
          const versionResult = await loadVersionHistory({
            variables: {
              departmentId,
              formId: storedFormId,
            },
            fetchPolicy: 'network-only',
          })

          const versionCandidates = versionResult?.data?.getFormVersionHistory?.data || []
          const exactVersion = versionCandidates.find((candidate: any) => String(candidate?.version || candidate?.versionNumber || '') === storedSchemaVersion)

          if (exactVersion) {
            formForHydration = mapBackendFormVersion(exactVersion)
            setDepartmentForm(formForHydration)
          }
        }

        if (answerMap && typeof answerMap === 'object') {
          hydrateSavedAnswers(answerMap, formForHydration, setFormAnswers, setFieldActions, setTableShapes)

          // Reconcile stale backendIds: saved consultation answers store the
          // VisitDepartmentProduct.id at the time of last save. If that product
          // was removed and re-added since then, its ID changes. We fix this by
          // matching each saved action against the live existingProducts by
          // catalog product ID and replacing any stale backendId with the
          // current live VisitDepartmentProduct.id.
          if (existingProducts && existingProducts.length > 0) {
            // Build a lookup: catalogProductId → live VisitDepartmentProduct.id
            const liveBackendIdByCatalogId = new Map<string, string>()
            existingProducts.forEach((liveProduct) => {
              // rawData is the VisitDepartmentProduct shape from the visit query
              const catalogId = String(
                liveProduct.rawData?.product?.id ||
                liveProduct.rawData?.action?.id ||
                liveProduct.rawData?.consumable?.id ||
                ''
              )
              const liveBackendId = String(liveProduct.backendId || liveProduct.id || '')
              if (catalogId && liveBackendId) {
                liveBackendIdByCatalogId.set(catalogId, liveBackendId)
              }
            })

            if (liveBackendIdByCatalogId.size > 0) {
              setFieldActions((prev) => {
                let changed = false
                const next: Record<string, FormAction[]> = {}
                Object.keys(prev).forEach((fieldId) => {
                  next[fieldId] = prev[fieldId].map((action) => {
                    // Determine the catalog product ID stored in this saved action
                    const savedCatalogId = String(
                      action.rawData?.catalogItemId ||
                      action.rawData?.id ||
                      ''
                    )
                    if (!savedCatalogId) return action

                    const liveBackendId = liveBackendIdByCatalogId.get(savedCatalogId)
                    if (!liveBackendId) return action
                    if (action.backendId === liveBackendId) return action

                    console.log('[Consultation-Reconcile] Patching stale backendId for', action.name, {
                      stale: action.backendId,
                      live: liveBackendId,
                      catalogId: savedCatalogId,
                    })
                    changed = true
                    return { ...action, backendId: liveBackendId }
                  })
                })
                return changed ? next : prev
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to load existing consultation answers', err)
      } finally {
        setAnswersLoaded(true)
      }
    }

    loadExistingAnswers()
  }, [consultation.consultationId, departmentForm, departmentId, loadAnswers, loadVersionHistory])

  // Hydrate existing products from visit into fieldActions if actionListener field exists
  useEffect(() => {
    console.log('[Consultation-Hydration] ===START=== existingProducts count:', existingProducts?.length, 'departmentForm:', departmentForm?.id)
    
    if (!departmentForm) {
      console.log('[Consultation-Hydration] Early exit: no departmentForm')
      return
    }
    if (!answersLoaded) {
      console.log('[Consultation-Hydration] Early exit: answers not loaded yet')
      return
    }
    if (!existingProducts || existingProducts.length === 0) {
      console.log('[Consultation-Hydration] Early exit: no existingProducts')
      return
    }

    // Find actionListener fields in the form
    const actionListenerFields = departmentForm.fields.filter(field => field.type === 'actionListener')
    console.log('[Consultation-Hydration] Found', actionListenerFields.length, 'actionListener fields:', actionListenerFields.map(f => f.id))
    
    if (actionListenerFields.length === 0) {
      console.log('[Consultation-Hydration] Early exit: no actionListener fields')
      return
    }

    // For each actionListener field, hydrate with existing products
    actionListenerFields.forEach(field => {
      const currentFieldActions = fieldActions[field.id] || []
      const currentProductIds = new Set(currentFieldActions.flatMap((action) => extractProductIdentifiers(action)))
      const missingProducts = existingProducts.filter((p) => {
        const productIds = new Set<string>([
          String(p.backendId),
          String(p.rawData?.id),
          String(p.rawData?.product?.id),
          String(p.rawData?.action?.id),
          String(p.rawData?.consumable?.id),
        ].filter(Boolean))
        return !Array.from(productIds).some((id) => currentProductIds.has(id))
      })
      
      console.log('[Consultation-Hydration] Field:', field.id, {
        currentFieldActionsCount: currentFieldActions.length,
        currentIds: Array.from(currentProductIds),
        existingProductsCount: existingProducts.length,
        existingIds: existingProducts.map(p => p.backendId),
        missingCount: missingProducts.length,
        willShowPrompt: missingProducts.length > 0 || (currentFieldActions.length === 0 && existingProducts.length > 0)
      })

      if (missingProducts.length > 0) {
        console.log('[Consultation-Hydration] SETTING PROMPT - missingProducts:', missingProducts.length)
        // Instead of immediately merging, prompt the user to append missing visit products
        setMissingProductsForField(prev => ({
          ...prev,
          [field.id]: missingProducts,
        }))
        setShowMissingProductsPrompt(true)
        setMissingPromptHandled(false)
      } else if (currentFieldActions.length === 0 && existingProducts.length > 0) {
        console.log('[Consultation-Hydration] SETTING PROMPT - empty field with existing products')
        // No explicit missing items but field is empty; prompt user to append
        setMissingProductsForField(prev => ({
          ...prev,
          [field.id]: existingProducts,
        }))
        setShowMissingProductsPrompt(true)
        setMissingPromptHandled(false)
      } else {
        console.log('[Consultation-Hydration] No action needed for field:', field.id)
      }
    })
    console.log('[Consultation-Hydration] ===END===')
  }, [departmentForm, existingProducts, fieldActions])

  useEffect(() => {
    if (!departmentForm || !existingProducts) return

    setFieldActions(prev => {
      let changed = false
      const next: Record<string, FormAction[]> = {}
      const existingProductIds = new Set(existingProducts.flatMap((product) => extractProductIdentifiers(product)))

      Object.keys(prev).forEach((fieldId) => {
        next[fieldId] = prev[fieldId].map((action) => {
          if (action.source !== 'saved') return action

          const actionIds = extractProductIdentifiers(action)
          const existsInVisit = actionIds.some((id) => existingProductIds.has(id))
          const removedFromVisit = !existsInVisit

          if (action.removedFromVisit === removedFromVisit) return action

          changed = true
          return { ...action, removedFromVisit }
        })
      })

      return changed ? next : prev
    })
  }, [departmentForm, existingProducts, fieldActions])

  // Helper to create/persist answers for a given field -> products mapping
  const createAnswersForProducts = async (fieldId: string, products: FormAction[]) => {
    if (!departmentForm || !consultation.consultationId) return null

    try {
      console.log('[Consultation] Creating answers for field', fieldId, 'with products:', products)

      // Build a temporary fieldActions map to generate normalized answers
      const tempFieldActions = {
        ...fieldActions,
        [fieldId]: products,
      }

      const normalized = buildAnswersForSubmission(formAnswers, tableShapes, tempFieldActions, departmentForm)
      const answersMap = normalized ?? {}

      const result = await upsertConsultationAnswers({
        consultationId: consultation.consultationId,
        visitId: consultation.id || consultation.consultationId,
        patientId: patient.id,
        departmentId: departmentId || '',
        formId: String(departmentForm.id),
        formVersion: String(departmentForm.currentSchemaVersion || departmentForm.currentVersionNumber),
        status: 'DRAFT',
        answers: JSON.stringify(answersMap),
      })

      console.log('[Consultation] createAnswersForProducts result:', result)
      return result
    } catch (err) {
      console.error('[Consultation] createAnswersForProducts error:', err)
      return null
    }
  }

  // Merge two FormAction arrays preserving uniqueness by backendId (fallback to id)
  const mergeUniqueByBackendId = (existing: FormAction[] = [], incoming: FormAction[] = []) => {
    const map = new Map<string, FormAction>()
    existing.forEach((it) => {
      const key = String(it.backendId ?? it.id ?? JSON.stringify(it))
      map.set(key, it)
    })
    incoming.forEach((it) => {
      const key = String(it.backendId ?? it.id ?? JSON.stringify(it))
      if (!map.has(key)) map.set(key, it)
    })
    return Array.from(map.values())
  }

  // Wrapped onBack that will create answers for missing products if the user hasn't handled the prompt
  const saveCurrentAnswersDraft = async (fieldActionsToSave: Record<string, FormAction[]> = fieldActions) => {
    if (!departmentForm || !consultation.consultationId || !patient.id) {
      return null
    }

    try {
      const normalizedAnswers = buildAnswersForSubmission(formAnswers, tableShapes, fieldActionsToSave, departmentForm)
      const answersMap = normalizedAnswers ?? {}
      const saveResult = await upsertConsultationAnswers({
        consultationId: consultation.consultationId,
        visitId: consultation.id || consultation.consultationId,
        patientId: patient.id,
        departmentId: departmentId || '',
        formId: String(departmentForm.id),
        formVersion: String(departmentForm.currentSchemaVersion || departmentForm.currentVersionNumber),
        status: 'DRAFT',
        answers: JSON.stringify(answersMap),
      })

      if (saveResult?.status === 'SUCCESS') {
        Object.keys(fieldActionsToSave).forEach((fieldId) => {
          lastSavedFieldActionsRef.current[fieldId] = fieldActionsToSave[fieldId]
            .map((a) => `${a.backendId ?? a.id}:${a.quantity}`)
            .sort()
        })

        const formSubmissionPayload = {
          consultationId: consultation.consultationId,
          departmentId,
          formId: departmentForm.id,
          formVersion: departmentForm.currentSchemaVersion || departmentForm.currentVersionNumber,
          formSchemaVersion: departmentForm.currentSchemaVersion,
          formVersionNumber: departmentForm.currentVersionNumber,
          formTitle: departmentForm.title,
          existingSubmissionStatus: saveResult.data?.status || 'DRAFT',
          status: 'draft' as const,
          answers: { values: answersMap },
          submittedAt: new Date().toISOString(),
        }

        const updated: any = {
          ...consultation,
          status: 'draft',
          specialtyExtensions: {
            ...(consultation.specialtyExtensions || {}),
            dynamicFormResponse: formSubmissionPayload,
          },
        }

        setConsultation(updated)
        onSave(updated)
      }

      return saveResult
    } catch (err) {
      console.error('[Consultation] saveCurrentAnswersDraft error:', err)
      return null
    }
  }

  const handleBack = async () => {
    if (showMissingProductsPrompt && !missingPromptHandled) {
      console.log('[Consultation] User is exiting while missing-products prompt is active; creating answers for those products before exit')
      // create answers for each pending field
      for (const fieldId of Object.keys(missingProductsForField)) {
        const prods = missingProductsForField[fieldId] || []
        if (prods.length > 0) {
          await createAnswersForProducts(fieldId, prods)
        }
      }
      setMissingPromptHandled(true)
      setShowMissingProductsPrompt(false)
    }

    // Finally call the parent back handler
    try {
      _onBack()
    } catch (err) {
      console.error('[Consultation] error calling parent onBack:', err)
    }
  }

  useEffect(() => {
    if (!departmentForm || !consultation.consultationId || Object.keys(fieldActions).length === 0) {
      return
    }

    // Check if this is a form with actionListener fields
    const hasActionListenerField = departmentForm.fields.some(field => field.type === 'actionListener')
    if (!hasActionListenerField) {
      return
    }

    // Check if fieldActions changed by comparing backendIds and quantities
    const fieldActionsChanged = Object.keys(fieldActions).some((fieldId) => {
      const current = fieldActions[fieldId]
      const lastSaved = lastSavedFieldActionsRef.current[fieldId] || []
      
      const currentSnapshot = current
        .map((a) => `${a.backendId ?? a.id}:${a.quantity}`)
        .sort()
      if (currentSnapshot.length !== lastSaved.length) return true
      return currentSnapshot.some((entry, idx) => entry !== lastSaved[idx])
    })

    if (!fieldActionsChanged) {
      return
    }

    // Clear any pending timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Delay slightly to ensure state is settled, then auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      await saveCurrentAnswersDraft(fieldActions)
    }, 100)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [fieldActions, departmentForm, consultation, tableShapes, formAnswers, departmentId, onSave, patient.id, upsertConsultationAnswers])
  
  const handleStatusSave = (status: 'draft' | 'finalized') => {
    const normalizedAnswers = buildAnswersForSubmission(formAnswers, tableShapes, fieldActions, departmentForm)

    const answersPayload = {
      formId: departmentForm?.id,
      formVersion: departmentForm?.currentSchemaVersion || departmentForm?.currentVersionNumber,
      formSchemaVersion: departmentForm?.currentSchemaVersion,
      formVersionNumber: departmentForm?.currentVersionNumber,
      values: normalizedAnswers,
    }

    const formSubmissionPayload = {
      consultationId: consultation.consultationId,
      departmentId,
      formId: departmentForm?.id,
      formVersion: departmentForm?.currentSchemaVersion || departmentForm?.currentVersionNumber,
      formSchemaVersion: departmentForm?.currentSchemaVersion,
      formVersionNumber: departmentForm?.currentVersionNumber,
      formTitle: departmentForm?.title,
      existingSubmissionStatus,
      status,
      answers: answersPayload,
      submittedAt: new Date().toISOString(),
    }

    if (status === 'finalized') {
      console.log('Consultation form completed:', formSubmissionPayload)
    } else {
      console.log('Consultation form draft saved:', formSubmissionPayload)
    }

    const timestamped = {
      ...consultation.timestamps,
      finalizedAt: status === 'finalized'
        ? consultation.timestamps.finalizedAt ?? new Date().toISOString()
        : undefined,
    }

    const updated: any = {
      ...consultation,
      status,
      timestamps: timestamped,
      specialtyExtensions: {
        ...(consultation.specialtyExtensions || {}),
        dynamicFormResponse: formSubmissionPayload,
      },
    }

    setConsultation(updated)
    onSave(updated)
  }

  const handleAddAction = async (type: 'action' | 'consumable', item: any, quantity: number, departmentIdParam: string) => {
    if (!actionListenerFieldId) return

    try {
      const visitId = consultation.consultationId
      const searchResultId = String(item.id)
      // Prevent adding duplicate products to the same field: compare catalog IDs, raw product IDs, and backend visit product IDs.
      const existingList = fieldActions[actionListenerFieldId] || []
      const existingItem = existingList.find((a) => {
        const ids = extractProductIdentifiers(a)
        return ids.includes(searchResultId)
      })

      if (existingItem) {
        const newQty = (existingItem.quantity || 0) + quantity
        // Update local state
        setFieldActions(prev => ({
          ...prev,
          [actionListenerFieldId]: prev[actionListenerFieldId]?.map(a => a.id === existingItem.id ? { ...a, quantity: newQty } : a) || [],
        }))

        // If there's a backendId, update quantity on server
        if (existingItem.backendId) {
          try {
            await updateProductQuantity(existingItem.backendId, newQty)
          } catch (err) {
            console.error('Failed to update quantity when merging duplicate add:', err)
          }
        }

        return
      }

      // Otherwise, perform add on backend and append
      let result: any = null
      if (type === 'action') {
        result = await addAction(visitId, departmentIdParam, searchResultId, quantity)
      } else {
        result = await addConsumable(visitId, departmentIdParam, searchResultId, quantity)
      }

      if (result?.status === 'SUCCESS' && result.data) {
        let actualBackendId: string | null = null
        
        if (result.data?.departments) {
          const dept = result.data.departments.find((d: any) => String(d.id) === String(departmentIdParam))
          if (dept?.products && dept.products.length > 0) {
            const addedItem = dept.products.find((product: any) => {
              return String(product?.product?.id) === String(searchResultId)
            })
            if (addedItem?.id) {
              actualBackendId = String(addedItem.id)
            }
          }
        }

        if (!actualBackendId) {
          console.warn(`[handleAddAction] Failed to extract VisitDepartmentProduct ID for ${type} ${searchResultId}; using catalog ID as fallback`, { result })
          actualBackendId = String(searchResultId)
        }

        const newAction: FormAction = {
          id: `${type}-${searchResultId}-${Date.now()}`,
          name: item.name,
          type,
          quantity,
          privatePrice: item.privatePrice,
          isQuantifiable: item.isQuantifiable !== false,
          backendId: actualBackendId,
          rawData: item,
          source: 'local',
        }

        console.log('[handleAddAction] Created new FormAction:', {
          actionId: newAction.id,
          name: newAction.name,
          type: newAction.type,
          backendId: newAction.backendId,
          source: newAction.source,
        })

        setFieldActions(prev => ({
          ...prev,
          [actionListenerFieldId]: [...(prev[actionListenerFieldId] || []), newAction],
        }))
      }
    } catch (err) {
      console.error('Failed to add action/consumable:', err)
    }
  }

  const handleRemoveAction = async (fieldId: string, actionId: string) => {
    const action = fieldActions[fieldId]?.find(a => a.id === actionId)
    if (!action) return

    if (!action.backendId || action.removedFromVisit) {
      setFieldActions(prev => ({
        ...prev,
        [fieldId]: prev[fieldId]?.filter(a => a.id !== actionId) || [],
      }))
      return
    }

    try {
      console.log('[ConsultationViewBackbone] Removing action via server:', {
        fieldId,
        actionId,
        actionName: action.name,
        actionType: action.type,
        backendId: action.backendId,
        source: action.source,
      })
      
      const result = await removeVisitProduct(action.backendId)
      
      console.log('[ConsultationViewBackbone] Remove result:', result)

      const isSuccess = result?.status === 'SUCCESS'
      // "not found" means the product is already gone from the visit —
      // treat it the same as a successful removal so the UI stays in sync.
      const alreadyGone = !isSuccess &&
        typeof result?.message === 'string' &&
        /not found/i.test(result.message)

      if (isSuccess || alreadyGone) {
        if (alreadyGone) {
          console.warn('[ConsultationViewBackbone] Product already absent from visit; removing from field UI:', action.name)
        }
        setFieldActions(prev => ({
          ...prev,
          [fieldId]: prev[fieldId]?.filter(a => a.id !== actionId) || [],
        }))
      } else {
        console.error('Failed to remove action/consumable via removeVisitDepartmentProduct:', result?.message)
      }
    } catch (err) {
      console.error('Failed to remove action/consumable:', err)
    }
  }

  const handleRestoreRemovedAction = async (fieldId: string, actionId: string) => {
    const action = fieldActions[fieldId]?.find(a => a.id === actionId)
    if (!action || !action.rawData?.id || !consultation?.consultationId) return

    const quantity = action.quantity || 1
    const searchResultId = String(action.rawData.id)
    const departmentIdArg = departmentId || ''

    try {
      const result = action.type === 'action'
        ? await addAction(consultation.consultationId, departmentIdArg, searchResultId, quantity)
        : await addConsumable(consultation.consultationId, departmentIdArg, searchResultId, quantity)

      let actualBackendId = action.backendId
      const departments = result?.data?.departments || []
      const matchedDepartment = departments.find((dep: any) => String(dep.id) === String(departmentIdArg))
      if (matchedDepartment?.products && matchedDepartment.products.length > 0) {
        const addedItem = matchedDepartment.products.find((item: any) => {
          return String(item?.product?.id) === searchResultId
        })
        if (addedItem?.id) {
          actualBackendId = String(addedItem.id)
        }
      }

      console.log('[handleRestoreRemovedAction] Restored product:', {
        fieldId,
        actionId,
        actionName: action.name,
        actionType: action.type,
        originalBackendId: action.backendId,
        newBackendId: actualBackendId,
      })

      setFieldActions(prev => ({
        ...prev,
        [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? {
          ...a,
          backendId: actualBackendId,
          removedFromVisit: false,
          source: 'local',
        } : a) || [],
      }))
    } catch (err) {
      console.error('Failed to restore removed action:', err)
    }
  }

  const handleUpdateActionQuantity = async (fieldId: string, actionId: string, quantity: number) => {
    const action = fieldActions[fieldId]?.find(a => a.id === actionId)
    
    // Update local state first
    setFieldActions(prev => ({
      ...prev,
      [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? { ...a, quantity } : a) || [],
    }))

    // If we have a backendId and quantity is 0, remove the item from backend
    if (action?.backendId && quantity === 0) {
      await handleRemoveAction(fieldId, actionId)
      return
    }

    // If we have a backendId, update the quantity on the backend
    if (action?.backendId) {
      try {
        await updateProductQuantity(action.backendId, quantity)
      } catch (err) {
        console.error('Failed to update quantity on backend:', err)
        // Revert local state on error
        setFieldActions(prev => ({
          ...prev,
          [fieldId]: prev[fieldId]?.map(a => a.id === actionId ? { ...a, quantity: action.quantity } : a) || [],
        }))
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <ConsultationFormDisplay
            departmentForm={departmentForm}
            formLoading={formLoading}
            formLoadFailed={formLoadFailed}
            formAnswers={formAnswers}
            setFormAnswers={setFormAnswers}
            tableShapes={tableShapes}
            setTableShapes={setTableShapes}
            diagnosticDrafts={diagnosticDrafts}
            setDiagnosticDrafts={setDiagnosticDrafts}
            medicationLongDrafts={medicationLongDrafts}
            setMedicationLongDrafts={setMedicationLongDrafts}
            medicationMiniDrafts={medicationMiniDrafts}
            setMedicationMiniDrafts={setMedicationMiniDrafts}
            fieldActions={fieldActions}
            onFormReload={() => setFormReloadKey((prev) => prev + 1)}
            onActionListenerClick={(fieldId) => {
              setActionListenerFieldId(fieldId)
              setShowAddActionModal(true)
            }}
            onUpdateQuantity={handleUpdateActionQuantity}
            onRemoveAction={handleRemoveAction}
            onRestoreAction={handleRestoreRemovedAction}
            visitId={consultation.consultationId}
            currentDepartmentId={departmentId}
          />
        </div>
      </div>

      <ConsultationSidePanels
        patient={patient}
        idPanel={idPanel}
        vitalsPanel={vitalsPanel}
        historyPanel={historyPanel}
        setIdPanel={setIdPanel}
        setVitalsPanel={setVitalsPanel}
        setHistoryPanel={setHistoryPanel}
      />

      <ConsultationBottomDock
        onSaveDraft={() => handleStatusSave('draft')}
        onFinalize={() => handleStatusSave('finalized')}
        onBack={handleBack}
      />

      {showMissingProductsPrompt && (
        (() => {
          console.log('[Consultation-Render] RENDERING PROMPT MODAL, missingProductsForField:', Object.keys(missingProductsForField))
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => { setShowMissingProductsPrompt(false); setMissingPromptHandled(false); }} />
              <div className="bg-white rounded p-6 z-10 max-w-lg w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Products found on visit</h3>
            <p className="mb-4">We found products on the visit that are not in the current form answers. Would you like to add them to the product listener field?</p>
            <div className="mb-4">
              {Object.keys(missingProductsForField).map(fieldId => {
                const products = missingProductsForField[fieldId] || []
                const productNames = products.map((product) => product.name).filter(Boolean)
                const fieldLabel = departmentForm?.fields?.find((field) => field.id === fieldId)?.label || fieldId

                return (
                  <div key={fieldId} className="mb-3">
                    <div className="text-sm font-medium text-slate-700">
                      <strong>Field:</strong> {fieldLabel} — <strong>{products.length}</strong> product(s)
                    </div>
                    {productNames.length > 0 && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {productNames.join(', ')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-2 bg-gray-200 rounded" onClick={() => { setShowMissingProductsPrompt(false); setMissingPromptHandled(true); }}>
                Ignore
              </button>
              {existingSubmissionStatus === null ? (
                <button className="px-3 py-2 bg-yellow-500 text-white rounded" onClick={async () => {
                  for (const fieldId of Object.keys(missingProductsForField)) {
                    const prods = missingProductsForField[fieldId] || []
                    if (prods.length > 0) {
                      const res = await createAnswersForProducts(fieldId, prods)
                      if (res?.status === 'SUCCESS') {
                        setFieldActions(prev => ({
                          ...prev,
                          [fieldId]: mergeUniqueByBackendId(prev[fieldId] || [], prods),
                        }))
                        lastSavedFieldActionsRef.current[fieldId] = (prods || []).map(p => p.backendId).sort()
                        setExistingSubmissionStatus('DRAFT')
                      }
                    }
                  }
                  setMissingPromptHandled(true)
                  setShowMissingProductsPrompt(false)
                }}>
                  Create answers now
                </button>
              ) : (
                <button className="px-3 py-2 bg-primary text-white rounded" onClick={() => {
                  Object.keys(missingProductsForField).forEach(fieldId => {
                    const prods = missingProductsForField[fieldId] || []
                    setFieldActions(prev => ({
                      ...prev,
                      [fieldId]: mergeUniqueByBackendId(prev[fieldId] || [], prods),
                    }))
                  })
                  setMissingPromptHandled(true)
                  setShowMissingProductsPrompt(false)
                }}>
                  Append to form
                </button>
              )}
            </div>
          </div>
        </div>
          )
        })()
      )}

      <AddActionConsumableModal
        isOpen={showAddActionModal}
        onClose={() => setShowAddActionModal(false)}
        departments={[]}
        currentDepartmentId={departmentId}
        viewMode={departmentId ? 'service' : 'all'}
        onAdd={(type: any, item: any, quantity: number, departmentIdParam: string) => {
          handleAddAction(type, item, quantity, departmentIdParam || departmentId || '')
          setShowAddActionModal(false)
        }}
        existingProductReferenceIds={existingProductReferenceIds}
      />
    </div>
  )
}
