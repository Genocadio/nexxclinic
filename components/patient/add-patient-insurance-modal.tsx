'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PatientInsurance } from '@/lib/api-types'
import { getBasePatientSharePercentage } from '@/lib/api-types'
import { useInsurances } from '@/hooks/auth-hooks'
import { useInsuranceCoverages } from '@/hooks/insurances/coverage-rules'
import { useSavePatientInsurance } from '@/hooks/patients/use-save-patient-insurance'
import { CHECK_PATIENT_INSURANCE_CARD_NUMBER_QUERY } from '@/hooks/queries/patients'
import { isDominantMemberRequired, calculateAge, sanitizePhoneInput } from '@/lib/validation-utils'
import { splitWorkerName } from '@/lib/patient-display-utils'
import {
  formatPatientShareDefaultInfo,
  getPatientShareDefaultInfo,
} from '@/lib/insurance-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldError } from '@/components/ui/field-error'
import {
  createPatientInsuranceFormSchema,
  type PatientInsuranceFormValues,
} from '@/lib/form-schemas'
import { useDebouncedValidation } from '@/hooks/use-debounced-validation'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'
import {
  UnsavedChangesDialog,
  useUnsavedChangesGuard,
} from '@/components/patient/use-unsaved-changes-guard'

type AddPatientInsuranceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  patientDateOfBirth: string
  patientInsurances?: PatientInsurance[]
  editingInsurance?: PatientInsurance | null
  onSuccess?: () => void | Promise<void>
  /** Billing copy explains visit linking; reception copy is shorter */
  context?: 'billing' | 'reception'
  disabled?: boolean
}

type CardNumberCheckState = {
  value: string
  status: 'idle' | 'waiting' | 'checking' | 'available' | 'duplicate' | 'error'
  message?: string
}

const normalizeCardNumber = (cardNumber: string) =>
  cardNumber.trim().toUpperCase()

