export function sanitizeEmailInput(input: string): string {
  return input
    .replace(/\s+/g, "")
    .replace(/[;,]/g, "")
    .replace(/[^a-zA-Z0-9@._%+-]/g, "")
}

/**
 * Automatically removes commas, spaces, currency indicators (e.g. RWF, $),
 * and non-numeric characters from price input or pasted text, ensuring clean numeric values.
 */
export function sanitizePriceInput(input: string): string {
  if (!input) return ""
  // Remove commas, whitespace, and currency labels
  const cleaned = input.replace(/,/g, "").replace(/[^\d.]/g, "")
  // Ensure at most one decimal point
  const parts = cleaned.split(".")
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join("")}`
  }
  return cleaned
}

/**
 * Instant Phone Number Formatter:
 * - Automatically handles Rwandan local formats (078..., 079..., 073..., 072..., 077..., or any 07...)
 *   and converts/displays them cleanly as "+250 788 123 456".
 * - If user enters "788...", "79...", "73...", "72...", "77...": auto-prefixes "+250 ".
 * - If user enters "25078...": auto-prefixes "+250 ".
 * - Preserves any international format with leading "+" (e.g. +256, +254, +1, +44).
 */
export function formatPhoneNumber(input: string): string {
  if (!input) return ""

  const isInternational = input.trim().startsWith("+")
  const digits = input.replace(/\D/g, "")

  if (!digits) {
    return isInternational ? "+" : ""
  }

  // Check if starts with "07" or "0" + Rwandan mobile prefix (078, 079, 073, 072, 077, etc.)
  if (input.trim().startsWith("0") && digits.startsWith("07")) {
    return formatRwandaDigits(digits.slice(1))
  }

  // Check if user entered "250"
  if (digits.startsWith("250")) {
    return formatRwandaDigits(digits.slice(3))
  }

  // Check if user entered "78...", "79...", "73...", "72...", "77..." (9 digits without leading 0)
  if (/^7[23789]/.test(digits) && !isInternational) {
    return formatRwandaDigits(digits)
  }

  // If international with other country code
  if (isInternational) {
    if (digits.length <= 3) return `+${digits}`
    if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`
    if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`
  }

  // Other local digits without recognized prefix
  if (digits.length <= 4) return digits
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
}

function formatRwandaDigits(rwaDigits: string): string {
  const d = rwaDigits.slice(0, 9)
  if (d.length === 0) return "+250 "
  if (d.length <= 3) return `+250 ${d}`
  if (d.length <= 6) return `+250 ${d.slice(0, 3)} ${d.slice(3)}`
  return `+250 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
}

/**
 * Normalizes phone number into clean compact E.164 without spaces (e.g. "+250788123456").
 */
export function normalizePhoneNumber(input: string): string {
  if (!input) return ""
  const formatted = formatPhoneNumber(input)
  return formatted.replace(/\s+/g, "")
}

export function sanitizePhoneInput(input: string): string {
  return formatPhoneNumber(input)
}

export function sanitizeEmailOrPhoneInput(input: string): string {
  const compact = input.replace(/\s+/g, "").replace(/[;,]/g, "")

  if (compact.includes("@")) {
    return sanitizeEmailInput(compact)
  }

  const looksLikePhone = compact.startsWith("+") || compact.startsWith("07") || /^\d+$/.test(compact)
  if (looksLikePhone) {
    return formatPhoneNumber(input)
  }

  return sanitizeEmailInput(compact)
}

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0

  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function isDominantMemberRequired(dateOfBirth: string, hasInsurance: boolean): boolean {
  if (!hasInsurance) return false
  return calculateAge(dateOfBirth) <= 18
}

/**
 * Validates email or phone number format without friction:
 * - Email: standard email format
 * - Phone: local or international format (7 to 15 digits)
 */
