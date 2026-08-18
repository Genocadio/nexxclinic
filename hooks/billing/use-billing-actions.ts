"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import {
  applyInsuranceSelectionToItem,
  type BillingData,
  type BillingItem,
  type BillingTotals,
} from "@/lib/billing-utils";
import {
  flattenVisitDepartmentsForBilling,
  getCoveragePercentageForBillingItem,
} from "@/lib/visit-billing-mapper";
import {
  buildInvoiceHtml,
  openInvoicePreview,
  resolveInvoiceUrl,
  type InvoiceMutationResult,
} from "@/lib/invoice-utils";
import {
  buildCreateBillInput,
  buildEditBillInput,
} from "@/lib/billing-input-builders";
import type { Visit, VisitBilling, PatientInsurance } from "@/lib/api-types";
import type { VisitBillingTotals } from "@/lib/visit-billing-utils";
import type { VisitDepartment } from "@/hooks/types";
import type { ApiResponse } from "@/hooks/types";
import type {
  BillingPaymentMethod,
  CreateBillInput,
  EditBillInput,
} from "@/hooks/billing/hooks";

export interface BillingActionsContext {
  // Data
  visitId: string | null;
  visit: Visit | undefined;
  billingData: BillingData | null;
  existingVisitBilling: VisitBilling | null | undefined;
  existingBillingTotals: VisitBillingTotals | null;
  displayTotals: BillingTotals;
  selectedItems: BillingItem[];
  editModeSnapshot: BillingItem[] | null;
  activeVisitInsurances: PatientInsurance[];
  activeVisitDepartment: VisitDepartment | null;
  topLevelBillingDepartments: VisitDepartment[];
  canDischargeVisit: boolean;
  unreadBillingNotesCount: number;
  creatingBill: boolean;
  editingBill: boolean;
  isEditingBill: boolean;
  ENABLE_DISCHARGE: boolean;
  previewDepartmentId: string | null;
  doctor: { firstName?: string | null } | null;
  // Mutations
  createBill: (input: CreateBillInput) => Promise<ApiResponse<VisitBilling>>;
  editBill: (input: EditBillInput) => Promise<ApiResponse<VisitBilling>>;
  generateInvoice: (
    departmentInsuranceBillingId: string,
  ) => Promise<InvoiceMutationResult>;
  recordPayment: (input: {
    departmentInsuranceBillingId: string;
    amount: number;
    paymentMethod: BillingPaymentMethod;
    reference?: string;
    note?: string;
  }) => Promise<ApiResponse<VisitBilling>>;
  changeVisitDepartmentProfile: (
    visitDepartmentId: string,
    profileId?: string | null,
  ) => Promise<ApiResponse<any>>;
  updateDepartmentStatus: (
    visitDepartmentId: string,
    status: "ACTIVE" | "PENDING" | "COMPLETED",
  ) => Promise<ApiResponse<any>>;
  completeVisit: (visitId: string) => Promise<ApiResponse<any>>;
  linkVisitInsurances: (
    visitId: string,
    insuranceIds: string[],
  ) => Promise<ApiResponse<any>>;
  unlinkVisitInsurances: (
    visitId: string,
    insuranceIds: string[],
  ) => Promise<ApiResponse<any>>;
  addProduct: (
    visitId: string,
    departmentId: string,
    productId: string,
    quantity?: number,
  ) => Promise<ApiResponse<any>>;
  // Refetches
  refetchVisit: () => Promise<unknown>;
  refetchBill: () => Promise<unknown>;
  // Setters
  setBillingData: Dispatch<SetStateAction<BillingData | null>>;
  setActiveVisitInsuranceIds: Dispatch<SetStateAction<string[]>>;
  setBillingRemapNonce: Dispatch<SetStateAction<number>>;
  setIsEditingBill: Dispatch<SetStateAction<boolean>>;
  setEditModeSnapshot: Dispatch<SetStateAction<BillingItem[] | null>>;
  setPreviousPaidCents: Dispatch<SetStateAction<number | null>>;
  setShowDiscountControls: Dispatch<SetStateAction<boolean>>;
  setConfirmSheetMode: Dispatch<SetStateAction<"complete" | "edit">>;
  setBillJustCreated: Dispatch<SetStateAction<boolean>>;
  setPreviewOpen: Dispatch<SetStateAction<boolean>>;
  setPreviewDepartmentId: Dispatch<SetStateAction<string | null>>;
  setPreviewStartedAt: Dispatch<SetStateAction<number | null>>;
  setShowAddProductModal: Dispatch<SetStateAction<boolean>>;
  setAddingBillingItem: Dispatch<SetStateAction<boolean>>;
}

