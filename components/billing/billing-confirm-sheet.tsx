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
import { BillingItem, BillingTotals, calculateItemTotal } from "@/lib/billing-utils";
type PaymentMethod =
  | "CASH"
  | "MOBILE_MONEY"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "MIXED";
import { Textarea } from "@/components/ui/textarea";
import { formatRWF } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

type BillingConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BillingItem[];
  totals: BillingTotals;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  creatingBill: boolean;
  showItemsReview?: boolean;
  showDiscountControls: boolean;
  discountInputType: "PERCENTAGE" | "FIXED";
  discountInputValue: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onAmountPaidChange: (amount: number) => void;
  onShowDiscountControls: (show: boolean) => void;
  onDiscountInputTypeChange: (type: "PERCENTAGE" | "FIXED") => void;
  onDiscountInputValueChange: (value: number) => void;
  onDiscountChange: (percent: number) => void;
  billingNotes?: string;
  onBillingNotesChange?: (notes: string) => void;
  /**
   * True when the backend requires a billing note (any exempted product or a
   * department whose payment does not cover its full patient payable).
   */
  noteRequired?: boolean;
  onConfirm: () => void;
};

export function BillingConfirmSheet({
  open,
  onOpenChange,
  items,
  totals,
  amountPaid,
  paymentMethod,
  creatingBill,
  showItemsReview = true,
  showDiscountControls,
  discountInputType,
  discountInputValue,
  onPaymentMethodChange,
  onAmountPaidChange,
  onShowDiscountControls,
  onDiscountInputTypeChange,
  onDiscountInputValueChange,
  onDiscountChange,
  billingNotes = "",
  onBillingNotesChange,
  noteRequired = false,
  onConfirm,
}: BillingConfirmSheetProps) {
  const itemsToBill = items.filter((item) => item.paymentStatus !== "paid");
  const remaining = Math.max(0, totals.totalAmount - amountPaid);
  const [showNotes, setShowNotes] = useState(false);
  const [noteReason, setNoteReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const hasExemptions = itemsToBill.some(
    (item) =>
      item.exempted ||
      item.exemptionType === "full" ||
      item.exemptionType === "patient-share",
  );
  const hasDiscount = totals.discount > 0;
  const hasManualPaidAdjustment =
    Math.abs(amountPaid - totals.totalAmount) > 0.001;

  const suggestedReasons = useMemo(() => {
    const reasons: string[] = [];
    if (hasDiscount) reasons.push("Clinic admin discount");
    if (hasExemptions) reasons.push("Exemption applied");
    if (hasManualPaidAdjustment && amountPaid < totals.totalAmount)
      reasons.push("Patient given loan due to insufficient funds");
    if (hasManualPaidAdjustment && amountPaid > totals.totalAmount)
      reasons.push("Adjusted paid amount");
    reasons.push("Deducted by doctor");
    reasons.push("Insurance adjustment");
    reasons.push("Promotional discount");
    reasons.push("Staff welfare");
    reasons.push("Charity case");
    reasons.push("Other");
    return reasons;
  }, [
    hasDiscount,
    hasExemptions,
    hasManualPaidAdjustment,
    amountPaid,
    totals.totalAmount,
  ]);

  // Reset reason selection each time the sheet opens so stale state from a
  // previous session doesn't leak into the next bill.
  useEffect(() => {
    if (open) {
      setNoteReason("");
      setCustomReason("");
    }
  }, [open]);

  // Force the note section open whenever a note is required.
  useEffect(() => {
    if (noteRequired && !showNotes) {
      setShowNotes(true);
    }
  }, [noteRequired, showNotes]);

  // Sync reason/customReason to parent billingNotes whenever one is chosen.
  useEffect(() => {
    if (!noteReason) return;
    let note = "";
    if (noteReason && noteReason !== "Other") {
      note = noteReason;
    } else if (noteReason === "Other" && customReason.trim()) {
      note = customReason.trim();
    }
    onBillingNotesChange?.(note);
  }, [noteReason, customReason, onBillingNotesChange]);

  const reasonMissing =
    noteRequired &&
    showNotes &&
    (!noteReason || (noteReason === "Other" && !customReason.trim()));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
          <SheetTitle>
            {showItemsReview
              ? "Review & Complete Bill"
              : "Edit Payment & Discount"}
          </SheetTitle>
          <SheetDescription>
            {showItemsReview
              ? `${itemsToBill.length} item${itemsToBill.length !== 1 ? "s" : ""} to bill — set payment details below`
              : "Update payment method, amount paid, or apply a discount"}
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
            {totals.discount > 0 && (
              <Row label="Discount" value={-totals.discount} variant="credit" />
            )}
            <div className="border-t border-border pt-2 flex justify-between items-baseline">
              <span className="font-semibold">Final amount due</span>
              <span className="text-lg font-bold text-[#FF6900] tabular-nums">
                {formatRWF(totals.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment & discount — part of the complete-bill step */}
          <div className="rounded-xl border border-border p-3 space-y-3">
            <p className="text-xs font-semibold text-foreground">Payment</p>

            <div>
              <label className="text-xs text-muted-foreground">
                Payment method
              </label>
              <Select
                value={paymentMethod || "MOBILE_MONEY"}
                onValueChange={(v) =>
                  onPaymentMethodChange(v as PaymentMethod)
                }
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

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Remaining balance</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
                {formatRWF(remaining)}
              </span>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">
                  Discount (optional)
                </span>
                {!showDiscountControls ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                    onClick={() => onShowDiscountControls(true)}
                  >
                    Apply discount
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                    onClick={() => {
                      onShowDiscountControls(false);
                      onDiscountChange(0);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {showDiscountControls && (
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <Select
                    value={discountInputType}
                    onValueChange={(v) => {
                      const next = v as "PERCENTAGE" | "FIXED";
                      onDiscountInputTypeChange(next);
                      if (next === "FIXED") {
                        onDiscountInputValueChange(totals.discount);
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">%</SelectItem>
                      <SelectItem value="FIXED">RWF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={0}
                    max={
                      discountInputType === "PERCENTAGE"
                        ? 100
                        : Math.max(0, totals.patientResponsibility)
                    }
                    value={discountInputValue}
                    onChange={(e) => {
                      const raw = Math.max(0, Number(e.target.value || 0));
                      onDiscountInputValueChange(raw);
                      if (discountInputType === "PERCENTAGE") {
                        onDiscountChange(Math.min(100, raw));
                      } else {
                        const capped = Math.min(
                          raw,
                          Math.max(0, totals.patientResponsibility),
                        );
                        const pct =
                          totals.patientResponsibility > 0
                            ? (capped / totals.patientResponsibility) * 100
                            : 0;
                        onDiscountChange(pct);
                      }
                    }}
                    className="h-9 tabular-nums"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-foreground">
                    Billing note
                  </span>
                  {noteRequired && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                      Required because{" "}
                      {hasExemptions
                        ? "an item is exempted"
                        : "the payment does not cover the full amount due"}
                      .
                    </p>
                  )}
                </div>
                {!showNotes ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                    onClick={() => setShowNotes(true)}
                  >
                    + Add note
                  </Button>
                ) : !noteRequired ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full text-xs"
                    onClick={() => {
                      setShowNotes(false);
                      setNoteReason("");
                      setCustomReason("");
                      onBillingNotesChange?.("");
                    }}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>

              {showNotes ? (
                <div className="space-y-2">
                  {noteRequired ? (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Reason
                        </label>
                        <Select
                          value={noteReason}
                          onValueChange={setNoteReason}
                        >
                          <SelectTrigger className="mt-1 h-9">
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {suggestedReasons.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {noteReason === "Other" ? (
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Other reason
                          </label>
                          <Textarea
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Type the reason"
                            className="mt-1 min-h-[90px]"
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Notes
                      </label>
                      <Textarea
                        value={billingNotes}
                        onChange={(e) =>
                          onBillingNotesChange?.(e.target.value)
                        }
                        placeholder="Add context for this billing decision..."
                        className="mt-1 min-h-[90px]"
                      />
                    </div>
                  )}

                  {billingNotes ? (
                    <p className="text-[11px] text-muted-foreground">
                      This note will be sent with the bill.
                    </p>
                  ) : null}
                </div>
              ) : null}
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
            disabled={creatingBill || reasonMissing}
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
