"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
  Activity,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Pill,
  Download,
  Filter,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  X,
  FolderPlus,
  FolderOpen,
  Calendar,
  User,
  Eye,
  ChevronDown,
  ChevronRight,
  Hash,
  Building2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ClinicReportsData, ClinicDiagnosticRecord } from "@/hooks/reports/use-clinic-reports"

export interface AgeBracketConfig {
  id: string
  label: string
  minAge: number
  maxAge: number
}

export interface DiseaseGroupConfig {
  id: string
  groupName: string
  /** Matched identifiers: ICD-11 code (lowercase/trimmed) if present, or diseaseName (lowercase/trimmed) */
  itemKeys: string[]
  /** Display label for grouped items */
  itemsSummary: string[]
}

const DEFAULT_AGE_BRACKETS: AgeBracketConfig[] = [
  { id: "b1", label: "0-19 yrs", minAge: 0, maxAge: 19 },
  { id: "b2", label: "20-39 yrs", minAge: 20, maxAge: 39 },
  { id: "b3", label: "40+ yrs", minAge: 40, maxAge: 150 },
]

const LOCAL_STORAGE_GROUPS_KEY = "nexxclinic_diagnostic_report_disease_groups_v1"

interface AdminReportsDiagnosticsProps {
  data: ClinicReportsData
}

