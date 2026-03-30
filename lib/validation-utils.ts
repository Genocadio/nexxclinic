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
