'use client'

import { BillingExemptions } from '@/components/BillingExemptions'
import type { BillingItem } from '@/lib/billing-utils'

type BillingExemptionsPanelProps = {
  open: boolean
  exemptionCount: number
  items: BillingItem[]
  onClose: () => void
  onExemptionChange: (itemId: string, reason: string) => void
}

export function BillingExemptionsPanel({
  open,
  exemptionCount,
  items,
  onClose,
  onExemptionChange,
}: BillingExemptionsPanelProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-32">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md mx-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col max-h-[60vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">Exemptions ({exemptionCount})</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close exemptions"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <BillingExemptions items={items} onExemptionChange={onExemptionChange} />
        </div>
      </div>
    </div>
  )
}
