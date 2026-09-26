"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, Pencil, Layers, Trash2, Check, Ban, MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { BillingItem } from "@/lib/billing-utils";
import type { VisitDepartment } from "@/lib/api-types";

type BillingInsuranceOption = NonNullable<
  ComponentProps<typeof BillingItemsList>["availableInsurances"]
>[number];

type BillingItemsWorkspaceProps = {
  activeService: string;
  allServiceNames: string[];
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
  onCancelDepartment?: (visitDepartmentId: string) => void;
  onRemoveDepartment?: (visitDepartmentId: string) => void;
  editedItemChanges?: Map<string, "added" | "modified">;
};

export function BillingItemsWorkspace({
  activeService,
  allServiceNames,
  serviceDepartmentIds = {},
  departments = [],
  currentUserId,
  userRoles = [],
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
  onCancelDepartment,
  onRemoveDepartment,
  editedItemChanges,
}: BillingItemsWorkspaceProps) {
  const getDepartmentPermissions = useCallback(
    (serviceName: string) => {
      const visitDeptId = serviceDepartmentIds[serviceName];
      if (!visitDeptId) return null;

      const dept = departments.find(
        (d) => d.id === visitDeptId || d.department?.name === serviceName
      );
      const isTerminal =
        dept?.status === "COMPLETED" ||
        dept?.status === "FINALISED" ||
        dept?.status === "CANCELLED";

      const deptItems = allItems.filter((item) => item.departmentName === serviceName);
      const hasProducts =
        deptItems.length > 0 || (dept?.products && dept.products.length > 0);

      const normalizedRoles = userRoles.map((r) => r.toUpperCase());
      const isAdminOrManager = normalizedRoles.some((r) =>
        ["ADMIN", "CLINIC_ADMIN", "MANAGER", "FINANCE"].includes(r)
      );
      const isAssignedProcessor = Boolean(
        currentUserId &&
          dept?.processors?.some((p) => String(p.id) === String(currentUserId))
      );

      // Permission matrix:
      // 1. Terminal states cannot be cancelled
      // 2. If ACTIVE: assigned processor OR admin/manager can cancel
      // 3. If PENDING (or not ACTIVE):
      //    - If has products: assigned processor OR admin/manager can cancel
      //    - If no products: reception, nurse, clinician, manager, admin can cancel
      let canCancel = false;
      if (!isTerminal && onCancelDepartment) {
        if (dept?.status === "ACTIVE") {
          canCancel = isAssignedProcessor || isAdminOrManager;
        } else {
          canCancel = !hasProducts || isAssignedProcessor || isAdminOrManager;
        }
      }

      // Admin or Manager can delete
      const canDelete = Boolean(isAdminOrManager && onRemoveDepartment);

      if (!canCancel && !canDelete) return null;

      return {
        visitDepartmentId: visitDeptId,
        canCancel,
        canDelete,
      };
    },
    [
      serviceDepartmentIds,
      departments,
      allItems,
      userRoles,
      currentUserId,
      onCancelDepartment,
      onRemoveDepartment,
    ]
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
                const menuPerms = getDepartmentPermissions(dept);

                return (
                  <TabsTrigger
                    key={dept}
                    value={dept}
                    className={`rounded-full pl-3 pr-1.5 text-xs h-7 gap-1 transition-colors ${
                      isBilled
                        ? "bg-green-100/90 text-green-800 border border-green-300/80 hover:bg-green-200/90 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800 dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white"
                        : ""
                    }`}
                  >
                    {isBilled && (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-green-700 dark:text-green-400 group-data-[state=active]:text-white data-[state=active]:text-white"
                        strokeWidth={2.5}
                      />
                    )}
                    <span>{dept}</span>
                    {menuPerms && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <span
                            role="button"
                            tabIndex={0}
                            className="inline-flex items-center justify-center h-4 w-4 ml-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                              }
                            }}
                            title="Department options"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[160px]">
                          {menuPerms.canCancel && (
                            <DropdownMenuItem
                              className="text-amber-600 dark:text-amber-400 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950/30 cursor-pointer text-xs flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCancelDepartment?.(menuPerms.visitDepartmentId);
                              }}
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Cancel Department
                            </DropdownMenuItem>
                          )}
                          {menuPerms.canDelete && (
                            <DropdownMenuItem
                              variant="destructive"
                              className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer text-xs flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveDepartment?.(menuPerms.visitDepartmentId);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete Department
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

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
