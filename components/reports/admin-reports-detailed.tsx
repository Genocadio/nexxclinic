"use client"

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useLazyQuery, gql } from "@apollo/client"
import { toast } from "react-toastify"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useGenerateInvoice } from "@/hooks/billing/hooks"
import { openInvoicePreview, resolveInvoiceUrl } from "@/lib/invoice-utils"
import {
  Search,
  X,
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
  Eye,
  Printer,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react"

const GET_VISIT_BILLING_AUDIT = gql`
  query GetVisitBillingForAudit($visitId: ID!) {
    visitBilling(visitId: $visitId) {
      status
      message
      data {
        id
        departments {
          id
          status
          totalAmount
          visitDepartment {
            id
            department {
              id
              name
            }
          }
          insuranceBillings {
            id
            status
            totalAmount
            insuranceCoveredAmount
            patientPayableAmount
            paidAmount
            outstandingAmount
            patientInsurance {
              id
              insuranceCardNumber
              insuranceProvider {
                id
                insuranceName
                acronym
              }
            }
            billingDate
            invoiceUrl
          }
        }
      }
    }
  }
`

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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "BILLED" | "PENDING" | "EXEMPTED" | "LOAN">("ALL")
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [isTableExpanded, setIsTableExpanded] = useState(false)

  // Drawer & Invoice state for instant audit
  const [selectedAuditEncounter, setSelectedAuditEncounter] = useState<ClinicEncounterDetail | null>(null)
  const [previewingInvoiceKey, setPreviewingInvoiceKey] = useState<string | null>(null)
  const { generateInvoice } = useGenerateInvoice()

  const [fetchVisitBilling, { data: auditBillingData, loading: loadingAuditBilling }] = useLazyQuery(
    GET_VISIT_BILLING_AUDIT,
    { fetchPolicy: "network-only" }
  )

  useEffect(() => {
    if (selectedAuditEncounter?.visitId) {
      void fetchVisitBilling({ variables: { visitId: selectedAuditEncounter.visitId } })
    }
  }, [selectedAuditEncounter?.visitId, fetchVisitBilling])

  const auditInvoices = useMemo(() => {
    const depts = (auditBillingData?.visitBilling?.data?.departments || []) as any[]
    const list: Array<{
      id: string
      title: string
      subtitle: string
      insuranceBillingId: string
      copyType: "INSURANCE" | "PATIENT" | "PRIVATE"
      providerName: string
      cardNumber?: string
      isInsured: boolean
    }> = []

    depts.forEach((dept) => {
      const iBillings = (dept.insuranceBillings || []) as any[]
      iBillings.forEach((ib) => {
        const provider = ib.patientInsurance?.insuranceProvider
        const providerName = provider?.acronym || provider?.insuranceName || "Insurance"
        const isPrivate =
          !provider ||
          providerName.toLowerCase().includes("private") ||
          providerName.toLowerCase().includes("cash")
        const cardNumber = ib.patientInsurance?.insuranceCardNumber

        if (isPrivate) {
          list.push({
            id: `priv-${ib.id}`,
            title: "Private Invoice & Receipt",
            subtitle: `${formatRWF(ib.totalAmount)} • Cash / Direct`,
            insuranceBillingId: ib.id,
            copyType: "PRIVATE",
            providerName: "Private",
            cardNumber,
            isInsured: false,
          })
        } else {
          list.push({
            id: `ins-${ib.id}`,
            title: `${providerName} Claim (Insurer)`,
            subtitle: `Insurer: ${formatRWF(ib.insuranceCoveredAmount || Math.round(ib.totalAmount * 0.85))}`,
            insuranceBillingId: ib.id,
            copyType: "INSURANCE",
            providerName,
            cardNumber,
            isInsured: true,
          })
          list.push({
            id: `pat-${ib.id}`,
            title: `Patient Receipt (${providerName} Co-pay)`,
            subtitle: `Patient: ${formatRWF(ib.patientPayableAmount || Math.round(ib.totalAmount * 0.15))}`,
            insuranceBillingId: ib.id,
            copyType: "PATIENT",
            providerName,
            cardNumber,
            isInsured: true,
          })
        }
      })
    })

    return list
  }, [auditBillingData])

  const handleReprintInvoice = async (
    billingId: string,
    copyType?: string,
    explicitKey?: string,
  ) => {
    const key = explicitKey || `${billingId}-${copyType || "DEFAULT"}`
    setPreviewingInvoiceKey(key)
    try {
      const invoiceUrl = await resolveInvoiceUrl(billingId, generateInvoice, copyType)
      openInvoicePreview(invoiceUrl)
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate invoice")
    } finally {
      setPreviewingInvoiceKey(null)
    }
  }

  const handleReprintDeptInvoice = async (visitDeptId: string, copyType?: string) => {
    const key = `dept-${visitDeptId}-${copyType || "DEFAULT"}`
    setPreviewingInvoiceKey(key)
    try {
      const invoiceUrl = await resolveInvoiceUrl(
        visitDeptId,
        (id, opts) => generateInvoice(id, { ...opts, isVisitDepartmentId: true }),
        copyType,
      )
      openInvoicePreview(invoiceUrl)
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate invoice")
    } finally {
      setPreviewingInvoiceKey(null)
    }
  }

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

  const statusFilterLabel = useMemo(() => {
    switch (statusFilter) {
      case "BILLED":
        return "Billed"
      case "PENDING":
        return `Pending (${stats.pendingCount})`
      case "EXEMPTED":
        return `Waivers (${stats.waiverCount})`
      case "LOAN":
        return `Loans (${stats.loanCount})`
      default:
        return "All Items"
    }
  }, [statusFilter, stats])

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
    setIsTableExpanded((prev) => {
      const next = !prev
      if (next && currentTotalCount > visibleCount) {
        setVisibleCount(currentTotalCount)
      }
      return next
    })
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

  // Export Insurer Claim Bordereau (RSSB, MMI, Radiant, Sanlam, Britam, etc.)
  const handleExportClaimBordereau = () => {
    // If filtering by insurer or private, respect that; otherwise filter out pure private encounters
    const eligibleEncounters = encounters.filter((enc) => {
      const isInsured =
        enc.insuranceName &&
        !enc.insuranceName.toLowerCase().includes("private") &&
        !enc.insuranceName.toLowerCase().includes("cash")
      if (selectedInsuranceIds.length > 0) {
        return searchFilteredEncounters.some((s) => s.id === enc.id) && isInsured
      }
      return isInsured && (statusFilter === "ALL" || enc.status === statusFilter)
    })

    if (eligibleEncounters.length === 0) {
      toast.info("No insured claim records found matching the active filters to export a bordereau.")
      return
    }

    // Official Rwandan Insurer Transmission Sheet (Bordereau de transmission des factures)
    const headers = [
      "No",
      "Date_Soins",
      "No_Feuille_Soins_Voucher",
      "Nom_Assure_Principal",
      "Nom_Beneficiaire",
      "Qualite_Beneficiaire",
      "No_Affiliation_Carte",
      "Sexe",
      "Age",
      "Organisme_Assurance",
      "Departement_Service",
      "Medecin_Traitant",
      "Diagnostic_Principal_CIM11",
      "Code_Acte_Medicament",
      "Description_Prestation",
      "Quantite",
      "Prix_Unitaire_RWF",
      "Montant_Total_RWF",
      "Prise_en_Charge_Assurance_RWF",
      "Ticket_Moderateur_Patient_RWF",
      "Statut_Facture",
    ]

    const rows: Array<Array<string | number>> = []
    let rowSeq = 1

    eligibleEncounters.forEach((enc) => {
      const encDate = enc.timestamp ? enc.timestamp.slice(0, 10) : ""
      const voucherNo = enc.visitId ? enc.visitId.slice(-8).toUpperCase() : enc.id.slice(-8).toUpperCase()
      const principalName = enc.principalMemberName || enc.patientName
      const patientName = enc.patientName
      const quality = enc.isPrincipalMember ? "Assuré Principal" : "Ayoborwa / Dépendant"
      const cardNumber = enc.insuranceCardNumber || enc.patientIdentifier || "—"
      const gender = enc.gender ? (enc.gender.toUpperCase().startsWith("M") ? "M" : "F") : "—"
      const age = enc.age != null ? enc.age : "—"
      const insurer = enc.insuranceName
      const deptName = enc.departmentName
      const doctor = enc.clinicianName || "Direct Order"
      const diagnosis = enc.primaryDiagnosis || enc.primaryIcdCode || "—"
      const status = enc.status

      if (!enc.products || enc.products.length === 0) {
        rows.push([
          rowSeq++,
          `"${encDate}"`,
          `"${voucherNo}"`,
          `"${principalName.replace(/"/g, '""')}"`,
          `"${patientName.replace(/"/g, '""')}"`,
          `"${quality}"`,
          `"${cardNumber.replace(/"/g, '""')}"`,
          `"${gender}"`,
          age,
          `"${insurer.replace(/"/g, '""')}"`,
          `"${deptName.replace(/"/g, '""')}"`,
          `"${doctor.replace(/"/g, '""')}"`,
          `"${diagnosis.replace(/"/g, '""')}"`,
          `"ACT-GEN"`,
          `"Consultation / Service Médical"`,
          1,
          enc.totalGross,
          enc.totalGross,
          enc.totalInsurance,
          enc.totalPatient,
          `"${status}"`,
        ])
      } else {
        enc.products.forEach((prod) => {
          const itemCode = prod.code || "ACT-001"
          const itemName = prod.name
          const qty = prod.quantity
          const unitPrice = prod.unitPrice
          const lineTotal = prod.lineTotal
          const insShare = prod.insuranceCovered
          const patShare = prod.patientShare

          rows.push([
            rowSeq++,
            `"${encDate}"`,
            `"${voucherNo}"`,
            `"${principalName.replace(/"/g, '""')}"`,
            `"${patientName.replace(/"/g, '""')}"`,
            `"${quality}"`,
            `"${cardNumber.replace(/"/g, '""')}"`,
            `"${gender}"`,
            age,
            `"${insurer.replace(/"/g, '""')}"`,
            `"${deptName.replace(/"/g, '""')}"`,
            `"${doctor.replace(/"/g, '""')}"`,
            `"${diagnosis.replace(/"/g, '""')}"`,
            `"${itemCode.replace(/"/g, '""')}"`,
            `"${itemName.replace(/"/g, '""')}"`,
            qty,
            unitPrice,
            lineTotal,
            insShare,
            patShare,
            `"${status}"`,
          ])
        })
      }
    })

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    const insurerPrefix = focusedInsuranceLabel
      ? focusedInsuranceLabel.replace(/[^a-zA-Z0-9]/g, "_")
      : "RSSB_MMI_Insurers"
    link.setAttribute(
      "download",
      `Bordereau_Transmission_${insurerPrefix}_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Exported claim bordereau sheet (${rows.length} claim lines)`)
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
      <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl shadow-sm flex flex-col transition-all overflow-hidden p-3.5 sm:p-4 gap-2.5 sm:gap-3">
        {/* Single-Row Unified Toolbar: Title + Search (Expandable) + Grouping + Status Dropdown + Actions */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full min-w-0">
          {/* Title & Badge (collapsed on mobile if search expanded) */}
          <div className={cn("flex items-center gap-1.5 sm:gap-2 min-w-0", (isSearchExpanded || searchTerm) && "hidden md:flex")}>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground truncate">
              Encounter Breakdown
            </h3>
            <Badge variant="outline" className="text-[11px] sm:text-[12px] bg-muted/40 font-mono shrink-0">
              {financeViewMode === "grouped"
                ? `${searchFilteredEncounters.length} Encounters`
                : `${searchFilteredDetailedProducts.length} Items`}
            </Badge>
          </div>

          {/* Action & Filter Controls (stays strictly on one line) */}
          <div className={cn(
            "flex items-center gap-1 sm:gap-1.5 shrink-0",
            (isSearchExpanded || searchTerm) && "flex-1 md:flex-initial justify-end min-w-0"
          )}>
            {/* Expandable Inline Search Control */}
            {isSearchExpanded || searchTerm ? (
              <div className="relative flex items-center transition-all duration-200 ease-in-out flex-1 md:w-56 lg:w-64 min-w-0 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  autoFocus
                  placeholder={
                    financeViewMode === "grouped"
                      ? "Search patient, clinician, dept..."
                      : "Search product, code, patient..."
                  }
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchTerm("")
                      setIsSearchExpanded(false)
                    }
                  }}
                  onBlur={() => {
                    if (!searchTerm.trim()) {
                      setIsSearchExpanded(false)
                    }
                  }}
                  className="pl-8 pr-7 h-8 text-xs rounded-xl bg-background/80 border-border/70 w-full focus-visible:ring-1"
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSearchTerm("")
                    setIsSearchExpanded(false)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
                  title="Close search"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsSearchExpanded(true)
                        setTimeout(() => searchInputRef.current?.focus(), 50)
                      }}
                      className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted/80 shrink-0 cursor-pointer"
                      aria-label="Search encounters"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Search encounters, items or codes</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Grouping Mode Switcher (Icon-only on small screen, hidden on mobile if search expanded) */}
            <div className={cn(
              "flex items-center p-0.5 sm:p-1 rounded-xl bg-muted/60 border border-border/70 shrink-0",
              (isSearchExpanded || searchTerm) && "hidden md:flex"
            )}>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setFinanceViewMode("grouped")
                        setVisibleCount(INITIAL_VISIBLE_COUNT)
                      }}
                      className={cn(
                        "h-7 px-1.5 sm:px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        financeViewMode === "grouped"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label="Group by Encounter"
                    >
                      <Layers className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden md:inline">Encounters</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Group by Encounter (Visits)</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setFinanceViewMode("detailed")
                        setVisibleCount(INITIAL_VISIBLE_COUNT)
                      }}
                      className={cn(
                        "h-7 px-1.5 sm:px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        financeViewMode === "detailed"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label="All Line Items"
                    >
                      <ListFilter className="h-3.5 w-3.5 shrink-0" />
                      <span className="hidden md:inline">Line Items</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">All Prescribed Line Items</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Status Filter Dropdown Menu (Hides on mobile if search expanded) */}
            <div className={cn((isSearchExpanded || searchTerm) && "hidden md:flex")}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={statusFilter !== "ALL" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 px-2 sm:px-2.5 rounded-xl text-xs gap-1 sm:gap-1.5 font-medium shrink-0 cursor-pointer",
                      statusFilter !== "ALL"
                        ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                        : "border-border/80 text-foreground hover:bg-muted/80"
                    )}
                    aria-label={`Status: ${statusFilterLabel}`}
                  >
                    <Receipt className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline truncate max-w-[90px]">{statusFilterLabel}</span>
                    <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0 hidden sm:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border border-border/80 bg-card/95 backdrop-blur-xl z-50">
                  <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1">
                    Filter by Status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 bg-border/50" />
                  {[
                    { id: "ALL", label: "All Items" },
                    { id: "BILLED", label: "Billed" },
                    { id: "PENDING", label: "Pending", count: stats.pendingCount },
                    { id: "EXEMPTED", label: "Waivers", count: stats.waiverCount },
                    { id: "LOAN", label: "Loans", count: stats.loanCount },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => {
                        setStatusFilter(item.id as any)
                        setVisibleCount(INITIAL_VISIBLE_COUNT)
                      }}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-xs rounded-lg cursor-pointer",
                        statusFilter === item.id && "bg-primary/10 text-primary font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {statusFilter === item.id ? (
                          <Check className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <span className="w-3.5" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono font-normal">
                          {item.count}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Claim Bordereau Export - icon only (Hides on mobile if search expanded) */}
            <div className={cn((isSearchExpanded || searchTerm) && "hidden md:flex")}>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleExportClaimBordereau}
                      className="h-8 w-8 rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 shrink-0 shadow-2xs transition-all cursor-pointer"
                      aria-label="Export Claim Bordereau"
                    >
                      <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Export Claim Bordereau</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* CSV Export - icon only (Hides on mobile if search expanded) */}
            <div className={cn((isSearchExpanded || searchTerm) && "hidden md:flex")}>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleExportCSV}
                      className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted/80 shrink-0 cursor-pointer"
                      aria-label="Export CSV"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Export CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Expand / Fit Table - icon only */}
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTableExpand}
                    className="h-8 w-8 rounded-xl border-border/80 text-foreground hover:bg-muted/80 shrink-0 cursor-pointer"
                    aria-label={isTableExpanded ? "Fit normal view" : "Expand table full screen"}
                  >
                    {isTableExpanded ? (
                      <Minimize2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Maximize2 className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isTableExpanded ? "Collapse Table" : "Expand Table (Show All Rows)"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <div className="flex flex-col gap-2">
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
                  "overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  isTableExpanded ? "max-h-none overflow-y-visible" : "max-h-[520px] min-h-[320px] overflow-y-auto"
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
                      <th className="py-2.5 px-3 text-center whitespace-nowrap bg-muted/80 backdrop-blur-xl">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-foreground">
                    {visibleEncounters.map((enc) => (
                      <tr
                        key={enc.id}
                        onClick={() => setSelectedAuditEncounter(enc)}
                        className="hover:bg-primary/5 cursor-pointer transition-colors align-top group"
                      >
                        <td className="py-2.5 px-3.5 font-mono text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(enc.timestamp)}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{enc.patientName}</div>
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
                        <td className="py-2.5 px-3.5 text-right font-bold text-foreground whitespace-nowrap font-mono">
                          {formatRWF(enc.totalGross)}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap font-mono">
                          {enc.totalInsurance > 0 ? formatRWF(enc.totalInsurance) : "—"}
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap font-mono">
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
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedAuditEncounter(enc)
                            }}
                            className="h-7 px-2 text-[11px] rounded-lg gap-1 text-primary hover:bg-primary/10 font-medium cursor-pointer"
                            title="Open Audit & Invoice Drawer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden xl:inline">Audit</span>
                          </Button>
                        </td>
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
                            <td className="py-2.5 px-3 text-center">
                              <Skeleton className="h-6 w-12 rounded-lg mx-auto" />
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
              <div className="flex items-center justify-between gap-2 pt-2 px-1 text-xs text-muted-foreground shrink-0 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span>Showing</span>
                  <span className="font-semibold text-foreground">{visibleEncounters.length}</span>
                  <span>of</span>
                  <span className="font-semibold text-foreground">{searchFilteredEncounters.length}</span>
                  <span className="hidden sm:inline">encounters</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
          <div className="flex flex-col gap-2">
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
                  "overflow-x-auto rounded-xl border border-border/60 transition-all relative scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  isTableExpanded ? "max-h-none overflow-y-visible" : "max-h-[520px] min-h-[320px] overflow-y-auto"
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
                      <th className="py-2.5 px-3 text-center whitespace-nowrap bg-muted/80 backdrop-blur-xl">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-foreground">
                    {visibleDetailedProducts.map((item) => {
                      const parentEnc = encounters.find((e) => e.visitId === item.visitId)
                      return (
                        <tr
                          key={item.id}
                          onClick={() => {
                            if (parentEnc) setSelectedAuditEncounter(parentEnc)
                          }}
                          className="hover:bg-primary/5 cursor-pointer transition-colors group"
                        >
                          <td className="py-2.5 px-3.5 font-mono text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(item.timestamp)}
                          </td>
                          <td className="py-2.5 px-3.5 font-semibold text-foreground">
                            <span className="group-hover:text-primary transition-colors">{item.productName}</span>
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
                          <td className="py-2.5 px-3.5 text-center font-bold text-primary font-mono">{item.quantity}</td>
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
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (parentEnc) {
                                  setSelectedAuditEncounter(parentEnc)
                                } else {
                                  toast.info("Encounter details loading...")
                                }
                              }}
                              className="h-7 px-2 text-[11px] rounded-lg gap-1 text-primary hover:bg-primary/10 font-medium cursor-pointer"
                              title="Open Audit & Invoice Drawer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden xl:inline">Audit</span>
                            </Button>
                          </td>
                        </tr>
                      )
                    })}

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
                            <td className="py-2.5 px-3 text-center">
                              <Skeleton className="h-6 w-12 rounded-lg mx-auto" />
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
              <div className="flex items-center justify-between gap-2 pt-2 px-1 text-xs text-muted-foreground shrink-0 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span>Showing</span>
                  <span className="font-semibold text-foreground">{visibleDetailedProducts.length}</span>
                  <span>of</span>
                  <span className="font-semibold text-foreground">{searchFilteredDetailedProducts.length}</span>
                  <span className="hidden sm:inline">items</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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

      {/* Slide-over Audit & Invoice Drawer (Feature B) */}
      <Sheet
        open={!!selectedAuditEncounter}
        onOpenChange={(open) => !open && setSelectedAuditEncounter(null)}
      >
        <SheetContent
          side="right"
          className="sm:max-w-xl md:max-w-2xl w-full p-0 flex flex-col gap-0 border-l border-border bg-background shadow-2xl"
        >
          {selectedAuditEncounter && (
            <>
              {/* Header */}
              <div className="p-5 border-b border-border/70 bg-muted/30 flex flex-col gap-2.5 shrink-0">
                <SheetHeader className="p-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                          <span>{selectedAuditEncounter.patientName}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase font-semibold py-0 px-1.5",
                              selectedAuditEncounter.status === "BILLED" || selectedAuditEncounter.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            )}
                          >
                            {selectedAuditEncounter.status}
                          </Badge>
                        </SheetTitle>
                        <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span className="font-mono">
                            ID: {selectedAuditEncounter.patientIdentifier || selectedAuditEncounter.patientId.slice(0, 8)}
                          </span>
                          {selectedAuditEncounter.gender && (
                            <>
                              <span>•</span>
                              <span>{selectedAuditEncounter.gender}</span>
                            </>
                          )}
                          {selectedAuditEncounter.age != null && (
                            <>
                              <span>•</span>
                              <span>{selectedAuditEncounter.age} yrs</span>
                            </>
                          )}
                        </SheetDescription>
                      </div>
                    </div>

                    <a
                      href={`/visits/manage?visitId=${selectedAuditEncounter.visitId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/10 hover:bg-primary/15 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 mr-6"
                      title="Open full visit in new tab"
                    >
                      <span>Manage Visit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </SheetHeader>

                {/* Metadata badges row */}
                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                  <div className="flex items-center gap-1 text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/60">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{formatTimestamp(selectedAuditEncounter.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/60">
                    <Building2 className="h-3 w-3 text-primary" />
                    <span>{selectedAuditEncounter.departmentName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/60">
                    <Stethoscope className="h-3 w-3 text-primary" />
                    <span>{selectedAuditEncounter.clinicianName || "Direct Order"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/60">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="font-medium text-foreground">{selectedAuditEncounter.insuranceName}</span>
                    {selectedAuditEncounter.insuranceCardNumber && (
                      <span className="font-mono text-[11px] text-muted-foreground">
                        ({selectedAuditEncounter.insuranceCardNumber})
                      </span>
                    )}
                  </div>
                </div>

                {/* Diagnosis ribbon if present */}
                {(selectedAuditEncounter.primaryDiagnosis || (selectedAuditEncounter.diagnostics && selectedAuditEncounter.diagnostics.length > 0)) && (
                  <div className="text-xs bg-primary/5 border border-primary/20 rounded-lg p-2 text-foreground flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-primary">Diagnosis:</span>
                    <span>
                      {selectedAuditEncounter.primaryDiagnosis ||
                        selectedAuditEncounter.diagnostics?.map((d) => d.icd11Code ? `${d.diagnosisName} (${d.icd11Code})` : d.diagnosisName).join("; ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Financial summary stats */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Financial Summary
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                      <span className="text-[11px] text-muted-foreground block">Gross Total</span>
                      <span className="text-sm font-bold text-foreground font-mono">
                        {formatRWF(selectedAuditEncounter.totalGross)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 block">Insurer Share</span>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300 font-mono">
                        {formatRWF(selectedAuditEncounter.totalInsurance)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block">Patient Co-Pay</span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                        {formatRWF(selectedAuditEncounter.totalPatient)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
                      <span className="text-[11px] text-muted-foreground block">Cash Collected</span>
                      <span className="text-sm font-bold text-foreground font-mono">
                        {formatRWF(selectedAuditEncounter.patientPaid || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itemized prescribed products & acts table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Itemized Acts & Prescriptions ({selectedAuditEncounter.products.length})
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {selectedAuditEncounter.products.length} line item(s)
                    </span>
                  </div>

                  {selectedAuditEncounter.products.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                      No individual itemized acts recorded for this encounter.
                    </div>
                  ) : (
                    <div className="border border-border/70 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/60 border-b border-border/70 font-semibold text-muted-foreground">
                          <tr>
                            <th className="py-2 px-3 text-left">Item Description</th>
                            <th className="py-2 px-2 text-center">Qty</th>
                            <th className="py-2 px-2.5 text-right">Unit Price</th>
                            <th className="py-2 px-2.5 text-right">Line Total</th>
                            <th className="py-2 px-2.5 text-right">Insurer</th>
                            <th className="py-2 px-2.5 text-right">Patient</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 text-foreground">
                          {selectedAuditEncounter.products.map((p, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                              <td className="py-2 px-3">
                                <div className="font-medium text-foreground">{p.name}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {p.code && (
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                      {p.code}
                                    </span>
                                  )}
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono uppercase bg-muted/40">
                                    {p.type || "ACT"}
                                  </Badge>
                                  {p.status && p.status !== "BILLED" && (
                                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-amber-600 border-amber-500/30">
                                      {p.status}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-center font-bold text-primary font-mono">{p.quantity}</td>
                              <td className="py-2 px-2.5 text-right font-mono text-muted-foreground">{formatRWF(p.unitPrice)}</td>
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-foreground">{formatRWF(p.lineTotal)}</td>
                              <td className="py-2 px-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                                {p.insuranceCovered > 0 ? formatRWF(p.insuranceCovered) : "—"}
                              </td>
                              <td className="py-2 px-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                {formatRWF(p.patientShare)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Linked Payments & Recorded MoMo / Card Transaction Codes */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Linked Payments & Transaction Codes</span>
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                  </h4>

                  {selectedAuditEncounter.payments && selectedAuditEncounter.payments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAuditEncounter.payments.map((pm, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-border/70 bg-card/60 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                              <CreditCard className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <span>{pm.paymentMethod || pm.rawMethod || "Payment"}</span>
                                {pm.reference && (
                                  <Badge variant="outline" className="font-mono text-[10px] bg-primary/5 text-primary border-primary/20">
                                    Ref: {pm.reference}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                {pm.createdAt ? formatTimestamp(pm.createdAt) : "Recorded Transaction"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                              {formatRWF(pm.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-dashed border-border/80 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        No direct cashier cash/MoMo transaction receipt captured on this encounter row yet. (Patient Share: {formatRWF(selectedAuditEncounter.totalPatient)})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer: 1-Click Reprint Receipt / Invoice */}
              <div className="p-4 border-t border-border/70 bg-muted/40 flex flex-col gap-2.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Printer className="h-3.5 w-3.5 text-primary" />
                    1-Click Reprint / Preview Invoices & Receipts
                  </span>
                  {loadingAuditBilling && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Checking billing records...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {auditInvoices.length > 0 ? (
                    auditInvoices.map((inv) => (
                      <Button
                        key={inv.id}
                        variant="outline"
                        size="sm"
                        disabled={previewingInvoiceKey !== null}
                        onClick={() => handleReprintInvoice(inv.insuranceBillingId, inv.copyType, inv.id)}
                        className="h-8 px-3 text-xs rounded-xl font-medium gap-1.5 bg-card hover:bg-muted border-border cursor-pointer shadow-xs"
                      >
                        {previewingInvoiceKey === inv.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        ) : inv.isInsured ? (
                          inv.copyType === "INSURANCE" ? (
                            <Shield className="h-3.5 w-3.5 text-blue-500" />
                          ) : (
                            <Receipt className="h-3.5 w-3.5 text-emerald-500" />
                          )
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span>{inv.title}</span>
                      </Button>
                    ))
                  ) : (
                    /* Fallback direct reprint options */
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={previewingInvoiceKey !== null}
                        onClick={() => handleReprintDeptInvoice(selectedAuditEncounter.visitDepartmentId, "INSURANCE")}
                        className="h-8 px-3 text-xs rounded-xl font-medium gap-1.5 bg-card hover:bg-muted border-border cursor-pointer"
                      >
                        {previewingInvoiceKey === `dept-${selectedAuditEncounter.visitDepartmentId}-INSURANCE` ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        ) : (
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                        )}
                        <span>Reprint Insurer Claim</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={previewingInvoiceKey !== null}
                        onClick={() => handleReprintDeptInvoice(selectedAuditEncounter.visitDepartmentId, "PATIENT")}
                        className="h-8 px-3 text-xs rounded-xl font-medium gap-1.5 bg-card hover:bg-muted border-border cursor-pointer"
                      >
                        {previewingInvoiceKey === `dept-${selectedAuditEncounter.visitDepartmentId}-PATIENT` ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        ) : (
                          <Receipt className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                        <span>Reprint Patient Receipt</span>
                      </Button>

                      {selectedAuditEncounter.invoiceUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInvoicePreview(selectedAuditEncounter.invoiceUrl!)}
                          className="h-8 px-3 text-xs rounded-xl font-medium gap-1.5 bg-card hover:bg-muted border-border cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-primary" />
                          <span>View Stored Invoice</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
