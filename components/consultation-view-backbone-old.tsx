"use client"

import { useState } from "react"
import type { Patient, Consultation, ReasonForVisit, History, ReviewOfSystems, Assessment, Plan, Allergy, PastMedicalCondition, ReviewOfSystemsFinding, Problem, Diagnosis, Order } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save, User, HeartPulse, History } from "lucide-react"
import { formatDateOnly } from "@/lib/utils"

interface ConsultationViewBackboneProps {
  consultation: Consultation
  patient: Patient
  onSave: (consultation: Consultation) => void
  onBack: () => void
}

export default function ConsultationViewBackbone({
  consultation: initialConsultation,
  patient,
  onSave,
  onBack,
}: ConsultationViewBackboneProps) {
  const [consultation, setConsultation] = useState<Consultation>(initialConsultation)
  
  // Multi-panel position tracking
  interface PanelState {
    pinned: boolean
    hover: boolean
    position: 'top-left' | 'center-left' | 'bottom-left' | 'top-center' | 'center-center' | 'bottom-center'
  }
  
  const [idPanel, setIdPanel] = useState<PanelState>({ pinned: false, hover: false, position: 'top-left' })
  const [vitalsPanel, setVitalsPanel] = useState<PanelState>({ pinned: false, hover: false, position: 'center-left' })
  const [historyPanel, setHistoryPanel] = useState<PanelState>({ pinned: false, hover: false, position: 'bottom-left' })
  
  // Derived visibility states
  const showIdPanel = idPanel.pinned || idPanel.hover
  const showVitalsPanel = vitalsPanel.pinned || vitalsPanel.hover
  const showHistoryPanel = historyPanel.pinned || historyPanel.hover
  
  // Get position classes
  const getPositionClass = (position: string) => {
    const positions: Record<string, string> = {
      'top-left': 'left-20 top-24',
      'center-left': 'left-20 top-1/2 -translate-y-1/2',
      'bottom-left': 'left-20 bottom-24',
      'top-center': 'left-1/2 -translate-x-1/2 top-24',
      'center-center': 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2',
      'bottom-center': 'left-1/2 -translate-x-1/2 bottom-24',
    }
    return positions[position] || positions['top-left']
  }
  
  // Handle panel click - pin/unpin with position
  const handlePanelClick = (panelKey: 'id' | 'vitals' | 'history') => {
    if (panelKey === 'id') {
      setIdPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    } else if (panelKey === 'vitals') {
      setVitalsPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    } else if (panelKey === 'history') {
      setHistoryPanel(prev => ({
        ...prev,
        pinned: !prev.pinned,
        hover: false
      }))
    }
  }

  // Update nested state helpers
  const updateReasonForVisit = (updates: Partial<ReasonForVisit>) => {
    setConsultation(prev => ({
      ...prev,
      reasonForVisit: { ...prev.reasonForVisit, ...updates }
    }))
  }

  const updateHistory = (updates: Partial<History>) => {
    setConsultation(prev => ({
      ...prev,
      history: { ...prev.history, ...updates }
    }))
  }

  const addAllergy = () => {
    const newAllergy: Allergy = {
      code: "",
      display: "",
      status: "active"
    }
    updateHistory({
      allergies: [...consultation.history.allergies, newAllergy],
      isAllergyReviewPerformed: true,
    })
  }

  const removeAllergy = (index: number) => {
    const newAllergies = consultation.history.allergies.filter((_, i) => i !== index)
    updateHistory({
      allergies: newAllergies,
      isAllergyReviewPerformed: newAllergies.length > 0,
    })
  }

  const updateAllergy = (index: number, updates: Partial<Allergy>) => {
    const updatedAllergies = [...consultation.history.allergies]
    updatedAllergies[index] = { ...updatedAllergies[index], ...updates }
    updateHistory({ 
      allergies: updatedAllergies,
      isAllergyReviewPerformed: updatedAllergies.length > 0,
    })
  }

  const addPastMedicalCondition = () => {
    const newCondition: PastMedicalCondition = {
      conditionId: `condition-${Date.now()}`,
      code: "",
      display: ""
    }
    updateHistory({
      pastMedicalHistory: [...consultation.history.pastMedicalHistory, newCondition]
    })
  }

  const removePastMedicalCondition = (index: number) => {
    updateHistory({
      pastMedicalHistory: consultation.history.pastMedicalHistory.filter((_, i) => i !== index)
    })
  }

  const updatePastMedicalCondition = (index: number, updates: Partial<PastMedicalCondition>) => {
    const updatedConditions = [...consultation.history.pastMedicalHistory]
    updatedConditions[index] = { ...updatedConditions[index], ...updates }
    updateHistory({ pastMedicalHistory: updatedConditions })
  }

  const updateReviewOfSystems = (updates: Partial<ReviewOfSystems>) => {
    setConsultation(prev => ({
      ...prev,
      reviewOfSystems: { ...prev.reviewOfSystems, ...updates }
    }))
  }

  const addROSFinding = () => {
    const newFinding: ReviewOfSystemsFinding = {
      system: "general",
      finding: "",
      isPositive: false
    }
    updateReviewOfSystems({
      findings: [...consultation.reviewOfSystems.findings, newFinding]
    })
  }

  const removeROSFinding = (index: number) => {
    updateReviewOfSystems({
      findings: consultation.reviewOfSystems.findings.filter((_, i) => i !== index)
    })
  }

  const updateROSFinding = (index: number, updates: Partial<ReviewOfSystemsFinding>) => {
    const updatedFindings = [...consultation.reviewOfSystems.findings]
    updatedFindings[index] = { ...updatedFindings[index], ...updates }
    updateReviewOfSystems({ findings: updatedFindings })
  }

  const updateAssessment = (updates: Partial<Assessment>) => {
    setConsultation(prev => ({
      ...prev,
      assessment: { ...prev.assessment, ...updates }
    }))
  }

  const addProblem = () => {
    const newProblem: Problem = {
      problemId: `problem-${Date.now()}`,
      description: "",
      status: "active"
    }
    updateAssessment({
      problemList: [...consultation.assessment.problemList, newProblem]
    })
  }

  const removeProblem = (index: number) => {
    updateAssessment({
      problemList: consultation.assessment.problemList.filter((_, i) => i !== index)
    })
  }

  const updateProblem = (index: number, updates: Partial<Problem>) => {
    const updatedProblems = [...consultation.assessment.problemList]
    updatedProblems[index] = { ...updatedProblems[index], ...updates }
    updateAssessment({ problemList: updatedProblems })
  }

  const addDiagnosis = () => {
    const newDiagnosis: Diagnosis = {
      code: "",
      description: "",
      isPrimary: false,
      type: "provisional"
    }
    updateAssessment({
      diagnoses: [...consultation.assessment.diagnoses, newDiagnosis]
    })
  }

  const removeDiagnosis = (index: number) => {
    updateAssessment({
      diagnoses: consultation.assessment.diagnoses.filter((_, i) => i !== index)
    })
  }

  const updateDiagnosis = (index: number, updates: Partial<Diagnosis>) => {
    const updatedDiagnoses = [...consultation.assessment.diagnoses]
    updatedDiagnoses[index] = { ...updatedDiagnoses[index], ...updates }
    updateAssessment({ diagnoses: updatedDiagnoses })
  }

  const updatePlan = (updates: Partial<Plan>) => {
    setConsultation(prev => ({
      ...prev,
      plan: { ...prev.plan, ...updates }
    }))
  }

  const addOrder = () => {
    const newOrder: Order = {
      orderId: `order-${Date.now()}`,
      category: "medication",
      orderCode: "",
      instruction: "",
      intent: "order"
    }
    updatePlan({
      orders: [...consultation.plan.orders, newOrder]
    })
  }

  const removeOrder = (index: number) => {
    updatePlan({
      orders: consultation.plan.orders.filter((_, i) => i !== index)
    })
  }

  const updateOrder = (index: number, updates: Partial<Order>) => {
    const updatedOrders = [...consultation.plan.orders]
    updatedOrders[index] = { ...updatedOrders[index], ...updates }
    updatePlan({ orders: updatedOrders })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Consultation Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Encounter Type</Label>
                  <Select 
                    value={consultation.encounterType}
                    onValueChange={(value: any) => setConsultation(prev => ({ ...prev, encounterType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outpatient">Outpatient</SelectItem>
                      <SelectItem value="inpatient">Inpatient</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="telemedicine">Telemedicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Select 
                    value={consultation.department}
                    onValueChange={(value: any) => setConsultation(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="gynecology">Gynecology</SelectItem>
                      <SelectItem value="internal_medicine">Internal Medicine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={consultation.status}
                    onValueChange={(value: any) => setConsultation(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="finalized">Finalized</SelectItem>
                      <SelectItem value="amended">Amended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason for Visit */}
          <Card>
            <CardHeader>
              <CardTitle>Reason for Visit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chief Complaint</Label>
                <Textarea
                  value={consultation.reasonForVisit.chiefComplaint}
                  onChange={(e) => updateReasonForVisit({ chiefComplaint: e.target.value })}
                  placeholder="Describe the chief complaint..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Presenting Body Site</Label>
                  <Input
                    value={consultation.reasonForVisit.presentingBodySite || ""}
                    onChange={(e) => updateReasonForVisit({ presentingBodySite: e.target.value })}
                    placeholder="e.g., Right eye, Left knee"
                  />
                </div>
                <div>
                  <Label>Onset</Label>
                  <Select 
                    value={consultation.reasonForVisit.onset || ""}
                    onValueChange={(value: any) => updateReasonForVisit({ onset: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select onset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acute">Acute</SelectItem>
                      <SelectItem value="subacute">Subacute</SelectItem>
                      <SelectItem value="chronic">Chronic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Allergies</Label>
                  <Button size="sm" variant="outline" onClick={addAllergy}>
                    <Plus className="w-4 h-4 mr-1" /> Add Allergy
                  </Button>
                </div>
                <div className="space-y-2">
                  {consultation.history.allergies.map((allergy, index) => (
                    <div key={index} className="flex gap-2 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Input
                          placeholder="SNOMED Code"
                          value={allergy.code}
                          onChange={(e) => updateAllergy(index, { code: e.target.value })}
                        />
                        <Input
                          placeholder="Allergy Name"
                          value={allergy.display}
                          onChange={(e) => updateAllergy(index, { display: e.target.value })}
                        />
                        <Select 
                          value={allergy.status}
                          onValueChange={(value: any) => updateAllergy(index, { status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeAllergy(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Past Medical History</Label>
                  <Button size="sm" variant="outline" onClick={addPastMedicalCondition}>
                    <Plus className="w-4 h-4 mr-1" /> Add Condition
                  </Button>
                </div>
                <div className="space-y-2">
                  {consultation.history.pastMedicalHistory.map((condition, index) => (
                    <div key={index} className="flex gap-2 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          placeholder="ICD-10 Code"
                          value={condition.code}
                          onChange={(e) => updatePastMedicalCondition(index, { code: e.target.value })}
                        />
                        <Input
                          placeholder="Condition Description"
                          value={condition.display}
                          onChange={(e) => updatePastMedicalCondition(index, { display: e.target.value })}
                        />
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removePastMedicalCondition(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review of Systems */}
          <Card>
            <CardHeader>
              <CardTitle>Review of Systems</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rosPerformed"
                  checked={consultation.reviewOfSystems.performed}
                  onCheckedChange={(checked) => updateReviewOfSystems({ performed: checked as boolean })}
                />
                <Label htmlFor="rosPerformed">Review of Systems Performed</Label>
              </div>

              {consultation.reviewOfSystems.performed && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Findings</Label>
                    <Button size="sm" variant="outline" onClick={addROSFinding}>
                      <Plus className="w-4 h-4 mr-1" /> Add Finding
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {consultation.reviewOfSystems.findings.map((finding, index) => (
                      <div key={index} className="flex gap-2 p-3 border rounded-lg">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <Select 
                            value={finding.system}
                            onValueChange={(value: any) => updateROSFinding(index, { system: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                              <SelectItem value="respiratory">Respiratory</SelectItem>
                              <SelectItem value="gi">GI</SelectItem>
                              <SelectItem value="neurological">Neurological</SelectItem>
                              <SelectItem value="musculoskeletal">Musculoskeletal</SelectItem>
                              <SelectItem value="skin">Skin</SelectItem>
                              <SelectItem value="genitourinary">Genitourinary</SelectItem>
                              <SelectItem value="psychiatric">Psychiatric</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Finding"
                            value={finding.finding}
                            onChange={(e) => updateROSFinding(index, { finding: e.target.value })}
                          />
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`positive-${index}`}
                              checked={finding.isPositive}
                              onCheckedChange={(checked) => updateROSFinding(index, { isPositive: checked as boolean })}
                            />
                            <Label htmlFor={`positive-${index}`}>Positive</Label>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeROSFinding(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Problem List</Label>
                  <Button size="sm" variant="outline" onClick={addProblem}>
                    <Plus className="w-4 h-4 mr-1" /> Add Problem
                  </Button>
                </div>
                <div className="space-y-2">
                  {consultation.assessment.problemList.map((problem, index) => (
                    <div key={index} className="flex gap-2 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Problem Description"
                          value={problem.description}
                          onChange={(e) => updateProblem(index, { description: e.target.value })}
                        />
                        <Select 
                          value={problem.status}
                          onValueChange={(value: any) => updateProblem(index, { status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeProblem(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Diagnoses</Label>
                  <Button size="sm" variant="outline" onClick={addDiagnosis}>
                    <Plus className="w-4 h-4 mr-1" /> Add Diagnosis
                  </Button>
                </div>
                <div className="space-y-2">
                  {consultation.assessment.diagnoses.map((diagnosis, index) => (
                    <div key={index} className="flex gap-2 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-4 gap-2">
                        <Input
                          placeholder="ICD-10 Code"
                          value={diagnosis.code}
                          onChange={(e) => updateDiagnosis(index, { code: e.target.value })}
                        />
                        <Input
                          placeholder="Description"
                          value={diagnosis.description}
                          onChange={(e) => updateDiagnosis(index, { description: e.target.value })}
                        />
                        <Select 
                          value={diagnosis.type}
                          onValueChange={(value: any) => updateDiagnosis(index, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="provisional">Provisional</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`primary-${index}`}
                            checked={diagnosis.isPrimary}
                            onCheckedChange={(checked) => updateDiagnosis(index, { isPrimary: checked as boolean })}
                          />
                          <Label htmlFor={`primary-${index}`}>Primary</Label>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeDiagnosis(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Clinical Impression</Label>
                <Textarea
                  value={consultation.assessment.clinicalImpression || ""}
                  onChange={(e) => updateAssessment({ clinicalImpression: e.target.value })}
                  placeholder="Free-text summary of clinician reasoning, differentials, and plan context..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Label>Orders</Label>
                <Button size="sm" variant="outline" onClick={addOrder}>
                  <Plus className="w-4 h-4 mr-1" /> Add Order
                </Button>
              </div>
              <div className="space-y-2">
                {consultation.plan.orders.map((order, index) => (
                  <div key={index} className="flex gap-2 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-4 gap-2">
                        <Select 
                          value={order.category}
                          onValueChange={(value: any) => updateOrder(index, { category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medication">Medication</SelectItem>
                            <SelectItem value="investigation">Investigation</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Order Code"
                          value={order.orderCode}
                          onChange={(e) => updateOrder(index, { orderCode: e.target.value })}
                        />
                        <Select 
                          value={order.intent}
                          onValueChange={(value: any) => updateOrder(index, { intent: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select 
                          value={order.expectedActionType || ""}
                          onValueChange={(value: any) => updateOrder(index, { expectedActionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Action Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="investigation">Investigation</SelectItem>
                            <SelectItem value="procedure">Procedure</SelectItem>
                            <SelectItem value="dispense">Dispense</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        placeholder="Instructions"
                        value={order.instruction}
                        onChange={(e) => updateOrder(index, { instruction: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeOrder(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>



          {/* Actions */}
          <div className="flex gap-3 justify-end pb-6">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={() => onSave(consultation)}>
              <Save className="w-4 h-4 mr-2" />
              Save Consultation
            </Button>
          </div>
        </div>
      </div>
    {/* Left vertical pill with quick panels */}
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full p-2 shadow-2xl">
      <button
        title="Identification"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        onMouseEnter={() => setIdPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setIdPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('id')}
      >
        <User className="w-5 h-5" />
      </button>
      <button
        title="Vital Signs"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        onMouseEnter={() => setVitalsPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setVitalsPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('vitals')}
      >
        <HeartPulse className="w-5 h-5" />
      </button>
      <button
        title="History"
        className="p-2 rounded-full hover:bg-muted transition-colors"
        onMouseEnter={() => setHistoryPanel(prev => ({ ...prev, hover: !prev.pinned }))}
        onMouseLeave={() => setHistoryPanel(prev => ({ ...prev, hover: false }))}
        onClick={() => handlePanelClick('history')}
      >
        <History className="w-5 h-5" />
      </button>
    </div>

    {/* Identification Panel */}
    {showIdPanel && (
      <div className={`fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden ${getPositionClass(idPanel.position)}`}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">Identification</p>
          {idPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="font-medium text-foreground">{patient.name}</div>
          <div className="text-muted-foreground">Age: {patient.age}</div>
          <div className="text-muted-foreground">Gender: {patient.gender}</div>
          <div className="text-muted-foreground">DOB: {formatDateOnly(patient.dateOfBirth)}</div>
          {patient.phone && <div className="text-muted-foreground">Phone: {patient.phone}</div>}
          {patient.email && <div className="text-muted-foreground">Email: {patient.email}</div>}
        </div>
      </div>
    )}

    {/* Vital Signs Panel (dummy) */}
    {showVitalsPanel && (
      <div className={`fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden ${getPositionClass(vitalsPanel.position)}`}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">Vital Signs</p>
          {vitalsPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">BP</p>
            <p className="font-medium">120/80</p>
          </div>
          <div>
            <p className="text-muted-foreground">HR</p>
            <p className="font-medium">72 bpm</p>
          </div>
          <div>
            <p className="text-muted-foreground">Temp</p>
            <p className="font-medium">36.8 °C</p>
          </div>
          <div>
            <p className="text-muted-foreground">O2 Sat</p>
            <p className="font-medium">98%</p>
          </div>
          <div>
            <p className="text-muted-foreground">RR</p>
            <p className="font-medium">16/min</p>
          </div>
        </div>
      </div>
    )}

    {/* History Panel (dummy) */}
    {showHistoryPanel && (
      <div className={`fixed z-40 w-96 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden ${getPositionClass(historyPanel.position)}`}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <p className="text-sm font-semibold">History</p>
          {historyPanel.pinned && <span className="text-xs bg-white/30 px-2 py-1 rounded">Pinned</span>}
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Allergies</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fluoroquinolones (rash)</li>
              <li>Penicillin (hives)</li>
            </ul>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Past Medical History</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hypertension (I10)</li>
              <li>Type 2 Diabetes (E11)</li>
            </ul>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}
