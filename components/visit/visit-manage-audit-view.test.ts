import { describe, expect, it } from "vitest"
import {
  resolveProductBillingSummary,
  getInsuranceDisplayName,
  getDepartmentAppliedInsurances,
} from "./visit-manage-audit-view"
import {
  DepartmentInsurancePolicyMode,
  EncounterType,
  VisitDepartmentStatus,
  VisitProductStatus,
  VisitDepartmentProductSource,
  BillingConfirmationStatus,
  ProductType,
  ProductUnit,
  MustPrescribedBy,
  DrugAdministrationFrequency,
  type VisitDepartment,
  type VisitDepartmentProduct,
  type PatientInsurance,
} from "@/lib/api-types"

describe("getInsuranceDisplayName", () => {
  it("prefers acronym when present and non-empty", () => {
    expect(
      getInsuranceDisplayName({
        acronym: "RSSB",
        insuranceName: "Rwanda Social Security Board",
      })
    ).toBe("RSSB")
  })

  it("falls back to insuranceName when acronym is missing or empty", () => {
    expect(
      getInsuranceDisplayName({
        acronym: "",
        insuranceName: "Rwanda Social Security Board",
      })
    ).toBe("Rwanda Social Security Board")

    expect(
      getInsuranceDisplayName({
        insuranceName: "Rwanda Social Security Board",
      })
    ).toBe("Rwanda Social Security Board")
  })

  it("falls back to name or default 'Insurance'", () => {
    expect(
      getInsuranceDisplayName({
        name: "Legacy Insurance",
      })
    ).toBe("Legacy Insurance")

    expect(getInsuranceDisplayName(null)).toBe("Insurance")
  })
})

