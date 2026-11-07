"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  StickyNote,
  Send,
  X,
  Check,
  CheckCheck,
  Eye,
  Pencil,
  ReceiptText,
  Stethoscope,
  FileText,
  MessageSquare,
  Sparkles,
  Clock,
  User,
  List,
  ListOrdered,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { hasRole } from "@/lib/role-utils";
import { useVisitLiveness } from "@/hooks/use-visit-liveness";
import { playNoteNotificationSound } from "@/lib/sound-notifications";

export interface VisitNoteItem {
  id?: string;
  content?: string | null;
  noteType?: string | null;
  visitDepartmentId?: string | null;
  visitDepartment?: {
    id?: string;
    department?: {
      id?: string;
      name?: string;
    } | null;
  } | null;
  createdBy?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
    role?: string;
  };
  createdAt?: string;
  viewed?: boolean;
}

export interface VisitDepartmentOption {
  id: string;
  name?: string;
  status?: string | null;
  department?: {
    id?: string;
    name?: string;
  } | null;
}

export interface VisitNotesFloatingProps {
  notes: VisitNoteItem[];
  noteTypes: string[];
  title?: string;
  allowedDisplayTypes?: string[];
  onAddNote?: (noteType: string, content: string, visitDepartmentId?: string) => Promise<void>;
  onMarkAsViewed?: (noteId?: string, visitDepartmentId?: string) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideToggleButton?: boolean;
  visitId?: string;
  visitDepartmentId?: string;
  visitDepartments?: VisitDepartmentOption[];
}

const QUICK_TEMPLATES: Record<string, string[]> = {
  BILLING: [
    "Waived per doctor instructions",
    "Insurance pending pre-auth",
    "Patient to settle balance tomorrow",
    "Paid via MoMo at cash desk",
    "Split payment agreed with patient",
  ],
  CONSULTATION: [
    "Urgent lab review needed",
    "Patient counselled on medication compliance",
    "Handover to nursing for observation",
    "Review in 2 weeks or if symptoms persist",
    "Specialist referral advised",
  ],
  ADMIN: [
    "Medical report requested by patient",
    "National ID / Insurance verified",
    "Patient consent form signed",
    "Patient transferred to another facility",
  ],
  FORMS: [
    "Lab investigation forms attached",
    "Radiology requisition sent",
    "External referral documents ready",
  ],
  PUBLIC: [
    "Patient attended and oriented",
    "Patient accompanied by caregiver",
    "Follow-up appointment booked",
    "Discharge instructions provided",
  ],
};

