"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar, Clock, ChevronDown } from "lucide-react"
import type { ReportPeriod } from "@/lib/user-reports-calculator"
import { cn } from "@/lib/utils"

export interface ReportsPeriodSelectorProps {
  period: ReportPeriod
  setPeriod: (p: ReportPeriod) => void
  customFromDate: string
  setCustomFromDate: (d: string) => void
  customToDate: string
  setCustomToDate: (d: string) => void
  rangeDisplayLabel: string
  className?: string
}

export function ReportsPeriodSelector({
  period,
  setPeriod,
  customFromDate,
  setCustomFromDate,
  customToDate,
  setCustomToDate,
  rangeDisplayLabel,
  className,
}: ReportsPeriodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <span className="font-semibold truncate max-w-[200px] sm:max-w-[260px]">{rangeDisplayLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={10}
        className="w-80 p-3.5 rounded-2xl border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl space-y-3 z-50"
      >
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            Select Report Period
          </span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase font-mono">
            {period}
          </Badge>
        </div>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setPeriod("today")
              setIsOpen(false)
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
              period === "today"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "bg-muted/50 hover:bg-muted text-foreground border border-border/40"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod("week")
              setIsOpen(false)
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
              period === "week"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "bg-muted/50 hover:bg-muted text-foreground border border-border/40"
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => {
              setPeriod("month")
              setIsOpen(false)
            }}
            className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all text-center cursor-pointer ${
              period === "month"
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "bg-muted/50 hover:bg-muted text-foreground border border-border/40"
            }`}
          >
            This Month
          </button>
        </div>

        {/* Custom Date Inputs */}
        <div className="pt-2 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Custom Date Range</span>
            {period === "custom" && (
              <span className="text-[10px] text-primary font-medium">Active</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">From</label>
              <Input
                type="date"
                value={customFromDate}
                onChange={(e) => {
                  setCustomFromDate(e.target.value)
                  setPeriod("custom")
                }}
                className="h-8 text-xs rounded-xl bg-background/80 border-border/70"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">To</label>
              <Input
                type="date"
                value={customToDate}
                onChange={(e) => {
                  setCustomToDate(e.target.value)
                  setPeriod("custom")
                }}
                className="h-8 text-xs rounded-xl bg-background/80 border-border/70"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