describe("resolveProductBillingSummary", () => {
  const dummyDept: VisitDepartment = {
    id: "vdept-1",
    department: {
      id: "dept-1",
      name: "Dental",
      insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
      insurancePolicies: [],
      profiles: [],
      nursing: false,
      supportRequests: false,
      requestsProducts: true,
      createdAt: "2026-09-26T08:00:00Z",
      updatedAt: "2026-09-26T08:00:00Z",
    },
    status: VisitDepartmentStatus.ACTIVE,
    encounterType: EncounterType.OUTPATIENT,
    processors: [],
    childVisitDepartments: [],
    products: [],
    preInstructions: [],
    createdAt: "2026-09-26T08:00:00Z",
    updatedAt: "2026-09-26T08:00:00Z",
  }

  const dummyProduct: VisitDepartmentProduct = {
    id: "vprod-1",
    quantity: 2,
    status: VisitProductStatus.BILLED,
    source: VisitDepartmentProductSource.USER,
    billingConfirmationStatus: BillingConfirmationStatus.CONFIRMED,
    createdAt: "2026-09-26T08:30:00Z",
    updatedAt: "2026-09-26T09:00:00Z",
    product: {
      id: "prod-1",
      name: "Dental Cleaning",
      code: "DEN-01",
      description: "Cleaning act",
      type: ProductType.MEDICAL_ACT,
      unit: ProductUnit.PCS,
      notPaid: false,
      clinicPrice: 10000,
      privateRhicPrice: 10000,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      insuranceCoverages: [
        {
          id: "pic-1",
          cost: 8000,
          covered: true,
          notPaid: false,
          requireMedicalAdvisor: false,
          mustPrescribedBy: MustPrescribedBy.ALL,
          drugAdministrationFrequency: DrugAdministrationFrequency.CUSTOM_HOURS,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
          insuranceProvider: {
            id: "ins-1",
            insuranceName: "Rwanda Social Security Board",
            acronym: "RSSB",
            supportedByClinic: true,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
            coverages: [
              {
                id: "cov-1",
                insuranceProviderId: "ins-1",
                insuranceProviderName: "RAMA / RSSB",
                patientSharePercentage: 15,
                createdAt: "2026-01-01T00:00:00Z",
                updatedAt: "2026-01-01T00:00:00Z",
              },
            ],
          },
        } as any,
      ],
    },
  }

  it("resolves private paying product when no insurance is linked", () => {
    const summary = resolveProductBillingSummary(dummyProduct, dummyDept, [])
    expect(summary.isInsured).toBe(false)
    expect(summary.insuranceName).toBe("Cash / Private")
    expect(summary.unitPrice).toBe(10000)
    expect(summary.lineTotal).toBe(20000)
    expect(summary.coveragePct).toBe(0)
    expect(summary.patientSharePct).toBe(100)
    expect(summary.insuranceAmount).toBe(0)
    expect(summary.patientAmount).toBe(20000)
  })

  it("resolves insured product with tariff, coverage percentage, and acronym display name", () => {
    const linkedInsurance: PatientInsurance = {
      id: "pins-1",
      insuranceCardNumber: "12345678",
      principalMember: true,
      validFrom: "2026-01-01T00:00:00Z",
      validUntil: "2027-01-01T00:00:00Z",
      deactivated: false,
      patient: {} as any,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      insuranceProvider: {
        id: "ins-1",
        insuranceName: "Rwanda Social Security Board",
        acronym: "RSSB",
        supportedByClinic: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
        coverages: [
          {
            id: "cov-1",
            insuranceProviderId: "ins-1",
            insuranceProviderName: "RAMA / RSSB",
            patientSharePercentage: 15,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
      },
    }

    const summary = resolveProductBillingSummary(dummyProduct, dummyDept, [linkedInsurance])
    expect(summary.isInsured).toBe(true)
    expect(summary.insuranceName).toBe("RSSB") // Acronym used instead of full name
    expect(summary.unitPrice).toBe(8000)
    expect(summary.lineTotal).toBe(16000) // 8000 * 2
    expect(summary.coveragePct).toBe(85) // 100 - 15
    expect(summary.patientSharePct).toBe(15)
    expect(summary.insuranceAmount).toBe(13600) // 16000 * 0.85
    expect(summary.patientAmount).toBe(2400) // 16000 - 13600
  })
})

describe("getDepartmentAppliedInsurances", () => {
  const sampleInsurance1: PatientInsurance = {
    id: "pins-1",
    insuranceCardNumber: "RSSB-001",
    principalMember: true,
    validFrom: "2026-01-01T00:00:00Z",
    validUntil: "2027-01-01T00:00:00Z",
    deactivated: false,
    patient: {} as any,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    insuranceProvider: {
      id: "ins-1",
      insuranceName: "Rwanda Social Security Board",
      acronym: "RSSB",
      supportedByClinic: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      coverages: [
        {
          id: "cov-1",
          insuranceProviderId: "ins-1",
          insuranceProviderName: "Rwanda Social Security Board",
          patientSharePercentage: 15,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
    },
  }

  const sampleInsurance2: PatientInsurance = {
    id: "pins-2",
    insuranceCardNumber: "MMI-999",
    principalMember: false,
    validFrom: "2026-01-01T00:00:00Z",
    validUntil: "2027-01-01T00:00:00Z",
    deactivated: false,
    patient: {} as any,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    insuranceProvider: {
      id: "ins-2",
      insuranceName: "Military Medical Insurance",
      acronym: "MMI",
      supportedByClinic: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      coverages: [
        {
          id: "cov-2",
          insuranceProviderId: "ins-2",
          insuranceProviderName: "Military Medical Insurance",
          patientSharePercentage: 10,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
    },
  }

  it("returns all linked insurances when policy mode is ALL", () => {
    const dept: VisitDepartment = {
      id: "vdept-1",
      department: {
        id: "dept-1",
        name: "Dental",
        insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
        insurancePolicies: [],
        profiles: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: true,
        createdAt: "2026-09-26T08:00:00Z",
        updatedAt: "2026-09-26T08:00:00Z",
      },
      status: VisitDepartmentStatus.ACTIVE,
      encounterType: EncounterType.OUTPATIENT,
      processors: [],
      childVisitDepartments: [],
      products: [],
      preInstructions: [],
      createdAt: "2026-09-26T08:00:00Z",
      updatedAt: "2026-09-26T08:00:00Z",
    }

    const applied = getDepartmentAppliedInsurances(dept, [sampleInsurance1, sampleInsurance2])
    expect(applied).toHaveLength(2)
    expect(applied[0].displayName).toBe("RSSB")
    expect(applied[0].coveragePct).toBe(85)
    expect(applied[1].displayName).toBe("MMI")
    expect(applied[1].coveragePct).toBe(90)
  })

  it("filters only selected insurances when mode is ONLY", () => {
    const dept: VisitDepartment = {
      id: "vdept-1",
      department: {
        id: "dept-1",
        name: "Dental",
        insurancePolicyMode: DepartmentInsurancePolicyMode.ONLY,
        insurancePolicies: [{ id: "ins-1" } as any],
        profiles: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: true,
        createdAt: "2026-09-26T08:00:00Z",
        updatedAt: "2026-09-26T08:00:00Z",
      },
      status: VisitDepartmentStatus.ACTIVE,
      encounterType: EncounterType.OUTPATIENT,
      processors: [],
      childVisitDepartments: [],
      products: [],
      preInstructions: [],
      createdAt: "2026-09-26T08:00:00Z",
      updatedAt: "2026-09-26T08:00:00Z",
    }

    const applied = getDepartmentAppliedInsurances(dept, [sampleInsurance1, sampleInsurance2])
    expect(applied).toHaveLength(1)
    expect(applied[0].displayName).toBe("RSSB")
  })

  it("excludes exempted insurances when mode is EXCEPT", () => {
    const dept: VisitDepartment = {
      id: "vdept-1",
      department: {
        id: "dept-1",
        name: "Dental",
        insurancePolicyMode: DepartmentInsurancePolicyMode.EXCEPT,
        insurancePolicies: [{ id: "ins-1" } as any],
        profiles: [],
        nursing: false,
        supportRequests: false,
        requestsProducts: true,
        createdAt: "2026-09-26T08:00:00Z",
        updatedAt: "2026-09-26T08:00:00Z",
      },
      status: VisitDepartmentStatus.ACTIVE,
      encounterType: EncounterType.OUTPATIENT,
      processors: [],
      childVisitDepartments: [],
      products: [],
      preInstructions: [],
      createdAt: "2026-09-26T08:00:00Z",
      updatedAt: "2026-09-26T08:00:00Z",
    }

    const applied = getDepartmentAppliedInsurances(dept, [sampleInsurance1, sampleInsurance2])
    expect(applied).toHaveLength(1)
    expect(applied[0].displayName).toBe("MMI")
  })
})

