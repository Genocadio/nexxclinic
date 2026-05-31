"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useQuery } from "@apollo/client"
import { GET_PATIENT_HISTORY_QUERY } from "@/hooks/queries/visits"
import { GET_CONSULTATION_ANSWERS_QUERY } from "@/hooks/queries/forms"
import { ChevronDown, X, Calendar, Filter, ChevronRight } from "lucide-react"
import type { Visit, VisitDepartment } from "@/lib/types"
import { toast } from "react-toastify"

interface PatientHistorySidePaneProps {
  patientId: string
  currentVisitId: string
  onClose: () => void
}

interface HistoryFilter {
  selectedDepartments: string[]
  startDate?: string
  endDate?: string
  month?: number
  year?: number
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
  onClose,
}: PatientHistorySidePaneProps) {
  const [filters, setFilters] = useState<HistoryFilter>({
    selectedDepartments: [],
  })
  const [hoveredDepartment, setHoveredDepartment] = useState<string | null>(null)
  const [expandedDepartment, setExpandedDepartment] = useState<DepartmentDetails | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const lastErrorMessageRef = useRef<string | null>(null)

  const { data: historyData, loading: historyLoading, error: historyError } = useQuery(GET_PATIENT_HISTORY_QUERY, {
    variables: {
      patientId,
      input: {
        page: 1,
        size: 100,
      },
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

  const { data: answersData } = useQuery(GET_CONSULTATION_ANSWERS_QUERY, {
    variables: {
      visitDepartmentId: expandedDepartment?.visitDepartmentId,
      visitId: expandedDepartment?.visitId,
    },
    skip: !expandedDepartment?.visitDepartmentId,
  })

  const visits: Visit[] = useMemo(() => {
    return historyData?.getPatientHistory?.data || []
  }, [historyData])

  // Get all unique departments from all visits
  const allDepartments = useMemo(() => {
    const deptMap = new Map<string, string>()
    visits.forEach((visit) => {
      visit.departments?.forEach((dept) => {
        if (dept.department?.id) {
          deptMap.set(dept.department.id, dept.department.name)
        }
      })
    })
    return Array.from(deptMap.entries()).map(([id, name]) => ({ id, name }))
  }, [visits])

  // Filter visits based on selected criteria
  const filteredVisits = useMemo(() => {
    let filtered = visits.filter((visit) => visit.id !== currentVisitId)

    // Filter by selected departments
    if (filters.selectedDepartments.length > 0) {
      filtered = filtered.filter((visit) =>
        visit.departments?.some((dept) =>
          filters.selectedDepartments.includes(dept.department?.id || "")
        )
      )
    }

    // Filter by date range if provided
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter((visit) => {
        const visitDate = new Date(visit.visitDate || "")
        if (filters.startDate) {
          const startDate = new Date(filters.startDate)
          if (visitDate < startDate) return false
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate)
          endDate.setHours(23, 59, 59, 999)
          if (visitDate > endDate) return false
        }
        return true
      })
    }

    // Filter by month/year if provided
    if (filters.month !== undefined && filters.year !== undefined) {
      filtered = filtered.filter((visit) => {
        const visitDate = new Date(visit.visitDate || "")
        return (
          visitDate.getMonth() === filters.month &&
          visitDate.getFullYear() === filters.year
        )
      })
    }

    // Sort by date, newest first
    return filtered.sort(
      (a, b) =>
        new Date(b.visitDate || "").getTime() - new Date(a.visitDate || "").getTime()
    )
  }, [visits, currentVisitId, filters])

  const toggleDepartmentFilter = useCallback((deptId: string) => {
    setFilters((prev) => {
      const selected = prev.selectedDepartments.includes(deptId)
        ? prev.selectedDepartments.filter((id) => id !== deptId)
        : [...prev.selectedDepartments, deptId]
      return { ...prev, selectedDepartments: selected }
    })
  }, [])

  const handleDepartmentClick = useCallback((visitDepartment: VisitDepartment, visitId: string) => {
    setExpandedDepartment({
      visitDepartmentId: visitDepartment.id || "",
      visitId,
      departmentName: visitDepartment.department?.name || "Unknown",
      diagnostics: visitDepartment.diagnostics || [],
      medications: visitDepartment.medications || [],
    })
  }, [])

  const getConsultationAnswers = useCallback(() => {
    if (!expandedDepartment) return null

    const answers = answersData?.getConsultationAnswers?.data || []
    if (!Array.isArray(answers) || answers.length === 0) return null

    // Get the first answer since we filtered by visitDepartmentId
    const deptAnswers = answers[0]
    if (!deptAnswers) return null

    try {
      return JSON.parse(deptAnswers.answers || "{}")
    } catch {
      return deptAnswers.answers
    }
  }, [expandedDepartment, answersData])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Patient History</h2>
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

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Close patient history"
          >
            <X className="w-4 h-4" />
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
              {allDepartments.length === 0 ? (
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

          {/* Date Range Filter */}
          <div>
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 block">
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value || undefined }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-card-foreground"
                placeholder="Start date"
              />
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value || undefined }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-card-foreground"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.selectedDepartments.length > 0 ||
            filters.startDate ||
            filters.endDate) && (
            <button
              onClick={() =>
                setFilters({
                  selectedDepartments: [],
                })
              }
              className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-colors"
            >
              Clear All Filters
            </button>
          )}
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
                      {visit.departments?.length || 0} department(s)
                    </p>
                  </div>
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

                {/* Departments List */}
                <div className="space-y-1.5 mt-2">
                  {visit.departments?.map((dept) => (
                    <div
                      key={dept.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredDepartment(dept.id || "")}
                      onMouseLeave={() => setHoveredDepartment(null)}
                    >
                      <button
                        onClick={() => handleDepartmentClick(dept, visit.id || "")}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded text-xs bg-muted hover:bg-accent transition-colors text-card-foreground group"
                      >
                        <span className="font-medium">{dept.department?.name}</span>
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      {/* Hover Popup */}
                      {hoveredDepartment === dept.id && (dept.diagnostics?.length || 0) + (dept.medications?.length || 0) > 0 && (
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

              {/* Consultation Answers */}
              {getConsultationAnswers() && (
                <div>
                  <h4 className="text-sm font-semibold text-card-foreground mb-2">
                    Form Answers
                  </h4>
                  <div className="bg-muted rounded-lg p-3 text-sm space-y-2">
                    {typeof getConsultationAnswers() === "object" &&
                      Object.entries(getConsultationAnswers() || {}).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="font-medium text-card-foreground">
                              {key}:
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {String(value)}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              )}

              {expandedDepartment.diagnostics.length === 0 &&
                expandedDepartment.medications.length === 0 &&
                !getConsultationAnswers() && (
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
