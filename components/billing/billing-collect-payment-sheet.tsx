"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VisitBilling } from "@/lib/api-types";

type PaymentMethod =
  | "CASH"
  | "MOBILE_MONEY"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "MIXED";
import { flattenDepartmentInsuranceBillings } from "@/lib/visit-billing-utils";
import { formatRWF } from "@/lib/utils";
import { roundMoney, sumMoney } from "@/lib/money";

export interface CollectPaymentEntry {
  departmentInsuranceBillingId: string;
  departmentName: string;
  insuranceLabel: string;
  outstandingAmount: number;
}

interface CollectPaymentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visitBilling: VisitBilling | null | undefined;
  recording: boolean;
  onRecordPayment: (input: {
    departmentInsuranceBillingId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    reference?: string;
    note?: string;
  }) => Promise<void>;
  /** Called once after all payments are recorded (e.g. to refetch billing). */
  onRecorded?: () => Promise<void>;
}


export function CollectPaymentSheet({
  open,
  onOpenChange,
  visitBilling,
  recording,
  onRecordPayment,
  onRecorded,
}: CollectPaymentSheetProps) {
  const buckets = useMemo(() => {
    if (!visitBilling) return [] as CollectPaymentEntry[];
    return flattenDepartmentInsuranceBillings(visitBilling)
      .map((ib) => {
        const dept = visitBilling.departments.find((d) =>
          (d.insuranceBillings || []).some((item) => item.id === ib.id),
        );
        return {
          departmentInsuranceBillingId: ib.id,
          departmentName:
            dept?.visitDepartment?.department?.name || "Department",
          insuranceLabel:
            ib.patientInsurance?.insuranceProvider?.insuranceName ||
            ib.patientInsurance?.insuranceProvider?.name ||
            "Private",
          // Outstanding is the patient's residual only (patient payable minus
          // paid) so it never shows insurance-contributed money, and a stale
          // backend outstandingAmount doesn't keep buckets (and the Collect
          // payment button) visible after the bill is fully settled.
          outstandingAmount: Math.max(
            0,
            Number(ib.patientPayableAmount || 0) -
              Number(ib.paidAmount || 0),
          ),
        };
      })
      .filter((entry) => entry.outstandingAmount > 0);
  }, [visitBilling]);

  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [methods, setMethods] = useState<Record<string, PaymentMethod>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const nextAmounts: Record<string, number> = {};
    const nextMethods: Record<string, PaymentMethod> = {};
    const nextNotes: Record<string, string> = {};
    for (const entry of buckets) {
      nextAmounts[entry.departmentInsuranceBillingId] =
        entry.outstandingAmount;
      nextMethods[entry.departmentInsuranceBillingId] = "MOBILE_MONEY";
      nextNotes[entry.departmentInsuranceBillingId] = "";
    }
    setAmounts(nextAmounts);
    setMethods(nextMethods);
    setNotes(nextNotes);
    setError(null);
  }, [open, buckets]);

  const totalToCollect = sumMoney(
    Object.values(amounts).map((amount) => Number(amount) || 0),
  );

  if (buckets.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 z-[95]" overlayClassName="z-[94]">
          <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
            <SheetTitle>Collect Payment</SheetTitle>
            <SheetDescription>
              There is no outstanding balance to collect on this bill.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  const handleSubmit = async () => {
    setError(null);
    const entries = buckets.filter(
      (entry) => Number(amounts[entry.departmentInsuranceBillingId] || 0) > 0,
    );
    if (entries.length === 0) {
      setError("Enter an amount to collect for at least one item.");
      return;
    }
    try {
      for (const entry of entries) {
        const amount = roundMoney(Number(amounts[entry.departmentInsuranceBillingId] || 0));
        if (amount > entry.outstandingAmount + 0.001) {
          throw new Error(
            `Payment for ${entry.departmentName} exceeds its outstanding balance of ${formatRWF(entry.outstandingAmount)}.`,
          );
        }
        const note = notes[entry.departmentInsuranceBillingId]?.trim();
        if (
          amount < entry.outstandingAmount - 0.001 &&
          !note
        ) {
          throw new Error(
            `A note is required for ${entry.departmentName} because the payment does not cover the full outstanding balance.`,
          );
        }
        await onRecordPayment({
          departmentInsuranceBillingId: entry.departmentInsuranceBillingId,
          amount,
          paymentMethod: methods[entry.departmentInsuranceBillingId] || "MOBILE_MONEY",
          note: note || undefined,
        });
      }
      await onRecorded?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col z-[95]" overlayClassName="z-[94]">
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
          <SheetTitle>Collect Payment</SheetTitle>
          <SheetDescription>
            Record a payment against the outstanding balance. Payments are
            recorded per insurance bucket.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {buckets.map((entry) => {
            const id = entry.departmentInsuranceBillingId;
            const amount = Number(amounts[id] || 0);
            const outstanding = entry.outstandingAmount;
            const note = notes[id] || "";
            const noteRequired = amount < outstanding - 0.001;
            return (
              <div
                key={id}
                className="rounded-xl border border-border bg-muted/20 p-3 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{entry.departmentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.insuranceLabel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">
                      Outstanding
                    </p>
                    <p className="text-sm font-bold tabular-nums">
                      {formatRWF(outstanding)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Amount
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={outstanding}
                      value={amount}
                      onChange={(e) =>
                        setAmounts((prev) => ({
                          ...prev,
                          [id]: Math.max(0, Number(e.target.value || 0)),
                        }))
                      }
                      className="mt-1 h-9 tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Method
                    </label>
                    <Select
                      value={methods[id] || "MOBILE_MONEY"}
                      onValueChange={(v) =>
                        setMethods((prev) => ({
                          ...prev,
                          [id]: v as PaymentMethod,
                        }))
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
                </div>

                {noteRequired ? (
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Note (required — balance remains)
                    </label>
                    <Textarea
                      value={note}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [id]: e.target.value }))
                      }
                      placeholder="Reason for the outstanding balance…"
                      className="mt-1 min-h-[70px]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Note (optional)
                    </label>
                    <Input
                      value={note}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [id]: e.target.value }))
                      }
                      placeholder="Optional reference…"
                      className="mt-1 h-9"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="rounded-xl border border-border bg-muted/30 p-3 flex items-center justify-between text-sm">
            <span className="font-medium">Total to collect</span>
            <span className="font-bold tabular-nums">
              {formatRWF(totalToCollect)}
            </span>
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-2">
              {error}
            </p>
          )}
        </div>

        <SheetFooter className="px-4 py-3 border-t border-border gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={recording}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-[#FF6900] hover:bg-[#e05f00] text-white"
            disabled={recording || totalToCollect <= 0}
            onClick={() => void handleSubmit()}
          >
            {recording ? "Recording…" : "Record payment"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
