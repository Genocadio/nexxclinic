// Placeholder definitions for the form builder
// Placeholders are tokens embedded in heading/paragraph text as {{key}}
// At fill-time they are replaced by real patient/visit values.

export interface PlaceholderDef {
  key: string
  label: string
  example: string
}

export interface PlaceholderCategory {
  name: string
  color: string   // Tailwind bg-* for the chip
  textColor: string
  items: PlaceholderDef[]
}

export const PLACEHOLDER_CATEGORIES: PlaceholderCategory[] = [
  {
    name: 'Patient',
    color: 'bg-violet-100 dark:bg-violet-900/40',
    textColor: 'text-violet-700 dark:text-violet-300',
    items: [
      { key: 'patient_name',        label: 'Patient Name',        example: 'Jane Doe' },
      { key: 'patient_dob',         label: 'Date of Birth',       example: '01 Jan 1990' },
      { key: 'patient_id',          label: 'Patient ID',          example: 'P-00123' },
      { key: 'patient_gender',      label: 'Gender',              example: 'Female' },
      { key: 'patient_age',         label: 'Age',                 example: '34 years' },
      { key: 'patient_phone',       label: 'Phone Number',        example: '+250 700 000 000' },
      { key: 'patient_address',     label: 'Address',             example: 'Kigali, Rwanda' },
      { key: 'patient_insurance',   label: 'Insurance Provider',  example: 'RSSB' },
      { key: 'patient_insurance_no',label: 'Insurance Number',    example: 'INS-001234' },
    ],
  },
  {
    name: 'Clinical',
    color: 'bg-emerald-100 dark:bg-emerald-900/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    items: [
      { key: 'diagnosis',           label: 'Diagnosis',           example: 'Hypertension' },
      { key: 'icd_code',            label: 'ICD Code',            example: 'I10' },
      { key: 'chief_complaint',     label: 'Chief Complaint',     example: 'Chest pain' },
      { key: 'procedure',           label: 'Procedure',           example: 'Appendectomy' },
      { key: 'medications',         label: 'Medications',         example: 'Metformin 500mg' },
      { key: 'allergies',           label: 'Known Allergies',     example: 'Penicillin' },
      { key: 'blood_type',          label: 'Blood Type',          example: 'O+' },
      { key: 'vital_signs',         label: 'Vital Signs',         example: 'BP 120/80' },
      { key: 'exam_findings',       label: 'Exam Findings',       example: 'NAD, afebrile' },
      { key: 'management_plan',     label: 'Management Plan',     example: 'Continue treatment' },
    ],
  },
  {
    name: 'Staff',
    color: 'bg-blue-100 dark:bg-blue-900/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    items: [
      { key: 'clinician_name',      label: 'Clinician Name',      example: 'Dr. John Smith' },
      { key: 'clinician_title',     label: 'Clinician Title',     example: 'General Practitioner' },
      { key: 'clinician_license',   label: 'License Number',      example: 'LIC-00456' },
      { key: 'department',          label: 'Department',          example: 'Internal Medicine' },
      { key: 'clinic_name',         label: 'Clinic / Hospital',   example: 'NexxClinic' },
      { key: 'clinic_address',      label: 'Clinic Address',      example: 'Kigali, Rwanda' },
    ],
  },
  {
    name: 'Document',
    color: 'bg-amber-100 dark:bg-amber-900/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    items: [
      { key: 'date',                label: 'Date',                example: new Date().toLocaleDateString() },
      { key: 'time',                label: 'Time',                example: new Date().toLocaleTimeString() },
      { key: 'visit_date',          label: 'Visit Date',          example: new Date().toLocaleDateString() },
      { key: 'reference_number',    label: 'Reference Number',    example: 'REF-2024-001' },
      { key: 'form_title',          label: 'Form Title',          example: 'Consultation Note' },
    ],
  },
]

export function getAllPlaceholders(): PlaceholderDef[] {
  return PLACEHOLDER_CATEGORIES.flatMap((c) => c.items)
}

export function findPlaceholder(key: string): PlaceholderDef | undefined {
  return getAllPlaceholders().find((p) => p.key === key)
}

export function getCategoryForKey(key: string): PlaceholderCategory | undefined {
  return PLACEHOLDER_CATEGORIES.find((cat) => cat.items.some((p) => p.key === key))
}

/** Split a text string into text and placeholder segments for rendering */
export function parsePlaceholderTokens(
  text: string,
): Array<{ type: 'text' | 'placeholder'; content: string }> {
  const parts = text.split(/(\{\{[a-z_]+\}\})/g)
  return parts
    .filter((p) => p.length > 0)
    .map((part) => {
      const m = part.match(/^\{\{([a-z_]+)\}\}$/)
      if (m) return { type: 'placeholder' as const, content: m[1] }
      return { type: 'text' as const, content: part }
    })
}
