'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BillingItem, calculateItemTotal } from '@/lib/billing-utils';

type BillingTotals = {
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  discount: number;
  totalAmount: number;
};

type BillingConfirmSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: BillingItem[];
  selectedItemIds: string[];
  totals: BillingTotals;
  amountPaid: number;
  paymentMethod: 'cash' | 'momo' | 'airtel-money' | 'pending';
  creatingBill: boolean;
  showItemsReview?: boolean;
  showDiscountControls: boolean;
  discountInputType: 'PERCENTAGE' | 'FIXED';
  discountInputValue: number;
  onPaymentMethodChange: (method: 'cash' | 'momo' | 'airtel-money' | 'pending') => void;
  onAmountPaidChange: (amount: number) => void;
  onShowDiscountControls: (show: boolean) => void;
  onDiscountInputTypeChange: (type: 'PERCENTAGE' | 'FIXED') => void;
  onDiscountInputValueChange: (value: number) => void;
  onDiscountChange: (percent: number) => void;
  onConfirm: () => void;
};

export function BillingConfirmSheet({
  open,
  onOpenChange,
  items,
  selectedItemIds,
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
  onConfirm,
}: BillingConfirmSheetProps) {
  const itemsToBill = items.filter(
    (item) => selectedItemIds.includes(item.id) && item.paymentStatus !== 'paid',
  );
  const remaining = Math.max(0, totals.totalAmount - amountPaid);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
          <SheetTitle>{showItemsReview ? 'Review & Complete Bill' : 'Edit Payment & Discount'}</SheetTitle>
          <SheetDescription>
            {showItemsReview
              ? `${itemsToBill.length} item${itemsToBill.length !== 1 ? 's' : ''} to bill — set payment details below`
              : 'Update payment method, amount paid, or apply a discount'}
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
                      <p className="font-medium truncate text-foreground">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.quantity} × {item.price.toLocaleString()} RWF
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums shrink-0">
                      {lineTotal.toLocaleString()} RWF
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-1.5 text-sm">
            <Row label="Service total" value={totals.subtotal} />
            {totals.insuranceCoverage > 0 && (
              <Row label="Insurance contribution" value={-totals.insuranceCoverage} variant="credit" />
            )}
            <Row label="Patient responsibility" value={totals.patientResponsibility} bold />
            {totals.discount > 0 && <Row label="Discount" value={-totals.discount} variant="credit" />}
            <div className="border-t border-border pt-2 flex justify-between items-baseline">
              <span className="font-semibold">Final amount due</span>
              <span className="text-lg font-bold text-[#FF6900] tabular-nums">
                {totals.totalAmount.toLocaleString()} RWF
              </span>
            </div>
          </div>

          {/* Payment & discount — part of the complete-bill step */}
          <div className="rounded-xl border border-border p-3 space-y-3">
            <p className="text-xs font-semibold text-foreground">Payment</p>

            <div>
              <label className="text-xs text-muted-foreground">Payment method</label>
              <Select
                value={paymentMethod && paymentMethod !== 'pending' ? paymentMethod : 'momo'}
                onValueChange={(v) => onPaymentMethodChange(v as 'cash' | 'momo' | 'airtel-money')}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="momo">MoMo</SelectItem>
                  <SelectItem value="airtel-money">Airtel Money</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Amount paid</label>
              <Input
                type="number"
                min={0}
                value={amountPaid}
                onChange={(e) => onAmountPaidChange(Math.max(0, Number(e.target.value || 0)))}
                className="mt-1 h-9 tabular-nums"
              />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Remaining balance</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
                {remaining.toLocaleString()} RWF
              </span>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">Discount (optional)</span>
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
                      const next = v as 'PERCENTAGE' | 'FIXED';
                      onDiscountInputTypeChange(next);
                      if (next === 'FIXED') {
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
                      discountInputType === 'PERCENTAGE'
                        ? 100
                        : Math.max(0, totals.patientResponsibility)
                    }
                    value={discountInputValue}
                    onChange={(e) => {
                      const raw = Math.max(0, Number(e.target.value || 0));
                      onDiscountInputValueChange(raw);
                      if (discountInputType === 'PERCENTAGE') {
                        onDiscountChange(Math.min(100, raw));
                      } else {
                        const capped = Math.min(raw, Math.max(0, totals.patientResponsibility));
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
          </div>
        </div>

        <SheetFooter className="px-4 py-3 border-t border-border gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-[#FF6900] hover:bg-[#e05f00] text-white"
            disabled={creatingBill}
            onClick={onConfirm}
          >
            {creatingBill
              ? 'Processing…'
              : showItemsReview
                ? 'Confirm & Complete'
                : 'Save changes'}
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
  variant?: 'credit';
}) {
  const formatted =
    variant === 'credit'
      ? `−${Math.abs(value).toLocaleString()} RWF`
      : `${value.toLocaleString()} RWF`;

  return (
    <div className="flex justify-between text-xs">
      <span className={bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{label}</span>
      <span
        className={`tabular-nums ${bold ? 'font-semibold' : ''} ${
          variant === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : ''
        } ${highlight ? 'font-semibold text-orange-600 dark:text-orange-400' : ''}`}
      >
        {formatted}
      </span>
    </div>
  );
}
