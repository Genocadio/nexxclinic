"use client";

import { Pencil } from "lucide-react";
import type { ComponentProps } from "react";
import { BillingItemsList } from "@/components/BillingItemsList";
import type { BillingItem } from "@/lib/billing-utils";
import type { VisitDepartment } from "@/lib/api-types";

type BillingInsuranceOption = NonNullable<
  ComponentProps<typeof BillingItemsList>["availableInsurances"]
>[number];

type BillingItemsWorkspaceProps = {
  activeService?: string;
  allServiceNames?: string[];
  /** Visit department IDs keyed by department name, used to identify which visit department to remove. */
  serviceDepartmentIds?: Record<string, string>;
  /** Visit departments from the active visit */
  departments?: VisitDepartment[];
  currentUserId?: string;
  userRoles?: string[];
  items: BillingItem[];
  /** All billing items across all departments, used to check if a department has 0 products. */
  allItems?: BillingItem[];
  /** Department names that are fully billed (all items paid). */
  billedDepartmentNames?: Set<string>;
  canAddItems?: boolean;
  canEdit?: boolean;
  editMode?: boolean;
  quantityUpdating?: boolean;
  visitInsuranceOptions?: BillingInsuranceOption[];
  onServiceChange?: (service: string) => void;
  onAddItem?: () => void;
  onItemChange: (item: BillingItem) => void;
  onItemRemove: (itemId: string) => void;
  onQuantityChange?: (item: BillingItem, quantity: number) => void;
  onCancelDepartment?: (serviceName: string) => void;
  onRemoveDepartment?: (visitDepartmentId: string) => void;
  editedItemChanges?: Map<string, "added" | "modified">;
};

export function BillingItemsWorkspace({
  items,
  visitInsuranceOptions = [],
  quantityUpdating = false,
  canEdit = true,
  editMode = false,
  onItemChange,
  onItemRemove,
  onQuantityChange,
  editedItemChanges,
}: BillingItemsWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-2 sm:p-3">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full min-w-0">
        {editMode && (
          <div className="flex items-center gap-2 mb-2 flex-shrink-0 px-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              <Pencil className="h-2.5 w-2.5" />
              Edit Mode
            </span>
          </div>
        )}

        <div className="flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto py-2">
            <BillingItemsList
              items={items}
              onItemChange={onItemChange}
              onItemRemove={onItemRemove}
              onQuantityChange={onQuantityChange}
              quantityUpdating={quantityUpdating}
              availableInsurances={visitInsuranceOptions}
              hideDepartmentHeaders
              allDepartments={[]}
              hideTypeColumn
              canEdit={canEdit}
              editMode={editMode}
              editedItemChanges={editedItemChanges}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
