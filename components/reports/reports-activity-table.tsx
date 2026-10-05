"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  Download,
  Filter,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Stethoscope,
  HeartPulse,
  Receipt,
  Calendar,
  Layers,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserActivityItem } from "@/lib/user-reports-calculator"
import { formatRWF } from "@/lib/utils"

interface ReportsActivityTableProps {
  activities: UserActivityItem[]
  title?: string | null
  description?: string | null
  hideTitle?: boolean
}

const ITEMS_PER_PAGE = 15

export function ReportsActivityTable({
  activities,
  title = "Activity Audit Log",
  description = "Detailed log of all individual interactions, records, and dispatches performed by you",
  hideTitle = false,
}: ReportsActivityTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Role filter
      if (roleFilter !== "ALL" && act.role !== roleFilter) {
        return false
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchesPatient = act.patientName.toLowerCase().includes(query)
        const matchesId = (act.patientIdentifier || "").toLowerCase().includes(query)
        const matchesDept = (act.departmentName || "").toLowerCase().includes(query)
        const matchesDetails = act.details.toLowerCase().includes(query)
        const matchesAction = act.actionType.toLowerCase().includes(query)
        return matchesPatient || matchesId || matchesDept || matchesDetails || matchesAction
      }

      return true
    })
  }, [activities, roleFilter, searchTerm])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE))
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredActivities.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredActivities, currentPage])

  // Reset page when search or filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val)
    setCurrentPage(1)
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredActivities.length) return

    const headers = ["Timestamp", "Role", "Action Type", "Patient Name", "Patient ID", "Department", "Details", "Amount (RWF)", "Status"]
    const rows = filteredActivities.map((item) => [
      `"${new Date(item.timestamp).toLocaleString()}"`,
      `"${item.role}"`,
      `"${item.actionType.replace(/"/g, '""')}"`,
      `"${item.patientName.replace(/"/g, '""')}"`,
      `"${item.patientIdentifier || item.patientId || ""}"`,
      `"${(item.departmentName || "").replace(/"/g, '""')}"`,
      `"${item.details.replace(/"/g, '""')}"`,
      item.amount != null ? item.amount : "",
      `"${item.status || ""}"`,
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `user-activity-report-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "RECEPTION":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 font-medium">
            <UserCheck className="h-3 w-3" />
            Reception
          </Badge>
        )
      case "CLINICIAN":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 font-medium">
            <Stethoscope className="h-3 w-3" />
            Clinician
          </Badge>
        )
      case "NURSE":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 gap-1 font-medium">
            <HeartPulse className="h-3 w-3" />
            Nurse
          </Badge>
        )
      case "FINANCE":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 gap-1 font-medium">
            <Receipt className="h-3 w-3" />
            Finance
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border gap-1 font-medium">
            <Layers className="h-3 w-3" />
            {role}
          </Badge>
        )
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
    <div className="bg-card/90 backdrop-blur-xl border border-border/70 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
      {/* Header & Controls */}
      {!hideTitle && (title || description) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredActivities.length === 0}
              className="h-9 px-3 gap-1.5 border-border/80 text-foreground hover:bg-muted/80 rounded-xl text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient, department, action or notes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 h-9 text-xs rounded-xl bg-background/60 border-border/70 placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="h-9 text-xs rounded-xl bg-background/60 border-border/70 text-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Roles" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/80 bg-card/95 backdrop-blur-xl">
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="RECEPTION">Reception</SelectItem>
              <SelectItem value="CLINICIAN">Clinician</SelectItem>
              <SelectItem value="NURSE">Nursing & Triage</SelectItem>
              <SelectItem value="FINANCE">Billing & Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hideTitle && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filteredActivities.length === 0}
            className="h-9 px-3 gap-1.5 border-border/80 text-foreground hover:bg-muted/80 rounded-xl text-xs font-medium shrink-0 w-full sm:w-auto"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Table Container */}
      {filteredActivities.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-2">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">No matching activity records</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Try adjusting your search criteria or date filter range.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground font-medium">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Department / Service</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-foreground">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(item.timestamp)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{getRoleBadge(item.role)}</td>
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{item.actionType}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">{item.patientName}</div>
                    {item.patientIdentifier && (
                      <div className="text-[12px] text-muted-foreground font-mono">
                        {item.patientIdentifier}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.departmentName || "—"}</td>
                  <td className="py-3 px-4 max-w-[280px] truncate text-muted-foreground" title={item.details}>
                    {item.details}
                  </td>
                  <td className="py-3 px-4 text-right font-medium whitespace-nowrap">
                    {item.amount != null && item.amount > 0 ? formatRWF(item.amount) : "—"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {item.status ? (
                      <Badge
                        variant="outline"
                        className="text-[11px] uppercase tracking-wider py-0 px-1.5 border-border/80 text-muted-foreground"
                      >
                        {item.status}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredActivities.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{filteredActivities.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-border/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 rounded-lg border-border/70"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
