"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isInsuranceActive, insuranceStatusLabel } from "@/lib/insurance-utils";

type PatientInsuranceBadgeProps = {
  insurance: {
    id: string;
    insuranceProvider?: {
      acronym?: string | null;
      insuranceName?: string | null;
      name?: string | null;
    } | null;
    insuranceCardNumber?: string | null;
    providingCompanyOrEmployer?: string | null;
    principalMember?: boolean;
    principalMemberName?: string | null;
    validFrom?: string | null;
    validUntil?: string | null;
    deactivated?: boolean | null;
  };
  compact?: boolean;
};

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export function PatientInsuranceBadge({
  insurance,
  compact = false,
}: PatientInsuranceBadgeProps) {
  const providerName =
    insurance.insuranceProvider?.insuranceName ||
    insurance.insuranceProvider?.name ||
    "Insurance";
  const normalizedInsurance = {
    ...insurance,
    deactivated: Boolean(insurance.deactivated),
  };
  const active = isInsuranceActive(normalizedInsurance);
  const memberName =
    insurance.principalMemberName ||
    (insurance.principalMember ? "Principal member" : "Dependent");

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`cursor-help ${
              compact ? "px-2 py-1 text-xs" : "h-6 px-2 text-[12px]"
            } rounded-full border ${
              active
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 opacity-60"
            }`}
          >
            {active ? (
              <Shield className="mr-1 h-3 w-3" />
            ) : (
              <ShieldAlert className="mr-1 h-3 w-3" />
            )}
            {insurance.insuranceProvider?.acronym || providerName}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" className="w-72 p-3">
          <div className="space-y-1.5 text-xs">
            <p className="font-semibold">{providerName}</p>
            <p className="text-muted-foreground">
              Status: {active ? "Active" : insuranceStatusLabel(normalizedInsurance)}
            </p>
            <div className="border-t border-border/50 pt-1.5">
              <p>Card number: {insurance.insuranceCardNumber || "—"}</p>
              <p>Member: {memberName}</p>
              {insurance.providingCompanyOrEmployer && (
                <p>Employer: {insurance.providingCompanyOrEmployer}</p>
              )}
              <p>
                Valid: {formatDate(insurance.validFrom)} –{" "}
                {formatDate(insurance.validUntil)}
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
