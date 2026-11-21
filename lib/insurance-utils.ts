/**
 * Shared utilities for insurance status checks across billing, visit creation,
 * and patient registration UIs.
 */

export interface InsuranceLike {
  deactivated?: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
}

/**
 * Returns `true` when a PatientInsurance is currently active: not deactivated,
 * validFrom is in the past, and validUntil is in the future.
 */
export function isInsuranceActive(ins: InsuranceLike): boolean {
  if (ins.deactivated) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ins.validFrom) {
    const from = new Date(ins.validFrom);
    from.setHours(0, 0, 0, 0);
    if (from > today) return false;
  }
  if (ins.validUntil) {
    const until = new Date(ins.validUntil);
    until.setHours(0, 0, 0, 0);
    if (until < today) return false;
  }
  return true;
}

/**
 * Returns a human-readable tooltip string describing the insurance status.
 * Used for hover tooltips on grayed-out insurance badges.
 */
export function insuranceStatusLabel(ins: InsuranceLike): string {
  if (ins.deactivated) return "Insurance is deactivated";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (ins.validFrom) {
    const from = new Date(ins.validFrom);
    from.setHours(0, 0, 0, 0);
    if (from > today) {
      return `Insurance starts on ${formatDate(ins.validFrom)}`;
    }
  }
  if (ins.validUntil) {
    const until = new Date(ins.validUntil);
    until.setHours(0, 0, 0, 0);
    if (until < today) {
      return `Insurance expired on ${formatDate(ins.validUntil)}`;
    }
  }
  return "Insurance is active";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Resolves the display name for an insurance provider, prioritizing the acronym
 * if present and non-empty, falling back to full insuranceName, name, or "Insurance".
 */
export function getInsuranceDisplayName(
  provider?: { acronym?: string | null; insuranceName?: string | null; name?: string | null } | null
): string {
  if (!provider) return "Insurance"
  if (provider.acronym && provider.acronym.trim()) return provider.acronym.trim()
  if (provider.insuranceName && provider.insuranceName.trim()) return provider.insuranceName.trim()
  if (provider.name && provider.name.trim()) return provider.name.trim()
  return "Insurance"
}

export interface PatientShareDefaultInfo {
  percentage: number | null
  source: "Patient default" | "Provider base" | "Service rules" | "Not configured"
  tierLabel?: string
}

export function formatPatientShareDefaultInfo(
  info: PatientShareDefaultInfo,
): string {
  if (info.percentage === null) return info.source

  const source =
    info.source === "Patient default" ? "" : ` (${info.source.toLowerCase()})`
  const tier = info.tierLabel ? ` · ${info.tierLabel}` : ""
  return `${info.percentage}%${source}${tier}`
}

export function getPatientShareDefaultInfo(insurance: {
  patientSharePercentage?: number | string | null
  patientShareCoverageId?: string | null
  insuranceProvider?: {
    coverages?: Array<{
      id?: string | null
      departmentId?: string | null
      departmentName?: string | null
      encounterType?: string | null
      patientSharePercentage?: number | string | null
    }> | null
  } | null
}): PatientShareDefaultInfo {
  const coverages = insurance.insuranceProvider?.coverages ?? []
  const selectedCoverage = insurance.patientShareCoverageId
    ? coverages.find(
        (coverage) =>
          String(coverage.id) === String(insurance.patientShareCoverageId),
      )
    : undefined
  const selectedPercentage = Number(selectedCoverage?.patientSharePercentage)

  if (
    selectedCoverage?.patientSharePercentage != null &&
    Number.isFinite(selectedPercentage)
  ) {
    const scope = [
      selectedCoverage.departmentName ||
        (selectedCoverage.departmentId ? "Department-specific" : null),
      selectedCoverage.encounterType
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    ]
      .filter(Boolean)
      .join(" / ")

    return {
      percentage: selectedPercentage,
      source: "Patient default",
      tierLabel: scope || "Base / General",
    }
  }

  if (
    insurance.patientSharePercentage != null &&
    insurance.patientSharePercentage !== ""
  ) {
    const percentage = Number(insurance.patientSharePercentage)
    if (Number.isFinite(percentage)) {
      return { percentage, source: "Patient default" }
    }
  }

  const baseCoverage = coverages.find(
    (coverage) =>
      !coverage.departmentId &&
      !coverage.encounterType &&
      coverage.patientSharePercentage != null,
  )
  const basePercentage = Number(baseCoverage?.patientSharePercentage)
  if (baseCoverage && Number.isFinite(basePercentage)) {
    return {
      percentage: basePercentage,
      source: "Provider base",
      tierLabel: "Base / General",
    }
  }

  return {
    percentage: null,
    source: coverages.length > 0 ? "Service rules" : "Not configured",
  }
}

export interface ProductInsurancePricingResult {
  price: number
  coverage: any | null
  isCovered: boolean
  coverageDetails: any[]
  hasZeroPayingCoverages: boolean
  allCoveragesZeroOrNotCovered: boolean
}

export function getInsuranceAwarePricing(
  item: {
    clinicPrice?: number | null
    privateRhicPrice?: number | null
    insuranceCoverages?: any[]
  },
  linkedInsurances?: any[]
): ProductInsurancePricingResult {
  const privatePrice = Number(item?.clinicPrice ?? item?.privateRhicPrice ?? 0)
  if (!linkedInsurances || linkedInsurances.length === 0) {
    return {
      price: privatePrice,
      coverage: null,
      isCovered: false,
      coverageDetails: [],
      hasZeroPayingCoverages: false,
      allCoveragesZeroOrNotCovered: false,
    }
  }

  const insuranceProviderIds = new Set(
    linkedInsurances
      .map((ins) => ins?.insuranceProvider?.id || (ins as any)?.insuranceProviderId)
      .filter(Boolean)
  )

  const matchingCoverages = (item?.insuranceCoverages || []).filter((cov: any) => {
    const providerId = cov?.insuranceProvider?.id || cov?.insuranceProviderId
    return providerId && insuranceProviderIds.has(providerId)
  })

  const validCoverages = matchingCoverages.filter(
    (c: any) =>
      c.covered !== false &&
      !Boolean(c.notPaid) &&
      Number(c.cost) > 0
  )
  const firstCovered = validCoverages[0]

  if (matchingCoverages.length === 0) {
    return {
      price: privatePrice,
      coverage: null,
      isCovered: false,
      coverageDetails: [],
      hasZeroPayingCoverages: false,
      allCoveragesZeroOrNotCovered: false,
    }
  }

  return {
    price: firstCovered ? Number(firstCovered.cost) : privatePrice,
    coverage: firstCovered || null,
    isCovered: Boolean(firstCovered),
    coverageDetails: matchingCoverages,
    hasZeroPayingCoverages: matchingCoverages.some(
      (c: any) =>
        Number(c.cost) <= 0 ||
        c.covered === false ||
        Boolean(c.notPaid)
    ),
    allCoveragesZeroOrNotCovered: validCoverages.length === 0,
  }
}


