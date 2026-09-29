import { describe, expect, it } from "vitest"
import { calculateUserReports } from "./user-reports-calculator"
import type { Visit, Worker } from "@/lib/api-types"
import { RoleName, AccountStatus } from "@/lib/api-types"

describe("calculateUserReports", () => {
  const mockWorker: Worker = {
    id: "user-123",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@clinic.com",
    accountStatus: AccountStatus.ACTIVE,
    roles: [RoleName.RECEPTION, RoleName.CLINICIAN, RoleName.NURSE, RoleName.FINANCE],
    departments: [],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  }

  const mockVisits: Visit[] = [
    {
      id: "visit-1",
      status: "COMPLETED" as any,
      visitDate: "2026-09-29T08:00:00Z",
      createdAt: "2026-09-29T08:00:00Z",
      patient: {
        id: "patient-1",
        firstName: "John",
        lastName: "Doe",
        patientIdentifier: "P-001",
        dateOfBirth: "1990-01-01",
        gender: "MALE" as any,
      },
      linkedInsurances: [
        {
          id: "ins-1",
          insuranceProvider: {
            id: "prov-1",
            insuranceName: "RAMA",
            coverages: [],
            supportedByClinic: true,
            createdAt: "",
            updatedAt: "",
          },
          insuranceCardNumber: "RAMA-123",
          principalMember: true,
          validFrom: "2026-01-01",
          validUntil: "2026-12-31",
          deactivated: false,
        } as any,
      ],
      vitalSigns: [
        {
          id: "vs-1",
          createdAt: "2026-09-29T08:05:00Z",
          addedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
          measurements: [
            { id: "m-1", measurementName: "Blood Pressure", value: "120/80", unit: "mmHg", createdAt: "" },
            { id: "m-2", measurementName: "Temperature", value: "36.6", unit: "°C", createdAt: "" },
          ],
        },
      ],
      departments: [
        {
          id: "vd-1",
          department: { id: "d-1", name: "General Consultation" } as any,
          status: "COMPLETED" as any,
          startedAt: "2026-09-29T08:10:00Z",
          completedAt: "2026-09-29T08:30:00Z",
          addedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
          completedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
          processors: [{ id: "user-123", firstName: "Alice", lastName: "Smith" } as any],
          products: [
            {
              id: "vdp-1",
              product: { id: "prod-1", name: "Paracetamol", type: "DRUG", privateRhicPrice: 500, clinicPrice: 500 } as any,
              quantity: 2,
              status: "BILLED" as any,
              addedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
              billedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
              createdAt: "2026-09-29T08:20:00Z",
            } as any,
            {
              id: "vdp-2",
              product: { id: "prod-2", name: "Injection Act", type: "MEDICAL_ACT", privateRhicPrice: 2000, clinicPrice: 2000 } as any,
              quantity: 1,
              status: "BILLED" as any,
              addedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
              billedBy: { id: "user-123", firstName: "Alice", lastName: "Smith" } as any,
              createdAt: "2026-09-29T08:25:00Z",
            } as any,
          ],
          billing: {
            id: "bill-1",
            status: "BILLED" as any,
            totalAmount: 3000,
            insuranceCoveredAmount: 2400,
            patientPayableAmount: 600,
            paidAmount: 400,
            outstandingAmount: 200,
            insuranceBillings: [
              {
                id: "ib-1",
                patientInsurance: {
                  insuranceProvider: { insuranceName: "RAMA" },
                } as any,
                status: "BILLED" as any,
                totalAmount: 3000,
                insuranceCoveredAmount: 2400,
                patientPayableAmount: 600,
                paidAmount: 400,
                outstandingAmount: 200,
                outstandingType: "LOAN",
                outstandingReason: "Patient promised to pay tomorrow",
                items: [],
                createdAt: "2026-09-29T08:25:00Z",
                updatedAt: "2026-09-29T08:25:00Z",
              },
            ],
            payments: [],
            createdAt: "2026-09-29T08:25:00Z",
            updatedAt: "2026-09-29T08:25:00Z",
          },
          childVisitDepartments: [],
        } as any,
      ],
    } as any,
  ]

  it("calculates multi-role statistics correctly for today", () => {
    const reports = calculateUserReports(mockVisits, mockWorker, "today", "2026-09-29", "2026-09-29")

    expect(reports.workerId).toBe("user-123")
    expect(reports.uniquePatientsTouched).toBe(1)
    expect(reports.totalInteractions).toBeGreaterThan(0)

    // Reception check
    expect(reports.reception.visitsInitiatedCount).toBe(1)
    expect(reports.reception.departmentsDispatchedCount).toBe(1)
    expect(reports.reception.insuredVisitsCount).toBe(1)
    expect(reports.reception.activities.length).toBe(1)

    // Clinician check
    expect(reports.clinician.consultationsCount).toBe(1)
    expect(reports.clinician.consultationsCompletedCount).toBe(1)
    expect(reports.clinician.prescriptionsCount).toBe(2)

    // Nurse check
    expect(reports.nurse.vitalsRecordedCount).toBe(1)
    expect(reports.nurse.nursingActsCount).toBe(1) // 1 Injection Act

    // Finance check
    expect(reports.finance.billedItemsCount).toBe(2)
    expect(reports.finance.totalRevenueBilled).toBe(3000)

    // Money reports check
    expect(reports.finance.money.totalGrossBilled).toBe(3000)
    expect(reports.finance.money.insuranceCoveredAmount).toBe(2400)
    expect(reports.finance.money.patientCashCollected).toBe(400)
    expect(reports.finance.money.patientLoanAmount).toBe(200)
    expect(reports.finance.money.loanCount).toBe(1)
    expect(reports.finance.money.insuranceBreakdown.length).toBe(1)
    expect(reports.finance.money.insuranceBreakdown[0].insuranceName).toBe("RAMA")

    // Clinician money and turnover check
    expect(reports.clinician.money.totalGrossBilled).toBe(3000)
    expect(reports.clinician.money.insuranceCoveredAmount).toBe(2400)
    expect(reports.clinician.money.patientCashCollected).toBe(400)
    expect(reports.clinician.money.patientLoanAmount).toBe(200)
    expect(reports.clinician.money.totalProductTurnover).toBe(3000)
    expect(reports.clinician.money.productItemsApprovedCount).toBe(3) // 2 Paracetamol + 1 Injection Act
    expect(reports.clinician.money.productTurnoverList.length).toBe(2)
    expect(reports.clinician.money.departmentBreakdown.length).toBe(1)
    expect(reports.clinician.money.departmentBreakdown[0].departmentName).toBe("General Consultation")
    expect(reports.clinician.money.insuranceBreakdown.length).toBe(1)
    expect(reports.clinician.money.insuranceBreakdown[0].insuranceName).toBe("RAMA")

    // Clinician demographics & operational check
    expect(reports.clinician.demographics.totalPatientsCount).toBe(1)
    expect(reports.clinician.demographics.maleCount).toBe(1)
    expect(reports.clinician.demographics.femaleCount).toBe(0)
    expect(reports.clinician.demographics.averageAge).toBeGreaterThan(0)
    expect(reports.clinician.demographics.averageEncounterTimeMinutes).toBe(20) // 08:10 to 08:30 = 20 mins
    expect(reports.clinician.demographics.peakActivityHour).toContain("AM")
    expect(reports.clinician.encountersList.length).toBe(1)
    expect(reports.clinician.encountersList[0].insuranceName).toBe("RAMA")
    expect(reports.clinician.encountersList[0].products.length).toBe(2)

    // Timeline check (Hourly resolution for today)
    expect(reports.timeline.length).toBeGreaterThanOrEqual(15) // 06:00 to 20:00 slots
    const activeSlot = reports.timeline.find((t) => t.total > 0)
    expect(activeSlot).toBeDefined()
    expect(activeSlot?.clinician).toBeGreaterThan(0)
    expect(activeSlot?.label).toMatch(/^\d{2}:00$/)
  })

  it("scales timeline by hours for single-day/today view", () => {
    const reports = calculateUserReports(mockVisits, mockWorker, "today", "2026-09-29", "2026-09-29")
    expect(reports.timeline.length).toBeGreaterThanOrEqual(15)
    expect(reports.timeline[0].label).toBe("06:00")
    expect(reports.timeline[reports.timeline.length - 1].label).toBe("20:00")
  })

  it("scales timeline across all 7 days for weekly view", () => {
    const reports = calculateUserReports(mockVisits, mockWorker, "week", "2026-09-23", "2026-09-29")
    expect(reports.timeline.length).toBe(7)
    expect(reports.timeline[0].date).toBe("2026-09-23")
    expect(reports.timeline[6].date).toBe("2026-09-29")
    expect(reports.timeline[6].label).toContain("Sep 29")
    // Total on Sep 29 should match recorded activities
    expect(reports.timeline[6].clinician).toBeGreaterThan(0)
  })

  it("scales timeline across days for monthly view", () => {
    const reports = calculateUserReports(mockVisits, mockWorker, "month", "2026-09-01", "2026-09-29")
    expect(reports.timeline.length).toBe(29)
    expect(reports.timeline[0].date).toBe("2026-09-01")
    expect(reports.timeline[0].label).toBe("Sep 1")
    expect(reports.timeline[28].date).toBe("2026-09-29")
    expect(reports.timeline[28].label).toBe("Sep 29")
    expect(reports.timeline[28].clinician).toBeGreaterThan(0)
  })

  it("enforces strict role-based capability flags and allowed tabs", () => {
    const receptionistOnly: Worker = {
      ...mockWorker,
      roles: [RoleName.RECEPTION],
    }
    const recReports = calculateUserReports(mockVisits, receptionistOnly, "today", "2026-09-29", "2026-09-29")
    expect(recReports.hasReception).toBe(true)
    expect(recReports.hasClinician).toBe(false)
    expect(recReports.hasNurse).toBe(false)
    expect(recReports.hasFinance).toBe(false)
    expect(recReports.allowedTabs).toEqual(["reception"])

    const clinicianOnly: Worker = {
      ...mockWorker,
      roles: [RoleName.CLINICIAN],
    }
    const clinReports = calculateUserReports(mockVisits, clinicianOnly, "today", "2026-09-29", "2026-09-29")
    expect(clinReports.hasReception).toBe(false)
    expect(clinReports.hasClinician).toBe(true)
    expect(clinReports.hasNurse).toBe(false)
    expect(clinReports.hasFinance).toBe(false)
    expect(clinReports.allowedTabs).toEqual(["clinician"])
  })

  it("does not include unbilled visit product amounts in monetary totals until billed", () => {
    const unbilledVisit: Visit = {
      id: "visit-unbilled",
      status: "IN_PROGRESS" as any,
      visitDate: "2026-09-29T09:00:00Z",
      createdAt: "2026-09-29T09:00:00Z",
      patient: { id: "p-2", firstName: "Bob", lastName: "Unbilled" } as any,
      linkedInsurances: [],
      vitalSigns: [],
      departments: [
        {
          id: "vd-unbilled",
          department: { id: "d-1", name: "General Consultation" } as any,
          status: "IN_PROGRESS" as any,
          startedAt: "2026-09-29T09:00:00Z",
          addedBy: { id: "user-123" } as any,
          completedBy: null,
          processors: [{ id: "user-123" } as any],
          products: [
            {
              id: "vdp-unbilled",
              product: { id: "prod-expensive", name: "CT Scan", type: "IMAGING", privateRhicPrice: 50000, clinicPrice: 50000 } as any,
              quantity: 1,
              status: "PENDING" as any,
              addedBy: { id: "user-123" } as any,
              createdAt: "2026-09-29T09:10:00Z",
            } as any,
          ],
        } as any,
      ],
    }

    const reports = calculateUserReports([unbilledVisit], mockWorker, "today", "2026-09-29", "2026-09-29")
    // Prescriptions count tracks clinical order actions
    expect(reports.clinician.prescriptionsCount).toBe(1)
    // Monetary turnover and totals must remain 0 since item is unbilled (PENDING)
    expect(reports.clinician.money.totalGrossBilled).toBe(0)
    expect(reports.clinician.money.totalProductTurnover).toBe(0)
    expect(reports.clinician.money.productItemsApprovedCount).toBe(0)
    expect(reports.clinician.money.productTurnoverList[0].isBilled).toBe(false)
  })

  it("excludes money for departments in DEPARTMENT_EDITING mode until completed", () => {
    const editingVisit: Visit = {
      id: "visit-edit-1",
      status: "COMPLETED" as any,
      visitDate: "2026-09-29T09:00:00Z",
      createdAt: "2026-09-29T09:00:00Z",
      patient: { id: "p-2", firstName: "Bob", lastName: "Edit" } as any,
      departments: [
        {
          id: "vd-edit-1",
          department: { id: "d-1", name: "General Consultation" } as any,
          status: "DEPARTMENT_EDITING" as any,
          startedAt: "2026-09-29T09:00:00Z",
          completedAt: "2026-09-29T09:20:00Z",
          addedBy: { id: "user-123" } as any,
          completedBy: { id: "user-123" } as any,
          processors: [{ id: "user-123" } as any],
          products: [
            {
              id: "vdp-edit-1",
              product: { id: "prod-1", name: "Amoxicillin", type: "DRUG", privateRhicPrice: 5000, clinicPrice: 5000 } as any,
              quantity: 1,
              status: "BILLED" as any,
              addedBy: { id: "user-123" } as any,
              createdAt: "2026-09-29T09:10:00Z",
            } as any,
          ],
          billing: {
            id: "bill-edit-1",
            status: "BILLED" as any,
            totalAmount: 5000,
            insuranceCoveredAmount: 4000,
            patientPayableAmount: 1000,
            paidAmount: 1000,
            outstandingAmount: 0,
            insuranceBillings: [],
            payments: [],
            createdAt: "2026-09-29T09:15:00Z",
            updatedAt: "2026-09-29T09:15:00Z",
          } as any,
        } as any,
      ],
    }

    const reports = calculateUserReports([editingVisit], mockWorker, "today", "2026-09-29", "2026-09-29")
    // Encounter is counted
    expect(reports.clinician.consultationsCount).toBe(1)
    // Money is excluded while in DEPARTMENT_EDITING
    expect(reports.clinician.money.totalGrossBilled).toBe(0)
    expect(reports.clinician.money.totalProductTurnover).toBe(0)
    expect(reports.clinician.money.productItemsApprovedCount).toBe(0)
    expect(reports.clinician.money.departmentBreakdown.length).toBe(1)
    expect(reports.clinician.money.departmentBreakdown[0].totalAmount).toBe(0)
    expect(reports.clinician.encountersList[0].totalGross).toBe(0)
  })

  it("calculates detailed payment modes breakdown including MoMo, Cash, Loans, and Giveaways", () => {
    const paymentVisits: Visit[] = [
      {
        id: "visit-payment-1",
        status: "COMPLETED" as any,
        visitDate: "2026-09-29T10:00:00Z",
        createdAt: "2026-09-29T10:00:00Z",
        patient: { id: "p-pay-1", firstName: "Alice", lastName: "Pay" } as any,
        departments: [
          {
            id: "vd-pay-1",
            department: { id: "d-1", name: "Outpatient" } as any,
            status: "COMPLETED" as any,
            startedAt: "2026-09-29T10:00:00Z",
            completedAt: "2026-09-29T10:20:00Z",
            addedBy: { id: "user-123" } as any,
            completedBy: { id: "user-123" } as any,
            processors: [{ id: "user-123" } as any],
            products: [
              {
                id: "vdp-pay-1",
                product: { id: "prod-1", name: "Consultation Fee", type: "MEDICAL_ACT", privateRhicPrice: 10000, clinicPrice: 10000 } as any,
                quantity: 1,
                status: "BILLED" as any,
                billedBy: { id: "user-123" } as any,
                createdAt: "2026-09-29T10:15:00Z",
              } as any,
            ],
            billing: {
              id: "bill-pay-1",
              status: "BILLED" as any,
              totalAmount: 10000,
              insuranceCoveredAmount: 7000,
              patientPayableAmount: 3000,
              paidAmount: 2000,
              outstandingAmount: 1000,
              insuranceBillings: [
                {
                  id: "ib-pay-1",
                  status: "BILLED" as any,
                  totalAmount: 10000,
                  insuranceCoveredAmount: 7000,
                  patientPayableAmount: 3000,
                  paidAmount: 2000,
                  outstandingAmount: 1000,
                  outstandingType: "LOAN",
                  items: [],
                  createdAt: "2026-09-29T10:15:00Z",
                },
              ],
              payments: [
                {
                  id: "pay-momo-1",
                  amount: 1500,
                  paymentMethod: "MOBILE_MONEY" as any,
                  createdAt: "2026-09-29T10:15:00Z",
                  updatedAt: "2026-09-29T10:15:00Z",
                },
                {
                  id: "pay-cash-1",
                  amount: 500,
                  paymentMethod: "CASH" as any,
                  createdAt: "2026-09-29T10:15:00Z",
                  updatedAt: "2026-09-29T10:15:00Z",
                },
              ],
              createdAt: "2026-09-29T10:15:00Z",
              updatedAt: "2026-09-29T10:15:00Z",
            },
          } as any,
        ],
      } as any,
    ]

    const reports = calculateUserReports(paymentVisits, mockWorker, "today", "2026-09-29", "2026-09-29")
    const money = reports.finance.money

    expect(money.totalGrossBilled).toBe(10000)
    expect(money.insuranceCoveredAmount).toBe(7000)
    expect(money.patientCashCollected).toBe(2000)
    expect(money.momoCollected).toBe(1500)
    expect(money.cashCollected).toBe(500)
    expect(money.patientLoanAmount).toBe(1000)
    expect(money.loanCount).toBe(1)
    expect(money.paymentModesBreakdown["MOBILE_MONEY"]?.amount).toBe(1500)
    expect(money.paymentModesBreakdown["CASH"]?.amount).toBe(500)
  })

  it("returns zero counts when dates do not match", () => {
    const reports = calculateUserReports(mockVisits, mockWorker, "custom", "2026-01-01", "2026-01-02")
    expect(reports.totalInteractions).toBe(0)
    expect(reports.uniquePatientsTouched).toBe(0)
    expect(reports.reception.visitsInitiatedCount).toBe(0)
    expect(reports.clinician.consultationsCount).toBe(0)
    expect(reports.nurse.vitalsRecordedCount).toBe(0)
    expect(reports.finance.billedItemsCount).toBe(0)
  })
})