export function AdminReportsDiagnostics({ data }: AdminReportsDiagnosticsProps) {
  // Retrieve diagnostic records from either top-level or deepReports
  const rawRecords: ClinicDiagnosticRecord[] = useMemo(() => {
    return (
      data.diagnosticReports ||
      data.deepReports?.diagnosticReports ||
      []
    )
  }, [data])

  // Local state for UI controls
  const [diagnosisTypeFilter, setDiagnosisTypeFilter] = useState<"FINAL_ONLY" | "ALL">("FINAL_ONLY")
  const [groupByVisit, setGroupByVisit] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSymptoms, setShowSymptoms] = useState(false)
  const [showMedications, setShowMedications] = useState(false)
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set())
  const [selectedVisitDetails, setSelectedVisitDetails] = useState<{
    visitId: string
    patientName: string
    patientIdentifier?: string
    patientGender?: string
    patientAge?: number | null
    departmentName: string
    clinicianName: string
    date: string
    records: ClinicDiagnosticRecord[]
  } | null>(null)

  // Disease Groups State
  const [diseaseGroups, setDiseaseGroups] = useState<DiseaseGroupConfig[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_GROUPS_KEY)
        if (saved) return JSON.parse(saved)
      } catch (e) {
        console.error("Failed to parse disease groups from local storage", e)
      }
    }
    return []
  })

  // Persist disease groups
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_GROUPS_KEY, JSON.stringify(diseaseGroups))
      } catch (e) {
        console.error("Failed to save disease groups to local storage", e)
      }
    }
  }, [diseaseGroups])

  // Selection state for grouping: set of canonical keys (ICD-11 code if exists, else lowercase name)
  const [selectedItemKeys, setSelectedItemKeys] = useState<Set<string>>(new Set())

  // Modal for creating a group from selection
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")

  // Modal for managing existing groups
  const [isManageGroupsModalOpen, setIsManageGroupsModalOpen] = useState(false)

  // Configurable Age Brackets
  const [ageBrackets, setAgeBrackets] = useState<AgeBracketConfig[]>(DEFAULT_AGE_BRACKETS)
  const [isAgeDialogOpen, setIsAgeDialogOpen] = useState(false)
  const [tempBrackets, setTempBrackets] = useState<AgeBracketConfig[]>(DEFAULT_AGE_BRACKETS)

  // Open Age Bracket Modal helper
  const handleOpenBracketModal = () => {
    setTempBrackets(JSON.parse(JSON.stringify(ageBrackets)))
    setIsAgeDialogOpen(true)
  }

  // Save Age Bracket Modal helper
  const handleSaveBrackets = () => {
    const valid = tempBrackets.filter(
      (b) => b.label.trim() && !isNaN(b.minAge) && !isNaN(b.maxAge) && b.minAge <= b.maxAge
    )
    if (valid.length > 0) {
      setAgeBrackets(valid)
    }
    setIsAgeDialogOpen(false)
  }

  const handleResetDefaultBrackets = () => {
    setTempBrackets(DEFAULT_AGE_BRACKETS)
  }

  const handleAddBracket = () => {
    const last = tempBrackets[tempBrackets.length - 1]
    const nextMin = last ? last.maxAge + 1 : 0
    const nextMax = nextMin + 19
    const newId = `b-${Date.now()}`
    setTempBrackets([
      ...tempBrackets,
      {
        id: newId,
        label: `${nextMin}-${nextMax} yrs`,
        minAge: nextMin,
        maxAge: nextMax,
      },
    ])
  }

  const handleRemoveBracket = (id: string) => {
    if (tempBrackets.length <= 1) return
    setTempBrackets(tempBrackets.filter((b) => b.id !== id))
  }

  const handleUpdateBracket = (
    id: string,
    field: "label" | "minAge" | "maxAge",
    value: string | number
  ) => {
    setTempBrackets(
      tempBrackets.map((b) => {
        if (b.id !== id) return b
        return {
          ...b,
          [field]: field === "label" ? String(value) : Number(value),
        }
      })
    )
  }

  // Filter raw records based on diagnosis type
  const filteredRecords = useMemo(() => {
    return rawRecords.filter((rec) => {
      if (diagnosisTypeFilter === "FINAL_ONLY") {
        const t = (rec.type || "").toUpperCase()
        if (t !== "FINAL") return false
      }
      return true
    })
  }, [rawRecords, diagnosisTypeFilter])

  // Helper to compute canonical identity key for a diagnostic record
  // "this is compared by icd11 code if none name be used"
  const getRecordCanonicalKey = (record: { icd11Code?: string; diagnosisName: string }) => {
    const code = record.icd11Code ? record.icd11Code.trim().toLowerCase() : ""
    if (code) return `icd:${code}`
    return `name:${record.diagnosisName.trim().toLowerCase()}`
  }

  // Fast lookup from canonical key to group (if belongs to any group)
  const keyToGroupMap = useMemo(() => {
    const map = new Map<string, DiseaseGroupConfig>()
    diseaseGroups.forEach((group) => {
      group.itemKeys.forEach((k) => {
        map.set(k.toLowerCase(), group)
      })
    })
    return map
  }, [diseaseGroups])

  // Aggregate into Disease / Condition rows with group merging
  const aggregatedData = useMemo(() => {
    interface DiseaseRow {
      rowKey: string
      isGroup: boolean
      groupId?: string
      diseaseName: string
      icd11Code?: string
      subDiseases?: string[]
      canonicalKeys: string[]
      counts: Record<string, number>
      totalCases: number
      symptomsSet: Set<string>
      medicationsSet: Set<string>
    }

    const map = new Map<string, DiseaseRow>()

    filteredRecords.forEach((record) => {
      const name = record.diagnosisName.trim()
      if (!name) return

      const canonKey = getRecordCanonicalKey(record)
      const matchingGroup = keyToGroupMap.get(canonKey)

      let targetKey: string
      let isGroup = false
      let displayName: string
      let displayCode: string | undefined

      if (matchingGroup) {
        // Belongs to a group -> aggregate together under group!
        targetKey = `group:${matchingGroup.id}`
        isGroup = true
        displayName = matchingGroup.groupName
        displayCode = undefined
      } else {
        // Individual condition
        targetKey = canonKey
        isGroup = false
        displayName = name
        displayCode = record.icd11Code ? record.icd11Code.trim() : undefined
      }

      if (!map.has(targetKey)) {
        map.set(targetKey, {
          rowKey: targetKey,
          isGroup,
          groupId: matchingGroup?.id,
          diseaseName: displayName,
          icd11Code: displayCode,
          subDiseases: isGroup ? [] : undefined,
          canonicalKeys: isGroup ? [...matchingGroup!.itemKeys] : [canonKey],
          counts: {},
          totalCases: 0,
          symptomsSet: new Set(),
          medicationsSet: new Set(),
        })
      }

      const row = map.get(targetKey)!
      row.totalCases += 1
      if (!row.icd11Code && record.icd11Code && !isGroup) {
        row.icd11Code = record.icd11Code.trim()
      }

      if (isGroup && row.subDiseases && !row.subDiseases.includes(name)) {
        row.subDiseases.push(name)
      }

      // Track symptoms & medications
      if (record.symptoms && Array.isArray(record.symptoms)) {
        record.symptoms.forEach((s) => {
          if (s && s.trim()) row.symptomsSet.add(s.trim())
        })
      }
      if (record.medications && Array.isArray(record.medications)) {
        record.medications.forEach((m) => {
          if (m && m.trim()) row.medicationsSet.add(m.trim())
        })
      }

      // Demographic distribution
      const rawGender = (record.patientGender || "").toUpperCase()
      const isMale = rawGender === "MALE" || rawGender === "M"
      const isFemale = rawGender === "FEMALE" || rawGender === "F"
      const genderKey = isMale ? "M" : isFemale ? "F" : "OTHER"

      const age = record.patientAge

      // Match against brackets
      if (age !== null && age !== undefined && !isNaN(age)) {
        const bracket = ageBrackets.find((b) => age >= b.minAge && age <= b.maxAge)
        if (bracket) {
          const countKey = `${bracket.id}_${genderKey}`
          row.counts[countKey] = (row.counts[countKey] || 0) + 1
        }
      }
    })

    const rows = Array.from(map.values())
    // Sort descending by totalCases
    rows.sort((a, b) => b.totalCases - a.totalCases)
    return rows
  }, [filteredRecords, ageBrackets, keyToGroupMap])

  // Filter aggregated rows by search query
  const searchedRows = useMemo(() => {
    if (!searchQuery.trim()) return aggregatedData
    const q = searchQuery.toLowerCase()
    return aggregatedData.filter((r) => {
      if (r.diseaseName.toLowerCase().includes(q)) return true
      if (r.icd11Code && r.icd11Code.toLowerCase().includes(q)) return true
      if (r.subDiseases && r.subDiseases.some((sub) => sub.toLowerCase().includes(q))) return true
      return false
    })
  }, [aggregatedData, searchQuery])

  // Group filteredRecords by visit
  const visitsGroupedData = useMemo(() => {
    interface VisitGroup {
      visitId: string
      date: string
      patientId: string
      patientName: string
      patientIdentifier?: string
      patientGender?: string
      patientAge?: number | null
      departmentName: string
      clinicianName: string
      records: ClinicDiagnosticRecord[]
      symptomsSet: Set<string>
      medicationsSet: Set<string>
      diseaseSummaries: Array<{
        name: string
        icd11Code?: string
        type: string
        isGroup: boolean
        groupName?: string
      }>
    }

    const map = new Map<string, VisitGroup>()

    filteredRecords.forEach((record) => {
      // Determine visit key: record.visitId, or fallback to patientId-date
      const vKey = record.visitId && record.visitId.trim()
        ? record.visitId.trim()
        : `${record.patientId || "pat"}_${record.date || "date"}`

      if (!map.has(vKey)) {
        map.set(vKey, {
          visitId: vKey,
          date: record.date || "",
          patientId: record.patientId || "",
          patientName: record.patientName || "Unknown Patient",
          patientIdentifier: record.patientIdentifier,
          patientGender: record.patientGender,
          patientAge: record.patientAge,
          departmentName: record.departmentName || "General",
          clinicianName: record.clinicianName || "Unknown Clinician",
          records: [],
          symptomsSet: new Set(),
          medicationsSet: new Set(),
          diseaseSummaries: [],
        })
      }

      const grp = map.get(vKey)!
      grp.records.push(record)

      // Collect symptoms and medications
      if (record.symptoms && Array.isArray(record.symptoms)) {
        record.symptoms.forEach((s) => {
          if (s && s.trim()) grp.symptomsSet.add(s.trim())
        })
      }
      if (record.medications && Array.isArray(record.medications)) {
        record.medications.forEach((m) => {
          if (m && m.trim()) grp.medicationsSet.add(m.trim())
        })
      }

      // Disease summary
      const canonKey = getRecordCanonicalKey(record)
      const matchingGroup = keyToGroupMap.get(canonKey)
      grp.diseaseSummaries.push({
        name: record.diagnosisName,
        icd11Code: record.icd11Code,
        type: record.type,
        isGroup: !!matchingGroup,
        groupName: matchingGroup?.groupName,
      })
    })

    const groups = Array.from(map.values())
    // Sort descending by date
    groups.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    return groups
  }, [filteredRecords, keyToGroupMap])

  // Filter visit groups by search query
  const searchedVisitGroups = useMemo(() => {
    if (!searchQuery.trim()) return visitsGroupedData
    const q = searchQuery.toLowerCase()
    return visitsGroupedData.filter((vg) => {
      if (vg.patientName.toLowerCase().includes(q)) return true
      if (vg.patientIdentifier && vg.patientIdentifier.toLowerCase().includes(q)) return true
      if (vg.clinicianName.toLowerCase().includes(q)) return true
      if (vg.departmentName.toLowerCase().includes(q)) return true
      if (vg.diseaseSummaries.some((d) => d.name.toLowerCase().includes(q) || (d.icd11Code && d.icd11Code.toLowerCase().includes(q)) || (d.groupName && d.groupName.toLowerCase().includes(q)))) return true
      if (Array.from(vg.symptomsSet).some((s) => s.toLowerCase().includes(q))) return true
      if (Array.from(vg.medicationsSet).some((m) => m.toLowerCase().includes(q))) return true
      return false
    })
  }, [visitsGroupedData, searchQuery])

  // Toggle single visit expand/collapse
  const handleToggleVisitExpand = (vKey: string) => {
    const next = new Set(expandedVisits)
    if (next.has(vKey)) {
      next.delete(vKey)
    } else {
      next.add(vKey)
    }
    setExpandedVisits(next)
  }

  // Column totals across all filtered rows
  const columnTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    let grandTotal = 0

    searchedRows.forEach((row) => {
      grandTotal += row.totalCases
      ageBrackets.forEach((bracket) => {
        const mKey = `${bracket.id}_M`
        const fKey = `${bracket.id}_F`
        totals[mKey] = (totals[mKey] || 0) + (row.counts[mKey] || 0)
        totals[fKey] = (totals[fKey] || 0) + (row.counts[fKey] || 0)
      })
    })

    return { totals, grandTotal }
  }, [searchedRows, ageBrackets])

  // Toggle selection of a row for grouping
  const handleToggleRowSelect = (rowKey: string) => {
    const next = new Set(selectedItemKeys)
    if (next.has(rowKey)) {
      next.delete(rowKey)
    } else {
      next.add(rowKey)
    }
    setSelectedItemKeys(next)
  }

  // Clear / Drop all current selections
  const handleDropSelection = () => {
    setSelectedItemKeys(new Set())
  }

  // Select all currently visible non-group rows
  const handleSelectAllVisible = () => {
    const nonGroupKeys = searchedRows.filter((r) => !r.isGroup).map((r) => r.rowKey)
    const allSelected = nonGroupKeys.every((k) => selectedItemKeys.has(k))
    if (allSelected) {
      handleDropSelection()
    } else {
      const next = new Set(selectedItemKeys)
      nonGroupKeys.forEach((k) => next.add(k))
      setSelectedItemKeys(next)
    }
  }

  // Create Group from current selection
  const handleOpenCreateGroup = () => {
    if (selectedItemKeys.size < 2) return
    setNewGroupName("")
    setIsCreateGroupModalOpen(true)
  }

  const handleConfirmCreateGroup = () => {
    const name = newGroupName.trim()
    if (!name || selectedItemKeys.size === 0) return

    // Collect all canonical keys and names from selected rows
    const keysToAdd: string[] = []
    const summaryLabels: string[] = []

    selectedItemKeys.forEach((key) => {
      const targetRow = aggregatedData.find((r) => r.rowKey === key)
      if (targetRow) {
        keysToAdd.push(...targetRow.canonicalKeys)
        summaryLabels.push(targetRow.diseaseName)
      } else {
        keysToAdd.push(key)
      }
    })

    const newGroup: DiseaseGroupConfig = {
      id: `group-${Date.now()}`,
      groupName: name,
      itemKeys: Array.from(new Set(keysToAdd)),
      itemsSummary: Array.from(new Set(summaryLabels)),
    }

    setDiseaseGroups([...diseaseGroups, newGroup])
    setSelectedItemKeys(new Set())
    setIsCreateGroupModalOpen(false)
  }

  // Remove / Ungroup an existing group
  const handleUngroup = (groupId: string) => {
    setDiseaseGroups(diseaseGroups.filter((g) => g.id !== groupId))
  }

  // Export to CSV
  const handleExportCsv = () => {
    if (groupByVisit) {
      // Export visits CSV
      const headers = [
        "#",
        "Visit ID",
        "Date",
        "Patient Name",
        "Patient ID",
        "Gender",
        "Age",
        "Department",
        "Clinician",
        "Diagnoses / Conditions",
        "Total Diagnoses",
        ...(showSymptoms ? ["Symptoms"] : []),
        ...(showMedications ? ["Medications"] : []),
      ]

      const csvRows = [headers.join(",")]

      searchedVisitGroups.forEach((vg, idx) => {
        const diagListStr = vg.diseaseSummaries
          .map((d) => `${d.name}${d.icd11Code ? ` (${d.icd11Code})` : ""}${d.isGroup ? ` [Group: ${d.groupName}]` : ""} [${d.type}]`)
          .join(" | ")

        const rowData = [
          String(idx + 1),
          `"${vg.visitId.replace(/"/g, '""')}"`,
          `"${(vg.date || "").replace(/"/g, '""')}"`,
          `"${vg.patientName.replace(/"/g, '""')}"`,
          `"${(vg.patientIdentifier || "").replace(/"/g, '""')}"`,
          `"${(vg.patientGender || "").replace(/"/g, '""')}"`,
          vg.patientAge !== null && vg.patientAge !== undefined ? String(vg.patientAge) : "",
          `"${vg.departmentName.replace(/"/g, '""')}"`,
          `"${vg.clinicianName.replace(/"/g, '""')}"`,
          `"${diagListStr.replace(/"/g, '""')}"`,
          String(vg.records.length),
          ...(showSymptoms ? [`"${Array.from(vg.symptomsSet).join("; ").replace(/"/g, '""')}"`] : []),
          ...(showMedications ? [`"${Array.from(vg.medicationsSet).join("; ").replace(/"/g, '""')}"`] : []),
        ]
        csvRows.push(rowData.join(","))
      })

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `diagnostic_visits_report_${data.fromDate}_to_${data.toDate}.csv`
      a.click()
      URL.revokeObjectURL(url)
      return
    }

    const headers = [
      "#",
      "Disease / Condition",
      "Type",
      "ICD-11 Code",
      "Sub-conditions / Items",
      ...ageBrackets.flatMap((b) => [`${b.label} (M)`, `${b.label} (F)`]),
      "Total",
      ...(showSymptoms ? ["Symptoms"] : []),
      ...(showMedications ? ["Medications"] : []),
    ]

    const csvRows = [headers.join(",")]

    searchedRows.forEach((row, idx) => {
      const rowData = [
        String(idx + 1),
        `"${row.diseaseName.replace(/"/g, '""')}"`,
        row.isGroup ? "Group" : "Single",
        `"${row.icd11Code || ""}"`,
        `"${row.subDiseases ? row.subDiseases.join("; ").replace(/"/g, '""') : ""}"`,
        ...ageBrackets.flatMap((b) => [
          String(row.counts[`${b.id}_M`] || 0),
          String(row.counts[`${b.id}_F`] || 0),
        ]),
        String(row.totalCases),
        ...(showSymptoms ? [`"${Array.from(row.symptomsSet).join("; ").replace(/"/g, '""')}"`] : []),
        ...(showMedications ? [`"${Array.from(row.medicationsSet).join("; ").replace(/"/g, '""')}"`] : []),
      ]
      csvRows.push(rowData.join(","))
    })

    // Add total row
    const totalRow = [
      "",
      `"Total Cases Consulted or Screened"`,
      "",
      "",
      "",
      ...ageBrackets.flatMap((b) => [
        String(columnTotals.totals[`${b.id}_M`] || 0),
        String(columnTotals.totals[`${b.id}_F`] || 0),
      ]),
      String(columnTotals.grandTotal),
      ...(showSymptoms ? [""] : []),
      ...(showMedications ? [""] : []),
    ]
    csvRows.push(totalRow.join(","))

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `diagnostic_report_${data.fromDate}_to_${data.toDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Count visible selectable items
  const selectableVisibleRows = useMemo(() => {
    return searchedRows.filter((r) => !r.isGroup)
  }, [searchedRows])

  const areAllSelectableChecked =
    selectableVisibleRows.length > 0 &&
    selectableVisibleRows.every((r) => selectedItemKeys.has(r.rowKey))

  return (
    <div className="space-y-4">
      {/* KPI Cards / Header Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card/70 border border-border/70 rounded-2xl p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Diagnostic Encounters</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-2">
            {rawRecords.length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Recorded in selected period & filters
          </p>
        </div>

        <div className="bg-card/70 border border-border/70 rounded-2xl p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Report Rows (Grouped)</span>
            <Stethoscope className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-2">
            {aggregatedData.length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {diseaseGroups.length > 0
              ? `${diseaseGroups.length} combined disease group${diseaseGroups.length > 1 ? "s" : ""} active`
              : "No custom groups defined"}
          </p>
        </div>

        <div className="bg-card/70 border border-border/70 rounded-2xl p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Top Condition / Group</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold truncate text-foreground mt-2" title={aggregatedData[0]?.diseaseName || "None"}>
            {aggregatedData[0]?.diseaseName || "None recorded"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {aggregatedData[0] ? `${aggregatedData[0].totalCases} cases (${Math.round((aggregatedData[0].totalCases / (columnTotals.grandTotal || 1)) * 100)}%)` : "—"}
          </p>
        </div>

        <div className="bg-card/70 border border-border/70 rounded-2xl p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Active Age Brackets</span>
            <SlidersHorizontal className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-foreground mt-2">
            {ageBrackets.length} Ranges
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
            <span className="truncate">{ageBrackets.map((b) => b.label).join(", ")}</span>
          </p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-card/70 border border-border/70 rounded-2xl p-3 sm:p-4 shadow-sm backdrop-blur-md space-y-3">
        {/* Row 1: Search + View & Diagnosis Filters + Actions (Flex-wrapping gracefully) */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0 sm:min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              type="text"
              placeholder="Search by disease name, group, or ICD-11 code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 sm:h-10 rounded-xl bg-background/60 border-border/60 text-xs sm:text-sm w-full min-w-0"
            />
          </div>

          {/* Filter Toggles & Action Buttons Container */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Diagnosis Type Segmented Control */}
            <div className="inline-flex items-center bg-muted/40 p-0.5 sm:p-1 rounded-xl border border-border/50 shrink-0">
              <Button
                variant={diagnosisTypeFilter === "FINAL_ONLY" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDiagnosisTypeFilter("FINAL_ONLY")}
                className="rounded-lg h-7 sm:h-8 px-2 sm:px-3 text-xs font-medium whitespace-nowrap"
              >
                Final Diagnoses Only
              </Button>
              <Button
                variant={diagnosisTypeFilter === "ALL" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDiagnosisTypeFilter("ALL")}
                className="rounded-lg h-7 sm:h-8 px-2 sm:px-3 text-xs font-medium whitespace-nowrap"
              >
                Hypothesis + Final
              </Button>
            </div>

            {/* Visit vs Disease Grouping Segmented Control */}
            <div className="inline-flex items-center bg-muted/40 p-0.5 sm:p-1 rounded-xl border border-border/50 shrink-0">
              <Button
                variant={!groupByVisit ? "default" : "ghost"}
                size="sm"
                onClick={() => setGroupByVisit(false)}
                className="rounded-lg h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1.5 whitespace-nowrap"
              >
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                <span>By Disease</span>
              </Button>
              <Button
                variant={groupByVisit ? "default" : "ghost"}
                size="sm"
                onClick={() => setGroupByVisit(true)}
                className="rounded-lg h-7 sm:h-8 px-2 sm:px-2.5 text-xs font-medium gap-1.5 whitespace-nowrap"
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Group by Visit</span>
              </Button>
            </div>

            {/* Actions: Groups, Age Brackets & CSV Export */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsManageGroupsModalOpen(true)}
                className="h-8 sm:h-9 rounded-xl border-border/70 gap-1.5 text-xs font-medium whitespace-nowrap shrink-0"
              >
                <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500 shrink-0" />
                <span>Disease Groups</span>
                {diseaseGroups.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {diseaseGroups.length}
                  </Badge>
                )}
              </Button>

              {!groupByVisit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenBracketModal}
                  className="h-8 sm:h-9 rounded-xl border-border/70 gap-1.5 text-xs font-medium whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <span className="hidden sm:inline">Configure Age Ranges</span>
                  <span className="sm:hidden">Age Ranges</span>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                    {ageBrackets.length}
                  </Badge>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCsv}
                disabled={groupByVisit ? searchedVisitGroups.length === 0 : searchedRows.length === 0}
                className="h-8 sm:h-9 rounded-xl border-border/70 gap-1.5 text-xs font-medium whitespace-nowrap shrink-0"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Second Row: Toggles for Matching Symptoms & Medications */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="toggle-symptoms"
                checked={showSymptoms}
                onCheckedChange={setShowSymptoms}
              />
              <Label
                htmlFor="toggle-symptoms"
                className="text-xs font-medium cursor-pointer flex items-center gap-1.5 text-foreground"
              >
                <Stethoscope className="h-3.5 w-3.5 text-amber-500" />
                Show Correlated Symptoms
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="toggle-medications"
                checked={showMedications}
                onCheckedChange={setShowMedications}
              />
              <Label
                htmlFor="toggle-medications"
                className="text-xs font-medium cursor-pointer flex items-center gap-1.5 text-foreground"
              >
                <Pill className="h-3.5 w-3.5 text-indigo-500" />
                Show Prescribed Medications
              </Label>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
            {groupByVisit
              ? `Showing ${searchedVisitGroups.length} visits / ${filteredRecords.length} diagnostic entries`
              : `Showing ${searchedRows.length} conditions / ${columnTotals.grandTotal} cases`}
          </div>
        </div>

        {/* Interactive Group Creation Bar (Appears when user checks rows in Disease Mode) */}
        {!groupByVisit && selectedItemKeys.size > 0 && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="default" className="text-xs h-6 px-2 font-bold bg-primary text-primary-foreground shrink-0">
                {selectedItemKeys.size} Selected
              </Badge>
              <span className="text-xs font-medium text-foreground truncate sm:whitespace-normal">
                Combine selected diseases (e.g. Myopia, Hypermetropia, Astigmatism) into one report row.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleOpenCreateGroup}
                disabled={selectedItemKeys.size < 2}
                className="h-8 rounded-lg text-xs font-medium gap-1.5 bg-primary text-primary-foreground shadow-xs whitespace-nowrap"
              >
                <FolderPlus className="h-3.5 w-3.5 shrink-0" />
                <span>Group Selection as One ({selectedItemKeys.size})</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDropSelection}
                className="h-8 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground whitespace-nowrap shrink-0"
              >
                <X className="h-3.5 w-3.5 shrink-0" />
                <span>Drop Selection</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table: Either Group by Visit Table OR Epidemiological Disease Table */}
      {groupByVisit ? (
        <div className="bg-card/70 border border-border/70 rounded-2xl shadow-sm overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-muted/60 border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-4 min-w-[140px]">Date & Time</th>
                  <th className="py-3 px-4 min-w-[180px]">Patient</th>
                  <th className="py-3 px-3 min-w-[110px]">Demographics</th>
                  <th className="py-3 px-4 min-w-[150px]">Department & Clinician</th>
                  <th className="py-3 px-4 min-w-[260px]">Diagnoses & Conditions</th>
                  <th className="py-3 px-3 text-center w-24">Total Diag</th>
                  <th className="py-3 px-3 text-center w-20">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {searchedVisitGroups.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Activity className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">No visit diagnostic records found</p>
                        <p className="text-xs text-muted-foreground/80 max-w-sm">
                          No visits matching your selected filters (period, department, clinician, diagnosis type) were recorded.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  searchedVisitGroups.map((vg, index) => {
                    const isExpanded = expandedVisits.has(vg.visitId)

                    return (
                      <React.Fragment key={vg.visitId}>
                        <tr className="hover:bg-muted/30 transition-colors group">
                          {/* Index */}
                          <td className="py-3 px-3 text-center text-muted-foreground font-mono text-[11px]">
                            {index + 1}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                            {vg.date ? vg.date.replace("T", " ").substring(0, 16) : "—"}
                          </td>

                          {/* Patient */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">{vg.patientName}</span>
                            </div>
                            {vg.patientIdentifier && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                ID: {vg.patientIdentifier}
                              </p>
                            )}
                          </td>

                          {/* Demographics (Gender & Age) */}
                          <td className="py-3 px-3 text-xs">
                            <div className="flex items-center gap-1">
                              {vg.patientGender && (
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] px-1 py-0 font-medium ${
                                    vg.patientGender.toUpperCase().startsWith("M")
                                      ? "text-blue-600 dark:text-blue-400 border-blue-500/30"
                                      : vg.patientGender.toUpperCase().startsWith("F")
                                      ? "text-pink-600 dark:text-pink-400 border-pink-500/30"
                                      : ""
                                  }`}
                                >
                                  {vg.patientGender.substring(0, 1).toUpperCase()}
                                </Badge>
                              )}
                              <span className="text-muted-foreground">
                                {vg.patientAge !== null && vg.patientAge !== undefined ? `${vg.patientAge}y` : "—"}
                              </span>
                            </div>
                          </td>

                          {/* Department & Clinician */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground text-xs flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span>{vg.departmentName}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Stethoscope className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="truncate">{vg.clinicianName}</span>
                            </div>
                          </td>

                          {/* Diagnoses List */}
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              {vg.diseaseSummaries.map((diag, dIdx) => (
                                <div key={dIdx} className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-medium text-foreground">
                                    {diag.name}
                                  </span>

                                  {diag.isGroup ? (
                                    <Badge
                                      variant="default"
                                      className="text-[9px] px-1 py-0 bg-indigo-600 text-white font-normal gap-0.5"
                                    >
                                      <Layers className="h-2 w-2" />
                                      {diag.groupName}
                                    </Badge>
                                  ) : (
                                    diag.icd11Code && (
                                      <Badge
                                        variant="outline"
                                        className="text-[9px] px-1 py-0 font-mono border-border/60 text-muted-foreground"
                                      >
                                        ICD: {diag.icd11Code}
                                      </Badge>
                                    )
                                  )}

                                  <Badge
                                    variant="secondary"
                                    className={`text-[9px] px-1 py-0 font-normal ${
                                      diag.type === "HYPOTHESIS"
                                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                        : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                    }`}
                                  >
                                    {diag.type === "HYPOTHESIS" ? "Hypothesis" : "Final"}
                                  </Badge>
                                </div>
                              ))}
                            </div>

                            {/* Symptoms Pills for Visit */}
                            {showSymptoms && vg.symptomsSet.size > 0 && (
                              <div className="mt-2 flex flex-wrap items-center gap-1 pt-1 border-t border-border/30">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
                                  <Stethoscope className="h-3 w-3 text-amber-500" />
                                  Symptoms:
                                </span>
                                {Array.from(vg.symptomsSet).map((sym) => (
                                  <Badge
                                    key={sym}
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                  >
                                    {sym}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Medications Pills for Visit */}
                            {showMedications && vg.medicationsSet.size > 0 && (
                              <div className="mt-1 flex flex-wrap items-center gap-1">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
                                  <Pill className="h-3 w-3 text-indigo-500" />
                                  Rx:
                                </span>
                                {Array.from(vg.medicationsSet).map((med) => (
                                  <Badge
                                    key={med}
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
                                  >
                                    {med}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Total Diagnoses Count */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-foreground">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                              {vg.records.length}
                            </span>
                          </td>

                          {/* View Full Visit Record Button */}
                          <td className="py-3 px-3 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedVisitDetails(vg)}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg"
                              title="View full visit diagnostic breakdown"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
              {searchedVisitGroups.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/80 border-t-2 border-border/80 font-bold text-foreground text-xs">
                    <td className="py-3 px-3 text-center text-muted-foreground">—</td>
                    <td className="py-3 px-4" colSpan={5}>
                      <span className="uppercase tracking-wider text-[11px] font-extrabold text-foreground">
                        Total Visits with Diagnoses: {searchedVisitGroups.length}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center border-l border-border/60 font-mono font-black text-sm bg-primary/10 text-primary">
                      {searchedVisitGroups.reduce((acc, vg) => acc + vg.records.length, 0)}
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground">—</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card/70 border border-border/70 rounded-2xl shadow-sm overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                {/* Top grouping row */}
                <tr className="bg-muted/60 border-b border-border/60 text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                  {/* Selection Checkbox Column */}
                  <th className="py-2.5 px-3 w-10 text-center" rowSpan={2}>
                    <Checkbox
                      checked={areAllSelectableChecked}
                      onCheckedChange={handleSelectAllVisible}
                      aria-label="Select all visible diseases"
                    />
                  </th>
                  <th className="py-2.5 px-2 w-10 text-center" rowSpan={2}>
                    #
                  </th>
                  <th className="py-2.5 px-4 min-w-[260px]" rowSpan={2}>
                    Disease / Condition
                  </th>
                  {ageBrackets.map((bracket) => (
                    <th
                      key={bracket.id}
                      colSpan={2}
                      className="py-1 px-3 text-center border-l border-border/40 bg-muted/40 font-bold text-foreground/80"
                    >
                      {bracket.label}
                    </th>
                  ))}
                  <th
                    className="py-2.5 px-4 text-center font-bold text-foreground border-l border-border/60 bg-primary/5 min-w-[90px]"
                    rowSpan={2}
                  >
                    Total
                  </th>
                </tr>

                {/* Sub-header row for Male / Female */}
                <tr className="bg-muted/50 border-b border-border/60 text-[10px] font-bold text-muted-foreground">
                  {ageBrackets.map((bracket) => (
                    <React.Fragment key={`${bracket.id}-sub`}>
                      <th className="py-1 px-2 text-center border-l border-border/40 w-16 text-blue-600 dark:text-blue-400">
                        M
                      </th>
                      <th className="py-1 px-2 text-center border-l border-border/20 w-16 text-pink-600 dark:text-pink-400">
                        F
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/40 text-xs">
                {searchedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3 + ageBrackets.length * 2 + 1}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Activity className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">No diagnostic records found</p>
                        <p className="text-xs text-muted-foreground/80 max-w-sm">
                          No diagnoses matching your selected filters (period, department, clinician, diagnosis type) were recorded.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  searchedRows.map((row, index) => {
                    const isSelected = selectedItemKeys.has(row.rowKey)

                    return (
                      <tr
                        key={row.rowKey}
                        className={`hover:bg-muted/30 transition-colors group ${
                          isSelected ? "bg-primary/5" : ""
                        } ${row.isGroup ? "bg-indigo-500/5 dark:bg-indigo-950/20" : ""}`}
                      >
                        {/* Checkbox column */}
                        <td className="py-3 px-3 text-center">
                          {!row.isGroup ? (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleToggleRowSelect(row.rowKey)}
                              aria-label={`Select ${row.diseaseName}`}
                            />
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUngroup(row.groupId!)}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive rounded"
                              title="Ungroup this combined condition"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </td>

                        {/* Index */}
                        <td className="py-3 px-2 text-center text-muted-foreground font-mono text-[11px]">
                          {index + 1}
                        </td>

                        {/* Disease Name & Optional Group details / ICD-11 / Symptoms / Medications */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground text-sm flex items-center gap-2 flex-wrap">
                            <span>{row.diseaseName}</span>

                            {row.isGroup ? (
                              <Badge
                                variant="default"
                                className="text-[10px] px-1.5 py-0 font-medium bg-indigo-600 text-white gap-1"
                              >
                                <Layers className="h-2.5 w-2.5" />
                                Grouped ({row.subDiseases?.length || 0})
                              </Badge>
                            ) : (
                              row.icd11Code && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 font-mono font-medium border-border/60 text-muted-foreground"
                                >
                                  ICD: {row.icd11Code}
                                </Badge>
                              )
                            )}
                          </div>

                          {/* If Group, list bundled sub-conditions */}
                          {row.isGroup && row.subDiseases && row.subDiseases.length > 0 && (
                            <div className="mt-1 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-muted-foreground font-medium">
                                Includes:
                              </span>
                              {row.subDiseases.map((sub) => (
                                <span
                                  key={sub}
                                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/70 text-muted-foreground font-medium"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Matching Symptoms Pills */}
                          {showSymptoms && row.symptomsSet.size > 0 && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
                                <Stethoscope className="h-3 w-3 text-amber-500" />
                                Symptoms:
                              </span>
                              {Array.from(row.symptomsSet).slice(0, 6).map((sym) => (
                                <Badge
                                  key={sym}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                >
                                  {sym}
                                </Badge>
                              ))}
                              {row.symptomsSet.size > 6 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{row.symptomsSet.size - 6} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Matching Medications Pills */}
                          {showMedications && row.medicationsSet.size > 0 && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-1">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium mr-1">
                                <Pill className="h-3 w-3 text-indigo-500" />
                                Rx:
                              </span>
                              {Array.from(row.medicationsSet).slice(0, 6).map((med) => (
                                <Badge
                                  key={med}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
                                >
                                  {med}
                                </Badge>
                              ))}
                              {row.medicationsSet.size > 6 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{row.medicationsSet.size - 6} more
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Age & Gender Buckets */}
                        {ageBrackets.map((bracket) => {
                          const mCount = row.counts[`${bracket.id}_M`] || 0
                          const fCount = row.counts[`${bracket.id}_F`] || 0
                          return (
                            <React.Fragment key={bracket.id}>
                              <td className="py-3 px-2 text-center border-l border-border/40 font-mono text-xs">
                                {mCount > 0 ? (
                                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {mCount}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/40 font-light">0</span>
                                )}
                              </td>
                              <td className="py-3 px-2 text-center border-l border-border/20 font-mono text-xs">
                                {fCount > 0 ? (
                                  <span className="font-semibold text-pink-600 dark:text-pink-400">
                                    {fCount}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/40 font-light">0</span>
                                )}
                              </td>
                            </React.Fragment>
                          )
                        })}

                        {/* Row Total */}
                        <td className="py-3 px-4 text-center border-l border-border/60 font-mono font-bold text-foreground bg-primary/5">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                            {row.totalCases}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>

              {/* Bottom Total Summary Row */}
              {searchedRows.length > 0 && (
                <tfoot>
                  <tr className="bg-muted/80 border-t-2 border-border/80 font-bold text-foreground text-xs">
                    <td className="py-3 px-3 text-center text-muted-foreground">—</td>
                    <td className="py-3 px-2 text-center text-muted-foreground">—</td>
                    <td className="py-3 px-4">
                      <span className="uppercase tracking-wider text-[11px] font-extrabold text-foreground">
                        Total cases consulted or screened
                      </span>
                    </td>

                    {ageBrackets.map((bracket) => {
                      const mTot = columnTotals.totals[`${bracket.id}_M`] || 0
                      const fTot = columnTotals.totals[`${bracket.id}_F`] || 0
                      return (
                        <React.Fragment key={`tot-${bracket.id}`}>
                          <td className="py-3 px-2 text-center border-l border-border/40 font-mono text-blue-600 dark:text-blue-400 font-extrabold">
                            {mTot}
                          </td>
                          <td className="py-3 px-2 text-center border-l border-border/20 font-mono text-pink-600 dark:text-pink-400 font-extrabold">
                            {fTot}
                          </td>
                        </React.Fragment>
                      )
                    })}

                    <td className="py-3 px-4 text-center border-l border-border/60 font-mono font-black text-sm bg-primary/10 text-primary">
                      {columnTotals.grandTotal}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Disease Group from Selection */}
      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Create Disease Group
            </DialogTitle>
            <DialogDescription className="text-xs">
              Combine the {selectedItemKeys.size} selected conditions so they are counted as a single unified condition in the report.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-foreground">
                Group Name / Disease Category
              </Label>
              <Input
                type="text"
                placeholder="e.g. Refractive error / Erreurs de réfraction"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="mt-1 h-9 text-sm rounded-xl"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                This name will represent all selected diseases as one row in the table and exports.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Selected Diseases to Group ({selectedItemKeys.size})
              </Label>
              <div className="max-h-36 overflow-y-auto p-2 rounded-xl bg-muted/30 border border-border/50 space-y-1 text-xs">
                {Array.from(selectedItemKeys).map((key) => {
                  const r = aggregatedData.find((row) => row.rowKey === key)
                  return (
                    <div key={key} className="flex items-center justify-between text-foreground py-0.5">
                      <span className="font-medium truncate">{r ? r.diseaseName : key}</span>
                      {r?.icd11Code && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                          {r.icd11Code}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateGroupModalOpen(false)}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!newGroupName.trim()}
              onClick={handleConfirmCreateGroup}
              className="rounded-xl text-xs h-9 font-medium"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Manage Disease Groups */}
      <Dialog open={isManageGroupsModalOpen} onOpenChange={setIsManageGroupsModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              Manage Disease Groups
            </DialogTitle>
            <DialogDescription className="text-xs">
              View, edit, or ungroup diseases that are counted together as one category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {diseaseGroups.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground space-y-2">
                <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/40" />
                <p className="text-xs font-medium">No custom disease groups created yet.</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Select 2 or more diseases using the checkboxes in the report table, then click &quot;Group Selection as One&quot;.
                </p>
              </div>
            ) : (
              diseaseGroups.map((g) => (
                <div
                  key={g.id}
                  className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{g.groupName}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {g.itemKeys.length} items
                      </Badge>
                    </div>
                    {g.itemsSummary && g.itemsSummary.length > 0 && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        Includes: {g.itemsSummary.join(", ")}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUngroup(g.id)}
                    className="h-8 px-2 text-destructive hover:bg-destructive/10 rounded-lg text-xs gap-1 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Ungroup
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManageGroupsModalOpen(false)}
              className="rounded-xl text-xs h-9"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Age Range Customization Dialog */}
      <Dialog open={isAgeDialogOpen} onOpenChange={setIsAgeDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Configure Epidemiological Age Ranges
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define custom age intervals to structure demographic disease incidence reports.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            {tempBrackets.map((bracket, idx) => (
              <div
                key={bracket.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border/60 bg-muted/20"
              >
                <div className="w-6 text-center text-xs font-mono text-muted-foreground">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Label
                  </Label>
                  <Input
                    type="text"
                    value={bracket.label}
                    onChange={(e) => handleUpdateBracket(bracket.id, "label", e.target.value)}
                    placeholder="e.g. 0-19 yrs"
                    className="h-8 text-xs rounded-lg mt-0.5"
                  />
                </div>

                <div className="w-20">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Min Age
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={150}
                    value={bracket.minAge}
                    onChange={(e) => handleUpdateBracket(bracket.id, "minAge", e.target.value)}
                    className="h-8 text-xs rounded-lg mt-0.5 font-mono"
                  />
                </div>

                <div className="w-20">
                  <Label className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Max Age
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={150}
                    value={bracket.maxAge}
                    onChange={(e) => handleUpdateBracket(bracket.id, "maxAge", e.target.value)}
                    className="h-8 text-xs rounded-lg mt-0.5 font-mono"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBracket(bracket.id)}
                    disabled={tempBrackets.length <= 1}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddBracket}
                className="rounded-xl h-8 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Bracket
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetDefaultBrackets}
                className="rounded-xl h-8 text-xs text-muted-foreground gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to Standard (0-19, 20-39, 40+)
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAgeDialogOpen(false)}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveBrackets}
              className="rounded-xl text-xs h-9 font-medium"
            >
              Apply Age Ranges
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Visit Details Diagnostic Breakdown */}
      <Dialog
        open={selectedVisitDetails !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedVisitDetails(null)
        }}
      >
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Visit Diagnostic Encounter
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete diagnostic record, symptoms, and medications recorded for this clinical visit.
            </DialogDescription>
          </DialogHeader>

          {selectedVisitDetails && (
            <div className="space-y-4 py-2 text-xs">
              {/* Patient & Encounter Header */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Patient</span>
                  <p className="font-bold text-foreground text-sm mt-0.5">{selectedVisitDetails.patientName}</p>
                  {selectedVisitDetails.patientIdentifier && (
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {selectedVisitDetails.patientIdentifier}</p>
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Demographics</span>
                  <p className="text-foreground mt-0.5">
                    {selectedVisitDetails.patientGender ? `${selectedVisitDetails.patientGender}, ` : ""}
                    {selectedVisitDetails.patientAge !== null && selectedVisitDetails.patientAge !== undefined
                      ? `${selectedVisitDetails.patientAge} years old`
                      : "Age not recorded"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Department</span>
                  <p className="text-foreground mt-0.5">{selectedVisitDetails.departmentName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Clinician</span>
                  <p className="text-foreground mt-0.5">{selectedVisitDetails.clinicianName}</p>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/30">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Date & Time</span>
                  <p className="font-mono text-muted-foreground mt-0.5">
                    {selectedVisitDetails.date ? selectedVisitDetails.date.replace("T", " ") : "—"}
                  </p>
                </div>
              </div>

              {/* Diagnoses List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Diagnoses Recorded ({selectedVisitDetails.records.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground">Each counts as 1 entry</span>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {selectedVisitDetails.records.map((diag, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2.5 rounded-xl border border-border/60 bg-card/60 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground text-sm">{diag.diagnosisName}</span>
                          {diag.icd11Code && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono">
                              ICD: {diag.icd11Code}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-1.5 py-0 font-medium ${
                              diag.type === "HYPOTHESIS"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {diag.type === "HYPOTHESIS" ? "Hypothesis" : "Final"}
                          </Badge>
                        </div>
                        {diag.notes && (
                          <p className="text-[11px] text-muted-foreground italic">
                            &quot;{diag.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Correlated Symptoms */}
              {selectedVisitDetails.records.some((r) => r.symptoms && r.symptoms.length > 0) && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-amber-500" />
                    Correlated Symptoms
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Array.from(
                      new Set(
                        selectedVisitDetails.records.flatMap((r) => r.symptoms || []).filter(Boolean)
                      )
                    ).map((sym) => (
                      <Badge
                        key={sym}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                      >
                        {sym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Prescribed Medications */}
              {selectedVisitDetails.records.some((r) => r.medications && r.medications.length > 0) && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5 text-indigo-500" />
                    Prescribed Medications
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Array.from(
                      new Set(
                        selectedVisitDetails.records.flatMap((r) => r.medications || []).filter(Boolean)
                      )
                    ).map((med) => (
                      <Badge
                        key={med}
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20"
                      >
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedVisitDetails(null)}
              className="rounded-xl text-xs h-9"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

