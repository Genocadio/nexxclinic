"use client"

import type { Visit } from "@/lib/api-types"
import { Calendar, Eye, AlertCircle, TrendingUp, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface MedicalHistoryProps {
  patient: Patient
  visits?: Visit[]
  onVisitSelect?: (visit: Visit) => void
}

export default function MedicalHistory({ patient, visits = [], onVisitSelect }: MedicalHistoryProps) {
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"timeline" | "list">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('medical-history-view-mode')
      return saved === 'list' ? 'list' : 'timeline'
    }
    return 'timeline'
  })

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medical-history-view-mode', viewMode)
    }
  }, [viewMode])

  const sortedVisits = [...visits].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
  )

  const diagnosticTrends = visits.reduce(
    (acc: Record<string, number>, visit) => {
      visit.departments?.forEach((dept) => {
        dept.diagnostics?.forEach((diag) => {
          const key = diag.diagnosisName.split(",")[0].trim()
          acc[key] = (acc[key] || 0) + 1
        })
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const medicationFrequency = visits.reduce(
    (acc: Record<string, number>, visit) => {
      visit.departments?.forEach((dept) => {
        dept.medications?.forEach((med) => {
          acc[med.medicationName] = (acc[med.medicationName] || 0) + 1
        })
      })
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total Visits
          </p>
          <p className="text-2xl font-bold text-foreground">{visits.length}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Completed
          </p>
          <p className="text-2xl font-bold text-primary">
            {visits.filter((v) => v.status === "COMPLETED").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            In Progress
          </p>
          <p className="text-2xl font-bold text-accent">
            {visits.filter((v) => v.status === "IN_PROGRESS").length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Unique Diagnoses
          </p>
          <p className="text-2xl font-bold text-secondary">{Object.keys(diagnosticTrends).length}</p>
        </div>
      </div>

      {/* Diagnostic Summary */}
      {Object.keys(diagnosticTrends).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Diagnostic Summary</h3>
          <div className="space-y-2">
            {Object.entries(diagnosticTrends)
              .sort((a, b) => b[1] - a[1])
              .map(([diagnosis, count]) => (
                <div key={diagnosis} className="flex items-center justify-between">
                  <span className="text-foreground text-sm">{diagnosis}</span>
                  <span className="flex items-center gap-2">
                    <div
                      className="h-2 bg-primary rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(diagnosticTrends))) * 100}px` }}
                    />
                    <span className="text-xs text-muted-foreground font-medium">{count}x</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Medication Summary */}
      {Object.keys(medicationFrequency).length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Medication History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(medicationFrequency)
              .sort((a, b) => b[1] - a[1])
              .map(([medication, count]) => (
                <div key={medication} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-foreground text-sm font-medium">{medication}</span>
                  <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                    {count} prescription{count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("timeline")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "timeline"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          Timeline View
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          List View
        </button>
      </div>

      {/* Visit History */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <FileText className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-card-foreground">Visit History</h3>
        </div>

        <div className="p-4">
          {sortedVisits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No visits found for this patient.</p>
          ) : viewMode === "timeline" ? (
            <div className="space-y-4">
              {sortedVisits.map((visit, index) => (
                <div key={visit.id} className="relative">
                  {/* Timeline line */}
                  {index !== sortedVisits.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Timeline item */}
                  <button onClick={() => onVisitSelect?.(visit)} className="w-full text-left relative">
                    {/* Timeline dot */}
                    <div className="flex gap-4">
                      <div className="relative flex flex-col items-center pt-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 z-10 ${
                            visit.status === "COMPLETED"
                              ? "bg-primary border-primary"
                              : visit.status === "IN_PROGRESS"
                                ? "bg-accent border-accent"
                                : "bg-secondary border-secondary"
                          }`}
                        />
                      </div>

                      <div className="flex-1 pb-4">
                        <div className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground">{visit.visitDate}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {visit.departments?.map(d => d.department?.name).filter(Boolean).join(', ') || "General visit"}
                              </p>
                            </div>
                            <Badge
                              variant={visit.status === "COMPLETED" ? "default" : visit.status === "IN_PROGRESS" ? "outline" : "secondary"}
                            >
                              {visit.status}
                            </Badge>
                          </div>

                          {expandedVisit === visit.id && (
                            <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm">
                              {visit.departments?.map((dept) => (
                                <div key={dept.id}>
                                  <p className="text-xs text-muted-foreground font-medium mb-1">{dept.department?.name}</p>
                                  {dept.diagnostics && dept.diagnostics.length > 0 && (
                                    <div className="mb-2">
                                      <p className="text-xs text-muted-foreground">Diagnoses:</p>
                                      <ul className="list-disc pl-4">
                                        {dept.diagnostics.map((d) => (
                                          <li key={d.id} className="text-xs text-foreground">{d.diagnosisName}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {dept.medications && dept.medications.length > 0 && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">Medications:</p>
                                      <ul className="list-disc pl-4">
                                        {dept.medications.map((m) => (
                                          <li key={m.id} className="text-xs text-foreground">{m.medicationName}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setExpandedVisit(expandedVisit === visit.id ? null : visit.id)
                            }}
                            className="text-xs text-primary hover:underline mt-2"
                          >
                            {expandedVisit === visit.id ? "Hide" : "View"} Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedVisits.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => onVisitSelect?.(visit)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{visit.visitDate}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {visit.departments?.map(d => d.department?.name).filter(Boolean).join(', ') || "General visit"}
                      </p>
                    </div>
                    <Badge
                      variant={visit.status === "COMPLETED" ? "default" : visit.status === "IN_PROGRESS" ? "outline" : "secondary"}
                    >
                      {visit.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
