"use client";

import { useEffect, useMemo, useCallback, useState } from "react";
import {
  BillingItem,
  computeBillingTotals,
  computeDepartmentBillAllocations,
} from "@/lib/billing-utils";
import { toCents } from "@/lib/money";
import {
  flattenVisitDepartmentsForBilling,
  getCoveragePercentageForBillingItem,
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
} from "@/hooks/auth-hooks";
import type { Visit } from "@/lib/api-types";
import { getVisitBillingTotals } from "@/lib/visit-billing-utils";
import { useUpdateVisitDepartmentStatus } from "@/hooks/auth-hooks";
import {
  useAddProductToVisitDepartment,
  useLinkVisitInsurances,
  useUnlinkVisitInsurances,
  useVisitDepartmentNotes,
  useAddVisitDepartmentNote,
  useMarkVisitDepartmentNotesViewed,
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
import { BillingExemptionsPanel } from "@/components/billing/billing-exemptions-panel";
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
  const {
    visitBilling: existingVisitBilling,
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
    showDiscountControls,
    setShowDiscountControls,
    isEditingBill,
    setIsEditingBill,
    editModeSnapshot,
    setEditModeSnapshot,
    discountInputType,
    setDiscountInputType,
    discountInputValue,
    setDiscountInputValue,
    showAddProductModal,
    setShowAddProductModal,
    addingBillingItem,
    setAddingBillingItem,
    showExemptionsWindow,
    setShowExemptionsWindow,

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
    handleDiscountChange,
    handleExemptionChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    handleNotesChange,
  } = useBillingPageState();  const { linkVisitInsurances, loading: linkingVisitInsurances } =
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
  // In-flight discharge — keeps the confirm dialog open with a spinner so the
  // completeVisit/department-status loop can't be triggered twice.
  const [discharging, setDischarging] = useState(false);
  // Tracks the amount paid before entering edit mode, used to determine whether
  // the note-required flag should be set (avoids false triggers from automatic
  // amountPaid capping when items are removed/exempted).
  const [previousPaidCents, setPreviousPaidCents] = useState<number | null>(null);

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
    return (visit?.linkedInsurances || []).filter((insurance) =>
      activeIds.has(String(insurance.id)),
    );
  }, [visit?.linkedInsurances, activeVisitInsuranceIds]);

  useEffect(() => {
    if (!visit) return;
    // In edit mode pass editMode:true so the mapper forces all items to
    // "pending" regardless of their backend BILLED status, giving a clean
    // slate identical to first-time billing.
    const mapped = mapVisitToBillingData(visit, {
      existingVisitBilling,
      editMode: isEditingBill,
    });
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
        billingData?.discountPercentage || 0,
      ),
    [activeVisitInsurances, billingData?.discountPercentage],
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

  // Always bill all pending items — no partial selection.
  const selectedItems = useMemo(
    () =>
      billingData
        ? billingData.items.filter((it) => it.paymentStatus !== "paid")
        : [],
    [billingData],
  );
  const hasRemainingToBill = Boolean(
    billingData?.items.some((item) => item.paymentStatus !== "paid"),
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
  const isEditMode = Boolean(isEditingBill);
  // For UI purposes (item states, dock, etc.) treat billed visit as unbilled while in edit mode
  const effectiveIsAlreadyBilled = isAlreadyBilled && !isEditMode;

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

  // The confirm sheet bills ALL pending items across every department, so its
  // totals must be the grand totals — not just the active service tab.
  const confirmTotals = useMemo(() => {
    if (!billingData) return EMPTY_TOTALS;
    return calculateTotalsForItems(selectedItems);
  }, [billingData, selectedItems, calculateTotalsForItems]);

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


  // Calculate exemption count
  const exemptionCount = billingData
    ? billingData.items.filter(
        (item) =>
          (item.exemptionType || (item.exempted ? "full" : "none")) !== "none",
      ).length
    : 0;

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
    setShowDiscountControls,
    setConfirmSheetMode,
    setBillJustCreated,
    setPreviewOpen,
    setPreviewDepartmentId,
    setPreviewStartedAt,
    setShowAddProductModal,
    setAddingBillingItem,
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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-2">
        <p className="text-destructive">Failed to load visit billing data.</p>
        <p className="text-sm text-muted-foreground">
          {typeof error === "string" ? error : "An unexpected error occurred"}
        </p>
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
          onItemChange={handleItemChange}
          onItemRemove={handleItemRemove}
          onQuantityChange={(item, qty) =>
            handleQuantityChange(item, qty, isEditingBill)
          }
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
            hasRemainingToBill={hasRemainingToBill}
            creatingBill={creatingBill || editingBill}
            generatingInvoice={generatingInvoice}
            isEditingBill={isEditingBill}
            exemptionCount={exemptionCount}
            hasUnreadNotes={unreadBillingNotesCount > 0}
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
              setShowDiscountControls(isEditMode);
              // Prefill full payment for first-time billing. In edit mode keep
              // the previously paid amount — do NOT cap it when items are
              // removed/exempted. The note-required check uses the previous
              // paid amount as reference, so reducing it manually requires a
              // note, but auto-capping does not.
              if (isEditMode) {
                handleAmountPaidChange(billingData.amountPaid || 0);
              } else {
                handleAmountPaidChange(confirmTotals.totalAmount);
              }
              setShowCompleteBillConfirm(true);
            }}
            onPreview={() => void handlePreviewBilling()}
            onPrint={() => void handlePrintBillingInvoice()}
            onEditBilling={() => {
              if (unreadBillingNotesCount > 0) {
                toast.warn("Please view the notes first before continuing.");
                return;
              }
              // Just toggle edit mode — do NOT open the confirm sheet.
              // The page re-maps items as unbilled, user edits like 1st-time billing.
              setPreviousPaidCents(toCents(billingData?.amountPaid || 0));
              setIsEditingBill(true);
              setEditModeSnapshot(billingData?.items ?? null);
            }}
            onDoneEditing={async () => {
              setShowDiscountControls(false);
              setIsEditingBill(false);
              setPreviousPaidCents(null);
              setEditModeSnapshot(null);
              setConfirmSheetMode("complete");
              // Refetch so items revert back to their billed/paid state
              await refetchVisit();
              await refetchBill();
              toast.info("Edit mode cancelled");
            }}
            onManageExemptions={() => setShowExemptionsWindow(true)}
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
        creatingBill={creatingBill}
        showItemsReview={confirmSheetMode === "complete"}
        noteRequired={confirmNoteRequired}
        showDiscountControls={showDiscountControls}
        discountInputType={discountInputType}
        discountInputValue={discountInputValue}
        onPaymentMethodChange={handlePaymentMethodChange}
        onAmountPaidChange={handleAmountPaidChange}
        onShowDiscountControls={setShowDiscountControls}
        onDiscountInputTypeChange={(type) => {
          setDiscountInputType(type);
          if (type === "FIXED") {
            const fixed =
              (displayTotals.patientResponsibility *
                (billingData.discountPercentage || 0)) /
              100;
            setDiscountInputValue(Math.max(0, fixed));
          } else {
            setDiscountInputValue(Number(billingData.discountPercentage || 0));
          }
        }}
        onDiscountInputValueChange={setDiscountInputValue}
        onDiscountChange={handleDiscountChange}
        billingNotes={billingData.notes || ""}
        onBillingNotesChange={handleNotesChange}
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

      <BillingExemptionsPanel
        open={showExemptionsWindow}
        exemptionCount={exemptionCount}
        items={billingData?.items || []}
        onClose={() => setShowExemptionsWindow(false)}
        onExemptionChange={handleExemptionChange}
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
