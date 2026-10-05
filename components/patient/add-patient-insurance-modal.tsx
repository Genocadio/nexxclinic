'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PatientInsurance } from '@/lib/api-types'
import { getBasePatientSharePercentage } from '@/lib/api-types'
import { useInsurances } from '@/hooks/auth-hooks'
import { useInsuranceCoverages } from '@/hooks/insurances/coverage-rules'
import { useSavePatientInsurance } from '@/hooks/patients/use-save-patient-insurance'
import { isDominantMemberRequired, calculateAge, sanitizePhoneInput } from '@/lib/validation-utils'
import { splitWorkerName } from '@/lib/patient-display-utils'
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
  DialogDescription,
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
import { Check, ChevronsUpDown, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify'

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

const DESCRIPTIONS = {
  billing: (
    <>
      This saves insurance on the patient&apos;s profile, not directly on the visit. After saving,
      open <span className="font-medium text-foreground">Patient insurances</span> in the billing
      header and check it to use for billing on this visit.
    </>
  ),
  reception: (
    <>
      Saves insurance on the patient profile. You can then select it when creating the visit or
      enable it later from billing.
    </>
  ),
}

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
  const { insurances: availableInsurances, loading: insurancesLoading } = useInsurances()
  const { savePatientInsurance, loading } = useSavePatientInsurance()

  const [step, setStep] = useState<'select' | 'card' | 'details'>('select')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedInsuranceId, setSelectedInsuranceId] = useState('')
  const [selectedInsuranceName, setSelectedInsuranceName] = useState('')

  const selectableInsurances = useMemo(
    () => availableInsurances || [],
    [availableInsurances],
  )

  const selectedProvider = useMemo(
    () => selectableInsurances.find((ins) => String(ins.id) === selectedInsuranceId),
    [selectableInsurances, selectedInsuranceId],
  )

  const { rules: selectedProviderRules, loading: rulesLoading } = useInsuranceCoverages(
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
    return `Base / General (${cov.patientSharePercentage}%)`
  }

  const isAdult = calculateAge(patientDateOfBirth) >= 18
  const dominantRequired = isDominantMemberRequired(patientDateOfBirth, true)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset: resetFormErrors,
    control,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors: formErrors },
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
    },
  })

  const watchIsSelf = watch('isSelf') ?? isAdult

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
    setStep('select')
    setSelectedInsuranceId('')
    setSelectedInsuranceName('')
    resetFormErrors()
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
      setStep('card')
      setValue('insuranceCardNumber', editingInsurance.insuranceCardNumber || '')
      setValue(
        'providingCompanyOrEmployer',
        editingInsurance.providingCompanyOrEmployer || '',
      )
      setValue('isSelf', editingInsurance.principalMember ?? isAdult)
      setValue('dominantName', editingInsurance.principalMemberName || '')
      setValue('dominantPhone', editingInsurance.principalMemberPhoneNumber || '')
      setValue(
        'patientSharePercentage',
        editingInsurance.patientSharePercentage != null
          ? String(editingInsurance.patientSharePercentage)
          : '',
      )
    }
  }, [open, editingInsurance, isAdult, setValue])

  const handleProviderSelect = (id: string, name: string) => {
    setSelectedInsuranceId(id)
    setSelectedInsuranceName(name)
    const prov = selectableInsurances.find((ins) => String(ins.id) === id)
    const covs = (prov?.coverages || []).filter((r) => r.patientSharePercentage != null)
    if (covs.length === 1 && covs[0]) {
      setValue('patientShareCoverageId', covs[0].id, { shouldValidate: true })
      setValue('patientSharePercentage', String(covs[0].patientSharePercentage), { shouldValidate: true })
    } else if (covs.length > 1) {
      const base = covs.find((c) => !c.departmentId && !c.encounterType) || covs[0]
      if (base) {
        setValue('patientShareCoverageId', base.id, { shouldValidate: true })
        setValue('patientSharePercentage', String(base.patientSharePercentage), { shouldValidate: true })
      }
    } else {
      setValue('patientShareCoverageId', null)
      setValue('patientSharePercentage', '')
    }
    setPopoverOpen(false)
    setStep('card')
  }

  useEffect(() => {
    if (!selectedInsuranceId || getValues('patientShareCoverageId')) return
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

  const handleProceedToDetails = () => {
    setStep('details')
  }

  const handleSave = async (values: PatientInsuranceFormValues) => {
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
      patientSharePercentage: values.patientSharePercentage ? Number(values.patientSharePercentage) : null,
      patientShareCoverageId: values.patientShareCoverageId || null,
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
      await onSuccess?.()
      onOpenChange(false)
      resetForm()
      toast.success(
        context === 'billing'
          ? 'Insurance saved on patient record. Check it under Patient insurances to use on this visit.'
          : 'Insurance saved on patient record.',
      )
      return
    }

    const errorMsg = result.response?.messages?.[0]?.text || 'Failed to add insurance'
    toast.error(errorMsg)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(step === 'card' || step === 'details') && (
              <button
                type="button"
                onClick={() => setStep(step === 'details' ? 'card' : 'select')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <DialogTitle className="text-base">
              {editingInsurance
                ? 'Update patient insurance'
                : step === 'select'
                  ? 'Select insurance provider'
                  : step === 'card'
                    ? 'Enter card number'
                    : 'Insurance details'}
            </DialogTitle>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-2">
            {['Provider', 'Card #', 'Details'].map((label, idx) => {
              const stepKey = (['select', 'card', 'details'] as const)[idx]
              const isActive = step === stepKey
              const isDone = (step === 'card' && idx === 0) || (step === 'details' && idx <= 1)
              return (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                    isActive ? 'bg-primary text-primary-foreground' :
                    isDone ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isDone && !isActive ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {idx < 2 && <div className="w-4 h-px bg-border/60 mx-0.5" />}
                </div>
              )
            })}
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {DESCRIPTIONS[context]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Step 1: Select provider */}
          {step === 'select' && (
            <div className="space-y-1">
              <p className="text-[12px] text-muted-foreground">Insurance Provider</p>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between h-10 text-sm font-normal"
                    disabled={insurancesLoading}
                  >
                    {selectedInsuranceName
                      ? selectedInsuranceName
                      : insurancesLoading
                        ? 'Loading insurances...'
                        : 'Search insurance...'}
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
                                    `${insurance.insuranceName} (${insurance.acronym || ''})`,
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
          )}

          {/* Step 2: Enter card number */}
          {step === 'card' && (
            <>
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground text-xs">Provider</span>
                <p className="font-medium">{selectedInsuranceName}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[12px] text-muted-foreground">Insurance Card Number</p>
                <Input
                  {...register('insuranceCardNumber')}
                  placeholder="Card number"
                  autoFocus
                  className={formErrors.insuranceCardNumber ? 'border-red-500 focus-visible:ring-red-300' : ''}
                />
                <FieldError message={formErrors.insuranceCardNumber?.message} />
              </div>
            </>
          )}

          {/* Step 3: Details (employer, dominant member, etc.) */}
          {step === 'details' && (
            <>
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground text-xs">Provider</span>
                <p className="font-medium">{selectedInsuranceName}</p>
                {selectedProvider && (
                  <p className="text-xs text-muted-foreground">
                    Default patient share: {getBasePatientSharePercentage(selectedProvider)}%
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[12px] text-muted-foreground">Insurance Card Number</p>
                <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm font-mono">
                  {getValues('insuranceCardNumber') || ''}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[12px] text-muted-foreground">Providing Company / Employer (required)</p>
                <Input
                  {...register('providingCompanyOrEmployer')}
                  placeholder="Employer or company name"
                  className={formErrors.providingCompanyOrEmployer ? 'border-red-500 focus-visible:ring-red-300' : ''}
                />
                <FieldError message={formErrors.providingCompanyOrEmployer?.message} />
              </div>

              {coverages.length > 1 ? (
                <div className="space-y-1.5 p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-foreground">
                      Default Patient Share / Coverage Tier
                    </p>
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60">
                      {coverages.length} tiers available
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    This insurance has multiple coverage conditions. Select the default tier for this patient:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {coverages.map((cov) => {
                      const currentCoverageId = watch('patientShareCoverageId')
                      const isSelected = currentCoverageId === cov.id
                      return (
                        <button
                          key={cov.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setValue('patientShareCoverageId', null, { shouldValidate: true })
                              setValue('patientSharePercentage', '', { shouldValidate: true })
                            } else {
                              setValue('patientShareCoverageId', cov.id, { shouldValidate: true })
                              setValue('patientSharePercentage', String(cov.patientSharePercentage), { shouldValidate: true })
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white border-transparent shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-border/60 hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {getCoverageLabel(cov)}
                        </button>
                      )
                    })}
                  </div>
                  <input type="hidden" {...register('patientShareCoverageId')} />
                  <input type="hidden" {...register('patientSharePercentage')} />
                </div>
              ) : coverages.length === 1 && coverages[0] ? (
                <div className="p-2.5 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-foreground">Default Coverage: </span>
                    <span className="text-muted-foreground">{getCoverageLabel(coverages[0])}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[12px]">
                    {coverages[0].patientSharePercentage}% Patient Share
                  </span>
                  <input type="hidden" {...register('patientShareCoverageId')} />
                  <input type="hidden" {...register('patientSharePercentage')} />
                </div>
              ) : null}

              {isAdult ? (
                <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isSelf"
                      checked={Boolean(watchIsSelf)}
                      onCheckedChange={(checked) => {
                        setValue('isSelf', Boolean(checked), { shouldValidate: true })
                        if (checked) {
                          setValue('dominantName', '')
                          setValue('dominantFirstName', '')
                          setValue('dominantLastName', '')
                          setValue('dominantPhone', '')
                          clearErrors(['dominantName', 'dominantFirstName', 'dominantLastName', 'dominantPhone'])
                        }
                      }}
                    />
                    <label
                      htmlFor="isSelf"
                      className="text-xs font-medium text-foreground cursor-pointer select-none"
                    >
                      Self (Patient is the principal policyholder)
                    </label>
                  </div>

                  {!watchIsSelf && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <p className="text-[12px] font-medium text-foreground">
                        Principal Member Information <span className="text-red-500">*</span>
                      </p>
                      <div className="space-y-1">
                        <Input
                          {...register('dominantName', {
                            onChange: (e) => {
                              const split = splitWorkerName(e.target.value)
                              setValue('dominantFirstName', split.firstName)
                              setValue('dominantLastName', split.lastName || '')
                            },
                          })}
                          placeholder="Principal member full name (e.g. John Doe)"
                          className={formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        />
                        <FieldError message={formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message} />
                      </div>
                      <div className="space-y-1">
                        <Input
                          {...register('dominantPhone', {
                            onChange: (e) => {
                              setValue('dominantPhone', sanitizePhoneInput(e.target.value), { shouldValidate: true })
                            },
                          })}
                          placeholder="Phone (e.g. 0788 123 456 or +250 788 123 456)"
                          className={formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''}
                        />
                        <FieldError message={formErrors.dominantPhone?.message} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-foreground">
                      Principal Member Information <span className="text-red-500">*</span>
                    </p>
                    <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/60">
                      Required for patients ≤18 years
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register('dominantName', {
                        onChange: (e) => {
                          const split = splitWorkerName(e.target.value)
                          setValue('dominantFirstName', split.firstName)
                          setValue('dominantLastName', split.lastName || '')
                        },
                      })}
                      placeholder="Principal member full name (e.g. John Doe)"
                      className={formErrors.dominantName || formErrors.dominantFirstName || formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={formErrors.dominantName?.message || formErrors.dominantFirstName?.message || formErrors.dominantLastName?.message} />
                  </div>
                  <div className="space-y-1">
                    <Input
                      {...register('dominantPhone', {
                        onChange: (e) => {
                          setValue('dominantPhone', sanitizePhoneInput(e.target.value), { shouldValidate: true })
                        },
                      })}
                      placeholder="Phone (e.g. 0788 123 456 or +250 788 123 456)"
                      className={formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''}
                    />
                    <FieldError message={formErrors.dominantPhone?.message} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === 'select' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          {step === 'card' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleProceedToDetails}>
                Next
              </Button>
            </>
          )}
          {step === 'details' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!selectedInsuranceId) {
                    toast.error("Please select an insurance provider")
                    return
                  }
                  void handleSubmit(handleSave)()
                }}
                disabled={!selectedInsuranceId || loading || disabled}
              >
                {editingInsurance ? 'Update insurance' : 'Save to patient record'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
