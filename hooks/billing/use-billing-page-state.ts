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
  const [showDiscountControls, setShowDiscountControls] = useState(false);
  const [isEditingBill, setIsEditingBill] = useState(false);
  const [editModeSnapshot, setEditModeSnapshot] = useState<
    BillingItem[] | null
  >(null);
  const [discountInputType, setDiscountInputType] = useState<
    "PERCENTAGE" | "FIXED"
  >("PERCENTAGE");
  const [discountInputValue, setDiscountInputValue] = useState(0);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [addingBillingItem, setAddingBillingItem] = useState(false);
  const [showExemptionsWindow, setShowExemptionsWindow] = useState(false);
  const [showCollectPayment, setShowCollectPayment] = useState(false);
  // Bumped to force billingData to be remapped from a freshly refetched visit
  // (e.g. after changeVisitDepartmentProfile swaps PROFILE products).
  const [billingRemapNonce, setBillingRemapNonce] = useState(0);

  const { updateQuantity: updateProductQuantity, loading: updatingQuantity } =
    useUpdateProductQuantity();

  // ── Sync handlers ──────────────────────────────────────────────────────────

  const handleItemChange = (updatedItem: BillingItem) => {
    setBillingData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleQuantityChange = async (item: BillingItem, nextQty: number) => {
    if (nextQty < 1) return;

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
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleDiscountChange = (discount: number) => {
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            discountPercentage: discount,
            updatedAt: new Date().toISOString(),
          }
        : prev,
    );
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
    setBillingData((prev) =>
      prev
        ? {
            ...prev,
            amountPaid: amount,
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
    showCollectPayment,
    setShowCollectPayment,
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
    handleDiscountChange,
    handleExemptionChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    handleNotesChange,
  };
}
