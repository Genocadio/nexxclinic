import {
  computeDepartmentBillAllocations,
  type BillingData,
  type BillingItem,
} from "@/lib/billing-utils";
import { roundMoney } from "@/lib/money";
import type {
  CreateBillInput,
  EditBillInput,
} from "@/hooks/billing/hooks";

/**
 * Pure builders for the create/edit bill mutation inputs. Extracted from
 * BillingPageContent.handleGenerateBill so the page component stays lean and
 * the diff logic is unit-testable.
 */

/**
 * Resolve the backend ExemptionType enum value for a billing item.
 * Maps the frontend 'none' | 'patient-share' | 'full' representation to
 * the GraphQL enum NONE | PATIENT_SHARE | FULL.
 */
function resolveExemptionType(
  item: BillingItem,
): "NONE" | "PATIENT_SHARE" | "FULL" {
  const effectiveType = item.exemptionType || (item.exempted ? "full" : "none");
  switch (effectiveType) {
    case "patient-share":
      return "PATIENT_SHARE";
    case "full":
      return "FULL";
    default:
      return "NONE";
  }
}

/**
 * Builds the BillVisitInput for first-time billing (no existing bill).
 * Bills every pending item, allocating the paid amount across departments.
 */
export function buildCreateBillInput(
  billingData: BillingData,
  unbilledItems: BillingItem[],
  coverageForItem: (item: BillingItem) => number,
): CreateBillInput {
  const billableByDepartment = new Map<
    string,
    {
      visitDepartmentId: string;
      products: CreateBillInput["departments"][number]["products"];
    }
  >();

  unbilledItems.forEach((item) => {
    const productOwnerVisitDepartmentId = String(item.visitDepartmentId || "");
    const rootVisitDepartmentId = String(
      item.rootVisitDepartmentId || productOwnerVisitDepartmentId,
    );
    if (!rootVisitDepartmentId || !productOwnerVisitDepartmentId) return;
    if (!billableByDepartment.has(rootVisitDepartmentId)) {
      billableByDepartment.set(rootVisitDepartmentId, {
        visitDepartmentId: rootVisitDepartmentId,
        products: [],
      });
    }
    // Only bill as INSURANCE when an insurance is actually selected AND the
    // product is covered by it — a non-covering insurance would be rejected by
    // the backend ("Selected patientInsuranceId is invalid…").
    const coveredInsuranceId =
      item.selectedInsuranceId && !item.insuranceNotCovered
        ? item.selectedInsuranceId
        : undefined;
    billableByDepartment.get(rootVisitDepartmentId)!.products.push({
      visitDepartmentProductId: item.id,
      parentVisitDepartmentId: productOwnerVisitDepartmentId,
      // The backend derives every line's price from the catalog/coverage — the
      // frontend only declares HOW the line is covered.
      coverageType: coveredInsuranceId ? "INSURANCE" : "PRIVATE",
      patientInsuranceId: coveredInsuranceId,
      quantity: item.quantity,
      exemptionType: resolveExemptionType(item),
    });
  });

  const paymentMethod = billingData.paymentMethod || "MOBILE_MONEY";
  const note = billingData.notes?.trim() || undefined;
  const allocations = computeDepartmentBillAllocations(
    unbilledItems,
    billingData.amountPaid || 0,
    coverageForItem,
  );
  const paymentByDept = new Map(
    allocations.map((allocation) => [
      allocation.visitDepartmentId,
      allocation.allocatedPayment,
    ]),
  );

  return {
    visitId: billingData.visitId,
    departments: Array.from(billableByDepartment.values()).map(
      (department) => {
        const allocated = Number(
          paymentByDept.get(department.visitDepartmentId) || 0,
        );
        return {
          visitDepartmentId: department.visitDepartmentId,
          products: department.products,
          payments:
            allocated > 0
              ? [
                  {
                    amount: roundMoney(allocated),
                    paymentMethod,
                  },
                ]
              : undefined,
          note,
        };
      },
    ),
  };
}

/**
 * Builds the EditBillVisitInput by diffing the current items against the
 * snapshot taken when edit mode was entered (added / removed / updated
 * products) plus the full billProducts list for re-billing.
 */
