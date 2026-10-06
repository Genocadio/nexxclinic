"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, ChevronDown, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import type { Visit, VisitBilling, VisitDepartment } from "@/lib/api-types";
import { BillingData, BillingItem, getItemInsuranceSplit } from "@/lib/billing-utils";
import { getVisitBillingTotals } from "@/lib/visit-billing-utils";
import { formatRWF } from "@/lib/utils";
import { roundMoney, sumMoney } from "@/lib/money";

// Small color-coded dot per visit-department status (kept as an icon badge
// instead of the old full status text line, which made the list huge).
const STATUS_DOT_CLASS: Record<string, string> = {
  COMPLETED: "bg-emerald-500",
  DISCHARGED: "bg-emerald-500",
  ACTIVE: "bg-sky-500",
  BILLING: "bg-[#FF6900]",
  PENDING: "bg-amber-500",
  ON_HOLD: "bg-violet-500",
  CANCELLED: "bg-rose-500",
  CANCELED: "bg-rose-500",
};

type InvoicePreviewGroup = {
  id?: string;
  status: string;
  label?: string;
  insuranceLabel?: string;
  hasInsurance?: boolean;
  totalAmount: number;
  insuranceCoveredAmount: number;
  patientPayableAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  waivedAmount?: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    departmentName: string;
    isExempted?: boolean;
    exemptionType?: string;
    rawAmount?: number;
    waivedAmount?: number;
  }[];
};

interface BillingPreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit?: Visit | null;
  billingData?: BillingData | null;
  visitBilling?: VisitBilling | null;
  selectedDepartmentId?: string | null;
  getCoveragePercentage?: (item: BillingItem) => number;
  onDepartmentSelect?: (departmentId: string) => void;
  previewStartedAt?: number | null;
  onPrintInvoice?: (departmentInsuranceBillingId: string, copyType?: string) => Promise<void>;
  onDownloadInvoice?: (departmentInsuranceBillingId: string, copyType?: string) => Promise<void>;
  onViewMore?: () => void;
  canViewMore?: boolean;
  printingInvoice?: boolean;
  isEditMode?: boolean;
  scopeToSelectedDepartment?: boolean;
}