function getNoteTypeConfig(noteType?: string | null) {
  const norm = String(noteType || "PUBLIC").toUpperCase();
  switch (norm) {
    case "BILLING":
      return {
        label: "Billing",
        fullLabel: "Billing / Financial",
        icon: ReceiptText,
        badgeClass:
          "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        borderAccent: "border-l-amber-500",
        cardBg: "bg-amber-50/40 dark:bg-amber-950/20",
        pillActive: "bg-amber-600 text-white shadow-sm",
        pillInactive: "hover:bg-amber-50 text-amber-900 dark:text-amber-200 dark:hover:bg-amber-950/40",
        placeholder: "Write financial or billing note (e.g. waiver rationale, payment agreement)...",
      };
    case "CONSULTATION":
    case "CLINICAL":
      return {
        label: "Clinical",
        fullLabel: "Clinical Handover",
        icon: Stethoscope,
        badgeClass:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        borderAccent: "border-l-emerald-500",
        cardBg: "bg-emerald-50/40 dark:bg-emerald-950/20",
        pillActive: "bg-emerald-600 text-white shadow-sm",
        pillInactive: "hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40",
        placeholder: "Write clinical handover notes or doctor instructions...",
      };
    case "ADMIN":
      return {
        label: "Admin",
        fullLabel: "Administrative",
        icon: FileText,
        badgeClass:
          "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        borderAccent: "border-l-blue-500",
        cardBg: "bg-blue-50/40 dark:bg-blue-950/20",
        pillActive: "bg-blue-600 text-white shadow-sm",
        pillInactive: "hover:bg-blue-50 text-blue-900 dark:text-blue-200 dark:hover:bg-blue-950/40",
        placeholder: "Write administrative note or file verification...",
      };
    case "FORMS":
      return {
        label: "Forms",
        fullLabel: "Forms & Orders",
        icon: FileText,
        badgeClass:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
        borderAccent: "border-l-indigo-500",
        cardBg: "bg-indigo-50/40 dark:bg-indigo-950/20",
        pillActive: "bg-indigo-600 text-white shadow-sm",
        pillInactive: "hover:bg-indigo-50 text-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-950/40",
        placeholder: "Write forms or orders coordination note...",
      };
    case "PUBLIC":
    default:
      return {
        label: "Notice",
        fullLabel: "General Notice",
        icon: MessageSquare,
        badgeClass:
          "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-200 border-slate-200 dark:border-slate-700",
        borderAccent: "border-l-slate-400 dark:border-l-slate-500",
        cardBg: "bg-card",
        pillActive: "bg-primary text-primary-foreground shadow-sm",
        pillInactive: "hover:bg-muted text-foreground",
        placeholder: "Write a note visible to all departments on this visit...",
      };
  }
}

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const time = d.getTime();
    if (isNaN(time)) return "";
    const diffMs = Date.now() - time;
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 45) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function VisitNotesFloating({
  notes,
  noteTypes,
  title = "Visit Notes",
  allowedDisplayTypes,
  onAddNote,
  onMarkAsViewed,
  open,
  onOpenChange,
  hideToggleButton = false,
  visitId,
  visitDepartmentId,
  visitDepartments,
}: VisitNotesFloatingProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { doctor } = useAuth();
  const controlled = typeof open === "boolean";
  const isOpen = controlled ? open : internalOpen;

  const setOpenState = useCallback(
    (value: boolean) => {
      if (controlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpen(value);
      }
    },
    [controlled, onOpenChange]
  );

  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState(noteTypes[0] || "PUBLIC");
  const [submitting, setSubmitting] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validDepts = useMemo(
    () => (visitDepartments || []).filter((d) => Boolean(d.id)),
    [visitDepartments]
  );

  const deptMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of validDepts) {
      if (d.id) {
        map[d.id] = d.department?.name || d.name || "Department";
      }
    }
    return map;
  }, [validDepts]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    visitDepartmentId || validDepts[0]?.id || ""
  );

  useEffect(() => {
    if (visitDepartmentId) {
      setSelectedDeptId(visitDepartmentId);
    } else if (validDepts.length > 0 && !selectedDeptId) {
      setSelectedDeptId(validDepts[0].id);
    }
  }, [visitDepartmentId, validDepts, selectedDeptId]);

  // Liveness & Presence hook
  const { otherViewers, updateActivity } = useVisitLiveness(visitId);

  useEffect(() => {
    if (!noteTypes.includes(selectedType)) {
      setSelectedType(noteTypes[0] || "PUBLIC");
    }
  }, [noteTypes, selectedType]);

  const userRoles = doctor?.roles || [];
  const isManagerOrAdmin =
    hasRole(userRoles, "MANAGER") || hasRole(userRoles, "ADMIN");

  const visibleNotes = useMemo(() => {
    if (isManagerOrAdmin) {
      return notes || [];
    }
    if (!allowedDisplayTypes || allowedDisplayTypes.length === 0) {
      return notes || [];
    }

    const allowed = new Set(allowedDisplayTypes.map((t) => t.toUpperCase()));
    return (notes || []).filter(
      (note) => note?.noteType && allowed.has(String(note.noteType).toUpperCase())
    );
  }, [allowedDisplayTypes, notes, isManagerOrAdmin]);

  const unreadNotesCount = useMemo(
    () => (visibleNotes || []).filter((note) => !note?.viewed).length,
    [visibleNotes]
  );

  // 1. Smart Auto-Expand on Open Visit if Unread Notes Exist
  const hasAutoExpandedRef = useRef(false);
  useEffect(() => {
    if (!hasAutoExpandedRef.current && unreadNotesCount > 0) {
      hasAutoExpandedRef.current = true;
      setOpenState(true);
    }
  }, [unreadNotesCount, setOpenState]);

  // 2. Play Sound and Auto-Expand when a Brand New Note Arrives Live
  const prevNotesCountRef = useRef(notes?.length || 0);
  useEffect(() => {
    const currentCount = notes?.length || 0;
    if (currentCount > prevNotesCountRef.current) {
      playNoteNotificationSound();
      if (!isOpen) {
        setOpenState(true);
      }
    }
    prevNotesCountRef.current = currentCount;
  }, [notes?.length, isOpen, setOpenState]);

  // 3. Activity Broadcast: Emit "typing_note:TYPE:DEPT" when typing
  const isTyping = text.trim().length > 0;
  const lastSentActivityRef = useRef<string>("viewing");
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const broadcastActivity = useCallback(
    (act: string) => {
      if (!updateActivity) return;
      if (lastSentActivityRef.current !== act) {
        lastSentActivityRef.current = act;
        updateActivity(act);
      }
    },
    [updateActivity]
  );

  useEffect(() => {
    if (!updateActivity) return;

    if (isOpen && isTyping) {
      const targetActivity = `typing_note:${selectedType}:${visitDepartmentId || ""}`;
      broadcastActivity(targetActivity);

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        broadcastActivity("viewing");
      }, 7000);
    } else {
      broadcastActivity("viewing");
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }
  }, [isOpen, isTyping, selectedType, visitDepartmentId, broadcastActivity, updateActivity]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (updateActivity && lastSentActivityRef.current !== "viewing") {
        updateActivity("viewing");
      }
    };
  }, [updateActivity]);

  // 4. Targeted Typing Indicators: Only display typing to appropriate audience
  const activeTypingViewers = useMemo(() => {
    if (!otherViewers || otherViewers.length === 0) return [];

    return otherViewers
      .filter((viewer) => {
        if (!viewer.activity?.startsWith("typing_note:")) return false;
        const [, noteType, deptId] = viewer.activity.split(":");
        const typeNorm = (noteType || "PUBLIC").toUpperCase();

        // Department scoping: if scoped to a specific department and not matching, hide (unless admin or public)
        if (deptId && visitDepartmentId && deptId !== visitDepartmentId) {
          if (typeNorm !== "PUBLIC" && !isManagerOrAdmin) {
            return false;
          }
        }

        // Targeted Audience Filter:
        if (isManagerOrAdmin) return true;

        if (allowedDisplayTypes && allowedDisplayTypes.length > 0) {
          const allowedUpper = allowedDisplayTypes.map((t) => t.toUpperCase());
          if (!allowedUpper.includes(typeNorm)) {
            return false;
          }
        }

        if (typeNorm === "BILLING") {
          return (
            hasRole(userRoles, "FINANCE") ||
            hasRole(userRoles, "CASHIER") ||
            hasRole(userRoles, "BILLING") ||
            (allowedDisplayTypes?.includes("BILLING") ?? false)
          );
        }

        if (typeNorm === "CONSULTATION" || typeNorm === "CLINICAL") {
          return (
            hasRole(userRoles, "CLINICIAN") ||
            hasRole(userRoles, "DOCTOR") ||
            hasRole(userRoles, "NURSE") ||
            (allowedDisplayTypes?.includes("CONSULTATION") ?? false)
          );
        }

        if (typeNorm === "ADMIN") {
          return isManagerOrAdmin || (allowedDisplayTypes?.includes("ADMIN") ?? false);
        }

        // PUBLIC notes are visible to everyone viewing
        return true;
      })
      .map((viewer) => {
        const [, noteType] = (viewer.activity || "").split(":");
        return {
          viewer,
          noteType: (noteType || "PUBLIC").toUpperCase(),
        };
      });
  }, [
    otherViewers,
    visitDepartmentId,
    isManagerOrAdmin,
    allowedDisplayTypes,
    userRoles,
  ]);

  const handleAdd = async () => {
    if (!onAddNote) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    broadcastActivity("viewing");
    try {
      await onAddNote(selectedType, trimmed, selectedDeptId || visitDepartmentId);
      setText("");
    } catch (error: any) {
      const message = error?.message || "Failed to save note";
      toast.error(message);
      console.error("Failed to add note", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setText("");
    broadcastActivity("viewing");
    textareaRef.current?.focus();
  };

  const handleMarkAsViewed = async (noteId: string, deptId?: string) => {
    if (!onMarkAsViewed || markingRead) return;
    setMarkingRead(true);
    try {
      await onMarkAsViewed(noteId, deptId || selectedDeptId || visitDepartmentId);
    } catch (error: any) {
      console.error("Failed to mark note as viewed", error);
    } finally {
      setMarkingRead(false);
    }
  };

  const markAllAsRead = async () => {
    if (!onMarkAsViewed || markingRead) return;
    const unread = (visibleNotes || []).filter(
      (note) => !note?.viewed && note?.id
    );
    if (unread.length === 0) return;

    setMarkingRead(true);
    try {
      await Promise.all(
        unread.map((note) =>
          onMarkAsViewed(
            String(note.id),
            note.visitDepartmentId || selectedDeptId || visitDepartmentId
          )
        )
      );
    } catch (error: any) {
      console.error("Failed to mark notes as viewed", error);
    } finally {
      setMarkingRead(false);
    }
  };

  const applyTemplate = (template: string) => {
    setText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return template;
      return `${trimmed}\n- ${template}`;
    });
    textareaRef.current?.focus();
  };

  const addBulletPrefix = () => {
    setText((prev) => (prev ? `${prev}\n- ` : "- "));
    textareaRef.current?.focus();
  };

  const addNumberPrefix = () => {
    setText((prev) => {
      if (!prev) return "1. ";
      const lines = prev.split("\n");
      const last = lines[lines.length - 1] || "";
      const match = last.match(/^(\d+)\.\s/);
      const next = match ? Number(match[1]) + 1 : 1;
      return `${prev}\n${next}. `;
    });
    textareaRef.current?.focus();
  };

  const formatLineBlocks = (content: string) => {
    const lines = content.split("\n");
    const blocks: Array<{ type: "ul" | "ol" | "p"; items: string[] }> = [];

    const pushBlock = (type: "ul" | "ol" | "p", value: string) => {
      const last = blocks[blocks.length - 1];
      if (last && last.type === type) {
        last.items.push(value);
        return;
      }
      blocks.push({ type, items: [value] });
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trimEnd();
      if (!line.trim()) return;

      if (line.startsWith("- ")) {
        pushBlock("ul", line.slice(2));
        return;
      }

      const numbered = line.match(/^\d+\.\s+(.*)$/);
      if (numbered) {
        pushBlock("ol", numbered[1]);
        return;
      }

      pushBlock("p", line);
    });

    if (blocks.length === 0) {
      return <p className="text-xs text-muted-foreground">No content</p>;
    }

    return (
      <div className="space-y-1 mt-1">
        {blocks.map((block, idx) => {
          if (block.type === "ul") {
            return (
              <ul
                key={`ul-${idx}`}
                className="list-disc pl-4 text-xs text-foreground/90 space-y-0.5"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={`ul-${idx}-${itemIdx}`}>{item}</li>
                ))}
              </ul>
            );
          }

          if (block.type === "ol") {
            return (
              <ol
                key={`ol-${idx}`}
                className="list-decimal pl-4 text-xs text-foreground/90 space-y-0.5"
              >
                {block.items.map((item, itemIdx) => (
                  <li key={`ol-${idx}-${itemIdx}`}>{item}</li>
                ))}
              </ol>
            );
          }

          return block.items.map((item, itemIdx) => (
            <p
              key={`p-${idx}-${itemIdx}`}
              className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed"
            >
              {item}
            </p>
          ));
        })}
      </div>
    );
  };

  const activeTypeConfig = getNoteTypeConfig(selectedType);
  const currentTemplates = QUICK_TEMPLATES[selectedType.toUpperCase()] || QUICK_TEMPLATES.PUBLIC;
  const hasDraft = text.trim().length > 0;

  return (
    <>
      {/* Floating Toggle Button */}
      {!hideToggleButton && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
          <Button
            type="button"
            size="icon"
            className="relative rounded-full h-12 w-12 border-2 border-border/80 bg-card text-foreground hover:bg-accent shadow-xl transition-all duration-200 hover:scale-105"
            onClick={() => setOpenState(!isOpen)}
            aria-label="Toggle notes"
            title="Visit Notes"
          >
            <StickyNote className="h-5 w-5 text-primary" />
            {!isOpen && unreadNotesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold leading-5 text-center shadow-lg ring-2 ring-background animate-bounce">
                {unreadNotesCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Floating Notes Panel */}
      {isOpen && (
        <div
          role="region"
          aria-label={title}
          className="fixed right-6 sm:right-16 top-1/2 -translate-y-1/2 w-[420px] max-w-[calc(100vw-2rem)] max-h-[85vh] z-50 flex flex-col bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <StickyNote className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground leading-none">
                    {title}
                  </h3>
                  {unreadNotesCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold leading-none animate-pulse">
                      {unreadNotesCount} new
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      ({visibleNotes.length})
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Real-time handover & visit notices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadNotesCount > 0 && onMarkAsViewed && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-[11px] rounded-full border-border/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300"
                  onClick={markAllAsRead}
                  disabled={markingRead}
                  title="Mark all notes as read"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  Mark read ({unreadNotesCount})
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                onClick={() => setOpenState(false)}
                aria-label="Close notes"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notes Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[300px] min-h-[140px] bg-muted/15">
            {visibleNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 stroke-1 text-muted-foreground/50 mb-2" />
                <p className="text-xs font-medium">No notes recorded yet</p>
                <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                  Choose a category below to leave instructions or handover
                </p>
              </div>
            ) : (
              visibleNotes.map((note, idx) => {
                const config = getNoteTypeConfig(note.noteType);
                const NoteIcon = config.icon;
                const isUnread = !note.viewed;
                const noteTime = formatRelativeTime(note.createdAt);
                const noteDeptName =
                  note.visitDepartment?.department?.name ||
                  (note.visitDepartmentId ? deptMap[note.visitDepartmentId] : null);

                const createdBy = note.createdBy;
                const isCurrentUser = Boolean(doctor && createdBy?.id === doctor.id);
                const authorRole = createdBy?.role || (createdBy?.roles ? createdBy.roles[0] : "");
                const authorName = isCurrentUser
                  ? "You"
                  : [createdBy?.firstName?.trim(), createdBy?.lastName?.trim()]
                      .filter(Boolean)
                      .join(" ") || "Staff";

                return (
                  <div
                    key={`${note.id || note.noteType || "note"}-${idx}`}
                    className={`rounded-xl border p-2.5 transition-all duration-150 ${
                      isUnread
                        ? `${config.borderAccent} border-l-4 border-emerald-500/40 bg-card shadow-sm ring-1 ring-emerald-500/20`
                        : "border-border/60 bg-card/70 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/40">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Note Purpose Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold tracking-wide ${config.badgeClass}`}
                        >
                          <NoteIcon className="h-3 w-3" />
                          {config.label}
                        </span>

                        {/* Department Badge */}
                        {noteDeptName && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground border border-border/50">
                            {noteDeptName}
                          </span>
                        )}

                        {/* Author */}
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                          <User className="h-2.5 w-2.5 text-muted-foreground" />
                          {authorName}
                          {authorRole && !isCurrentUser && (
                            <span className="text-[10px] text-muted-foreground font-normal">
                              ({authorRole})
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {noteTime && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground whitespace-nowrap">
                            <Clock className="h-2.5 w-2.5" />
                            {noteTime}
                          </span>
                        )}

                        {/* Mark As Read / Read Status */}
                        {isUnread ? (
                          onMarkAsViewed && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (note.id) handleMarkAsViewed(note.id);
                              }}
                              disabled={markingRead}
                              title="Mark as read"
                            >
                              <Check className="h-3 w-3 mr-0.5" />
                              Mark read
                            </Button>
                          )
                        ) : (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/70"
                            title="Read"
                          >
                            <CheckCheck className="h-3 w-3 text-emerald-600/70" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note Content */}
                    {formatLineBlocks(note.content || "")}
                  </div>
                );
              })
            )}

            {/* Targeted Typing Indicator */}
            {activeTypingViewers.length > 0 && (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Pencil className="h-3.5 w-3.5 animate-pulse text-primary shrink-0" />
                  <p className="truncate text-[11px]">
                    <span className="font-semibold">
                      {activeTypingViewers.map((v) => v.viewer.name).join(", ")}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {activeTypingViewers.length === 1
                        ? `is typing a ${activeTypingViewers[0].noteType.toLowerCase()} note...`
                        : "are typing notes..."}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Composer Section */}
          {onAddNote && (
            <div className="p-3 border-t border-border/70 bg-card space-y-2">
              {/* Category Segmented Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {noteTypes.map((type) => {
                  const cfg = getNoteTypeConfig(type);
                  const Icon = cfg.icon;
                  const isSelected = selectedType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
                        isSelected
                          ? cfg.pillActive
                          : `bg-muted/70 ${cfg.pillInactive}`
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Department selection (shown when visit has multiple departments) */}
              {validDepts.length > 1 && (
                <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                  <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                    Dept:
                  </span>
                  <select
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="h-6 text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary truncate max-w-[240px]"
                  >
                    {validDepts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.department?.name || d.name || "Department"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quick Template Chips */}
              {currentTemplates && currentTemplates.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none text-[11px]">
                  <span className="inline-flex items-center text-[10px] text-muted-foreground font-medium shrink-0">
                    <Sparkles className="h-3 w-3 text-amber-500 mr-0.5" />
                    Quick:
                  </span>
                  {currentTemplates.map((template, idx) => (
                    <button
                      key={`tmpl-${idx}`}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground text-[10px] font-medium border border-border/50 transition-colors whitespace-nowrap shrink-0"
                      title={template}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              )}

              {/* Textarea */}
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    // Send on Cmd+Enter or Ctrl+Enter
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      if (!submitting && hasDraft) {
                        void handleAdd();
                      }
                      return;
                    }

                    // Auto-continuation for bullet and numbered lists
                    if (e.key !== "Enter" || e.shiftKey) return;

                    const textarea = e.currentTarget;
                    const cursorPos = textarea.selectionStart;
                    const textBeforeCursor = text.slice(0, cursorPos);
                    const lines = textBeforeCursor.split("\n");
                    const currentLine = lines[lines.length - 1] || "";

                    const bulletMatch = currentLine.match(/^(\s*)-\s/);
                    if (bulletMatch) {
                      e.preventDefault();
                      const indent = bulletMatch[1];
                      const textAfterCursor = text.slice(cursorPos);
                      const updated = `${textBeforeCursor}\n${indent}- ${textAfterCursor}`;
                      setText(updated);
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                          cursorPos + indent.length + 3;
                      }, 0);
                      return;
                    }

                    const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
                    if (numberedMatch) {
                      e.preventDefault();
                      const indent = numberedMatch[1];
                      const nextNum = Number(numberedMatch[2]) + 1;
                      const textAfterCursor = text.slice(cursorPos);
                      const updated = `${textBeforeCursor}\n${indent}${nextNum}. ${textAfterCursor}`;
                      setText(updated);
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                          cursorPos + indent.length + String(nextNum).length + 3;
                      }, 0);
                    }
                  }}
                  rows={3}
                  placeholder={activeTypeConfig.placeholder}
                  className="bg-muted/40 border-border/80 focus-visible:ring-1 focus-visible:ring-primary text-xs resize-none"
                />
              </div>

              {/* Formatting bar & Actions */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={addBulletPrefix}
                    title="Insert bullet list item"
                  >
                    <List className="h-3 w-3 mr-0.5" />
                    List
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={addNumberPrefix}
                    title="Insert numbered list item"
                  >
                    <ListOrdered className="h-3 w-3 mr-0.5" />
                    Numbered
                  </Button>
                  <span className="hidden sm:inline text-[10px] text-muted-foreground/60 ml-1">
                    ⌘+Enter to send
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasDraft && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs rounded-full text-muted-foreground hover:text-foreground"
                      onClick={handleClear}
                      title="Clear draft"
                    >
                      <X className="h-3.5 w-3.5 mr-0.5" />
                      Clear
                    </Button>
                  )}

                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-3 text-xs rounded-full gap-1"
                    onClick={handleAdd}
                    disabled={!hasDraft || submitting}
                    title="Send note"
                  >
                    {submitting ? (
                      <Check className="h-3.5 w-3.5 opacity-60 animate-pulse" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
