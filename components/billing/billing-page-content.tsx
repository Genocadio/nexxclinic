"use client";

import { useEffect, useMemo, useCallback, useRef, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
  BillingItem,
  computeBillingTotals,
  computeDepartmentBillAllocations,
} from "@/lib/billing-utils";
import {
  detectEditedItemChanges,
  hasEditChanges as hasEditChangesUtil,
  snapshotBillingItems,
} from "@/lib/billing-edit-diff";
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
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
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
  const { completeVisit, loading: completingVisit } = useCompleteVisit();
  const { departments: catalogDepartments } = useDepartments({
    skip: !visitId,
  });
  const { changeVisitDepartmentProfile } = useChangeVisitDepartmentProfile();
  const { removeVisitDepartment } = useRemoveVisitDepartment();
  // Tracks the visit department ID pending removal so the confirmation
  // dialog can show dependency warnings before actually deleting.
  const [departmentPendingRemoval, setDepartmentPendingRemoval] = useState<string | null>(null);
  const [removingDepartment, setRemovingDepartment] = useState(false);
  // In-flight discharge — keeps the confirm dialog open with a spinner so the
  // completeVisit/department-status loop can't be triggered twice.
  const [discharging, setDischarging] = useState(false);
  // Loading states for edit/done-editing buttons in the sticky summary bar
  const [loadingEditBilling, setLoadingEditBilling] = useState(false);
  const [loadingDoneEditing, setLoadingDoneEditing] = useState(false);
  // Billing notes belong to the department being billed. In an edit, each
  // department can therefore satisfy its own outstanding/exemption rationale
  // without copying one note across the complete replacement bill.
  const [billingNotesByDepartment, setBillingNotesByDepartment] = useState<Record<string, string>>({});
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
  // Derive edit mode from any department's DEPARTMENT_EDITING status
  // or local state. Reading from the persisted status means edit mode survives
  // page refreshes.
  const hasAnyDeptEditing = (visit?.departments || []).some(
    (dept) => dept.status === "DEPARTMENT_EDITING"
  );
  const isEditMode = hasAnyDeptEditing || Boolean(isEditingBill);
  // For UI purposes (item states, dock, etc.) treat billed visit as unbilled while in edit mode
  const effectiveIsAlreadyBilled = isAlreadyBilled && !isEditMode;

  // ── Serialized snapshot for change detection ─────────────────────────────
  // The serialized payload includes the *resolved* coverage / patient-share
  // percentage alongside the raw item fields, because the displayed
  // insurance/patient amounts are DERIVED from it — see lib/billing-edit-diff.
  //
  // IMPORTANT: the baseline stores a frozen `snapshotPct` (baked at capture
  // time), while the current state resolves the pct live. So a change to
  // insurance-level data DURING the session is still detected (live != frozen)
  // rather than masked by both sides recomputing.
  const resolveSnapshotPct = useCallback(
    (item: BillingItem) =>
      getCoveragePercentageForBillingItem(item, activeVisitInsurances),
    [activeVisitInsurances],
  );

  const bakeSnapshotItems = useCallback(
    (items: BillingItem[] | null) =>
      snapshotBillingItems(items, resolveSnapshotPct),
    [resolveSnapshotPct],
  );

  // If we are editing but no snapshot baseline exists (e.g. edit mode was
  // entered via the persisted DEPARTMENT_EDITING department status after a page
  // refresh / remount, where onEditBilling never ran), (re)initialise it from
  // the current billingData. Without a snapshot, change detection would
  // short-circuit to "no changes" forever even after the user edits items.
  useEffect(() => {
    if (!isEditMode || !billingData) return;
    if (editModeSnapshot) return;
    // Base snapshot must reflect the server-sourced items, not any in-memory
    // local edits. On a fresh mount billingData has just been remapped from the
    // visit, so this is the clean baseline.
    setEditModeSnapshot(bakeSnapshotItems(billingData.items));
  }, [isEditMode, billingData, editModeSnapshot, bakeSnapshotItems]);

  // Detect whether the user has made any actual changes in edit mode
  const hasEditChanges = useMemo(() => {
    if (!isEditMode || !billingData) return false;
    // NOTE: pass the already-baked editModeSnapshot directly. Re-baking it here
    // would overwrite the frozen snapshotPct with the live resolver and mask
    // insurance-data changes that happened during the session.
    return hasEditChangesUtil(
      billingData.items,
      editModeSnapshot,
      resolveSnapshotPct,
    );
  }, [isEditMode, billingData, editModeSnapshot, resolveSnapshotPct]);

  // Per-item change map for visual diff indicators in edit mode
  const editedItemChanges = useMemo(() => {
    if (!isEditMode || !billingData) return new Map<string, "added" | "modified">();
    return detectEditedItemChanges(
      billingData.items,
      editModeSnapshot ?? [],
      resolveSnapshotPct,
    );
  }, [isEditMode, billingData, editModeSnapshot, resolveSnapshotPct]);

  // Role rules:
  // - CASHIER: can bill (complete) but cannot edit bills/items.
  // - FINANCE: can bill and can edit.
  const hasManagerRole = useMemo(() => {
    if (!doctor?.roles) return false;
    return ((doctor.roles as string[]) || []).includes("MANAGER");
  }, [doctor?.roles]);
  const hasClinicianRole = useMemo(() => {
    if (!doctor?.roles) return false;
    const roles = (doctor.roles as string[]) || [];
    return roles.includes("CLINICIAN") || roles.includes("DOCTOR");
  }, [doctor?.roles]);

  const canEditBilling = hasFinanceRole;
  const canBill = hasFinanceRole || hasCashierRole;

  const canViewBilledReadOnly =
    effectiveIsAlreadyBilled && (hasFinanceRole || hasCashierRole);
  const showBillingDock =
    canViewBilledReadOnly ||
    canEditBilling ||
    (!effectiveIsAlreadyBilled && hasRemainingToBill);


  // Normal billing is completed a department at a time. A billing edit creates
  // a complete replacement bill, so it must always show the totals for every
  // item in the visit rather than only the currently selected service.
  const displayTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    const itemsForTotals = isEditMode
      ? billingData.items
      : itemsToDisplay.filter((item) => item.paymentStatus !== "paid");
    return calculateTotalsForItems(itemsForTotals);
  }, [billingData, isEditMode, itemsToDisplay, calculateTotalsForItems]);

  // The confirmation sheet follows the same scope as the bill being created:
  // the active department normally, or the entire visit for an edit.
  const confirmTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    return calculateTotalsForItems(
      isEditMode ? billingData.items : selectedItems,
    );
  }, [billingData, isEditMode, selectedItems, calculateTotalsForItems]);

  // Whole-visit patient payable across ALL pending items (every department).
  // The edit path re-projects the entire visit and re-allocates amountPaid
  // across all departments, so the amountPaid prefill must cover the full
  // patient payable — otherwise the backend computes a leftover and books it
  // as a loan. Non-edit incremental billing still caps each department at its
  // own payable, so prefilling the visit total can never over-allocate.
  const visitConfirmTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    return calculateTotalsForItems(billingData.items);
  }, [billingData, calculateTotalsForItems]);

  // Submit and validate precisely the set that will form the new bill. During
  // an edit that is every visit item, including unchanged rows; the snapshot
  // remains solely for NEW/CHANGED highlighting and edit eligibility.
  const completionItems = useMemo(
    () => (isEditMode ? billingData?.items ?? [] : selectedItems),
    [billingData?.items, isEditMode, selectedItems],
  );

  // Edit-mode review warning. Billing edits are FULLY INDEPENDENT snapshots —
  // they never compare or correlate against previously-collected money, so there
  // is no "corrected bill less than paid / treated as credit" warning. Only a
  // gentle "total changed a lot, review before submitting" hint remains.
  const editModeWarning = useMemo(() => {
    if (!billingData) return null;
    const allUnbilledItems = billingData.items.filter(
      (item) => item.paymentStatus !== "paid",
    );
    const correctedTotal = allUnbilledItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const originalTotal = billingData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const diff = Math.abs(originalTotal - correctedTotal);
    if (diff > 0.01 && diff / (originalTotal || 1) > 0.1) {
      return `Bill total changed by ${formatRWF(diff)} (${Math.round((diff / (originalTotal || 1)) * 100)}%). Please review all changes.`;
    }
    return null;
  }, [billingData]);

  // Per-department payment allocation + note requirement (mirrors the backend
  // rule: note required when a department has exemptions or its payment does
  // not cover the full patient payable). Edits are independent so the note
  // requirement reflects the actual payment, not a carried-forward reference.
  const billingAllocations = useMemo(() => {
    if (!billingData) return [];
    return computeDepartmentBillAllocations(
      selectedItems,
      billingData.amountPaid || 0,
      (item) =>
        getCoveragePercentageForBillingItem(item, activeVisitInsurances),
    );
  }, [billingData, selectedItems, activeVisitInsurances]);

  // Note-required detection must match the backend's billing scope. Non-edit
  // billing is per active department; edit mode re-projects the WHOLE visit and
  // books a single note across all departments, so the note requirement must
  // consider every department — otherwise a hidden outstanding/exemption in a
  // non-active department lets the user submit without the note the backend
  // demands (rejection).
  const noteScopeItems = isEditMode
    ? (billingData?.items.filter((item) => item.paymentStatus !== "paid") ?? [])
    : selectedItems;
  const noteRequiredBillingAllocations = useMemo(() => {
    if (!billingData) return [];
    return computeDepartmentBillAllocations(
      noteScopeItems,
      billingData.amountPaid || 0,
      (item) =>
        getCoveragePercentageForBillingItem(item, activeVisitInsurances),
    );
  }, [billingData, noteScopeItems, activeVisitInsurances]);
  const confirmNoteRequired = noteRequiredBillingAllocations.some(
    (allocation) => allocation.noteRequired,
  );
  const missingRequiredNoteDepartmentId = useMemo(
    () =>
      noteRequiredBillingAllocations.find(
        (allocation) =>
          allocation.noteRequired &&
          !billingNotesByDepartment[allocation.visitDepartmentId]?.trim(),
      )?.visitDepartmentId ?? null,
    [noteRequiredBillingAllocations, billingNotesByDepartment],
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

  // Show confirmation dialog instead of deleting immediately.
  const handleRemoveDepartment = useCallback(
    (visitDepartmentId: string) => {
      setDepartmentPendingRemoval(visitDepartmentId);
    },
    [],
  );

  // Actually perform the deletion after confirmation.
  const confirmRemoveDepartment = useCallback(
    async (visitDepartmentId: string) => {
      hasLocalEditsRef.current = true;
      setRemovingDepartment(true);
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
      } finally {
        setRemovingDepartment(false);
        setDepartmentPendingRemoval(null);
      }
    },
    [removeVisitDepartment, refetchVisit],
  );

  // Compute dependency warnings for the department pending removal.
  const removalWarnings = useMemo(() => {
    if (!departmentPendingRemoval || !visit) return [];
    const dept = visit.departments?.find((d) => d.id === departmentPendingRemoval);
    if (!dept) return [];
    const warnings: string[] = [];
    const productCount = dept.products?.length ?? 0;
    if (productCount > 0) {
      warnings.push(`${productCount} product${productCount === 1 ? '' : 's'} will be removed`);
    }
    const diagnosisCount = dept.diagnostics?.length ?? 0;
    if (diagnosisCount > 0) {
      warnings.push(`${diagnosisCount} diagnosis${diagnosisCount === 1 ? '' : 'es'} will be removed`);
    }
    const medicationCount = dept.medications?.length ?? 0;
    if (medicationCount > 0) {
      warnings.push(`${medicationCount} medication${medicationCount === 1 ? '' : 's'} will be removed`);
    }
    const noteCount = dept.notes?.totalNotes ?? 0;
    if (noteCount > 0) {
      warnings.push(`${noteCount} note${noteCount === 1 ? '' : 's'} will be removed`);
    }
    if (dept.preInstructions?.length) {
      warnings.push(`${dept.preInstructions.length} pre-instruction${dept.preInstructions.length === 1 ? '' : 's'} will be removed`);
    }
    return warnings;
  }, [departmentPendingRemoval, visit]);

  const departmentPendingRemovalName = useMemo(() => {
    if (!departmentPendingRemoval || !visit) return '';
    const dept = visit.departments?.find((d) => d.id === departmentPendingRemoval);
    return dept?.department?.name || 'this department';
  }, [departmentPendingRemoval, visit]);

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

  const currentBillingDepartmentId = activeVisitDepartment?.id;

  // Fetch ALL of the visit's notes (visitDepartmentId = null) so the unread
  // gate matches the backend's whole-visit rule: billing operations are blocked
  // while the acting user has any unread note on any non-CANCELLED department.
  // The floating panel still shows only the notes dedicated to the department
  // currently being billed; a banner points the user at other departments that
  // hold unread notes so they never hit an invisible block.
  const {
    notes: visitDepartmentNotes,
    refetch: refetchNotes,
  } = useVisitDepartmentNotes(visitId, null);

  // Notes dedicated to the department currently being billed (floating panel).
  const billingDepartmentNotes = useMemo(
    () =>
      (visitDepartmentNotes || []).filter(
        (note: any) =>
          String(note?.visitDepartmentId || "") ===
          String(currentBillingDepartmentId || ""),
      ),
    [visitDepartmentNotes, currentBillingDepartmentId],
  );

  // CANCELLED departments are excluded from the unread gate on the backend.
  const cancelledVisitDepartmentIds = useMemo(
    () =>
      new Set(
        (visit?.departments || [])
          .filter((dept) => dept?.status === "CANCELLED")
          .map((dept) => String(dept.id)),
      ),
    [visit?.departments],
  );

  // In the Billing UI the notes panel must surface every note that can block a
  // billing operation on this department: PUBLIC inter-department communications
  // and BILLING financial annotations (outstanding/exemption justification).
  // Hiding BILLING notes left finance users blocked by a note they could never
  // see or mark as read.
  const billingVisibleNotes = (billingDepartmentNotes || []).filter(
    (note: any) => {
      const type = String(note?.noteType || "");
      return type === "PUBLIC" || type === "BILLING";
    },
  );

  // Whole-visit unread gate — mirrors the backend's countUnreadNotesForVisit
  // (any note type, any non-CANCELLED department, not self-created). This is
  // what actually blocks bill/edit/payment/invoice on the backend, so the UI
  // gates on exactly the same set.
  const unreadBillingNotesCount = (visitDepartmentNotes || []).filter(
    (note: any) =>
      !note?.viewed &&
      !cancelledVisitDepartmentIds.has(String(note?.visitDepartmentId || "")),
  ).length;

  // Unread notes that live on OTHER non-cancelled departments — the user must
  // switch to those departments and read them before billing can proceed.
  const unreadNotesOnOtherDepartments = useMemo(() => {
    const activeId = String(currentBillingDepartmentId || "");
    const counts = new Map<string, { name: string; count: number }>();
    for (const note of visitDepartmentNotes || []) {
      if (note?.viewed) continue;
      const deptId = String(note?.visitDepartmentId || "");
      if (!deptId || deptId === activeId) continue;
      if (cancelledVisitDepartmentIds.has(deptId)) continue;
      const dept = visit?.departments?.find((d) => String(d.id) === deptId);
      const name = dept?.department?.name || "another department";
      const entry = counts.get(deptId) || { name, count: 0 };
      entry.count++;
      counts.set(deptId, entry);
    }
    return Array.from(counts.values());
  }, [
    visitDepartmentNotes,
    currentBillingDepartmentId,
    cancelledVisitDepartmentIds,
    visit?.departments,
  ]);

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

  // Pending (CREATED/IN_PROGRESS) visits that are already billed and fully
  // settled can be completed directly. The button shows next to Edit billing.
  const canCompleteVisit = Boolean(
    visit &&
    !isEditMode &&
    existingVisitBilling &&
    (visit.status === "CREATED" || visit.status === "IN_PROGRESS") &&
    !hasIncompleteDepartments(visit) &&
    (!hasUnbilledItems(visit) || hasNoBillables(visit)),
  );

  const [completeVisitConfirmOpen, setCompleteVisitConfirmOpen] =
    useState(false);

  const handleCompleteVisit = async () => {
    if (!visitId) return;
    try {
      const result = await completeVisit(visitId);
      if (result?.status === "SUCCESS") {
        toast.success("Visit completed successfully");
        await refetchVisit();
        await refetchBill();
      } else {
        toast.error(
          result?.message || "Failed to complete visit. Please try again.",
        );
      }
    } catch (err) {
      console.error("Complete visit error:", err);
      toast.error("Failed to complete visit. Please try again.");
    }
  };

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
    selectedItems: completionItems,
    billingNotesByDepartment,
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
    setBillingNotesByDepartment({});
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
        {unreadNotesOnOtherDepartments.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border-b border-border text-xs text-destructive">
            <span>
              Billing is blocked by unread notes in{" "}
              {unreadNotesOnOtherDepartments
                .map(
                  (dept) =>
                    `${dept.name} (${dept.count} unread)`,
                )
                .join(", ")}
              . Switch to that department and read them first.
            </span>
          </div>
        )}
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
          canChangeProfile={!isAlreadyBilled && (hasManagerRole || hasClinicianRole)}
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
              // In edit mode open confirm with edit flow, else normal complete.
              setConfirmSheetMode(isEditMode ? "edit" : "complete");
              // Prefill amountPaid before opening so the note-required check
              // inside the sheet reflects the actual intended payment, not 0.
              handleAmountPaidChange(
                isEditMode
                  ? visitConfirmTotals.totalAmount
                  : confirmTotals.totalAmount,
              );
              setShowCompleteBillConfirm(true);
            }}
            onPreview={() => void handlePreviewBilling()}
            onPrint={() => void handlePrintBillingInvoice()}
            canCompleteVisit={canCompleteVisit}
            completingVisit={completingVisit}
            onCompleteVisit={() => {
              if (unreadBillingNotesCount > 0) {
                toast.warn("Please view the notes first before completing this visit.");
                return;
              }
              setCompleteVisitConfirmOpen(true);
            }}
            onEditBilling={async () => {
              if (unreadBillingNotesCount > 0) {
                toast.warn("Please view the notes first before continuing.");
                return;
              }
              if (!activeVisitDepartment?.id || loadingEditBilling) return;
              setLoadingEditBilling(true);
              try {
                // Persist DEPARTMENT_EDITING status on the backend so the mode
                // survives page refreshes. Only COMPLETED/FINALISED departments
                // can enter DEPARTMENT_EDITING — the backend enforces this.
                const result = await startBillEditing(activeVisitDepartment.id);
                if (result.status !== "SUCCESS") {
                  toast.error(result.message || "Failed to enter billing edit mode");
                  return;
                }
                setIsEditingBill(true);
                hasLocalEditsRef.current = false;
                setEditModeSnapshot(bakeSnapshotItems(billingData?.items ?? null));
                // Refetch so dept.status becomes DEPARTMENT_EDITING and the
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
                // Exit DEPARTMENT_EDITING mode on the backend for the active department
                if (activeVisitDepartment?.id) {
                  // Collect IDs of products that were added during this edit session
                  // (in current items but not in the snapshot, excluding temp IDs)
                  const addedIds = billingData.items
                    .filter((item) => !editModeSnapshot?.some((s) => s.id === item.id))
                    .map((item) => item.id)
                    .filter((id) => !id.startsWith("temp-"));
                  try {
                    const result = await cancelBillEditing(activeVisitDepartment.id, addedIds);
                    if (result.status !== "SUCCESS") {
                      toast.error(result.message || "Could not cancel billing edit mode");
                      return;
                    }
                  } catch (err) {
                    console.error("Failed to cancel bill editing mode:", err);
                    toast.error("Could not cancel billing edit mode. Please try again.");
                    return;
                  }
                }
                setIsEditingBill(false);
                hasLocalEditsRef.current = false;
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
        title="Visit Notes"
        notes={billingVisibleNotes}
        allowedDisplayTypes={["PUBLIC", "BILLING"]}
        noteTypes={["PUBLIC"]}
        onAddNote={async (noteType, content) => {
          const visitDepartmentId = String(currentBillingDepartmentId || "");
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
          await markNotesViewed(String(currentBillingDepartmentId || ""));
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
        billingNotes={billingNotesByDepartment[String(currentBillingDepartmentId || "")] || ""}
        onBillingNotesChange={(note) => {
          const departmentId = String(currentBillingDepartmentId || "");
          if (!departmentId) return;
          setBillingNotesByDepartment((current) => ({ ...current, [departmentId]: note }));
        }}
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
        open={completeVisitConfirmOpen}
        onOpenChange={setCompleteVisitConfirmOpen}
        title="Complete this visit?"
        description="This visit is fully billed. Completing it will finalize the visit."
        confirmLabel="Complete Visit"
        busy={completingVisit}
        onConfirm={() => {
          void handleCompleteVisit().finally(() => {
            setCompleteVisitConfirmOpen(false);
          });
        }}
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

      <ConfirmDeleteDialog
        open={!!departmentPendingRemoval}
        onOpenChange={(open) => {
          if (!open) setDepartmentPendingRemoval(null);
        }}
        entityName={departmentPendingRemovalName}
        dependencies={removalWarnings.map((w) => ({ label: w }))}
        confirmLabel="Remove Department"
        busy={removingDepartment}
        onConfirm={() => {
          if (departmentPendingRemoval) {
            void confirmRemoveDepartment(departmentPendingRemoval);
          }
        }}
      />
    </div>
  );
}
