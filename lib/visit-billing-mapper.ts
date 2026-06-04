import type { PatientInsurance, ProductInsuranceCoverage, Visit, VisitBilling, VisitDepartment } from "@/lib/api-types"
import {
  getVisitBillingTotals,
  isVisitDepartmentProductBilled,
} from "@/lib/visit-billing-utils"
import {
  buildProductCoverageMaps,
  getItemInsuranceSplit,
  resolveBillingUnitPrice,
  type BillingData,
  type BillingItem,
} from "@/lib/billing-utils"
import { flattenVisitDepartments } from "@/lib/visit-product-utils"

export function mapVisitProductStatusToPaymentStatus(
  status?: string,
  itemId?: string,
  existingVisitBilling?: VisitBilling | null,
): BillingItem["paymentStatus"] {
  if (status === "BILLED") return "paid"
  if (existingVisitBilling && itemId && isVisitDepartmentProductBilled(existingVisitBilling, itemId)) {
    return "paid"
  }
  if (status === "EXEMPTED") return "exempted"
  return "pending"
}

function mapProductCoverages(coverages?: ProductInsuranceCoverage[]) {
  return buildProductCoverageMaps(
    (coverages || []).map((coverage) => ({
      insuranceProvider: coverage.insuranceProvider,
      cost: coverage.cost,
      covered: coverage.covered,
    })),
  )
}

function resolveProductBasePrice(product: {
  clinicPrice?: number | null
  privateRhicPrice?: number | null
}) {
  return Number(product.clinicPrice ?? product.privateRhicPrice ?? 0)
}

import type { Worker } from "@/lib/api-types"

function workerDisplayName(worker?: Worker | null) {
  if (!worker) return "Staff"
  return worker.name || [worker.firstName, worker.lastName].filter(Boolean).join(" ") || "Staff"
}

export function mapVisitToBillingData(
  visitData: Visit,
  options?: { existingVisitBilling?: VisitBilling | null },
): BillingData {
  const patient = visitData.patient
  const linkedInsurances = visitData.linkedInsurances || []
  const defaultVisitInsurance = linkedInsurances[0]
  const defaultVisitInsuranceId = defaultVisitInsurance?.id
    ? String(defaultVisitInsurance.id)
    : undefined
  const defaultProviderId = defaultVisitInsurance?.insuranceProvider?.id
    ? String(defaultVisitInsurance.insuranceProvider.id)
    : undefined

  const items: BillingItem[] = []

  const mapDepartmentTreeItems = (
    department: VisitDepartment,
    parentContext?: {
      visitDepartmentId?: string
      departmentId?: string
      name: string
      completedAt?: string | null
      status?: string
    },
    childHierarchy: string[] = [],
  ) => {
    const currentContext = parentContext || {
      visitDepartmentId: department.id,
      departmentId: department.department?.id,
      name: department.department?.name || "Department",
      completedAt: department.completedAt,
      status: department.status,
    }

    const childDepartmentName =
      childHierarchy.length > 0 ? childHierarchy.join(" > ") : undefined

    for (const line of department.products || []) {
      const product = line.product
      const basePrice = line.price > 0 ? line.price : resolveProductBasePrice(product)
      const { costs, meta } = mapProductCoverages(product.insuranceCoverages)
      const { price, notCovered } = resolveBillingUnitPrice(
        basePrice,
        costs,
        meta,
        defaultProviderId,
      )

      items.push({
        id: line.id,
        name: product.name || "Product",
        quantity: line.quantity || 1,
        price,
        basePrice,
        insuranceCoverageCosts: costs,
        insuranceCoverageMeta: meta,
        insuranceNotCovered: defaultVisitInsuranceId ? notCovered : false,
        type: "product",
        visitDepartmentId: department.id,
        rootVisitDepartmentId: parentContext ? parentContext.visitDepartmentId : department.id,
        departmentId: currentContext.departmentId,
        departmentName: currentContext.name,
        childDepartmentName,
        departmentCompletedTime: currentContext.completedAt || undefined,
        departmentStatus: currentContext.status,
        paymentStatus: mapVisitProductStatusToPaymentStatus(
          line.status,
          line.id,
          options?.existingVisitBilling,
        ),
        exempted: line.status === "EXEMPTED",
        exemptionType: line.status === "EXEMPTED" ? "full" : "none",
        selectedInsuranceId: defaultVisitInsuranceId,
        doneBy: {
          name: workerDisplayName(line.addedBy || line.billedBy || line.processor),
          title: "",
        },
      })
    }

    for (const childDepartment of department.childVisitDepartments || []) {
      mapDepartmentTreeItems(
        childDepartment,
        currentContext,
        [...childHierarchy, childDepartment.department?.name || "Department"],
      )
    }
  }

  for (const dept of visitData.departments || []) {
    mapDepartmentTreeItems(dept)
  }

  const age = patient?.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : 0

  const discountPercentage = 0

  const patientContribution = items.reduce((total, item) => {
    const selectedInsurance = linkedInsurances.find(
      (ins) => String(ins.id) === item.selectedInsuranceId,
    )
    const coveragePct = selectedInsurance?.insuranceProvider?.defaultCoveragePercentage ?? 0
    const { patientAmount, skip } = getItemInsuranceSplit(item, coveragePct)
    if (skip) return total
    return total + patientAmount
  }, 0)

  const patientContributionAfterDiscount = Math.max(
    0,
    patientContribution - (patientContribution * discountPercentage) / 100,
  )

  const billingTotals = options?.existingVisitBilling
    ? getVisitBillingTotals(options.existingVisitBilling)
    : null

  return {
    visitId: visitData.id,
    patientId: patient?.id || "",
    patientName: `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim(),
    patientAge: age,
    patientId_Number: patient?.nationalIdNumber || "",
    gender: patient?.gender || "",
    visitDate: visitData.visitDate,
    currency: "RWF",
    insurances: linkedInsurances.map((ins) => ({
      id: ins.id ? String(ins.id) : undefined,
      name: ins.insuranceProvider.insuranceName,
      acronym: ins.insuranceProvider.acronym || "",
      coveragePercentage: ins.insuranceProvider.defaultCoveragePercentage,
    })),
    items,
    discountPercentage,
    paymentMethod: "MOBILE_MONEY",
    amountPaid: Number(billingTotals?.paidAmount ?? patientContributionAfterDiscount),
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function mapPatientInsurancesForBilling(insurances: PatientInsurance[]) {
  return insurances.map((ins) => ({
    id: String(ins.id),
    providerId: String(ins.insuranceProvider.id),
    name: ins.insuranceProvider.insuranceName,
    acronym: ins.insuranceProvider.acronym || "",
    coveragePercentage: ins.insuranceProvider.defaultCoveragePercentage,
  }))
}

export function getCoveragePercentageForBillingItem(
  item: BillingItem,
  activeVisitInsurances: PatientInsurance[],
): number {
  const selected = activeVisitInsurances.find(
    (ins) => String(ins.id) === item.selectedInsuranceId,
  )
  return selected?.insuranceProvider.defaultCoveragePercentage ?? 0
}

export function flattenVisitDepartmentsForBilling(departments: VisitDepartment[] = []) {
  return flattenVisitDepartments(departments)
}
