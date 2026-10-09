"use client";

import { useState } from "react";
import { CheckCircle, ArrowRightLeft, UserPlus, Search, Loader2, Grid2X2, Info, Pin } from "lucide-react";
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
import { useChangeVisitDepartmentProfile } from "@/hooks/visits/department-mutations";
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
  profiles?: Array<{ id: string; name: string; isDefault?: boolean; products?: Array<{ id: string; name: string }> }>;
  activeProfileId?: string | null;
  visitDepartmentStatus?: string;
  products?: Array<{ source?: string | null; billingState?: string | null }>;
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
  profiles = [],
  activeProfileId,
  visitDepartmentStatus,
  products = [],
}: ConsultationBottomDockProps) {
  const { doctor } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { workers, loading: workersLoading } = useSearchWorkers({
    name: query,
    role: "CLINICIAN",
    activeOnly: true,
  });
  const { addProcessor, loading: addingProcessor } = useAddVisitDepartmentProcessor();
  const { changeVisitDepartmentProfile, loading: changingProfile } =
    useChangeVisitDepartmentProfile();
  const profileChangeLocked =
    ["COMPLETED", "FINALISED", "CANCELLED", "DEPARTMENT_EDITING"].includes(
      String(visitDepartmentStatus || "").toUpperCase(),
    ) ||
    products.some(
      (product) =>
        String(product.source).toUpperCase() === "PROFILE" &&
        String(product.billingState).toUpperCase() === "BILLED",
    );
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

  const handleChangeProfile = async (profileId: string) => {
    try {
      const response = await changeVisitDepartmentProfile(String(departmentId), profileId);
      if (response?.status !== "SUCCESS") {
        toast.error(response?.message || "Unable to change profile");
        return;
      }
      toast.success("Profile changed");
      setProfileOpen(false);
      setMenuOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to change profile");
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
            {departmentId && (isCurrentProcessor || profiles.length > 0) && (
              <>
                <div className="w-px h-8 bg-white/20" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                      onClick={() => setMenuOpen((open) => !open)}
                      aria-label="Consultation actions"
                    >
                      <Grid2X2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Consultation actions</p></TooltipContent>
                </Tooltip>
                {menuOpen && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full h-12 w-12 border-2 border-white/30 bg-transparent text-white/90 hover:bg-blue-600 hover:text-white shadow-lg"
                        onClick={() => setMinimized((prev) => !prev)}
                        aria-label={minimized ? "Maximize card" : "Minimize card"}
                      >
                        <Pin className={minimized ? "h-5 w-5 text-blue-400" : "h-5 w-5 text-white/90"} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{minimized ? "Maximize" : "Minimize"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        </TooltipProvider>
      </div>
      {menuOpen && !minimized && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 min-w-56 rounded-xl border border-border bg-background p-2 shadow-xl">
          {departmentId && isCurrentProcessor && (
            <Button variant="ghost" className="w-full justify-start gap-2"
              onClick={() => { setShareOpen(true); setMenuOpen(false); }}>
              <UserPlus className="h-4 w-4" /> Add clinician
            </Button>
          )}
          {profiles.length > 0 && (
            <Button variant="ghost" className="w-full justify-start gap-2"
              disabled={profileChangeLocked}
              title={profileChangeLocked ? "Profile changes are locked for this visit" : "Change profile"}
              onClick={() => setProfileOpen(true)}>
              <ArrowRightLeft className="h-4 w-4" /> Change profile
              {profileChangeLocked && <Info className="ml-auto h-4 w-4 text-muted-foreground" />}
            </Button>
          )}
        </div>
      )}
      {menuOpen && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          aria-label="Maximize card"
          className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-border/70 bg-background/80 px-2 py-1 shadow-sm hover:bg-muted"
        >
          <Pin className="h-4 w-4 text-blue-400" />
        </button>
      )}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change consultation profile</DialogTitle>
            <DialogDescription>
              Products managed by the current profile will be removed and replaced by the selected profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            {profiles.map((profile) => (
              <Button key={profile.id} variant={profile.id === activeProfileId ? "secondary" : "ghost"}
                className="w-full justify-between" disabled={changingProfile || profile.id === activeProfileId}
                onClick={() => void handleChangeProfile(profile.id)}>
                <span>{profile.name}</span>
                {profile.isDefault && <span className="text-xs text-muted-foreground">Default</span>}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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
