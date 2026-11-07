"use client"

import React, { useState, useMemo, useCallback } from "react"
import {
  ClinicReportsData,
  ClinicEncounterDetail,
  ClinicProductTurnoverItem,
} from "@/hooks/reports/use-clinic-reports"
import { formatRWF, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  FileSpreadsheet,
  Layers,
  ListFilter,
  Maximize2,
  Minimize2,
  ChevronDown,
  Check,
  Building2,
  Stethoscope,
  Receipt,
  Shield,
  CreditCard,
  Clock,
  Filter,
} from "lucide-react"

interface AdminReportsDetailedProps {
  data: ClinicReportsData
  selectedDepartmentIds?: string[]
  selectedClinicianIds?: string[]
  selectedInsuranceIds?: string[]
  isPrivateOnly?: boolean
  departments?: Array<{ id: string; name?: string | null }>
  clinicians?: Array<{ id: string; firstName?: string | null; lastName?: string | null; fullName?: string | null }>
  insurances?: Array<{ id: string; name?: string | null; acronym?: string | null }>
}

const INITIAL_VISIBLE_COUNT = 25
const LOAD_MORE_STEP = 25

export function AdminReportsDetailed({
  data,
  selectedDepartmentIds = [],
  selectedClinicianIds = [],
  selectedInsuranceIds = [],
  isPrivateOnly = false,
  departments = [],
  clinicians = [],
  insurances = [],
}: AdminReportsDetailedProps) {
  // View mode: 'grouped' (per encounter/visit) or 'detailed' (line-by-line products/acts)
  const [financeViewMode, setFinanceViewMode] = useState<"grouped" | "detailed">("grouped")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BILLED" | "PENDING" | "EXEMPTED" | "LOAN">("ALL")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [isTableExpanded, setIsTableExpanded] = useState(false)

  // Determine active focused filters to hide redundant columns
  const isDepartmentFiltered = selectedDepartmentIds.length > 0
  const isClinicianFiltered = selectedClinicianIds.length > 0
  const isInsuranceFiltered = selectedInsuranceIds.length > 0 || isPrivateOnly
  const isStatusFiltered = statusFilter !== "ALL"

  // Human-readable labels for focused filters
  const focusedDepartmentLabel = useMemo(() => {
    if (!isDepartmentFiltered) return null
    const matched = departments
      .filter((d) => selectedDepartmentIds.includes(d.id))
      .map((d) => d.name || "Department")
    if (matched.length > 0) return matched.join(", ")
    return `${selectedDepartmentIds.length} department(s)`
  }, [isDepartmentFiltered, departments, selectedDepartmentIds])

  const focusedClinicianLabel = useMemo(() => {
    if (!isClinicianFiltered) return null
    const matched = clinicians
      .filter((c) => selectedClinicianIds.includes(c.id))
      .map((c) => {
        const fn = (c.firstName || "").trim()
        const ln = (c.lastName || "").trim()
        return (fn || ln) ? `Dr. ${fn} ${ln}`.trim() : (c.fullName || "Clinician")
      })
    if (matched.length > 0) return matched.join(", ")
    return `${selectedClinicianIds.length} clinician(s)`
  }, [isClinicianFiltered, clinicians, selectedClinicianIds])

  const focusedInsuranceLabel = useMemo(() => {
    if (!isInsuranceFiltered) return null
    if (isPrivateOnly) return "Private / Cash"
    const matched = insurances
      .filter((i) => selectedInsuranceIds.includes(i.id))
      .map((i) => i.acronym || i.name || "Insurance")
    if (matched.length > 0) return matched.join(", ")
    return `${selectedInsuranceIds.length} payer(s)`
  }, [isInsuranceFiltered, isPrivateOnly, insurances, selectedInsuranceIds])

  // Extract encounters list with fallback sources
  const encounters: ClinicEncounterDetail[] = useMemo(() => {
    if (data.encountersList && data.encountersList.length > 0) {
      return data.encountersList
    }
    if (data.financialBreakdown?.encountersList && data.financialBreakdown.encountersList.length > 0) {
      return data.financialBreakdown.encountersList
    }
    if (data.deepReports?.encounters && data.deepReports.encounters.length > 0) {
      return data.deepReports.encounters
    }
    return []
  }, [data])

  // Extract or synthesize detailed line items
  const detailedProducts: ClinicProductTurnoverItem[] = useMemo(() => {
    if (data.productTurnoverList && data.productTurnoverList.length > 0) {
      return data.productTurnoverList
    }
    if (data.financialBreakdown?.productTurnoverList && data.financialBreakdown.productTurnoverList.length > 0) {
      return data.financialBreakdown.productTurnoverList
    }
    if (data.deepReports?.productTurnoverList && data.deepReports.productTurnoverList.length > 0) {
      return data.deepReports.productTurnoverList
    }

    const items: ClinicProductTurnoverItem[] = []
    for (const enc of encounters) {
      for (const p of enc.products || []) {
        items.push({
          id: p.id || `item-${enc.id}-${items.length}`,
          visitId: enc.visitId,
          visitDepartmentId: enc.visitDepartmentId,
          timestamp: enc.timestamp,
          productName: p.name,
          productCode: p.code,
          patientName: enc.patientName,
          patientId: enc.patientId,
          patientIdentifier: enc.patientIdentifier,
          departmentId: enc.departmentId,
          departmentName: enc.departmentName,
          clinicianId: enc.clinicianId,
          clinicianName: enc.clinicianName,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          lineTotal: p.lineTotal,
          insuranceName: enc.insuranceName,
          insuranceCoveredAmount: p.insuranceCovered,
          patientPayableAmount: p.patientShare,
          status: p.status,
          isBilled: p.status === "BILLED",
          isExempted: p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED",
        })
      }
    }
    return items
  }, [data, encounters])

  // Aggregate stats for filter counts and header pills
  const stats = useMemo(() => {
    const totalEncounters = encounters.length
    const totalGross = data.overview.totalGrossBilled || encounters.reduce((sum, e) => sum + e.totalGross, 0)
    const insuranceCovered = data.overview.insuranceCoveredAmount || encounters.reduce((sum, e) => sum + e.totalInsurance, 0)
    const patientShare = data.overview.patientShareAmount || encounters.reduce((sum, e) => sum + e.totalPatient, 0)
    const pendingAmount = data.overview.pendingBillingAmount || 0
    const pendingCount = data.overview.pendingBillingCount || encounters.filter((e) => e.status !== "BILLED" && e.status !== "COMPLETED").length
    const waiverCount = data.overview.waiverCount + (data.overview.giveawayCount || 0)
    const loanCount = data.overview.loanCount || encounters.filter((e) => (e.loanAmount ?? 0) > 0).length

    return {
      totalEncounters,
      totalGross,
      insuranceCovered,
      patientShare,
      pendingAmount,
      pendingCount,
      waiverCount,
      loanCount,
    }
  }, [encounters, data.overview])

  // Filtered Encounters by Status
  const statusFilteredEncounters = useMemo(() => {
    if (statusFilter === "ALL") return encounters
    if (statusFilter === "BILLED") {
      return encounters.filter(
        (e) => e.status === "BILLED" || e.status === "COMPLETED" || e.totalGross > 0
      )
    }
    if (statusFilter === "PENDING") {
      return encounters.filter(
        (e) => e.status !== "BILLED" && e.status !== "COMPLETED" && e.status !== "EXEMPTED"
      )
    }
    if (statusFilter === "EXEMPTED") {
      return encounters.filter(
        (e) =>
          e.status === "EXEMPTED" ||
          (e.waiverAmount ?? 0) > 0 ||
          (e.giveawayAmount ?? 0) > 0 ||
          e.products.some((p) => p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED")
      )
    }
    if (statusFilter === "LOAN") {
      return encounters.filter((e) => (e.loanAmount ?? 0) > 0 || e.totalPatient > 0)
    }
    return encounters
  }, [encounters, statusFilter])

  // Search Filtered Encounters
  const searchFilteredEncounters = useMemo(() => {
    if (!searchTerm.trim()) return statusFilteredEncounters

    const q = searchTerm.toLowerCase()
    return statusFilteredEncounters.filter((enc) => {
      const matchesPatient = enc.patientName.toLowerCase().includes(q)
      const matchesId = (enc.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = enc.departmentName.toLowerCase().includes(q)
      const matchesClinician = (enc.clinicianName || "").toLowerCase().includes(q)
      const matchesIns = enc.insuranceName.toLowerCase().includes(q)
      const matchesProds = enc.products.some(
        (p) => p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q))
      )
      return matchesPatient || matchesId || matchesDept || matchesClinician || matchesIns || matchesProds
    })
  }, [statusFilteredEncounters, searchTerm])

  // Filtered Detailed Items by Status
  const statusFilteredDetailedProducts = useMemo(() => {
    if (statusFilter === "ALL") return detailedProducts
    if (statusFilter === "BILLED") {
      return detailedProducts.filter((p) => p.isBilled || p.status === "BILLED")
    }
    if (statusFilter === "PENDING") {
      return detailedProducts.filter((p) => !p.isBilled && !p.isExempted && p.status !== "BILLED")
    }
    if (statusFilter === "EXEMPTED") {
      return detailedProducts.filter((p) => p.isExempted || p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED")
    }
    if (statusFilter === "LOAN") {
      return detailedProducts.filter((p) => p.patientPayableAmount > 0)
    }
    return detailedProducts
  }, [detailedProducts, statusFilter])

  // Search Filtered Detailed Items
  const searchFilteredDetailedProducts = useMemo(() => {
    if (!searchTerm.trim()) return statusFilteredDetailedProducts

    const q = searchTerm.toLowerCase()
    return statusFilteredDetailedProducts.filter((item) => {
      const matchesName = item.productName.toLowerCase().includes(q)
      const matchesPatient = item.patientName.toLowerCase().includes(q)
      const matchesId = (item.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = item.departmentName.toLowerCase().includes(q)
      const matchesClinician = (item.clinicianName || "").toLowerCase().includes(q)
      const matchesCode = (item.productCode || "").toLowerCase().includes(q)
      const matchesIns = (item.insuranceName || "").toLowerCase().includes(q)
      return matchesName || matchesPatient || matchesId || matchesDept || matchesClinician || matchesCode || matchesIns
    })
  }, [statusFilteredDetailedProducts, searchTerm])

  // Slices for continuous scrolling
  const visibleEncounters = useMemo(() => {
    return searchFilteredEncounters.slice(0, visibleCount)
  }, [searchFilteredEncounters, visibleCount])

  const visibleDetailedProducts = useMemo(() => {
    return searchFilteredDetailedProducts.slice(0, visibleCount)
  }, [searchFilteredDetailedProducts, visibleCount])

  const currentTotalCount = financeViewMode === "grouped" ? searchFilteredEncounters.length : searchFilteredDetailedProducts.length
  const currentVisibleCount = financeViewMode === "grouped" ? visibleEncounters.length : visibleDetailedProducts.length
  const hasMoreItems = currentVisibleCount < currentTotalCount

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP)
  }, [])

  const handleTableScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop - clientHeight < 140) {
        if (hasMoreItems) {
          handleLoadMore()
        }
      }
    },
    [hasMoreItems, handleLoadMore]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }

  const toggleTableExpand = () => {
    setIsTableExpanded((prev) => !prev)
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

  // Export CSV
  const handleExportCSV = () => {
    if (financeViewMode === "grouped") {
      if (!searchFilteredEncounters.length) return
      const headers = [
        "Date & Time",
        "Patient Name",
        "Patient ID",
        "Department",
        "Clinician",
        "Insurance / Payer Used",
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
        `"${enc.departmentName.replace(/"/g, '""')}"`,
        `"${(enc.clinicianName || "—").replace(/"/g, '""')}"`,
        `"${enc.insuranceName.replace(/"/g, '""')}"`,
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
        `clinic-visits-financial-report-${new Date().toISOString().slice(0, 10)}.csv`
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
        "Clinician",
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
        `"${(item.clinicianName || "—").replace(/"/g, '""')}"`,
        `"${(item.insuranceName || "Private / Cash").replace(/"/g, '""')}"`,
      ])

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute(
        "download",
        `clinic-itemized-finance-${new Date().toISOString().slice(0, 10)}.csv`
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const anyFilterApplied = isDepartmentFiltered || isClinicianFiltered || isInsuranceFiltered || isStatusFiltered

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* Quick Financial Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Encounters</span>
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-foreground mt-1 font-mono">
            {stats.totalEncounters.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted-foreground">Prescribed Visits</span>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Total Gross</span>
            <Receipt className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-foreground mt-1 font-mono">
            {formatRWF(stats.totalGross)}
          </div>
          <span className="text-[11px] text-muted-foreground">Prescriptions & Acts</span>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Insurance Share</span>
            <Shield className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 font-mono">
            {formatRWF(stats.insuranceCovered)}
          </div>
          <span className="text-[11px] text-muted-foreground">Insurer Liability</span>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Patient Share</span>
            <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {formatRWF(stats.patientShare)}
          </div>
          <span className="text-[11px] text-muted-foreground">Co-pays & Private</span>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Pending Billing</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {formatRWF(stats.pendingAmount)}
          </div>
          <span className="text-[11px] text-muted-foreground">{stats.pendingCount} unbilled items</span>
        </div>

        <div className="bg-card/90 backdrop-blur-xl border border-border/70 p-3 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Waivers & Loans</span>
            <Receipt className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 font-mono">
            {stats.waiverCount + stats.loanCount}
          </div>
          <span className="text-[11px] text-muted-foreground">{stats.waiverCount} Waivers, {stats.loanCount} Loans</span>
        </div>
      </div>

      {/* Main Breakdown Container matching Clinician View */}
      <div
        className={cn(
          "bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl shadow-sm flex flex-col transition-all overflow-hidden p-4 sm:p-5 gap-3",
          isTableExpanded && "flex-1 min-h-[700px]"
        )}
      >
        {/* Top bar: Title + View Switcher + Export + Expand */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Turnover & Prescriptions Breakdown
              </h3>
              <Badge variant="outline" className="text-[12px] bg-muted/40 font-mono">
                {financeViewMode === "grouped"
                  ? `${searchFilteredEncounters.length} Encounters`
                  : `${searchFilteredDetailedProducts.length} Items`}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {financeViewMode === "grouped"
                ? "Grouped per patient visit with prescribed acts, products and earnings breakdown"
                : "Item-by-item line breakdown of all approved drugs, acts, consultations, and supplies"}
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

        {/* Search & Status Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient, ID, clinician, product, code, insurance, or department..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 h-8 text-xs rounded-xl bg-background/60 border-border/70 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap shrink-0">
            {(
              [
                { id: "ALL", label: "All Items" },
                { id: "BILLED", label: "Billed" },
                { id: "PENDING", label: `Pending (${stats.pendingCount})` },
                { id: "EXEMPTED", label: `Waivers (${stats.waiverCount})` },
                { id: "LOAN", label: `Loans (${stats.loanCount})` },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setStatusFilter(f.id)
                  setVisibleCount(INITIAL_VISIBLE_COUNT)
                }}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                  statusFilter === f.id
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                    : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/70"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Focus Notification Ribbon */}
        {anyFilterApplied && (
          <div className="flex items-center gap-2 flex-wrap text-xs px-2 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-muted-foreground animate-in fade-in duration-150">
            <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
              <Filter className="h-3 w-3 text-primary" />
              Focusing on:
            </span>

            {isDepartmentFiltered && (
              <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 gap-1 font-medium">
                <Building2 className="h-3 w-3" />
                Department: {focusedDepartmentLabel}
                <span className="text-[10px] opacity-75 font-normal">(column hidden)</span>
              </Badge>
            )}

            {isClinicianFiltered && (
              <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 gap-1 font-medium">
                <Stethoscope className="h-3 w-3" />
                Clinician: {focusedClinicianLabel}
                <span className="text-[10px] opacity-75 font-normal">(column hidden)</span>
              </Badge>
            )}

            {isInsuranceFiltered && (
              <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 gap-1 font-medium">
                <Shield className="h-3 w-3" />
                Payer: {focusedInsuranceLabel}
                <span className="text-[10px] opacity-75 font-normal">(column hidden)</span>
              </Badge>
            )}

            {isStatusFiltered && (
              <Badge variant="outline" className="text-[11px] bg-primary/10 text-primary border-primary/20 gap-1 font-medium">
                <Receipt className="h-3 w-3" />
                Status: {statusFilter}
                <span className="text-[10px] opacity-75 font-normal">(column hidden)</span>
              </Badge>
            )}
          </div>
        )}

        {/* MODE 1: Group by Encounter Table */}
        {financeViewMode === "grouped" && (
          <div className={cn("flex flex-col gap-2", isTableExpanded && "flex-1 min-h-0")}>
            {searchFilteredEncounters.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-2">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">No visits found matching filters</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Try clearing your search keyword or relaxing status filters.
                </p>
              </div>
            ) : (
              <div
                onScroll={handleTableScroll}
                className={cn(
                  "overflow-y-auto overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  isTableExpanded ? "flex-1 min-h-0 max-h-none" : "max-h-[520px] min-h-[320px]"
                )}
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-background/95 dark:bg-card/95 backdrop-blur-xl border-b border-border/70 shadow-xs">
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Date & Time</th>
                      <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Patient</th>
                      {!isDepartmentFiltered && (
                        <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Department</th>
                      )}
                      {!isClinicianFiltered && (
                        <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Clinician</th>
                      )}
                      <th className="py-2.5 px-3.5 min-w-[280px] bg-muted/80 backdrop-blur-xl">Products & Acts (In Same Cell)</th>
                      {!isInsuranceFiltered && (
                        <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance / Payer</th>
                      )}
                      <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Total Gross</th>
                      <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance Share</th>
                      <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Patient Share</th>
                      {!isStatusFiltered && (
                        <th className="py-2.5 px-3.5 text-right whitespace-nowrap bg-muted/80 backdrop-blur-xl">Billing Status</th>
                      )}
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
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {enc.patientIdentifier}
                            </div>
                          )}
                        </td>
                        {!isDepartmentFiltered && (
                          <td className="py-2.5 px-3.5 text-muted-foreground font-medium whitespace-nowrap">
                            {enc.departmentName}
                          </td>
                        )}
                        {!isClinicianFiltered && (
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-foreground font-medium">
                              <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                              <span>{enc.clinicianName || "—"}</span>
                            </div>
                          </td>
                        )}
                        {/* Products list in the same cell */}
                        <td className="py-2.5 px-3.5">
                          {enc.products.length === 0 ? (
                            <span className="text-muted-foreground italic text-[12px]">
                              No prescribed line items
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {enc.products.map((prod, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between gap-2 p-1 rounded-md bg-muted/40 border border-border/40 text-[12px]"
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="font-bold text-primary shrink-0">{prod.quantity}x</span>
                                    <span className="text-foreground truncate">{prod.name}</span>
                                    {prod.code && (
                                      <span className="text-[11px] text-muted-foreground font-mono shrink-0">
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
                        {!isInsuranceFiltered && (
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className="text-[11px] py-0 px-1.5 bg-muted/40 border-border/80 font-medium"
                            >
                              {enc.insuranceName}
                            </Badge>
                          </td>
                        )}
                        <td className="py-2.5 px-3.5 text-right font-bold text-foreground whitespace-nowrap">
                          {formatRWF(enc.totalGross)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                          {enc.totalInsurance > 0 ? formatRWF(enc.totalInsurance) : "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                          {formatRWF(enc.totalPatient)}
                        </td>
                        {!isStatusFiltered && (
                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`text-[11px] uppercase tracking-wider py-0 px-1.5 ${
                                enc.status === "BILLED" || enc.status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {enc.status}
                            </Badge>
                          </td>
                        )}
                      </tr>
                    ))}

                    {/* Skeleton rows indicating continuous scroll loading */}
                    {hasMoreItems && (
                      <>
                        {[1, 2, 3].map((idx) => (
                          <tr key={`encounter-scroll-skeleton-${idx}`} className="border-b border-border/30 animate-pulse bg-muted/10">
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <Skeleton className="h-3.5 w-16 rounded" />
                            </td>
                            <td className="py-2.5 px-3.5">
                              <Skeleton className="h-3.5 w-28 rounded mb-1" />
                              <Skeleton className="h-2.5 w-16 rounded" />
                            </td>
                            {!isDepartmentFiltered && (
                              <td className="py-2.5 px-3.5 whitespace-nowrap">
                                <Skeleton className="h-3.5 w-20 rounded" />
                              </td>
                            )}
                            {!isClinicianFiltered && (
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
                            {!isInsuranceFiltered && (
                              <td className="py-2.5 px-3.5 whitespace-nowrap">
                                <Skeleton className="h-4 w-16 rounded-full" />
                              </td>
                            )}
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-16 rounded ml-auto" />
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                            </td>
                            {!isStatusFiltered && (
                              <td className="py-2.5 px-3.5 text-right">
                                <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                              </td>
                            )}
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
                      className="h-7 px-3 text-xs rounded-lg text-primary hover:bg-primary/10 gap-1.5 font-medium cursor-pointer"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                      Scroll or Click to Load More ({searchFilteredEncounters.length - visibleEncounters.length} remaining)
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
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
                  Try adjusting your search criteria or status filter.
                </p>
              </div>
            ) : (
              <div
                onScroll={handleTableScroll}
                className={cn(
                  "overflow-y-auto overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  isTableExpanded ? "flex-1 min-h-0 max-h-none" : "max-h-[520px] min-h-[320px]"
                )}
              >
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-background/95 dark:bg-card/95 backdrop-blur-xl border-b border-border/70 shadow-xs">
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Time</th>
                      <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Product / Act Name</th>
                      <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Patient</th>
                      {!isDepartmentFiltered && (
                        <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Department</th>
                      )}
                      {!isClinicianFiltered && (
                        <th className="py-2.5 px-3.5 bg-muted/80 backdrop-blur-xl">Clinician</th>
                      )}
                      <th className="py-2.5 px-3.5 text-center bg-muted/80 backdrop-blur-xl">Qty</th>
                      <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Unit Price</th>
                      {!isInsuranceFiltered && (
                        <th className="py-2.5 px-3.5 whitespace-nowrap bg-muted/80 backdrop-blur-xl">Insurance Used</th>
                      )}
                      <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Gross Total</th>
                      <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Insurance Share</th>
                      <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Patient Share</th>
                      {!isStatusFiltered && (
                        <th className="py-2.5 px-3.5 text-right bg-muted/80 backdrop-blur-xl">Status</th>
                      )}
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
                            <span className="block text-[11px] text-muted-foreground font-mono font-normal">
                              Code: {item.productCode}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-medium text-foreground">{item.patientName}</div>
                          {item.patientIdentifier && (
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {item.patientIdentifier}
                            </div>
                          )}
                        </td>
                        {!isDepartmentFiltered && (
                          <td className="py-2.5 px-3.5 text-muted-foreground whitespace-nowrap">{item.departmentName}</td>
                        )}
                        {!isClinicianFiltered && (
                          <td className="py-2.5 px-3.5 text-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                              <span>{item.clinicianName || "—"}</span>
                            </div>
                          </td>
                        )}
                        <td className="py-2.5 px-3.5 text-center font-bold text-primary">{item.quantity}</td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-muted-foreground">
                          {formatRWF(item.unitPrice)}
                        </td>
                        {!isInsuranceFiltered && (
                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <Badge variant="outline" className="text-[11px] py-0 px-1.5 bg-muted/40 font-medium">
                              {item.insuranceName || "Private / Cash"}
                            </Badge>
                          </td>
                        )}
                        <td className="py-2.5 px-3.5 text-right font-bold text-foreground font-mono">
                          {formatRWF(item.lineTotal)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-blue-600 dark:text-blue-400 font-mono font-medium">
                          {item.insuranceCoveredAmount > 0 ? formatRWF(item.insuranceCoveredAmount) : "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                          {formatRWF(item.patientPayableAmount)}
                        </td>
                        {!isStatusFiltered && (
                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`text-[11px] uppercase tracking-wider py-0 px-1.5 ${
                                item.isBilled || item.status === "BILLED"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold"
                                  : item.isExempted
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </td>
                        )}
                      </tr>
                    ))}

                    {/* Skeletons for detailed product loading */}
                    {hasMoreItems && (
                      <>
                        {[1, 2, 3].map((idx) => (
                          <tr key={`item-scroll-skeleton-${idx}`} className="border-b border-border/30 animate-pulse bg-muted/10">
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <Skeleton className="h-3.5 w-16 rounded" />
                            </td>
                            <td className="py-2.5 px-3.5">
                              <Skeleton className="h-3.5 w-32 rounded mb-1" />
                              <Skeleton className="h-2.5 w-16 rounded" />
                            </td>
                            <td className="py-2.5 px-3.5">
                              <Skeleton className="h-3.5 w-24 rounded" />
                            </td>
                            {!isDepartmentFiltered && (
                              <td className="py-2.5 px-3.5 whitespace-nowrap">
                                <Skeleton className="h-3.5 w-20 rounded" />
                              </td>
                            )}
                            {!isClinicianFiltered && (
                              <td className="py-2.5 px-3.5 whitespace-nowrap">
                                <Skeleton className="h-3.5 w-20 rounded" />
                              </td>
                            )}
                            <td className="py-2.5 px-3.5 text-center">
                              <Skeleton className="h-3.5 w-6 rounded mx-auto" />
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                            </td>
                            {!isInsuranceFiltered && (
                              <td className="py-2.5 px-3.5 whitespace-nowrap">
                                <Skeleton className="h-4 w-16 rounded-full" />
                              </td>
                            )}
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-16 rounded ml-auto" />
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                            </td>
                            {!isStatusFiltered && (
                              <td className="py-2.5 px-3.5 text-right">
                                <Skeleton className="h-4 w-16 rounded-full ml-auto" />
                              </td>
                            )}
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
                      className="h-7 px-3 text-xs rounded-lg text-primary hover:bg-primary/10 gap-1.5 font-medium cursor-pointer"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                      Scroll or Click to Load More ({searchFilteredDetailedProducts.length - visibleDetailedProducts.length} remaining)
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1">
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
  )
}
