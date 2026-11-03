"use client";

import { useVisitLiveness, isViewerBilling } from "@/hooks/use-visit-liveness";
import { Users, Search, Pencil, ReceiptText } from "lucide-react";

interface VisitPresenceBadgeProps {
  visitId: string | null | undefined;
  className?: string;
}

export function VisitPresenceBadge({
  visitId,
  className = "",
}: VisitPresenceBadgeProps) {
  const { otherViewers, isCollaborating } = useVisitLiveness(visitId);

  if (!isCollaborating || otherViewers.length === 0) {
    return null;
  }

  // Check if any other viewer is performing an active action (searching products, typing notes)
  const activeProductSearcher = otherViewers.find(
    (v) => v.activity === "searching_products",
  );
  const activeNoteTyper = otherViewers.find(
    (v) => v.activity === "typing_notes",
  );
  const billingViewer = otherViewers.find(
    (v) => isViewerBilling(v) || v.activity === "in_billing",
  );

  const names = otherViewers.map((v) => v.name).join(", ");

  // WhatsApp-style 3 bouncing dots
  const WhatsAppDots = () => (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1 w-1 rounded-full bg-current animate-bounce" />
    </span>
  );

  if (activeProductSearcher) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 transition-all animate-pulse ${className}`}
        title={`${activeProductSearcher.name} is actively searching products for this visit`}
      >
        <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="flex items-center">
          {activeProductSearcher.name} is searching products
          <WhatsAppDots />
        </span>
      </div>
    );
  }

  if (activeNoteTyper) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60 transition-all ${className}`}
        title={`${activeNoteTyper.name} is typing notes`}
      >
        <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="flex items-center">
          {activeNoteTyper.name} is typing notes
          <WhatsAppDots />
        </span>
      </div>
    );
  }

  if (billingViewer) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/70 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 transition-all ${className}`}
        title={`${billingViewer.name} (Billing) is viewing this visit`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
        <ReceiptText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
        <span>
          {billingViewer.name} (Billing) is viewing
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 transition-all ${className}`}
      title={`Currently viewing: ${names}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
      <span>
        {otherViewers.length === 1
          ? `${otherViewers[0].name} is viewing`
          : `${otherViewers.length} others viewing`}
      </span>
    </div>
  );
}
