"use client";

import React, { useEffect } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  History as HistoryIcon,
  Plus,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Patient, PatientInsurance } from "@/lib/api-types";
import { useHoverPin } from "@/hooks/use-hover-pin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PatientIdentificationDropdownContent } from "@/components/consultation/consultation-top-dropdowns";
import VisitNotesFloating from "@/components/visit-notes-floating";

export interface HeaderDepartmentOption {
  id: string;
  name: string;
  isBilled?: boolean;
  status?: string;
  billingStatus?: string;
}

export interface ConsultationPatientHeaderStripProps {
  patient: Patient;
  patientLabel: string;
  ageGenderSummary?: string | null;
  activeInsuranceAcronym?: string | null;
  visitInsurances?: any[];
  departmentName?: string;

  // Active visit departments selector (used in billing / multi-department visits / triage)
  departments?: HeaderDepartmentOption[];
  activeDepartmentName?: string;
  onSelectDepartment?: (departmentName: string, departmentId?: string) => void;
  onAddDepartment?: () => void;

  // Optional interactive insurance management (used in billing)
  patientInsurances?: PatientInsurance[];
  activeInsuranceIds?: Set<string>;
  onToggleInsurance?: (insuranceId: string, active: boolean) => void;
  onAddInsurance?: () => void;
  billedInsuranceIds?: Set<string>;
  insuranceReadOnly?: boolean;
  addingVisitInsurance?: boolean;

  // Visit presence
  visitId?: string;

  // Actions slot (e.g. Vitals & Orders in consultation; Preview in billing)
  actions?: React.ReactNode;

  // History button
  onToggleHistory?: () => void;
  historyOpen?: boolean;

  // Notes dropdown
  notes?: any[];
  noteTypes?: Array<"BILLING" | "FORMS" | "CONSULTATION" | "ADMIN" | "PUBLIC">;
  allowedDisplayTypes?: string[];
  unreadNotesCount?: number;
  notesTitle?: string;
  firstVisitDepartmentId?: string;
  isTerminalVisit?: boolean;
  onAddNote?: (noteType: string, content: string) => Promise<void>;
  onMarkNotesViewed?: (noteId?: string) => Promise<void>;

  className?: string;
}