export function BillingPreviewSheet({
  open,
  onOpenChange,
  visit,
  billingData,
  visitBilling,
  selectedDepartmentId,
  getCoveragePercentage,
  onDepartmentSelect,
  onPrintInvoice,
  onDownloadInvoice,
  onViewMore,
  canViewMore = false,
  printingInvoice = false,
  isEditMode = false,
  scopeToSelectedDepartment = false,
}: BillingPreviewSheetProps) {
  const [isRendered, setIsRendered] = useState(open);
  const [selectedDepartmentIdState, setSelectedDepartmentIdState] = useState<
    string | null
  >(selectedDepartmentId ?? null);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsRendered(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedDepartmentIdState(selectedDepartmentId ?? null);
      return;
    }
  }, [open, selectedDepartmentId]);

  const topLevelDepartments = useMemo(() => {
    const depts = visit?.departments || [];
    if (scopeToSelectedDepartment) {
      const targetId = selectedDepartmentId ?? selectedDepartmentIdState;
      if (targetId) {
        const match = depts.find(
          (d) =>
            d.id === targetId ||
            (d.childVisitDepartments &&
              d.childVisitDepartments.some((c) => c.id === targetId)),
        );
        if (match) return [match];
      }
    }
    return depts;
  }, [
    visit?.departments,
    scopeToSelectedDepartment,
    selectedDepartmentId,
    selectedDepartmentIdState,
  ]);

  useEffect(() => {
    if (!open || !topLevelDepartments.length) return;
    if (selectedDepartmentIdState) return;

    setSelectedDepartmentIdState(topLevelDepartments[0].id);
    onDepartmentSelect?.(topLevelDepartments[0].id);
  }, [
    open,
    topLevelDepartments,
    selectedDepartmentIdState,
    onDepartmentSelect,
  ]);

  const activeDepartmentId = selectedDepartmentId ?? selectedDepartmentIdState;
  const activeDepartment = useMemo(
    () =>
      topLevelDepartments.find((dept) => dept.id === activeDepartmentId) ||
      topLevelDepartments[0] ||
      null,
    [topLevelDepartments, activeDepartmentId],
  );

  const invoiceGroups = useMemo(() => {
    if (!activeDepartment) return [];

    const collectDeptIds = (dept: VisitDepartment) => {
      const ids: string[] = [];
      const stack = [dept];
      while (stack.length) {
        const cur = stack.shift();
        if (!cur) continue;
        ids.push(String(cur.id));
        if (
          cur.childVisitDepartments &&
          Array.isArray(cur.childVisitDepartments)
        ) {
          stack.push(...cur.childVisitDepartments);
        }
      }
      return ids;
    };

    const deptIds = collectDeptIds(activeDepartment);

    // A billed visit previews the actual invoice. The draft path is only used
    // before any bill exists, or while editing (the page passes visitBilling
    // as null in edit mode so the pending edits are previewed instead).
    if (visitBilling) {
      let depts = (visitBilling.departments || []).filter((d) =>
        deptIds.includes(String(d.visitDepartment?.id || d.id)),
      );
      if (!depts.length && !scopeToSelectedDepartment && !selectedDepartmentId) {
        depts = visitBilling.departments || [];
      }

      const groups: InvoicePreviewGroup[] = [];
      for (const d of depts) {
        const insuranceBillings = d.insuranceBillings || [];
        for (const ib of insuranceBillings) {
          let groupWaivedAmount = 0;
          const mappedItems = (ib.items || []).map((it, idx) => {
            const isExempted = it.patientShareSource === "EXEMPTED";
            const unitPrice = Number(it.unitPriceSnapshot || 0);
            const qty = Number(it.quantitySnapshot || 1);
            const rawTotal = roundMoney(unitPrice * qty);
            const insCovered = Number(it.insuranceCoveredAmount || 0);
            const lineWaived = isExempted ? Math.max(0, rawTotal - insCovered) : 0;
            groupWaivedAmount += lineWaived;
            return {
              id: it.id || `item-${d.id}-${idx}`,
              name: it.productName || "Item",
              quantity: qty,
              price: unitPrice,
              rawAmount: rawTotal,
              isExempted,
              waivedAmount: lineWaived,
              departmentName:
                d.visitDepartment.department?.name ||
                activeDepartment?.department?.name ||
                "Department",
            };
          });

          const insName =
            ib.patientInsurance?.insuranceProvider?.insuranceName ||
            ib.patientInsurance?.insuranceProvider?.name ||
            ib.patientInsurance?.insuranceProvider?.acronym ||
            "";
          const hasIns = Boolean(ib.patientInsurance != null);

          groups.push({
            id: ib.id,
            status: ib.status,
            label: ib.status ? `${ib.status}` : "Invoice",
            insuranceLabel: insName || (hasIns ? "Insurance" : "Private"),
            hasInsurance: hasIns,
            totalAmount: Number(ib.totalAmount || 0),
            insuranceCoveredAmount: Number(ib.insuranceCoveredAmount || 0),
            patientPayableAmount: Number(ib.patientPayableAmount || 0),
            paidAmount: Number(ib.paidAmount || 0),
            outstandingAmount: Number(ib.outstandingAmount || 0),
            waivedAmount: groupWaivedAmount,
            items: mappedItems,
          });
        }
      }
      return groups;
    }

    if (!billingData) return [];

    let draftWaivedTotal = 0;
    let draftInsuranceCoveredTotal = 0;
    let draftPatientPayableTotal = 0;
    let detectedInsuranceName: string | null = null;
    let hasDraftInsurance = false;

    const items = billingData.items
      .filter((item) => {
        const itemRootId = String(
          item.rootVisitDepartmentId || item.visitDepartmentId || "",
        );
        return deptIds.includes(itemRootId);
      })
      .map((it) => {
        const exemptionType = it.exemptionType || (it.exempted ? "full" : "none");
        const isExempted = exemptionType !== "none";
        const unitPrice = it.price ?? it.basePrice ?? 0;
        const qty = it.quantity ?? 1;
        const rawTotal = roundMoney(unitPrice * qty);
        const coveragePct = getCoveragePercentage ? getCoveragePercentage(it) : 0;
        const split = getItemInsuranceSplit(it, coveragePct);
        const lineWaived = isExempted ? split.waivedAmount : 0;
        draftWaivedTotal += lineWaived;
        if (!isExempted || exemptionType === "patient-share") {
          draftInsuranceCoveredTotal += split.insuranceAmount;
        }
        if (!isExempted) {
          draftPatientPayableTotal += split.patientAmount;
        }
        if (it.selectedInsuranceId) {
          hasDraftInsurance = true;
          if (!detectedInsuranceName && visit?.patient?.patientInsurances) {
            const pi = visit.patient.patientInsurances.find(
              (p) => String(p.id) === String(it.selectedInsuranceId),
            );
            if (pi?.insuranceProvider) {
              detectedInsuranceName =
                pi.insuranceProvider.insuranceName ||
                pi.insuranceProvider.name ||
                pi.insuranceProvider.acronym ||
                null;
            }
          }
        }
        return {
          id: it.id,
          name: it.name,
          quantity: qty,
          price: unitPrice,
          rawAmount: rawTotal,
          isExempted,
          exemptionType,
          waivedAmount: lineWaived,
          departmentName: activeDepartment.department?.name || ("" as string),
          groupLabel: "Invoice",
        };
      });
    const computedTotal = sumMoney(
      items
        .filter((it) => !it.isExempted)
        .map((it: { price: number; quantity: number }) =>
          roundMoney(it.price * it.quantity),
        ),
    );
    const draftGroups: InvoicePreviewGroup[] =
      items.length > 0
        ? [
            {
              id: "draft-invoice",
              label: "Invoice",
              insuranceLabel:
                detectedInsuranceName ||
                (hasDraftInsurance ? "Insurance" : "Private"),
              hasInsurance: hasDraftInsurance,
              status: "",
              totalAmount: computedTotal,
              insuranceCoveredAmount: draftInsuranceCoveredTotal,
              patientPayableAmount: draftPatientPayableTotal,
              paidAmount: 0,
              outstandingAmount: draftPatientPayableTotal,
              waivedAmount: draftWaivedTotal,
              items: items.map(
                ({ groupLabel: _groupLabel, ...item }) => item,
              ),
            },
          ]
        : [];
    return draftGroups;
  }, [billingData, activeDepartment, visitBilling, getCoveragePercentage, visit]);

  const departmentTotal = sumMoney(invoiceGroups.map((g) => g.totalAmount));
  const departmentPaid = sumMoney(invoiceGroups.map((g) => g.paidAmount));
  const departmentOutstanding = sumMoney(
    invoiceGroups.map((g) => g.outstandingAmount),
  );
  const showOverallDepartmentTotals = invoiceGroups.length > 1;
  const visitBillingTotals = visitBilling
    ? getVisitBillingTotals(visitBilling)
    : null;
  const showExistingBillSummary = Boolean(
    visitBilling &&
      visitBillingTotals &&
      invoiceGroups.length === 0 &&
      !scopeToSelectedDepartment,
  );
  const allItemsCount = invoiceGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  const patientName = visit
    ? `${visit.patient?.firstName || ""} ${visit.patient?.lastName || ""}`.trim()
    : "Patient";

  const canShowList = !scopeToSelectedDepartment && topLevelDepartments.length > 1;
  const invoiceDate =
    visitBilling?.updatedAt ||
    billingData?.updatedAt ||
    visit?.visitDate ||
    new Date().toISOString();
  // All invoice groups that have a real backend id — a department can carry
  // several insurance billings (e.g. private + insurer), each its own invoice.
  const printableInvoiceGroups = useMemo(
    () => invoiceGroups.filter((group) => Boolean(group.id)),
    [invoiceGroups],
  );

  const handlePrintInvoice = async (groupId?: string, copyType?: string) => {
    const target = groupId
      ? printableInvoiceGroups.find((group) => group.id === groupId)
      : printableInvoiceGroups[0];

    if (!target?.id) {
      toast.warn(
        "No generated invoice is available for this department yet.",
      );
      return;
    }

    try {
      if (onPrintInvoice) {
        await onPrintInvoice(target.id, copyType);
        return;
      } else if (onDownloadInvoice) {
        await onDownloadInvoice(target.id, copyType);
        return;
      }

      throw new Error("Invoice printing is not configured for this preview.");
    } catch (err: unknown) {
      console.error("Print invoice error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to print invoice";
      toast.error(message);
    }
  };

  if (!isRendered || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[88] pointer-events-none">
      <div
        className={`absolute inset-0 bg-slate-950/40 transition-opacity duration-200 pointer-events-auto ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Billing Invoice Preview"
        className={`absolute right-0 top-0 h-full w-[min(92vw,72rem)] border-l border-border bg-background dark:bg-slate-900 shadow-2xl transition-transform duration-200 ease-out pointer-events-auto ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative flex h-full flex-col">
          {/* Compact close — the old full header (title/department/patient/date)
              was redundant with the invoice body and wasted panel space. */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Departments as a horizontal, scrollable chip strip — replaces the
              vertical sidebar list + "Departments" heading. */}
          {canShowList && (
            <div className="no-print flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border/70 px-3 py-2">
              {topLevelDepartments.map((department) => {
                const isActive = department.id === activeDepartment?.id;
                const dot =
                  STATUS_DOT_CLASS[
                    String(department.status || "").toUpperCase()
                  ] || "bg-slate-400";
                return (
                  <button
                    key={department.id}
                    type="button"
                    title={department.status || undefined}
                    onClick={() => {
                      setSelectedDepartmentIdState(department.id);
                      onDepartmentSelect?.(department.id);
                    }}
                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#FF6900] text-white shadow-sm"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-white" : dot}`}
                      aria-hidden="true"
                    />
                    {department.department?.name || "Department"}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            <style>{`@media print { .invoice-container { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; } .no-print { display: none !important; } .invoice-container { box-shadow: none !important; border: none !important; } }`}</style>

            <div className="invoice-container flex w-full">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4 py-4">
                  <div className="space-y-6 pr-4">
                    <div className="flex items-center justify-end gap-2 pr-12 no-print">
                      {canViewMore && onViewMore && (
                        <button
                          type="button"
                          onClick={onViewMore}
                          className="px-3 py-1 rounded-md border border-border bg-background text-foreground hover:bg-muted"
                        >
                          View more
                        </button>
                      )}
                      {visitBilling && printableInvoiceGroups.length > 0 && !isEditMode &&
                        (printableInvoiceGroups.length === 1 && !printableInvoiceGroups[0].hasInsurance ? (
                          <button
                            type="button"
                            onClick={() => void handlePrintInvoice(printableInvoiceGroups[0].id, "PATIENT")}
                            disabled={printingInvoice}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Printer className="h-4 w-4" />
                            {printingInvoice
                              ? "Preparing invoice…"
                              : "Print invoice"}
                          </button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                disabled={printingInvoice}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                <Printer className="h-4 w-4" />
                                {printingInvoice
                                  ? "Preparing invoice…"
                                  : "Print invoice"}
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            {/* The menu portals to document.body, so it needs a
                                z above the sheet's z-[88] container or it would
                                render behind the panel and be unclickable. */}
                            <DropdownMenuContent
                              align="end"
                              className="w-80 z-[100]"
                            >
                              {printableInvoiceGroups.map((group) => {
                                const hasIns = Boolean(group.hasInsurance);
                                return (
                                  <div key={group.id} className="p-1 border-b last:border-b-0 border-border/50">
                                    {hasIns ? (
                                      <>
                                        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                          {group.insuranceLabel || "Insurance"}
                                        </div>
                                        <DropdownMenuItem
                                          disabled={printingInvoice}
                                          onSelect={() =>
                                            void handlePrintInvoice(group.id, "INSURANCE")
                                          }
                                          className="cursor-pointer"
                                        >
                                          <span className="truncate">📄 Insurer Copy (Claim)</span>
                                          <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                            {formatRWF(group.insuranceCoveredAmount)}
                                          </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          disabled={printingInvoice}
                                          onSelect={() =>
                                            void handlePrintInvoice(group.id, "PATIENT")
                                          }
                                          className="cursor-pointer"
                                        >
                                          <span className="truncate">🧾 Patient Receipt & Statement</span>
                                          <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                            {formatRWF(group.patientPayableAmount)}
                                          </span>
                                        </DropdownMenuItem>
                                      </>
                                    ) : (
                                      <DropdownMenuItem
                                        disabled={printingInvoice}
                                        onSelect={() =>
                                          void handlePrintInvoice(group.id, "PATIENT")
                                        }
                                        className="cursor-pointer"
                                      >
                                        <span className="truncate">🧾 {group.label || "Invoice"}</span>
                                        <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                          {formatRWF(group.totalAmount)}
                                        </span>
                                      </DropdownMenuItem>
                                    )}
                                  </div>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="py-1 border-b border-border">
                        <strong>Patient:</strong> {patientName || "N/A"}
                      </div>
                      <div className="py-1 border-b border-border">
                        <strong>Department:</strong>{" "}
                        {activeDepartment?.department?.name || "General"}
                      </div>
                      <div className="py-1 border-b border-border">
                        <strong>Insurance:</strong>{" "}
                        {invoiceGroups.length === 1
                          ? invoiceGroups[0].insuranceLabel
                          : "Multiple"}
                      </div>
                      <div className="py-1 border-b border-border">
                        <strong>Invoice Date:</strong>{" "}
                        {new Date(invoiceDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="border-b border-border pb-2">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            Invoice items
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {allItemsCount} item{allItemsCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      {invoiceGroups.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No billable items found for this department.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {invoiceGroups.map((group, groupIndex) => (
                            <div
                              key={group.id || groupIndex}
                              className="border border-border"
                            >
                              <div className="border-b border-border bg-slate-50 px-3 py-2 text-sm font-semibold text-foreground dark:bg-slate-800">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    {invoiceGroups.length > 1
                                      ? `Invoice option ${groupIndex + 1}`
                                      : "Invoice"}
                                    {group.status ? ` • ${group.status}` : ""}
                                    {group.insuranceLabel
                                      ? ` • ${group.insuranceLabel}`
                                      : ""}
                                  </div>
                                  {group.id && !isEditMode ? (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {Boolean(
                                        group.insuranceCoveredAmount > 0 ||
                                          group.insuranceLabel,
                                      ) ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              void (
                                                onDownloadInvoice ||
                                                onPrintInvoice
                                              )?.(group.id!, "INSURANCE")
                                            }
                                            disabled={printingInvoice}
                                            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                                            title="Download contracted insurer claim copy"
                                          >
                                            Insurer Claim
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              void (
                                                onDownloadInvoice ||
                                                onPrintInvoice
                                              )?.(group.id!, "PATIENT")
                                            }
                                            disabled={printingInvoice}
                                            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                                            title="Download patient receipt and billing statement"
                                          >
                                            Patient Receipt
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            void (
                                              onDownloadInvoice ||
                                              onPrintInvoice
                                            )?.(group.id!, "PATIENT")
                                          }
                                          disabled={printingInvoice}
                                          className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                                        >
                                          Download invoice
                                        </button>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                              <table className="w-full border-collapse text-sm">
                                <thead className="bg-transparent">
                                  <tr>
                                    <th className="border-b border-border px-3 py-2 text-left font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                      Description
                                    </th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                      Qty
                                    </th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                      Unit
                                    </th>
                                    <th className="border-b border-border px-3 py-2 text-right font-semibold text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                      Amount
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.items.map((item) => (
                                    <tr
                                      key={item.id}
                                      className={`even:bg-slate-50 dark:even:bg-slate-900/50 ${item.isExempted ? "bg-purple-50/40 dark:bg-purple-950/20" : ""}`}
                                    >
                                      <td className="border-b border-border px-3 py-2 text-sm text-foreground">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span>{item.name}</span>
                                          {item.isExempted && (
                                            <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800">
                                              Waived
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm text-foreground">
                                        {item.quantity}
                                      </td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm text-foreground">
                                        {formatRWF(item.price)}
                                      </td>
                                      <td className="border-b border-border px-3 py-2 text-right text-sm font-semibold text-foreground">
                                        {item.isExempted ? (
                                          <div>
                                            <span className="line-through text-muted-foreground text-xs block">
                                              {formatRWF(
                                                item.waivedAmount !== undefined && item.waivedAmount > 0
                                                  ? item.waivedAmount
                                                  : item.rawAmount || roundMoney(item.price * item.quantity),
                                              )}
                                            </span>
                                            <span className="text-purple-700 dark:text-purple-400 text-xs font-semibold">
                                              0 RWF (Waived)
                                            </span>
                                          </div>
                                        ) : (
                                          formatRWF(
                                            roundMoney(
                                              item.price * item.quantity,
                                            ),
                                          )
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="grid gap-2 sm:grid-cols-2 p-3 text-sm">
                                <div className="py-1">
                                  <strong>Total billed:</strong>{" "}
                                  {formatRWF(group.totalAmount)}
                                </div>
                                {group.insuranceCoveredAmount > 0 && (
                                  <div className="py-1 text-emerald-700 dark:text-emerald-400">
                                    <strong>Insurance:</strong>{" "}
                                    {formatRWF(group.insuranceCoveredAmount)}
                                  </div>
                                )}
                                {Boolean(group.waivedAmount && group.waivedAmount > 0) && (
                                  <div className="py-1 text-purple-700 dark:text-purple-400">
                                    <strong>Waived:</strong>{" "}
                                    −{formatRWF(group.waivedAmount!)}
                                  </div>
                                )}
                                <div className="py-1">
                                  <strong>Patient payable:</strong>{" "}
                                  {formatRWF(group.patientPayableAmount)}
                                </div>
                                <div className="py-1">
                                  <strong>Paid:</strong>{" "}
                                  {formatRWF(group.paidAmount)}
                                </div>
                                {group.outstandingAmount > 0 && (
                                  <div className="py-1 text-orange-600 dark:text-orange-400">
                                    <strong>Outstanding:</strong>{" "}
                                    {formatRWF(group.outstandingAmount)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {showOverallDepartmentTotals && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">
                          Department overall summary
                        </p>
                        <div className="mt-1">
                          <div className="py-1 border-b border-border">
                            <strong>Total billed:</strong>{" "}
                            <span className="float-right">
                              {formatRWF(departmentTotal)}
                            </span>
                          </div>
                          <div className="py-1 border-b border-border">
                            <strong>Paid:</strong>{" "}
                            <span className="float-right">
                              {formatRWF(departmentPaid)}
                            </span>
                          </div>
                          <div className="py-1 border-b border-border">
                            <strong>Outstanding:</strong>{" "}
                            <span className="float-right">
                              {formatRWF(departmentOutstanding)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {showExistingBillSummary && visitBillingTotals && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div className="py-1 border-b border-border">
                          <strong>Total billed:</strong>{" "}
                          <span className="float-right">
                            {formatRWF(visitBillingTotals.totalAmount)}
                          </span>
                        </div>
                        {visitBillingTotals.insuranceCoveredAmount > 0 && (
                          <div className="py-1 border-b border-border text-emerald-600 dark:text-emerald-400">
                            <strong>Insurance:</strong>{" "}
                            <span className="float-right">
                              {formatRWF(visitBillingTotals.insuranceCoveredAmount)}
                            </span>
                          </div>
                        )}
                        {Boolean(visitBillingTotals.waivedAmount && visitBillingTotals.waivedAmount > 0) && (
                          <div className="py-1 border-b border-border text-purple-600 dark:text-purple-400 font-medium">
                            <strong>Waived:</strong>{" "}
                            <span className="float-right">
                              −{formatRWF(visitBillingTotals.waivedAmount!)}
                            </span>
                          </div>
                        )}
                        <div className="py-1 border-b border-border">
                          <strong>Patient payable:</strong>{" "}
                          <span className="float-right">
                            {formatRWF(visitBillingTotals.patientPayableAmount)}
                          </span>
                        </div>
                        <div className="py-1 border-b border-border">
                          <strong>Paid:</strong>{" "}
                          <span className="float-right">
                            {formatRWF(visitBillingTotals.paidAmount)}
                          </span>
                        </div>
                        <div className="py-1 border-b border-border">
                          <strong>Outstanding:</strong>{" "}
                          <span className="float-right">
                            {formatRWF(visitBillingTotals.outstandingAmount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
