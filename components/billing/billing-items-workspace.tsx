"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, Pencil, Layers, Trash2 } from "lucide-react";
import type { ComponentProps } from "react";
import { BillingItemsList } from "@/components/BillingItemsList";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BillingItem } from "@/lib/billing-utils";

type BillingInsuranceOption = NonNullable<
  ComponentProps<typeof BillingItemsList>["availableInsurances"]
>[number];

type BillingItemsWorkspaceProps = {
  activeService: string;
  allServiceNames: string[];
  /** Visit department IDs keyed by department name, used to identify which visit department to remove. */
  serviceDepartmentIds?: Record<string, string>;
  items: BillingItem[];
  /** All billing items across all departments, used to check if a department has 0 products. */
  allItems?: BillingItem[];
  /** Department names that are fully billed (all items paid). */
  billedDepartmentNames?: Set<string>;
  canAddItems: boolean;
  canEdit?: boolean;
  editMode?: boolean;
  quantityUpdating?: boolean;
  visitInsuranceOptions: BillingInsuranceOption[];
  activeProfile?: { id: string; name: string } | null;
  availableProfiles?: { id: string; name: string }[];
  canChangeProfile?: boolean;
  onChangeProfile?: (profileId: string | null) => void;
  onServiceChange: (serviceName: string) => void;
  onAddItem: () => void;
  onItemChange: (item: BillingItem) => void;
  onItemRemove: (itemId: string) => void;
  onQuantityChange: (item: BillingItem, quantity: number) => void;
  onRemoveDepartment?: (visitDepartmentId: string) => void;
  editedItemChanges?: Map<string, "added" | "modified">;
};

export function BillingItemsWorkspace({
  activeService,
  allServiceNames,
  serviceDepartmentIds = {},
  items,
  allItems = [],
  billedDepartmentNames = new Set(),
  canAddItems,
  canEdit = true,
  editMode = false,
  quantityUpdating = false,
  visitInsuranceOptions,
  activeProfile = null,
  availableProfiles = [],
  canChangeProfile = false,
  onChangeProfile,
  onServiceChange,
  onAddItem,
  onItemChange,
  onItemRemove,
  onQuantityChange,
  onRemoveDepartment,
  editedItemChanges,
}: BillingItemsWorkspaceProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; serviceName: string; visitDepartmentId: string } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [contextMenu]);

  // Close context menu on Escape
  useEffect(() => {
    if (!contextMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [contextMenu]);

  const handleTabContextMenu = useCallback(
    (e: React.MouseEvent, serviceName: string) => {
      e.preventDefault();
      const visitDeptId = serviceDepartmentIds[serviceName];
      if (!visitDeptId || !onRemoveDepartment) return;
      // Check if this department has any products
      const deptItems = allItems.filter((item) => item.departmentName === serviceName);
      if (deptItems.length > 0) return; // Don't show menu if department has products
      setContextMenu({ x: e.clientX, y: e.clientY, serviceName, visitDepartmentId: visitDeptId });
    },
    [serviceDepartmentIds, allItems, onRemoveDepartment],
  );
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-6">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">          <div className="flex items-center justify-between gap-3 mb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              Items to Bill
            </h2>
            {editMode && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
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
                    <SelectTrigger className="h-7 rounded-full border-border text-[11px] gap-1 px-2.5">
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
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-2.5 h-7 text-[11px] text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  Profile:{" "}
                  <span className="font-medium text-foreground">
                    {activeProfile?.name || "Default"}
                  </span>
                </span>
              );
            })() : null}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {canAddItems && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full text-xs"
                onClick={onAddItem}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Product
              </Button>
            )}
          </div>
        </div>

        <div className="mb-2 flex-shrink-0">
          <Tabs value={activeService} onValueChange={onServiceChange}>
            <TabsList className="h-8">
              {allServiceNames.map((dept) => {
                const isBilled = billedDepartmentNames.has(dept);
                return (
                  <TabsTrigger
                    key={dept}
                    value={dept}
                    className={`rounded-full px-3 text-xs h-7 ${
                      isBilled
                        ? "bg-green-100 text-green-700 border border-green-300 data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
                        : ""
                    }`}
                    onContextMenu={(e) => handleTabContextMenu(e, dept)}
                  >
                    {isBilled && "✓ "}{dept}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Right-click context menu */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="fixed z-50 min-w-[160px] bg-popover border border-border rounded-lg shadow-lg py-1"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => {
                onRemoveDepartment?.(contextMenu.visitDepartmentId);
                setContextMenu(null);
              }}
            >
              <Trash2 className="h-3 w-3" />
              Remove Department
            </button>
          </div>
        )}

        <div className="flex-1 min-h-0 bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
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