export function buildEditBillInput(
  billingData: BillingData,
  snapshotItems: BillingItem[],
  coverageForItem: (item: BillingItem) => number,
): EditBillInput {
  const currentItems = billingData.items;
  const snapshotIds = new Set(snapshotItems.map((i) => i.id));
  const currentIds = new Set(currentItems.map((i) => i.id));

  type DeptEntry = {
    visitDepartmentId: string;
    addedProducts: { productId: string; quantity: number }[];
    removedProductIds: string[];
    updatedProducts: { productId: string; quantity?: number }[];
    billProducts: EditBillInput["departments"][number]["billProducts"];
  };

  const departmentMap = new Map<string, DeptEntry>();

  const getOrCreateDept = (deptId: string): DeptEntry => {
    if (!departmentMap.has(deptId)) {
      departmentMap.set(deptId, {
        visitDepartmentId: deptId,
        addedProducts: [],
        removedProductIds: [],
        updatedProducts: [],
        billProducts: [],
      });
    }
    return departmentMap.get(deptId)!;
  };

  // Process current items: populate billProducts + addedProducts/updatedProducts diff
  currentItems.forEach((item) => {
    const deptId = String(
      item.rootVisitDepartmentId || item.visitDepartmentId || "",
    );
    if (!deptId || !item.productId) return;

    const dept = getOrCreateDept(deptId);

    // Only bill as INSURANCE when an insurance is actually selected AND the
    // product is covered by it — a non-covering insurance would be rejected by
    // the backend ("Selected patientInsuranceId is invalid…").
    const coveredInsuranceId =
      item.selectedInsuranceId && !item.insuranceNotCovered
        ? item.selectedInsuranceId
        : undefined;
    dept.billProducts.push({
      productId: item.productId,
      quantity: item.quantity,
      // The backend derives every line's price from the catalog/coverage — the
      // frontend only declares HOW the line is covered.
      coverageType: coveredInsuranceId ? "INSURANCE" : "PRIVATE",
      patientInsuranceId: coveredInsuranceId,
      exemptionType: resolveExemptionType(item),
    });

    if (!snapshotIds.has(item.id)) {
      // Added during this edit session
      dept.addedProducts.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    } else {
      // Present in both: check for quantity change
      const orig = snapshotItems.find((s) => s.id === item.id);
      if (orig && orig.quantity !== item.quantity) {
        dept.updatedProducts.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }
  });

  // Process removed items (in snapshot but no longer in current)
  snapshotItems
    .filter((i) => !currentIds.has(i.id))
    .forEach((item) => {
      const deptId = String(
        item.rootVisitDepartmentId || item.visitDepartmentId || "",
      );
      if (!deptId) return;
      if (item.productId) {
        getOrCreateDept(deptId).removedProductIds.push(item.productId);
      }
    });

  const editAllocations = computeDepartmentBillAllocations(
    currentItems,
    billingData.amountPaid || 0,
    coverageForItem,
  );
  const paymentByDept = new Map(
    editAllocations.map((allocation) => [
      allocation.visitDepartmentId,
      allocation.allocatedPayment,
    ]),
  );
  const editPaymentMethod = billingData.paymentMethod || "MOBILE_MONEY";

  return {
    visitId: billingData.visitId,
    notes: billingData.notes?.trim() || undefined,
    departments: Array.from(departmentMap.values()).map((dept) => {
      const allocated = Number(
        paymentByDept.get(dept.visitDepartmentId) || 0,
      );
      return {
        visitDepartmentId: dept.visitDepartmentId,
        addedProducts:
          dept.addedProducts.length > 0 ? dept.addedProducts : undefined,
        removedProductIds:
          dept.removedProductIds.length > 0
            ? dept.removedProductIds
            : undefined,
        updatedProducts:
          dept.updatedProducts.length > 0 ? dept.updatedProducts : undefined,
        billProducts: dept.billProducts,
        payments:
          allocated > 0
            ? [
                {
                  amount: roundMoney(allocated),
                  paymentMethod: editPaymentMethod,
                },
              ]
            : undefined,
      };
    }),
  };
}
