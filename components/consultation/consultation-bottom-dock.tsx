"use client";

import { CheckCircle, ArrowRightLeft, History } from "lucide-react";

interface SaveIndicatorState {
  visible: boolean;
  status: "saved" | "dirty" | "saving";
}
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsultationBottomDockProps {
  onComplete: () => void;
  onTransfer?: () => void;
  saveIndicator?: SaveIndicatorState;
  completeDisabled?: boolean;
  completeDisabledReason?: string;
}

export function ConsultationBottomDock({
  onComplete,
  onTransfer,
  saveIndicator,
  completeDisabled = false,
  completeDisabledReason,
}: ConsultationBottomDockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {saveIndicator?.visible ? (
              <div className="group flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    saveIndicator.status === "saving"
                      ? "bg-orange-500"
                      : saveIndicator.status === "dirty"
                        ? "bg-red-500"
                        : "bg-green-500"
                  }`}
                />
                <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-xs font-medium text-white/90 opacity-0 transition-all duration-200 group-hover:max-w-24 group-hover:pl-2 group-hover:opacity-100">
                  {saveIndicator.status === "saving"
                    ? "Saving"
                    : saveIndicator.status === "dirty"
                      ? "Unsaved"
                      : "Saved"}
                </span>
              </div>
            ) : null}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                    onClick={onComplete}
                    aria-label="Complete"
                    disabled={completeDisabled}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {completeDisabled
                    ? completeDisabledReason || "Complete"
                    : "Complete"}
                </p>
              </TooltipContent>
            </Tooltip>

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
  );
}
