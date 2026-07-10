"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ALL_DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
)

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
] as const

const MONTHS_31 = new Set(["01", "03", "05", "07", "08", "10", "12"])
const MONTHS_30 = new Set(["04", "06", "09", "11"])

function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

function daysInMonth(monthNum: number, yearNum: number) {
  return new Date(yearNum, monthNum, 0).getDate()
}

const YEAR_RANGE_SIZE = 12

interface DatePickerGridProps {
  value?: string
  onChange?: (date: string) => void
}

export function DatePickerGrid({ value = "", onChange }: DatePickerGridProps) {
  const parsed = useMemo(() => {
    if (!value) return { day: "", month: "", year: "" }
    const parts = value.split("-")
    if (parts.length !== 3) return { day: "", month: "", year: "" }
    return { year: parts[0], month: parts[1], day: parts[2] }
  }, [value])

  const [day, setDay] = useState(parsed.day)
  const [month, setMonth] = useState(parsed.month)
  const [year, setYear] = useState(parsed.year)
  const [yearPage, setYearPage] = useState(0)
  const [activePicker, setActivePicker] = useState<"day" | "month" | "year" | null>(null)

  const currentYear = new Date().getFullYear()

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

  const yearRangeStart = currentYear - yearPage * YEAR_RANGE_SIZE
  const yearRangeEnd = Math.max(1900, yearRangeStart - YEAR_RANGE_SIZE + 1)
  const yearRange = Array.from(
    { length: Math.min(YEAR_RANGE_SIZE, yearRangeStart - 1900 + 1) },
    (_, i) => String(yearRangeStart - i),
  )

  const validYears = useMemo(() => {
    if (!day || !month) return yearRange
    const d = Number.parseInt(day, 10)
    const m = Number.parseInt(month, 10)
    if (m !== 2) return yearRange
    if (d <= 28) return yearRange
    return yearRange.filter((y) => isLeapYear(Number.parseInt(y, 10)))
  }, [day, month, yearRange])

  const commitDate = (d: string, m: string, y: string) => {
    onChange?.(`${y}-${m}-${d}`)
  }

  const handleDaySelect = (d: string) => {
    const nextDay = d
    const nextMonth = validMonths.includes(month) ? month : ""
    const nextYear = (nextMonth && validYears.includes(year)) ? year : ""
    setDay(nextDay)
    setMonth(nextMonth)
    setYear(nextYear)
    if (nextDay && nextMonth && nextYear) {
      commitDate(nextDay, nextMonth, nextYear)
    }
    setActivePicker(nextMonth ? "month" : null)
  }

  const handleMonthSelect = (m: string) => {
    const nextMonth = m
    const nextDay = validDays.includes(day) ? day : ""
    const nextYear = (nextMonth && validYears.includes(year) && (nextMonth !== "02" || !nextDay || Number.parseInt(nextDay, 10) <= 28 || isLeapYear(Number.parseInt(year, 10)))) ? year : ""
    setMonth(nextMonth)
    setDay(nextDay)
    setYear(nextYear)
    if (nextDay && nextMonth && nextYear) {
      commitDate(nextDay, nextMonth, nextYear)
    }
    setActivePicker(nextDay ? "year" : null)
  }

  const handleYearSelect = (y: string) => {
    const nextYear = y
    const nextMonth = validMonths.includes(month) ? month : ""
    const nextDay = (nextMonth ? validDays.includes(day) : false) ? day : ""
    setYear(nextYear)
    setMonth(nextMonth)
    setDay(nextDay)
    if (nextDay && nextMonth && nextYear) {
      commitDate(nextDay, nextMonth, nextYear)
    }
  }

  const handleDayClear = () => {
    setDay("")
    onChange?.("")
  }

  const handleMonthClear = () => {
    setMonth("")
    onChange?.("")
  }

  const handleYearClear = () => {
    setYear("")
    onChange?.("")
  }

  const btnBase =
    "h-9 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActivePicker(activePicker === "day" ? null : "day")}
          className={`${btnBase} border border-border/70 bg-background hover:bg-muted ${
            day ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {day ? day.padStart(2, "0") : "Day"}
        </button>
        <button
          type="button"
          onClick={() =>
            setActivePicker(activePicker === "month" ? null : "month")
          }
          className={`${btnBase} border border-border/70 bg-background hover:bg-muted ${
            month ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {month
            ? MONTHS.find((m) => m.value === month)?.label || month
            : "Month"}
        </button>
        <button
          type="button"
          onClick={() =>
            setActivePicker(activePicker === "year" ? null : "year")
          }
          className={`${btnBase} border border-border/70 bg-background hover:bg-muted ${
            year ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {year || "Year"}
        </button>
      </div>

      {activePicker === "day" && (
        <div>
          <div className="grid grid-cols-7 gap-1">
            {ALL_DAYS.map((d) => {
              const disabled = !validDays.includes(d)
              const selected = day === d
              return (
                <button
                  key={d}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDaySelect(d)}
                  className={`${btnBase} ${
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
          {day ? (
            <button
              type="button"
              onClick={handleDayClear}
              className="text-xs text-muted-foreground hover:text-foreground mt-1"
            >
              Clear
            </button>
          ) : null}
        </div>
      )}

      {activePicker === "month" && (
        <div>
          <div className="grid grid-cols-4 gap-1">
            {MONTHS.map((m) => {
              const disabled = !validMonths.includes(m.value)
              const selected = month === m.value
              return (
                <button
                  key={m.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleMonthSelect(m.value)}
                  className={`${btnBase} ${
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
          {month ? (
            <button
              type="button"
              onClick={handleMonthClear}
              className="text-xs text-muted-foreground hover:text-foreground mt-1"
            >
              Clear
            </button>
          ) : null}
        </div>
      )}

      {activePicker === "year" && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <button
              type="button"
              onClick={() => setYearPage((p) => p + 1)}
              disabled={yearRangeEnd <= 1900}
              className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium text-muted-foreground">
              {yearRange[yearRange.length - 1]}–{yearRange[0]}
            </span>
            <button
              type="button"
              onClick={() => setYearPage((p) => Math.max(0, p - 1))}
              disabled={yearPage === 0}
              className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {yearRange.map((y) => {
              const disabled = !validYears.includes(y)
              const selected = year === y
              return (
                <button
                  key={y}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleYearSelect(y)}
                  className={`${btnBase} ${
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : disabled
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  {y}
                </button>
              )
            })}
          </div>
          {year ? (
            <button
              type="button"
              onClick={handleYearClear}
              className="text-xs text-muted-foreground hover:text-foreground mt-1"
            >
              Clear
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