export function validateEmailOrPhone(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim()

  if (!trimmed) {
    return { valid: false, error: "Email or phone number is required" }
  }

  const compact = trimmed.replace(/[\s\-().,;]/g, "")

  // International phone format: + followed by 7-15 digits
  if (compact.startsWith("+")) {
    const digitsOnly = compact.slice(1)
    if (/^\d{7,15}$/.test(digitsOnly)) {
      return { valid: true }
    }
    return { valid: false, error: "Phone number must be between 7 and 15 digits" }
  }

  // Local phone format: starts with 07, 7, etc. (7 to 15 digits)
  if (/^\d{7,15}$/.test(compact)) {
    return { valid: true }
  }

  // Email format: basic validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailPattern.test(trimmed)) {
    return { valid: true }
  }

  return { valid: false, error: "Enter a valid email address or phone number" }
}

/**
 * Determines input type: "email", "phone_local", or "phone_international"
 */
export function getInputType(input: string): "email" | "phone_local" | "phone_international" {
  const trimmed = input.trim()

  if (trimmed.startsWith("+")) {
    return "phone_international"
  }

  if (trimmed.startsWith("07") || trimmed.startsWith("0")) {
    return "phone_local"
  }

  if (/^\d+$/.test(trimmed.replace(/\s+/g, ""))) {
    return "phone_local"
  }

  return "email"
}

export const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const

export const DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
)

const _currentYear = new Date().getFullYear()
export const YEARS = Array.from({ length: _currentYear - 1899 }, (_, i) =>
  String(_currentYear - i),
)

export function parseDob(dateOfBirth: string) {
  if (!dateOfBirth) return { day: "", month: "", year: "" }
  const [y, m, d] = dateOfBirth.split("-")
  return { day: d || "", month: m || "", year: y || "" }
}

export function composeDob(day: string, month: string, year: string) {
  if (!day || !month || !year) return ""
  return `${year}-${month}-${day}`
}

export function getDaysInMonth(month: string, year: string) {
  if (!month || !year) return DAYS
  const m = Number.parseInt(month, 10)
  const y = Number.parseInt(year, 10)
  const lastDay = new Date(y, m, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  )
}

export function validateDateOfBirth(dateOfBirth: string): { valid: boolean; error?: string } {
  if (!dateOfBirth) {
    return { valid: false, error: "Date of birth is required" }
  }

  const date = new Date(dateOfBirth)
  if (isNaN(date.getTime())) {
    return { valid: false, error: "Please select a valid date" }
  }

  if (date > new Date()) {
    return { valid: false, error: "Date of birth cannot be in the future" }
  }

  // Verify the parsed date matches (catches Feb 30, etc.)
  const [y, m, d] = dateOfBirth.split("-").map(Number)
  if (
    date.getFullYear() !== y ||
    date.getMonth() + 1 !== m ||
    date.getDate() !== d
  ) {
    return { valid: false, error: "Please select a valid date" }
  }

  return { valid: true }
}

export interface InsuranceEntryLike {
  insuranceId?: string | number | null
  insuranceCardNumber?: string | null
  providingCompanyOrEmployer?: string | null
  isSelf?: boolean | null
  dominantMember?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
  } | null
}

export function isInsuranceEntryComplete(
  ins: InsuranceEntryLike,
  dateOfBirth?: string,
): boolean {
  if (!ins) return false
  if (
    !ins.insuranceId ||
    String(ins.insuranceId) === "0" ||
    String(ins.insuranceId).trim() === ""
  ) {
    return false
  }
  if (!ins.insuranceCardNumber?.trim()) {
    return false
  }
  if (!ins.providingCompanyOrEmployer?.trim()) {
    return false
  }

  const isAdult = calculateAge(dateOfBirth || "") >= 18
  const isSelf = isAdult ? ins.isSelf !== false : false

  if (!isSelf) {
    if (
      !ins.dominantMember?.firstName?.trim() ||
      !ins.dominantMember?.lastName?.trim() ||
      !ins.dominantMember?.phone?.trim()
    ) {
      return false
    }
  }

  return true
}

export function canAddNewInsurance(
  insurances: InsuranceEntryLike[] | undefined | null,
  dateOfBirth?: string,
): boolean {
  if (!insurances || insurances.length === 0) return true
  return insurances.every((ins) => isInsuranceEntryComplete(ins, dateOfBirth))
}

