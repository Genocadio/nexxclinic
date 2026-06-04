import type { ClinicProfile } from "@/lib/types"

export const DEFAULT_CLINIC_NAME = "med"
export const DEFAULT_CLINIC_LOGO_URL = "/FullLogo.png"
export const CLINIC_PROFILE_STORAGE_KEY = "clinicProfile"

export function normalizeClinicProfile(profile: ClinicProfile | null | undefined): ClinicProfile | null {
  if (!profile) return null

  const normalizedName = typeof profile.name === "string" ? profile.name.trim() : ""
  const normalizedAddress = typeof profile.address === "string" ? profile.address.trim() : ""
  const normalizedTinNumber = typeof profile.tinNumber === "string" ? profile.tinNumber.trim() : ""
  const normalizedLogoUrl = typeof profile.logoUrl === "string" ? profile.logoUrl.trim() : ""

  return {
    id: String(profile.id || ""),
    name: normalizedName || undefined,
    address: normalizedAddress || undefined,
    contacts: profile.contacts ?? null,
    tinNumber: normalizedTinNumber || undefined,
    logoUrl: normalizedLogoUrl || undefined,
    metadata: profile.metadata ?? null,
    createdAt: profile.createdAt || undefined,
    updatedAt: profile.updatedAt || undefined,
  }
}

export function getStoredClinicProfile(): ClinicProfile | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedClinicProfile = localStorage.getItem(CLINIC_PROFILE_STORAGE_KEY)
  if (!storedClinicProfile) {
    return null
  }

  try {
    return normalizeClinicProfile(JSON.parse(storedClinicProfile) as ClinicProfile)
  } catch {
    localStorage.removeItem(CLINIC_PROFILE_STORAGE_KEY)
    return null
  }
}

export function setStoredClinicProfile(profile: ClinicProfile | null) {
  if (typeof window === "undefined") {
    return
  }

  if (!profile) {
    localStorage.removeItem(CLINIC_PROFILE_STORAGE_KEY)
    return
  }

  localStorage.setItem(CLINIC_PROFILE_STORAGE_KEY, JSON.stringify(normalizeClinicProfile(profile)))
}

export function getClinicDisplayName(profile: ClinicProfile | null | undefined) {
  return profile?.name?.trim() || DEFAULT_CLINIC_NAME
}

export function getClinicLogoUrl(profile: ClinicProfile | null | undefined) {
  return profile?.logoUrl?.trim() || DEFAULT_CLINIC_LOGO_URL
}