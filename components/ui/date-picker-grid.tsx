"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
)

const MONTHS = [
  { value: "01", label: "Jan", full: "January" },
  { value: "02", label: "Feb", full: "February" },
  { value: "03", label: "Mar", full: "March" },
  { value: "04", label: "Apr", full: "April" },
  { value: "05", label: "May", full: "May" },
  { value: "06", label: "Jun", full: "June" },
  { value: "07", label: "Jul", full: "July" },
  { value: "08", label: "Aug", full: "August" },
  { value: "09", label: "Sep", full: "September" },
  { value: "10", label: "Oct", full: "October" },
  { value: "11", label: "Nov", full: "November" },
  { value: "12", label: "Dec", full: "December" },
] as const

const MONTHS_31 = new Set(["01", "03", "05", "07", "08", "10", "12"])
const MONTHS_30 = new Set(["04", "06", "09", "11"])

function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function daysInMonth(monthNum: number, yearNum: number) {
  return new Date(yearNum, monthNum, 0).getDate()
}

interface DatePickerGridProps {
  value?: string
  onChange?: (date: string) => void
  className?: string
}

export function DatePickerGrid({ value = "", onChange, className }: DatePickerGridProps) {
  const parsed = useMemo(() => {
    if (!value) return { day: "", month: "", year: "" }
    const parts = value.split("-")
    if (parts.length !== 3) return { day: "", month: "", year: "" }
    return { year: parts[0], month: parts[1], day: parts[2] }
  }, [value])

  const [day, setDay] = useState(parsed.day)
  const [month, setMonth] = useState(parsed.month)
  const [year, setYear] = useState(parsed.year)

  const [dayOpen, setDayOpen] = useState(false)
  const [monthOpen, setMonthOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)

  const yearListRef = useRef<HTMLDivElement>(null)

  // Sync state if external value changes
  useEffect(() => {
    setDay(parsed.day)
    setMonth(parsed.month)
    setYear(parsed.year)
  }, [parsed.day, parsed.month, parsed.year])

  const currentYear = new Date().getFullYear()

  // Generate full list of years from current year down to 1900
  const allYears = useMemo(() => {
    const list: string[] = []
    for (let y = currentYear; y >= 1900; y--) {
      list.push(String(y))
    }
    return list
  }, [currentYear])

  const validMonths = useMemo(() => {
    if (!day) return MONTHS.map((m) => m.value)
    const d = Number.parseInt(day, 10)
    if (d === 31) return Array.from(MONTHS_31)
    if (d === 30) return Array.from(new Set([...MONTHS_31, ...MONTHS_30]))
    return MONTHS.map((m) => m.value)
  }, [day])

  const validDays = useMemo(() => {
    if (!month) return ALL_DAYS
    const m = Number.parseInt(month, 10)
    const y = year ? Number.parseInt(year, 10) : currentYear
    const max = daysInMonth(m, y)
    return ALL_DAYS.filter((d) => Number.parseInt(d, 10) <= max)
  }, [month, year, currentYear])

  const validYears = useMemo(() => {
    if (!day || !month) return allYears
    const d = Number.parseInt(day, 10)
    const m = Number.parseInt(month, 10)
    if (m !== 2) return allYears
    if (d <= 28) return allYears
    return allYears.filter((y) => isLeapYear(Number.parseInt(y, 10)))
  }, [day, month, allYears])

  const commitDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      onChange?.(`${y}-${m}-${d}`)
    } else {
      onChange?.("")
    }
  }

  const handleDaySelect = (d: string) => {
    const nextDay = d
    const nextMonth = validMonths.includes(month) ? month : ""
    const nextYear = nextMonth && validYears.includes(year) ? year : ""
    setDay(nextDay)
    setMonth(nextMonth)
    setYear(nextYear)
    commitDate(nextDay, nextMonth, nextYear)
    setDayOpen(false)

    // Flow forward to month if not yet chosen
    if (!nextMonth) {
      setTimeout(() => setMonthOpen(true), 120)
    } else if (!nextYear) {
      setTimeout(() => setYearOpen(true), 120)
    }
  }

  const handleMonthSelect = (m: string) => {
    const nextMonth = m
    const nextDay = validDays.includes(day) ? day : ""
    const nextYear =
      nextMonth &&
      validYears.includes(year) &&
      (nextMonth !== "02" || !nextDay || Number.parseInt(nextDay, 10) <= 28 || isLeapYear(Number.parseInt(year, 10)))
        ? year
        : ""
    setMonth(nextMonth)
    setDay(nextDay)
    setYear(nextYear)
    commitDate(nextDay, nextMonth, nextYear)
    setMonthOpen(false)

    // Flow forward to year if not yet chosen
    if (!nextYear) {
      setTimeout(() => setYearOpen(true), 120)
    }
  }

  const handleYearSelect = (y: string) => {
    const nextYear = y
    const nextMonth = validMonths.includes(month) ? month : ""
    const nextDay = nextMonth ? (validDays.includes(day) ? day : "") : ""
    setYear(nextYear)
    setMonth(nextMonth)
    setDay(nextDay)
    commitDate(nextDay, nextMonth, nextYear)
    setYearOpen(false)
  }

  // Auto-scroll selected year into view when year dropdown opens
  useEffect(() => {
    if (yearOpen && yearListRef.current) {
      const selectedEl = yearListRef.current.querySelector("[data-selected='true']")
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center" })
      }
    }
  }, [yearOpen])

  const triggerBaseClass =
    "h-10 w-full rounded-xl border border-border/70 bg-background dark:bg-gray-900 px-3 py-2 text-xs sm:text-sm font-medium transition-all hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center justify-between cursor-pointer"

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {/* ── Day Dropdown ── */}
      <Popover open={dayOpen} onOpenChange={setDayOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              triggerBaseClass,
              day ? "text-foreground font-semibold" : "text-muted-foreground",
              dayOpen && "ring-2 ring-primary/40 border-primary"
            )}
          >
            <span>{day ? day.padStart(2, "0") : "Day"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="w-[240px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1">
            <span className="text-xs font-semibold text-foreground">Select Day</span>
            {day && (
              <button
                type="button"
                onClick={() => {
                  setDay("")
                  commitDate("", month, year)
                }}
                className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {ALL_DAYS.map((d) => {
              const disabled = !validDays.includes(d)
              const isSelected = day === d
              return (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDaySelect(d)}
                  className={cn(
                    "h-8 rounded-lg text-xs font-medium transition-all flex items-center justify-center cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20"
                        : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"
                  )}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Month Dropdown ── */}
      <Popover open={monthOpen} onOpenChange={setMonthOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              triggerBaseClass,
              month ? "text-foreground font-semibold" : "text-muted-foreground",
              monthOpen && "ring-2 ring-primary/40 border-primary"
            )}
          >
            <span>
              {month
                ? MONTHS.find((m) => m.value === month)?.label || month
                : "Month"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          sideOffset={6}
          className="w-[230px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1">
            <span className="text-xs font-semibold text-foreground">Select Month</span>
            {month && (
              <button
                type="button"
                onClick={() => {
                  setMonth("")
                  commitDate(day, "", year)
                }}
                className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m) => {
              const disabled = !validMonths.includes(m.value)
              const isSelected = month === m.value
              return (
                <button
                  key={m.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleMonthSelect(m.value)}
                  className={cn(
                    "py-2 px-1 rounded-lg text-xs font-medium transition-all text-center cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20"
                        : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"
                  )}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Year Dropdown (3x3 scrollable grid) ── */}
      <Popover open={yearOpen} onOpenChange={setYearOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              triggerBaseClass,
              year ? "text-foreground font-semibold" : "text-muted-foreground",
              yearOpen && "ring-2 ring-primary/40 border-primary"
            )}
          >
            <span>{year || "Year"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-70" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-[240px] p-2.5 rounded-2xl shadow-2xl border border-border/80 bg-white dark:bg-slate-900 text-foreground z-[160] opacity-100 backdrop-blur-none"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 px-1">
            <span className="text-xs font-semibold text-foreground">Select Year</span>
            {year && (
              <button
                type="button"
                onClick={() => {
                  setYear("")
                  commitDate(day, month, "")
                }}
                className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          {/* 3x3 scrollable grid of years (scrolls smoothly from currentYear down to 1900 without pagination) */}
          <div
            ref={yearListRef}
            className="grid grid-cols-3 gap-1.5 max-h-[210px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20"
          >
            {allYears.map((y) => {
              const disabled = !validYears.includes(y)
              const isSelected = year === y
              return (
                <button
                  key={y}
                  type="button"
                  data-selected={isSelected}
                  disabled={disabled}
                  onClick={() => handleYearSelect(y)}
                  className={cn(
                    "py-2 px-1 rounded-lg text-xs font-medium transition-all text-center cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xs font-bold scale-105"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed bg-muted/20"
                        : "bg-muted/40 hover:bg-muted text-foreground hover:scale-105"
                  )}
                >
                  {y}
                </button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
