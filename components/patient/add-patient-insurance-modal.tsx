'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { PatientInsurance } from '@/lib/api-types'
import { useInsurances } from '@/hooks/auth-hooks'
import { useInsuranceCoverageRules } from '@/hooks/insurances/coverage-rules'
import { useSavePatientInsurance } from '@/hooks/patients/use-save-patient-insurance'
import { isDominantMemberRequired } from '@/lib/validation-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  onSuccess,
  context = 'billing',
  disabled = false,
}: AddPatientInsuranceModalProps) {
  const { insurances: availableInsurances, loading: insurancesLoading } = useInsurances()
  const { savePatientInsurance, loading } = useSavePatientInsurance()

  const [step, setStep] = useState<'select' | 'details'>('select')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedInsuranceId, setSelectedInsuranceId] = useState('')
  const [selectedInsuranceName, setSelectedInsuranceName] = useState('')

  const { rules: selectedProviderRules, loading: rulesLoading } = useInsuranceCoverageRules(
    selectedInsuranceId ? { insuranceProviderId: selectedInsuranceId } : undefined,
  )

  /** Distinct patient share percentages available from this provider's coverage rules. */
  const availablePercentages = useMemo(() => {
    const pcts = selectedProviderRules
      .map((r) => r.patientSharePercentage)
      .filter((v): v is number => v != null)
    return [...new Set(pcts)].sort((a, b) => a - b)
  }, [selectedProviderRules])

  const dominantRequired = isDominantMemberRequired(patientDateOfBirth, true)

  const {
    register,
    handleSubmit,
    setError,
    reset: resetFormErrors,
    control,
    trigger,
    setValue,
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
      dominantFirstName: '',
      dominantLastName: '',
      dominantPhone: '',
      patientSharePercentage: '',
    },
  })

  useDebouncedValidation({ control, trigger })

  const selectableInsurances = useMemo(
    () => availableInsurances || [],
    [availableInsurances],
  )

  const alreadyAddedInsuranceIds = useMemo(
    () => new Set(patientInsurances.map((pIns) => String(pIns.insuranceProvider.id))),
    [patientInsurances],
  )

  const resetForm = () => {
    setStep('select')
    setSelectedInsuranceId('')
    setSelectedInsuranceName('')
    resetFormErrors()
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const handleProviderSelect = (id: string, name: string) => {
    setSelectedInsuranceId(id)
    setSelectedInsuranceName(name)
    setPopoverOpen(false)
    setStep('details')
  }

  const handleSave = async (values: PatientInsuranceFormValues) => {
    const result = await savePatientInsurance({
      patientId,
      patientDateOfBirth,
      insuranceProviderId: selectedInsuranceId,
      insuranceCardNumber: values.insuranceCardNumber,
      providingCompanyOrEmployer: values.providingCompanyOrEmployer,
      dominantFirstName: values.dominantFirstName,
      dominantLastName: values.dominantLastName,
      dominantPhone: values.dominantPhone,
      existingPatientInsurances: patientInsurances,
      patientSharePercentage: values.patientSharePercentage ? Number(values.patientSharePercentage) : null,
    })

    if (result.status === 'VALIDATION_ERROR') {
      const fe = result.fieldErrors
      if (fe.card) setError('insuranceCardNumber', { type: 'server', message: fe.card })
      if (fe.employer) setError('providingCompanyOrEmployer', { type: 'server', message: fe.employer })
      if (fe.dominant) {
        setError('dominantFirstName', { type: 'server', message: fe.dominant })
        setError('dominantLastName', { type: 'server', message: fe.dominant })
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

  const selectedProvider = useMemo(
    () => selectableInsurances.find((ins) => String(ins.id) === selectedInsuranceId),
    [selectableInsurances, selectedInsuranceId],
  )

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
            {step === 'details' && (
              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <DialogTitle className="text-base">
              {step === 'select' ? 'Select insurance provider' : 'Insurance details'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {DESCRIPTIONS[context]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {step === 'select' ? (
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Insurance Provider</p>
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
                                {' — '}{insurance.defaultPatientSharePercentage}%
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
            <>
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground text-xs">Provider</span>
                <p className="font-medium">{selectedInsuranceName}</p>
                {selectedProvider && (
                  <p className="text-xs text-muted-foreground">
                    Default patient share: {selectedProvider.defaultPatientSharePercentage}%
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Insurance Card Number (required)</p>
                <Input
                  {...register('insuranceCardNumber')}
                  placeholder="Card number"
                  className={formErrors.insuranceCardNumber ? 'border-red-500 focus-visible:ring-red-300' : ''}
                />
                <FieldError message={formErrors.insuranceCardNumber?.message} />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Providing Company / Employer (required)</p>
                <Input
                  {...register('providingCompanyOrEmployer')}
                  placeholder="Employer or company name"
                  className={formErrors.providingCompanyOrEmployer ? 'border-red-500 focus-visible:ring-red-300' : ''}
                />
                <FieldError message={formErrors.providingCompanyOrEmployer?.message} />
              </div>

              {availablePercentages.length > 1 ? (
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    Patient Share % (optional)
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    This provider has multiple coverage tiers. Pick the default for this patient, or leave empty to use rules/provider default.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {availablePercentages.map((pct) => {
                      const currentVal = getValues('patientSharePercentage')
                      const isSelected = String(currentVal) === String(pct)
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            setValue('patientSharePercentage', isSelected ? '' : String(pct), { shouldValidate: true })
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white border-transparent'
                              : 'bg-white dark:bg-slate-950 border-border/40 hover:border-[#5F77E8]/40'
                          }`}
                        >
                          {pct}%
                        </button>
                      )
                    })}
                  </div>
                  <input type="hidden" {...register('patientSharePercentage')} />
                </div>
              ) : availablePercentages.length === 1 ? (
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    Patient Share % (optional)
                  </p>
                  <Input
                    {...register('patientSharePercentage')}
                    type="number"
                    min="0"
                    max="100"
                    placeholder={`Default: ${availablePercentages[0]}%`}
                    className={formErrors.patientSharePercentage ? 'border-red-500 focus-visible:ring-red-300' : ''}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    This provider has one coverage tier ({availablePercentages[0]}%). You can override it for this patient, or leave empty.
                  </p>
                  <FieldError message={formErrors.patientSharePercentage?.message} />
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    Patient Share % (optional)
                  </p>
                  <Input
                    {...register('patientSharePercentage')}
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Default patient share % (0-100)"
                    className={formErrors.patientSharePercentage ? 'border-red-500 focus-visible:ring-red-300' : ''}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Override the provider default for this patient. Leave empty to use rules/provider default.
                  </p>
                  <FieldError message={formErrors.patientSharePercentage?.message} />
                </div>
              )}

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Dominant Member {dominantRequired ? '(required for patients 18 years or younger)' : '(optional)'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    {...register('dominantFirstName')}
                    placeholder="First name"
                    className={formErrors.dominantFirstName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                  />
                  <Input
                    {...register('dominantLastName')}
                    placeholder="Last name"
                    className={formErrors.dominantLastName ? 'border-red-500 focus-visible:ring-red-300' : ''}
                  />
                </div>
                <Input
                  {...register('dominantPhone')}
                  placeholder="Phone"
                  className={formErrors.dominantPhone ? 'border-red-500 focus-visible:ring-red-300' : ''}
                />
                <FieldError message={formErrors.dominantFirstName?.message ?? formErrors.dominantLastName?.message ?? formErrors.dominantPhone?.message} />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === 'select' ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          ) : (
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
                Save to patient record
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
