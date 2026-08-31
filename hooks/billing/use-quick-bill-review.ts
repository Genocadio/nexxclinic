"use client";

import { useState, useCallback, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_VISIT_QUERY } from "@/hooks/queries";
import { mapGqlVisit } from "@/lib/gql-mappers";
import type { Visit, PatientInsurance } from "@/lib/api-types";
import {
  computeBillingTotals,
  type BillingData,
  type BillingItem,
  type BillingTotals,
  type CoverageTier,
} from "@/lib/billing-utils";
import {
  mapVisitToBillingData,
  getCoveragePercentageForBillingItem,
} from "@/lib/visit-billing-mapper";
import { buildCreateBillInput } from "@/lib/billing-input-builders";
import type {
  CreateBillInput,
  BillingPaymentMethod,
} from "@/hooks/billing/hooks";
import { useCreateBill } from "@/hooks/billing/hooks";
import { useUpdateVisitDepartmentStatus } from "@/hooks/auth-hooks";
import { isInsuranceActive } from "@/lib/insurance-utils";

/**
 * Quick-bill review flow for the dashboard. Given a visitId it lazily fetches
 * the full visit, maps it to billing data (auto-applying the single linked
 * insurance, or private when none), and submits the normal billVisit mutation
 * with the user's chosen payment method, amount paid and note. Only shown for
 * visits the backend has flagged quickBillEligible (0 insurances, or 1 that
 * supports every product).
 */
export function useQuickBillReview(options?: {
  onCompleted?: () => void;
}) {
  const [visit, setVisit] = useState<Visit | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [fetchVisit] = useLazyQuery(GET_VISIT_QUERY);
  const { createBill, loading: creatingBill } = useCreateBill();
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus();

  // ── Derived (from the fetched full visit) ─────────────────────────────
  const activeVisitInsurances = useMemo<PatientInsurance[]>(() => {
    return (visit?.linkedInsurances || []).filter(isInsuranceActive);
  }, [visit]);

  const unbilledItems = useMemo<BillingItem[]>(() => {
    return (billingData?.items || []).filter(
      (item) => item.paymentStatus !== "paid",
    );
  }, [billingData]);

  const coverageForItem = useCallback(
    (item: BillingItem) =>
      getCoveragePercentageForBillingItem(item, activeVisitInsurances),
    [activeVisitInsurances],
  );

  const totals = useMemo<BillingTotals>(() => {
    if (!billingData) return { subtotal: 0, insuranceCoverage: 0, patientResponsibility: 0, totalAmount: 0 };
    return computeBillingTotals(unbilledItems, coverageForItem);
  }, [billingData, unbilledItems, coverageForItem]);

  const insuranceOptions = useMemo(
    () =>
      activeVisitInsurances.map((ins) => ({
        id: String(ins.id),
        providerId: String(ins.insuranceProvider.id),
        coverages: ins.insuranceProvider.coverages.map((c): CoverageTier => ({
          coverageId: String(c.id),
          departmentId: c.departmentId || null,
          departmentName: c.departmentName || null,
          encounterType: c.encounterType || null,
          patientSharePercentage: Number(c.patientSharePercentage ?? 0),
        })),
      })),
    [activeVisitInsurances],
  );

  // ── Review state ──────────────────────────────────────────────────────
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] =
    useState<BillingPaymentMethod>("MOBILE_MONEY");
  const [outstandingType, setOutstandingType] = useState<"loan" | "giveaway">(
    "loan",
  );
  const [outstandingReason, setOutstandingReason] = useState("");
  const [billingNote, setBillingNote] = useState("");

  const openReview = useCallback(
    async (visitId: string) => {
      setFetching(true);
      setOpen(true);
      try {
        const { data } = await fetchVisit({ variables: { id: visitId } });
        const gqlVisit = data?.visit?.data;
        if (!gqlVisit) {
          setOpen(false);
          return;
        }
        const mappedVisit = mapGqlVisit(gqlVisit);
        const mappedBilling = mapVisitToBillingData(mappedVisit);
        setVisit(mappedVisit);
        setBillingData(mappedBilling);
        const unbilled = mappedBilling.items.filter(
          (item) => item.paymentStatus !== "paid",
        );
        const ins = (mappedVisit.linkedInsurances || []).filter(
          isInsuranceActive,
        );
        const cov = (item: BillingItem) =>
          getCoveragePercentageForBillingItem(item, ins);
        const t = computeBillingTotals(unbilled, cov);
        // Default: the patient pays everything they owe (reducible).
        setAmountPaid(t.totalAmount);
        setPaymentMethod("MOBILE_MONEY");
        setOutstandingType("loan");
        setOutstandingReason("");
        setBillingNote("");
      } catch (err) {
        console.error("Quick bill review: failed to load visit:", err);
        setOpen(false);
      } finally {
        setFetching(false);
      }
    },
    [fetchVisit],
  );

  const closeReview = useCallback(() => {
    setOpen(false);
    setVisit(null);
    setBillingData(null);
  }, []);

  const confirm = useCallback(async () => {
    if (!billingData) return;
    if (unbilledItems.length === 0) return;

    const rootDeptIds = Array.from(
      new Set(
        unbilledItems
          .map((item) =>
            String(item.rootVisitDepartmentId || item.visitDepartmentId || ""),
          )
          .filter(Boolean),
      ),
    );
    const notesByDepartment: Record<string, string> = {};
    for (const id of rootDeptIds) {
      notesByDepartment[id] = billingNote;
    }

    const input: CreateBillInput = buildCreateBillInput(
      { ...billingData, amountPaid, paymentMethod, outstandingType, outstandingReason },
      unbilledItems,
      coverageForItem,
      insuranceOptions,
      notesByDepartment,
    );

    try {
      const response = await createBill(input);
      if (response.status === "SUCCESS") {
        // Best-effort: complete any department left pending so the visit is in
        // a consistent billed state.
        try {
          const allDepts = (visit?.departments || []) as Array<{
            id: string;
            status?: string;
          }>;
          for (const dept of allDepts) {
            if (dept.status && dept.status !== "COMPLETED") {
              await updateDepartmentStatus(String(dept.id), "COMPLETED");
            }
          }
        } catch {
          // Completing departments is best-effort; billing already succeeded.
        }
        setOpen(false);
        setVisit(null);
        setBillingData(null);
        options?.onCompleted?.();
        return "SUCCESS";
      }
      return response.message || "Failed to create bill";
    } catch (err) {
      console.error("Quick bill submit error:", err);
      return "Failed to create bill. Please try again.";
    }
  }, [
    billingData,
    unbilledItems,
    billingNote,
    amountPaid,
    paymentMethod,
    outstandingType,
    outstandingReason,
    coverageForItem,
    insuranceOptions,
    createBill,
    visit,
    updateDepartmentStatus,
    options,
  ]);

  return {
    open,
    fetching,
    creatingBill,
    visit,
    billingData,
    activeVisitInsurances,
    unbilledItems,
    totals,
    amountPaid,
    paymentMethod,
    outstandingType,
    outstandingReason,
    billingNote,
    openReview,
    closeReview,
    confirm,
    setAmountPaid,
    setPaymentMethod,
    setOutstandingType,
    setOutstandingReason,
    setBillingNote,
  };
}
