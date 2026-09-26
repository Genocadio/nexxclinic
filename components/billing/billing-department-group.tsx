"use client";

import React, { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { formatRWF } from "@/lib/utils";
import {
  BillingItem,
  calculateItemTotal,
  getItemInsuranceSplit,
} from "@/lib/billing-utils";
import {
  BillingItemRow,
  InsuranceOption,
  resolveEffectiveCoveragePct,
} from "./billing-item-row";

export interface BillingDepartmentGroupProps {
  deptName: string;
  deptItems: BillingItem[];
  availableInsurances: InsuranceOption[];
  hideDepartmentHeaders?: boolean;
  hideTypeColumn?: boolean;
  canEdit?: boolean;
  editMode?: boolean;
  quantityUpdating?: boolean;
  editedItemChanges?: Map<string, "added" | "modified">;
  colCount: number;
  editingQtyId: string | null;
  editQty: string;
  qtyInputRef: React.RefObject<HTMLInputElement | null>;
  onItemChange: (item: BillingItem) => void;
  onItemRemove: (itemId: string) => void;
  onApplyQuantity: (item: BillingItem, nextQty: number) => Promise<void>;
  onStartEditQty: (item: BillingItem) => void;
  onCancelEditQty: () => void;
  onSetEditQty: (val: string) => void;
}

export function computeGroupTotals(
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
    const coveragePct = resolveEffectiveCoveragePct(item, selectedInsurance);
    const { itemTotal, insuranceAmount, patientAmount, skip } =
      getItemInsuranceSplit(item, coveragePct);

    if (skip) return;
    subtotal += itemTotal;
    insuranceCoverage += insuranceAmount;
    patientResponsibility += patientAmount;
  });

  return { subtotal, insuranceCoverage, patientResponsibility };
}

export function BillingDepartmentGroup({
  deptName,
  deptItems,
  availableInsurances,
  hideDepartmentHeaders = false,
  hideTypeColumn = true,
  canEdit = true,
  editMode = false,
  quantityUpdating = false,
  editedItemChanges,
  colCount,
  editingQtyId,
  editQty,
  qtyInputRef,
  onItemChange,
  onItemRemove,
  onApplyQuantity,
  onStartEditQty,
  onCancelEditQty,
  onSetEditQty,
}: BillingDepartmentGroupProps) {
  const meta = deptItems[0];
  const completedTime = meta?.departmentCompletedTime;
  const groupTotals = computeGroupTotals(deptItems, availableInsurances);

  return (
    <>
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
                    {new Date(completedTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
          deptItems.reduce<Record<string, BillingItem[]>>((acc, item) => {
            const key = item.childDepartmentName || "__parent__";
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          }, {}),
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
            {childItems.map((item) => (
              <BillingItemRow
                key={item.id}
                item={item}
                availableInsurances={availableInsurances}
                hideTypeColumn={hideTypeColumn}
                canEdit={canEdit}
                editMode={editMode}
                quantityUpdating={quantityUpdating}
                editedItemChanges={editedItemChanges}
                editingQtyId={editingQtyId}
                editQty={editQty}
                qtyInputRef={qtyInputRef}
                onItemChange={onItemChange}
                onItemRemove={onItemRemove}
                onApplyQuantity={onApplyQuantity}
                onStartEditQty={onStartEditQty}
                onCancelEditQty={onCancelEditQty}
                onSetEditQty={onSetEditQty}
              />
            ))}
          </Fragment>
        ))
      )}

      {/* Department totals summary row */}
      {deptItems.length > 0 && !hideDepartmentHeaders && (
        <tr className="bg-muted/20 border-b-2 border-border/80 text-xs">
          <td
            colSpan={colCount - 5}
            className="py-2 px-3 font-semibold text-muted-foreground text-right"
          >
            {deptName} Subtotal:
          </td>
          <td />
          <td className="py-2 px-3 text-right font-medium text-emerald-700 dark:text-emerald-400">
            {formatRWF(groupTotals.insuranceCoverage)}
          </td>
          <td className="py-2 px-3 text-right font-bold text-foreground">
            {formatRWF(groupTotals.patientResponsibility)}
          </td>
          <td className="py-2 px-3 text-right font-bold text-foreground">
            {formatRWF(groupTotals.subtotal)}
          </td>
          <td colSpan={2} />
        </tr>
      )}
    </>
  );
}
