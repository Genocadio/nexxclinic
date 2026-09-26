"use client";

import { useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { BillingItem } from "@/lib/billing-utils";
import {
  BillingDepartmentGroup,
} from "./billing/billing-department-group";
import {
  InsuranceCoverageTier,
  InsuranceOption,
} from "./billing/billing-item-row";

export type { InsuranceCoverageTier, InsuranceOption };

export type BillingItemsListProps = {
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
  /** In-flight quantity update — disables the qty stepper to prevent duplicates. */
  quantityUpdating?: boolean;
  /** Map of item IDs to their change type in edit mode. */
  editedItemChanges?: Map<string, "added" | "modified">;
};

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
  quantityUpdating = false,
  editedItemChanges,
}: BillingItemsListProps) {
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
            Object.entries(groupedItems).map(([deptName, deptItems], index) => (
              <BillingDepartmentGroup
                key={`${deptName}-${index}`}
                deptName={deptName}
                deptItems={deptItems}
                availableInsurances={availableInsurances}
                hideDepartmentHeaders={hideDepartmentHeaders}
                hideTypeColumn={hideTypeColumn}
                canEdit={canEdit}
                editMode={editMode}
                quantityUpdating={quantityUpdating}
                editedItemChanges={editedItemChanges}
                colCount={colCount}
                editingQtyId={editingQtyId}
                editQty={editQty}
                qtyInputRef={qtyInputRef}
                onItemChange={onItemChange}
                onItemRemove={onItemRemove}
                onApplyQuantity={applyQuantity}
                onStartEditQty={(item) => {
                  if (quantityUpdating) return;
                  setEditQty(String(item.quantity));
                  setEditingQtyId(item.id);
                  setTimeout(() => qtyInputRef.current?.focus(), 0);
                }}
                onCancelEditQty={() => setEditingQtyId(null)}
                onSetEditQty={setEditQty}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
