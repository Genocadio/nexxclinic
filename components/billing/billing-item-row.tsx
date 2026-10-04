"use client";

import React from "react";
import { Minus, Plus, Trash2, Pencil, X } from "lucide-react";
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
import { BillingExemptions } from "@/components/BillingExemptions";

export type InsuranceCoverageTier = {
  coverageId: string;
  departmentId: string | null;
  departmentName: string | null;
  encounterType: string | null;
  patientSharePercentage: number;
};

export type InsuranceOption = {
  id: string;
  providerId: string;
  name: string;
  acronym: string;
  coveragePercentage: number;
  patientSharePercentage?: number | null;
  coverages: InsuranceCoverageTier[];
};

export interface BillingItemRowProps {
  item: BillingItem;
  availableInsurances: InsuranceOption[];
  hideTypeColumn?: boolean;
  canEdit?: boolean;
  editMode?: boolean;
  quantityUpdating?: boolean;
  editedItemChanges?: Map<string, "added" | "modified">;
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

export function resolveEffectiveCoveragePct(
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

export function BillingItemRow({
  item,
  availableInsurances,
  hideTypeColumn = true,
  canEdit = true,
  editMode = false,
  quantityUpdating = false,
  editedItemChanges,
  editingQtyId,
  editQty,
  qtyInputRef,
  onItemChange,
  onItemRemove,
  onApplyQuantity,
  onStartEditQty,
  onCancelEditQty,
  onSetEditQty,
}: BillingItemRowProps) {
  const [isEditingTier, setIsEditingTier] = React.useState(false);
  const isPaidLocked = !editMode && item.paymentStatus === "paid";
  const itemTotal = calculateItemTotal(item);
  const exemptionType = item.exemptionType || (item.exempted ? "full" : "none");
  const isExempted = exemptionType !== "none";

  const selectedInsurance = availableInsurances.find(
    (ins) => ins.id === item.selectedInsuranceId,
  );
  const coveragePct = resolveEffectiveCoveragePct(item, selectedInsurance);
  const {
    insuranceAmount,
    patientAmount,
    rawItemTotal,
    rawInsuranceAmount,
    rawPatientAmount,
    waivedAmount,
  } = getItemInsuranceSplit(item, coveragePct);
  const statusLabel =
    exemptionType === "full"
      ? "Exempted"
      : exemptionType === "patient-share"
        ? "Share waived"
        : item.paymentStatus;

  return (
    <tr
      suppressHydrationWarning
      className={`group border-b border-border hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors ${
        isExempted ? "bg-purple-50 dark:bg-purple-950/20" : ""
      } ${isPaidLocked ? "opacity-70" : ""}`}
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
          {item.billingConfirmationStatus === "PENDING_OPERATOR_CONFIRMATION" && (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded-full whitespace-nowrap" title="Added from billing, awaiting clinician confirmation">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pending Doctor Confirmation
            </span>
          )}
          {item.confirmedByName && (
            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-full whitespace-nowrap" title={`Confirmed by ${item.confirmedByName}`}>
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              Confirmed
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
        {isPaidLocked || !canEdit || item.quantifiable === false ? (
          <span className="tabular-nums">{item.quantity}</span>
        ) : (
          <div className="inline-flex items-center justify-center gap-0.5">
            {item.quantity > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0 rounded-full opacity-70 group-hover:opacity-100"
                aria-label="Decrease quantity"
                disabled={quantityUpdating}
                onClick={() => void onApplyQuantity(item, item.quantity - 1)}
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
                onChange={(e) => onSetEditQty(e.target.value)}
                onFocus={(e) => e.target.select()}
                onBlur={() => {
                  const parsed = parseInt(editQty, 10);
                  const next =
                    Number.isFinite(parsed) && parsed >= 1
                      ? parsed
                      : item.quantity;
                  void onApplyQuantity(item, next);
                  onCancelEditQty();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                  if (e.key === "Escape") {
                    onCancelEditQty();
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
                onClick={() => onStartEditQty(item)}
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
              onClick={() => void onApplyQuantity(item, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </td>
      <td className="py-2 px-3 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <span className="tabular-nums text-sm">{formatRWF(item.price)}</span>
          {!item.selectedInsuranceId ? (
            <span className="text-[10px] text-muted-foreground">Private</span>
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
            const visitInsuranceId = value === "none" ? undefined : value;
            const selectedOpt = visitInsuranceId
              ? availableInsurances.find((ins) => ins.id === visitInsuranceId)
              : undefined;
            const providerId = selectedOpt?.providerId;
            if (
              providerId &&
              !item.insuranceCoverageMeta?.[providerId]?.covered
            ) {
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
            // Default to patient insurance % without setting an artificial override
            updated = { ...updated, selectedCoverageId: undefined };
            setIsEditingTier(false);
            onItemChange(updated);
          }}
          disabled={availableInsurances.length === 0 || isPaidLocked}
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
            <SelectItem value="none">Private (none)</SelectItem>
            {availableInsurances.map((insurance) => {
              const meta = item.insuranceCoverageMeta?.[insurance.providerId];
              const cost = item.insuranceCoverageCosts?.[insurance.providerId];
              const isCovered = Boolean(
                meta?.covered && typeof cost === "number" && Number.isFinite(cost) && cost > 0,
              );
              return (
                <SelectItem
                  key={insurance.id}
                  value={insurance.id}
                  disabled={!isCovered}
                  title={
                    !isCovered
                      ? typeof cost === "number" && Number.isFinite(cost) && cost === 0
                        ? `${insurance.acronym || insurance.name} pays 0 RWF on this product (not covered)`
                        : `${insurance.acronym || insurance.name} does not cover this product`
                      : undefined
                  }
                >
                  <span className="flex items-center justify-between w-full gap-2">
                    <span>{insurance.acronym || insurance.name}</span>
                    {!isCovered && (
                      <span className="text-[10px] text-muted-foreground ml-1">
                        {Number.isFinite(cost) && cost === 0 ? "(Pays 0)" : "(Not covered)"}
                      </span>
                    )}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {availableInsurances.length === 0 && !item.selectedInsuranceId && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Check patient insurances above
          </p>
        )}
        {item.selectedInsuranceId && item.insuranceNotCovered && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
            Not covered
          </p>
        )}
        {/* Coverage Percentage & Tier Editor */}
        {item.selectedInsuranceId &&
          (() => {
            const selectedIns = availableInsurances.find(
              (ins) => ins.id === item.selectedInsuranceId,
            );
            const allTiers = selectedIns?.coverages;
            if (!allTiers) return null;
            const tiers = filterMatchingCoverages(
              allTiers,
              item.departmentId,
              item.encounterType,
            );
            const bestMatch = findBestMatchingCoverage(
              allTiers,
              item.departmentId,
              item.encounterType,
            );
            const patientCustomPct =
              selectedIns?.patientSharePercentage ?? null;
            const hasPatientCustom =
              patientCustomPct != null && patientCustomPct > 0;
            const patientDiffersFromMatch =
              hasPatientCustom &&
              patientCustomPct !== bestMatch?.patientSharePercentage;
            const allDisplayTiers = [
              ...tiers,
              ...(patientDiffersFromMatch && bestMatch
                ? [
                    {
                      coverageId: `__patient_${patientCustomPct}`,
                      departmentId: null,
                      departmentName: null,
                      encounterType: null,
                      patientSharePercentage: patientCustomPct,
                    },
                  ]
                : []),
            ];

            const hasMultipleTiers = allDisplayTiers.length > 1;
            const activeId = item.selectedCoverageId || "";
            const noExplicitOverride = !item.selectedCoverageId;

            return (
              <div className="mt-1">
                {!isEditingTier ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-foreground border border-border/60 font-medium">
                      {coveragePct}% copay
                    </span>
                    {hasMultipleTiers && !isPaidLocked && (
                      <button
                        type="button"
                        onClick={() => setIsEditingTier(true)}
                        className="p-0.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-muted"
                        title="Change insurance copay percentage tier"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1 p-1.5 rounded-lg bg-muted/40 border border-border/60 mt-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold text-muted-foreground">Select percentage tier:</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingTier(false)}
                        className="text-muted-foreground hover:text-foreground p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {allDisplayTiers.map((tier) => {
                        const isPatientTier = tier.coverageId.startsWith("__patient_");
                        const isActive =
                          (isPatientTier && noExplicitOverride) ||
                          (!isPatientTier && tier.coverageId === activeId);
                        const isBase =
                          !tier.departmentId &&
                          !tier.encounterType &&
                          !isPatientTier;
                        const isMatch =
                          !isBase &&
                          !isPatientTier &&
                          tier.departmentId === item.departmentId &&
                          tier.encounterType === item.encounterType;
                        const label = isPatientTier
                          ? `Patient ${tier.patientSharePercentage}%`
                          : isBase
                            ? `Base ${tier.patientSharePercentage}%`
                            : tier.patientSharePercentage + "%";
                        const tooltip = isPatientTier
                          ? `Patient-specific: ${tier.patientSharePercentage}%`
                          : isBase
                            ? `Base: ${tier.patientSharePercentage}% (all depts)`
                            : `${tier.patientSharePercentage}% — ${tier.departmentName || "All depts"} / ${tier.encounterType || "All types"}`;
                        return (
                          <button
                            key={tier.coverageId}
                            type="button"
                            disabled={isPaidLocked}
                            onClick={() => {
                              if (isPatientTier) {
                                onItemChange({
                                  ...item,
                                  selectedCoverageId: undefined,
                                });
                              } else {
                                onItemChange({
                                  ...item,
                                  selectedCoverageId: tier.coverageId,
                                });
                              }
                              setIsEditingTier(false);
                            }}
                            className={`text-[9px] px-1.5 py-0.5 rounded-full border transition-colors ${
                              isActive
                                ? "bg-primary/15 text-primary border-primary/40 font-medium ring-1 ring-primary/30"
                                : isPatientTier
                                  ? "bg-violet-50 text-violet-700 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700"
                                  : isMatch
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                                    : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                            }`}
                            title={tooltip}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
      </td>
      <td className="py-2 px-3 text-right tabular-nums text-sm">
        {item.selectedInsuranceId && item.insuranceNotCovered ? (
          <span className="text-amber-600 dark:text-amber-400 text-[11px]">
            Not covered
          </span>
        ) : item.selectedInsuranceId && (insuranceAmount > 0 || (isExempted && rawInsuranceAmount > 0)) ? (
          exemptionType === "full" ? (
            <div className="flex flex-col items-end">
              <span className="line-through text-muted-foreground text-xs">
                {formatRWF(rawInsuranceAmount)}
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                Waived
              </span>
            </div>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
              {formatRWF(insuranceAmount)}
            </span>
          )
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </td>
      <td className="py-2 px-3 text-right tabular-nums text-sm">
        {isExempted ? (
          <div className="flex flex-col items-end gap-0.5">
            <span className="line-through text-muted-foreground text-xs">
              {formatRWF(rawPatientAmount)}
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              0 RWF (Waived)
            </span>
            {item.selectedInsuranceId && !item.insuranceNotCovered ? (
              <span className="text-[10px] text-purple-600/80">
                {coveragePct}% share waived
              </span>
            ) : (
              <span className="text-[10px] text-purple-600/80">
                Waived {formatRWF(rawPatientAmount)}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-semibold text-foreground">
              {formatRWF(patientAmount)}
            </span>
            {item.selectedInsuranceId && !item.insuranceNotCovered && (
              <span className="text-[10px] text-muted-foreground">
                {coveragePct}% share
              </span>
            )}
          </div>
        )}
      </td>
      <td className="py-2 px-3 text-right tabular-nums text-sm">
        {exemptionType === "full" ? (
          <div className="flex flex-col items-end gap-0.5">
            <span className="line-through text-muted-foreground text-xs">
              {formatRWF(rawItemTotal)}
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              0 RWF (Waived)
            </span>
          </div>
        ) : (
          <span className="font-bold text-foreground">
            {formatRWF(itemTotal)}
          </span>
        )}
      </td>
      <td className="py-2 px-3 text-center">
        <Badge
          variant="outline"
          className={`capitalize text-[10px] px-1.5 py-0 h-5 rounded-full ${getPaymentStatusColor(
            isExempted ? "exempted" : item.paymentStatus,
          )}`}
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
                toast.info(
                  "Profile products cannot be exempted individually — change the visit department's profile instead.",
                );
                return;
              }
              const updated = {
                ...item,
                exemptionType: value as typeof item.exemptionType,
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
            disabled={isPaidLocked || (!editMode && item.source === "PROFILE")}
          >
            <SelectTrigger className="h-7 text-[10px] w-[7.5rem]">
              <SelectValue placeholder="Exemption" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {!editMode && item.source === "PROFILE"
                  ? "Profile product"
                  : "No exemption"}
              </SelectItem>
              {availableInsurances.length > 0 && (
                <SelectItem
                  value="patient-share"
                  disabled={!editMode && item.source === "PROFILE"}
                >
                  Waive patient share
                </SelectItem>
              )}
              <SelectItem
                value="full"
                disabled={!editMode && item.source === "PROFILE"}
              >
                Full exemption
              </SelectItem>
            </SelectContent>
          </Select>
          {canEdit && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onItemRemove(item.id)}
              disabled={isPaidLocked || item.source === "PROFILE"}
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
}
