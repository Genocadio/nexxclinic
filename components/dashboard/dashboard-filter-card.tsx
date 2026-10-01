"use client"

import React from "react"
import {
  SlidersHorizontal,
  Check,
  User,
  Calendar,
  RotateCcw,
  Database,
  FileText,
  Loader2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type AnswersFilterType = "all" | "finalised" | "pending"
export type GenderFilterType = "all" | "MALE" | "FEMALE" | "OTHER"
export type AgeRangeType = "all" | "pediatric" | "adult" | "senior" | "custom" | "dob"

export interface DashboardFilterCardProps {
  canQueryAnswerState: boolean
  answersFilter: AnswersFilterType
  setAnswersFilter: (val: AnswersFilterType) => void
  genderFilter: GenderFilterType
  setGenderFilter: (val: GenderFilterType) => void
  ageRange: AgeRangeType
  setAgeRange: (val: AgeRangeType) => void
  customAgeMin: string
  setCustomAgeMin: (val: string) => void
  customAgeMax: string
  setCustomAgeMax: (val: string) => void
  dobFilter: string
  setDobFilter: (val: string) => void
  searchAllHistorical: boolean
  setSearchAllHistorical: (val: boolean) => void
  showDatabaseSearch?: boolean
  activeFilterCount: number
  handleResetFilters: () => void
  loadingHistoricalSearch?: boolean
  matchCount?: number
  onClose?: () => void
}

export function DashboardFilterCardContent({
  canQueryAnswerState,
  answersFilter,
  setAnswersFilter,
  genderFilter,
  setGenderFilter,
  ageRange,
  setAgeRange,
  customAgeMin,
  setCustomAgeMin,
  customAgeMax,
  setCustomAgeMax,
  dobFilter,
  setDobFilter,
  searchAllHistorical,
  setSearchAllHistorical,
  showDatabaseSearch,
  activeFilterCount,
  handleResetFilters,
  loadingHistoricalSearch,
  matchCount,
  onClose,
}: DashboardFilterCardProps) {
  return (
    <div className="space-y-4">
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Filter Visits</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Consultation Answers Filter */}
      {canQueryAnswerState && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Consultation Answers
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40">
            <button
              type="button"
              onClick={() => setAnswersFilter("all")}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                answersFilter === "all"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setAnswersFilter("finalised")}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                answersFilter === "finalised"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              Finalised
            </button>
            <button
              type="button"
              onClick={() => setAnswersFilter("pending")}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 ${
                answersFilter === "pending"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pending
            </button>
          </div>
        </div>
      )}

      {/* Section 2: Gender Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-primary" />
          Patient Gender
        </label>
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40">
          {(
            [
              { id: "all", label: "All" },
              { id: "MALE", label: "Male" },
              { id: "FEMALE", label: "Female" },
              { id: "OTHER", label: "Other" },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGenderFilter(g.id)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-all ${
                genderFilter === g.id
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Age & Date of Birth Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          Patient Age / Date of Birth (DOB)
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 dark:bg-slate-800/60 border border-border/40 text-xs">
          <button
            type="button"
            onClick={() => {
              setAgeRange("all")
              setDobFilter("")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all ${
              ageRange === "all" && !dobFilter
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ages
          </button>
          <button
            type="button"
            onClick={() => {
              setAgeRange("pediatric")
              setDobFilter("")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all ${
              ageRange === "pediatric"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            0-17 yrs
          </button>
          <button
            type="button"
            onClick={() => {
              setAgeRange("adult")
              setDobFilter("")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all ${
              ageRange === "adult"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            18-64 yrs
          </button>
          <button
            type="button"
            onClick={() => {
              setAgeRange("senior")
              setDobFilter("")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all ${
              ageRange === "senior"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            65+ yrs
          </button>
          <button
            type="button"
            onClick={() => {
              setAgeRange("custom")
              setDobFilter("")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all text-center ${
              ageRange === "custom"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Age
          </button>
          <button
            type="button"
            onClick={() => {
              setAgeRange("dob")
            }}
            className={`py-1 px-2 rounded-lg font-medium transition-all text-center ${
              ageRange === "dob" || dobFilter.trim() !== ""
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Exact DOB
          </button>
        </div>

        {ageRange === "custom" && (
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="150"
                placeholder="Min age"
                value={customAgeMin}
                onChange={(e) => setCustomAgeMin(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground">to</span>
            <div className="flex-1">
              <input
                type="number"
                min="0"
                max="150"
                placeholder="Max age"
                value={customAgeMax}
                onChange={(e) => setCustomAgeMax(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {(ageRange === "dob" || dobFilter) && (
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <input
                type="date"
                value={dobFilter}
                onChange={(e) => setDobFilter(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-background border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            {dobFilter && (
              <button
                type="button"
                onClick={() => setDobFilter("")}
                className="px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground border border-border/60 rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section 4: Search All Historical Visits (Backend Deep Search) - Only visible on Discharged tab */}
      {showDatabaseSearch && (
        <div className="pt-2 border-t border-border/40">
          <label className="flex items-start gap-2.5 p-2 rounded-xl bg-muted/40 dark:bg-slate-800/40 border border-border/40 hover:bg-muted/60 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={searchAllHistorical}
              onChange={(e) => setSearchAllHistorical(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                <span>Search all visits in database</span>
                {loadingHistoricalSearch && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Query complete historical backend records beyond the 7-day operational window.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Popover Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-[11px] text-muted-foreground">
          {typeof matchCount === "number" ? `${matchCount} visits match` : ""}
        </span>
        {onClose && (
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="rounded-full px-4 h-7 text-xs font-semibold cursor-pointer"
          >
            Done
          </Button>
        )}
      </div>
    </div>
  )
}

export function DashboardFilterPopover(props: DashboardFilterCardProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`relative inline-flex items-center justify-center h-9 w-9 rounded-full border transition-all duration-150 cursor-pointer shadow-2xs ${
            props.activeFilterCount > 0
              ? "bg-primary/10 border-primary/40 text-primary hover:bg-primary/20"
              : "bg-card/80 dark:bg-slate-900/70 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
          title="Filter visits (Answers, Gender, Age, DOB, Deep Search)"
          aria-label="Filter visits"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {props.activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold shadow-xs ring-2 ring-background">
              {props.activeFilterCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-4 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/60 dark:border-slate-800 shadow-2xl rounded-2xl space-y-4 z-[150] animate-in fade-in-0 zoom-in-95 duration-150"
      >
        <DashboardFilterCardContent {...props} onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}
