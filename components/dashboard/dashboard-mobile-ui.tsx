"use client"

import { Plus, Search, Stethoscope, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Visit } from "@/hooks/auth-hooks"

interface DashboardMobileUiProps {
  canSeeRegisterAndCreate: boolean
  allVisits: Visit[]
  searchQuery: string
  setSearchQuery: (value: string) => void
  mobileSearchActive: boolean
  setMobileSearchActive: (value: boolean) => void
  showMobileActionSheet: boolean
  setShowMobileActionSheet: (value: boolean) => void
  setShowPatientRegistrationModal: (value: boolean) => void
  openVisitCreationModal: () => void
}

export function DashboardMobileUi({
  canSeeRegisterAndCreate,
  allVisits,
  searchQuery,
  setSearchQuery,
  mobileSearchActive,
  setMobileSearchActive,
  showMobileActionSheet,
  setShowMobileActionSheet,
  setShowPatientRegistrationModal,
  openVisitCreationModal,
}: DashboardMobileUiProps) {
  const matchedVisits = allVisits.filter((visit) =>
    `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {mobileSearchActive && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center gap-2 p-4 border-b border-border/30">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3 bg-card/80 dark:bg-slate-900/70 backdrop-blur-sm border border-border/50 dark:border-slate-800 rounded-full text-foreground dark:text-slate-100 placeholder-muted-foreground dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
              />
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="rounded-full h-10 w-10 flex-shrink-0"
              onClick={() => {
                setMobileSearchActive(false)
                setSearchQuery("")
              }}
              title="Close"
              aria-label="Close search"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {searchQuery ? (
              <div className="divide-y divide-border/30">
                {matchedVisits.map((visit) => (
                  <button
                    key={visit.id}
                    onClick={() => {
                      setSearchQuery(`${visit.patient.firstName} ${visit.patient.lastName}`)
                      setMobileSearchActive(false)
                    }}
                    className="w-full px-4 py-4 text-left hover:bg-muted/50 active:bg-muted/70 transition-colors"
                  >
                    <p className="font-medium text-foreground text-base">
                      {visit.patient.firstName} {visit.patient.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(visit.visitDate).toLocaleDateString()}</p>
                  </button>
                ))}
                {matchedVisits.length === 0 && (
                  <p className="px-4 py-8 text-center text-muted-foreground">No patients found</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">Start typing to search patients</p>
              </div>
            )}
          </div>
        </div>
      )}

      {canSeeRegisterAndCreate && !mobileSearchActive && (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowMobileActionSheet(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      <AlertDialog open={showMobileActionSheet} onOpenChange={setShowMobileActionSheet}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What would you like to do?</AlertDialogTitle>
            <AlertDialogDescription>
              Create a new patient record or start a visit for an existing patient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3">
            <AlertDialogAction
              onClick={() => {
                setShowMobileActionSheet(false)
                setShowPatientRegistrationModal(true)
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register New Patient
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowMobileActionSheet(false)
                openVisitCreationModal()
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Create Visit
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}