"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BillingItem, BillingTotals, calculateItemTotal } from "@/lib/billing-utils";
import { useEffect, useState } from "react";
type PaymentMethod =
  | "CASH"
  | "MOBILE_MONEY"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "MIXED";
import { formatRWF } from "@/lib/utils";

type BillingConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BillingItem[];
  totals: BillingTotals;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  creatingBill: boolean;
  showItemsReview?: boolean;
  outstandingType?: "loan" | "giveaway";
  outstandingReason?: string;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onAmountPaidChange: (amount: number) => void;
  onOutstandingTypeChange: (type: "loan" | "giveaway") => void;
  onOutstandingReasonChange: (reason: string) => void;
  billingNotes?: string;
  onBillingNotesChange?: (notes: string) => void;
  onConfirm: () => void;
  editWarning?: string | null;
};

function buildSuggestedReasons(opts: {
  hasExemptions: boolean;
  hasOutstanding: boolean;
  outstandingType: "loan" | "giveaway";
}): string[] {
  const { hasExemptions, hasOutstanding, outstandingType } = opts;
  const reasons: string[] = [];

  // ── Combined scenarios (exemption + outstanding) ──
  if (hasExemptions && hasOutstanding) {
    if (outstandingType === "loan") {
      reasons.push("Doctor exempted some items; patient cannot cover the remaining balance");
      reasons.push("Partial exemption applied — balance given as loan");
      reasons.push("Patient given loan due to exemption-reduced coverage");
    } else {
      reasons.push("Doctor exempted some items; remaining balance waived as giveaway");
      reasons.push("Exemption applied — outstanding balance written off");
      reasons.push("Free treatment with partial insurance coverage");
    }
  }
  // ── Outstanding only (no exemptions) ──
  else if (hasOutstanding) {
    if (outstandingType === "loan") {
      reasons.push("Patient given loan due to insufficient funds");
      reasons.push("Partial payment agreed — balance to be collected later");
      reasons.push("Patient unable to pay full amount today");
    } else {
      reasons.push("Doctor waived patient share");
      reasons.push("Staff welfare — balance forgiven");
      reasons.push("Charity case");
      reasons.push("Insurance adjustment");
    }
  }
  // ── Exemptions only (no outstanding) ──
  else if (hasExemptions) {
    reasons.push("Doctor waived patient share");
    reasons.push("Exemption applied — full or partial");
    reasons.push("Free treatment program");
  }

  // ── General (always available) ──
  reasons.push("Deducted by doctor");
  reasons.push("Other");

  return reasons;
}

