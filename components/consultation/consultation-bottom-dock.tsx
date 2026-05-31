"use client"

import { CheckCircle, ArrowRightLeft, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConsultationBottomDockProps {
  onComplete: () => void
  onTransfer?: () => void
  onViewHistory?: () => void
}

export function ConsultationBottomDock({
  onComplete,
  onTransfer,
  onViewHistory,
}: ConsultationBottomDockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                  onClick={onComplete}
                  aria-label="Complete"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete</p>
              </TooltipContent>
            </Tooltip>

            {onViewHistory && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-amber-600 hover:text-white shadow-lg"
                      onClick={onViewHistory}
                      aria-label="View History"
                    >
                      <History className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Patient History</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {onTransfer && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                      onClick={onTransfer}
                      aria-label="Transfer"
                    >
                      <ArrowRightLeft className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Transfer</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
