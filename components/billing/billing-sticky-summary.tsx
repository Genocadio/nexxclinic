"use client";

import { Printer, Pencil, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { VisitBilling } from "@/lib/api-types";
import { getVisitBillingTotals } from "@/lib/visit-billing-utils";
import { formatRWF } from "@/lib/utils";

type BillingTotals = {
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  totalAmount: number;
};

type BillingStickySummaryProps = {
  totals: BillingTotals;
  amountPaid: number;
  currency?: string;
  activeService?: string;
  selectedCount?: number;
  existingVisitBilling?: VisitBilling | null;
  canEditBilling: boolean;
  hasRemainingToBill: boolean;
  canCompleteVisit?: boolean;
  completingVisit?: boolean;
  creatingBill: boolean;
  generatingInvoice: boolean;
  isEditingBill: boolean;
  hasEditChanges?: boolean;
  hasUnreadNotes?: boolean;
  loadingEditBilling?: boolean;
  loadingDoneEditing?: boolean;
  onCompleteBill: () => void;
  onPreview: () => void;
  onPrint: () => void;
  onEditBilling: () => void;
  onDoneEditing: () => void;
  onCompleteVisit?: () => void;
};

export function BillingStickySummary({
  totals,
  amountPaid,
  activeService,
  selectedCount = 0,
  existingVisitBilling,
  canEditBilling,
  hasRemainingToBill,
  canCompleteVisit = false,
  completingVisit = false,
  creatingBill,
  generatingInvoice,
  isEditingBill,
  hasEditChanges = false,
  hasUnreadNotes = false,
  loadingEditBilling = false,
  loadingDoneEditing = false,
  onCompleteBill,
  onPrint,
  onEditBilling,
  onDoneEditing,
  onCompleteVisit,
}: BillingStickySummaryProps) {
  const remaining = Math.max(0, totals.totalAmount - amountPaid);
  const showActions = canEditBilling || hasRemainingToBill;
  const canAct = !hasUnreadNotes;
  const billingTotals = existingVisitBilling
    ? getVisitBillingTotals(existingVisitBilling)
    : null;

  if (!showActions && !existingVisitBilling) return null;

  return (
    <div className="flex-shrink-0 overflow-hidden border-t border-border bg-card/80 backdrop-blur-xl py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="px-6">
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Totals — compact horizontal strip */}
            <div className="flex-1 flex items-center gap-4 lg:gap-6 min-w-0 overflow-x-auto">
              {existingVisitBilling && billingTotals && !isEditingBill ? (
                /* Already billed — show the actual billing breakdown */
                <div className="flex items-center gap-4 lg:gap-5 text-xs shrink-0">
                  <SummaryLine
                    label="Service Total"
                    value={formatRWF(billingTotals.totalAmount)}
                  />
                  {billingTotals.insuranceCoveredAmount > 0 && (
                    <SummaryLine
                      label="Insurance"
                      value={formatRWF(billingTotals.insuranceCoveredAmount)}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                  <SummaryLine
                    label="Patient"
                    value={formatRWF(billingTotals.patientPayableAmount)}
                  />
                </div>
              ) : (
                /* Pre-billing or editing — show computed totals */
                <div className="flex items-center gap-4 lg:gap-5 text-xs shrink-0">
                  <SummaryLine
                    label="Service Total"
                    value={formatRWF(totals.subtotal)}
                  />
                  {totals.insuranceCoverage > 0 && (
                    <SummaryLine
                      label="Insurance"
                      value={`−${formatRWF(totals.insuranceCoverage)}`}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  )}
                  <SummaryLine
                    label="Patient"
                    value={formatRWF(totals.patientResponsibility)}
                  />
                </div>
              )}

              <div className="h-8 w-px bg-border shrink-0 hidden sm:block" />

              {isEditingBill ? (
                /* DEPARTMENT_EDITING mode — show editing status */
                <div className="shrink-0">
                  <p className="text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400 font-medium">
                    Editing billing
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {hasEditChanges ? "Changes detected — click Complete Edit to save" : "No changes yet — modify items to enable Complete Edit"}
                  </p>
                </div>
              ) : existingVisitBilling && billingTotals ? (
                /* Already billed — show paid + outstanding */
                <div className="shrink-0">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    Billed {existingVisitBilling.id.slice(0, 8)}…
                  </p>
                  <p className="text-[11px] text-green-600 dark:text-green-400 tabular-nums">
                    Paid {formatRWF(billingTotals.paidAmount)}
                  </p>
                  {billingTotals.outstandingAmount > 0 && (
                    <p className="text-[11px] text-orange-600 dark:text-orange-400 tabular-nums">
                      Outstanding {formatRWF(billingTotals.outstandingAmount)}
                    </p>
                  )}
                </div>
              ) : (
                /* Pre-billing — show amount due */
                <div className="shrink-0">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    {activeService ? `${activeService} · Due` : "Amount Due"}
                  </p>
                  {selectedCount > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      {selectedCount} item{selectedCount !== 1 ? "s" : ""}
                    </p>
                  )}
                  <p className="text-xl font-bold text-[#FF6900] tabular-nums leading-tight">
                    {formatRWF(totals.totalAmount)}
                  </p>
                  {amountPaid > 0 && (
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      Paid {formatRWF(amountPaid)} · Remaining {formatRWF(remaining)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center gap-1.5 shrink-0">
                {isEditingBill && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 rounded-full text-xs"
                      disabled={loadingDoneEditing || creatingBill}
                      onClick={onDoneEditing}
                    >
                      {loadingDoneEditing ? "Cancelling…" : "Cancel"}
                    </Button>
                    {hasEditChanges && (
                      <Button
                        size="sm"
                        className="h-9 rounded-full bg-[#FF6900] hover:bg-[#e05f00] text-white text-xs px-4"
                        disabled={creatingBill || hasUnreadNotes}
                        onClick={onCompleteBill}
                      >
                        {creatingBill ? "Processing…" : "Complete Edit"}
                      </Button>
                    )}
                  </>
                )}

                {!isEditingBill && hasRemainingToBill && !existingVisitBilling && (
                  <Button
                    size="sm"
                    className="h-9 rounded-full bg-[#FF6900] hover:bg-[#e05f00] text-white text-xs px-4"
                    disabled={creatingBill || hasUnreadNotes}
                    onClick={onCompleteBill}
                  >
                    {creatingBill ? "Processing…" : "Complete Bill"}
                  </Button>
                )}

                {existingVisitBilling && !isEditingBill && (
                  <>
                    <ActionButton
                      icon={Printer}
                      label={
                        generatingInvoice ? "Loading PDF…" : "Print invoice"
                      }
                      onClick={onPrint}
                      disabled={generatingInvoice}
                    />
                  </>
                )}

                {existingVisitBilling && canCompleteVisit && !isEditingBill && (
                  <ActionButton
                    icon={CheckCircle}
                    label={
                      completingVisit ? "Completing…" : "Complete visit"
                    }
                    onClick={() => onCompleteVisit?.()}
                    disabled={!canAct || completingVisit}
                    tooltipOverride={
                      !canAct
                        ? "View unread notes to complete the visit"
                        : completingVisit
                          ? "Completing visit…"
                          : undefined
                    }
                  />
                )}

                {existingVisitBilling && canEditBilling && !isEditingBill && (
                  <ActionButton
                    icon={Pencil}
                    label={loadingEditBilling ? "Entering edit mode…" : "Edit billing"}
                    onClick={onEditBilling}
                    disabled={!canAct || loadingEditBilling}
                    tooltipOverride={
                      !canAct
                        ? "View unread notes to enable billing actions"
                        : loadingEditBilling
                          ? "Entering edit mode…"
                          : undefined
                    }
                  />
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
  className = "",
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
  tooltipOverride,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: number;
  tooltipOverride?: string;
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
      <TooltipContent>{tooltipOverride || label}</TooltipContent>
    </Tooltip>
  );
}
