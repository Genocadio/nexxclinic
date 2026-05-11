"use client"

import { User, HeartPulse, History as HistoryIcon } from "lucide-react"
import { formatDateOnly } from "@/lib/utils"
import type { Patient } from "@/lib/types"

interface PanelState {
  pinned: boolean
  hover: boolean
}

interface ConsultationSidePanelsProps {
  patient: Patient
  idPanel: PanelState
  vitalsPanel: PanelState
  historyPanel: PanelState
  setIdPanel: (state: PanelState) => void
  setVitalsPanel: (state: PanelState) => void
  setHistoryPanel: (state: PanelState) => void
}

export function ConsultationSidePanels({
  patient,
  idPanel,
  vitalsPanel,
  historyPanel,
  setIdPanel,
  setVitalsPanel,
  setHistoryPanel,
}: ConsultationSidePanelsProps) {
  const activePanels = [
    { key: 'id', active: idPanel.pinned || idPanel.hover },
    { key: 'vitals', active: vitalsPanel.pinned || vitalsPanel.hover },
    { key: 'history', active: historyPanel.pinned || historyPanel.hover },
  ].filter(p => p.active)

  const getPanelSlot = (panelKey: string): 'single' | 'upper' | 'lower' | 'middle' => {
    if (activePanels.length === 0) return 'single'
    if (activePanels.length === 1) return 'single'
    if (activePanels.length === 2) {
      const panelIndex = activePanels.findIndex(p => p.key === panelKey)
      return panelIndex === 0 ? 'upper' : 'lower'
    }
    const panelIndex = activePanels.findIndex(p => p.key === panelKey)
    return panelIndex === 0 ? 'upper' : panelIndex === 1 ? 'middle' : 'lower'
  }

  const getPositionStyle = (slot: 'single' | 'upper' | 'lower' | 'middle', count: number) => {
    const base = { left: '5rem', transform: 'translateY(-50%)' }
    if (count <= 1) return { ...base, top: '50%' }
    if (count === 2) {
      return slot === 'upper'
        ? { ...base, top: '30%' }
        : { ...base, top: '70%' }
    }
    if (slot === 'upper') return { ...base, top: '25%' }
    if (slot === 'middle') return { ...base, top: '50%' }
    return { ...base, top: '75%' }
  }

  const handlePanelClick = (panelKey: 'id' | 'vitals' | 'history') => {
    if (panelKey === 'id') {
      setIdPanel({ ...idPanel, pinned: !idPanel.pinned, hover: false })
    } else if (panelKey === 'vitals') {
      setVitalsPanel({ ...vitalsPanel, pinned: !vitalsPanel.pinned, hover: false })
    } else if (panelKey === 'history') {
      setHistoryPanel({ ...historyPanel, pinned: !historyPanel.pinned, hover: false })
    }
  }

  const showIdPanel = idPanel.pinned || idPanel.hover
  const showVitalsPanel = vitalsPanel.pinned || vitalsPanel.hover
  const showHistoryPanel = historyPanel.pinned || historyPanel.hover

  return (
    <>
      {/* Left vertical pill with quick panel buttons */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 bg-card/60 backdrop-blur-xl border border-border/50 rounded-full p-2 shadow-2xl">
        <button
          title="Identification"
          className={`p-2 rounded-full transition-colors ${idPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
          onMouseEnter={() => setIdPanel({ ...idPanel, hover: !idPanel.pinned })}
          onMouseLeave={() => setIdPanel({ ...idPanel, hover: false })}
          onClick={() => handlePanelClick('id')}
        >
          <User className={`w-5 h-5 ${idPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
        </button>
        <button
          title="Vital Signs"
          className={`p-2 rounded-full transition-colors ${vitalsPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
          onMouseEnter={() => setVitalsPanel({ ...vitalsPanel, hover: !vitalsPanel.pinned })}
          onMouseLeave={() => setVitalsPanel({ ...vitalsPanel, hover: false })}
          onClick={() => handlePanelClick('vitals')}
        >
          <HeartPulse className={`w-5 h-5 ${vitalsPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
        </button>
        <button
          title="History"
          className={`p-2 rounded-full transition-colors ${historyPanel.pinned ? 'bg-white/40 ring-2 ring-white/60' : 'hover:bg-muted'}`}
          onMouseEnter={() => setHistoryPanel({ ...historyPanel, hover: !historyPanel.pinned })}
          onMouseLeave={() => setHistoryPanel({ ...historyPanel, hover: false })}
          onClick={() => handlePanelClick('history')}
        >
          <HistoryIcon className={`w-5 h-5 ${historyPanel.pinned ? 'text-foreground' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Identification Panel */}
      {showIdPanel && (
        <div
          className="fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={getPositionStyle(getPanelSlot('id'), activePanels.length) as any}
        >
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

      {/* Vital Signs Panel (placeholder) */}
      {showVitalsPanel && (
        <div
          className="fixed z-40 w-80 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={getPositionStyle(getPanelSlot('vitals'), activePanels.length) as any}
        >
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

      {/* History Panel */}
      {showHistoryPanel && (
        <div
          className="fixed z-40 w-96 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
          style={getPositionStyle(getPanelSlot('history'), activePanels.length) as any}
        >
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
    </>
  )
}
