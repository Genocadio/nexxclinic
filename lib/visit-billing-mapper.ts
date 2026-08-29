import type {
  PatientInsurance,
  ProductInsuranceCoverage,
  Visit,
  VisitBilling,
  VisitDepartment,
} from "@/lib/api-types";
import {
  getVisitBillingTotals,
  isVisitDepartmentProductBilled,
} from "@/lib/visit-billing-utils";
import {
  buildProductCoverageMaps,
  getItemInsuranceSplit,
  resolveBillingUnitPrice,
  resolvePatientSharePercentage,
  type BillingData,
  type BillingItem,
} from "@/lib/billing-utils";
import { fromCents, toCents } from "@/lib/money";
import { getBasePatientSharePercentage } from "@/lib/api-types";
import { flattenVisitDepartments } from "@/lib/visit-product-utils";

export function mapVisitProductStatusToPaymentStatus(
  status?: string,
  itemId?: string,
  existingVisitBilling?: VisitBilling | null,
  editMode?: boolean,
): BillingItem["paymentStatus"] {
  // In edit mode every item is treated as pending regardless of backend status.
  if (editMode) {
    if (status === "EXEMPTED" || status === "PATIENT_SHARE_EXEMPTED")
      return "exempted";
    return "pending";
  }
  if (status === "BILLED") return "paid";
  if (
    existingVisitBilling &&
    itemId &&
    isVisitDepartmentProductBilled(existingVisitBilling, itemId)
  ) {
    return "paid";
  }
  if (status === "EXEMPTED" || status === "PATIENT_SHARE_EXEMPTED")
    return "exempted";
  return "pending";
}

function mapProductCoverages(coverages?: ProductInsuranceCoverage[]) {
  return buildProductCoverageMaps(
    (coverages || []).map((coverage) => ({
      insuranceProvider: coverage.insuranceProvider,
      cost: coverage.cost,
      covered: coverage.covered,
    })),
  );
}

function resolveProductBasePrice(product: {
  clinicPrice?: number | null;
  privateRhicPrice?: number | null;
}) {
  return Number(product.clinicPrice ?? product.privateRhicPrice ?? 0);
}

// Re-export the shared utility so existing imports keep working.
import { isInsuranceActive } from "@/lib/insurance-utils";
export { isInsuranceActive };


import type { Worker } from "@/lib/api-types";

function workerDisplayName(worker?: Worker | null) {
  if (!worker) return "Staff";
  return (
    worker.name ||
    [worker.firstName, worker.lastName].filter(Boolean).join(" ") ||
    "Staff"
  );
}

