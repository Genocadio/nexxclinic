"use client"

import { useState } from "react"
import {
  mockRecords,
  mockCarePlans,
  mockPatientAlerts,
  generateScheduledTasks,
  type ConsultationRecord,
  type CarePlan,
  type PatientAlert,
} from "@/lib/mock-data"
import { TimelineView } from "@/components/timeline-view"
import { DocumentView } from "@/components/document-view"
import { DetailsView } from "@/components/details-view"
import { AddRecordDialog } from "@/components/add-record-dialog"
import { FloatingCarePlansButton } from "@/components/floating-care-plans-button"
import { FloatingAlertsButton } from "@/components/floating-alerts-button"
import { CarePlanDialog } from "@/components/care-plan-dialog"
import { PatientAlertDialog } from "@/components/patient-alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, FileText } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function ConsultationForm() {
  const [records, setRecords] = useState<ConsultationRecord[]>(mockRecords)
  const [carePlans, setCarePlans] = useState<CarePlan[]>(mockCarePlans)
  const [patientAlerts, setPatientAlerts] = useState<PatientAlert[]>(mockPatientAlerts)
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ConsultationRecord | null>(null)
  const [viewMode, setViewMode] = useState<"timeline" | "document">("timeline")
  const [carePlanDialogOpen, setCarePlanDialogOpen] = useState(false)
  const [editingCarePlan, setEditingCarePlan] = useState<CarePlan | null>(null)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const currentUserRole: "Doctor" | "Nurse" = "Doctor"

  const scheduledTasks = generateScheduledTasks(carePlans)
  
  // Get admission time from first record
  const admissionTime = records.length > 0 ? records[0].admissionTime : null
  // Check if patient is discharged
  const isDischargedRecord = records.find((r) => r.isCompleted)
  const dischargeTime = isDischargedRecord?.dischargeTime

  const handleAddRecord = (record: ConsultationRecord) => {
    if (editingRecord) {
      setRecords(records.map((r) => (r.id === record.id ? record : r)))
      setEditingRecord(null)
    } else {
      setRecords([...records, record])
    }
  }

  const handleEditRecord = (record: ConsultationRecord) => {
    setEditingRecord(record)
    setDialogOpen(true)
  }

  const handleSaveCarePlan = (plan: CarePlan) => {
    if (editingCarePlan) {
      setCarePlans(carePlans.map((p) => (p.id === plan.id ? plan : p)))
      setEditingCarePlan(null)
    } else {
      setCarePlans([...carePlans, plan])
    }
  }

  const handleEditCarePlan = (plan: CarePlan) => {
    setEditingCarePlan(plan)
    setCarePlanDialogOpen(true)
  }

  const handleCreateCarePlan = () => {
    setEditingCarePlan(null)
    setCarePlanDialogOpen(true)
  }

  const handleDischarge = () => {
    const dischargeRecord: ConsultationRecord = {
      id: Date.now().toString(),
      timestamp: new Date(),
      createdBy: "Current User",
      role: "Doctor",
      summary: "Patient discharged",
      items: [
        {
          id: `item-${Date.now()}`,
          type: "products",
          details: {
            "Product Type": "action",
            "Action Type": "discharge",
            Action: "Patient Discharge",
            Reason: "Patient discharged by physician",
          },
        },
      ],
      admissionTime: records[0]?.admissionTime,
      dischargeTime: new Date(),
      isCompleted: true,
      editable: false,
    }
    setRecords([...records, dischargeRecord])
  }

  const handleSaveAlert = (alert: PatientAlert) => {
    setPatientAlerts([...patientAlerts, alert])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Patient Card */}
      <div className="fixed top-4 left-4 z-40">
        <div className="group">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 w-48 group-hover:w-64">
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">John Doe</p>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs">
                  Inpatient Admit
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Age: 45 years • Male</p>
                <p>MRN: 12345678</p>
              </div>
              
              {/* Expandable Details on Hover */}
              <div className="hidden group-hover:block pt-3 border-t space-y-2 text-xs">
                <div>
                  <p className="font-semibold text-foreground">Admission</p>
                  <p className="text-muted-foreground">Type: Inpatient Admit</p>
                  <p className="text-muted-foreground">Time: {admissionTime ? format(admissionTime, "MMM dd h:mm a") : "—"}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Insurance</p>
                  <p className="text-muted-foreground">Blue Cross Blue Shield</p>
                  <p className="text-muted-foreground">Policy: BC123456</p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold">
                    Status:{" "}
                    {dischargeTime ? (
                      <span className="text-green-600 dark:text-green-400">Discharged</span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400">Active</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <FloatingCarePlansButton
        tasks={scheduledTasks}
        carePlans={carePlans}
        currentUserRole={currentUserRole}
        onCreatePlan={handleCreateCarePlan}
        onEditPlan={handleEditCarePlan}
      />

      <FloatingAlertsButton
        alerts={patientAlerts}
        currentUserRole={currentUserRole}
        onCreateAlert={() => setAlertDialogOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={viewMode === "document" ? "lg:col-span-3" : "lg:col-span-2"}>
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center justify-center gap-4">
                  <CardTitle className="text-center">Consultation Records</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "timeline" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("timeline")}
                      className="gap-2"
                    >
                      <List className="h-4 w-4" />
                      Timeline
                    </Button>
                    <Button
                      variant={viewMode === "document" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("document")}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Document
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-12">
                {viewMode === "timeline" ? (
                  <TimelineView
                    records={records}
                    onSelectRecord={setSelectedRecord}
                    onEditRecord={handleEditRecord}
                    onAddRecord={() => setDialogOpen(true)}
                    onDischarge={handleDischarge}
                    admissionTime={admissionTime || undefined}
                    isDoctor={currentUserRole === "Doctor"}
                    isPatientDischarged={!!dischargeTime}
                  />
                ) : (
                  <DocumentView 
                    records={records} 
                    onEditRecord={handleEditRecord} 
                    onAddRecord={() => setDialogOpen(true)}
                    onDischarge={handleDischarge}
                    isDoctor={currentUserRole === "Doctor"}
                    isPatientDischarged={!!dischargeTime}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {viewMode === "timeline" && (
            <div className="lg:col-span-1">
              {selectedRecord ? (
                <DetailsView
                  record={selectedRecord}
                  onClose={() => setSelectedRecord(null)}
                  onEdit={handleEditRecord}
                />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Select a record from the timeline to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <AddRecordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddRecord={handleAddRecord}
        editingRecord={editingRecord}
        admissionTime={admissionTime || undefined}
      />

      <CarePlanDialog
        open={carePlanDialogOpen}
        onOpenChange={setCarePlanDialogOpen}
        onSave={handleSaveCarePlan}
        editingPlan={editingCarePlan}
      />

      <PatientAlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen} onSave={handleSaveAlert} />
    </div>
  )
}
