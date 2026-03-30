"use client"

import { useState, useEffect } from "react"
import type { Patient, Consultation } from "@/lib/types"
import { useActions, useConsumables, useAddActionToVisitDepartment, useAddConsumableToVisitDepartment, useCompleteVisitDepartment, useProcessVisitDepartment, useRemoveActionFromVisitDepartment, useRemoveConsumableFromVisitDepartment } from "@/hooks/auth-hooks"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "react-toastify"
import { History, Check, ChevronsUpDown, X, CheckCircle } from "lucide-react"
import { formatDate, formatDateOnly } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ConsultationViewProps {
  consultation: Consultation
  patient: Patient
  onSave: (consultation: Consultation) => void
  onBack: () => void
  patientsList: Patient[]
  setPatientsList: (patients: Patient[]) => void
  visitId?: string
  departmentId?: string
  initialActions?: any[]
  initialConsumables?: any[]
}

export default function ConsultationView({
  consultation,
  patient,
  onSave,
  onBack,
  visitId,
  departmentId,
  initialActions = [],
  initialConsumables = [],
}: ConsultationViewProps) {
  const { actions, fetchActions } = useActions()
  const { consumables, fetchConsumables } = useConsumables()
  const { addAction } = useAddActionToVisitDepartment()
  const { addConsumable } = useAddConsumableToVisitDepartment()
  const { completeDepartment } = useCompleteVisitDepartment()
  const { processDepartment } = useProcessVisitDepartment()
  const { removeAction } = useRemoveActionFromVisitDepartment()
  const { removeConsumable } = useRemoveConsumableFromVisitDepartment()
  
  const [selectedActionId, setSelectedActionId] = useState<string>("")
  const [selectedConsumableId, setSelectedConsumableId] = useState<string>("")
  const [actionQty, setActionQty] = useState<number>(1)
  const [consumableQty, setConsumableQty] = useState<number>(1)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [actionSearch, setActionSearch] = useState("")
  const [consumableSearch, setConsumableSearch] = useState("")
  const [actionOpen, setActionOpen] = useState(false)
  const [consumableOpen, setConsumableOpen] = useState(false)
  const [addedActions, setAddedActions] = useState<any[]>(initialActions)
  const [addedConsumables, setAddedConsumables] = useState<any[]>(initialConsumables)

  // Process department on mount to get fresh data with existing actions/consumables
  useEffect(() => {
    if (visitId && departmentId) {
      processDepartment(visitId, departmentId).then((result) => {
        if (result?.data?.departments?.[0]) {
          const department = result.data.departments[0]
          if (department.actions && department.actions.length > 0) {
            setAddedActions(department.actions)
          }
          if (department.consumables && department.consumables.length > 0) {
            setAddedConsumables(department.consumables)
          }
        }
      }).catch((err) => {
        console.error('Error processing department on mount:', err)
      })
    }
  }, [visitId, departmentId])

  // Debounced search for actions
  useEffect(() => {
    if (actionOpen) {
      const timer = setTimeout(() => {
        fetchActions(actionSearch || undefined)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [actionSearch, actionOpen])

  // Debounced search for consumables
  useEffect(() => {
    if (consumableOpen) {
      const timer = setTimeout(() => {
        fetchConsumables(consumableSearch || undefined)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [consumableSearch, consumableOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Quick Add: Actions & Consumables */}
      {visitId && departmentId && (
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Add Action</h3>
              <div className="flex gap-2 items-center">
                <Popover open={actionOpen} onOpenChange={setActionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={actionOpen}
                      className="w-64 justify-between"
                    >
                      {selectedActionId
                        ? actions.find((action) => String(action.id) === selectedActionId)?.name
                        : "Select action..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search actions..." 
                        value={actionSearch}
                        onValueChange={setActionSearch}
                      />
                      <CommandEmpty>No action found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {actions.map((action) => (
                          <CommandItem
                            key={action.id}
                            value={String(action.id)}
                            onSelect={() => {
                              setSelectedActionId(String(action.id))
                              setActionOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedActionId === String(action.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {action.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input type="number" className="w-20" value={actionQty} min={1} onChange={e => setActionQty(parseInt(e.target.value || '1'))} />
                <Button
                  disabled={!selectedActionId}
                  onClick={async () => {
                    try {
                      const result = await addAction(visitId, departmentId, selectedActionId, actionQty)
                      if (result?.data?.departments?.[0]?.actions) {
                        setAddedActions(result.data.departments[0].actions)
                      }
                      setSelectedActionId("")
                      setActionQty(1)
                      toast.success('Action added')
                    } catch {
                      toast.error('Failed to add action')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Add Consumable</h3>
              <div className="flex gap-2 items-center">
                <Popover open={consumableOpen} onOpenChange={setConsumableOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={consumableOpen}
                      className="w-64 justify-between"
                    >
                      {selectedConsumableId
                        ? consumables.find((consumable) => String(consumable.id) === selectedConsumableId)?.name
                        : "Select consumable..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search consumables..." 
                        value={consumableSearch}
                        onValueChange={setConsumableSearch}
                      />
                      <CommandEmpty>No consumable found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {consumables.map((consumable) => (
                          <CommandItem
                            key={consumable.id}
                            value={String(consumable.id)}
                            onSelect={() => {
                              setSelectedConsumableId(String(consumable.id))
                              setConsumableOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedConsumableId === String(consumable.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {consumable.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input type="number" className="w-20" value={consumableQty} min={1} onChange={e => setConsumableQty(parseInt(e.target.value || '1'))} />
                <Button
                  disabled={!selectedConsumableId}
                  onClick={async () => {
                    try {
                      const result = await addConsumable(visitId, departmentId, selectedConsumableId, consumableQty)
                      if (result?.data?.departments?.[0]?.consumables) {
                        setAddedConsumables(result.data.departments[0].consumables)
                      }
                      setSelectedConsumableId("")
                      setConsumableQty(1)
                      toast.success('Consumable added')
                    } catch {
                      toast.error('Failed to add consumable')
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Added Actions & Consumables List */}
          {(addedActions.length > 0 || addedConsumables.length > 0) && (
            <div className="mt-4 border-t border-border pt-4">
              {addedActions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">Added Actions</h3>
                  <div className="space-y-2">
                    {addedActions.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.action?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">Qty:</p>
                            <div className="flex items-center gap-1 border border-border rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={async () => {
                                  if (item.quantity > 1) {
                                    try {
                                      const newQuantity = item.quantity - 1
                                      const result = await addAction(visitId, departmentId, item.action.id, newQuantity)
                                      if (result?.data?.departments?.[0]?.actions) {
                                        setAddedActions(result.data.departments[0].actions)
                                      }
                                    } catch (err) {
                                      toast.error('Failed to update quantity')
                                      console.error(err)
                                    }
                                  }
                                }}
                              >
                                -
                              </Button>
                              <span className="px-2 text-xs font-medium min-w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={async () => {
                                  try {
                                    const newQuantity = item.quantity + 1
                                    const result = await addAction(visitId, departmentId, item.action.id, newQuantity)
                                    if (result?.data?.departments?.[0]?.actions) {
                                      setAddedActions(result.data.departments[0].actions)
                                    }
                                  } catch (err) {
                                    toast.error('Failed to update quantity')
                                    console.error(err)
                                  }
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            ${(item.action?.privatePrice * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                              try {
                                await removeAction(visitId, departmentId, item.id)
                                setAddedActions(addedActions.filter(a => a.id !== item.id))
                                toast.success('Action removed')
                              } catch (err) {
                                toast.error('Failed to remove action')
                                console.error(err)
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {addedConsumables.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Added Consumables</h3>
                  <div className="space-y-2">
                    {addedConsumables.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.consumable?.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">Qty:</p>
                            <div className="flex items-center gap-1 border border-border rounded">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={async () => {
                                  if (item.quantity > 1) {
                                    try {
                                      const newQuantity = item.quantity - 1
                                      const result = await addConsumable(visitId, departmentId, item.consumable.id, newQuantity)
                                      if (result?.data?.departments?.[0]?.consumables) {
                                        setAddedConsumables(result.data.departments[0].consumables)
                                      }
                                    } catch (err) {
                                      toast.error('Failed to update quantity')
                                      console.error(err)
                                    }
                                  }
                                }}
                              >
                                -
                              </Button>
                              <span className="px-2 text-xs font-medium min-w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={async () => {
                                  try {
                                    const newQuantity = item.quantity + 1
                                    const result = await addConsumable(visitId, departmentId, item.consumable.id, newQuantity)
                                    if (result?.data?.departments?.[0]?.consumables) {
                                      setAddedConsumables(result.data.departments[0].consumables)
                                    }
                                  } catch (err) {
                                    toast.error('Failed to update quantity')
                                    console.error(err)
                                  }
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            ${(item.consumable?.privatePrice * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                              try {
                                await removeConsumable(visitId, departmentId, item.id)
                                setAddedConsumables(addedConsumables.filter(a => a.id !== item.id))
                                toast.success('Consumable removed')
                              } catch (err) {
                                toast.error('Failed to remove consumable')
                                console.error(err)
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Complete Visit Button */}
      {visitId && departmentId && (
        <button
          onClick={async () => {
            try {
              await completeDepartment(visitId, departmentId)
              toast.success('Visit completed!')
              setTimeout(() => onBack(), 1000)
            } catch {
              toast.error('Failed to complete visit')
            }
          }}
          className="fixed bottom-6 left-6 flex items-center gap-2 px-6 py-3 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold"
        >
          <CheckCircle className="w-5 h-5" />
          Complete Visit
        </button>
      )}

      {!historyOpen && (
        <button
          onClick={() => {
            setSelectedVisit(null)
            setHistoryOpen(true)
          }}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <History className="w-5 h-5" />
          Patient History
        </button>
      )}

      {historyOpen && (
        <div className="fixed top-16 right-6 z-50 w-[420px] bg-card border border-border rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Previous Visits</h2>
                <p className="text-xs text-muted-foreground">
                  {zoomedOut ? "Click a date to view visits" : "Newest first"}
                </p>
              </div>
              <button
                onClick={() => {
                  setZoomedOut(!zoomedOut)
                  setSelectedDate(null)
                  setSelectedVisit(null)
                }}
                className="p-2 rounded-md bg-muted hover:bg-muted/70 transition-colors relative group"
                aria-label="Timeline view"
              >
                <Calendar className="w-4 h-4" />
                <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs bg-muted text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Timeline View
                </span>
              </button>
            </div>
            <button onClick={() => setHistoryOpen(false)} className="p-2 rounded-lg hover:bg-muted/70 text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          

          {zoomedOut && (
            <div className="p-4 overflow-y-auto max-h-[70vh] space-y-2 transition-opacity duration-300">
              {visitsByDate.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No visits</p>
              ) : (
                visitsByDate.map((item) => (
                  <button
                    key={item.date}
                    onClick={() => {
                      setSelectedDate(item.date)
                      setZoomedOut(false)
                    }}
                    className="w-full text-left p-3 rounded-lg border border-border bg-card/50 hover:bg-muted transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <Badge variant="secondary">{item.count} visit{item.count > 1 ? "s" : ""}</Badge>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {!zoomedOut && (
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto overflow-x-hidden transition-opacity duration-300">
              {filteredVisits.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">No visits</p>
              ) : (
                filteredVisits.map((v) => (
                  <div key={v.id} className="border border-border rounded-lg p-3 bg-card/50 transition-all duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{v.chiefComplaint || "Visit"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{v.date}</p>
                        {v.diagnosis && <p className="text-xs text-muted-foreground mt-1 truncate">Dx: {v.diagnosis}</p>}
                      </div>
                      {v.status === "completed" ? (
                        <div className="flex-shrink-0 relative group" title="Completed">
                          <div className="p-1.5 rounded-full bg-primary/20">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                          <span className="absolute right-0 top-full mt-1 px-2 py-1 rounded text-xs bg-primary text-primary-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <Badge variant={v.status === "ongoing" ? "outline" : "secondary"}>
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex justify-end">
                      {selectedVisit?.id === v.id ? (
                        <button
                          onClick={() => setSelectedVisit(null)}
                          className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 transition-colors flex items-center gap-2"
                          aria-label="Minimize details"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedVisit(v)}
                          className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 transition-colors relative group flex items-center gap-1"
                          aria-label="More details"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground opacity-60 dot1" />
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground opacity-60 dot2" />
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground opacity-60 dot3" />
                          <span className="absolute -top-7 right-0 px-2 py-1 rounded text-xs bg-muted text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            More
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedVisit && (
            <div className="max-h-[70vh] overflow-y-auto transition-all duration-300">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{selectedVisit.chiefComplaint || "Visit"}</p>
                  <p className="text-xs text-muted-foreground">{selectedVisit.date}</p>
                </div>
                <button onClick={() => setSelectedVisit(null)} className="px-3 py-1.5 rounded-md text-sm bg-muted hover:bg-muted/70">
                  Back
                </button>
              </div>
              <div className="p-4 space-y-4">
                {selectedVisit.diagnosis && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">Diagnosis</h3>
                    <p className="text-sm text-card-foreground">{selectedVisit.diagnosis}</p>
                  </div>
                )}
                {selectedVisit.prescriptions.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-foreground mb-2">Treatment</h3>
                    <div className="space-y-1 text-sm text-card-foreground">
                      {selectedVisit.prescriptions.map((p) => (
                        <p key={p.id}>• {p.medication || p.type}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes dotPulse {
          0% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 0.35; transform: translateY(0); }
        }
        .dot1 { animation: dotPulse 1.6s infinite ease-in-out; animation-delay: 0s; }
        .dot2 { animation: dotPulse 1.6s infinite ease-in-out; animation-delay: 0.2s; }
        .dot3 { animation: dotPulse 1.6s infinite ease-in-out; animation-delay: 0.4s; }
      `}</style>

      {/* Main Consultation Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Patient & Consultation Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{patient.name}</h1>
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>Age: {patient.age}</div>
                  <div>Gender: {patient.gender}</div>
                  <div>DOB: {formatDateOnly(patient.dateOfBirth)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="space-y-6">
            {/* Chief Complaint */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Chief Complaint</h2>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                defaultValue={consultation.chiefComplaint}
                placeholder="Describe the chief complaint..."
              />
            </div>

            {/* History */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">History</h2>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                defaultValue={consultation.history}
                placeholder="Medical history..."
              />
            </div>

            {/* Vital Signs */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Vital Signs</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">BP</label>
                  <input type="text" className="w-full p-2 border border-border rounded bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">HR</label>
                  <input type="number" className="w-full p-2 border border-border rounded bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Temp</label>
                  <input type="number" className="w-full p-2 border border-border rounded bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">O2 Sat</label>
                  <input type="number" className="w-full p-2 border border-border rounded bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">RR</label>
                  <input type="number" className="w-full p-2 border border-border rounded bg-background text-foreground" />
                </div>
              </div>
            </div>

            {/* Examination Findings */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Examination Findings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Visual Acuity OD" className="p-2 border border-border rounded bg-background text-foreground" />
                <input type="text" placeholder="Visual Acuity OS" className="p-2 border border-border rounded bg-background text-foreground" />
                <input type="text" placeholder="Pupillary Reaction" className="p-2 border border-border rounded bg-background text-foreground" />
                <input type="text" placeholder="Extraocular Movements" className="p-2 border border-border rounded bg-background text-foreground" />
                <input type="text" placeholder="Intraocular Pressure" className="p-2 border border-border rounded bg-background text-foreground" />
                <input type="text" placeholder="Anterior Segment" className="p-2 border border-border rounded bg-background text-foreground" />
                <textarea
                  placeholder="Other Findings"
                  className="col-span-2 p-2 border border-border rounded bg-background text-foreground"
                  rows={2}
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Diagnosis</h2>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                defaultValue={consultation.diagnosis}
                placeholder="Diagnosis..."
              />
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Notes</h2>
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={() => onSave(consultation)}>
                Save Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* History Button */}
      {!historyOpen && (
        <button
          onClick={() => setHistoryOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <History className="w-5 h-5" />
          Patient History
        </button>
      )}
    </div>
  )
}
