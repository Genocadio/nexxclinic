"use client"

import { useState, useEffect } from "react"
import type { CarePlan, RecordType } from "../lib/mock-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface CarePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (plan: CarePlan) => void
  editingPlan?: CarePlan | null
}

export function CarePlanDialog({ open, onOpenChange, onSave, editingPlan }: CarePlanDialogProps) {
  const [description, setDescription] = useState("")
  const [type, setType] = useState<RecordType>("medication")
  const [productType, setProductType] = useState<"action" | "consumable">("action")
  const [frequency, setFrequency] = useState("daily")
  const [times, setTimes] = useState<string[]>(["09:00", "21:00"])
  const [newTime, setNewTime] = useState("")

  useEffect(() => {
    if (editingPlan) {
      setDescription(editingPlan.description)
      setType(editingPlan.type)
      setProductType(editingPlan.productType || "action")
      setFrequency(editingPlan.frequency)
      setTimes(editingPlan.scheduledTimes)
    } else {
      setDescription("")
      setType("medication")
      setProductType("action")
      setFrequency("daily")
      setTimes(["09:00", "21:00"])
    }
  }, [editingPlan, open])

  const handleAddTime = () => {
    if (newTime && !times.includes(newTime)) {
      setTimes([...times, newTime].sort())
      setNewTime("")
    }
  }

  const handleRemoveTime = (time: string) => {
    setTimes(times.filter((t) => t !== time))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const plan: CarePlan = {
      id: editingPlan?.id || Date.now().toString(),
      description,
      type,
      ...(type === "products" && { productType }),
      frequency: frequency as any,
      scheduledTimes: times,
      startDate: editingPlan?.startDate || new Date(),
      createdBy: "Dr. Sarah Johnson",
      role: "Doctor",
    }

    onSave(plan)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingPlan ? "Edit Care Plan" : "Create Care Plan"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="e.g., Administer insulin injection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as RecordType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vital-signs">Vital Signs</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="note">Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "products" && (
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Select value={productType} onValueChange={(value) => setProductType(value as "action" | "consumable")}> 
                <SelectTrigger id="productType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="twice-daily">Twice daily</SelectItem>
                <SelectItem value="three-times-daily">Three times daily</SelectItem>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Scheduled Times</Label>
            <div className="flex gap-2">
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} placeholder="Add time" />
              <Button type="button" onClick={handleAddTime} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {times.map((time) => (
                <Badge key={time} variant="secondary" className="gap-1">
                  {time}
                  <button type="button" onClick={() => handleRemoveTime(time)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingPlan ? "Update" : "Create"} Plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