export function ConsultationPatientHeaderStrip({
  patient,
  patientLabel,
  ageGenderSummary,
  activeInsuranceAcronym,
  visitInsurances = [],
  departmentName,
  departments,
  activeDepartmentName,
  onSelectDepartment,
  onAddDepartment,
  patientInsurances,
  activeInsuranceIds,
  onToggleInsurance,
  onAddInsurance,
  billedInsuranceIds,
  insuranceReadOnly = false,
  addingVisitInsurance = false,
  visitId,
  actions,
  onToggleHistory,
  historyOpen = false,
  notes = [],
  noteTypes = ["BILLING", "PUBLIC"],
  allowedDisplayTypes,
  unreadNotesCount = 0,
  notesTitle = "Visit Notes",
  firstVisitDepartmentId,
  isTerminalVisit = false,
  onAddNote,
  onMarkNotesViewed,
  className,
}: ConsultationPatientHeaderStripProps) {
  const patientHoverPin = useHoverPin({ graceMs: 180 });
  const notesHoverPin = useHoverPin({ graceMs: 180 });

  // Auto-open unread dedicated notes until they are marked as read
  useEffect(() => {
    if (unreadNotesCount > 0) {
      notesHoverPin.setPinned(true);
    }
  }, [unreadNotesCount]);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 sm:gap-2.5 min-h-9 w-fit max-w-full mx-auto rounded-xl border border-border/70 bg-card/90 backdrop-blur-md px-2.5 py-1 shadow-sm overflow-x-auto scrollbar-none",
        className
      )}
    >
      {/* Left: Patient Name • Age/Gender • Insurance Acronym (Hover to preview, Click to pin) */}
      <div className="flex items-center gap-1.5 min-w-0 shrink-0 sm:shrink">
        <Popover
          open={patientHoverPin.isOpen}
          onOpenChange={(open) => {
            if (!open) patientHoverPin.close();
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              onMouseEnter={patientHoverPin.onMouseEnter}
              onMouseLeave={patientHoverPin.onMouseLeave}
              onClick={(e) => {
                e.preventDefault();
                patientHoverPin.togglePin();
              }}
              className={cn(
                "flex items-center gap-1.5 min-w-0 text-left rounded-lg px-2 py-1 transition-all group shrink-0 sm:shrink",
                patientHoverPin.isOpen && "bg-muted/70",
                patientHoverPin.isPinned && "ring-1 ring-primary/40 bg-primary/10"
              )}
              title="Patient & Insurance • Hover to preview, click to pin (Alt+P)"
            >
              <span className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-32 sm:max-w-56 group-hover:text-primary transition-colors">
                {patientLabel}
              </span>
              {ageGenderSummary && (
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {ageGenderSummary}
                </span>
              )}
              {activeInsuranceAcronym ? (
                <span className="shrink-0 rounded-md bg-primary/15 text-primary border border-primary/25 px-1.5 py-0.5 text-[10px] font-bold tracking-tight uppercase">
                  {activeInsuranceAcronym}
                </span>
              ) : (
                <span className="shrink-0 rounded-md bg-muted/80 text-muted-foreground px-1.5 py-0.5 text-[10px] font-medium">
                  Private
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={6}
            onMouseEnter={patientHoverPin.onMouseEnter}
            onMouseLeave={patientHoverPin.onMouseLeave}
            className="w-80 sm:w-96 p-0 rounded-2xl shadow-2xl border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden"
          >
            <PatientIdentificationDropdownContent
              patient={patient}
              patientFullName={patientLabel}
              ageText={ageGenderSummary}
              visitInsurances={visitInsurances}
              departmentName={departmentName}
              patientInsurances={patientInsurances}
              activeInsuranceIds={activeInsuranceIds}
              onToggleInsurance={onToggleInsurance}
              onAddInsurance={onAddInsurance}
              billedInsuranceIds={billedInsuranceIds}
              readOnly={insuranceReadOnly}
              addingVisitInsurance={addingVisitInsurance}
            />
          </PopoverContent>
        </Popover>


        {/* Active Visit Department Dropdown */}
        {((departments && departments.length > 0) || onAddDepartment) && (
          departments && departments.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-primary/40 shrink-0"
                  title="Active Visit Department"
                >
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-32 sm:max-w-48 font-medium">
                    {activeDepartmentName || departments[0]?.name}
                  </span>
                  {/* Status dot indicator for current department */}
                  {(() => {
                    const currentDept = departments.find(
                      (d) => d.name === (activeDepartmentName || departments[0]?.name)
                    );
                    const s = String(currentDept?.status || "").toUpperCase();
                    const isB = currentDept?.isBilled || String(currentDept?.billingStatus || "").toUpperCase() === "BILLED" || s === "BILLED";
                    const isComp = s === "COMPLETED" || s === "FINALISED";
                    const isCanc = s === "CANCELLED";

                    if (isCanc) return <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" title="Cancelled" />;
                    if (isComp) return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Completed" />;
                    if (isB) return <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Billed" />;
                    return <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" title="Pending" />;
                  })()}
                  <ChevronDown className="h-3 w-3 text-muted-foreground opacity-60 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={6} className="min-w-56 p-1 rounded-xl">
                {departments.map((dept) => {
                  const isSelected = dept.name === (activeDepartmentName || departments[0]?.name);
                  const s = String(dept.status || "").toUpperCase();
                  const isB = dept.isBilled || String(dept.billingStatus || "").toUpperCase() === "BILLED" || s === "BILLED";
                  const isComp = s === "COMPLETED" || s === "FINALISED";
                  const isCanc = s === "CANCELLED";

                  const statusTitle = isCanc
                    ? `${dept.name} • Cancelled`
                    : isComp
                    ? `${dept.name} • Completed`
                    : isB
                    ? `${dept.name} • Billed`
                    : `${dept.name} • Pending`;

                  return (
                    <DropdownMenuItem
                      key={dept.id || dept.name}
                      onClick={() => onSelectDepartment?.(dept.name, dept.id)}
                      title={statusTitle}
                      className={cn(
                        "text-xs font-medium cursor-pointer flex items-center justify-between gap-2.5 rounded-lg py-1.5 px-2 transition-colors",
                        isSelected && "bg-muted font-semibold text-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {isCanc ? (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        ) : isComp ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        ) : isB ? (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                        )}
                        <span className={cn("truncate", isCanc && "line-through text-muted-foreground")}>
                          {dept.name}
                        </span>
                      </div>

                      {/* Status Badges */}
                      {isCanc ? (
                        <span
                          title="Cancelled"
                          className="inline-flex items-center gap-0.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/25 px-2 py-0.5 text-xs font-semibold shrink-0"
                        >
                          Cancelled
                        </span>
                      ) : isComp ? (
                        <span
                          title="Completed"
                          className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 px-2 py-0.5 text-xs font-semibold shrink-0"
                        >
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          Completed
                        </span>
                      ) : isB ? (
                        <span
                          title="Billed"
                          className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/25 px-2 py-0.5 text-xs font-semibold shrink-0"
                        >
                          Billed
                        </span>
                      ) : (
                        <span
                          title="Pending"
                          className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 px-2 py-0.5 text-xs font-semibold shrink-0"
                        >
                          Pending
                        </span>
                      )}
                    </DropdownMenuItem>
                  );
                })}

                {/* Add Department Button inside dropdown (icon only) */}
                {onAddDepartment && (
                  <>
                    <div className="my-1 border-t border-border/50" />
                    <div className="flex items-center justify-center p-1">
                      <TooltipProvider delayDuration={2000}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddDepartment();
                              }}
                              aria-label="Add Department to Visit"
                              className="h-7 w-7 rounded-lg border border-border/60 bg-muted/30 hover:bg-primary/10 hover:border-primary/50 text-primary flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Add Department to Visit
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            onAddDepartment && (
              <TooltipProvider delayDuration={2000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onAddDepartment()}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/60 bg-background text-primary hover:bg-muted transition-colors shrink-0 focus:outline-none shadow-xs cursor-pointer"
                      aria-label="Add Department to Visit"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Add Department to Visit
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          )
        )}
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-border/60 mx-1 shrink-0" />

      {/* Right: Quick-access buttons (Custom actions, History, Notes Dropdown) */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {actions}

        {/* History button (slides in side panel from left) */}
        {onToggleHistory && (
          <TooltipProvider delayDuration={2000}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleHistory}
                  className={cn(
                    "inline-flex items-center justify-center h-7 w-7 rounded-lg border border-border/60 bg-background text-foreground hover:bg-muted transition-colors shrink-0 shadow-xs cursor-pointer",
                    historyOpen && "bg-muted text-primary border-primary/50"
                  )}
                  aria-label="Patient History (Alt+H)"
                >
                  <HistoryIcon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Patient History (Alt+H)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Notes button with Dropdown below (hover opens, click pins) */}
        {!isTerminalVisit && (
          <Popover
            open={notesHoverPin.isOpen}
            onOpenChange={(open) => {
              if (open) {
                notesHoverPin.setPinned(true);
              } else if (unreadNotesCount === 0) {
                notesHoverPin.close();
              }
            }}
          >
            <TooltipProvider delayDuration={2000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      onMouseEnter={notesHoverPin.onMouseEnter}
                      onMouseLeave={notesHoverPin.onMouseLeave}
                      onClick={(e) => {
                        e.preventDefault();
                        notesHoverPin.togglePin();
                      }}
                      className={cn(
                        "relative inline-flex items-center justify-center h-7 w-7 rounded-lg border transition-all shrink-0 cursor-pointer shadow-xs",
                        notesHoverPin.isOpen
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-background text-foreground hover:bg-muted",
                        notesHoverPin.isPinned && "ring-1 ring-primary/40"
                      )}
                      aria-label="Visit Notes (Alt+N)"
                    >
                      <StickyNote className="h-4 w-4 shrink-0" />
                      {!notesHoverPin.isOpen && unreadNotesCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-4 text-center shadow-xs">
                          {unreadNotesCount}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Visit Notes • Hover to preview, click to pin (Alt+N)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent
              align="center"
              sideOffset={6}
              onMouseEnter={notesHoverPin.onMouseEnter}
              onMouseLeave={notesHoverPin.onMouseLeave}
              className="w-[360px] sm:w-[410px] p-0 rounded-2xl shadow-2xl border border-border/80 bg-background/95 backdrop-blur-md overflow-hidden"
            >
              <VisitNotesFloating
                title={notesTitle}
                notes={notes}
                noteTypes={noteTypes}
                allowedDisplayTypes={allowedDisplayTypes}
                open={notesHoverPin.isOpen}
                onOpenChange={(open) => {
                  if (open) {
                    notesHoverPin.setPinned(true);
                  } else if (unreadNotesCount === 0) {
                    notesHoverPin.close();
                  }
                }}
                hideToggleButton
                variant="dropdown"
                visitId={visitId}
                visitDepartmentId={firstVisitDepartmentId}
                onAddNote={onAddNote}
                onMarkAsViewed={onMarkNotesViewed}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
