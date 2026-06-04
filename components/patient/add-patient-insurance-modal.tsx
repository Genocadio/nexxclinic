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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const { insurances: availableInsurances } = useInsurances()
  const { savePatientInsurance, loading } = useSavePatientInsurance()

  const [selectedInsuranceId, setSelectedInsuranceId] = useState('')
  const [insuranceCardNumber, setInsuranceCardNumber] = useState('')
  const [providingCompanyOrEmployer, setProvidingCompanyOrEmployer] = useState('')
  const [dominantFirstName, setDominantFirstName] = useState('')
  const [dominantLastName, setDominantLastName] = useState('')
  const [dominantPhone, setDominantPhone] = useState('')
  const [formErrors, setFormErrors] = useState<SavePatientInsuranceFieldErrors>({})

  const selectableInsurances = useMemo(
    () => availableInsurances?.filter(
      (ins) => !patientInsurances.some(
        (pIns) => String(pIns.insuranceProvider.id) === String(ins.id),
      ),
    ) || [],
    [availableInsurances, patientInsurances],
  )

  const resetForm = () => {
    setSelectedInsuranceId('')
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

  const handleSave = async () => {
    if (!selectedInsuranceId) return

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
          <DialogTitle className="text-base">Add insurance to patient record</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {DESCRIPTIONS[context]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Insurance</p>
            <Select value={selectedInsuranceId} onValueChange={setSelectedInsuranceId}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select Insurance" />
              </SelectTrigger>
              <SelectContent>
                {selectableInsurances.map((insurance) => (
                  <SelectItem key={insurance.id} value={String(insurance.id)}>
                    {insurance.acronym} - {insurance.insuranceName} ({insurance.defaultCoveragePercentage}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={!selectedInsuranceId || loading || disabled}
          >
            Save to patient record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
