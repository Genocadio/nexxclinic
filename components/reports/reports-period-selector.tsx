"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarRange,
} from "lucide-react"
import type { ReportPeriod } from "@/lib/user-reports-calculator"
import { cn } from "@/lib/utils"

export interface ReportsPeriodSelectorProps {
  period: ReportPeriod
  setPeriod: (p: ReportPeriod) => void
  customFromDate: string
  setCustomFromDate: (d: string) => void
  customToDate: string
  setCustomToDate: (d: string) => void
  selectedMonth?: number
  setSelectedMonth?: (m: number) => void
  selectedYear?: number
  setSelectedYear?: (y: number) => void
  rangeDisplayLabel: string
  className?: string
}

const MONTHS = [
  { value: 0, label: "Jan", full: "January" },
  { value: 1, label: "Feb", full: "February" },
  { value: 2, label: "Mar", full: "March" },
  { value: 3, label: "Apr", full: "April" },
  { value: 4, label: "May", full: "May" },
  { value: 5, label: "Jun", full: "June" },
  { value: 6, label: "Jul", full: "July" },
  { value: 7, label: "Aug", full: "August" },
  { value: 8, label: "Sep", full: "September" },
  { value: 9, label: "Oct", full: "October" },
  { value: 10, label: "Nov", full: "November" },
  { value: 11, label: "Dec", full: "December" },
]

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function ReportsPeriodSelector({
  period,
  setPeriod,
  customFromDate,
  setCustomFromDate,
  customToDate,
  setCustomToDate,
  selectedMonth = new Date().getMonth(),
  setSelectedMonth,
  selectedYear = new Date().getFullYear(),
  setSelectedYear,
  rangeDisplayLabel,
  className,
}: ReportsPeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Mode toggle: default to "month_year", or "custom_range" when in custom period
  const [mode, setMode] = useState<"month_year" | "custom_range">("month_year")
  const [navYear, setNavYear] = useState<number>(() =>
    Math.min(selectedYear, new Date().getFullYear())
  )

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const todayStr = formatLocalDate(now)

  // Strictly past and current years only (no future years)
  const YEARS = Array.from({ length: 8 }, (_, i) => currentYear - 7 + i)

  // Compute preset date strings for active highlight comparison
  const yDate = new Date(now)
  yDate.setDate(now.getDate() - 1)
  const yesterdayStr = formatLocalDate(yDate)

  const thisWeekStartDate = new Date(now)
  thisWeekStartDate.setDate(now.getDate() - 6)
  const thisWeekStartStr = formatLocalDate(thisWeekStartDate)

  const prevWeekEndDate = new Date(now)
  prevWeekEndDate.setDate(now.getDate() - 7)
  const prevWeekEndStr = formatLocalDate(prevWeekEndDate)
  const prevWeekStartDate = new Date(now)
  prevWeekStartDate.setDate(now.getDate() - 13)
  const prevWeekStartStr = formatLocalDate(prevWeekStartDate)

  const isToday =
    period === "today" ||
    (period === "custom" &&
      customFromDate === todayStr &&
      customToDate === todayStr)
  const isYesterday =
    period === "custom" &&
    customFromDate === yesterdayStr &&
    customToDate === yesterdayStr
  const isThisWeek =
    period === "week" ||
    (period === "custom" &&
      customFromDate === thisWeekStartStr &&
      customToDate === todayStr)
  const isPrevWeek =
    period === "custom" &&
    customFromDate === prevWeekStartStr &&
    customToDate === prevWeekEndStr

  // Sync navYear when popover opens or selectedYear changes
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setNavYear(Math.min(selectedYear, currentYear))
      if (period === "custom") {
        setMode("custom_range")
      } else {
        setMode("month_year")
      }
    }
    setIsOpen(open)
  }

  const handleSelectMonth = (monthIndex: number) => {
    // Prevent selecting future months
    if (navYear === currentYear && monthIndex > currentMonth) return
    if (navYear > currentYear) return

    if (setSelectedYear) setSelectedYear(navYear)
    if (setSelectedMonth) setSelectedMonth(monthIndex)
    setPeriod("month")
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-3.5 text-xs rounded-full bg-card/95 backdrop-blur-xl border-border/80 text-foreground font-medium flex items-center gap-2 shadow-md hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer shrink-0",
            className
          )}
        >
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Clock className="h-3 w-3" />
          </div>
          <span className="font-semibold truncate max-w-[220px] sm:max-w-[320px]">
            {rangeDisplayLabel}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-[320px] sm:w-[350px] p-3.5 rounded-2xl border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl space-y-3 z-[150]"
      >
        {/* Header with Mode Toggle Icon */}
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/10 text-primary">
              {mode === "month_year" ? (
                <Calendar className="h-3.5 w-3.5" />
              ) : (
                <CalendarRange className="h-3.5 w-3.5" />
              )}
            </div>
            <span className="text-xs font-bold text-foreground">
              {mode === "month_year"
                ? "Select Month & Year"
                : "Custom Date Range"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 uppercase font-mono"
            >
              {period}
            </Badge>
            <button
              type="button"
              onClick={() =>
                setMode(mode === "month_year" ? "custom_range" : "month_year")
              }
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer"
              title={
                mode === "month_year"
                  ? "Switch to custom date range"
                  : "Switch to month & year picker"
              }
            >
              {mode === "month_year" ? (
                <CalendarRange className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* View 1: Default Month & Year Grid (Auto-applies on month selection) */}
        {mode === "month_year" ? (
          <div className="space-y-3">
            {/* Year Switcher (Clamped to currentYear max) */}
            <div className="flex items-center justify-between bg-muted/40 p-1.5 rounded-xl border border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setNavYear((y) => y - 1)}
                className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Previous year"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <select
                  value={navYear}
                  onChange={(e) => {
                    const y = Number(e.target.value)
                    setNavYear(y)
                    if (period === "month" && setSelectedYear) {
                      setSelectedYear(y)
                    }
                  }}
                  className="h-7 px-2 text-xs font-bold bg-transparent text-foreground rounded-md cursor-pointer border-0 focus:ring-0 focus:outline-none"
                >
                  {YEARS.map((y) => (
                    <option
                      key={y}
                      value={y}
                      className="bg-popover text-foreground"
                    >
                      {y}
                    </option>
                  ))}
                </select>
                {navYear === currentYear && (
                  <span className="text-[9px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-md">
                    Current
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={navYear >= currentYear}
                onClick={() =>
                  setNavYear((y) => Math.min(currentYear, y + 1))
                }
                className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title={
                  navYear >= currentYear
                    ? "Future years not available"
                    : "Next year"
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* 12 Months Grid (Future months disabled) */}
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m) => {
                const isSelected =
                  period === "month" &&
                  selectedMonth === m.value &&
                  selectedYear === navYear
                const isCurrentMonth =
                  currentMonth === m.value &&
                  currentYear === navYear
                const isFutureMonth =
                  navYear > currentYear ||
                  (navYear === currentYear && m.value > currentMonth)

                return (
                  <button
                    key={m.value}
                    type="button"
                    disabled={isFutureMonth}
                    onClick={() => handleSelectMonth(m.value)}
                    title={
                      isFutureMonth
                        ? "Future months cannot be selected"
                        : m.full
                    }
                    className={cn(
                      "py-2.5 px-2 rounded-xl text-xs font-semibold transition-all text-center relative",
                      isFutureMonth
                        ? "opacity-30 cursor-not-allowed bg-muted/15 text-muted-foreground border border-transparent select-none"
                        : isSelected
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02] cursor-pointer"
                        : "bg-muted/40 hover:bg-muted text-foreground border border-border/50 hover:border-primary/40 cursor-pointer"
                    )}
                  >
                    <span>{m.full}</span>
                    {isCurrentMonth && !isSelected && (
                      <span className="absolute bottom-1 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Quick Shortcuts Footer for Month View */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPeriod("today")
                  setIsOpen(false)
                }}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer border",
                  period === "today"
                    ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                    : "bg-muted/30 hover:bg-muted text-foreground border-border/40"
                )}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriod("week")
                  setIsOpen(false)
                }}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer border",
                  period === "week"
                    ? "bg-primary text-primary-foreground font-semibold border-primary shadow-xs"
                    : "bg-muted/30 hover:bg-muted text-foreground border-border/40"
                )}
              >
                This Week
              </button>
            </div>
          </div>
        ) : (
          /* View 2: Custom Date Range Selector (Clamped to today max) */
          <div className="space-y-3 py-1">
            {/* Quick Preset Buttons Above (This Week, Previous Week, Today, Yesterday) */}
            <div>
              <span className="text-[10px] font-semibold text-muted-foreground mb-1.5 block">
                Quick Presets
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCustomFromDate(todayStr)
                    setCustomToDate(todayStr)
                    setPeriod("today")
                    setIsOpen(false)
                  }}
                  className={cn(
                    "py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border",
                    isToday
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border/50 hover:border-primary/40"
                  )}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFromDate(yesterdayStr)
                    setCustomToDate(yesterdayStr)
                    setPeriod("custom")
                    setIsOpen(false)
                  }}
                  className={cn(
                    "py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border",
                    isYesterday
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border/50 hover:border-primary/40"
                  )}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFromDate(thisWeekStartStr)
                    setCustomToDate(todayStr)
                    setPeriod("week")
                    setIsOpen(false)
                  }}
                  className={cn(
                    "py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border",
                    isThisWeek
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border/50 hover:border-primary/40"
                  )}
                >
                  This Week
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFromDate(prevWeekStartStr)
                    setCustomToDate(prevWeekEndStr)
                    setPeriod("custom")
                    setIsOpen(false)
                  }}
                  className={cn(
                    "py-2 px-2.5 rounded-xl text-xs font-semibold transition-all text-center cursor-pointer border",
                    isPrevWeek
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border/50 hover:border-primary/40"
                  )}
                >
                  Previous Week
                </button>
              </div>
            </div>

            {/* Custom From/To Date Inputs (max clamped to today) */}
            <div className="pt-2.5 border-t border-border/50 space-y-2">
              <span className="text-[10px] font-semibold text-muted-foreground block">
                Custom Range
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                    From
                  </label>
                  <Input
                    type="date"
                    max={todayStr}
                    value={customFromDate}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val > todayStr) return
                      setCustomFromDate(val)
                      setPeriod("custom")
                    }}
                    className="h-8.5 text-xs px-2 sm:px-2.5 rounded-xl bg-background/80 border-border/70 w-full min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:p-0"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                    To
                  </label>
                  <Input
                    type="date"
                    max={todayStr}
                    value={customToDate}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val > todayStr) return
                      setCustomToDate(val)
                      setPeriod("custom")
                    }}
                    className="h-8.5 text-xs px-2 sm:px-2.5 rounded-xl bg-background/80 border-border/70 w-full min-w-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
