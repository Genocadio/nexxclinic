"use client";

import { Plus, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { PatientInsurance } from "@/lib/api-types";
import { isInsuranceActive, insuranceStatusLabel } from "@/lib/insurance-utils";
import { PatientInsuranceBadge } from "@/components/patient-insurance-badge";
import { VisitPresenceBadge } from "@/components/visit-presence-badge";

type BillingPatientBarProps = {
  visitId?: string;
  patientName: string;
  patientAge: number;
  gender: string;
  visitDate: string;
  patientIdentifier?: string;
  patientIdNumber?: string;
  patientInsurances: PatientInsurance[];
  activeInsuranceIds: Set<string>;
  addingVisitInsurance: boolean;
  /** Insurance IDs that are used in billed items — cannot be removed. */
  billedInsuranceIds?: Set<string>;
  /** When true, visit is already billed and not in edit mode — all visit insurances are read-only. */
  readOnly?: boolean;
  onToggleInsurance: (insuranceId: string, active: boolean) => void;
  onAddInsurance: () => void;
};

export function BillingPatientBar({
  visitId,
  patientName,
  patientAge,
  gender,
  visitDate,
  patientIdentifier,
  patientIdNumber,
  patientInsurances,
  activeInsuranceIds,
  addingVisitInsurance,
  billedInsuranceIds,
  readOnly = false,
  onToggleInsurance,
  onAddInsurance,
}: BillingPatientBarProps) {
  const visitActiveInsurances = patientInsurances.filter((p) =>
    activeInsuranceIds.has(p.id),
  );
  const visitDateLabel = new Date(visitDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex-shrink-0 border-b border-border/50 bg-card/40 backdrop-blur-sm pt-5 pb-2.5">
      <div className="px-6">
        <div className="w-full min-w-0 mx-auto px-2 sm:px-4 md:px-[1cm] lg:px-[2cm]">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {patientName}
              </h1>
              {visitId && <VisitPresenceBadge visitId={visitId} />}
              <Separator
                orientation="vertical"
                className="h-4 hidden sm:block"
              />
              <div className="hidden sm:flex items-center gap-2.5 text-xs text-muted-foreground shrink-0">
                <span>{patientAge}y</span>
                <span className="text-border">·</span>
                <span className="capitalize">{gender || "—"}</span>
                <span className="text-border">·</span>
                <span>{visitDateLabel}</span>
                {patientIdentifier && (
                  <>
                    <span className="text-border">·</span>
                    <span className="font-mono text-[12px]">
                      {patientIdentifier}
                    </span>
                  </>
                )}
                {patientIdNumber && (
                  <>
                    <span className="text-border">·</span>
                    <span className="font-mono text-[12px]">
                      {patientIdNumber}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {visitActiveInsurances.length > 0 ? (
                visitActiveInsurances.map((pIns) => {
                  return (
                    <PatientInsuranceBadge
                      key={pIns.id}
                      insurance={pIns}
                    />
                  );
                })
              ) : (
                <span className="text-[12px] text-muted-foreground">
                  No insurance on this visit
                </span>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs rounded-full text-muted-foreground hover:text-foreground"
                  >
                    Patient insurances
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[22rem] p-0 rounded-xl overflow-hidden"
                >
                  <div className="px-3 pt-3 pb-2 border-b border-border/60 bg-muted/30">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Patient insurances
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          Insurances are stored on the patient record. Check
                          those to use for billing on this visit.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[11px] rounded-full shrink-0"
                        onClick={onAddInsurance}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to patient
                      </Button>
                    </div>
                  </div>

                  <div className="p-3">
                    {patientInsurances.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border/70 px-3 py-4 text-center">
                        <p className="text-xs text-muted-foreground">
                          No insurances on this patient yet.
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 mt-1 text-xs"
                          onClick={onAddInsurance}
                        >
                          Add insurance to patient record
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-52 overflow-y-auto">
                        {patientInsurances.map((pIns) => {
                          const usedOnVisit = activeInsuranceIds.has(pIns.id);
                          const active = isInsuranceActive(pIns);
                          return (
                            <label
                              key={pIns.id}
                              title={
                                readOnly
                                  ? "Visit is already billed. Click 'Edit billing' to modify insurances."
                                  : !active
                                    ? insuranceStatusLabel(pIns)
                                    : usedOnVisit && billedInsuranceIds?.has(pIns.id)
                                      ? "This insurance is used in a billed item. In edit mode, remove or change the products using this insurance first."
                                      : undefined
                              }
                              className={`flex items-start gap-2.5 text-xs rounded-lg border px-2.5 py-2 transition-colors ${
                                readOnly || !active
                                  ? "opacity-60 cursor-not-allowed border-border/40 bg-muted/20"
                                  : usedOnVisit
                                    ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 cursor-pointer"
                                    : "border-border/60 hover:bg-muted/50 cursor-pointer"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={usedOnVisit}
                                disabled={
                                  readOnly ||
                                  !active ||
                                  addingVisitInsurance ||
                                  (usedOnVisit && billedInsuranceIds?.has(pIns.id))
                                }
                                onChange={() =>
                                  !readOnly && active && onToggleInsurance(pIns.id, !usedOnVisit)
                                }
                                className="mt-0.5 h-3.5 w-3.5 accent-primary disabled:cursor-not-allowed"
                                aria-label={`Use ${pIns.insuranceProvider.acronym} on this visit`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`font-semibold ${
                                    active ? "text-foreground" : "text-muted-foreground"
                                  }`}>
                                    {pIns.insuranceProvider.acronym}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground truncate max-w-[8rem]">
                                    {pIns.insuranceProvider.insuranceName}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                  Card: {pIns.insuranceCardNumber || "—"}
                                </p>
                                {!active ? (
                                  <p className="text-[11px] mt-0.5 font-medium text-orange-500 dark:text-orange-400">
                                    {insuranceStatusLabel(pIns)}
                                  </p>
                                ) : (
                                  <p
                                    className={`text-[11px] mt-0.5 font-medium ${
                                      usedOnVisit
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {usedOnVisit
                                      ? "Used on this visit"
                                      : "On patient record only"}
                                  </p>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2 rounded-lg bg-muted/40 border border-border/50 px-2.5 py-2">
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        <span className="font-medium text-foreground">
                          Add to patient
                        </span>{" "}
                        saves a new insurance on the patient profile. Then check
                        it here to apply it to this visit for billing.
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
