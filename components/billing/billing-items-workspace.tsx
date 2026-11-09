"use client";

import { Pencil, Layers } from "lucide-react";
import type { ComponentProps } from "react";
import { BillingItemsList } from "@/components/BillingItemsList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  availableProfiles?: Array<{ id: string; name: string }>;
  activeProfile?: { id: string; name: string } | null;
  canChangeProfile?: boolean;
  onChangeProfile?: (profileId: string | null) => void;
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
  availableProfiles = [],
  activeProfile = null,
  canChangeProfile = false,
  onChangeProfile,
  onItemChange,
  onItemRemove,
  onQuantityChange,
  editedItemChanges,
}: BillingItemsWorkspaceProps) {
  const showHeaderRow =
    editMode || (canChangeProfile && availableProfiles.length > 0) || Boolean(activeProfile);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-2 sm:p-3">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full min-w-0">
        {showHeaderRow && (
          <div className="flex items-center gap-2 mb-2 flex-shrink-0 px-1">
            {editMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                <Pencil className="h-2.5 w-2.5" />
                Edit Mode
              </span>
            )}
            {activeProfile || availableProfiles.length > 0 ? (() => {
              const activeIdInList =
                !activeProfile ||
                availableProfiles.some((profile) => profile.id === activeProfile.id);
              return canChangeProfile && availableProfiles.length > 0 && activeIdInList ? (
                <div className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <Select
                    value={activeProfile?.id || "none"}
                    onValueChange={(value) =>
                      onChangeProfile?.(value === "none" ? null : value)
                    }
                  >
                    <SelectTrigger className="h-7 rounded-full border-border text-[12px] gap-1 px-2.5">
                      <SelectValue placeholder="Profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Default</SelectItem>
                      {availableProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-2.5 h-7 text-[12px] text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  Profile:{" "}
                  <span className="font-medium text-foreground">
                    {activeProfile?.name || "Default"}
                  </span>
                </span>
              );
            })() : null}
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
