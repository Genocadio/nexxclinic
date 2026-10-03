"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserCheck, Plus, ArrowRight, Loader2, Building2 } from "lucide-react";

interface PostBillingActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onDischarge: () => Promise<void> | void;
  onAddDepartment: () => void;
  discharging?: boolean;
}

export function PostBillingActionDialog({
  open,
  onOpenChange,
  patientName,
  onDischarge,
  onAddDepartment,
  discharging = false,
}: PostBillingActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-3xl backdrop-blur-2xl bg-card/95 border border-border/80 shadow-2xl">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Last Department Billed
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              All active departments for <span className="font-semibold text-foreground">{patientName}</span> have been successfully billed. What would you like to do next?
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 my-2">
          {/* Action 1: Discharge */}
          <button
            type="button"
            disabled={discharging}
            onClick={() => void onDischarge()}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 group-hover:scale-105 transition-transform mt-0.5">
              {discharging ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  Discharge Patient
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mark the visit as Completed and finalize the patient encounter.
              </p>
            </div>
          </button>

          {/* Action 2: Add Department */}
          <button
            type="button"
            disabled={discharging}
            onClick={() => {
              onOpenChange(false);
              onAddDepartment();
            }}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  Add Another Department
                </span>
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send the patient to Pharmacy, Laboratory, Specialist, or another service.
              </p>
            </div>
          </button>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={discharging}
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Dismiss & Stay on Billing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
