"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useQuery } from "@apollo/client"
import { GET_PATIENT_HISTORY_QUERY } from "@/hooks/queries/visits"
import { ChevronDown, X, Calendar, Filter, ChevronRight } from "lucide-react"
import type { Visit, VisitDepartment } from "@/lib/types"
import { toast } from "react-toastify"
import { useDepartments } from "@/hooks/departments/hooks"

interface PatientHistorySidePaneProps {
  patientId: string
  currentVisitId: string
  currentVisitDepartmentId?: string | null
  onPreviewDepartmentAnswers?: (input: {
    visitId: string
    visitDepartmentId: string
    departmentName: string
    patientName: string
  }) => void
  onClose: () => void
}

interface HistoryFilter {
  selectedDepartments: string[]
  fromType?: "year" | "month" | "day"
  fromValue?: string
  toType?: "year" | "month" | "day"
  toValue?: string
}

interface DepartmentDetails {
  visitDepartmentId: string
  visitId: string
  departmentName: string
  diagnostics: Array<{ id: string; diagnosisName: string; icd11Code?: string }>
  medications: Array<{ id: string; medicationName: string; instructions: string }>
}

export default function PatientHistorySidePane({
  patientId,
  currentVisitId,
  currentVisitDepartmentId,
  onPreviewDepartmentAnswers,
  onClose,
}: PatientHistorySidePaneProps) {
  const [filters, setFilters] = useState<HistoryFilter>({
    selectedDepartments: [],
  })
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null)
  const [expandedDepartment, setExpandedDepartment] = useState<DepartmentDetails | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const lastErrorMessageRef = useRef<string | null>(null)
  const { departments: clinicDepartments, loading: clinicDepartmentsLoading } = useDepartments({ skip: !showFilters })

  const historyInput = useMemo(() => {
    const input: Record<string, any> = {
      page: 0,
      size: 100,
    }

    if (filters.selectedDepartments.length > 0) {
      input.departmentIds = filters.selectedDepartments
    }

    if (filters.fromType && filters.fromValue && !filters.toType) {
      if (filters.fromType === "year") {
        const parsedYear = Number(filters.fromValue)
        if (!Number.isNaN(parsedYear)) input.year = parsedYear
      }

      if (filters.fromType === "month") {
        const [yearPart, monthPart] = filters.fromValue.split("-")
        const parsedYear = Number(yearPart)
        const parsedMonth = Number(monthPart)
        if (!Number.isNaN(parsedYear) && !Number.isNaN(parsedMonth)) {
          input.year = parsedYear
          input.month = parsedMonth
        }
      }

      if (filters.fromType === "day") {
        const selectedDate = new Date(filters.fromValue)
        if (!Number.isNaN(selectedDate.getTime())) {
          input.day = selectedDate.getDate()
          input.month = selectedDate.getMonth() + 1
          input.year = selectedDate.getFullYear()
        }
      }
    }

    if (filters.fromType && filters.fromValue && filters.toType && filters.toValue) {
      if (filters.fromType === "year" && filters.toType === "year") {
        const startYear = Number(filters.fromValue)
        const endYear = Number(filters.toValue)
        if (!Number.isNaN(startYear)) input.startYear = startYear
        if (!Number.isNaN(endYear)) input.endYear = endYear
      }

      if (filters.fromType === "month" && filters.toType === "month") {
        input.startMonth = filters.fromValue
        input.endMonth = filters.toValue
      }

      if (filters.fromType === "day" && filters.toType === "day") {
        input.startDate = filters.fromValue
        input.endDate = filters.toValue
      }
    }

    return input
  }, [filters])

  const { data: historyData, loading: historyLoading, error: historyError } = useQuery(GET_PATIENT_HISTORY_QUERY, {
    variables: {
      patientId,
      input: historyInput,
    },
    skip: !patientId,
  })

  useEffect(() => {
    const message = historyError?.message?.trim()
    if (!message || lastErrorMessageRef.current === message) return
    lastErrorMessageRef.current = message
    toast.error(message)
  }, [historyError])

  useEffect(() => {
    lastErrorMessageRef.current = null
  }, [patientId])

  const visits: Visit[] = useMemo(() => {
    return historyData?.getPatientHistory?.data || []
  }, [historyData])

  const currentVisit = useMemo(() => visits.find((visit) => visit.id === currentVisitId) || null, [visits, currentVisitId])
  const patient = useMemo(() => currentVisit?.patient || visits[0]?.patient || null, [currentVisit, visits])

  const allDepartments = useMemo(() => {
    return clinicDepartments.map((dept) => ({ id: String(dept.id), name: dept.name }))
  }, [clinicDepartments])

  // Filter visits based on selected criteria
  const filteredVisits = useMemo(() => {
    let filtered = visits.slice()

    // Filter by selected departments
    if (filters.selectedDepartments.length > 0) {
      filtered = filtered.filter((visit) =>
        visit.departments?.some((dept) =>
          filters.selectedDepartments.includes(dept.department?.id || "")
        )
      )
    }

    // Sort by date, newest first
    return filtered.sort(
      (a, b) =>
        new Date(b.visitDate || "").getTime() - new Date(a.visitDate || "").getTime()
    )
  }, [visits, currentVisitId, filters])
  const toggleDepartmentFilter = useCallback((deptId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(deptId)
        ? prev.selectedDepartments.filter((id) => id !== deptId)
        : [...prev.selectedDepartments, deptId],
    }))
  }, [])

  const handleFromTypeChange = useCallback((type: "year" | "month" | "day") => {
    setFilters((prev) => ({
      ...prev,
      fromType: prev.fromType === type ? undefined : type,
      fromValue: prev.fromType === type ? undefined : prev.fromValue,
      toType: prev.fromType === type ? undefined : type,
      toValue: prev.fromType === type ? undefined : undefined,
    }))
  }, [])

  const handleToTypeChange = useCallback((type: "year" | "month" | "day") => {
    setFilters((prev) => {
      if (!prev.fromType || prev.fromType !== type) return prev

      return {
        ...prev,
        toType: prev.toType === type ? undefined : type,
        toValue: prev.toType === type ? undefined : prev.toValue,
      }
    })
  }, [])

  const clearDateFilter = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      fromType: undefined,
      fromValue: undefined,
      toType: undefined,
      toValue: undefined,
    }))
  }, [])

  const currentYear = new Date().getFullYear()
  const yearOptions = useMemo(() => {
    const startYear = Math.max(1900, currentYear - 80)
    return Array.from({ length: currentYear - startYear + 1 }, (_, index) => currentYear - index)
  }, [currentYear])

  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), [])

  const parseDateValue = useCallback((value?: string) => {
    const now = new Date()
    const [year = String(now.getFullYear()), month = String(now.getMonth() + 1).padStart(2, "0"), day = String(now.getDate()).padStart(2, "0")] = String(value || "").split("-")
    return {
      year: Number(year) || now.getFullYear(),
      month: Number(month) || now.getMonth() + 1,
      day: Number(day) || now.getDate(),
    }
  }, [])

  const daysInMonth = useCallback((year: number, month: number) => new Date(year, month, 0).getDate(), [])

  const composeValue = useCallback((type: "year" | "month" | "day", year: number, month: number, day: number) => {
    if (type === "year") return String(year)
    if (type === "month") return `${year}-${String(month).padStart(2, "0")}`
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }, [])

  const formatPatientAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "Unknown age"

    const birthDate = new Date(dateOfBirth)
    if (Number.isNaN(birthDate.getTime())) return "Unknown age"

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1
    }

    return `${age} years`
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDepartmentClick = useCallback((dept: VisitDepartment, visitId: string) => {
    if (!visitId) return

    const visit = visits.find((item) => item.id === visitId)
    const visitDepartmentId = String(dept.id || "")

    if (onPreviewDepartmentAnswers && visitDepartmentId) {
      onPreviewDepartmentAnswers({
        visitId,
        visitDepartmentId,
        departmentName: dept.department?.name || "Department",
        patientName: visit?.patient
          ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim() || "Unknown patient"
          : "Unknown patient",
      })
      return
    }

    setExpandedDepartment({
      visitDepartmentId,
      visitId,
      departmentName: dept.department?.name || "Department",
      diagnostics: (dept.diagnostics || []).map((diag) => ({
        id: String(diag.id || ""),
        diagnosisName: diag.diagnosisName || "Unknown diagnosis",
        icd11Code: diag.icd11Code || undefined,
      })),
      medications: (dept.medications || []).map((med) => ({
        id: String(med.id || ""),
        medicationName: med.medicationName || "Unknown medication",
        instructions: med.instructions || "",
      })),
    })
  }, [onPreviewDepartmentAnswers, visits])

  return (
    <div className="fixed top-16 bottom-0 left-0 w-[420px] bg-background border-r border-border shadow-2xl z-[89] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {patient
              ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Name of patient"
              : "Name of patient"}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {patient
              ? `${formatPatientAge(patient.dateOfBirth)} • ${patient.gender || "Unknown sex"}`
              : "Unknown age • Unknown sex"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filteredVisits.length} of {visits.length} visits
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted/70 text-muted-foreground transition-colors"
          aria-label="Close history"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Button */}
      <div className="px-4 py-2 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg hover:bg-muted/50 bg-muted/30 transition-colors text-sm font-medium text-card-foreground"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-border space-y-4 flex-shrink-0 bg-muted">
          {/* Department Filter */}
          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">
              Departments
            </label>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {clinicDepartmentsLoading ? (
                  <p className="text-xs text-muted-foreground">Loading departments...</p>
                ) : allDepartments.length === 0 ? (
                <p className="text-xs text-muted-foreground">No departments found</p>
              ) : (
                allDepartments.map((dept) => (
                  <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.selectedDepartments.includes(dept.id)}
                      onChange={() => toggleDepartmentFilter(dept.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-sm text-card-foreground">{dept.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Date Filter
            </label>
            <div className="space-y-3 rounded-lg border border-border bg-background p-3">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">From</p>
                <div className="grid grid-cols-3 gap-1">
                  {(["year", "month", "day"] as const).map((type) => (
                    <button
                      key={`from-${type}`}
                      type="button"
                      onClick={() => handleFromTypeChange(type)}
                      className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${
                        filters.fromType === type
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      from {type}
                    </button>
                  ))}
                </div>

                {filters.fromType && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <select
                        value={parseDateValue(filters.fromValue).year}
                        onChange={(e) => {
                          const year = Number(e.target.value)
                          const parts = parseDateValue(filters.fromValue)
                          const month = parts.month
                          const day = Math.min(parts.day, daysInMonth(year, month))
                          setFilters((prev) => ({
                            ...prev,
                            fromValue: composeValue(filters.fromType!, year, month, day),
                          }))
                        }}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                      >
                        {yearOptions.map((year) => (
                          <option key={`from-year-${year}`} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      {filters.fromType !== "year" && (
                        <select
                          value={parseDateValue(filters.fromValue).month}
                          onChange={(e) => {
                            const month = Number(e.target.value)
                            const parts = parseDateValue(filters.fromValue)
                            const day = Math.min(parts.day, daysInMonth(parts.year, month))
                            setFilters((prev) => ({
                              ...prev,
                              fromValue: composeValue(filters.fromType!, parts.year, month, day),
                            }))
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                        >
                          {monthOptions.map((month) => (
                            <option key={`from-month-${month}`} value={month}>
                              {new Date(0, month - 1).toLocaleString("en-US", { month: "short" })}
                            </option>
                          ))}
                        </select>
                      )}

                      {filters.fromType === "day" && (
                        <select
                          value={parseDateValue(filters.fromValue).day}
                          onChange={(e) => {
                            const day = Number(e.target.value)
                            const parts = parseDateValue(filters.fromValue)
                            setFilters((prev) => ({
                              ...prev,
                              fromValue: composeValue("day", parts.year, parts.month, day),
                            }))
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                        >
                          {Array.from({ length: daysInMonth(parseDateValue(filters.fromValue).year, parseDateValue(filters.fromValue).month) }, (_, index) => index + 1).map((day) => (
                            <option key={`from-day-${day}`} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {filters.fromType && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">To</p>
                  <div className="grid grid-cols-3 gap-1">
                    {(["year", "month", "day"] as const).map((type) => (
                      <button
                        key={`to-${type}`}
                        type="button"
                        onClick={() => handleToTypeChange(type)}
                        disabled={type !== filters.fromType}
                        className={`rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors ${
                          type !== filters.fromType
                            ? "cursor-not-allowed bg-muted/40 text-muted-foreground/50"
                            : filters.toType === type
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        to {type}
                      </button>
                    ))}
                  </div>

                  {filters.toType && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <select
                        value={parseDateValue(filters.toValue).year}
                        onChange={(e) => {
                          const year = Number(e.target.value)
                          const parts = parseDateValue(filters.toValue)
                          const month = parts.month
                          const day = Math.min(parts.day, daysInMonth(year, month))
                          setFilters((prev) => ({
                            ...prev,
                            toValue: composeValue(filters.toType!, year, month, day),
                          }))
                        }}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                      >
                        {yearOptions.map((year) => (
                          <option key={`to-year-${year}`} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      {filters.toType !== "year" && (
                        <select
                          value={parseDateValue(filters.toValue).month}
                          onChange={(e) => {
                            const month = Number(e.target.value)
                            const parts = parseDateValue(filters.toValue)
                            const day = Math.min(parts.day, daysInMonth(parts.year, month))
                            setFilters((prev) => ({
                              ...prev,
                              toValue: composeValue(filters.toType!, parts.year, month, day),
                            }))
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                        >
                          {monthOptions.map((month) => (
                            <option key={`to-month-${month}`} value={month}>
                              {new Date(0, month - 1).toLocaleString("en-US", { month: "short" })}
                            </option>
                          ))}
                        </select>
                      )}

                      {filters.toType === "day" && (
                        <select
                          value={parseDateValue(filters.toValue).day}
                          onChange={(e) => {
                            const day = Number(e.target.value)
                            const parts = parseDateValue(filters.toValue)
                            setFilters((prev) => ({
                              ...prev,
                              toValue: composeValue("day", parts.year, parts.month, day),
                            }))
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-card-foreground"
                        >
                          {Array.from({ length: daysInMonth(parseDateValue(filters.toValue).year, parseDateValue(filters.toValue).month) }, (_, index) => index + 1).map((day) => (
                            <option key={`to-day-${day}`} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(filters.fromType || filters.selectedDepartments.length > 0) && (
                <button
                  onClick={() => {
                    setFilters({ selectedDepartments: [] })
                  }}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:opacity-90"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Visits List */}
      <div className="flex-1 overflow-y-auto">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4">
            <p className="text-sm text-muted-foreground text-center">
              {visits.length === 0
                ? "No previous visits found"
                : "No visits match your filters"}
            </p>
          </div>
        ) : !expandedDepartment ? (
          <div className="p-3 space-y-2">
            {filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="border border-border rounded-lg p-3 bg-card hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-card-foreground">
                      {formatDate(visit.visitDate)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.patient
                        ? `${visit.patient.firstName || ""} ${visit.patient.lastName || ""}`.trim() || "Unknown patient"
                        : "Unknown patient"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {visit.departments?.length || 0} department(s)
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {visit.id === currentVisitId && !currentVisitDepartmentId && (
                      <span className="px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap bg-primary text-primary-foreground">
                        Current Visit
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        visit.status === "COMPLETED"
                          ? "bg-primary/20 text-primary"
                          : visit.status === "IN_PROGRESS"
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary/20 text-secondary"
                      }`}
                    >
                      {visit.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Departments List */}
                <div className="space-y-1.5 mt-2">
                  {visit.departments?.map((dept) => (
                    <div
                      key={dept.id}
                      className="relative group"
                      onMouseEnter={() => {
                        if (visit.id === currentVisitId && dept.id === currentVisitDepartmentId) return
                        setHoveredDepartment(dept.id || "")
                      }}
                      onMouseLeave={() => setHoveredDepartment(null)}
                    >
                      <button
                        onClick={() => handleDepartmentClick(dept, visit.id || "")}
                        disabled={visit.id === currentVisitId && dept.id === currentVisitDepartmentId}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs bg-muted text-card-foreground group transition-colors ${
                          visit.id === currentVisitId && dept.id === currentVisitDepartmentId
                            ? "cursor-not-allowed opacity-60"
                            : "hover:bg-accent"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span>{dept.department?.name}</span>
                          {visit.id === currentVisitId && dept.id === currentVisitDepartmentId && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                              Current
                            </span>
                          )}
                        </span>
                        <ChevronRight className={`w-3 h-3 transition-opacity ${visit.id === currentVisitId && dept.id === currentVisitDepartmentId ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} />
                      </button>

                      {/* Hover Popup */}
                      {hoveredDepartment === dept.id && (dept.diagnostics?.length || 0) + (dept.medications?.length || 0) > 0 && !(visit.id === currentVisitId && dept.id === currentVisitDepartmentId) && (
                        <div className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-3 w-48 pointer-events-none">
                          {dept.diagnostics && dept.diagnostics.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold text-foreground mb-1">
                                Diagnostics:
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {dept.diagnostics.map((diag) => (
                                  <li key={diag.id}>
                                    • {diag.diagnosisName}
                                    {diag.icd11Code && (
                                      <span className="text-muted-foreground ml-1">
                                        ({diag.icd11Code})
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {dept.medications && dept.medications.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-1">
                                Medications:
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-0.5">
                                {dept.medications.map((med) => (
                                  <li key={med.id}>
                                    • {med.medicationName}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Department Details View */
          <div className="flex flex-col h-full">
            {/* Details Header */}
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button
                    onClick={() => setExpandedDepartment(null)}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline mb-2"
                  >
                    ← Back to Visits
                  </button>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {expandedDepartment.departmentName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visit on {formatDate(
                      visits.find((v) => v.id === expandedDepartment.visitId)?.visitDate
                    )}
                  </p>
                </div>

              </div>
            </div>

            {/* Details Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {/* Diagnostics */}
              {expandedDepartment.diagnostics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Diagnostics
                  </h4>
                  <ul className="space-y-1">
                    {expandedDepartment.diagnostics.map((diag) => (
                      <li key={diag.id} className="text-sm text-card-foreground">
                        <span className="font-medium">{diag.diagnosisName}</span>
                        {diag.icd11Code && (
                          <span className="text-muted-foreground ml-2">
                            ({diag.icd11Code})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medications */}
              {expandedDepartment.medications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Medications
                  </h4>
                  <ul className="space-y-1">
                    {expandedDepartment.medications.map((med) => (
                      <li key={med.id} className="text-sm text-card-foreground">
                        <span className="font-medium">{med.medicationName}</span>
                        {med.instructions && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {med.instructions}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {expandedDepartment.diagnostics.length === 0 &&
                expandedDepartment.medications.length === 0 &&
                (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No details available for this department
                  </p>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
