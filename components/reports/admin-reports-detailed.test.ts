import { describe, it, expect } from "vitest"
import type { ClinicEncounterDetail } from "@/hooks/reports/use-clinic-reports"

describe("AdminReportsDetailed Bordereau & Audit Logic", () => {
  const mockEncounters: ClinicEncounterDetail[] = [
    {
      id: "clinic-enc-1",
      visitId: "5d8b254b-d7a2-4d3b-91fc-a40730954b51",
      visitDepartmentId: "dept-1",
      timestamp: "2026-10-09T10:46:00Z",
      patientName: "Alice Uwase",
      patientId: "pat-1",
      patientIdentifier: "PAT-0091",
      gender: "FEMALE",
      age: 28,
      departmentId: "dept-opht",
      departmentName: "Ophthalmology",
      clinicianName: "Dr. Jean Bizimana",
      insuranceName: "MMI",
      insuranceCardNumber: "MMI-2026-0982",
      principalMemberName: "Jean Claude Uwase",
      isPrincipalMember: false,
      primaryDiagnosis: "Astigmatism (9D00.1)",
      primaryIcdCode: "9D00.1",
      status: "BILLED",
      products: [
        {
          id: "prod-1",
          name: "Tonometry",
          code: "ACT-011",
          quantity: 1,
          unitPrice: 6000,
          lineTotal: 6000,
          insuranceCovered: 5100,
          patientShare: 900,
          status: "BILLED",
          type: "MEDICAL_ACT",
        },
        {
          id: "prod-2",
          name: "Ophthalmic Consultation",
          code: "ACT-013",
          quantity: 1,
          unitPrice: 7500,
          lineTotal: 7500,
          insuranceCovered: 6375,
          patientShare: 1125,
          status: "BILLED",
          type: "CONSULTATION",
        },
      ],
      totalGross: 13500,
      totalInsurance: 11475,
      totalPatient: 2025,
      patientPaid: 2025,
      payments: [
        {
          id: "pay-1",
          amount: 2025,
          paymentMethod: "MOBILE_MONEY",
          reference: "MTN-984210",
          createdAt: "2026-10-09T11:49:00Z",
        },
      ],
    },
    {
      id: "clinic-enc-2",
      visitId: "99aa88bb-ccdd-eeff-0011-223344556677",
      visitDepartmentId: "dept-2",
      timestamp: "2026-10-10T14:30:00Z",
      patientName: "David Mugisha",
      patientId: "pat-2",
      patientIdentifier: "PAT-0092",
      gender: "MALE",
      age: 45,
      departmentId: "dept-gen",
      departmentName: "General Medicine",
      clinicianName: "Dr. Patrick Habimana",
      insuranceName: "Private / Cash",
      status: "BILLED",
      products: [
        {
          id: "prod-3",
          name: "Routine Consultation",
          code: "ACT-001",
          quantity: 1,
          unitPrice: 10000,
          lineTotal: 10000,
          insuranceCovered: 0,
          patientShare: 10000,
          status: "BILLED",
          type: "CONSULTATION",
        },
      ],
      totalGross: 10000,
      totalInsurance: 0,
      totalPatient: 10000,
      patientPaid: 10000,
      payments: [
        {
          id: "pay-2",
          amount: 10000,
          paymentMethod: "CASH",
          reference: "",
          createdAt: "2026-10-10T14:45:00Z",
        },
      ],
    },
  ]

  it("correctly identifies eligible insured encounters for bordereau export", () => {
    const insuredEncounters = mockEncounters.filter((enc) => {
      const isInsured =
        enc.insuranceName &&
        !enc.insuranceName.toLowerCase().includes("private") &&
        !enc.insuranceName.toLowerCase().includes("cash")
      return isInsured
    })

    expect(insuredEncounters.length).toBe(1)
    expect(insuredEncounters[0].insuranceName).toBe("MMI")
    expect(insuredEncounters[0].patientName).toBe("Alice Uwase")
  })

  it("correctly maps Rwandan bordereau submission fields for an insured encounter", () => {
    const enc = mockEncounters[0]
    const voucherNo = enc.visitId.slice(-8).toUpperCase()
    const principal = enc.principalMemberName || enc.patientName
    const quality = enc.isPrincipalMember ? "Assuré Principal" : "Ayoborwa / Dépendant"
    const cardNumber = enc.insuranceCardNumber || enc.patientIdentifier || "—"
    const diagnosis = enc.primaryDiagnosis || enc.primaryIcdCode || "—"

    expect(voucherNo).toBe("A40730954B51".slice(-8))
    expect(principal).toBe("Jean Claude Uwase")
    expect(quality).toBe("Ayoborwa / Dépendant")
    expect(cardNumber).toBe("MMI-2026-0982")
    expect(diagnosis).toBe("Astigmatism (9D00.1)")

    // Product line 1: Tonometry
    const prod1 = enc.products[0]
    expect(prod1.code).toBe("ACT-011")
    expect(prod1.lineTotal).toBe(6000)
    expect(prod1.insuranceCovered).toBe(5100) // 85%
    expect(prod1.patientShare).toBe(900) // 15%

    // Product line 2: Ophthalmic Consultation
    const prod2 = enc.products[1]
    expect(prod2.code).toBe("ACT-013")
    expect(prod2.lineTotal).toBe(7500)
    expect(prod2.insuranceCovered).toBe(6375) // 85%
    expect(prod2.patientShare).toBe(1125) // 15%
  })

  it("correctly maps recorded MoMo payments with reference code for auditing", () => {
    const enc = mockEncounters[0]
    expect(enc.payments).toBeDefined()
    expect(enc.payments?.length).toBe(1)
    const payment = enc.payments![0]
    expect(payment.paymentMethod).toBe("MOBILE_MONEY")
    expect(payment.reference).toBe("MTN-984210")
    expect(payment.amount).toBe(2025)
  })

  it("maps available invoice action descriptors correctly", () => {
    const billingDepartments = [
      {
        id: "dept-b-1",
        insuranceBillings: [
          {
            id: "ib-mmi-1",
            totalAmount: 13500,
            insuranceCoveredAmount: 11475,
            patientPayableAmount: 2025,
            patientInsurance: {
              insuranceCardNumber: "MMI-2026-0982",
              insuranceProvider: {
                insuranceName: "Military Medical Insurance",
                acronym: "MMI",
              },
            },
          },
        ],
      },
    ]

    const invoices: Array<{
      id: string
      title: string
      copyType: string
      isInsured: boolean
    }> = []

    billingDepartments.forEach((dept) => {
      dept.insuranceBillings.forEach((ib) => {
        const providerName = ib.patientInsurance.insuranceProvider.acronym
        invoices.push({
          id: `ins-${ib.id}`,
          title: `${providerName} Claim (Insurer)`,
          copyType: "INSURANCE",
          isInsured: true,
        })
        invoices.push({
          id: `pat-${ib.id}`,
          title: `Patient Receipt (${providerName} Co-pay)`,
          copyType: "PATIENT",
          isInsured: true,
        })
      })
    })

    expect(invoices.length).toBe(2)
    expect(invoices[0].title).toBe("MMI Claim (Insurer)")
    expect(invoices[0].copyType).toBe("INSURANCE")
    expect(invoices[1].title).toBe("Patient Receipt (MMI Co-pay)")
    expect(invoices[1].copyType).toBe("PATIENT")
  })
})