export function BillingConfirmSheet({
  open,
  onOpenChange,
  items,
  totals,
  amountPaid,
  paymentMethod,
  creatingBill,
  showItemsReview = true,
  outstandingType = "loan",
  outstandingReason: _outstandingReason = "",
  onPaymentMethodChange,
  onAmountPaidChange,
  onOutstandingTypeChange,
  onOutstandingReasonChange: _onOutstandingReasonChange,
  billingNotes = "",
  onBillingNotesChange,
  onConfirm,
  editWarning = null,
}: BillingConfirmSheetProps) {
  const itemsToBill = items.filter((item) => item.paymentStatus !== "paid");
  const outstanding = Math.max(0, totals.totalAmount - amountPaid);
  const hasExemptions = itemsToBill.some(
    (item) =>
      item.exempted ||
      item.exemptionType === "full" ||
      item.exemptionType === "patient-share",
  );
  const hasOutstanding = outstanding > 0.001;
  const noteRequired = hasExemptions || hasOutstanding;

  const suggestedReasons = buildSuggestedReasons({
    hasExemptions,
    hasOutstanding,
    outstandingType,
  });

  // Track whether the user explicitly selected "Other" in this session.
  const [customNoteMode, setCustomNoteMode] = useState(false);

  // When the sheet opens, sync customNoteMode: if the existing billing note
  // doesn't match any suggestion, it was custom text — show the textarea.
  useEffect(() => {
    if (open) {
      setCustomNoteMode(
        Boolean(billingNotes && !suggestedReasons.includes(billingNotes)),
      );
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReasonSelect = (value: string) => {
    if (value === "Other") {
      setCustomNoteMode(true);
      onBillingNotesChange?.("");
    } else {
      setCustomNoteMode(false);
      onBillingNotesChange?.(value);
    }
  };

  // Dropdown value: "Other" when in custom mode, otherwise the matching suggestion
  const dropdownValue = customNoteMode
    ? "Other"
    : suggestedReasons.includes(billingNotes)
      ? billingNotes
      : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col z-[95]"
        overlayClassName="z-[94]"
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
          <SheetTitle>
            {showItemsReview ? "Review & Complete Bill" : "Edit Payment"}
          </SheetTitle>
          {editWarning && (
            <div className="mx-4 mt-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              ⚠️ {editWarning}
            </div>
          )}
          <SheetDescription>
            {showItemsReview
              ? `${itemsToBill.length} item${itemsToBill.length !== 1 ? "s" : ""} to bill — set payment details below`
              : "Update payment method or amount paid"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {showItemsReview && (
            <ul className="space-y-0 rounded-lg border border-border divide-y divide-border">
              {itemsToBill.map((item) => {
                const lineTotal = calculateItemTotal(item);
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 text-xs px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-foreground">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.quantity} × {formatRWF(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums shrink-0">
                      {formatRWF(lineTotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5 text-sm">
            <Row label="Service total" value={totals.subtotal} />
            {totals.insuranceCoverage > 0 && (
              <Row
                label="Insurance contribution"
                value={-totals.insuranceCoverage}
                variant="credit"
              />
            )}
            <Row
              label="Patient responsibility"
              value={totals.patientResponsibility}
              bold
            />
            <div className="border-t border-border pt-2 flex justify-between items-baseline">
              <span className="font-semibold">Final amount due</span>
              <span className="text-lg font-bold text-[#FF6900] tabular-nums">
                {formatRWF(totals.totalAmount)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-3">
            <p className="text-xs font-semibold text-foreground">Payment</p>

            <div>
              <label className="text-xs text-muted-foreground">
                Payment method
              </label>
              <Select
                value={paymentMethod || "MOBILE_MONEY"}
                onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="MIXED">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Amount paid
              </label>
              <Input
                type="number"
                min={0}
                max={totals.totalAmount}
                value={amountPaid}
                onChange={(e) =>
                  onAmountPaidChange(
                    Math.min(
                      totals.totalAmount,
                      Math.max(0, Number(e.target.value || 0)),
                    ),
                  )
                }
                className="mt-1 h-9 tabular-nums"
              />
              {amountPaid > totals.totalAmount ? (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                  Amount paid cannot exceed the total amount due — it has been
                  capped at {formatRWF(totals.totalAmount)}.
                </p>
              ) : null}
            </div>

            {hasOutstanding && (
              <div className="border-t border-border pt-3">
                <p className="text-xs font-medium text-foreground mb-2">
                  Outstanding balance
                </p>
                <p className="text-[11px] text-muted-foreground mb-2">
                  {formatRWF(outstanding)} unpaid — classify as:
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={outstandingType === "loan" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onOutstandingTypeChange("loan")}
                  >
                    Loan
                  </Button>
                  <Button
                    type="button"
                    variant={outstandingType === "giveaway" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 h-8 text-xs"
                    onClick={() => onOutstandingTypeChange("giveaway")}
                  >
                    Giveaway
                  </Button>
                </div>
              </div>
            )}

            {/* Billing note — dropdown with suggestions, textarea only for "Other" */}
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-foreground">
                    Billing note
                  </span>
                  {noteRequired && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                      {hasExemptions
                        ? "Required — an item is exempted"
                        : "Required — payment does not cover the full amount"}
                    </p>
                  )}
                </div>
              </div>

              <Select value={dropdownValue} onValueChange={handleReasonSelect}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent className="z-[96]">
                  {suggestedReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {customNoteMode && (
                <Textarea
                  value={billingNotes}
                  onChange={(e) => onBillingNotesChange?.(e.target.value)}
                  placeholder="Type your reason here…"
                  className="min-h-[72px] text-xs"
                />
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="px-4 py-3 border-t border-border gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-[#FF6900] hover:bg-[#e05f00] text-white"
            disabled={creatingBill || (noteRequired && !billingNotes?.trim())}
            onClick={onConfirm}
          >
            {creatingBill
              ? "Processing…"
              : showItemsReview
                ? "Confirm & Complete"
                : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
  variant,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  variant?: "credit";
}) {
  const formatted =
    variant === "credit"
      ? `−${formatRWF(Math.abs(value))}`
      : formatRWF(value);

  return (
    <div className="flex justify-between text-xs">
      <span
        className={
          bold ? "font-semibold text-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? "font-semibold" : ""} ${
          variant === "credit" ? "text-emerald-600 dark:text-emerald-400" : ""
        } ${highlight ? "font-semibold text-orange-600 dark:text-orange-400" : ""}`}
      >
        {formatted}
      </span>
    </div>
  );
}
