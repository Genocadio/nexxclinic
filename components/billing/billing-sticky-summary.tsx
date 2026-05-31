'use client';

import { Receipt, Printer, Pencil, Layers, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type BillingTotals = {
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  discount: number;
  totalAmount: number;
};

type BillingStickySummaryProps = {
  totals: BillingTotals;
  amountPaid: number;
  currency?: string;
  viewMode: 'all' | 'service';
  activeService?: string;
  selectedCount?: number;
  existingBill?: {
    id: string;
    totalAmount: number;
    patientPayableAmount: number;
    paidAmount: number;
    outstandingAmount: number;
  } | null;
  canEditBilling: boolean;
  hasRemainingToBill: boolean;
  hasMultipleUnbilledServices: boolean;
  creatingBill: boolean;
  generatingInvoice: boolean;
  isEditingBill: boolean;
  exemptionCount: number;
  onCompleteBill: () => void;
  onPrint: () => void;
  onEditBilling: () => void;
  onDoneEditing: () => void;
  onToggleViewMode: () => void;
  onManageExemptions: () => void;
};

function formatRwf(amount: number) {
  return `${amount.toLocaleString()} RWF`;
}

export function BillingStickySummary({
  totals,
  amountPaid,
  currency = 'RWF',
  viewMode,
  activeService,
  selectedCount = 0,
  existingBill,
  canEditBilling,
  hasRemainingToBill,
  hasMultipleUnbilledServices,
  creatingBill,
  generatingInvoice,
  isEditingBill,
  exemptionCount,
  onCompleteBill,
  onPrint,
  onEditBilling,
  onDoneEditing,
  onToggleViewMode,
  onManageExemptions,
}: BillingStickySummaryProps) {
  const remaining = Math.max(0, totals.totalAmount - amountPaid);
  const showActions = canEditBilling || hasRemainingToBill;

  if (!showActions && !existingBill) return null;

  return (
    <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-xl py-3">
      <div className="px-6">
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Totals — compact horizontal strip */}
        <div className="flex-1 flex items-center gap-4 lg:gap-6 min-w-0 overflow-x-auto">
          <div className="flex items-center gap-4 lg:gap-5 text-xs shrink-0">
            <SummaryLine label="Service Total" value={formatRwf(totals.subtotal)} />
            {totals.insuranceCoverage > 0 && (
              <SummaryLine
                label="Insurance"
                value={`−${totals.insuranceCoverage.toLocaleString()} ${currency}`}
                className="text-emerald-600 dark:text-emerald-400"
              />
            )}
            <SummaryLine label="Patient" value={formatRwf(totals.patientResponsibility)} />
            {totals.discount > 0 && (
              <SummaryLine
                label="Discount"
                value={`−${totals.discount.toLocaleString()} ${currency}`}
                className="text-red-500 dark:text-red-400"
              />
            )}
          </div>

          <div className="h-8 w-px bg-border shrink-0 hidden sm:block" />

          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              {viewMode === 'service' && activeService ? `${activeService} · Due` : 'Amount Due'}
            </p>
            {selectedCount > 0 && !existingBill && (
              <p className="text-[10px] text-muted-foreground">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </p>
            )}
            <p className="text-xl font-bold text-[#FF6900] tabular-nums leading-tight">
              {formatRwf(totals.totalAmount)}
            </p>
            {!existingBill && amountPaid > 0 && (
              <p className="text-[10px] text-muted-foreground tabular-nums">
                Paid {amountPaid.toLocaleString()} · Remaining {remaining.toLocaleString()}
              </p>
            )}
          </div>

          {existingBill && (
            <div className="hidden md:flex items-center gap-3 text-[11px] text-muted-foreground shrink-0 border-l border-border pl-4">
              <span>
                Billed <span className="font-medium text-foreground">{existingBill.id.slice(0, 8)}…</span>
              </span>
              <span>Balance {existingBill.outstandingAmount.toLocaleString()} {currency}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1.5 shrink-0">
            {!canEditBilling && hasRemainingToBill && (
              <>
                {hasMultipleUnbilledServices && (
                  <ActionButton
                    icon={viewMode === 'service' ? List : Layers}
                    label={viewMode === 'service' ? 'All items' : 'By service'}
                    onClick={onToggleViewMode}
                  />
                )}
                {exemptionCount > 0 && (
                  <ActionButton
                    icon={Receipt}
                    label={`Exemptions (${exemptionCount})`}
                    onClick={onManageExemptions}
                    badge={exemptionCount}
                  />
                )}
                <Button
                  size="sm"
                  className="h-9 rounded-full bg-[#FF6900] hover:bg-[#e05f00] text-white text-xs px-4"
                  disabled={creatingBill}
                  onClick={onCompleteBill}
                >
                  <Receipt className="h-3.5 w-3.5 mr-1.5" />
                  {creatingBill ? 'Processing…' : 'Complete Bill'}
                </Button>
              </>
            )}

            {canEditBilling && (
              <>
                <ActionButton icon={Pencil} label="Edit billing" onClick={onEditBilling} />
                <ActionButton
                  icon={Printer}
                  label={generatingInvoice ? 'Loading PDF…' : 'Print invoice'}
                  onClick={onPrint}
                  disabled={generatingInvoice}
                />
                {isEditingBill && (
                  <Button
                    size="sm"
                    className="h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    onClick={onDoneEditing}
                  >
                    Done
                  </Button>
                )}
              </>
            )}
          </div>
        </TooltipProvider>
      </div>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="shrink-0">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`font-semibold tabular-nums ${className}`}>{value}</p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: number;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full relative"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
              {badge}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