export function AddPatientInsuranceModal({
  open,
  onOpenChange,
  patientId,
  patientDateOfBirth,
  patientInsurances = [],
  editingInsurance,
  onSuccess,
  context = 'billing',
  disabled = false,
}: AddPatientInsuranceModalProps) {
  const apolloClient = useApolloClient()
  const { insurances: availableInsurances, loading: insurancesLoading } = useInsurances()
  const { savePatientInsurance, loading } = useSavePatientInsurance()

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedInsuranceId, setSelectedInsuranceId] = useState('')
  const [selectedInsuranceName, setSelectedInsuranceName] = useState('')
  const [providerSelectionDirty, setProviderSelectionDirty] = useState(false)
  const [cardNumberCheck, setCardNumberCheck] = useState<CardNumberCheckState>({
    value: '',
    status: 'idle',
  })
  const [cardNumberCheckRetry, setCardNumberCheckRetry] = useState(0)

  const selectableInsurances = useMemo(
    () => availableInsurances || [],
    [availableInsurances],
  )

  const selectedProvider = useMemo(
    () => selectableInsurances.find((ins) => String(ins.id) === selectedInsuranceId),
    [selectableInsurances, selectedInsuranceId],
  )

  const { rules: selectedProviderRules } = useInsuranceCoverages(
    selectedInsuranceId ? { insuranceProviderId: selectedInsuranceId } : undefined,
  )

  /** Coverage tiers available for this provider from backend coverage rules / provider entity. */
  const coverages = useMemo(() => {
    if (selectedProviderRules && selectedProviderRules.length > 0) {
      return selectedProviderRules.filter((r) => r.patientSharePercentage != null)
    }
    return (selectedProvider?.coverages || []).filter((r) => r.patientSharePercentage != null)
  }, [selectedProviderRules, selectedProvider])

  const getCoverageLabel = (cov: { departmentName?: string | null; encounterType?: string | null; patientSharePercentage?: number | null }) => {
    if (cov.departmentName) return `${cov.departmentName} (${cov.patientSharePercentage}%)`
    if (cov.encounterType) {
      const typeName = cov.encounterType.replace(/_/g, ' ').toLowerCase()
      const formatted = typeName.charAt(0).toUpperCase() + typeName.slice(1)
      return `${formatted} (${cov.patientSharePercentage}%)`
    }
    return `${cov.patientSharePercentage}%`
  }

  const isAdult = calculateAge(patientDateOfBirth) >= 18
  const dominantRequired = isDominantMemberRequired(patientDateOfBirth, true)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    control,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors: formErrors, isDirty },
  } = useForm<PatientInsuranceFormValues>({
    resolver: zodResolver(createPatientInsuranceFormSchema({ dominantRequired })),
    // Dominant-member rules are conditional (superRefine), so live validation
    // is debounced rather than re-run on every keystroke.
    mode: 'onSubmit',
    defaultValues: {
      insuranceCardNumber: '',
      providingCompanyOrEmployer: '',
      isSelf: isAdult,
      dominantName: '',
      dominantFirstName: '',
      dominantLastName: '',
      dominantPhone: '',
      patientSharePercentage: '',
      patientShareCoverageId: null,
    },
  })

  const closeInsuranceDialog = useCallback(
    () => onOpenChange(false),
    [onOpenChange],
  )
  const {
    setHasUnsavedChanges,
    setIsBusy,
    confirmOpen,
    requestClose,
    handleConfirmDiscard,
    handleConfirmOpenChange,
  } = useUnsavedChangesGuard(closeInsuranceDialog)

  useEffect(() => {
    setHasUnsavedChanges(isDirty || providerSelectionDirty)
  }, [isDirty, providerSelectionDirty, setHasUnsavedChanges])

  useEffect(() => {
    setIsBusy(loading)
  }, [loading, setIsBusy])

  const watchIsSelf = watch('isSelf') ?? isAdult
  const cardNumberValue = watch('insuranceCardNumber') ?? ''
  const normalizedCardNumber = normalizeCardNumber(cardNumberValue)
  const originalCardNumber = normalizeCardNumber(editingInsurance?.insuranceCardNumber || '')
  const editingInsuranceId = editingInsurance ? String(editingInsurance.id) : ''
  const cardNumberCheckRequired =
    Boolean(editingInsuranceId) &&
    normalizedCardNumber !== originalCardNumber
  const currentCardNumberCheckStatus =
    cardNumberCheck.value === normalizedCardNumber
      ? cardNumberCheck.status
      : cardNumberCheckRequired
        ? 'waiting'
        : 'idle'
  const cardNumberCheckPassed =
    !cardNumberCheckRequired ||
    (cardNumberCheck.value === normalizedCardNumber &&
      cardNumberCheck.status === 'available')
  const patientShareDefault = getPatientShareDefaultInfo({
    patientSharePercentage: watch('patientSharePercentage'),
    patientShareCoverageId: watch('patientShareCoverageId'),
    insuranceProvider: { coverages },
  })

  useEffect(() => {
    if (
      !open ||
      !editingInsuranceId ||
      !normalizedCardNumber ||
      normalizedCardNumber === originalCardNumber
    ) {
      setCardNumberCheck({ value: normalizedCardNumber, status: 'idle' })
      return
    }

    let cancelled = false
    setCardNumberCheck({ value: normalizedCardNumber, status: 'waiting' })
    const timeoutId = setTimeout(() => {
      setCardNumberCheck({ value: normalizedCardNumber, status: 'checking' })
      void apolloClient
        .query<{
          patientInsuranceCardNumberAvailable: {
            status: string
            message?: string | null
            data?: boolean | null
          } | null
        }>({
          query: CHECK_PATIENT_INSURANCE_CARD_NUMBER_QUERY,
          variables: {
            patientId,
            patientInsuranceId: editingInsuranceId,
            insuranceCardNumber: normalizedCardNumber,
          },
          fetchPolicy: 'no-cache',
        })
        .then(({ data }) => {
          if (cancelled) return
          const response = data.patientInsuranceCardNumberAvailable
          if (response?.status !== 'SUCCESS' || typeof response.data !== 'boolean') {
            setCardNumberCheck({
              value: normalizedCardNumber,
              status: 'error',
              message: response?.message || 'Could not verify this card number.',
            })
            return
          }
          setCardNumberCheck({
            value: normalizedCardNumber,
            status: response.data ? 'available' : 'duplicate',
            message: response.message || undefined,
          })
        })
        .catch((error: unknown) => {
          if (cancelled) return
          console.error('Insurance card number check failed:', error)
          setCardNumberCheck({
            value: normalizedCardNumber,
            status: 'error',
            message: 'Could not verify this card number. Try again.',
          })
        })
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [
    apolloClient,
    cardNumberCheckRetry,
    editingInsuranceId,
    normalizedCardNumber,
    open,
    originalCardNumber,
    patientId,
  ])

  useDebouncedValidation({ control, trigger })

  const alreadyAddedInsuranceIds = useMemo(
    () =>
      new Set(
        patientInsurances
          .filter((pIns) => !editingInsurance || String(pIns.id) !== String(editingInsurance.id))
          .map((pIns) => String(pIns.insuranceProvider.id)),
      ),
    [patientInsurances, editingInsurance],
  )

  const resetForm = () => {
    setSelectedInsuranceId('')
    setSelectedInsuranceName('')
    setProviderSelectionDirty(false)
    reset()
  }

  useEffect(() => {
    if (!open) {
      resetForm()
      return
    }
    if (editingInsurance) {
      const provId = String(editingInsurance.insuranceProvider.id)
      setSelectedInsuranceId(provId)
      setSelectedInsuranceName(
        editingInsurance.insuranceProvider.insuranceName ||
          editingInsurance.insuranceProvider.acronym ||
          'Insurance',
      )
      setProviderSelectionDirty(false)
      reset({
        insuranceCardNumber: editingInsurance.insuranceCardNumber || '',
        providingCompanyOrEmployer:
          editingInsurance.providingCompanyOrEmployer || '',
        isSelf: editingInsurance.principalMember ?? isAdult,
        dominantName: editingInsurance.principalMemberName || '',
        dominantFirstName: '',
        dominantLastName: '',
        dominantPhone: editingInsurance.principalMemberPhoneNumber || '',
        patientSharePercentage:
          editingInsurance.patientSharePercentage != null
            ? String(editingInsurance.patientSharePercentage)
            : '',
        patientShareCoverageId:
          editingInsurance.patientShareCoverageId || null,
      })
    } else {
      resetForm()
    }
  }, [open, editingInsurance, isAdult, reset])

  const handleProviderSelect = (id: string, name: string) => {
    setSelectedInsuranceId(id)
    setSelectedInsuranceName(name)
    setProviderSelectionDirty(true)
    const prov = selectableInsurances.find((ins) => String(ins.id) === id)
    const covs = (prov?.coverages || []).filter((r) => r.patientSharePercentage != null)
    if (covs.length === 1 && covs[0]) {
      setValue('patientShareCoverageId', covs[0].id, { shouldValidate: true, shouldDirty: true })
      setValue('patientSharePercentage', String(covs[0].patientSharePercentage), { shouldValidate: true, shouldDirty: true })
    } else if (covs.length > 1) {
      const base = covs.find((c) => !c.departmentId && !c.encounterType) || covs[0]
      if (base) {
        setValue('patientShareCoverageId', base.id, { shouldValidate: true, shouldDirty: true })
        setValue('patientSharePercentage', String(base.patientSharePercentage), { shouldValidate: true, shouldDirty: true })
      }
    } else {
      setValue('patientShareCoverageId', null, { shouldDirty: true })
      setValue('patientSharePercentage', '', { shouldDirty: true })
    }
    setPopoverOpen(false)
  }

  useEffect(() => {
    const patientSharePercentage = getValues('patientSharePercentage')
    if (
      !selectedInsuranceId ||
      getValues('patientShareCoverageId') ||
      (patientSharePercentage !== '' && patientSharePercentage != null)
    ) {
      return
    }
    if (coverages.length === 1 && coverages[0]) {
      setValue('patientShareCoverageId', coverages[0].id, { shouldValidate: true })
      setValue('patientSharePercentage', String(coverages[0].patientSharePercentage), { shouldValidate: true })
    } else if (coverages.length > 1) {
      const base = coverages.find((c) => !c.departmentId && !c.encounterType) || coverages[0]
      if (base) {
        setValue('patientShareCoverageId', base.id, { shouldValidate: true })
        setValue('patientSharePercentage', String(base.patientSharePercentage), { shouldValidate: true })
      }
    }
  }, [coverages, selectedInsuranceId, getValues, setValue])

  const handleSave = async (values: PatientInsuranceFormValues) => {
    const submittedCardNumber = normalizeCardNumber(values.insuranceCardNumber)
    const requiresCardNumberCheck =
      Boolean(editingInsuranceId) &&
      submittedCardNumber !== originalCardNumber
    if (
      requiresCardNumberCheck &&
      !(
        cardNumberCheck.value === submittedCardNumber &&
        cardNumberCheck.status === 'available'
      )
    ) {
      return
    }

    const rawDominantName = values.dominantName || [values.dominantFirstName, values.dominantLastName].filter(Boolean).join(' ')
    const resolvedDominant = rawDominantName ? splitWorkerName(rawDominantName) : { firstName: '', lastName: '' }
    const result = await savePatientInsurance({
      patientId,
      patientDateOfBirth,
      insuranceProviderId: selectedInsuranceId,
      insuranceCardNumber: values.insuranceCardNumber,
      providingCompanyOrEmployer: values.providingCompanyOrEmployer,
      isSelf: isAdult ? Boolean(values.isSelf) : false,
      dominantName: rawDominantName || undefined,
      dominantFirstName: resolvedDominant.firstName,
      dominantLastName: resolvedDominant.lastName,
      dominantPhone: values.dominantPhone,
      existingPatientInsurances: patientInsurances,
      patientSharePercentage:
        values.patientSharePercentage !== "" &&
        values.patientSharePercentage != null
          ? Number(values.patientSharePercentage)
          : null,
      patientShareCoverageId: values.patientShareCoverageId || null,
      existingPatientInsuranceId: editingInsurance
        ? String(editingInsurance.id)
        : undefined,
    })

    if (result.status === 'VALIDATION_ERROR') {
      const fe = result.fieldErrors
      if (fe.card) setError('insuranceCardNumber', { type: 'server', message: fe.card })
      if (fe.employer) setError('providingCompanyOrEmployer', { type: 'server', message: fe.employer })
      if (fe.dominant) {
        setError('dominantName', { type: 'server', message: fe.dominant })
        setError('dominantPhone', { type: 'server', message: fe.dominant })
      }
      return
    }

    if (result.status === 'SUCCESS') {
      setHasUnsavedChanges(false)
      onOpenChange(false)
      resetForm()
      toast.success(
        editingInsurance
          ? 'Insurance updated on patient record.'
          : context === 'billing'
            ? 'Insurance saved on patient record. Check it under Patient insurances to use on this visit.'
            : 'Insurance saved on patient record.',
      )
      try {
        await onSuccess?.()
      } catch (error) {
        console.error('Insurance saved, but refreshing the patient visit failed:', error)
        toast.error(
          'Insurance was saved, but the billing panel could not refresh. Please refresh the page to see the latest details.',
        )
      }
      return
    }

    const errorMsg = result.response?.messages?.[0]?.text || 'Failed to add insurance'
    toast.error(errorMsg)
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpenChange(true)
          } else {
            requestClose()
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg"
        >
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-base">
              {editingInsurance ? 'Edit patient insurance' : 'Add patient insurance'}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleSubmit(handleSave)}
          >
            {!editingInsurance ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">
                  Insurance provider
                </label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="h-10 w-full justify-between rounded-xl text-sm font-normal"
                      disabled={insurancesLoading}
                    >
                      {selectedInsuranceName ||
                        (insurancesLoading
                          ? 'Loading insurances...'
                          : 'Search insurance providers')}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Search insurance..." />
                      <CommandList>
                        <CommandEmpty>No insurance found.</CommandEmpty>
                        <CommandGroup>
                          {selectableInsurances.map((insurance) => {
                            const isAlreadyAdded = alreadyAddedInsuranceIds.has(String(insurance.id))
                            return (
                              <CommandItem
                                key={insurance.id}
                                value={`${insurance.insuranceName} ${insurance.acronym || ''}`}
                                disabled={isAlreadyAdded}
                                onSelect={() => {
                                  if (!isAlreadyAdded) {
                                    handleProviderSelect(
                                      String(insurance.id),
                                      `${insurance.insuranceName}${insurance.acronym ? ` (${insurance.acronym})` : ''}`,
                                    )
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    selectedInsuranceId === String(insurance.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <span className={isAlreadyAdded ? 'opacity-50' : ''}>
                                  {insurance.insuranceName}
                                  {insurance.acronym && ` (${insurance.acronym})`}
                                  {' — '}{getBasePatientSharePercentage(insurance)}%
                                  {isAlreadyAdded && ' (Already Added)'}
                                </span>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="rounded-xl border border-border/70 bg-muted/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">Insurance provider</span>
                <p className="text-sm font-medium text-foreground">{selectedInsuranceName}</p>
              </div>
            )}

            {selectedInsuranceId && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">
                      Insurance card number
                    </label>
                    <Input
                      {...register('insuranceCardNumber')}
                      placeholder="Card number"
                      className={formErrors.insuranceCardNumber ? 'border-red-500 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={formErrors.insuranceCardNumber?.message} />
                    {editingInsurance && normalizedCardNumber && cardNumberCheckRequired && (
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <p
                          role={
                            currentCardNumberCheckStatus === 'duplicate' ||
                            currentCardNumberCheckStatus === 'error'
                              ? 'alert'
                              : 'status'
                          }
                          className={
                            currentCardNumberCheckStatus === 'available'
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : currentCardNumberCheckStatus === 'duplicate' ||
                                  currentCardNumberCheckStatus === 'error'
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                          }
                        >
                          {currentCardNumberCheckStatus === 'waiting'
                            ? 'Waiting to check card number...'
                            : currentCardNumberCheckStatus === 'checking'
                              ? 'Checking card number...'
                              : currentCardNumberCheckStatus === 'available'
                                ? 'Card number is available.'
                                : currentCardNumberCheckStatus === 'duplicate'
                                  ? cardNumberCheck.message ||
                                    'This patient already has an insurance with this card number.'
                                  : currentCardNumberCheckStatus === 'error'
                                    ? cardNumberCheck.message ||
                                      'Could not verify this card number.'
                                    : null}
                        </p>
                        {currentCardNumberCheckStatus === 'error' && (
                          <button
                            type="button"
                            className="shrink-0 font-medium text-primary underline-offset-2 hover:underline"
                            onClick={() => setCardNumberCheckRetry((retry) => retry + 1)}
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">
                      Employer / scheme
                    </label>
                    <Input
                      {...register('providingCompanyOrEmployer')}
                      placeholder="Employer or company name"
                      className={formErrors.providingCompanyOrEmployer ? 'border-red-500 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={formErrors.providingCompanyOrEmployer?.message} />
                  </div>
                </div>

                {coverages.length > 1 ? (
                  <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs font-medium text-foreground">
                      Patient share default
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Patient share is the portion paid by the patient. Choose
                      a default tier, or use service billing rules.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {coverages.map((cov) => {
                        const currentCoverageId = watch('patientShareCoverageId')
                        const isSelected = currentCoverageId === cov.id
                        return (
                          <button
                            key={cov.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setValue('patientShareCoverageId', null, { shouldValidate: true, shouldDirty: true })
                                setValue('patientSharePercentage', '', { shouldValidate: true, shouldDirty: true })
                              } else {
                                setValue('patientShareCoverageId', cov.id, { shouldValidate: true, shouldDirty: true })
                                setValue('patientSharePercentage', String(cov.patientSharePercentage), { shouldValidate: true, shouldDirty: true })
                              }
                            }}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border/60 bg-background text-foreground hover:border-primary/50'
                            }`}
                          >
                            {getCoverageLabel(cov)}
                          </button>
                        )
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setValue('patientShareCoverageId', null, { shouldValidate: true, shouldDirty: true })
                          setValue('patientSharePercentage', '', { shouldValidate: true, shouldDirty: true })
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          !watch('patientShareCoverageId')
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border/60 bg-background text-foreground hover:border-primary/50'
                        }`}
                      >
                        Use service rules
                      </button>
                    </div>
                    <input type="hidden" {...register('patientShareCoverageId')} />
                    <input type="hidden" {...register('patientSharePercentage')} />
                  </div>
                ) : coverages.length === 1 && coverages[0] ? (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Patient share default:</span>
                    <span className="font-semibold text-foreground">
                      {patientShareDefault.percentage != null
                        ? `${patientShareDefault.percentage}%`
                        : formatPatientShareDefaultInfo(patientShareDefault)}
                    </span>
                    <input type="hidden" {...register('patientShareCoverageId')} />
                    <input type="hidden" {...register('patientSharePercentage')} />
                  </div>
                ) : (
                  <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <label className="block text-xs font-medium text-foreground">
                      Patient share default (%)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      {...register('patientSharePercentage')}
                      placeholder="Leave blank to use billing rules"
                    />
                    <FieldError message={formErrors.patientSharePercentage?.message} />
                    <p className="text-[11px] text-muted-foreground">
                      This is the patient&apos;s share of covered costs. Leave
                      blank to use service billing rules.
                    </p>
                  </div>
                )}

                {isAdult ? (
                  <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <Checkbox
                        id="isSelf"
                        checked={Boolean(watchIsSelf)}
                        onCheckedChange={(checked) => {
                          setValue('isSelf', Boolean(checked), { shouldValidate: true, shouldDirty: true })
                          if (checked) {
                            setValue('dominantName', '')
                            setValue('dominantFirstName', '')
                            setValue('dominantLastName', '')
                            setValue('dominantPhone', '')
                            clearErrors(['dominantName', 'dominantFirstName', 'dominantLastName', 'dominantPhone'])
                          }
                        }}
                      />
                      Patient is the principal policyholder
                    </label>
                    {!watchIsSelf && (
                      <div className="grid gap-3 border-t border-border/40 pt-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-foreground">
                            Principal member name <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <Input
                            {...register('dominantName', {
                              onChange: (event) => {
                                const split = splitWorkerName(event.target.value)
                                setValue('dominantFirstName', split.firstName)
                                setValue('dominantLastName', split.lastName || '')
                              },
                            })}
                            placeholder="Full name"
                            className={formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                          />
                          <FieldError message={formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message} />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-foreground">
                            Principal member phone <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <Input
                            {...register('dominantPhone', {
                              onChange: (event) => {
                                setValue('dominantPhone', sanitizePhoneInput(event.target.value), { shouldValidate: true })
                              },
                            })}
                            placeholder="Phone number"
                            className={formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''}
                          />
                          <FieldError message={formErrors.dominantPhone?.message} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-xs font-medium text-foreground">
                      Principal member information <span className="text-destructive">*</span>
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-foreground">
                          Principal member full name <span className="text-destructive">*</span>
                        </label>
                        <Input
                          {...register('dominantName', {
                            onChange: (event) => {
                              const split = splitWorkerName(event.target.value)
                              setValue('dominantFirstName', split.firstName)
                              setValue('dominantLastName', split.lastName || '')
                            },
                          })}
                          placeholder="Full name"
                          className={formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        />
                        <FieldError message={formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-foreground">
                          Principal member phone <span className="text-destructive">*</span>
                        </label>
                        <Input
                          {...register('dominantPhone', {
                            onChange: (event) => {
                              setValue('dominantPhone', sanitizePhoneInput(event.target.value), { shouldValidate: true })
                            },
                          })}
                          placeholder="Phone number"
                          className={formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        />
                        <FieldError message={formErrors.dominantPhone?.message} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <DialogFooter className="flex-row justify-center gap-2 sm:justify-center">
              <Button
                type="button"
                variant="outline"
                className="min-w-28 rounded-full"
                onClick={() => requestClose()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-32 rounded-full"
                disabled={
                  !selectedInsuranceId ||
                  loading ||
                  disabled ||
                  !cardNumberCheckPassed ||
                  (Boolean(editingInsurance) && !isDirty && !providerSelectionDirty)
                }
              >
                {editingInsurance ? 'Update insurance' : 'Save insurance'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <UnsavedChangesDialog
        open={confirmOpen}
        onOpenChange={handleConfirmOpenChange}
        onDiscard={handleConfirmDiscard}
        title="Discard insurance changes?"
        description="Your insurance details have not been saved. Discard these changes and close?"
      />
    </>
  )
}
