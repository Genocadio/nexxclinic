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
  const [searchQuery, setSearchQuery] = useState("")
  const [showSymptoms, setShowSymptoms] = useState(false)
  const [showMedications, setShowMedications] = useState(false)

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
      <div className="bg-card/70 border border-border/70 rounded-2xl p-4 shadow-sm backdrop-blur-md space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by disease name, group, or ICD-11 code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background/60 border-border/60 text-sm"
            />
          </div>

          {/* Diagnosis Type Toggle */}
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50 shrink-0">
            <Button
              variant={diagnosisTypeFilter === "FINAL_ONLY" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDiagnosisTypeFilter("FINAL_ONLY")}
              className="rounded-lg h-8 px-3 text-xs font-medium"
            >
              Final Diagnoses Only
            </Button>
            <Button
              variant={diagnosisTypeFilter === "ALL" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDiagnosisTypeFilter("ALL")}
              className="rounded-lg h-8 px-3 text-xs font-medium"
            >
              Hypothesis + Final
            </Button>
          </div>

          {/* Action Buttons: Group Management, Age Range Config & Export */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Manage Groups Modal Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsManageGroupsModalOpen(true)}
              className="h-10 rounded-xl border-border/70 gap-1.5 text-xs font-medium"
            >
              <Layers className="h-4 w-4 text-indigo-500" />
              <span>Disease Groups</span>
              {diseaseGroups.length > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {diseaseGroups.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenBracketModal}
              className="h-10 rounded-xl border-border/70 gap-1.5 text-xs font-medium"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Configure Age Ranges</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {ageBrackets.length}
              </Badge>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={searchedRows.length === 0}
              className="h-10 rounded-xl border-border/70 gap-1.5 text-xs font-medium"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Second Row: Toggles for Matching Symptoms & Medications */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40">
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
            Showing {searchedRows.length} conditions / {columnTotals.grandTotal} cases
          </div>
        </div>

        {/* Interactive Group Creation Bar (Appears when user checks rows) */}
        {selectedItemKeys.size > 0 && (
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs h-6 px-2 font-bold bg-primary text-primary-foreground">
                {selectedItemKeys.size} Selected
              </Badge>
              <span className="text-xs font-medium text-foreground">
                Combine selected diseases (e.g. Myopia, Hypermetropia, Astigmatism) into one report row.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleOpenCreateGroup}
                disabled={selectedItemKeys.size < 2}
                className="h-8 rounded-lg text-xs font-medium gap-1.5 bg-primary text-primary-foreground shadow-xs"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                Group Selection as One ({selectedItemKeys.size})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDropSelection}
                className="h-8 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Drop Selection
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Epidemiological Diagnostic Table */}
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
    </div>
  )
}
