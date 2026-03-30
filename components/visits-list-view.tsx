"use client"

import { useState } from "react"
import { useVisits, useDepartments, type Visit } from "@/hooks/auth-hooks"
import { useRouter } from "next/navigation"
import { Search, Calendar, Clock, CheckCircle, AlertCircle, User, ReceiptText, Plus, Stethoscope } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { AddDepartmentModal } from "./add-department-modal"

interface VisitsListViewProps {
  visits: Visit[]
  onVisitSelect: (visit: Visit) => void
  onConsultVisit: (visit: Visit) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  refetchVisits?: () => void
}

export default function VisitsListView({
  visits,
  onVisitSelect,
  onConsultVisit,
  searchQuery,
  onSearchChange,
  refetchVisits
}: VisitsListViewProps) {
  const router = useRouter()
  const { departments, refetch: refetchDepartments } = useDepartments()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)
  const [selectedVisitForDepartment, setSelectedVisitForDepartment] = useState<Visit | null>(null)

  const hasUnbilledItems = (visit: Visit) => {
    // Show bill button if not fully billed
    if (visit.billingStatus === 'BILLED') return false
    
    // Check if there are any unbilled items
    return visit.departments?.some((dept) =>
      dept.actions?.some((action) => action.paymentStatus === 'PENDING') ||
      dept.consumables?.some((consumable) => consumable.paymentStatus === 'PENDING')
    ) || false
  }

  const canAddDepartment = (visit: Visit) => {
    return visit.billingStatus !== 'BILLED' && visit.visitStatus !== 'IN_PROGRESS'
  }

  const handleAddDepartment = (visit: Visit) => {
    setSelectedVisitForDepartment(visit)
    setAddDepartmentModalOpen(true)
  }

  const handleAddDepartmentSuccess = () => {
    // Refetch visits and departments data after successful addition
    refetchVisits?.()
    refetchDepartments()
  }

  const handleGoToBilling = (visit: Visit) => {
    router.push(`/billing?visitId=${visit.id}&patientId=${visit.patient.id}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CREATED':
        return <AlertCircle className="w-4 h-4 text-secondary" />
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-accent" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-primary" />
      case 'CANCELLED':
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'text-secondary'
      case 'IN_PROGRESS':
        return 'text-accent'
      case 'COMPLETED':
        return 'text-primary'
      case 'CANCELLED':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div
      className="bg-card/70 dark:bg-transparent border border-border dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/40"
      style={isDark ? { backgroundColor: "#121827" } : undefined}
    >
      {/* Search bar */}
      <div className="p-6 border-b border-border dark:border-slate-800/80">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground dark:text-slate-300" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background dark:bg-[#1a2333] border border-border dark:border-slate-800 rounded-lg text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Visits list */}
      <div className="divide-y divide-border dark:divide-slate-800/80">
        {visits.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No visits found</p>
          </div>
        ) : (
          visits.map((visit) => (
            <div
              key={visit.id}
              onClick={() => onVisitSelect(visit)}
              className="p-4 hover:bg-muted/50 dark:bg-transparent dark:hover:bg-[#1b2535] dark:text-slate-100 cursor-pointer transition-colors"
              style={isDark ? { backgroundColor: "#121827" } : undefined}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(visit.visitStatus)}
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {visit.patient.firstName} {visit.patient.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 truncate">
                      Visit #{visit.id.slice(-8)} • {new Date(visit.visitDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end lg:justify-start lg:flex-nowrap">
                  {(visit.visitStatus === 'CREATED' || visit.visitStatus === 'IN_PROGRESS') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onConsultVisit(visit)
                      }}
                      title="Start Consult"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 sm:gap-2"
                    >
                      <Stethoscope className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline lg:hidden">Consult</span>
                      <span className="hidden lg:inline">Start Consult</span>
                    </button>
                  )}
                  {canAddDepartment(visit) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddDepartment(visit)
                      }}
                      title="Add Department"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline lg:hidden">Dept</span>
                      <span className="hidden lg:inline">Add Department</span>
                    </button>
                  )}
                  {hasUnbilledItems(visit) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGoToBilling(visit)
                      }}
                      title="Bill Visit"
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                    >
                      <ReceiptText className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline lg:hidden">Bill</span>
                      <span className="hidden lg:inline">Bill Visit</span>
                    </button>
                  )}
                  <div className="text-right text-xs sm:text-sm ml-auto lg:ml-0 dark:text-slate-100">
                    <span className={`font-medium ${getStatusColor(visit.visitStatus)}`}>
                      {visit.visitStatus === 'IN_PROGRESS' ? 'In Progress' : visit.visitStatus}
                    </span>
                    <p className="text-xs text-muted-foreground dark:text-slate-300 mt-1">
                      {visit.patient.gender} • {new Date().getFullYear() - new Date(visit.patient.dateOfBirth).getFullYear()} years old
                    </p>
                  </div>
                </div>
              </div>
              {visit.visitNotes.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground dark:text-slate-200">
                  {visit.visitNotes[0].text.length > 100
                    ? `${visit.visitNotes[0].text.slice(0, 100)}...`
                    : visit.visitNotes[0].text
                  }
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Add Department Modal */}
      {selectedVisitForDepartment && (
        <AddDepartmentModal
          visit={selectedVisitForDepartment}
          departments={departments || []}
          isOpen={addDepartmentModalOpen}
          onClose={() => {
            setAddDepartmentModalOpen(false)
            setSelectedVisitForDepartment(null)
          }}
          onSuccess={handleAddDepartmentSuccess}
        />
      )}
    </div>
  )
}