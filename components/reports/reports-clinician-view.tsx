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
  Filter,
  HandCoins,
} from "lucide-react"
import type {
  UserReportsData,
  ClinicianMoneyReport,
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
  financeOnly?: boolean
}

const defaultEmptyMoney: ClinicianMoneyReport = {
  totalGrossBilled: 0,
  insuranceCoveredAmount: 0,
  patientShareAmount: 0,
  patientCashCollected: 0,
  patientLoanAmount: 0,
  giveawayAmount: 0,
  outstandingBalance: 0,
  loanCount: 0,
  giveawayCount: 0,
  pendingBillingAmount: 0,
  pendingBillingCount: 0,
  totalProductTurnover: 0,
  productItemsApprovedCount: 0,
  productTurnoverByCategory: {},
  productTurnoverList: [],
  moneyTimeline: [],
  insuranceBreakdown: [],
  departmentBreakdown: [],
}

export function ReportsClinicianView(props: ReportsClinicianViewProps) {
  const money = props.data.clinician.money || defaultEmptyMoney
  return <ReportsClinicianViewContent {...props} money={money} />
}

interface ReportsClinicianViewContentProps extends ReportsClinicianViewProps {
  money: ClinicianMoneyReport
}

function ReportsClinicianViewContent({
  data,
  money,
  isTableExpanded: controlledIsTableExpanded,
  onToggleTableExpand,
  financeOnly = false,
}: ReportsClinicianViewContentProps) {
  const clinician = data.clinician

  // 1. Two Main Tabs: "encounters" (Encounters & Demographics) vs "finance" (Finance & Turnover)
  const [activeTab, setActiveTab] = useState<"encounters" | "finance">(
    financeOnly ? "finance" : "encounters"
  )

  // 2. Department Filter: "ALL" or specific department name (Applies across both tabs)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL")

  // 3. Finance Turnover View Switcher: "grouped" (Group by encounter) vs "detailed" (Itemized products)
  const [financeViewMode, setFinanceViewMode] = useState<"grouped" | "detailed">("grouped")

  // 4. Turnover Status Filter: "ALL" | "BILLED" | "PENDING" | "EXEMPTED" | "LOAN"
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BILLED" | "PENDING" | "EXEMPTED" | "LOAN">("ALL")

  // 5. Insurance Filter for Finance Breakdown: null or specific insurance name
  const [selectedInsuranceFilter, setSelectedInsuranceFilter] = useState<string | null>(null)

  // 6. Search and Continuous Pagination state
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
      const pendingItems = money.productTurnoverList.filter((p) => !p.isBilled && !p.isExempted)
      const pendingAmount =
        money.pendingBillingAmount != null
          ? money.pendingBillingAmount
          : pendingItems.reduce((sum, p) => sum + p.lineTotal, 0)
      const pendingCount =
        money.pendingBillingCount != null
          ? money.pendingBillingCount
          : pendingItems.reduce((sum, p) => sum + (p.quantity || 1), 0)

      const giveawayItems = money.productTurnoverList.filter((p) => p.isExempted)
      const giveawayAmount =
        (money.giveawayAmount || 0) + ((money as any).waiverAmount || 0) > 0
          ? (money.giveawayAmount || 0) + ((money as any).waiverAmount || 0)
          : giveawayItems.reduce((sum, p) => {
              if (p.status === "PATIENT_SHARE_EXEMPTED") {
                return sum + Math.max(0, p.lineTotal - (p.insuranceCoveredAmount || 0))
              }
              return sum + p.lineTotal
            }, 0)
      const giveawayCount =
        money.giveawayCount > 0
          ? money.giveawayCount
          : giveawayItems.reduce((sum, p) => sum + (p.quantity || 1), 0)

      return {
        departmentName: "All My Departments",
        totalGross: money.totalGrossBilled || money.totalProductTurnover,
        insuranceCovered: money.insuranceCoveredAmount,
        patientCash: money.patientCashCollected || money.patientShareAmount,
        loanAmount: money.patientLoanAmount,
        giveawayAmount,
        giveawayCount,
        loanCount: money.loanCount,
        pendingBillingAmount: pendingAmount,
        pendingBillingCount: pendingCount,
        encountersCount: clinician.consultationsCount,
        productsCount: money.productItemsApprovedCount,
      }
    }

    const deptSummary = money.departmentBreakdown.find((d) => d.departmentName === selectedDepartment)
    const deptProds = money.productTurnoverList.filter((p) => p.departmentName === selectedDepartment)
    const pendingItems = deptProds.filter((p) => !p.isBilled && !p.isExempted)
    const pendingAmount = pendingItems.reduce((sum, p) => sum + p.lineTotal, 0)
    const pendingCount = pendingItems.reduce((sum, p) => sum + (p.quantity || 1), 0)

    const giveawayItems = deptProds.filter((p) => p.isExempted)
    const giveawayAmount =
      (deptSummary?.giveawayAmount ?? 0) + ((deptSummary as any)?.waiverAmount ?? 0) > 0
        ? (deptSummary?.giveawayAmount ?? 0) + ((deptSummary as any)?.waiverAmount ?? 0)
        : giveawayItems.reduce((sum, p) => {
            if (p.status === "PATIENT_SHARE_EXEMPTED") {
              return sum + Math.max(0, p.lineTotal - (p.insuranceCoveredAmount || 0))
            }
            return sum + p.lineTotal
          }, 0)
    const giveawayCount =
      (deptSummary?.giveawayAmount ?? 0) > 0
        ? 1
        : giveawayItems.reduce((sum, p) => sum + (p.quantity || 1), 0)

    if (deptSummary) {
      const productsCount = deptProds.reduce((sum, p) => sum + (p.quantity || 1), 0)

      return {
        departmentName: deptSummary.departmentName,
        totalGross: deptSummary.totalAmount,
        insuranceCovered: deptSummary.insuranceCovered,
        patientCash: deptSummary.paidAmount || deptSummary.patientShare,
        loanAmount: deptSummary.loanAmount,
        giveawayAmount,
        giveawayCount,
        loanCount: deptSummary.loanAmount > 0 ? 1 : 0,
        pendingBillingAmount: pendingAmount,
        pendingBillingCount: pendingCount,
        encountersCount: deptSummary.encountersCount,
        productsCount,
      }
    }

    const billedOrExemptedProds = deptProds.filter((p) => p.isBilled || p.isExempted)
    const totalGross = billedOrExemptedProds.reduce((sum, p) => sum + p.lineTotal, 0)
    const insuranceCovered = billedOrExemptedProds.reduce((sum, p) => sum + p.insuranceCoveredAmount, 0)
    const patientCash = billedOrExemptedProds.reduce((sum, p) => sum + p.patientPayableAmount, 0)
    const productsCount = deptProds.reduce((sum, p) => sum + (p.quantity || 1), 0)

    return {
      departmentName: selectedDepartment,
      totalGross,
      insuranceCovered,
      patientCash,
      loanAmount: 0,
      giveawayAmount,
      giveawayCount,
      loanCount: 0,
      pendingBillingAmount: pendingAmount,
      pendingBillingCount: pendingCount,
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
      let encWaiver = (enc.waiverAmount || 0) + (enc.giveawayAmount || 0)
      if (encWaiver === 0 && Array.isArray(enc.products)) {
        for (const p of enc.products) {
          if (p.status === "PATIENT_SHARE_EXEMPTED") {
            encWaiver += Math.max(0, p.lineTotal - p.insuranceCovered)
          } else if (p.status === "EXEMPTED") {
            encWaiver += p.lineTotal
          }
        }
      }
      entry.giveawayAmount += encWaiver
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
        if (prod.status === "PATIENT_SHARE_EXEMPTED") {
          entry.giveawayAmount += Math.max(0, prod.lineTotal - prod.insuranceCoveredAmount)
        } else if (prod.status === "EXEMPTED" || prod.isExempted) {
          entry.giveawayAmount += prod.lineTotal
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount)
  }, [departmentFilteredEncounters, departmentFilteredProducts])

  // Filtered Encounters by Status
  const statusFilteredEncounters = useMemo(() => {
    if (statusFilter === "ALL") return departmentFilteredEncounters
    if (statusFilter === "BILLED") {
      return departmentFilteredEncounters.filter(
        (e) => e.status === "BILLED" || e.status === "COMPLETED" || e.totalGross > 0
      )
    }
    if (statusFilter === "PENDING") {
      return departmentFilteredEncounters.filter(
        (e) => e.status !== "BILLED" && e.status !== "COMPLETED" && e.status !== "EXEMPTED"
      )
    }
    if (statusFilter === "EXEMPTED") {
      return departmentFilteredEncounters.filter(
        (e) =>
          e.status === "EXEMPTED" ||
          e.products.some((p) => p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED")
      )
    }
    if (statusFilter === "LOAN") {
      return departmentFilteredEncounters.filter((e) => e.totalPatient > 0)
    }
    return departmentFilteredEncounters
  }, [departmentFilteredEncounters, statusFilter])

  // Filtered Encounters by Insurance Selection
  const insuranceFilteredEncounters = useMemo(() => {
    if (!selectedInsuranceFilter) return statusFilteredEncounters
    return statusFilteredEncounters.filter((enc) => {
      const insName = enc.insuranceName || "Private / Cash"
      return insName.toLowerCase() === selectedInsuranceFilter.toLowerCase()
    })
  }, [statusFilteredEncounters, selectedInsuranceFilter])

  // Filtered Encounters for Tab 1 table
  const searchFilteredEncounters = useMemo(() => {
    if (!searchTerm.trim()) return insuranceFilteredEncounters

    const q = searchTerm.toLowerCase()
    return insuranceFilteredEncounters.filter((enc) => {
      const matchesPatient = enc.patientName.toLowerCase().includes(q)
      const matchesId = (enc.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = enc.departmentName.toLowerCase().includes(q)
      const matchesIns = enc.insuranceName.toLowerCase().includes(q)
      const matchesProds = enc.products.some(
        (p) => p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q)),
      )
      return matchesPatient || matchesId || matchesDept || matchesIns || matchesProds
    })
  }, [insuranceFilteredEncounters, searchTerm])

  // Filtered Detailed Items by Status
  const statusFilteredDetailedProducts = useMemo(() => {
    if (statusFilter === "ALL") return departmentFilteredProducts
    if (statusFilter === "BILLED") {
      return departmentFilteredProducts.filter((p) => p.isBilled || p.status === "BILLED")
    }
    if (statusFilter === "PENDING") {
      return departmentFilteredProducts.filter(
        (p) => !p.isBilled && !p.isExempted && p.status !== "BILLED"
      )
    }
    if (statusFilter === "EXEMPTED") {
      return departmentFilteredProducts.filter(
        (p) => p.isExempted || p.status === "EXEMPTED" || p.status === "PATIENT_SHARE_EXEMPTED"
      )
    }
    if (statusFilter === "LOAN") {
      return departmentFilteredProducts.filter((p) => p.patientPayableAmount > 0)
    }
    return departmentFilteredProducts
  }, [departmentFilteredProducts, statusFilter])

  // Filtered Detailed Items by Insurance Selection
  const insuranceFilteredDetailedProducts = useMemo(() => {
    if (!selectedInsuranceFilter) return statusFilteredDetailedProducts
    return statusFilteredDetailedProducts.filter((item) => {
      const insName = item.insuranceName || "Private / Cash"
      return insName.toLowerCase() === selectedInsuranceFilter.toLowerCase()
    })
  }, [statusFilteredDetailedProducts, selectedInsuranceFilter])

  // Filtered Detailed Items for Tab 2 table
  const searchFilteredDetailedProducts = useMemo(() => {
    if (!searchTerm.trim()) return insuranceFilteredDetailedProducts

    const q = searchTerm.toLowerCase()
    return insuranceFilteredDetailedProducts.filter((item) => {
      const matchesName = item.productName.toLowerCase().includes(q)
      const matchesPatient = item.patientName.toLowerCase().includes(q)
      const matchesId = (item.patientIdentifier || "").toLowerCase().includes(q)
      const matchesDept = item.departmentName.toLowerCase().includes(q)
      const matchesCode = (item.productCode || "").toLowerCase().includes(q)
      const matchesIns = (item.insuranceName || "").toLowerCase().includes(q)
      return matchesName || matchesPatient || matchesId || matchesDept || matchesCode || matchesIns
    })
  }, [insuranceFilteredDetailedProducts, searchTerm])

  // Compute Private vs Insured Patient Share breakdown for current department
  const { privateAmount, insuredPatientAmount } = useMemo(() => {
    let priv = 0
    let insPart = 0
    for (const enc of departmentFilteredEncounters) {
      const isPriv = !enc.insuranceName || enc.insuranceName.toLowerCase().includes("private") || enc.insuranceName.toLowerCase().includes("cash")
      if (isPriv) {
        priv += enc.totalPatient
      } else {
        insPart += enc.totalPatient
      }
    }
    if (priv === 0 && insPart === 0) {
      for (const prod of departmentFilteredProducts) {
        if (!prod.isBilled && !prod.isExempted) continue
        const isPriv = !prod.insuranceName || prod.insuranceName.toLowerCase().includes("private") || prod.insuranceName.toLowerCase().includes("cash")
        if (isPriv) {
          priv += prod.patientPayableAmount
        } else {
          insPart += prod.patientPayableAmount
        }
      }
    }
    return { privateAmount: priv, insuredPatientAmount: insPart }
  }, [departmentFilteredEncounters, departmentFilteredProducts])

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
    setSelectedInsuranceFilter(null)
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
      {!isTableExpanded && !financeOnly && (
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
              className={`text-[11px] py-0 px-1.5 ml-1 ${
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
              className={`text-[11px] py-0 px-1.5 ml-1 ${
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
              <p className="text-[12px] text-muted-foreground mt-1">
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
              <div className="flex items-center gap-1.5 mt-1 text-[12px] text-muted-foreground">
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
              <div className="flex items-center gap-1 mt-1 text-[12px] text-muted-foreground truncate">
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
              <p className="text-[12px] text-muted-foreground mt-1">Consultation duration</p>
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
              <p className="text-[12px] text-muted-foreground mt-1">Peak consultation volume</p>
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
          {/* Financial Overview - Clean, Restrained Tabular Layout */}
          {!isTableExpanded && (() => {
            const clinicianMoneyMade = (currentFinanceStats.insuranceCovered || 0) + (currentFinanceStats.patientCash || 0)

            const clinicianRows = currentInsuranceBreakdown.map((ins) => {
              const rawName = ins.insuranceName || "Unknown Payer"
              const isPrivate = rawName.toLowerCase().includes("private") || rawName.toLowerCase().includes("cash")
              const visitsCount = ins.count || 0
              const insuranceShare = isPrivate ? 0 : (ins.insuranceCovered || 0)
              const patientPaid = isPrivate
                ? (ins.paidAmount || ins.patientShare || ins.totalAmount || 0)
                : (ins.paidAmount || ins.patientShare || 0)
              const totalEarnings = insuranceShare + patientPaid
              const recordedWaivers = (ins.giveawayAmount || 0) + ((ins as any).waiverAmount || 0)
              const currentLoans = ins.loanAmount || 0
              const inferredWaivers = recordedWaivers === 0 && (ins.totalAmount || 0) > (totalEarnings + currentLoans)
                ? Math.max(0, (ins.totalAmount || 0) - (totalEarnings + currentLoans))
                : 0
              const giveawaysAndWaivers = recordedWaivers > 0 ? recordedWaivers : inferredWaivers
              const totalExpected = Math.round(totalEarnings + giveawaysAndWaivers + currentLoans)
              const isSelected = selectedInsuranceFilter?.toLowerCase() === rawName.toLowerCase()

              return {
                name: rawName,
                isPrivate,
                visitsCount,
                insuranceShare,
                patientPaid,
                totalEarnings,
                giveawaysAndWaivers,
                currentLoans,
                totalExpected,
                isSelected,
              }
            })

            const sumVisits = clinicianRows.reduce((acc, r) => acc + r.visitsCount, 0)
            const sumExpected = clinicianRows.reduce((acc, r) => acc + r.totalExpected, 0)

            return (
              <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground tracking-tight">Turnover Overview & Payer Breakdown</h3>
                      <Badge variant="outline" className="text-[11px] py-0 px-2 bg-primary/10 text-primary border-primary/20 font-medium">
                        Personal Financial Contribution
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Consultation fees, approved drugs, procedures, and tests attributed to your clinical service
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedInsuranceFilter && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInsuranceFilter(null)
                          setVisibleCount(INITIAL_VISIBLE_COUNT)
                        }}
                        className="h-7 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg gap-1 font-medium"
                      >
                        Reset Filter ({selectedInsuranceFilter}) ✕
                      </Button>
                    )}
                    <Badge variant="outline" className="text-xs py-1 px-2.5 bg-muted/40 font-mono">
                      {clinicianRows.length} Payers
                    </Badge>
                  </div>
                </div>

                {/* Tabular View */}
                <div className="overflow-x-auto -mx-1 sm:mx-0">
                  <table className="w-full text-xs text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="border-b border-border/70 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold bg-muted/20">
                        <th className="py-2.5 px-3 rounded-l-xl">Payer / Channel</th>
                        <th className="py-2.5 px-3 text-center">Encounters / Items</th>
                        <th className="py-2.5 px-3 text-right">Insurance Share</th>
                        <th className="py-2.5 px-3 text-right">Patient Paid</th>
                        <th className="py-2.5 px-3 text-right bg-primary/5 dark:bg-primary/10 text-primary font-bold">
                          Total Earnings (Money Made)
                        </th>
                        <th className="py-2.5 px-3 text-right">Giveaways & Waivers</th>
                        <th className="py-2.5 px-3 text-right">Current Loans</th>
                        <th className="py-2.5 px-3 text-right font-bold text-foreground rounded-r-xl">Total Expected (Gross)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {clinicianRows.map((row) => {
                        const initials = (row.name.substring(0, 2) || "PA").toUpperCase()
                        const earningsPct = clinicianMoneyMade > 0
                          ? Math.round((row.totalEarnings / clinicianMoneyMade) * 100)
                          : 0
                        return (
                          <tr
                            key={row.name}
                            onClick={() => {
                              setSelectedInsuranceFilter((prev) =>
                                prev?.toLowerCase() === row.name.toLowerCase() ? null : row.name
                              )
                              setVisibleCount(INITIAL_VISIBLE_COUNT)
                            }}
                            className={cn(
                              "hover:bg-muted/30 transition-colors group cursor-pointer",
                              row.isSelected && "bg-primary/10 border-l-4 border-l-primary"
                            )}
                            title={row.isSelected ? "Click to clear filter" : `Click to filter by ${row.name}`}
                          >
                            {/* Payer / Channel */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0",
                                  row.isPrivate
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                )}>
                                  {row.isPrivate ? "PV" : initials}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-semibold text-foreground text-xs block truncate">{row.name}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {row.isPrivate ? "Direct Patient Cash" : "Insurance Provider"}
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] py-0 px-1.5 ml-1 shrink-0 font-medium",
                                    row.isPrivate
                                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                      : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30"
                                  )}
                                >
                                  {row.isPrivate ? "Private" : "Insurance"}
                                </Badge>
                              </div>
                            </td>

                            {/* Encounters */}
                            <td className="py-3 px-3 text-center">
                              <span className="font-medium text-foreground">{row.visitsCount}</span>
                              {sumVisits > 0 && (
                                <span className="text-[10px] text-muted-foreground block">
                                  {Math.round((row.visitsCount / sumVisits) * 100)}%
                                </span>
                              )}
                            </td>

                            {/* Insurance Share */}
                            <td className="py-3 px-3 text-right">
                              {row.isPrivate ? (
                                <span className="text-muted-foreground text-xs">—</span>
                              ) : (
                                <div>
                                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                    {formatRWF(row.insuranceShare)}
                                  </span>
                                  {row.totalExpected > 0 && (
                                    <span className="text-[10px] text-muted-foreground block">
                                      {Math.round((row.insuranceShare / row.totalExpected) * 100)}% covered
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Patient Paid */}
                            <td className="py-3 px-3 text-right">
                              <div>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  {formatRWF(row.patientPaid)}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  {row.isPrivate ? "100% direct cash" : "Patient share"}
                                </span>
                              </div>
                            </td>

                            {/* Total Earnings */}
                            <td className="py-3 px-3 text-right bg-primary/5 dark:bg-primary/10">
                              <div>
                                <span className="font-bold text-foreground text-sm">
                                  {formatRWF(row.totalEarnings)}
                                </span>
                                <span className="text-[10px] text-primary font-medium block">
                                  {earningsPct}% of total
                                </span>
                              </div>
                            </td>

                            {/* Giveaways & Waivers */}
                            <td className="py-3 px-3 text-right">
                              {row.giveawaysAndWaivers > 0 ? (
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                  {formatRWF(row.giveawaysAndWaivers)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>

                            {/* Current Loans */}
                            <td className="py-3 px-3 text-right">
                              {row.currentLoans > 0 ? (
                                <div>
                                  <span className="font-bold text-rose-600 dark:text-rose-400">
                                    {formatRWF(row.currentLoans)}
                                  </span>
                                  <span className="text-[10px] text-rose-500 block">unpaid debtor</span>
                                </div>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">Settled ✓</span>
                              )}
                            </td>

                            {/* Total Expected / Gross */}
                            <td className="py-3 px-3 text-right font-bold text-foreground">
                              <span className="text-xs sm:text-sm">{formatRWF(row.totalExpected)}</span>
                            </td>

                          </tr>
                        )
                      })}

                      {clinicianRows.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-xs text-muted-foreground">
                            No billing or prescriptions found for the selected department.
                          </td>
                        </tr>
                      )}
                    </tbody>

                    {/* GRAND TOTALS FOOTER */}
                    <tfoot>
                      <tr className="border-t-2 border-border/80 bg-muted/40 font-bold text-foreground">
                        <td className="py-3.5 px-3 rounded-bl-xl">
                          <div className="flex items-center gap-2">
                            <span className="uppercase text-xs tracking-wider">Grand Total</span>
                            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                              {clinicianRows.length} Payers
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center text-xs">
                          {currentFinanceStats.productsCount > 0 ? currentFinanceStats.productsCount : sumVisits}
                        </td>
                        <td className="py-3.5 px-3 text-right text-indigo-600 dark:text-indigo-400">
                          {formatRWF(currentFinanceStats.insuranceCovered)}
                        </td>
                        <td className="py-3.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                          {formatRWF(currentFinanceStats.patientCash)}
                        </td>
                        <td className="py-3.5 px-3 text-right bg-primary/10 text-primary text-sm font-extrabold">
                          {formatRWF(clinicianMoneyMade)}
                        </td>
                        <td className="py-3.5 px-3 text-right text-purple-600 dark:text-purple-400">
                          {formatRWF(currentFinanceStats.giveawayAmount)}
                        </td>
                        <td className="py-3.5 px-3 text-right text-rose-600 dark:text-rose-400">
                          {currentFinanceStats.loanAmount > 0 ? formatRWF(currentFinanceStats.loanAmount) : "0 RWF"}
                        </td>
                        <td className="py-3.5 px-3 text-right text-sm font-extrabold text-foreground rounded-br-xl">
                          {formatRWF(currentFinanceStats.totalGross > 0 ? currentFinanceStats.totalGross : sumExpected)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Accounting Reconciliation Footnote */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-foreground">Reconciliation Formula:</span>
                    <span>Total Earnings ({formatRWF(clinicianMoneyMade)})</span>
                    <span>+ Giveaways ({formatRWF(currentFinanceStats.giveawayAmount)})</span>
                    <span>+ Loans ({formatRWF(currentFinanceStats.loanAmount)})</span>
                    <span>= <span className="font-semibold text-foreground">Total Expected ({formatRWF(currentFinanceStats.totalGross > 0 ? currentFinanceStats.totalGross : sumExpected)})</span></span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {currentFinanceStats.productsCount} items prescribed
                  </span>
                </div>
              </div>
            )
          })()}

          {/* Turnover Breakdown Table with View Switcher, Fit/Expand and Continuous Scroll */}
          <div className={cn(
            "bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl shadow-sm flex flex-col transition-all overflow-hidden p-4 sm:p-5 gap-3",
            isTableExpanded && "flex-1 min-h-0"
          )}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">Turnover & Prescriptions Breakdown</h3>
                  <Badge variant="outline" className="text-[12px] bg-muted/40 font-mono">
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

            {/* Search & Status Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, ID, product, code, insurance, or department..."
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
                    { id: "PENDING", label: `Pending (${currentFinanceStats.pendingBillingCount})` },
                    { id: "EXEMPTED", label: `Waivers (${currentFinanceStats.giveawayCount})` },
                    { id: "LOAN", label: `Loans (${currentFinanceStats.loanCount})` },
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
                                <div className="text-[11px] text-muted-foreground font-mono">
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
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className="text-[11px] py-0 px-1.5 bg-muted/40 border-border/80 font-medium"
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
                                className={`text-[11px] uppercase tracking-wider py-0 px-1.5 ${
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
                                className="text-[11px] py-0 px-1.5 bg-muted/40 border-border/80"
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
                                className={`text-[11px] uppercase tracking-wider py-0 px-1.5 ${
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
      )}
    </div>
  )
}
