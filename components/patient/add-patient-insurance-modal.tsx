'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PatientInsurance } from '@/lib/api-types'
import { useInsurances } from '@/hooks/auth-hooks'
import {
  useSavePatientInsurance,
  type SavePatientInsuranceFieldErrors,
} from '@/hooks/patients/use-save-patient-insurance'
import { isDominantMemberRequired } from '@/lib/validation-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  const [insuranceCardNumber, setInsuranceCardNumber] = useState('')
  const [providingCompanyOrEmployer, setProvidingCompanyOrEmployer] = useState('')
  const [dominantFirstName, setDominantFirstName] = useState('')
  const [dominantLastName, setDominantLastName] = useState('')
  const [dominantPhone, setDominantPhone] = useState('')
  const [formErrors, setFormErrors] = useState<SavePatientInsuranceFieldErrors>({})

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
    setInsuranceCardNumber('')
    setProvidingCompanyOrEmployer('')
    setDominantFirstName('')
    setDominantLastName('')
    setDominantPhone('')
    setFormErrors({})
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

  const handleSave = async () => {
    const errors: SavePatientInsuranceFieldErrors = {}

    if (!selectedInsuranceId) {
      toast.error("Please select an insurance provider")
      return
    }

    if (!insuranceCardNumber.trim()) {
      errors.card = "Insurance card number is required"
    }

    if (!providingCompanyOrEmployer.trim()) {
      errors.employer = "Providing company or employer is required"
    }

    if (dominantRequired) {
      if (!dominantFirstName.trim() || !dominantLastName.trim() || !dominantPhone.trim()) {
        errors.dominant =
          "Dominant member first name, last name, and phone are required for patients 18 years or younger"
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const result = await savePatientInsurance({
      patientId,
      patientDateOfBirth,
      insuranceProviderId: selectedInsuranceId,
      insuranceCardNumber,
      providingCompanyOrEmployer,
      dominantFirstName,
      dominantLastName,
      dominantPhone,
      existingPatientInsurances: patientInsurances,
    })

    if (result.status === 'VALIDATION_ERROR') {
      setFormErrors(result.fieldErrors)
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

  const dominantRequired = isDominantMemberRequired(patientDateOfBirth, true)

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
                                {' — '}{insurance.defaultCoveragePercentage}%
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
                    Default coverage: {selectedProvider.defaultCoveragePercentage}%
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Insurance Card Number (required)</p>
                <Input
                  value={insuranceCardNumber}
                  onChange={(e) => {
                    setInsuranceCardNumber(e.target.value)
                    if (formErrors.card) setFormErrors((prev) => ({ ...prev, card: undefined }))
                  }}
                  placeholder="Card number"
                />
                {formErrors.card && <p className="text-xs text-destructive mt-1">{formErrors.card}</p>}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Providing Company / Employer (required)</p>
                <Input
                  value={providingCompanyOrEmployer}
                  onChange={(e) => {
                    setProvidingCompanyOrEmployer(e.target.value)
                    if (formErrors.employer) setFormErrors((prev) => ({ ...prev, employer: undefined }))
                  }}
                  placeholder="Employer or company name"
                />
                {formErrors.employer && <p className="text-xs text-destructive mt-1">{formErrors.employer}</p>}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Dominant Member {dominantRequired ? '(required for patients 18 years or younger)' : '(optional)'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={dominantFirstName}
                    onChange={(e) => {
                      setDominantFirstName(e.target.value)
                      if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }))
                    }}
                    placeholder="First name"
                  />
                  <Input
                    value={dominantLastName}
                    onChange={(e) => {
                      setDominantLastName(e.target.value)
                      if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }))
                    }}
                    placeholder="Last name"
                  />
                </div>
                <Input
                  value={dominantPhone}
                  onChange={(e) => {
                    setDominantPhone(e.target.value)
                    if (formErrors.dominant) setFormErrors((prev) => ({ ...prev, dominant: undefined }))
                  }}
                  placeholder="Phone"
                />
                {formErrors.dominant && <p className="text-xs text-destructive mt-1">{formErrors.dominant}</p>}
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
                onClick={() => void handleSave()}
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
