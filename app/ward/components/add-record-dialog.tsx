"use client"

import { useState, useEffect } from "react"
import type { RecordType, ConsultationRecord, ScheduledTask, RecordItem } from "../lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle2, X, Clock } from "lucide-react"

interface AddRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddRecord: (record: ConsultationRecord) => void
  editingRecord?: ConsultationRecord | null
  pendingTasks?: ScheduledTask[]
  admissionTime?: Date
}

export function AddRecordDialog({
  open,
  onOpenChange,
  onAddRecord,
  editingRecord,
  pendingTasks = [],
  admissionTime,
}: AddRecordDialogProps) {
  const [recordSummary, setRecordSummary] = useState("")
  const [items, setItems] = useState<RecordItem[]>([])
  const [currentItemType, setCurrentItemType] = useState<RecordType>("vital-signs")
  const [currentItemData, setCurrentItemData] = useState<Record<string, string>>({})
  const [recordTime, setRecordTime] = useState<Date>(new Date())
  const [timePickerOpen, setTimePickerOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setRecordSummary("")
      setItems([])
      setCurrentItemType("vital-signs")
      setCurrentItemData({})
      setRecordTime(new Date())
      setTimePickerOpen(false)
    } else {
      setRecordTime(new Date())
    }
  }, [open])

  const handleAddItem = () => {
    if (Object.keys(currentItemData).length === 0) return

    const newItem: RecordItem = {
      id: `item-${Date.now()}`,
      type: currentItemType,
      details: { ...currentItemData },
    }

    setItems([...items, newItem])
    setCurrentItemData({})
    setCurrentItemType("vital-signs")
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0 || !recordSummary.trim()) return

    const hasDischarge = items.some(
      (item) =>
        item.type === "products" &&
        item.details["Product Type"] === "action" &&
        item.details["Action Type"] === "discharge",
    )

    const newRecord: ConsultationRecord = {
      id: editingRecord?.id || Date.now().toString(),
      timestamp: recordTime,
      createdBy: "Current User",
      role: "Doctor",
      summary: recordSummary,
      items,
      admissionTime: editingRecord?.admissionTime || admissionTime,
      dischargeTime: hasDischarge ? recordTime : editingRecord?.dischargeTime,
      isCompleted: hasDischarge,
      editable: !hasDischarge,
    }

    onAddRecord(newRecord)
    setRecordSummary("")
    setItems([])
    setCurrentItemData({})
    onOpenChange(false)
  }

  const renderFormFields = () => {
    switch (currentItemType) {
      case "vital-signs":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="bp">Blood Pressure</Label>
              <Input
                id="bp"
                placeholder="120/80 mmHg"
                value={currentItemData["Blood Pressure"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, "Blood Pressure": e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr">Heart Rate</Label>
              <Input
                id="hr"
                placeholder="72 bpm"
                value={currentItemData["Heart Rate"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, "Heart Rate": e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temp">Temperature</Label>
              <Input
                id="temp"
                placeholder="98.6°F"
                value={currentItemData["Temperature"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Temperature: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="o2">Oxygen Saturation</Label>
              <Input
                id="o2"
                placeholder="98%"
                value={currentItemData["Oxygen Saturation"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, "Oxygen Saturation": e.target.value })}
              />
            </div>
          </>
        )
      case "medication":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="med">Medication</Label>
              <Input
                id="med"
                placeholder="Medication name"
                value={currentItemData["Medication"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Medication: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Input
                id="route"
                placeholder="Oral, IV, etc."
                value={currentItemData["Route"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Route: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="1 tablet"
                value={currentItemData["Dosage"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Dosage: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes"
                value={currentItemData["Notes"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Notes: e.target.value })}
              />
            </div>
          </>
        )
      case "exam":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="examType">Examination Type</Label>
              <Input
                id="examType"
                placeholder="Physical examination"
                value={currentItemData["Examination Type"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, "Examination Type": e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="findings">Findings</Label>
              <Textarea
                id="findings"
                placeholder="Examination findings"
                value={currentItemData["Findings"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Findings: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assessment">Assessment</Label>
              <Textarea
                id="assessment"
                placeholder="Clinical assessment"
                value={currentItemData["Assessment"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Assessment: e.target.value })}
              />
            </div>
          </>
        )
      case "note":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Note subject"
                value={currentItemData["Subject"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Enter your note"
                className="min-h-32"
                value={currentItemData["Note"] || ""}
                onChange={(e) => setCurrentItemData({ ...currentItemData, Note: e.target.value })}
              />
            </div>
          </>
        )
      case "products":
        const productType = (currentItemData["Product Type"] || "action") as "action" | "consumable"
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select
                value={productType}
                onValueChange={(value) => setCurrentItemData({ ...currentItemData, "Product Type": value })}
              >
                <SelectTrigger id="productType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {productType === "action" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="actionType">Action Type</Label>
                  <Select
                    value={currentItemData["Action Type"] || "standard"}
                    onValueChange={(value) => setCurrentItemData({ ...currentItemData, "Action Type": value })}
                  >
                    <SelectTrigger id="actionType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Action</SelectItem>
                      <SelectItem value="discharge">Patient Discharge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action">Action Taken</Label>
                  <Input
                    id="action"
                    placeholder={currentItemData["Action Type"] === "discharge" ? "Discharge notes" : "Action description"}
                    value={currentItemData["Action"] || ""}
                    onChange={(e) => setCurrentItemData({ ...currentItemData, Action: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder={currentItemData["Action Type"] === "discharge" ? "Reason for discharge" : "Reason for action"}
                    value={currentItemData["Reason"] || ""}
                    onChange={(e) => setCurrentItemData({ ...currentItemData, Reason: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Input
                    id="item"
                    placeholder="Consumable item"
                    value={currentItemData["Item"] || ""}
                    onChange={(e) => setCurrentItemData({ ...currentItemData, Item: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    placeholder="Quantity used"
                    value={currentItemData["Quantity"] || ""}
                    onChange={(e) => setCurrentItemData({ ...currentItemData, Quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Purpose of use"
                    value={currentItemData["Purpose"] || ""}
                    onChange={(e) => setCurrentItemData({ ...currentItemData, Purpose: e.target.value })}
                  />
                </div>
              </>
            )}
          </>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRecord ? "Edit Record" : "Add New Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Record Summary</Label>
            <Input
              id="summary"
              placeholder="Brief summary of the record (e.g., 'Morning round')"
              value={recordSummary}
              onChange={(e) => setRecordSummary(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Record Time
            </Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setTimePickerOpen(!timePickerOpen)}
              className="w-full justify-start text-left"
            >
              <Clock className="h-4 w-4 mr-2" />
              {recordTime.toDateString() === new Date().toDateString()
                ? `Today • ${format(recordTime, "h:mm a")}`
                : format(recordTime, "MMM dd, yyyy • h:mm a")}
            </Button>

            {timePickerOpen && (
              <div className="border rounded-lg p-3 space-y-3 bg-slate-50 dark:bg-slate-900">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={recordTime.toISOString().slice(0, 10)}
                    onChange={(e) => {
                      const newDate = new Date(recordTime)
                      const [year, month, day] = e.target.value.split("-").map(Number)
                      newDate.setFullYear(year, month - 1, day)
                      setRecordTime(newDate)
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemType">Entry Type</Label>
              <Select value={currentItemType} onValueChange={(value) => setCurrentItemType(value as RecordType)}>
                <SelectTrigger id="itemType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vital-signs">Vital Signs</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="products">Product / Action</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Record Summary</Label>
              <Input
                id="summary"
                placeholder="Record summary"
                value={recordSummary}
                onChange={(e) => setRecordSummary(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Add item details</p>
                <p className="text-xs text-muted-foreground">Choose the current entry type and fill the fields below.</p>
              </div>
              <Button type="button" onClick={handleAddItem} variant="outline">
                Add Item
              </Button>
            </div>

            <div className="rounded-2xl border border-border p-4 space-y-4">
              {renderFormFields()}
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold">Current items</p>
                <span className="text-xs text-muted-foreground">{items.length} item(s)</span>
              </div>
              <div className="grid gap-3">
                {items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border p-3 bg-background">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.type.replace("-", " ")}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          {Object.entries(item.details).map(([key, value]) => (
                            <div key={key}>{key}: {value}</div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
