"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import {
  BillingItem,
  applyInsuranceSelectionToItem,
  calculateItemTotal,
  getItemInsuranceSplit,
} from "@/lib/billing-utils";
import { formatRWF } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InsuranceOption = {
  id: string;
  providerId: string;
  name: string;
  acronym: string;
  coveragePercentage: number;
};

type BillingItemsListProps = {
  items: BillingItem[];
  onItemChange: (item: BillingItem) => void;
  onItemRemove: (itemId: string) => void;
  onQuantityChange?: (
    item: BillingItem,
    quantity: number,
  ) => void | Promise<void>;
  availableInsurances?: InsuranceOption[];
  hideDepartmentHeaders?: boolean;
  allDepartments?: string[];
  hideTypeColumn?: boolean;
  canEdit?: boolean;
  /** When true all "paid" guards are lifted so Finance can reconfigure everything. */
  editMode?: boolean;
};

const getPaymentStatusColor = (
  status: BillingItem["paymentStatus"] | "exempted",
) => {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-700";
    case "partial":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-700";
    case "exempted":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-700";
    case "pending":
    default:
      return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-700";
  }
};

function computeGroupTotals(
  deptItems: BillingItem[],
  availableInsurances: InsuranceOption[],
) {
  let subtotal = 0;
  let insuranceCoverage = 0;
  let patientResponsibility = 0;

  deptItems.forEach((item) => {
    const selectedInsurance = availableInsurances.find(
      (ins) => ins.id === item.selectedInsuranceId,
    );
    const coveragePct = selectedInsurance?.coveragePercentage || 0;
    const { itemTotal, insuranceAmount, patientAmount, skip } =
      getItemInsuranceSplit(item, coveragePct);

    if (skip) return;
    subtotal += itemTotal;
    insuranceCoverage += insuranceAmount;
    patientResponsibility += patientAmount;
  });

  return { subtotal, insuranceCoverage, patientResponsibility };
}

