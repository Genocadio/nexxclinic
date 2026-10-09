"use client";

import { useMemo } from "react";
import { Printer, Pencil, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { VisitBilling } from "@/lib/api-types";
import { getVisitBillingTotals } from "@/lib/visit-billing-utils";
import { formatRWF } from "@/lib/utils";

type BillingTotals = {
  subtotal: number;
  insuranceCoverage: number;
  patientResponsibility: number;
  totalAmount: number;
  waivedTotal?: number;
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
  onPrintInvoice?: (departmentInsuranceBillingId: string, copyType?: string) => Promise<void> | void;
  onEditBilling: () => void;
  onDoneEditing: () => void;
  onCompleteVisit?: () => void;
  invoiceBlockedUntilComplete?: boolean;
  onInvoiceBlockedClick?: () => void;
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
  onPrintInvoice,
  onEditBilling,
  onDoneEditing,
  onCompleteVisit,
  invoiceBlockedUntilComplete = false,
  onInvoiceBlockedClick,
}: BillingStickySummaryProps) {
  const remaining = Math.max(0, totals.totalAmount - amountPaid);
  const showActions = canEditBilling || hasRemainingToBill;
  const canAct = !hasUnreadNotes;
  const handleInvoiceClick = () => {
    if (invoiceBlockedUntilComplete) {
      onInvoiceBlockedClick?.();
      return;
    }
    onPrint();
  };
  const billingTotals = existingVisitBilling
    ? getVisitBillingTotals(existingVisitBilling)
    : null;

  const printableOptions = useMemo(() => {
    if (!existingVisitBilling?.departments) return [];
    const options: Array<{
      id: string;
      title: string;
      insuranceLabel: string;
      hasInsurance: boolean;
      totalAmount: number;
      insuranceCoveredAmount: number;
      patientPayableAmount: number;
    }> = [];

    for (const d of existingVisitBilling.departments) {
      const deptName = d.visitDepartment?.department?.name || "";
      for (const ib of d.insuranceBillings || []) {
        const insName =
          ib.patientInsurance?.insuranceProvider?.insuranceName ||
          ib.patientInsurance?.insuranceProvider?.name ||
          ib.patientInsurance?.insuranceProvider?.acronym ||
          "";
        const hasIns = Boolean(ib.patientInsurance != null);
        options.push({
          id: ib.id,
          title: deptName ? `${deptName}` : "Invoice",
          insuranceLabel: insName || (hasIns ? "Insurance" : "Private"),
          hasInsurance: hasIns,
          totalAmount: Number(ib.totalAmount || 0),
          insuranceCoveredAmount: Number(ib.insuranceCoveredAmount || 0),
          patientPayableAmount: Number(ib.patientPayableAmount || 0),
        });
      }
    }
    return options;
  }, [existingVisitBilling]);

  if (!showActions && !existingVisitBilling) return null;

  return (
    <div className="flex-shrink-0 overflow-hidden border-t border-border bg-card/80 backdrop-blur-xl py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="px-6">
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex-1 flex items-stretch gap-3 lg:gap-4 min-w-0 overflow-x-auto">
              <BillingBreakdown
                totals={totals}
                billingTotals={billingTotals}
                existingVisitBilling={Boolean(existingVisitBilling)}
                hasRemainingToBill={hasRemainingToBill}
                isEditingBill={isEditingBill}
              />

              <div className="h-8 w-px bg-border shrink-0 hidden sm:block" />

              {isEditingBill ? (
                /* DEPARTMENT_EDITING mode — show editing status */
                <div className="shrink-0">
                  <p className="text-[11px] uppercase tracking-wide text-amber-600 dark:text-amber-400 font-medium">
                    Editing billing
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {hasEditChanges ? "Changes detected — click Complete Edit to save" : "No changes yet — modify items to enable Complete Edit"}
                  </p>
                </div>
              ) : existingVisitBilling && billingTotals ? (
                <div className="rounded-xl border border-border/70 bg-background/40 px-3 py-2 shrink-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Payment status
                  </p>
                  <div className="flex items-center gap-4 lg:gap-5 text-xs">
                    <SummaryLine label="Paid" value={formatRWF(billingTotals.paidAmount)} />
                    <SummaryLine
                      label="Balance"
                      value={formatRWF(
                        billingTotals.loanOutstandingAmount +
                          billingTotals.giveawayOutstandingAmount,
                      )}
                    />
                  </div>
                </div>
              ) : (
                /* Pre-billing — show amount due */
                <div className="shrink-0">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                    {activeService ? `${activeService} · Due` : "Amount Due"}
                  </p>
                  {selectedCount > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      {selectedCount} item{selectedCount !== 1 ? "s" : ""}
                    </p>
                  )}
                  <p className="text-xl font-bold text-[#FF6900] tabular-nums leading-tight">
                    {formatRWF(totals.totalAmount)}
                  </p>
                  {amountPaid > 0 && (
                    <p className="text-[11px] text-muted-foreground tabular-nums">
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
                        className="h-9 rounded-full text-xs px-4"
                        disabled={creatingBill || hasUnreadNotes}
                        onClick={onCompleteBill}
                      >
                        {creatingBill ? "Processing…" : "Complete Edit"}
                      </Button>
                    )}
                  </>
                )}

                {!isEditingBill && hasRemainingToBill && (
                  <Button
                    size="sm"
                    className="h-9 rounded-full text-xs px-4"
                    disabled={creatingBill || hasUnreadNotes}
                    onClick={onCompleteBill}
                  >
                    {creatingBill ? "Processing…" : "Complete Bill"}
                  </Button>
                )}

                {existingVisitBilling && !isEditingBill && !invoiceBlockedUntilComplete && (
                  <>
                    {printableOptions.length === 1 && !printableOptions[0].hasInsurance ? (
                      <ActionButton
                        icon={Printer}
                        label={
                          generatingInvoice ? "Loading PDF…" : "Print invoice"
                        }
                        onClick={() => {
                          if (invoiceBlockedUntilComplete) {
                            onInvoiceBlockedClick?.();
                            return;
                          }
                          if (onPrintInvoice) {
                            void onPrintInvoice(printableOptions[0].id, "PATIENT");
                          } else {
                            onPrint();
                          }
                        }}
                        disabled={generatingInvoice}
                        aria-disabled={invoiceBlockedUntilComplete}
                        className={invoiceBlockedUntilComplete ? "opacity-50" : undefined}
                      />
                    ) : printableOptions.length > 0 ? (
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={generatingInvoice}
                                aria-disabled={invoiceBlockedUntilComplete}
                                aria-label="Print invoice"
                                className={invoiceBlockedUntilComplete ? "h-9 w-9 rounded-full relative opacity-50" : "h-9 w-9 rounded-full relative"}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>{generatingInvoice ? "Loading PDF…" : "Print invoice"}</TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-80 z-[100]">
                          {printableOptions.map((opt) => (
                            <div key={opt.id} className="p-1 border-b last:border-b-0 border-border/50">
                              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                <span>{opt.insuranceLabel}</span>
                                {opt.title && <span className="font-normal lowercase text-[11px] text-muted-foreground/70">{opt.title}</span>}
                              </div>
                              {opt.hasInsurance ? (
                                <>
                                  <DropdownMenuItem
                                    disabled={generatingInvoice}
                                    onSelect={() => invoiceBlockedUntilComplete ? onInvoiceBlockedClick?.() : onPrintInvoice?.(opt.id, "INSURANCE")}
                                    className="cursor-pointer"
                                  >
                                    <span className="truncate">📄 Insurer Copy (Claim)</span>
                                    <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                      {formatRWF(opt.insuranceCoveredAmount)}
                                    </span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    disabled={generatingInvoice}
                                    onSelect={() => invoiceBlockedUntilComplete ? onInvoiceBlockedClick?.() : onPrintInvoice?.(opt.id, "PATIENT")}
                                    className="cursor-pointer"
                                  >
                                    <span className="truncate">🧾 Patient Receipt & Statement</span>
                                    <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                      {formatRWF(opt.patientPayableAmount)}
                                    </span>
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem
                                  disabled={generatingInvoice}
                                  onSelect={() => invoiceBlockedUntilComplete ? onInvoiceBlockedClick?.() : onPrintInvoice?.(opt.id, "PATIENT")}
                                  className="cursor-pointer"
                                >
                                  <span className="truncate">🧾 Patient Receipt</span>
                                  <span className="ml-auto pl-3 text-xs text-muted-foreground tabular-nums">
                                    {formatRWF(opt.totalAmount)}
                                  </span>
                                </DropdownMenuItem>
                              )}
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <ActionButton
                        icon={Printer}
                        label={
                          generatingInvoice ? "Loading PDF…" : "Print invoice"
                        }
                        onClick={handleInvoiceClick}
                        disabled={generatingInvoice}
                        className={invoiceBlockedUntilComplete ? "opacity-50" : undefined}
                      />
                    )}
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
  hint,
  hintTitle,
}: {
  label: string;
  value: string;
  className?: string;
  hint?: string;
  hintTitle?: string;
}) {
  return (
    <div className="shrink-0">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`font-semibold tabular-nums ${className}`}>{value}</p>
      {hint && (
        <p
          className="text-[10px] leading-tight text-muted-foreground tabular-nums"
          title={hintTitle}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function BillingBreakdown({
  totals,
  billingTotals,
  existingVisitBilling,
  hasRemainingToBill,
  isEditingBill,
}: {
  totals: BillingTotals;
  billingTotals: ReturnType<typeof getVisitBillingTotals> | null;
  existingVisitBilling: boolean;
  hasRemainingToBill: boolean;
  isEditingBill: boolean;
}) {
  const billedRow = billingTotals
    ? {
        label: "Already billed",
        total: billingTotals.totalAmount,
        insurance: billingTotals.insuranceCoveredAmount,
        exemption: billingTotals.waivedAmount || 0,
        giveaway: billingTotals.giveawayOutstandingAmount,
        loan: billingTotals.loanOutstandingAmount,
        patient: billingTotals.patientPayableAmount,
      }
    : null;
  const newRow = {
    label: existingVisitBilling ? "New to bill" : "To bill",
    total: totals.subtotal,
    insurance: totals.insuranceCoverage,
    exemption: totals.waivedTotal || 0,
    giveaway: 0,
    loan: 0,
    patient: totals.patientResponsibility,
  };
  const rows =
    !isEditingBill && billedRow && hasRemainingToBill
      ? [billedRow, newRow]
      : [billedRow || newRow];

  return (
    <div className="shrink-0 overflow-hidden rounded-xl border border-border/70 bg-background/40 px-3 py-2">
      <table className="text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground">
            <th className="pr-5 font-medium">Summary</th>
            <th className="px-3 text-right font-medium">Total</th>
            <th className="px-3 text-right font-medium">Insurance</th>
            <th className="px-3 text-right font-medium">Adjustments</th>
            <th className="pl-3 text-right font-medium">Patient payment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border/50">
              <th className="pr-5 py-1 text-left font-medium text-foreground whitespace-nowrap">
                {row.label}
              </th>
              <td className="px-3 py-1 text-right font-semibold tabular-nums">
                {formatRWF(row.total)}
              </td>
              <td className="px-3 py-1 text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {row.insurance > 0 ? formatRWF(row.insurance) : "—"}
              </td>
              <td className="px-3 py-1 text-right font-semibold tabular-nums text-purple-600 dark:text-purple-400">
                {row.exemption + row.giveaway + row.loan > 0
                  ? formatRWF(row.exemption + row.giveaway + row.loan)
                  : "—"}
                {(row.exemption > 0 || row.giveaway > 0 || row.loan > 0) && (
                  <div className="mt-0.5 space-y-0.5 text-[10px] font-normal leading-tight text-muted-foreground">
                    {row.exemption > 0 && (
                      <div>Exemption {formatRWF(row.exemption)}</div>
                    )}
                    {row.giveaway > 0 && (
                      <div>Giveaway {formatRWF(row.giveaway)}</div>
                    )}
                    {row.loan > 0 && (
                      <div>Loan {formatRWF(row.loan)}</div>
                    )}
                  </div>
                )}
              </td>
              <td
                className="pl-3 py-1 text-right font-semibold tabular-nums"
                title={
                  row.label === "Already billed" && billingTotals?.paymentMethods.length
                    ? `Payment mode: ${billingTotals.paymentMethods.join(", ")}`
                    : undefined
                }
              >
                <div>{formatRWF(row.patient)}</div>
                {row.exemption > 0 && (
                  <div className="text-[10px] font-normal text-muted-foreground">
                    Expected {formatRWF(row.patient + row.exemption)}
                  </div>
                )}
                {row.label === "Already billed" &&
                  billingTotals?.paymentMethods.length ? (
                  <div className="text-[10px] font-normal text-muted-foreground">
                    {billingTotals.paymentMethods
                      .map((method) => method.replaceAll("_", " "))
                      .join(", ")}
                  </div>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  badge?: number;
  tooltipOverride?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full relative ${className || ""}`}
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 bg-destructive rounded-full text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
              {badge}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipOverride || label}</TooltipContent>
    </Tooltip>
  );
}