type RecordPaymentInput = Parameters<BillingActionsContext["recordPayment"]>[0];

/**
 * All async actions for BillingPageContent (bill creation/editing, discharge,
 * preview/print, insurance toggling, product adding). Extracted so the page
 * only composes state, derived values and the render tree.
 */
export function useBillingPageActions(ctx: BillingActionsContext) {
  const {
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
    recordPayment,
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
  } = ctx;

  const handleDownloadInvoice = async (
    departmentInsuranceBillingId: string,
  ) => {
    const invoiceUrl = await resolveInvoiceUrl(
      departmentInsuranceBillingId,
      generateInvoice,
    );
    openInvoicePreview(invoiceUrl);
  };

  const handleRecordPayment = async (input: RecordPaymentInput) => {
    const response = await recordPayment(input);
    if (response.status !== "SUCCESS") {
      throw new Error(response.message || "Failed to record payment");
    }
  };

  const handleChangeProfile = async (profileId: string | null) => {
    if (!activeVisitDepartment) return;
    try {
      const response = await changeVisitDepartmentProfile(
        activeVisitDepartment.id,
        profileId,
      );
      if (response?.status === "SUCCESS") {
        await refetchVisit();
        await refetchBill();
        // Force billingData to re-map so the new PROFILE products appear.
        setBillingRemapNonce((nonce) => nonce + 1);
        toast.success("Department profile updated");
      } else {
        toast.error(
          response?.message || "Failed to update the department profile",
        );
      }
    } catch (err) {
      console.error("Change profile error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update the profile",
      );
    }
  };

  const [dischargeConfirmOpen, setDischargeConfirmOpen] = useState(false);

  const requestDischarge = () => {
    if (!ENABLE_DISCHARGE) return;
    if (!visit) return;
    if (unreadBillingNotesCount > 0) {
      toast.warn("Please view the notes first before completing this visit.");
      return;
    }
    setDischargeConfirmOpen(true);
  };

  const handleDischargeVisit = async () => {
    if (!visit) return;

    try {
      const allDepartments = flattenVisitDepartmentsForBilling(
        visit.departments || [],
      );
      const notCompleted = allDepartments.filter(
        (dept) => dept.status !== "COMPLETED",
      );

      if (notCompleted.length > 0) {
        for (const dept of notCompleted) {
          const visitDeptId = String(dept.id || "");
          if (!visitDeptId) continue;

          const res = await updateDepartmentStatus(visitDeptId, "COMPLETED");
          if (res?.status !== "SUCCESS") {
            toast.error(
              res?.messages?.[0]?.text ||
                "Failed to complete department during discharge",
            );
            return;
          }
        }
      } else {
        // Re-apply completed status to last department to trigger backend visit completion aggregation.
        const fallbackDepartment = allDepartments[allDepartments.length - 1];
        const fallbackId = String(fallbackDepartment?.id || "");
        if (fallbackId) {
          await updateDepartmentStatus(fallbackId, "COMPLETED");
        }
      }

      await refetchVisit();
      await refetchBill();
      toast.success("Patient discharged successfully");
    } catch (err) {
      console.error("Discharge error:", err);
      toast.error("Failed to discharge patient");
    }
  };

  const handlePreviewBilling = async () => {
    if (!billingData) return;

    try {
      await refetchBill();
    } catch (err) {
      console.error("Failed to refresh bill before preview:", err);
      toast.warning(
        "Unable to refresh bill data before preview. Showing latest available bill.",
      );
    }

    const availableDepartments = topLevelBillingDepartments;
    const initialDepartment =
      availableDepartments.length === 1
        ? availableDepartments[0]
        : availableDepartments.find(
            (dept) => dept.id === previewDepartmentId,
          ) || availableDepartments[0];

    if (initialDepartment) {
      setPreviewDepartmentId(initialDepartment.id);
    }

    setPreviewStartedAt(Date.now());
    setPreviewOpen(true);
  };

  const handleGenerateBill = async () => {
    if (!billingData || creatingBill || editingBill) return;

    if (unreadBillingNotesCount > 0) {
      toast.warn("Please view the notes first before completing the bill.");
      return;
    }

    const unbilledItems = selectedItems.filter(
      (item) => item.paymentStatus !== "paid",
    );

    if (unbilledItems.length === 0) {
      if (canDischargeVisit && ENABLE_DISCHARGE) {
        requestDischarge();
        return;
      }
      toast.warning("All items are already billed.");
      return;
    }

    try {
      const coverageForItem = (item: BillingItem) =>
        getCoveragePercentageForBillingItem(item, activeVisitInsurances);

      const response = existingVisitBilling
        ? await editBill(
            buildEditBillInput(
              billingData,
              editModeSnapshot ?? [],
              coverageForItem,
            ),
          )
        : await createBill(
            buildCreateBillInput(billingData, unbilledItems, coverageForItem),
          );

      if (response.status === "SUCCESS") {
        setBillJustCreated(true);

        // Check if all items in billingData are now billed
        const allRemainingBilled =
          unbilledItems.length ===
          billingData.items.filter((item) => item.paymentStatus !== "paid")
            .length;

        // Complete the visit (and any remaining departments) once everything is
        // billed, and surface failures instead of silently swallowing them —
        // a visit stuck as non-COMPLETED after billing is a silent breaking bug.
        const completionErrors: string[] = [];
        if (allRemainingBilled) {
          try {
            // First, complete all incomplete departments
            const allDepartments = flattenVisitDepartmentsForBilling(
              visit?.departments || [],
            );
            const notCompleted = allDepartments.filter(
              (dept) =>
                dept.status !== "COMPLETED",
            );
            for (const dept of notCompleted) {
              const visitDeptId = String(dept.id || "");
              if (!visitDeptId) continue;
              const deptResult = await updateDepartmentStatus(
                visitDeptId,
                "COMPLETED",
              );
              if (deptResult?.status !== "SUCCESS") {
                completionErrors.push(
                  deptResult?.message ||
                    `Failed to complete ${dept.department?.name || "department"}`,
                );
              }
            }

            // Now, complete the visit
            const completeResult = await completeVisit(billingData.visitId);
            if (completeResult?.status !== "SUCCESS") {
              completionErrors.push(
                completeResult?.message || "Failed to complete visit",
              );
            }
          } catch (compErr) {
            completionErrors.push("Failed to complete the visit");
            console.error("Error completing departments/visit:", compErr);
          }
        }

        // Refetch visit and bill data
        await refetchVisit();
        await refetchBill();
        // If we just finished an edit, exit edit mode before opening preview.
        if (isEditingBill) {
          setIsEditingBill(false);
          setEditModeSnapshot(null);
          setPreviousPaidCents(null);
          setShowDiscountControls(false);
          setConfirmSheetMode("complete");
        }
        await handlePreviewBilling();
        if (completionErrors.length > 0) {
          toast.warning(
            `Bill saved, but the visit could not be completed: ${completionErrors.join(" · ")}`,
          );
        } else {
          toast.success(
            existingVisitBilling
              ? "Bill updated successfully!"
              : "Bill created successfully!",
          );
        }
      } else {
        const errorMsg =
          response.messages?.map((m) => m.text).join(", ") ||
          existingVisitBilling
            ? "Failed to update bill"
            : "Failed to create bill";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error(
        existingVisitBilling ? "Error updating bill:" : "Error creating bill:",
        err,
      );
      toast.error(
        existingVisitBilling
          ? "Failed to update bill. Please try again."
          : "Failed to create bill. Please try again.",
      );
    }
  };

  const handlePrintBillingInvoice = async () => {
    if (!billingData) return;

    if (existingVisitBilling) {
      const firstDeptBilling = existingVisitBilling.departments?.[0];
      const firstInsuranceBilling = firstDeptBilling?.insuranceBillings?.[0];
      if (firstInsuranceBilling?.id) {
        try {
          const invoiceUrl = await resolveInvoiceUrl(
            firstInsuranceBilling.id,
            generateInvoice,
          );
          openInvoicePreview(invoiceUrl);
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to generate invoice";
          toast.error(message);
        }
      } else {
        toast.warning("No invoice available for this billing yet.");
      }
      return;
    }

    const invoiceHtml = buildInvoiceHtml({
      invoiceNumber: billingData.visitId || "N/A",
      invoiceDate: billingData.updatedAt || new Date().toISOString(),
      patientName: billingData.patientName,
      patientId: billingData.patientId,
      paymentMethod: billingData.paymentMethod || "MOBILE_MONEY",
      visitDate: billingData.visitDate,
      items: billingData.items.map((item) => ({
        description: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      })),
      totals: {
        subtotal: existingBillingTotals?.totalAmount ?? displayTotals.subtotal,
        discount: displayTotals.discount,
        totalDue:
          existingBillingTotals?.totalAmount ?? displayTotals.totalAmount,
        paid:
          existingBillingTotals?.paidAmount ?? (billingData.amountPaid || 0),
        balance:
          existingBillingTotals?.outstandingAmount ??
          Math.max(0, displayTotals.totalAmount - (billingData.amountPaid || 0)),
      },
    });

    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      toast.error(
        "Unable to open print window. Please allow pop-ups and try again.",
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleAddInsuranceToVisit = async (insuranceId: string) => {
    if (!visitId) return;

    try {
      const response = await linkVisitInsurances(visitId, [insuranceId]);
      if (response?.status === "SUCCESS") {
        setActiveVisitInsuranceIds((current) =>
          current.includes(insuranceId) ? current : [...current, insuranceId],
        );
        await refetchVisit();
        toast.success("Insurance enabled for this visit");
      } else {
        const errorMsg =
          response?.messages?.[0]?.text ||
          "Failed to enable insurance on visit";
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error("Failed to link insurance to visit:", err);
      toast.error("Failed to enable insurance on visit. Please try again.");
      await refetchVisit();
    }
  };

  const handleRemoveInsuranceFromVisit = async (insuranceId: string) => {
    if (!visitId) return;

    try {
      const response = await unlinkVisitInsurances(visitId, [insuranceId]);
      if (response?.status === "SUCCESS") {
        setActiveVisitInsuranceIds((current) =>
          current.filter((id) => id !== insuranceId),
        );
        setBillingData((current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((item) => {
              if (item.selectedInsuranceId !== insuranceId) return item;
              return applyInsuranceSelectionToItem(item, undefined, undefined);
            }),
          };
        });
        await refetchVisit();
        toast.success("Insurance removed from this visit");
      } else {
        const errorMsg =
          response?.messages?.[0]?.text ||
          "Failed to remove insurance from visit";
        toast.error(errorMsg);
        await refetchVisit();
      }
    } catch (err) {
      console.error("Failed to unlink insurance from visit:", err);
      toast.error("Failed to remove insurance from visit. Please try again.");
      await refetchVisit();
    }
  };

  const handleAddProduct = async (
    _type: "action" | "consumable",
    item: {
      id: string;
      name: string;
      clinicPrice?: number | null;
      privateRhicPrice?: number | null;
    },
    quantity: number,
    catalogDepartmentId: string,
  ) => {
    if (!visit?.id) return;

    // In edit mode, skip the backend addVisitDepartmentProduct mutation — the
    // normal mutation is blocked on billed departments. Instead, construct a
    // local BillingItem and add it to the state. The actual backend add happens
    // atomically when the user submits via editBillVisit (addedProducts + billProducts).
    if (isEditingBill) {
      try {
        setAddingBillingItem(true);

        // Resolve the visit department that owns products for this catalog department
        const allDepts = (visit.departments || []) as Array<{
          id: string;
          department?: { id?: string; name?: string };
          products?: Array<{
            id: string;
            product?: {
              id?: string;
              name?: string;
              clinicPrice?: number | null;
              privateRhicPrice?: number | null;
            };
          }>;
        }>;
        const visitDept = allDepts.find(
          (d) => String(d.department?.id) === String(catalogDepartmentId),
        );

        // Try to get price from existing visit products (in case this product
        // was previously on the visit and is being re-added)
        let basePrice = Number(item.clinicPrice ?? item.privateRhicPrice ?? 0);
        if (basePrice === 0 && visitDept?.products) {
          const existingLine = visitDept.products.find(
            (p) => String(p.product?.id) === String(item.id),
          );
          if (existingLine?.product) {
            basePrice = Number(
              existingLine.product.clinicPrice ??
                existingLine.product.privateRhicPrice ??
                0,
            );
          }
        }

        const deptName = visitDept?.department?.name || "General";
        const tempId = `temp-${item.id}-${Date.now()}`;

        const newBillingItem: BillingItem = {
          id: tempId,
          productId: item.id,
          source: "USER",
          isNewInEditMode: true,
          name: item.name,
          quantity,
          price: basePrice,
          basePrice,
          type: "product",
          visitDepartmentId: visitDept?.id || catalogDepartmentId,
          rootVisitDepartmentId: visitDept?.id || catalogDepartmentId,
          departmentId: catalogDepartmentId,
          departmentName: deptName,
          departmentStatus: undefined,
          paymentStatus: "pending",
          exempted: false,
          exemptionType: "none",
          selectedInsuranceId: undefined,
          doneBy: {
            name: doctor?.firstName || "Doctor",
            title: "",
          },
        };

        setBillingData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: [...prev.items, newBillingItem],
            updatedAt: new Date().toISOString(),
          };
        });

        setShowAddProductModal(false);
        toast.success("Product added (will be saved when edit is submitted)");
      } catch (err) {
        console.error("Failed to add product in edit mode:", err);
        toast.error("Failed to add product. Please try again.");
      } finally {
        setAddingBillingItem(false);
      }
      return;
    }

    // Normal (non-edit) mode: call the backend mutation directly
    try {
      setAddingBillingItem(true);
      const response = await addProduct(
        visit.id,
        catalogDepartmentId,
        item.id,
        quantity,
      );
      if (response?.status === "SUCCESS") {
        // Add the new product to billing data state directly instead of refetching
        if (billingData && response.data) {
          const newProduct = response.data;
          // The backend no longer returns a price on the visit product line —
          // derive the display price from the product catalog in the response.
          const addedLine = (
            (newProduct?.products || []) as Array<{
              id?: string;
              quantity?: number;
              product?: {
                id?: string;
                name?: string;
                clinicPrice?: number | null;
                privateRhicPrice?: number | null;
              };
            }>
          ).find((p) => String(p.product?.id) === String(item.id));
          const catalogProduct = addedLine?.product;
          const basePrice = Number(
            catalogProduct?.clinicPrice ??
              catalogProduct?.privateRhicPrice ??
              0,
          );
          const departmentInfo = visit.departments?.find(
            (d) => d.id === newProduct?.id || d.id === catalogDepartmentId,
          );

          if (!addedLine?.id) {
            // Couldn't locate the newly added line in the response — refetch and
            // remap billing data from the server (with catalog prices) instead.
            await refetchVisit();
            setBillingRemapNonce((nonce) => nonce + 1);
          } else {
            const newBillingItem: BillingItem = {
              id: addedLine.id,
              productId: item.id,
              source: "USER",
              isNewInEditMode: isEditingBill,
              name: catalogProduct?.name || item.name,
              quantity: addedLine.quantity || quantity,
              price: basePrice,
              basePrice,
              type: "product",
              visitDepartmentId: newProduct?.id || catalogDepartmentId,
              rootVisitDepartmentId: newProduct?.id || catalogDepartmentId,
              departmentId: departmentInfo?.department?.id,
              departmentName: departmentInfo?.department?.name || "General",
              departmentStatus: departmentInfo?.status,
              paymentStatus: "pending",
              exempted: false,
              exemptionType: "none",
              selectedInsuranceId: undefined,
              doneBy: {
                name: doctor?.firstName || "Doctor",
                title: "",
              },
            };

            setBillingData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                items: [...prev.items, newBillingItem],
                updatedAt: new Date().toISOString(),
              };
            });
          }
        } else {
          // Fallback to refetch if response data is incomplete
          await refetchVisit();
        }
        setShowAddProductModal(false);
        toast.success("Product added successfully");
      } else {
        const errorMsg =
          response?.messages?.[0]?.text || "Failed to add product";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Failed to add product to visit:", err);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setAddingBillingItem(false);
    }
  };

  return {
    dischargeConfirmOpen,
    setDischargeConfirmOpen,
    requestDischarge,
    handleDischargeVisit,
    handleDownloadInvoice,
    handleRecordPayment,
    handleChangeProfile,
    handlePreviewBilling,
    handleGenerateBill,
    handlePrintBillingInvoice,
    handleAddInsuranceToVisit,
    handleRemoveInsuranceFromVisit,
    handleAddProduct,
  };
}
