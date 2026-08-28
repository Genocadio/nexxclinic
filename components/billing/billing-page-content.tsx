"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  BillingItem,
  computeBillingTotals,
  computeDepartmentBillAllocations,
} from "@/lib/billing-utils";
import { toCents } from "@/lib/money";
import {
  flattenVisitDepartmentsForBilling,
  getCoveragePercentageForBillingItem,
  isInsuranceActive,
  mapPatientInsurancesForBilling,
  mapVisitToBillingData,
} from "@/lib/visit-billing-mapper";
import {
  visitHasBillableProducts,
  visitHasUnbilledProducts,
  visitProductsFullySettled,
} from "@/lib/visit-product-utils";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useVisit,
  useCreateBill,
  useEditBill,
  useGetVisitBilling,
  useGenerateInvoice,
  useCompleteVisit,
  useDepartments,
  useChangeVisitDepartmentProfile,
  useStartBillEditing,
  useCompleteBillEditing,
  useCancelBillEditing,
} from "@/hooks/auth-hooks";
import type { Visit } from "@/lib/api-types";
import { getVisitBillingTotals } from "@/lib/visit-billing-utils";
import { formatRWF } from "@/lib/utils";
import { useUpdateVisitDepartmentStatus } from "@/hooks/auth-hooks";
import {
  useAddProductToVisitDepartment,
  useLinkVisitInsurances,
  useUnlinkVisitInsurances,
  useVisitDepartmentNotes,
  useAddVisitDepartmentNote,
  useMarkVisitDepartmentNotesViewed,
  useRemoveVisitDepartment,
} from "@/hooks/visits/hooks";
import { useBillingPageState } from "@/hooks/billing/use-billing-page-state";
import { useBillingPageActions } from "@/hooks/billing/use-billing-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EMPTY_TOTALS } from "@/hooks/billing/use-billing-totals";
import { Spinner } from "@/components/ui/spinner";
import VisitNotesFloating from "@/components/visit-notes-floating";
import { BillingPatientBar } from "@/components/billing/billing-patient-bar";
import { BillingStickySummary } from "@/components/billing/billing-sticky-summary";
import { BillingConfirmSheet } from "@/components/billing/billing-confirm-sheet";
import { BillingPreviewSheet } from "@/components/billing/billing-preview-sheet";
import { BillingItemsWorkspace } from "@/components/billing/billing-items-workspace";
import { AddPatientInsuranceModal } from "@/components/patient/add-patient-insurance-modal";
import { AddVisitDepartmentProductModal } from "@/components/visit/add-visit-department-product-modal";
import { toast } from "react-toastify";