export function mapVisitToBillingData(
  visitData: Visit,
  options?: { existingVisitBilling?: VisitBilling | null; editMode?: boolean },
): BillingData {
  const patient = visitData.patient;
  const linkedInsurances = visitData.linkedInsurances || [];
  // Only consider ACTIVE insurances for auto-selection — expired or deactivated
  // policies would be rejected by the backend's resolveAppliedInsurance check.
  const activeLinkedInsurances = linkedInsurances.filter(isInsuranceActive);

  const items: BillingItem[] = [];

  const mapDepartmentTreeItems = (
    department: VisitDepartment,
    parentContext?: {
      visitDepartmentId?: string;
      departmentId?: string;
      name: string;
      completedAt?: string | null;
      status?: string;
      encounterType?: string;
    },
    childHierarchy: string[] = [],
  ) => {
    const currentContext = parentContext || {
      visitDepartmentId: department.id,
      departmentId: department.department?.id,
      name: department.department?.name || "Department",
      completedAt: department.completedAt,
      status: department.status,
      encounterType: department.encounterType || undefined,
    };

    const childDepartmentName =
      childHierarchy.length > 0 ? childHierarchy.join(" > ") : undefined;

    for (const line of department.products || []) {
      const product = line.product;
      // The backend no longer returns a price on the visit product line — the
      // frontend resolves the display price from the product catalog.
      const basePrice = resolveProductBasePrice(product);
      const { costs, meta } = mapProductCoverages(product.insuranceCoverages);
      // Default to the FIRST ACTIVE linked visit insurance that actually
      // covers the product. Expired / deactivated insurances are excluded so
      // the backend's resolveAppliedInsurance check never rejects them.
      const coveringLinkedInsurance = activeLinkedInsurances.find((ins) => {
        const providerId = String(ins?.insuranceProvider?.id ?? "");
        if (!providerId) return false;
        const coverage = meta[providerId];
        const cost = costs[providerId];
        return coverage?.covered && Number.isFinite(cost) && cost > 0;
      });
      const defaultProviderId = coveringLinkedInsurance
        ? String(coveringLinkedInsurance.insuranceProvider.id)
        : undefined;
      const defaultVisitInsuranceId = coveringLinkedInsurance
        ? String(coveringLinkedInsurance.id)
        : undefined;
      const { price, notCovered } = resolveBillingUnitPrice(
        basePrice,
        costs,
        meta,
        defaultProviderId,
      );

      items.push({
        id: line.id,
        productId: String(product.id || ""),
        source: line.source ?? null,
        name: product.name || "Product",
        quantity: line.quantity || 1,
        price,
        basePrice,
        insuranceCoverageCosts: costs,
        insuranceCoverageMeta: meta,
        insuranceNotCovered: defaultVisitInsuranceId ? notCovered : false,
        type: "product",
        visitDepartmentId: department.id,
        rootVisitDepartmentId: parentContext
          ? parentContext.visitDepartmentId
          : department.id,
        departmentId: currentContext.departmentId,
        departmentName: currentContext.name,
        childDepartmentName,
        encounterType: currentContext.encounterType,
        departmentCompletedTime: currentContext.completedAt || undefined,
        departmentStatus: currentContext.status,
        paymentStatus: mapVisitProductStatusToPaymentStatus(
          line.status,
          line.id,
          options?.existingVisitBilling,
          options?.editMode,
        ),
        exempted:
          line.status === "EXEMPTED" ||
          line.status === "PATIENT_SHARE_EXEMPTED",
        exemptionType:
          line.status === "PATIENT_SHARE_EXEMPTED"
            ? "patient-share"
            : line.status === "EXEMPTED"
              ? "full"
              : "none",
        selectedInsuranceId: defaultVisitInsuranceId,
        processorId: line.processor ? String(line.processor.id) : undefined,
        // Only surface processor name when the department had 2+ processors
        // (user explicitly chose). A single-processor department auto-assigns
        // silently — no need to clutter the UI.
        processorName: line.processor && (department.processors || []).length > 1 ? (
          [line.processor.firstName, line.processor.lastName].filter(Boolean).join(" ") || undefined
        ) : undefined,
        doneBy: {
          name: workerDisplayName(
            line.addedBy || line.billedBy || line.processor,
          ),
          title: "",
        },
      });
    }

    for (const childDepartment of department.childVisitDepartments || []) {
      mapDepartmentTreeItems(childDepartment, currentContext, [
        ...childHierarchy,
        childDepartment.department?.name || "Department",
      ]);
    }
  };

  for (const dept of visitData.departments || []) {
    mapDepartmentTreeItems(dept);
  }

  const age = patient?.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : 0;

  let patientContributionCents = 0;
  items.forEach((item) => {
    const selectedInsurance = linkedInsurances.find(
      (ins) => String(ins.id) === item.selectedInsuranceId,
    );
    const coveragePct =
      (selectedInsurance?.insuranceProvider ? getBasePatientSharePercentage(selectedInsurance.insuranceProvider) : 0);
    const { patientAmount, skip } = getItemInsuranceSplit(item, coveragePct);
    if (skip) return;
    patientContributionCents += toCents(patientAmount);
  });
  const patientContribution = fromCents(patientContributionCents);

  const billingTotals = options?.existingVisitBilling
    ? getVisitBillingTotals(options.existingVisitBilling)
    : null;

  return {
    visitId: visitData.id,
    patientId: patient?.id || "",
    patientName:
      `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim(),
    patientAge: age,
    patientId_Number: patient?.nationalIdNumber || "",
    gender: patient?.gender || "",
    visitDate: visitData.visitDate,
    currency: "RWF",
    insurances: linkedInsurances.map((ins) => ({
      id: ins.id ? String(ins.id) : undefined,
      name: ins.insuranceProvider.insuranceName,
      acronym: ins.insuranceProvider.acronym || "",
      coveragePercentage: getBasePatientSharePercentage(ins.insuranceProvider),
    })),
    items,
    paymentMethod: "MOBILE_MONEY",
    // Default amount paid to existing paid amount for carried-forward versions
    // (incremental billing), or the patient contribution for first-time billing.
    // In EDIT mode the edit is a fully independent new snapshot — it does NOT
    // carry forward previously-collected money. Start at 0; the user enters what
    // is actually collected for the corrected bill in the confirm sheet.
    amountPaid: options?.editMode
      ? 0
      : Number(billingTotals?.paidAmount ?? fromCents(patientContributionCents)),
    notes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mapPatientInsurancesForBilling(insurances: PatientInsurance[]) {
  return insurances.map((ins) => ({
    id: String(ins.id),
    providerId: String(ins.insuranceProvider.id),
    name: ins.insuranceProvider.insuranceName,
    acronym: ins.insuranceProvider.acronym || "",
    coveragePercentage: getBasePatientSharePercentage(ins.insuranceProvider),
    patientSharePercentage: ins.patientSharePercentage ?? null,
    coverages: ins.insuranceProvider.coverages.map((c) => ({
      coverageId: String(c.id),
      departmentId: c.departmentId || null,
      departmentName: c.departmentName || null,
      encounterType: c.encounterType || null,
      patientSharePercentage: Number(c.patientSharePercentage ?? 0),
    })),
  }));
}

export function getCoveragePercentageForBillingItem(
  item: BillingItem,
  activeVisitInsurances: PatientInsurance[],
): number {
  if (!item.selectedInsuranceId) return 0;
  const selected = activeVisitInsurances.find(
    (ins) => String(ins.id) === item.selectedInsuranceId,
  );
  if (!selected?.insuranceProvider) return 0;

  // Delegate to the single canonical resolver (mirrors the backend exactly —
  // override gating, clamping and rule ordering all live in billing-utils).
  return resolvePatientSharePercentage({
    departmentId: item.departmentId ?? null,
    encounterType: item.encounterType ?? null,
    selectedCoverageId: item.selectedCoverageId ?? null,
    patientSharePercentage: selected.patientSharePercentage ?? null,
    coverages: selected.insuranceProvider.coverages.map((c) => ({
      coverageId: String(c.id),
      departmentId: c.departmentId || null,
      departmentName: c.departmentName || null,
      encounterType: c.encounterType || null,
      patientSharePercentage: Number(c.patientSharePercentage ?? 0),
    })),
  });
}

export function flattenVisitDepartmentsForBilling(
  departments: VisitDepartment[] = [],
) {
  return flattenVisitDepartments(departments);
}