/**
 * Clean and sanitize a National ID or Passport input string.
 * Strips whitespace, hyphens, and keeps clean characters.
 */
export function sanitizeNationalIdInput(input: string): string {
  if (!input) return ""
  return input.replace(/[\s\-_]/g, "").trim()
}

export interface RwandaNationalIdInfo {
  valid: boolean
  rawDigits: string
  statusDigit?: string // '1' citizen, '2' foreigner, '3' refugee
  yearOfBirth?: number
  gender?: "M" | "F"
  genderLabel?: "Male" | "Female"
  formatted?: string // "1 1998 8 0012345 0 23"
}

/**
 * Parses a 16-digit Rwandan National ID number.
 * Structure:
 * - Digit 1: Citizen (1), Foreigner/Resident (2), Refugee (3)
 * - Digits 2-5: Year of Birth (e.g. 1998)
 * - Digit 6: Gender indicator (8 = Male, 7 = Female)
 * - Digits 7-13: Serial / unique registration number
 * - Digit 14: Verification / repetition digit
 * - Digits 15-16: Location / control digits
 */
export function parseRwandaNationalId(input?: string | null): RwandaNationalIdInfo {
  if (!input) return { valid: false, rawDigits: "" }
  const digits = input.replace(/\D/g, "")
  if (digits.length !== 16) {
    return { valid: false, rawDigits: digits }
  }

  const statusDigit = digits[0]
  const currentYear = new Date().getFullYear()
  const yearStr = digits.slice(1, 5)
  const yearOfBirth = parseInt(yearStr, 10)
  const isYearValid = yearOfBirth >= 1900 && yearOfBirth <= currentYear

  const genderDigit = digits[5]
  let gender: "M" | "F" | undefined
  let genderLabel: "Male" | "Female" | undefined

  if (genderDigit === "8") {
    gender = "M"
    genderLabel = "Male"
  } else if (genderDigit === "7") {
    gender = "F"
    genderLabel = "Female"
  }

  const valid = isYearValid && gender !== undefined
  const formatted = `${digits[0]} ${digits.slice(1, 5)} ${digits[5]} ${digits.slice(6, 13)} ${digits[13]} ${digits.slice(14)}`

  return {
    valid,
    rawDigits: digits,
    statusDigit,
    yearOfBirth: isYearValid ? yearOfBirth : undefined,
    gender,
    genderLabel,
    formatted,
  }
}

/**
 * Validates whether the entered 16-digit Rwandan National ID matches the selected gender and date of birth.
 * Returns mismatch warning messages if any conflict exists.
 */
export function checkRwandaNationalIdMismatch(
  nid?: string | null,
  selectedGender?: string | null,
  selectedDob?: string | null,
): { hasMismatch: boolean; warning?: string; info?: RwandaNationalIdInfo } {
  const info = parseRwandaNationalId(nid)
  if (!info.valid) {
    return { hasMismatch: false, info }
  }

  const warnings: string[] = []

  // Check gender mismatch
  if (selectedGender && info.gender) {
    const normGender = selectedGender.toUpperCase().startsWith("M")
      ? "M"
      : selectedGender.toUpperCase().startsWith("F")
        ? "F"
        : ""
    if (normGender && normGender !== info.gender) {
      warnings.push(
        `ID specifies ${info.genderLabel} (digit '${info.rawDigits[5]}'), but ${normGender === "M" ? "Male" : "Female"} is selected.`
      )
    }
  }

  // Check year of birth mismatch
  if (selectedDob && info.yearOfBirth) {
    const dobYear = parseInt(selectedDob.split("-")[0], 10)
    if (!isNaN(dobYear) && dobYear !== info.yearOfBirth) {
      warnings.push(
        `ID specifies birth year ${info.yearOfBirth}, but Date of Birth is ${dobYear}.`
      )
    }
  }

  return {
    hasMismatch: warnings.length > 0,
    warning: warnings.length > 0 ? warnings.join(" ") : undefined,
    info,
  }
}