export function BillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const visitId = searchParams.get("visitId");
  const autoPrint = searchParams.get("autoprint") === "1";
  const { visit, loading, error, refetch: refetchVisit } = useVisit(visitId);
  const { createBill, loading: creatingBill } = useCreateBill();
  const { editBill, loading: editingBill } = useEditBill();
  const { generateInvoice, loading: generatingInvoice } = useGenerateInvoice();
  const { startBillEditing } = useStartBillEditing();
  const { completeBillEditing } = useCompleteBillEditing();
  const { cancelBillEditing } = useCancelBillEditing();
  const {
    visitBilling: existingVisitBilling,
    error: billingQueryError,
    refetch: refetchBill,
  } = useGetVisitBilling(visitId);
  const {
    previewOpen,
    setPreviewOpen,
    previewDepartmentId,
    setPreviewDepartmentId,
    previewStartedAt,
    setPreviewStartedAt,
    setBillJustCreated,
    showCompleteBillConfirm,
    setShowCompleteBillConfirm,
    confirmSheetMode,
    setConfirmSheetMode,
    didAutoPrint,
    setDidAutoPrint,
    activeService,
    setActiveService,
    showAddInsuranceModal,
    setShowAddInsuranceModal,
    isEditingBill,
    setIsEditingBill,
    editModeSnapshot,
    setEditModeSnapshot,
    showAddProductModal,
    setShowAddProductModal,
    addingBillingItem,
    setAddingBillingItem,
    billingRemapNonce,
    setBillingRemapNonce,
    billingData,
    setBillingData,
    activeVisitInsuranceIds,
    setActiveVisitInsuranceIds,
    updatingQuantity,
    handleItemChange,
    handleQuantityChange,
    handleItemRemove,
    handleExemptionChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    handleNotesChange,
  } = useBillingPageState();

  // Wrap handleItemChange to set the local-edits guard
  const trackLocalEdit = useCallback((item: BillingItem) => {
    hasLocalEditsRef.current = true;
    handleItemChange(item);
  }, [handleItemChange]);

  const { linkVisitInsurances, loading: linkingVisitInsurances } =
    useLinkVisitInsurances();
  const { unlinkVisitInsurances, loading: unlinkingVisitInsurances } =
    useUnlinkVisitInsurances();
  const addingVisitInsurance =
    linkingVisitInsurances || unlinkingVisitInsurances;
  const { doctor } = useAuth();
  // Feature toggle to disable Discharge actions in the UI and auto-discharge
  const ENABLE_DISCHARGE = false;
  const { addProduct } = useAddProductToVisitDepartment();
  const { updateDepartmentStatus } = useUpdateVisitDepartmentStatus();
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();
  const { completeVisit } = useCompleteVisit();
  const { departments: catalogDepartments } = useDepartments({
    skip: !visitId,
  });
  const { changeVisitDepartmentProfile } = useChangeVisitDepartmentProfile();
  const { removeVisitDepartment } = useRemoveVisitDepartment();
  // In-flight discharge — keeps the confirm dialog open with a spinner so the
  // completeVisit/department-status loop can't be triggered twice.
  const [discharging, setDischarging] = useState(false);
  // Tracks the amount paid before entering edit mode, used to determine whether
  // the note-required flag should be set (avoids false triggers from automatic
  // amountPaid capping when items are removed/exempted).
  const [previousPaidCents, setPreviousPaidCents] = useState<number | null>(null);
  // Loading states for edit/done-editing buttons in the sticky summary bar
  const [loadingEditBilling, setLoadingEditBilling] = useState(false);
  const [loadingDoneEditing, setLoadingDoneEditing] = useState(false);
  // Ref guard: set to true as soon as the user makes any local edit in
  // billing edit mode. The remap useEffect checks this flag and NEVER
  // overwrites billingData when it is true — regardless of Apollo
  // cache-and-network refetches or structural-change checks.
  const hasLocalEditsRef = useRef(false);

  const existingBillingTotals = useMemo(
    () =>
      existingVisitBilling ? getVisitBillingTotals(existingVisitBilling) : null,
    [existingVisitBilling],
  );

  // In edit mode the UI behaves as if no bill exists yet — items become
  // unbilled/selectable and totals recalculate from scratch. The real
  // existingVisitBilling is still passed to the mapper so edit mode defaults
  // amountPaid to the already-paid amount — without it a reduced-payment edit
  // (exemption, removal) submits no payments, the old larger amount is carried
  // forward, and the backend rejects the corrected bill as smaller than what
  // was already paid.

  // Determine if user can edit billing items based on role
  // Only FINANCE role can edit items. CASHIER users cannot delete or adjust quantities
  const canEditBillingItems = useMemo(() => {
    if (!doctor?.roles) return true; // Default to true if no roles defined
    const roles = (doctor.roles as string[]) || [];
    const hasFinanceRole = roles.includes("FINANCE");

    // Only FINANCE role can edit items, CASHIER cannot
    return hasFinanceRole;
  }, [doctor?.roles]);
  useEffect(() => {
    if (!visit?.id) return;
    const newIds = (visit.linkedInsurances || []).map((insurance) =>
      String(insurance.id),
    );
    if (
      newIds.length !== activeVisitInsuranceIds.length ||
      newIds.some((id, index) => id !== activeVisitInsuranceIds[index])
    ) {
      setActiveVisitInsuranceIds(newIds);
    }
  }, [visit?.id, visit?.linkedInsurances, activeVisitInsuranceIds]);

  const activeVisitInsurances = useMemo(() => {
    const activeIds = new Set(activeVisitInsuranceIds);
    return (visit?.linkedInsurances || []).filter(
      (insurance) =>
        activeIds.has(String(insurance.id)) && isInsuranceActive(insurance),
    );
  }, [visit?.linkedInsurances, activeVisitInsuranceIds]);

  useEffect(() => {
    if (!visit) return;
    // In edit mode pass editMode:true so the mapper forces all items to
    // "pending" regardless of their backend BILLED status, giving a clean
    // slate identical to first-time billing.
    const mapped = mapVisitToBillingData(visit, {
      existingVisitBilling,
      editMode: isEditMode,
    });

    // In edit mode, only update billingData for STRUCTURAL changes (new or
    // removed items). Never overwrite user edits to existing items (insurance,
    // exemption, quantity, coverage tier, etc.) — those are tracked by the
    // serialized snapshot and submitted via editBillVisit.
    //
    // hasLocalEditsRef: when the user has made ANY local change (exemption,
    // insurance, quantity, etc.) we absolutely refuse to overwrite billingData.
    // This prevents Apollo cache-and-network refetches from reverting local
    // edits back to server-sourced data.
    if ((isEditMode || hasLocalEditsRef.current) && billingData) {
      if (hasLocalEditsRef.current) {
        // User has made local edits — never overwrite, even for structural
        // changes. The user's edits are authoritative until they complete or
        // cancel the edit session.
        return;
      }
      const currentIds = new Set(billingData.items.map((i) => i.id));
      const mappedIds = new Set(mapped.items.map((i) => i.id));
      const hasStructuralChange =
        billingData.items.length !== mapped.items.length ||
        [...currentIds].some((id) => !mappedIds.has(id)) ||
        [...mappedIds].some((id) => !currentIds.has(id));
      if (hasStructuralChange) {
        setBillingData(mapped);
      }
      // Skip non-structural updates in edit mode to preserve local edits.
      return;
    }

    const shouldUpdateBillingData =
      !billingData ||
      billingData.visitId !== mapped.visitId ||
      billingData.amountPaid !== mapped.amountPaid ||
      billingData.items.length !== mapped.items.length ||
      billingData.items.some(
        (item, index) =>
          item.id !== mapped.items[index]?.id ||
          item.paymentStatus !== mapped.items[index]?.paymentStatus,
      );

    if (shouldUpdateBillingData) {
      setBillingData(mapped);
    }
  }, [
    visit?.id,
    visit?.status,
    isEditingBill,
    existingVisitBilling?.id,
    existingBillingTotals?.paidAmount,
    existingBillingTotals?.totalAmount,
    existingBillingTotals?.outstandingAmount,
    billingRemapNonce,
  ]);

  useEffect(() => {
    if (billingData?.items?.length) {
      const firstDept = billingData.items[0].departmentName || "General";
      setActiveService((prev) => prev || firstDept);
    }
  }, [billingData]);

  // Calculate totals for a given items subset (selected, unbilled lines only).
  // Delegates to the shared computeBillingTotals so every screen shows the
  // same numbers.
  const calculateTotalsForItems = useCallback(
    (items: BillingItem[]) =>
      computeBillingTotals(
        items,
        (item) =>
          getCoveragePercentageForBillingItem(item, activeVisitInsurances),
      ),
    [activeVisitInsurances],
  );

  const visitInsuranceOptions = useMemo(
    () => mapPatientInsurancesForBilling(activeVisitInsurances),
    [activeVisitInsurances],
  );

  const patientInsurances = useMemo(
    () => visit?.patient.patientInsurances || [],
    [visit?.patient.patientInsurances],
  );
  const visitInsuranceIds = useMemo(
    () => new Set(activeVisitInsuranceIds),
    [activeVisitInsuranceIds],
  );

  const itemsToDisplay = useMemo((): BillingItem[] => {
    if (!billingData || !activeService) return [];
    return billingData.items.filter(
      (item) => (item.departmentName || "General") === activeService,
    );
  }, [billingData, activeService]);

  const billedInsuranceIds = useMemo(() => {
    if (!billingData) return new Set<string>();
    const ids = new Set<string>();
    for (const item of billingData.items) {
      if (item.selectedInsuranceId && item.paymentStatus === "paid") {
        ids.add(item.selectedInsuranceId);
      }
    }
    return ids;
  }, [billingData]);

  const billedDepartmentNames = useMemo(() => {
    if (!billingData) return new Set<string>();
    const deptMap = new Map<string, { total: number; paid: number }>();
    for (const item of billingData.items) {
      const dept = item.departmentName || "General";
      const entry = deptMap.get(dept) || { total: 0, paid: 0 };
      entry.total++;
      if (item.paymentStatus === "paid") entry.paid++;
      deptMap.set(dept, entry);
    }
    const billed = new Set<string>();
    for (const [dept, { total, paid }] of deptMap) {
      if (total > 0 && total === paid) billed.add(dept);
    }
    return billed;
  }, [billingData]);

  // Always bill all pending items — no partial selection.
  const selectedItems = useMemo(
    () =>
      billingData
        ? billingData.items.filter(
            (it) =>
              it.paymentStatus !== "paid" &&
              (it.departmentName || "General") === activeService,
          )
        : [],
    [billingData, activeService],
  );
  const hasRemainingToBill = Boolean(
    billingData?.items.some((item) => item.paymentStatus !== "paid"),
  );
  const activeDeptHasUnbilled = selectedItems.some(
    (item) => item.paymentStatus !== "paid",
  );
  const hasFinanceRole = useMemo(() => {
    if (!doctor?.roles) return false;
    return ((doctor.roles as string[]) || []).includes("FINANCE");
  }, [doctor?.roles]);
  const hasCashierRole = useMemo(() => {
    if (!doctor?.roles) return false;
    return ((doctor.roles as string[]) || []).includes("CASHIER");
  }, [doctor?.roles]);
  const isAlreadyBilled = Boolean(existingVisitBilling);
  // Derive edit mode from the backend visit status (BILL_EDITING) or local state.
  // Reading from the persisted status means edit mode survives page refreshes.
  const isEditMode = visit?.status === "BILL_EDITING" || Boolean(isEditingBill);
  // For UI purposes (item states, dock, etc.) treat billed visit as unbilled while in edit mode
  const effectiveIsAlreadyBilled = isAlreadyBilled && !isEditMode;

  // ── Serialized snapshot for change detection ─────────────────────────────
  // Captures each item's key editable fields as a plain JSON string per ID.
  // This is immune to React reference issues, useEffect remaps, or cache
  // refetches that create new BillingItem objects with the same values.
  const snapshotFields = useMemo(() => {
    if (!editModeSnapshot) return null;
    return new Map(
      editModeSnapshot.map((i) => [
        i.id,
        JSON.stringify({
          q: i.quantity,
          ei: i.selectedInsuranceId,
          ec: i.selectedCoverageId,
          et: i.exemptionType,
          ex: i.exempted,
          er: i.exemptionReason,
          inc: i.insuranceNotCovered,
          pr: i.processorId,
          p: i.price,
        }),
      ]),
    );
  }, [editModeSnapshot]);

  const snapshotIds = useMemo(() => {
    if (!editModeSnapshot) return null;
    return new Set(editModeSnapshot.map((i) => i.id));
  }, [editModeSnapshot]);

  /** Serialize a single item's key fields to match snapshot format. */
  const serializeItem = useCallback((item: BillingItem) =>
    JSON.stringify({
      q: item.quantity,
      ei: item.selectedInsuranceId,
      ec: item.selectedCoverageId,
      et: item.exemptionType,
      ex: item.exempted,
      er: item.exemptionReason,
      inc: item.insuranceNotCovered,
      pr: item.processorId,
      p: item.price,
    }), []);

  // Detect whether the user has made any actual changes in edit mode
  const hasEditChanges = useMemo(() => {
    if (!isEditMode || !snapshotFields || !snapshotIds || !billingData) return false;
    const currentItems = billingData.items;
    // Different number of items
    if (currentItems.length !== snapshotIds.size) return true;
    // Check for added or removed items
    for (const item of currentItems) {
      if (!snapshotIds.has(item.id)) return true; // added
    }
    for (const id of snapshotIds) {
      if (!currentItems.some((i) => i.id === id)) return true; // removed
    }
    // Check for changed fields on existing items
    for (const item of currentItems) {
      const snapStr = snapshotFields.get(item.id);
      if (snapStr === undefined) return true; // shouldn't happen, but safe
      if (serializeItem(item) !== snapStr) return true;
    }
    return false;
  }, [isEditMode, snapshotFields, snapshotIds, billingData, serializeItem]);

  // Per-item change map for visual diff indicators in edit mode
  const editedItemChanges = useMemo(() => {
    const map = new Map<string, "added" | "modified">();
    if (!isEditMode || !snapshotFields || !snapshotIds || !billingData) return map;
    for (const item of billingData.items) {
      if (!snapshotIds.has(item.id)) {
        map.set(item.id, "added");
      } else {
        const snapStr = snapshotFields.get(item.id);
        if (snapStr !== undefined && serializeItem(item) !== snapStr) {
          map.set(item.id, "modified");
        }
      }
    }
    return map;
  }, [isEditMode, snapshotFields, snapshotIds, billingData, serializeItem]);

  // Role rules:
  // - CASHIER: can bill (complete) but cannot edit bills/items.
  // - FINANCE: can bill and can edit.
  const canEditBilling = hasFinanceRole;
  const canBill = hasFinanceRole || hasCashierRole;

  const canViewBilledReadOnly =
    effectiveIsAlreadyBilled && (hasFinanceRole || hasCashierRole);
  const showBillingDock =
    canViewBilledReadOnly ||
    canEditBilling ||
    (!effectiveIsAlreadyBilled && hasRemainingToBill);


  // Totals always cover all pending items in the current service tab
  const displayTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    const itemsForTotals = itemsToDisplay.filter(
      (item) => item.paymentStatus !== "paid",
    );
    return calculateTotalsForItems(itemsForTotals);
  }, [billingData, itemsToDisplay, calculateTotalsForItems]);

  // Totals for the active department only (per-department incremental billing)
  const confirmTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    return calculateTotalsForItems(selectedItems);
  }, [billingData, selectedItems, calculateTotalsForItems]);

  // Edit-mode warning: compare corrected total to amount already paid
  const editModeWarning = useMemo(() => {
    if (!existingVisitBilling || !billingData) return null;
    const alreadyPaid = existingBillingTotals?.paidAmount ?? 0;
    if (alreadyPaid <= 0) return null;
    // Use ALL items (not just active dept) for the visit-level comparison
    const allUnbilledItems = billingData.items.filter(
      (item) => item.paymentStatus !== "paid",
    );
    const correctedTotal = allUnbilledItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    if (correctedTotal < alreadyPaid - 0.01) {
      const credit = alreadyPaid - correctedTotal;
      return `Corrected bill (${formatRWF(correctedTotal)}) is less than paid (${formatRWF(alreadyPaid)}). Overpayment of ${formatRWF(credit)} will be treated as credit.`;
    }
    const originalTotal = billingData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const diff = Math.abs(originalTotal - correctedTotal);
    if (diff > 0.01 && diff / (originalTotal || 1) > 0.1) {
      return `Bill total changed by ${formatRWF(diff)} (${Math.round((diff / (originalTotal || 1)) * 100)}%). Please review all changes.`;
    }
    return null;
  }, [existingVisitBilling, existingBillingTotals, billingData]);

  // Per-department payment allocation + note requirement (mirrors the backend
  // rule: note required when a department has exemptions or its payment does
  // not cover the full patient payable). In edit mode, pass the previous paid
  // amount so automatic capping does not falsely trigger a note requirement.
  const billingAllocations = useMemo(() => {
    if (!billingData) return [];
    return computeDepartmentBillAllocations(
      selectedItems,
      billingData.amountPaid || 0,
      (item) =>
        getCoveragePercentageForBillingItem(item, activeVisitInsurances),
      previousPaidCents ?? undefined,
    );
  }, [billingData, selectedItems, activeVisitInsurances, previousPaidCents]);
  const confirmNoteRequired = billingAllocations.some(
    (allocation) => allocation.noteRequired,
  );

  // Get all service names from visit departments (not just those with items)
  const allServiceNames = useMemo(
    () =>
      visit?.departments?.map((dept) => dept.department?.name || "General") ||
        [],
    [visit?.departments],
  );

  const serviceDepartmentIds = useMemo(
    () => {
      const map: Record<string, string> = {};
      for (const dept of visit?.departments || []) {
        const name = dept.department?.name || "General";
        map[name] = dept.id;
      }
      return map;
    },
    [visit?.departments],
  );

  const handleRemoveDepartment = useCallback(
    async (visitDepartmentId: string) => {
      hasLocalEditsRef.current = true;
      try {
        const result = await removeVisitDepartment(visitDepartmentId);
        if (result?.status === "SUCCESS") {
          await refetchVisit();
          setBillingRemapNonce((nonce) => nonce + 1);
          toast.success("Department removed from visit");
        } else {
          toast.error(result?.message || "Failed to remove department");
        }
      } catch (err) {
        console.error("Remove department error:", err);
        toast.error("Failed to remove department");
      }
    },
    [removeVisitDepartment, refetchVisit],
  );

  const topLevelBillingDepartments = useMemo(
    () =>
      visit?.departments || [],
    [visit?.departments],
  );

  const activeVisitDepartment = useMemo(
    () =>
      visit?.departments?.find(
        (dept) => (dept.department?.name || "General") === activeService,
      ) || null,
    [visit?.departments, activeService],
  );
  const activeCatalogDepartment = useMemo(
    () =>
      catalogDepartments.find(
        (dept) =>
          String(dept.id) === String(activeVisitDepartment?.department?.id),
      ) || null,
    [catalogDepartments, activeVisitDepartment],
  );




  const unbilledServiceNames = useMemo(
    () =>
      billingData
        ? Array.from(
            new Set(
              billingData.items
                .filter((item) => item.paymentStatus !== "paid")
                .map((item) => item.departmentName || "General"),
            ),
          )
        : [],
    [billingData?.items],
  );

  const firstBillingDepartment = topLevelBillingDepartments[0];
  const firstBillingDepartmentId = firstBillingDepartment?.id;
  const {
    notes: billingDepartmentNotes,
    refetch: refetchNotes,
  } = useVisitDepartmentNotes(visitId, firstBillingDepartmentId || null);

  // In Billing UI, only BILLING + PUBLIC notes should be considered/visible.
  const billingVisibleNotes = (billingDepartmentNotes || []).filter(
    (note: any) =>
      String(note?.noteType || "") === "BILLING" ||
      String(note?.noteType || "") === "PUBLIC",
  );

  const unreadBillingNotesCount = billingVisibleNotes.filter(
    (note: any) => !note?.viewed,
  ).length;

  const hasUnbilledItems = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    if (visitProductsFullySettled(visitData)) return false;
    return visitHasUnbilledProducts(visitData);
  };

  const hasNoBillables = (visitData: Visit | undefined) => {
    if (!visitData) return true;
    return !visitHasBillableProducts(visitData);
  };

  const hasIncompleteDepartments = (visitData: Visit | undefined) => {
    if (!visitData) return false;
    return flattenVisitDepartmentsForBilling(visitData.departments || []).some(
      (dept) => dept.status !== "COMPLETED",
    );
  };

  const canDischargeVisit = Boolean(
    visit &&
    visit.status !== "COMPLETED" &&
    visit.status !== "CANCELLED" &&
    !hasIncompleteDepartments(visit) &&
    (!hasUnbilledItems(visit) || hasNoBillables(visit)),
  );

  const {
    handleDownloadInvoice,
    handleChangeProfile,
    handlePreviewBilling,
    handleGenerateBill,
    handlePrintBillingInvoice,
    handleAddInsuranceToVisit,
    handleRemoveInsuranceFromVisit,
    handleAddProduct,
    handleDischargeVisit,
    dischargeConfirmOpen,
    setDischargeConfirmOpen,
  } = useBillingPageActions({
    visitId,
    visit,
    billingData,
    existingVisitBilling,
    existingBillingTotals,
    displayTotals,
    selectedItems,
    editModeSnapshot,
    activeVisitInsurances,
    activeVisitDepartment,
    topLevelBillingDepartments,
    activeService,
    canDischargeVisit,
    unreadBillingNotesCount,
    creatingBill,
    editingBill,
    isEditingBill,
    ENABLE_DISCHARGE,
    previewDepartmentId,
    doctor,
    createBill,
    editBill,
    generateInvoice,
    startBillEditing,
    completeBillEditing,
    cancelBillEditing,
    changeVisitDepartmentProfile,
    updateDepartmentStatus,
    completeVisit,
    linkVisitInsurances,
    unlinkVisitInsurances,
    addProduct,
    refetchVisit,
    refetchBill,
    setBillingData,
    setActiveVisitInsuranceIds,
    setBillingRemapNonce,
    setIsEditingBill,
    setEditModeSnapshot,
    setPreviousPaidCents,
    setConfirmSheetMode,
    setBillJustCreated,
    setPreviewOpen,
    setPreviewDepartmentId,
    setPreviewStartedAt,
    setShowAddProductModal,
    setAddingBillingItem,
    setActiveService,
  });


  useEffect(() => {
    if (!billingData) return;
    if (!activeService) {
      setActiveService(
        unbilledServiceNames[0] || allServiceNames[0] || "General",
      );
    }
  }, [billingData, activeService, unbilledServiceNames, allServiceNames]);

  useEffect(() => {
    setBillJustCreated(false);
  }, [visitId]);

  useEffect(() => {
    if (!autoPrint || didAutoPrint || !existingVisitBilling || !billingData)
      return;
    setDidAutoPrint(true);
    // Small delay ensures print window content is ready after query hydration.
    const timer = setTimeout(() => {
      void handlePrintBillingInvoice();
    }, 150);

    return () => clearTimeout(timer);
  }, [autoPrint, didAutoPrint, existingVisitBilling, billingData]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────
  useKeyboardShortcuts(
    useMemo(
      () => ({
        // Ctrl+S / Cmd+S → open save/complete confirmation
        "ctrl+s": () => {
          if (billingData?.items.length) {
            setConfirmSheetMode(isEditingBill ? "edit" : "complete");
            setShowCompleteBillConfirm(true);
          }
        },
        // Ctrl+P / Cmd+P → print invoice
        "ctrl+p": () => {
          void handlePrintBillingInvoice();
        },
      }),
      [billingData, isEditingBill, setConfirmSheetMode, setShowCompleteBillConfirm, handlePrintBillingInvoice],
    ),
  );

  const hasExemptions = billingData?.items.some(
    (item) => item.exempted || item.exemptionType === "full" || item.exemptionType === "patient-share",
  ) ?? false;

  const combinedError = error || billingQueryError;
  if (combinedError) {
    const message =
      (typeof combinedError === "string" ? combinedError : null)
      || (combinedError as any)?.message
      || "An unexpected error occurred";
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <p className="text-destructive">Failed to load billing data.</p>
        <p className="text-sm text-muted-foreground">{message}</p>
        <button
          onClick={() => { refetchVisit(); refetchBill(); }}
          className="mt-2 px-4 py-1 text-sm border rounded hover:bg-muted"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show spinner while loading OR while visit/billingData haven't arrived yet.
  // This prevents the transient "Visit not found" flash on page refresh.
  if (loading || !visit || !billingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header doctor={doctor} />

      <BillingPatientBar
        patientName={billingData.patientName}
        patientAge={billingData.patientAge}
        gender={billingData.gender}
        visitDate={billingData.visitDate}
        patientIdentifier={visit.patient.patientIdentifier || undefined}
        patientIdNumber={billingData.patientId_Number}
        patientInsurances={patientInsurances}
        activeInsuranceIds={visitInsuranceIds}
        addingVisitInsurance={addingVisitInsurance}
        billedInsuranceIds={billedInsuranceIds}
        onToggleInsurance={(id, active) =>
          active
            ? handleAddInsuranceToVisit(id)
            : handleRemoveInsuranceFromVisit(id)
        }
        onAddInsurance={() => setShowAddInsuranceModal(true)}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <BillingItemsWorkspace
          activeService={activeService}
          allServiceNames={allServiceNames}
          items={itemsToDisplay}
          editMode={isEditMode}
          canAddItems={
            // Edit mode (Finance): can add products even on already-billed visits.
            // Normal mode: only when not yet billed and no unread notes.
            unreadBillingNotesCount === 0 &&
            (isEditMode
              ? canEditBilling
              : !effectiveIsAlreadyBilled && canBill && hasRemainingToBill)
          }
          quantityUpdating={updatingQuantity}
          canEdit={
            // Edit mode (Finance): full editing power regardless of paid status.
            // Normal mode: Finance only, not yet billed, no unread notes.
            unreadBillingNotesCount === 0 &&
            canEditBillingItems &&
            canEditBilling &&
            (isEditMode || !effectiveIsAlreadyBilled)
          }
          visitInsuranceOptions={visitInsuranceOptions}
          activeProfile={activeVisitDepartment?.profile ?? null}
          availableProfiles={activeCatalogDepartment?.profiles || []}
          canChangeProfile={!isAlreadyBilled}
          onChangeProfile={(profileId) => void handleChangeProfile(profileId)}
          onServiceChange={setActiveService}
          onAddItem={() => setShowAddProductModal(true)}
          onItemChange={trackLocalEdit}
          onItemRemove={(id) => { hasLocalEditsRef.current = true; handleItemRemove(id, isEditMode); }}
          onQuantityChange={(item, qty) => {
            hasLocalEditsRef.current = true;
            handleQuantityChange(item, qty, isEditMode);
          }}
          serviceDepartmentIds={serviceDepartmentIds}
          allItems={billingData?.items || []}
          billedDepartmentNames={billedDepartmentNames}
          onRemoveDepartment={handleRemoveDepartment}
          editedItemChanges={editedItemChanges}
        />

        {showBillingDock && (
          <BillingStickySummary
            totals={displayTotals}
            amountPaid={billingData.amountPaid || 0}
            activeService={activeService}
            selectedCount={
              itemsToDisplay.filter((item) => item.paymentStatus !== "paid")
                .length
            }
            existingVisitBilling={isEditMode ? null : existingVisitBilling}
            canEditBilling={canEditBilling}
            hasRemainingToBill={activeDeptHasUnbilled}
            creatingBill={creatingBill || editingBill}
            generatingInvoice={generatingInvoice}
            isEditingBill={isEditMode}
            hasEditChanges={hasEditChanges}
            hasUnreadNotes={unreadBillingNotesCount > 0}
            loadingEditBilling={loadingEditBilling}
            loadingDoneEditing={loadingDoneEditing}
            // Outstanding is total - paid (authoritative) — the backend's
            // reported outstandingAmount can lag a full payment and otherwise
            // keep showing the Collect payment button after the bill is settled.
            onCompleteBill={() => {
              if (unreadBillingNotesCount > 0) {
                toast.warn(
                  "Please view the notes first before completing the bill.",
                );
                return;
              }
              // In edit mode open confirm with edit flow, else normal complete
              setConfirmSheetMode(isEditMode ? "edit" : "complete");
              // Always prefill with patient responsibility so the user can
              // see and adjust the amount. Never default to 0.
              handleAmountPaidChange(confirmTotals.totalAmount);
              setShowCompleteBillConfirm(true);
            }}
            onPreview={() => void handlePreviewBilling()}
            onPrint={() => void handlePrintBillingInvoice()}
            onEditBilling={async () => {
              if (unreadBillingNotesCount > 0) {
                toast.warn("Please view the notes first before continuing.");
                return;
              }
              if (!visitId || loadingEditBilling) return;
              setLoadingEditBilling(true);
              try {
                // Persist BILL_EDITING status on the backend so the mode
                // survives page refreshes. Only COMPLETED visits can enter
                // BILL_EDITING — the backend enforces this.
                const result = await startBillEditing(visitId);
                if (result.status !== "SUCCESS") {
                  toast.error(result.message || "Failed to enter billing edit mode");
                  return;
                }
                setPreviousPaidCents(toCents(billingData?.amountPaid || 0));
                setIsEditingBill(true);
                hasLocalEditsRef.current = false;
                setEditModeSnapshot(billingData?.items ?? null);
                // Refetch so visit.status becomes BILL_EDITING and the
                // derived isEditMode picks it up even without local state.
                await refetchVisit();
              } finally {
                setLoadingEditBilling(false);
              }
            }}
            onDoneEditing={async () => {
              if (loadingDoneEditing) return;
              setLoadingDoneEditing(true);
              try {
                // Exit BILL_EDITING mode on the backend
                if (visitId) {
                  try {
                    await cancelBillEditing(visitId);
                  } catch (err) {
                    console.error("Failed to cancel bill editing mode:", err);
                  }
                }
                setIsEditingBill(false);
                hasLocalEditsRef.current = false;
                setPreviousPaidCents(null);
                setEditModeSnapshot(null);
                setConfirmSheetMode("complete");
                // Refetch so items revert back to their billed/paid state
                await refetchVisit();
                await refetchBill();
                toast.info("Edit mode cancelled");
              } finally {
                setLoadingDoneEditing(false);
              }
            }}
          />
        )}
      </div>

      <AddPatientInsuranceModal
        open={showAddInsuranceModal}
        onOpenChange={setShowAddInsuranceModal}
        patientId={visit.patient.id}
        patientDateOfBirth={visit.patient.dateOfBirth}
        patientInsurances={patientInsurances}
        onSuccess={() => void refetchVisit()}
        context="billing"
        disabled={addingVisitInsurance}
      />

      <VisitNotesFloating
        title="Billing Notes & Report"
        notes={billingVisibleNotes}
        allowedDisplayTypes={["BILLING", "PUBLIC"]}
        noteTypes={["BILLING", "PUBLIC"]}
        onAddNote={async (noteType, content) => {
          const visitDepartmentId = String(firstBillingDepartmentId || "");
          if (!visitDepartmentId) {
            throw new Error("No department selected for billing note");
          }

          const result = await addVisitDepartmentNote(
            visitDepartmentId,
            content,
            noteType,
          );
          if (result?.status !== "SUCCESS") {
            throw new Error(result?.message || "Failed to add note");
          }
          await refetchNotes();
          await refetchVisit();
        }}
        onMarkAsViewed={async (_noteId) => {
          await markNotesViewed(String(firstBillingDepartmentId || ""));
          await refetchNotes();
          await refetchVisit();
        }}
      />

      <BillingConfirmSheet
        open={showCompleteBillConfirm}
        onOpenChange={setShowCompleteBillConfirm}
        items={billingData.items}
        totals={confirmTotals}
        amountPaid={billingData.amountPaid || 0}
        paymentMethod={billingData.paymentMethod || "MOBILE_MONEY"}
        creatingBill={creatingBill || editingBill}
        showItemsReview={confirmSheetMode === "complete"}
        outstandingType={billingData.outstandingType || (hasExemptions ? "giveaway" : "loan")}
        outstandingReason={billingData.outstandingReason || ""}
        onPaymentMethodChange={handlePaymentMethodChange}
        onAmountPaidChange={handleAmountPaidChange}
        onOutstandingTypeChange={(type) => setBillingData(prev => prev ? { ...prev, outstandingType: type } : prev)}
        onOutstandingReasonChange={(reason) => setBillingData(prev => prev ? { ...prev, outstandingReason: reason } : prev)}
        billingNotes={billingData.notes || ""}
        onBillingNotesChange={handleNotesChange}
        editWarning={confirmSheetMode === "edit" ? editModeWarning : null}
        onConfirm={async () => {
          setShowCompleteBillConfirm(false);
          if (confirmSheetMode === "complete" || confirmSheetMode === "edit") {
            // Both flows call handleGenerateBill — the function itself decides
            // whether to call billVisit or editBillVisit based on existingVisitBilling.
            await handleGenerateBill();
          }
        }}
      />

      <AddVisitDepartmentProductModal
        open={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        visitDepartments={visit?.departments || []}
        activeServiceName={activeService}
        viewMode="service"
        onAdd={handleAddProduct}
        isSubmitting={addingBillingItem}
        linkedInsurances={visit?.linkedInsurances || []}
      />

      <BillingPreviewSheet
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) {
            setPreviewDepartmentId(null);
            setPreviewStartedAt(null);
          }
        }}
        visit={visit}
        billingData={billingData}
        // While editing, preview the pending edits (draft path); otherwise the
        // billed visit previews its actual invoice.
        visitBilling={isEditMode ? null : existingVisitBilling}
        selectedDepartmentId={previewDepartmentId}
        onDepartmentSelect={setPreviewDepartmentId}
        previewStartedAt={previewStartedAt}
        onPrintInvoice={handleDownloadInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        canViewMore={false}
        onViewMore={() => {
          router.push(`/billing?visitId=${visit?.id}`);
        }}
        printingInvoice={generatingInvoice}
        isEditMode={isEditMode}
      />

      <ConfirmDialog
        open={dischargeConfirmOpen}
        onOpenChange={setDischargeConfirmOpen}
        title="Discharge this patient?"
        description="All billable items are settled. Completing the visit will finalize it."
        confirmLabel="Discharge"
        busy={discharging}
        onConfirm={() => {
          setDischarging(true);
          void handleDischargeVisit().finally(() => {
            setDischarging(false);
            setDischargeConfirmOpen(false);
          });
        }}
      />
    </div>
  );
}
