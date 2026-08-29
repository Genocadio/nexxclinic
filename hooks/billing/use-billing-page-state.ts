"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import type { BillingData, BillingItem } from "@/lib/billing-utils";
import type { BillingPaymentMethod } from "@/hooks/billing/hooks";
import { useUpdateProductQuantity } from "@/hooks/visits/hooks";

/**
 * All local UI + billing state for BillingPageContent plus the synchronous
 * item/discount/exemption/payment handlers. Extracted so the page component
 * only composes state, derived values, async actions and the render tree.
 */
export function useBillingPageState() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDepartmentId, setPreviewDepartmentId] = useState<string | null>(
    null,
  );
  const [previewStartedAt, setPreviewStartedAt] = useState<number | null>(null);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [activeVisitInsuranceIds, setActiveVisitInsuranceIds] = useState<
    string[]
  >([]);
  const [billJustCreated, setBillJustCreated] = useState(false);
  const [showCompleteBillConfirm, setShowCompleteBillConfirm] = useState(false);
  const [confirmSheetMode, setConfirmSheetMode] = useState<"complete" | "edit">(
    "complete",
  );
  const [didAutoPrint, setDidAutoPrint] = useState(false);
  const [activeService, setActiveService] = useState<string>("");
  // No per-item selection: billing is always all-or-nothing per visit department.
  // Items are removed from the list to exclude them, not deselected.
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState(false);
  const [isEditingBill, setIsEditingBill] = useState(false);
  const [editModeSnapshot, setEditModeSnapshot] = useState<
    BillingItem[] | null
  >(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [addingBillingItem, setAddingBillingItem] = useState(false);
  const [showExemptionsWindow, setShowExemptionsWindow] = useState(false);
  // Bumped to force billingData to be remapped from a freshly refetched visit
  // (e.g. after changeVisitDepartmentProfile swaps PROFILE products).
  const [billingRemapNonce, setBillingRemapNonce] = useState(0);

  const { updateQuantity: updateProductQuantity, loading: updatingQuantity } =
    useUpdateProductQuantity();

  // ── Sync handlers ──────────────────────────────────────────────────────────

  const handleItemChange = (updatedItem: BillingItem) => {
    // Clamp quantity and price to safe bounds so corrupted values from
    // uncontrolled inputs never reach billing totals or the backend.
    const safeItem: BillingItem = {
      ...updatedItem,
      quantity: Number.isFinite(updatedItem.quantity) && updatedItem.quantity >= 1 ? updatedItem.quantity : 1,
      price: Number.isFinite(updatedItem.price) && updatedItem.price >= 0 ? updatedItem.price : 0,
    };
    setBillingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === safeItem.id ? safeItem : item,
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleQuantityChange = async (
    item: BillingItem,
    nextQty: number,
    isEditingBill?: boolean,
  ) => {
    if (nextQty < 1) return;

    // In edit mode, skip the backend mutation — the quantity change will be
    // submitted as part of editBillVisit (via updatedProducts + billProducts).
    // The normal updateVisitDepartmentProductQuantity mutation is blocked on
    // billed departments.
    if (isEditingBill) {
      handleItemChange({ ...item, quantity: nextQty });
      return;
    }

    try {
      const response = await updateProductQuantity(item.id, nextQty);
      if (response.status !== "SUCCESS") {
        toast.error(response.message || "Failed to update quantity");
        return;
      }
      handleItemChange({ ...item, quantity: nextQty });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update quantity";
      toast.error(message);
    }
  };

  const handleItemRemove = (itemId: string) => {
    setBillingData((prev) => {
      if (!prev) return prev;
      const target = prev.items.find((item) => item.id === itemId);
      // The backend rejects removing PROFILE products in edit mode
      // ("...is a profile product and cannot be removed from billing"), so we
      // never remove them — even while editing. Change the profile instead.
      if (target?.source === "PROFILE") {
        toast.info("Profile products cannot be removed individually — change the visit department's profile instead.");
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleExemptionChange = (itemId: string, reason: string) => {
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? { ...item, exemptionReason: reason } : item,
            ),
            updatedAt: new Date().toISOString(),
          }
        : prev,
    );
  };

  const handlePaymentMethodChange = (method: BillingPaymentMethod) => {
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            paymentMethod: method,
            updatedAt: new Date().toISOString(),
          }
        : prev,
    );
  };

  const handleAmountPaidChange = (amount: number) => {
    // Guard against NaN / Infinity from malformed number inputs
    const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            amountPaid: safeAmount,
            updatedAt: new Date().toISOString(),
          }
        : prev,
    );
  };

  const handleNotesChange = useCallback((notes: string) => {
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            notes,
            updatedAt: new Date().toISOString(),
          }
        : prev,
    );
  }, []);

  return {
    // UI state
    previewOpen,
    setPreviewOpen,
    previewDepartmentId,
    setPreviewDepartmentId,
    previewStartedAt,
    setPreviewStartedAt,
    billJustCreated,
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
    showExemptionsWindow,
    setShowExemptionsWindow,
    billingRemapNonce,
    setBillingRemapNonce,
    // Loading flags for backend calls
    updatingQuantity,
    // Billing data state
    billingData,
    setBillingData,
    activeVisitInsuranceIds,
    setActiveVisitInsuranceIds,
    // Sync handlers
    handleItemChange,
    handleQuantityChange,
    handleItemRemove,
    handleExemptionChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    handleNotesChange,
  };
}
