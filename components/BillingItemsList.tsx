"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  BillingItem,
  applyInsuranceSelectionToItem,
  calculateItemTotal,
  filterMatchingCoverages,
  findBestMatchingCoverage,
  getItemInsuranceSplit,
  resolvePatientSharePercentage,
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

export type InsuranceCoverageTier = {
  coverageId: string;
  departmentId: string | null;
  departmentName: string | null;
  encounterType: string | null;
  patientSharePercentage: number;
};

type InsuranceOption = {
  id: string;
  providerId: string;
  name: string;
  acronym: string;
  coveragePercentage: number;
  /** Patient-specific override percentage (null = use rules then provider default). */
  patientSharePercentage?: number | null;
  /** All coverage tiers for this provider (base + conditional). */
  coverages: InsuranceCoverageTier[];
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
  /** In-flight quantity update — disables the qty stepper to prevent duplicates. */
  quantityUpdating?: boolean;
  /** Map of item IDs to their change type in edit mode. */
  editedItemChanges?: Map<string, "added" | "modified">;
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

/** Resolve the effective patient share % for an item, respecting its
 *  selectedCoverageId and auto-matching rules. Falls back to the provider
 *  base percentage when no tier matches.
 *
 *  Delegates to the canonical resolver (mirrors the backend) so the display
 *  always shows the same % the backend will actually bill. */
function resolveEffectiveCoveragePct(
  item: BillingItem,
  insurance: InsuranceOption | undefined,
): number {
  if (!insurance) return 0;
  return resolvePatientSharePercentage({
    departmentId: item.departmentId ?? null,
    encounterType: item.encounterType ?? null,
    selectedCoverageId: item.selectedCoverageId ?? null,
    patientSharePercentage: insurance.patientSharePercentage ?? null,
    coverages: insurance.coverages,
  });
}

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
            disabled={quantityUpdating}
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
            disabled={quantityUpdating}
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
            disabled={quantityUpdating}
            onClick={() => {
              if (quantityUpdating) return;
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
          disabled={quantityUpdating}
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
                            resolveEffectiveCoveragePct(item, selectedInsurance);
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
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium text-foreground text-sm leading-tight">
                                    {item.name}
                                  </p>
                                  {editedItemChanges?.get(item.id) === "added" && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      NEW
                                    </span>
                                  )}
                                  {editedItemChanges?.get(item.id) === "modified" && (
                                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-full">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      CHANGED
                                    </span>
                                  )}
                                  {item.processorName && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                      {item.processorName}
                                    </span>
                                  )}
                                </div>
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
                                    const selectedOpt = visitInsuranceId
                                      ? availableInsurances.find(
                                          (ins) => ins.id === visitInsuranceId,
                                        )
                                      : undefined;
                                    const providerId = selectedOpt?.providerId;
                                    // Guard: never apply an insurance that doesn't
                                    // actually cover this product (grayed out). If it
                                    // somehow gets selected, fall back to private.
                                    if (providerId && !item.insuranceCoverageMeta?.[providerId]?.covered) {
                                      onItemChange(
                                        applyInsuranceSelectionToItem(item, undefined, undefined),
                                      );
                                      return;
                                    }
                                    let updated = applyInsuranceSelectionToItem(
                                      item,
                                      visitInsuranceId,
                                      providerId,
                                    );
                                    // Auto-select the lowest-% applicable coverage tier.
                                    // Always set selectedCoverageId explicitly so the
                                    // override is sent to the backend even when only one
                                    // tier exists — ensures the displayed % is billed.
                                    if (selectedOpt) {
                                      const best = findBestMatchingCoverage(
                                        selectedOpt.coverages,
                                        item.departmentId,
                                        item.encounterType,
                                      );
                                      updated = { ...updated, selectedCoverageId: best?.coverageId };
                                    } else {
                                      updated = { ...updated, selectedCoverageId: undefined };
                                    }
                                    onItemChange(updated);
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
                                    {availableInsurances.map((insurance) => {
                                      // An insurance only supports this product when
                                      // the product's coverage map says it is covered
                                      // (and priced > 0). Unsupported insurances are
                                      // grayed out so the user can't pick a payer that
                                      // won't actually apply — the backend would reject
                                      // it (or it would silently bill as PRIVATE).
                                      const isCovered = Boolean(
                                        item.insuranceCoverageMeta?.[
                                          insurance.providerId
                                        ]?.covered,
                                      );
                                      return (
                                        <SelectItem
                                          key={insurance.id}
                                          value={insurance.id}
                                          disabled={!isCovered}
                                          title={
                                            !isCovered
                                              ? `${insurance.acronym || insurance.name} does not cover this product`
                                              : undefined
                                          }
                                        >
                                          {insurance.acronym || insurance.name}
                                        </SelectItem>
                                      );
                                    })}
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
                                {/* Coverage tier pills — show matching rules, base, and patient-specific % */}
                                {item.selectedInsuranceId && (() => {
                                  const selectedIns = availableInsurances.find(
                                    (ins) => ins.id === item.selectedInsuranceId,
                                  );
                                  const allTiers = selectedIns?.coverages;
                                  if (!allTiers) return null;
                                  // Filter to relevant tiers: base + context-matching rules
                                  const tiers = filterMatchingCoverages(
                                    allTiers,
                                    item.departmentId,
                                    item.encounterType,
                                  );
                                  // Check if patient has a custom percentage that differs from the best match
                                  const bestMatch = findBestMatchingCoverage(
                                    allTiers,
                                    item.departmentId,
                                    item.encounterType,
                                  );
                                  const patientCustomPct = selectedIns?.patientSharePercentage ?? null;
                                  const hasPatientCustom = patientCustomPct != null && patientCustomPct > 0;
                                  const patientDiffersFromMatch = hasPatientCustom &&
                                    patientCustomPct !== bestMatch?.patientSharePercentage;
                                  // Combine: filtered rules + patient-specific if it's a distinct value
                                  const allDisplayTiers = [
                                    ...tiers,
                                    ...(patientDiffersFromMatch && bestMatch
                                      ? [{
                                          coverageId: `__patient_${patientCustomPct}`,
                                          departmentId: null,
                                          departmentName: null,
                                          encounterType: null,
                                          patientSharePercentage: patientCustomPct,
                                        }]
                                      : []),
                                  ];
                                  if (allDisplayTiers.length <= 1) return null;
                                  // The active tier is whatever is explicitly stored on the item.
                                  // If nothing is stored, the patient tier is active (when shown)
                                  // because Layer 2 of the resolver handles it without an override.
                                  const activeId = item.selectedCoverageId || '';
                                  const noExplicitOverride = !item.selectedCoverageId;
                                  return (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {allDisplayTiers.map((tier) => {
                                        const isPatientTier = tier.coverageId.startsWith('__patient_');
                                        const isActive =
                                          (isPatientTier && noExplicitOverride) ||
                                          (!isPatientTier && tier.coverageId === activeId);
                                        const isBase = !tier.departmentId && !tier.encounterType && !isPatientTier;
                                        const isMatch = !isBase && !isPatientTier &&
                                          tier.departmentId === item.departmentId &&
                                          tier.encounterType === item.encounterType;
                                        const label = isPatientTier
                                          ? `Patient ${tier.patientSharePercentage}%`
                                          : isBase
                                            ? `Base ${tier.patientSharePercentage}%`
                                            : tier.patientSharePercentage + '%';
                                        const tooltip = isPatientTier
                                          ? `Patient-specific: ${tier.patientSharePercentage}%`
                                          : isBase
                                            ? `Base: ${tier.patientSharePercentage}% (all depts)`
                                            : `${tier.patientSharePercentage}% — ${tier.departmentName || 'All depts'} / ${tier.encounterType || 'All types'}`;
                                        return (
                                          <button
                                            key={tier.coverageId}
                                            type="button"
                                            disabled={isPaidLocked(item)}
                                            onClick={() => {
                                              if (isPatientTier) {
                                                // Patient tier: clear the explicit override so
                                                // the patient-specific % resolves via Layer 2.
                                                onItemChange({ ...item, selectedCoverageId: undefined });
                                              } else {
                                                // Always store the explicit coverageId — even for
                                                // the auto-selected tier — so the override is sent
                                                // to the backend and the user's intent is preserved.
                                                onItemChange({ ...item, selectedCoverageId: tier.coverageId });
                                              }
                                            }}
                                            className={`text-[9px] px-1.5 py-0.5 rounded-full border transition-colors ${
                                              isActive
                                                ? 'bg-primary/15 text-primary border-primary/40 font-medium'
                                                : isPatientTier
                                                  ? 'bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700'
                                                  : isMatch
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'
                                                    : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted'
                                            }`}
                                            title={tooltip}
                                          >
                                            {label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                                {/* Patient share source badge */}
                                {item.selectedInsuranceId && (() => {
                                  // Use backend source if available (from billed items)
                                  const backendPct = item.appliedPatientSharePct;
                                  const backendSource = item.patientShareSource;

                                  // For unbilled items, compute the resolved percentage
                                  const selectedIns = availableInsurances.find(
                                    (ins) => ins.id === item.selectedInsuranceId,
                                  );
                                  let computedPct = backendPct;
                                  let computedSource = backendSource;
                                  if (computedPct == null && selectedIns) {
                                    // Resolve through the canonical backend-mirroring resolver.
                                    computedPct = resolveEffectiveCoveragePct(item, selectedIns);
                                    computedSource = null; // no backend source yet
                                  }

                                  if (computedPct == null) return null;

                                  // When multiple coverage tiers exist, the tier pills above
                                  // already show the selected percentage — hide the redundant
                                  // "Patient X%" badge. Only show it for single-tier insurances
                                  // where no tier pills are rendered.
                                  const hasMultipleTiers = (() => {
                                    if (!selectedIns?.coverages) return false;
                                    const allTiers = selectedIns.coverages;
                                    const tiers = filterMatchingCoverages(
                                      allTiers, item.departmentId, item.encounterType,
                                    );
                                    const bestMatch = findBestMatchingCoverage(
                                      allTiers, item.departmentId, item.encounterType,
                                    );
                                    const patientCustomPct = selectedIns.patientSharePercentage ?? null;
                                    const hasPatientCustom = patientCustomPct != null && patientCustomPct > 0;
                                    const patientDiffersFromMatch = hasPatientCustom &&
                                      patientCustomPct !== bestMatch?.patientSharePercentage;
                                    const total = tiers.length + (patientDiffersFromMatch ? 1 : 0);
                                    return total > 1;
                                  })();

                                  const sourceLabel = (() => {
                                    switch (computedSource) {
                                      case 'OVERRIDE': return 'Override';
                                      case 'RULE': return 'Coverage';
                                      case 'PATIENT_DEFAULT': return 'Patient';
                                      case 'PROVIDER_DEFAULT': return 'Provider';
                                      case 'EXEMPTED': return 'Exempt';
                                      default: return null;
                                    }
                                  })();

                                  // Don't show anything when tier pills are visible (redundant)
                                  if (hasMultipleTiers) return null;

                                  return (
                                    <div className="flex items-center gap-1 mt-1">
                                      <span className="text-[9px] px-1 py-0.5 rounded bg-muted/80 text-muted-foreground border border-border/40 tabular-nums">
                                        Patient {computedPct}%
                                      </span>
                                      {sourceLabel && (
                                        <span className="text-[9px] px-1 py-0.5 rounded bg-primary/5 text-primary/70 border border-primary/20">
                                          {sourceLabel}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
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
                                      if (!editMode && item.source === "PROFILE") {
                                        toast.info("Profile products cannot be exempted individually — change the visit department's profile instead.");
                                        return;
                                      }
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
                                    disabled={isPaidLocked(item) || (!editMode && item.source === "PROFILE")}
                                  >
                                    <SelectTrigger className="h-7 text-[10px] w-[7.5rem]">
                                      <SelectValue placeholder="Exemption" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">
                                        {(!editMode && item.source === "PROFILE") ? "Profile product" : "No exemption"}
                                      </SelectItem>
                                      {availableInsurances.length > 0 && (
                                        <SelectItem value="patient-share" disabled={!editMode && item.source === "PROFILE"}>
                                          Waive patient share
                                        </SelectItem>
                                      )}
                                      <SelectItem value="full" disabled={!editMode && item.source === "PROFILE"}>
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
