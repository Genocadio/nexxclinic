"use client"

import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"
import type { UserReportsData } from "@/lib/user-reports-calculator"
import { BarChart3 } from "lucide-react"

interface ReportsChartProps {
  data: UserReportsData
  activeTab: string
}

export function ReportsChart({ data, activeTab }: ReportsChartProps) {
  const timeline = data.timeline

  // Granularity subtitle & badge
  const { subtitle, scaleBadge } = React.useMemo(() => {
    const startMs = new Date(data.fromDate).getTime()
    const endMs = new Date(data.toDate).getTime()
    const diffDays = Math.max(0, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)))

    const isDaily = data.period === "today" || data.fromDate === data.toDate || diffDays === 0
    const isWeekly = !isDaily && (data.period === "week" || diffDays <= 7)
    const isMonthly = !isDaily && !isWeekly && (data.period === "month" || diffDays <= 31)

    if (isDaily) {
      return {
        subtitle: "Hourly distribution of recorded actions and clinical events today",
        scaleBadge: "Hourly Scale",
      }
    }
    if (isWeekly) {
      return {
        subtitle: "Daily distribution of recorded actions and clinical events across 7 days",
        scaleBadge: "7-Day Daily Scale",
      }
    }
    if (isMonthly) {
      return {
        subtitle: "Daily distribution of recorded actions and clinical events this month",
        scaleBadge: "Monthly Daily Scale",
      }
    }
    return {
      subtitle: "Distribution of recorded actions and patient events across the selected timeframe",
      scaleBadge: "Custom Range",
    }
  }, [data.period, data.fromDate, data.toDate])

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground mb-3">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h4 className="text-base font-medium text-foreground">No Activity in this Period</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          No user transactions or events were recorded in the selected date range.
        </p>
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Format hourly label nicely in tooltip if it's HH:00
      let displayHeader = label
      if (typeof label === "string" && /^\d{2}:00$/.test(label)) {
        const h = parseInt(label.slice(0, 2), 10)
        const nextH = (h + 1) % 24
        displayHeader = `${label} – ${String(nextH).padStart(2, "0")}:00`
      }

      return (
        <div className="bg-card/95 backdrop-blur-xl border border-border/80 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[150px]">
          <p className="font-semibold text-foreground border-b border-border/50 pb-1">{displayHeader}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Activity Timeline</h3>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {scaleBadge}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
            <XAxis
              dataKey="label"
              stroke="currentColor"
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="currentColor"
              className="text-xs text-muted-foreground"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
              formatter={(value) => <span className="text-foreground text-xs font-medium mr-2">{value}</span>}
            />

            {(activeTab === "overview" || activeTab === "reception") && (
              <Bar dataKey="reception" name="Reception" fill="#4453C8" radius={[4, 4, 0, 0]} maxBarSize={36} />
            )}
            {(activeTab === "overview" || activeTab === "clinician") && (
              <Bar dataKey="clinician" name="Clinician" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
            )}
            {(activeTab === "overview" || activeTab === "nurse") && (
              <Bar dataKey="nurse" name="Nursing / Triage" fill="#0284C7" radius={[4, 4, 0, 0]} maxBarSize={36} />
            )}
            {(activeTab === "overview" || activeTab === "finance") && (
              <Bar dataKey="finance" name="Billing / Finance" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={36} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
