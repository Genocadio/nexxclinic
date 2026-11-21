import { describe, expect, it } from "vitest"
import {
  DepartmentInsurancePolicyMode,
  DepartmentKind,
  DrugAdministrationFrequency,
  EncounterType,
  Gender,
  MustPrescribedBy,
  ProductType,
  ProductUnit,
  VisitDepartmentStatus,
  VisitProductStatus,
  VisitStatus,
  type Department,
  type InsuranceProvider,
  type Patient,
  type PatientInsurance,
  type Product,
  type Visit,
  type VisitDepartment,
} from "./api-types"
import { mapVisitToBillingData } from "./visit-billing-mapper"

describe("mapVisitToBillingData", () => {
  it("uses the patient's selected share default for the initial payment amount", () => {
    const now = new Date().toISOString()
    const provider: InsuranceProvider = {
      id: "provider-1",
      insuranceName: "Example Insurance",
      coverages: [
        {
          id: "base-tier",
          insuranceProviderId: "provider-1",
          insuranceProviderName: "Example Insurance",
          patientSharePercentage: 15,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "patient-tier",
          insuranceProviderId: "provider-1",
          insuranceProviderName: "Example Insurance",
          departmentId: "department-1",
          departmentName: "Consultation",
          encounterType: EncounterType.OUTPATIENT,
          patientSharePercentage: 40,
          createdAt: now,
          updatedAt: now,
        },
      ],
      supportedByClinic: true,
      createdAt: now,
      updatedAt: now,
    }

    const patient: Patient = {
      id: "patient-1",
      firstName: "Test",
      dateOfBirth: "1990-01-01",
      gender: Gender.FEMALE,
      patientInsurances: [],
      createdAt: now,
      updatedAt: now,
    }

    const patientInsurance: PatientInsurance = {
      id: "patient-insurance-1",
      patient,
      insuranceProvider: provider,
      insuranceCardNumber: "CARD-1",
      principalMember: true,
      validFrom: "2020-01-01",
      validUntil: "2099-01-01",
      deactivated: false,
      patientSharePercentage: 40,
      patientShareCoverageId: "patient-tier",
      createdAt: now,
      updatedAt: now,
    }

    const department: Department = {
      id: "department-1",
      name: "Consultation",
      kind: DepartmentKind.CONSULTATION,
      insurancePolicyMode: DepartmentInsurancePolicyMode.ALL,
      insurancePolicies: [],
      profiles: [],
      nursing: false,
      supportRequests: false,
      requestsProducts: false,
      createdAt: now,
      updatedAt: now,
    }

    const product: Product = {
      id: "product-1",
      name: "Consultation",
      code: "CONSULT",
      description: "",
      type: ProductType.MEDICAL_ACT,
      unit: ProductUnit.PIECE,
      clinicPrice: 1000,
      notPaid: false,
      insuranceCoverages: [
        {
          id: "product-coverage-1",
          insuranceProvider: provider,
          cost: 1000,
          covered: true,
          notPaid: false,
          requireMedicalAdvisor: false,
          mustPrescribedBy: MustPrescribedBy.ALL,
          drugAdministrationFrequency: DrugAdministrationFrequency.CUSTOM_HOURS,
          authorizationRequestReasons: [],
          createdAt: now,
          updatedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    }

    const visitDepartment: VisitDepartment = {
      id: "visit-department-1",
      department,
      status: VisitDepartmentStatus.ACTIVE,
      encounterType: EncounterType.OUTPATIENT,
      processors: [],
      childVisitDepartments: [],
      products: [
        {
          id: "visit-product-1",
          product,
          quantity: 1,
          status: VisitProductStatus.PENDING,
          createdAt: now,
          updatedAt: now,
        },
      ],
      preInstructions: [],
      createdAt: now,
      updatedAt: now,
    }

    const visit: Visit = {
      id: "visit-1",
      patient,
      status: VisitStatus.IN_PROGRESS,
      visitDate: now,
      linkedInsurances: [patientInsurance],
      departments: [visitDepartment],
      vitalSigns: [],
      createdAt: now,
      updatedAt: now,
    }

    const billingData = mapVisitToBillingData(visit)

    expect(billingData.amountPaid).toBe(400)
    expect(billingData.items[0].selectedCoverageId).toBe("patient-tier")
  })
})
