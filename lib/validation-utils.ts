export function sanitizeEmailInput(input: string): string {
  return input
    .replace(/\s+/g, "")
    .replace(/[;,]/g, "")
    .replace(/[^a-zA-Z0-9@._%+-]/g, "")
}

export function sanitizePhoneInput(input: string): string {
  const noSpacesOrSeparators = input.replace(/\s+/g, "").replace(/[;,]/g, "")
  let result = ""

  for (let i = 0; i < noSpacesOrSeparators.length; i++) {
    const char = noSpacesOrSeparators[i]
    if (i === 0 && char === "+") {
      result += char
      continue
    }
    if (/\d/.test(char)) {
      result += char
    }
  }

  return result
}

export function sanitizeEmailOrPhoneInput(input: string): string {
  const compact = input.replace(/\s+/g, "").replace(/[;,]/g, "")

  if (compact.includes("@")) {
    return sanitizeEmailInput(compact)
  }

  const looksLikePhone = compact.startsWith("+") || compact.startsWith("07") || /^\d+$/.test(compact)
  if (looksLikePhone) {
    return sanitizePhoneInput(compact)
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
 * Validates email or phone number format
 * - Email: standard email format
 * - Local phone: starts with 07, followed by 10 total digits
 * - International phone: starts with +, followed by 12 total digits
 */
export function validateEmailOrPhone(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim()

  if (!trimmed) {
    return { valid: false, error: "Email or phone number is required" }
  }

  // International phone format: +XXXXXXXXXXXX (+ followed by 12 digits)
  if (trimmed.startsWith("+")) {
    const digitsOnly = trimmed.slice(1)
    if (!/^\d{12}$/.test(digitsOnly)) {
      return { valid: false, error: "International phone must be + followed by 12 digits (e.g., +256701234567)" }
    }
    return { valid: true }
  }

  // Local phone format: 07XXXXXXXXXX (10 total digits starting with 07)
  if (trimmed.startsWith("07")) {
    if (!/^\d{10}$/.test(trimmed)) {
      return { valid: false, error: "Local phone must be 10 digits starting with 07 (e.g., 0712345678)" }
    }
    return { valid: true }
  }

  // Email format: basic validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailPattern.test(trimmed)) {
    return { valid: true }
  }

  return { valid: false, error: "Enter a valid email (user@domain.com) or phone (+256701234567 or 0712345678)" }
}

/**
 * Determines input type: "email", "phone_local", or "phone_international"
 */
export function getInputType(input: string): "email" | "phone_local" | "phone_international" {
  const trimmed = input.trim()

  if (trimmed.startsWith("+")) {
    return "phone_international"
  }

  if (trimmed.startsWith("07")) {
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