export function BillingItemsList({
  items,
  onItemChange,
  onItemRemove,
  onQuantityChange,
  availableInsurances = [],
  hideDepartmentHeaders = false,
  allDepartments = [],
  hideTypeColumn = true,
  canEdit = true,
  editMode = false,
}: BillingItemsListProps) {
  // In edit mode items with paymentStatus "paid" are treated as editable.
  // We use this helper instead of checking paymentStatus directly.
  const isPaidLocked = (item: BillingItem) =>
    !editMode && item.paymentStatus === "paid";
  const [editingQtyId, setEditingQtyId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const qtyInputRef = useRef<HTMLInputElement>(null);

  const groupedItems = useMemo(() => {
    const grouped = items.reduce<Record<string, BillingItem[]>>((acc, item) => {
      const deptName = item.departmentName || "General";
      if (!acc[deptName]) acc[deptName] = [];
      acc[deptName].push(item);
      return acc;
    }, {});

    if (allDepartments.length > 0) {
      allDepartments.forEach((dept) => {
        if (!grouped[dept]) grouped[dept] = [];
      });
    }

    return grouped;
  }, [items, allDepartments]);

  const colCount = 1 + (hideTypeColumn ? 0 : 1) + 1 + 1 + 1 + 1 + 1 + 1 + 1;

  const applyQuantity = async (item: BillingItem, nextQty: number) => {
    const quantity = Math.max(1, Math.floor(nextQty));
    if (quantity === item.quantity) return;
    if (onQuantityChange) {
      await onQuantityChange(item, quantity);
    } else {
      onItemChange({ ...item, quantity });
    }
  };

  const renderQuantityCell = (item: BillingItem) => {
    if (isPaidLocked(item) || !onQuantityChange || !canEdit) {
      return <span className="tabular-nums">{item.quantity}</span>;
    }

    return (
      <div className="inline-flex items-center justify-center gap-0.5">
        {item.quantity > 1 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 rounded-full opacity-70 group-hover:opacity-100"
            aria-label="Decrease quantity"
            onClick={() => void applyQuantity(item, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
        )}

        {editingQtyId === item.id ? (
          <Input
            ref={qtyInputRef}
            type="number"
            min={1}
            value={editQty}
            onChange={(e) => setEditQty(e.target.value)}
            onFocus={(e) => e.target.select()}
            onBlur={() => {
              const parsed = parseInt(editQty, 10);
              const next =
                Number.isFinite(parsed) && parsed >= 1 ? parsed : item.quantity;
              void applyQuantity(item, next);
              setEditingQtyId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === "Escape") {
                setEditingQtyId(null);
              }
            }}
            className="w-10 h-6 text-center text-xs tabular-nums px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="min-w-[1.5rem] text-xs tabular-nums font-medium text-center hover:text-primary transition-colors"
            title="Click to edit quantity"
            onClick={() => {
              setEditQty(String(item.quantity));
              setEditingQtyId(item.id);
              setTimeout(() => qtyInputRef.current?.focus(), 0);
            }}
          >
            {item.quantity}
          </button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 rounded-full opacity-70 group-hover:opacity-100"
          aria-label="Increase quantity"
          onClick={() => void applyQuantity(item, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-muted dark:bg-muted/90 text-muted-foreground text-[11px] font-semibold uppercase tracking-wide border-b-2 border-border">
          <tr>
            <th className="py-2.5 px-3 text-left">Item</th>
            {!hideTypeColumn && (
              <th className="py-2.5 px-3 text-center">Type</th>
            )}
            <th className="py-2.5 px-3 text-center w-14">Qty</th>
            <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
            <th className="py-2.5 px-3 text-left w-32">Insurance</th>
            <th className="py-2.5 px-3 text-right w-28">Coverage</th>
            <th className="py-2.5 px-3 text-right w-28">Patient</th>
            <th className="py-2.5 px-3 text-right w-28">Total</th>
            <th className="py-2.5 px-3 text-center w-24">Status</th>
            <th className="py-2.5 px-3 text-center w-36">Actions</th>
          </tr>
        </thead>
        <tbody suppressHydrationWarning>
          {items.length === 0 && allDepartments.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No items to bill</p>
                </div>
              </td>
            </tr>
          ) : (
            Object.entries(groupedItems).map(([deptName, deptItems], index) => {
              const meta = deptItems[0];
              const completedTime = meta?.departmentCompletedTime;
              const groupTotals = computeGroupTotals(
                deptItems,
                availableInsurances,
              );

              return (
                <Fragment key={`${deptName}-${index}`}>
                  {!hideDepartmentHeaders && (
                    <tr className="bg-muted/60 dark:bg-muted/40 border-y border-border">
                      <td colSpan={colCount} className="py-2 px-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-foreground">
                            {deptName}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-5 rounded-full"
                            >
                              {completedTime ? "Completed" : "In progress"}
                            </Badge>
                            {completedTime && (
                              <span>
                                {new Date(completedTime).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {deptItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={colCount}
                        className="py-4 text-center text-xs text-muted-foreground italic"
                      >
                        No items in this category
                      </td>
                    </tr>
                  ) : (
                    Object.entries(
                      deptItems.reduce<Record<string, BillingItem[]>>(
                        (acc, item) => {
                          const key = item.childDepartmentName || "__parent__";
                          if (!acc[key]) acc[key] = [];
                          acc[key].push(item);
                          return acc;
                        },
                        {},
                      ),
                    ).map(([childGroup, childItems]) => (
                      <Fragment key={`${deptName}-${childGroup}`}>
                        {childGroup !== "__parent__" && (
                          <tr className="bg-muted/30 border-b border-border/70">
                            <td
                              colSpan={colCount}
                              className="py-1.5 px-3 text-[11px] text-muted-foreground"
                            >
                              {deptName} / {childGroup}
                            </td>
                          </tr>
                        )}
                        {childItems.map((item) => {
                          const itemTotal = calculateItemTotal(item);
                          const exemptionType =
                            item.exemptionType ||
                            (item.exempted ? "full" : "none");
                          const isExempted = exemptionType !== "none";

                          const selectedInsurance = availableInsurances.find(
                            (ins) => ins.id === item.selectedInsuranceId,
                          );
                          const coveragePct =
                            selectedInsurance?.coveragePercentage || 0;
                          const { insuranceAmount, patientAmount } =
                            getItemInsuranceSplit(item, coveragePct);
                          const statusLabel =
                            exemptionType === "full"
                              ? "Exempted"
                              : exemptionType === "patient-share"
                                ? "Share waived"
                                : item.paymentStatus;

                          return (
                            <tr
                              key={item.id}
                              suppressHydrationWarning
                              className={`group border-b border-border hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors ${
                                isExempted
                                  ? "bg-purple-50 dark:bg-purple-950/20"
                                  : ""
                              } ${isPaidLocked(item) ? "opacity-70" : ""}`}
                            >
                              <td className="py-2 px-3">
                                <p className="font-medium text-foreground text-sm leading-tight">
                                  {item.name}
                                </p>
                                {item.source === "PROFILE" && (
                                  <p className="mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] px-1.5 py-0 h-4 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                                    >
                                      From profile
                                    </Badge>
                                  </p>
                                )}
                                {item.childDepartmentName && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Service: {item.childDepartmentName}
                                  </p>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {item.doneBy.name}
                                </p>
                                {item.basePrice !== undefined &&
                                  item.price !== item.basePrice &&
                                  !item.insuranceNotCovered && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Private: {formatRWF(item.basePrice)}
                                    </p>
                                  )}
                              </td>
                              {!hideTypeColumn && (
                                <td className="py-2 px-3 text-center">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-5 rounded-full"
                                  >
                                    Product
                                  </Badge>
                                </td>
                              )}
                              <td className="py-2 px-3 text-center">
                                {renderQuantityCell(item)}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex flex-col items-end gap-0.5">
                                  <span className="tabular-nums text-sm">
                                    {formatRWF(item.price)}
                                  </span>
                                  {!item.selectedInsuranceId ? (
                                    <span className="text-[10px] text-muted-foreground">
                                      Private
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground">
                                      Coverage price
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <Select
                                  value={item.selectedInsuranceId || "none"}
                                  onValueChange={(value) => {
                                    const visitInsuranceId =
                                      value === "none" ? undefined : value;
                                    const providerId = visitInsuranceId
                                      ? availableInsurances.find(
                                          (ins) => ins.id === visitInsuranceId,
                                        )?.providerId
                                      : undefined;
                                    onItemChange(
                                      applyInsuranceSelectionToItem(
                                        item,
                                        visitInsuranceId,
                                        providerId,
                                      ),
                                    );
                                  }}
                                  disabled={
                                    availableInsurances.length === 0 ||
                                    isPaidLocked(item)
                                  }
                                >
                                  <SelectTrigger className="h-7 text-[11px] border-0 bg-transparent shadow-none px-1">
                                    <SelectValue
                                      placeholder={
                                        availableInsurances.length === 0
                                          ? "Enable on visit"
                                          : "Private"
                                      }
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">
                                      Private (none)
                                    </SelectItem>
                                    {availableInsurances.map((insurance) => (
                                      <SelectItem
                                        key={insurance.id}
                                        value={insurance.id}
                                      >
                                        {insurance.acronym || insurance.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {availableInsurances.length === 0 &&
                                  !item.selectedInsuranceId && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Check patient insurances above
                                    </p>
                                  )}
                                {item.selectedInsuranceId &&
                                  item.insuranceNotCovered && (
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                                      Not covered
                                    </p>
                                  )}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums text-sm">
                                {item.selectedInsuranceId &&
                                item.insuranceNotCovered ? (
                                  <span className="text-amber-600 dark:text-amber-400 text-[11px]">
                                    Not covered
                                  </span>
                                ) : item.selectedInsuranceId &&
                                  insuranceAmount > 0 ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                    {formatRWF(insuranceAmount)}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums font-medium text-sm">
                                {formatRWF(patientAmount)}
                              </td>
                              <td className="py-2 px-3 text-right tabular-nums font-semibold text-sm">
                                {formatRWF(itemTotal)}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <Badge
                                  variant="outline"
                                  className={`${getPaymentStatusColor(isExempted ? "exempted" : item.paymentStatus)} rounded-full text-[10px] px-1.5 py-0 h-5 capitalize`}
                                >
                                  {statusLabel}
                                </Badge>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center justify-center gap-1">
                                  <Select
                                    value={exemptionType}
                                    onValueChange={(value) => {
                                      const updated = {
                                        ...item,
                                        exemptionType:
                                          value as typeof item.exemptionType,
                                      };
                                      updated.exempted = value !== "none";
                                      if (value === "none") {
                                        updated.exemptionReason = undefined;
                                        updated.paymentStatus =
                                          item.paymentStatus === "exempted"
                                            ? "pending"
                                            : item.paymentStatus;
                                      } else {
                                        updated.paymentStatus = "exempted";
                                      }
                                      onItemChange(updated);
                                    }}
                                    disabled={isPaidLocked(item)}
                                  >
                                    <SelectTrigger className="h-7 text-[10px] w-[7.5rem]">
                                      <SelectValue placeholder="Exemption" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        No exemption
                                      </SelectItem>
                                      {availableInsurances.length > 0 && (
                                        <SelectItem value="patient-share">
                                          Waive patient share
                                        </SelectItem>
                                      )}
                                      <SelectItem value="full">
                                        Full exemption
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {canEdit && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onItemRemove(item.id)}
                                      disabled={
                                        isPaidLocked(item) ||
                                        item.source === "PROFILE"
                                      }
                                      title={
                                        item.source === "PROFILE"
                                          ? "Profile products cannot be removed individually — change the visit department's profile instead"
                                          : "Remove item"
                                      }
                                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10 disabled:opacity-30"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    ))
                  )}
                  {!hideDepartmentHeaders && deptItems.length > 0 && (
                    <tr className="bg-muted/50 dark:bg-muted/30 border-y border-border">
                      <td
                        colSpan={4}
                        className="py-1.5 px-3 text-[10px] text-muted-foreground text-right font-medium"
                      >
                        {deptName} subtotal
                      </td>
                      <td className="py-1.5 px-3 text-right text-[11px] tabular-nums text-emerald-700 dark:text-emerald-400 font-medium">
                        {groupTotals.insuranceCoverage > 0
                          ? formatRWF(groupTotals.insuranceCoverage)
                          : "—"}
                      </td>
                      <td className="py-1.5 px-3 text-right text-[11px] tabular-nums font-semibold">
                        {formatRWF(groupTotals.patientResponsibility)}
                      </td>
                      <td className="py-1.5 px-3 text-right text-[11px] tabular-nums font-bold">
                        {formatRWF(groupTotals.subtotal)}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  )}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
