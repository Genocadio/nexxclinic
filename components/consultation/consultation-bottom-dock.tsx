"use client";

import { useState } from "react";
import { CheckCircle, ArrowRightLeft, UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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
import { VisitPresenceBadge } from "@/components/visit-presence-badge";
import { useAuth } from "@/lib/auth-context";
import { useSearchWorkers } from "@/hooks/workers/hooks";
import { useAddVisitDepartmentProcessor } from "@/hooks/visits/department-mutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ConsultationBottomDockProps {
  visitId?: string;
  onComplete: () => void;
  onTransfer?: () => void;
  departmentId?: string;
  departmentName?: string;
  processors?: Array<{ id: string; firstName?: string | null; lastName?: string | null }>;
  saveIndicator?: SaveIndicatorState;
  completeDisabled?: boolean;
  completeDisabledReason?: string;
}

export function ConsultationBottomDock({
  visitId,
  onComplete,
  onTransfer,
  departmentId,
  departmentName,
  processors = [],
  saveIndicator,
  completeDisabled = false,
  completeDisabledReason,
}: ConsultationBottomDockProps) {
  const { doctor } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { workers, loading: workersLoading } = useSearchWorkers({
    name: query,
    role: "CLINICIAN",
    activeOnly: true,
  });
  const { addProcessor, loading: addingProcessor } = useAddVisitDepartmentProcessor();
  const isCurrentProcessor = Boolean(
    doctor?.id && processors.some((processor) => String(processor.id) === String(doctor.id)),
  );
  const availableWorkers = workers.filter(
    (worker: any) => !processors.some((processor) => String(processor.id) === String(worker.id)),
  );

  const handleAddProcessor = async (processor: any) => {
    try {
      const response = await addProcessor(String(departmentId), String(processor.id));
      if (response?.status !== "SUCCESS") {
        toast.error(response?.message || "Unable to add processor");
        return;
      }
      toast.success("Processor added");
      setShareOpen(false);
      setQuery("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add processor");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-gray rounded-full shadow-xl px-3 py-2 flex items-center gap-2">
        {visitId && (
          <VisitPresenceBadge
            visitId={visitId}
            className="bg-white/10 text-white/95 border-white/20 text-xs py-1"
          />
        )}
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
            {departmentId && isCurrentProcessor && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                      onClick={() => setShareOpen(true)}
                      aria-label="Add processor"
                    >
                      <UserPlus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Add processor</p></TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a processor</DialogTitle>
            <DialogDescription>
              Share this {departmentName || "department"} visit with another clinician.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search clinician by name"
                className="pl-9"
                autoFocus
              />
            </div>
            {query.trim().length < 2 ? (
              <p className="text-sm text-muted-foreground">Enter at least 2 characters.</p>
            ) : workersLoading ? (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
              </div>
            ) : availableWorkers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No other clinicians found in this department.</p>
            ) : (
              <div className="max-h-56 space-y-1 overflow-y-auto">
                {availableWorkers.map((worker: any) => (
                  <Button
                    key={worker.id}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    disabled={addingProcessor}
                    onClick={() => void handleAddProcessor(worker)}
                  >
                    {[worker.firstName, worker.lastName].filter(Boolean).join(" ") || worker.username || "Clinician"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
