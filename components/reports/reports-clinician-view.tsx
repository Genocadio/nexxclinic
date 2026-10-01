"use client"

import React, { useState, useMemo } from "react"
import {
  Stethoscope,
  CheckCircle2,
  Pill,
  TrendingUp,
  Wallet,
  ShieldCheck,
  CreditCard,
  Gift,
  AlertTriangle,
  Building2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  ListFilter,
  Layers,
  Clock,
  Flame,
  Users,
  UserCheck,
  Activity,
  Maximize2,
  Minimize2,
  ChevronDown,
  Check,
  Loader2,
} from "lucide-react"
import type {
  UserReportsData,
  ClinicianEncounterDetail,
  ClinicianProductTurnoverItem,
  InsuranceMoneySummary,
  ReportPeriod,
} from "@/lib/user-reports-calculator"
import { formatHourRange } from "@/lib/user-reports-calculator"
import { formatRWF, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReportsChart } from "@/components/reports/reports-chart"

interface ReportsClinicianViewProps {
  data: UserReportsData
  isTableExpanded?: boolean
  onToggleTableExpand?: (expanded: boolean) => void
}

const ITEMS_PER_PAGE = 15

export function ReportsClinicianView({
  data,
  isTableExpanded: controlledIsTableExpanded,
  onToggleTableExpand,
}: ReportsClinicianViewProps) {
  const clinician = data.clinician
  const money = clinician.money

  // 1. Two Main Tabs: "encounters" (Encounters & Demographics) vs "finance" (Finance & Turnover)
  const [activeTab, setActiveTab] = useState<"encounters" | "finance">("encounters")

  // 2. Department Filter: "ALL" or specific department name (Applies across both tabs)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL")

  // 3. Finance Turnover View Switcher: "grouped" (Group by encounter) vs "detailed" (Itemized products)
  const [financeViewMode, setFinanceViewMode] = useState<"grouped" | "detailed">("grouped")

  // 4. Search and Continuous Pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const INITIAL_VISIBLE_COUNT = 25
  const BATCH_SIZE = 25
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [internalIsTableExpanded, setInternalIsTableExpanded] = useState(false)
  const isTableExpanded = controlledIsTableExpanded ?? internalIsTableExpanded

  const toggleTableExpand = () => {
    const nextVal = !isTableExpanded
    if (onToggleTableExpand) {
      onToggleTableExpand(nextVal)
    } else {
      setInternalIsTableExpanded(nextVal)
    }
  }

  // Available unique departments the clinician has worked in
  const availableDepartments = useMemo(() => {
    const set = new Set<string>()
    for (const d of money.departmentBreakdown) {
      if (d.departmentName) set.add(d.departmentName)
    }
    for (const p of money.productTurnoverList) {
      if (p.departmentName) set.add(p.departmentName)
    }
    for (const e of clinician.encountersList) {
      if (e.departmentName) set.add(e.departmentName)
    }
    return Array.from(set).sort()
  }, [money.departmentBreakdown, money.productTurnoverList, clinician.encountersList])

  // Encounters filtered by Department
  const departmentFilteredEncounters = useMemo(() => {
    if (selectedDepartment === "ALL") {
      return clinician.encountersList
    }
    return clinician.encountersList.filter((e) => e.departmentName === selectedDepartment)
  }, [clinician.encountersList, selectedDepartment])

  // Products filtered by Department
  const departmentFilteredProducts = useMemo(() => {
    if (selectedDepartment === "ALL") {
      return money.productTurnoverList
    }
    return money.productTurnoverList.filter((p) => p.departmentName === selectedDepartment)
  }, [money.productTurnoverList, selectedDepartment])

  // Dynamic Demographics & Operational Metrics for the selected department
  const currentDemographics = useMemo(() => {
    const encs = departmentFilteredEncounters
    const uniquePatients = new Set(encs.map((e) => e.patientId).filter(Boolean))

    let maleCount = 0
    let femaleCount = 0
    let otherGenderCount = 0
    let totalAgeSum = 0
    let ageCount = 0
    let under18Count = 0
    let adults18to50Count = 0
    let seniors50plusCount = 0
    let totalDurationMins = 0
    let durationCount = 0
    const encountersByHour: Record<string, number> = {}

    for (const e of encs) {
      const g = (e.gender || "").toUpperCase()
      if (g === "MALE" || g.startsWith("M")) maleCount++
      else if (g === "FEMALE" || g.startsWith("F")) femaleCount++
      else otherGenderCount++

      if (e.age != null) {
        totalAgeSum += e.age
        ageCount++
        if (e.age < 18) under18Count++
        else if (e.age <= 50) adults18to50Count++
        else seniors50plusCount++
      }

      if (e.durationMinutes != null && e.durationMinutes > 0) {
        totalDurationMins += e.durationMinutes
        durationCount++
      }

      const d = new Date(e.timestamp)
      if (!isNaN(d.getTime())) {
        const hKey = `${String(d.getHours()).padStart(2, "0")}:00`
        encountersByHour[hKey] = (encountersByHour[hKey] || 0) + 1
      }
    }

    let peakHourStr = "N/A"
    let maxHourCount = 0
    for (const [hKey, count] of Object.entries(encountersByHour)) {
      if (count > maxHourCount) {
        maxHourCount = count
        const hourNum = parseInt(hKey.split(":")[0], 10)
        peakHourStr = formatHourRange(hourNum)
      }
    }

    return {
      totalEncounters: encs.length,
      totalPatients: uniquePatients.size || encs.length,
      maleCount,
      femaleCount,
      otherGenderCount,
      averageAge: ageCount > 0 ? Math.round((totalAgeSum / ageCount) * 10) / 10 : null,
      ageBrackets: {
        under18: under18Count,
        adults18to50: adults18to50Count,
        seniors50plus: seniors50plusCount,
      },
      averageDurationMinutes: durationCount > 0 ? Math.round(totalDurationMins / durationCount) : null,
      peakActivityHour: peakHourStr,
    }
  }, [departmentFilteredEncounters])

  // Dynamic Financial KPIs for the selected department
  const currentFinanceStats = useMemo(() => {
    if (selectedDepartment === "ALL") {
      return {
        departmentName: "All My Departments",
        totalGross: money.totalGrossBilled || money.totalProductTurnover,
        insuranceCovered: money.insuranceCoveredAmount,
        patientCash: money.patientCashCollected || money.patientShareAmount,
        loanAmount: money.patientLoanAmount,
        giveawayAmount: money.giveawayAmount,
        loanCount: money.loanCount,
        encountersCount: clinician.consultationsCount,
        productsCount: money.productItemsApprovedCount,
      }
    }

    const deptSummary = money.departmentBreakdown.find((d) => d.departmentName === selectedDepartment)
    if (deptSummary) {
      const deptProds = money.productTurnoverList.filter((p) => p.departmentName === selectedDepartment)
      const productsCount = deptProds.reduce((sum, p) => sum + (p.quantity || 1), 0)

      return {
        departmentName: deptSummary.departmentName,
        totalGross: deptSummary.totalAmount,
        insuranceCovered: deptSummary.insuranceCovered,
        patientCash: deptSummary.paidAmount || deptSummary.patientShare,
        loanAmount: deptSummary.loanAmount,
        giveawayAmount: deptSummary.giveawayAmount,
        loanCount: deptSummary.loanAmount > 0 ? 1 : 0,
        encountersCount: deptSummary.encountersCount,
        productsCount,
      }
    }

    const deptProds = money.productTurnoverList.filter((p) => p.departmentName === selectedDepartment && (p.isBilled || p.isExempted))
    const totalGross = deptProds.reduce((sum, p) => sum + p.lineTotal, 0)
    const insuranceCovered = deptProds.reduce((sum, p) => sum + p.insuranceCoveredAmount, 0)
    const patientCash = deptProds.reduce((sum, p) => sum + p.patientPayableAmount, 0)
    const productsCount = deptProds.reduce((sum, p) => sum + (p.quantity || 1), 0)

    return {
      departmentName: selectedDepartment,
      totalGross,
      insuranceCovered,
      patientCash,
      loanAmount: 0,
      giveawayAmount: 0,
      loanCount: 0,
      encountersCount: deptProds.length,
      productsCount,
    }
  }, [selectedDepartment, money, clinician.consultationsCount])

  // Insurance Breakdown for "Which Insurance Used to Pay" on the selected department
  const currentInsuranceBreakdown = useMemo(() => {
    const map = new Map<string, InsuranceMoneySummary>()

    for (const enc of departmentFilteredEncounters) {
      const insName = enc.insuranceName || "Private / Cash"
      if (!map.has(insName)) {
        map.set(insName, {
          insuranceName: insName,
          totalAmount: 0,
          insuranceCovered: 0,
          patientShare: 0,
          paidAmount: 0,
          loanAmount: 0,
          giveawayAmount: 0,
          count: 0,
        })
      }
      const entry = map.get(insName)!
      entry.totalAmount += enc.totalGross
      entry.insuranceCovered += enc.totalInsurance
      entry.patientShare += enc.totalPatient
      entry.count++
    }

    // Also factor in any standalone product items if encounters list had 0 totals
    if (map.size === 0) {
      for (const prod of departmentFilteredProducts) {
        if (!prod.isBilled && !prod.isExempted) continue
        const insName = prod.insuranceName || "Private / Cash"
        if (!map.has(insName)) {
          map.set(insName, {
            insuranceName: insName,
            totalAmount: 0,
            insuranceCovered: 0,
            patientShare: 0,
            paidAmount: 0,
            loanAmount: 0,
            giveawayAmount: 0,
            count: 0,
          })
        }
        const entry = map.get(insName)!
        entry.totalAmount += prod.lineTotal
        entry.insuranceCovered += prod.insuranceCoveredAmount
        entry.patientShare += prod.patientPayableAmount
        entry.count += prod.quantity || 1
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount)
  }, [departmentFilteredEncounters, departmentFilteredProducts])

  // Filtered Encounters for Tab 1 table
  const searchFilteredEncounters = useMemo(() => {
    if (!searchTerm.trim()) return departmentFilteredEncounters

    const q = searchTerm.toLowerCase()
    return departmentFilteredEncounters.filter((enc) => {
      const matchesPatient = enc.patientName.toLowerCase().includes(q)
      const matchesId = (enc.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = enc.departmentName.toLowerCase().includes(q)
      const matchesIns = enc.insuranceName.toLowerCase().includes(q)
      const matchesProds = enc.products.some(
        (p) => p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q)),
      )
      return matchesPatient || matchesId || matchesDept || matchesIns || matchesProds
    })
  }, [departmentFilteredEncounters, searchTerm])

  // Filtered Detailed Items for Tab 2 table
  const searchFilteredDetailedProducts = useMemo(() => {
    if (!searchTerm.trim()) return departmentFilteredProducts

    const q = searchTerm.toLowerCase()
    return departmentFilteredProducts.filter((item) => {
      const matchesName = item.productName.toLowerCase().includes(q)
      const matchesPatient = item.patientName.toLowerCase().includes(q)
      const matchesId = (item.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = item.departmentName.toLowerCase().includes(q)
      const matchesCode = (item.productCode || "").toLowerCase().includes(q)
      const matchesIns = (item.insuranceName || "").toLowerCase().includes(q)
      return matchesName || matchesPatient || matchesId || matchesDept || matchesCode || matchesIns
    })
  }, [departmentFilteredProducts, searchTerm])

  // Continuous Visible Slices for Encounters and Detailed products
  const visibleEncounters = useMemo(() => {
    return searchFilteredEncounters.slice(0, visibleCount)
  }, [searchFilteredEncounters, visibleCount])

  const visibleDetailedProducts = useMemo(() => {
    return searchFilteredDetailedProducts.slice(0, visibleCount)
  }, [searchFilteredDetailedProducts, visibleCount])

  const currentTotalCount = financeViewMode === "grouped" ? searchFilteredEncounters.length : searchFilteredDetailedProducts.length
  const currentVisibleCount = financeViewMode === "grouped" ? visibleEncounters.length : visibleDetailedProducts.length
  const hasMoreItems = currentVisibleCount < currentTotalCount

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 150 && hasMoreItems) {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, currentTotalCount))
    }
  }

  const handleLoadMore = () => {
    if (hasMoreItems) {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, currentTotalCount))
    }
  }

  // Export CSV
  const handleExportCSV = () => {
    if (activeTab === "encounters" || financeViewMode === "grouped") {
      if (!searchFilteredEncounters.length) return
      const headers = [
        "Date & Time",
        "Patient Name",
        "Patient ID",
        "Gender",
        "Age",
        "Department",
        "Insurance / Payer Used",
        "Duration (Mins)",
        "Products & Acts Prescribed",
        "Total Gross (RWF)",
        "Insurance Share (RWF)",
        "Patient Share (RWF)",
        "Status",
      ]
      const rows = searchFilteredEncounters.map((enc) => [
        `"${new Date(enc.timestamp).toLocaleString()}"`,
        `"${enc.patientName.replace(/"/g, '""')}"`,
        `"${enc.patientIdentifier || enc.patientId}"`,
        `"${enc.gender || "Unknown"}"`,
        enc.age != null ? enc.age : '""',
        `"${enc.departmentName.replace(/"/g, '""')}"`,
        `"${enc.insuranceName.replace(/"/g, '""')}"`,
        enc.durationMinutes != null ? enc.durationMinutes : '""',
        `"${enc.products.map((p) => `${p.quantity}x ${p.name} (${formatRWF(p.lineTotal)})`).join("; ").replace(/"/g, '""')}"`,
        enc.totalGross,
        enc.totalInsurance,
        enc.totalPatient,
        `"${enc.status}"`,
      ])

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute(
        "download",
        `clinician-encounters-${selectedDepartment.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      if (!searchFilteredDetailedProducts.length) return
      const headers = [
        "Timestamp",
        "Product / Act Name",
        "Quantity",
        "Unit Price (RWF)",
        "Gross Total (RWF)",
        "Insurance Share (RWF)",
        "Patient Share (RWF)",
        "Status",
        "Patient Name",
        "Patient ID",
        "Department",
        "Insurance Used",
      ]
      const rows = searchFilteredDetailedProducts.map((item) => [
        `"${new Date(item.timestamp).toLocaleString()}"`,
        `"${item.productName.replace(/"/g, '""')}"`,
        item.quantity,
        item.unitPrice,
        item.lineTotal,
        item.insuranceCoveredAmount,
        item.patientPayableAmount,
        `"${item.status}"`,
        `"${item.patientName.replace(/"/g, '""')}"`,
        `"${item.patientIdentifier || item.patientId}"`,
        `"${item.departmentName.replace(/"/g, '""')}"`,
        `"${(item.insuranceName || "Private / Cash").replace(/"/g, '""')}"`,
      ])

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute(
        "download",
        `clinician-itemized-finance-${selectedDepartment.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    } catch {
      return ts
    }
  }

  return (
    <div className={cn("transition-all", isTableExpanded ? "flex-1 flex flex-col min-h-0 h-full space-y-0" : "space-y-6")}>
      {/* Top Clinician Sub-Tabs Navigation (Centered & Clear) */}
      {!isTableExpanded && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/70 backdrop-blur-xl border border-border/60 p-2 rounded-2xl">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-1">
            {/* TAB 1: Encounters & Demographics */}
            <button
            type="button"
            onClick={() => {
              setActiveTab("encounters")
              setVisibleCount(INITIAL_VISIBLE_COUNT)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "encounters"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            Encounters & Demographics
            <Badge
              variant="secondary"
              className={`text-[10px] py-0 px-1.5 ml-1 ${
                activeTab === "encounters"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {departmentFilteredEncounters.length}
            </Badge>
          </button>

          {/* TAB 2: Finance & Turnover */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("finance")
              setVisibleCount(INITIAL_VISIBLE_COUNT)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "finance"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Wallet className="h-4 w-4" />
            Finance & Turnover
            <Badge
              variant="secondary"
              className={`text-[10px] py-0 px-1.5 ml-1 ${
                activeTab === "finance"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {formatRWF(currentFinanceStats.totalGross)}
            </Badge>
          </button>
        </div>

        {/* Right side: Department Filter & Time Period Selector */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* Department Filter Dropdown (only if user has more than 1 department) */}
          {availableDepartments.length > 1 && (
            <div className="w-full sm:w-56">
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="h-8 text-xs rounded-xl bg-card border-border/70 text-foreground font-medium shadow-sm">
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <SelectValue placeholder="Select Department" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/80 bg-card/95 backdrop-blur-xl">
                  <SelectItem value="ALL" className="font-semibold text-foreground">
                    All My Departments ({availableDepartments.length})
                  </SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: ENCOUNTERS & DEMOGRAPHICS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "encounters" && (
        <div className="space-y-6">
          {/* Demographic & Operational KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. People Attended / Encounters */}
            <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Patients Attended</span>
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{currentDemographics.totalPatients}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {currentDemographics.totalEncounters} total consultations
              </p>
            </div>

            {/* 2. Gender Breakdown (Male vs Female) */}
            <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Gender Split</span>
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <UserCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {currentDemographics.maleCount}M
                </span>
                <span className="text-sm font-semibold text-muted-foreground">/</span>
                <span className="text-xl font-bold text-pink-600 dark:text-pink-400">
                  {currentDemographics.femaleCount}F
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                <span>
                  {currentDemographics.totalEncounters > 0
                    ? `${Math.round((currentDemographics.maleCount / currentDemographics.totalEncounters) * 100)}% Male`
                    : "Male"}
                </span>
                <span>•</span>
                <span>
                  {currentDemographics.totalEncounters > 0
                    ? `${Math.round((currentDemographics.femaleCount / currentDemographics.totalEncounters) * 100)}% Female`
                    : "Female"}
                </span>
              </div>
            </div>

            {/* 3. Average Age & Age Groups */}
            <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Average Age</span>
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                {currentDemographics.averageAge != null ? `${currentDemographics.averageAge} yrs` : "N/A"}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground truncate">
                <span>&lt;18: {currentDemographics.ageBrackets.under18}</span>
                <span>•</span>
                <span>18-50: {currentDemographics.ageBrackets.adults18to50}</span>
                <span>•</span>
                <span>50+: {currentDemographics.ageBrackets.seniors50plus}</span>
              </div>
            </div>

            {/* 4. Average Encounter Time */}
            <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Avg Encounter Time</span>
                <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">
                {currentDemographics.averageDurationMinutes != null
                  ? `${currentDemographics.averageDurationMinutes} mins`
                  : currentDemographics.totalEncounters === 0
                  ? "N/A"
                  : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">Consultation duration</p>
            </div>

            {/* 5. High Activity / Peak Time */}
            <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">High Activity Time</span>
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Flame className="h-4 w-4" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground mt-2 truncate">
                {currentDemographics.peakActivityHour}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">Peak consultation volume</p>
            </div>
          </div>

          {/* Activity Chart & Consultation Progress */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Total Consultations</span>
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{clinician.consultationsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Assigned as clinician</p>
              </div>

              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Completed</span>
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{clinician.consultationsCompletedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clinician.consultationsInProgressCount} pending / in progress
                </p>
              </div>

              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Prescriptions & Orders</span>
                  <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Pill className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{clinician.prescriptionsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Drugs, lab acts & items prescribed</p>
              </div>

              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Internal Referrals</span>
                  <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mt-3">{clinician.referralsCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Dispatched to other services</p>
              </div>
            </div>

            <ReportsChart data={data} activeTab="clinician" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* TAB 2: FINANCE & TURNOVER VIEW */}
      {/* ========================================================================= */}
      {activeTab === "finance" && (
        <div className={cn("transition-all", isTableExpanded ? "flex-1 flex flex-col min-h-0 h-full" : "space-y-4")}>
          {/* Financial KPI Cards - Compact Mini Cards */}
          {!isTableExpanded && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Total Generated */}
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">Total Generated</span>
                  <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                    {formatRWF(currentFinanceStats.totalGross)}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {selectedDepartment === "ALL" ? "Across all departments" : selectedDepartment}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4" />
                </div>
              </div>

              {/* Insurance Covered */}
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">Insurance Covered</span>
                  <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                    {formatRWF(currentFinanceStats.insuranceCovered)}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {currentFinanceStats.totalGross > 0
                      ? `${Math.round((currentFinanceStats.insuranceCovered / currentFinanceStats.totalGross) * 100)}% covered by insurers`
                      : "Covered by insurance"}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>

              {/* Patient Share / Cash */}
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">Patient Share (Cash)</span>
                  <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                    {formatRWF(currentFinanceStats.patientCash)}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">Patient copays & private cash</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>

              {/* Giveaways & Waived */}
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-xl p-3 shadow-sm flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-muted-foreground block truncate">Giveaways & Waived</span>
                  <p className="text-base sm:text-lg font-bold text-foreground truncate mt-0.5">
                    {formatRWF(currentFinanceStats.giveawayAmount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">Waived copays & exemptions</p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Gift className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          {/* Turnover Breakdown Table with View Switcher, Fit/Expand and Continuous Scroll */}
          <div className={cn(
            "bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl shadow-sm flex flex-col transition-all overflow-hidden p-4 sm:p-5 gap-3",
            isTableExpanded && "flex-1 min-h-0"
          )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">Turnover & Prescriptions Breakdown</h3>
                  <Badge variant="outline" className="text-[11px] bg-muted/40 font-mono">
                    {financeViewMode === "grouped"
                      ? `${searchFilteredEncounters.length} Encounters`
                      : `${searchFilteredDetailedProducts.length} Items`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {financeViewMode === "grouped"
                    ? "Grouped per patient encounter with products and insurance in same row"
                    : "Item-by-item line breakdown of all approved drugs, acts, and supplies"}
                </p>
              </div>

              {/* View Switcher, Export and Expand/Fit Controls */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/70">
                  <button
                    type="button"
                    onClick={() => {
                      setFinanceViewMode("grouped")
                      setVisibleCount(INITIAL_VISIBLE_COUNT)
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      financeViewMode === "grouped"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Group by Encounter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFinanceViewMode("detailed")
                      setVisibleCount(INITIAL_VISIBLE_COUNT)
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      financeViewMode === "detailed"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    Detailed View
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="h-8 px-2.5 text-xs rounded-xl border-border/80 gap-1 text-foreground hover:bg-muted/80 shrink-0"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTableExpand}
                  title={isTableExpanded ? "Collapse to normal view" : "Expand table height to fit screen"}
                  className="h-8 px-2.5 text-xs rounded-xl border-border/80 gap-1.5 text-foreground hover:bg-muted/80 shrink-0"
                >
                  {isTableExpanded ? (
                    <>
                      <Minimize2 className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Fit Normal</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Expand Table</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Search Toolbar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, ID, product, code, insurance, or department..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9 h-8 text-xs rounded-xl bg-background/60 border-border/70 placeholder:text-muted-foreground/60"
              />
            </div>

            {/* MODE 1: Group by Encounter Table */}
            {financeViewMode === "grouped" && (
              <div className={cn("flex flex-col gap-2", isTableExpanded && "flex-1 min-h-0")}>
                {searchFilteredEncounters.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No patient encounters found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try selecting &quot;All My Departments&quot; or clearing your search filters.
                    </p>
                  </div>
                ) : (
                  <div
                    onScroll={handleTableScroll}
                    className={cn(
                      "overflow-y-auto overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                      isTableExpanded ? "flex-1 min-h-0 max-h-none" : "max-h-[500px] min-h-[320px]"
                    )}
                  >
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-20 bg-background/95 dark:bg-card/95 backdrop-blur-xl border-b border-border/70 shadow-xs">
                        <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Date & Time</th>
                          <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Patient</th>
                          {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                            <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Department</th>
                          )}
                          <th className="py-2.5 px-3.5 min-w-[280px] bg-muted/80 backdrop-blur-xl">Products & Acts (In Same Cell)</th>
                          <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance / Payer</th>
                          <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Total Gross</th>
                          <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance Share</th>
                          <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Patient Share</th>
                          <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Billing Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-foreground">
                        {visibleEncounters.map((enc) => (
                          <tr key={enc.id} className="hover:bg-muted/30 transition-colors align-top">
                            <td className="py-2.5 px-3.5 font-mono text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(enc.timestamp)}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="font-semibold text-foreground">{enc.patientName}</div>
                              {enc.patientIdentifier && (
                                <div className="text-[10px] text-muted-foreground font-mono">
                                  {enc.patientIdentifier}
                                </div>
                              )}
                            </td>
                            {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                              <td className="py-2.5 px-3.5 text-muted-foreground font-medium whitespace-nowrap">
                                {enc.departmentName}
                              </td>
                            )}
                            {/* Products list in the same cell */}
                            <td className="py-2.5 px-3.5">
                              {enc.products.length === 0 ? (
                                <span className="text-muted-foreground italic text-[11px]">
                                  No prescribed line items
                                </span>
                              ) : (
                                <div className="flex flex-col gap-1">
                                  {enc.products.map((prod, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between gap-2 p-1 rounded-md bg-muted/40 border border-border/40 text-[11px]"
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="font-bold text-primary shrink-0">{prod.quantity}x</span>
                                        <span className="text-foreground truncate">{prod.name}</span>
                                        {prod.code && (
                                          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                                            ({prod.code})
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-semibold text-foreground whitespace-nowrap shrink-0">
                                        {formatRWF(prod.lineTotal)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            {/* Insurance Used beside payment */}
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 bg-muted/40 border-border/80 font-medium"
                              >
                                {enc.insuranceName}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-bold text-foreground whitespace-nowrap">
                              {formatRWF(enc.totalGross)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                              {enc.totalInsurance > 0 ? formatRWF(enc.totalInsurance) : "—"}
                            </td>
                            <td className="py-2.5 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                              {formatRWF(enc.totalPatient)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={`text-[10px] uppercase tracking-wider py-0 px-1.5 ${
                                  enc.status === "BILLED" || enc.status === "COMPLETED"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {enc.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}

                        {/* Skeleton rows indicating continuous scroll loading */}
                        {hasMoreItems && (
                          <>
                            {[1, 2, 3].map((idx) => (
                              <tr key={`encounter-scroll-skeleton-${idx}`} className="border-b border-border/30 animate-pulse bg-muted/10">
                                <td className="py-2.5 px-3.5 whitespace-nowrap">
                                  <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-16 rounded" />
                                    <Skeleton className="h-2.5 w-12 rounded" />
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-28 rounded" />
                                    <Skeleton className="h-2.5 w-16 rounded" />
                                  </div>
                                </td>
                                {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                                    <Skeleton className="h-3.5 w-24 rounded" />
                                  </td>
                                )}
                                <td className="py-2.5 px-3.5">
                                  <div className="flex flex-col gap-1">
                                    <Skeleton className="h-6 w-48 rounded-md" />
                                    <Skeleton className="h-6 w-36 rounded-md" />
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5 whitespace-nowrap">
                                  <Skeleton className="h-4 w-16 rounded-full" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-16 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Continuous Scroll Indicator / Load More Bar */}
                {searchFilteredEncounters.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 px-1 text-xs text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span>Showing</span>
                      <span className="font-semibold text-foreground">{visibleEncounters.length}</span>
                      <span>of</span>
                      <span className="font-semibold text-foreground">{searchFilteredEncounters.length}</span>
                      <span>encounters</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasMoreItems ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLoadMore}
                          className="h-7 px-3 text-xs rounded-lg text-primary hover:bg-primary/10 gap-1.5 font-medium"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                          Scroll or Click to Load More ({searchFilteredEncounters.length - visibleEncounters.length} remaining)
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
                          <Check className="h-3 w-3" />
                          All {searchFilteredEncounters.length} encounters loaded
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: Detailed Line-by-Line Table */}
            {financeViewMode === "detailed" && (
              <div className={cn("flex flex-col gap-2", isTableExpanded && "flex-1 min-h-0")}>
                {searchFilteredDetailedProducts.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-2">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No approved product items found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Try adjusting your search criteria or department filter.
                    </p>
                  </div>
                ) : (
                  <div
                    onScroll={handleTableScroll}
                    className={cn(
                      "overflow-y-auto overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                      isTableExpanded ? "flex-1 min-h-0 max-h-none" : "max-h-[500px] min-h-[320px]"
                    )}
                  >
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 z-20 bg-background/95 dark:bg-card/95 backdrop-blur-xl border-b border-border/70 shadow-xs">
                        <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                          <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Time</th>
                          <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Product / Act Name</th>
                          <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Patient</th>
                          {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                            <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Department</th>
                          )}
                          <th className="py-2.5 px-3.5 text-center bg-muted/80 backdrop-blur-xl">Qty</th>
                          <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Unit Price</th>
                          <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance Used</th>
                          <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Gross Total</th>
                          <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Insurance Share</th>
                          <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Patient Share</th>
                          <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 text-foreground">
                        {visibleDetailedProducts.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3.5 font-mono text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(item.timestamp)}
                            </td>
                            <td className="py-2.5 px-3.5 font-semibold text-foreground">
                              {item.productName}
                              {item.productCode && (
                                <span className="block text-[10px] text-muted-foreground font-mono font-normal">
                                  Code: {item.productCode}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="font-medium text-foreground">{item.patientName}</div>
                              {item.patientIdentifier && (
                                <div className="text-[10px] text-muted-foreground font-mono">
                                  {item.patientIdentifier}
                                </div>
                              )}
                            </td>
                            {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                              <td className="py-2.5 px-3.5 text-muted-foreground">{item.departmentName}</td>
                            )}
                            <td className="py-2.5 px-3.5 text-center font-medium">{item.quantity}</td>
                            <td className="py-2.5 px-3.5 text-right text-muted-foreground">
                              {formatRWF(item.unitPrice)}
                            </td>
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 bg-muted/40 border-border/80"
                              >
                                {item.insuranceName || "Private / Cash"}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-bold text-foreground whitespace-nowrap">
                              {formatRWF(item.lineTotal)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                              {item.insuranceCoveredAmount > 0 ? formatRWF(item.insuranceCoveredAmount) : "—"}
                            </td>
                            <td className="py-2.5 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                              {formatRWF(item.patientPayableAmount)}
                            </td>
                            <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={`text-[10px] uppercase tracking-wider py-0 px-1.5 ${
                                  item.status === "BILLED"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                    : item.status === "EXEMPTED" || item.status === "PATIENT_SHARE_EXEMPTED"
                                    ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 font-semibold"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}

                        {/* Skeleton rows indicating continuous scroll loading */}
                        {hasMoreItems && (
                          <>
                            {[1, 2, 3].map((idx) => (
                              <tr key={`detailed-scroll-skeleton-${idx}`} className="border-b border-border/30 animate-pulse bg-muted/10">
                                <td className="py-2.5 px-3.5 font-mono whitespace-nowrap">
                                  <Skeleton className="h-3.5 w-14 rounded" />
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-36 rounded" />
                                    <Skeleton className="h-2.5 w-16 rounded" />
                                  </div>
                                </td>
                                <td className="py-2.5 px-3.5">
                                  <div className="space-y-1">
                                    <Skeleton className="h-3.5 w-24 rounded" />
                                    <Skeleton className="h-2.5 w-14 rounded" />
                                  </div>
                                </td>
                                {selectedDepartment === "ALL" && availableDepartments.length > 1 && (
                                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                                    <Skeleton className="h-3.5 w-24 rounded" />
                                  </td>
                                )}
                                <td className="py-2.5 px-3.5 text-center">
                                  <Skeleton className="h-3.5 w-6 rounded mx-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 whitespace-nowrap">
                                  <Skeleton className="h-4 w-16 rounded-full" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-16 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                                </td>
                                <td className="py-2.5 px-3.5 text-right">
                                  <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Continuous Scroll Indicator / Load More Bar */}
                {searchFilteredDetailedProducts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 px-1 text-xs text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span>Showing</span>
                      <span className="font-semibold text-foreground">{visibleDetailedProducts.length}</span>
                      <span>of</span>
                      <span className="font-semibold text-foreground">{searchFilteredDetailedProducts.length}</span>
                      <span>items</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasMoreItems ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleLoadMore}
                          className="h-7 px-3 text-xs rounded-lg text-primary hover:bg-primary/10 gap-1.5 font-medium"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                          Scroll or Click to Load More ({searchFilteredDetailedProducts.length - visibleDetailedProducts.length} remaining)
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
                          <Check className="h-3 w-3" />
                          All {searchFilteredDetailedProducts.length} items loaded
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
