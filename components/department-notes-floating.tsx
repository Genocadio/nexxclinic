"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useVisitDepartmentNotes,
  useAddVisitDepartmentNote,
  useMarkVisitDepartmentNotesViewed,
} from "@/hooks/visits/hooks";
import { hasRole } from "@/lib/role-utils";

interface VisitDepartment {
  id: string;
  status?: string | null;
  department?: {
    id?: string;
    name?: string;
  } | null;
}

interface DepartmentNotesFloatingProps {
  visitId: string;
  visitDepartments: VisitDepartment[];
  noteTypes?: string[];
  allowedDisplayTypes?: string[];
}

// ─── Inline note content renderer ──────────────────────────────────────────────

function formatLineBlocks(content: string) {
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

  if (blocks.length === 0)
    return <p className="text-xs text-muted-foreground">No content</p>;

  return (
    <div className="space-y-1">
      {blocks.map((block, idx) => {
        if (block.type === "ul")
          return (
            <ul
              key={idx}
              className="list-disc pl-4 text-xs text-foreground space-y-0.5"
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        if (block.type === "ol")
          return (
            <ol
              key={idx}
              className="list-decimal pl-4 text-xs text-foreground space-y-0.5"
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        return block.items.map((item, i) => (
          <p
            key={`${idx}-${i}`}
            className="text-xs text-foreground whitespace-pre-wrap"
          >
            {item}
          </p>
        ));
      })}
    </div>
  );
}

// ─── Per-department notes panel ────────────────────────────────────────────────

interface DeptPanelProps {
  visitId: string;
  visitDepartmentId: string;
  noteTypes: string[];
  allowedDisplayTypes?: string[];
  active: boolean;
}

function DeptNotesPanel({
  visitId,
  visitDepartmentId,
  noteTypes,
  allowedDisplayTypes,
  active,
}: DeptPanelProps) {
  const { doctor } = useAuth();
  const userRoles = doctor?.roles || [];
  const isManagerOrAdmin =
    hasRole(userRoles, "MANAGER") || hasRole(userRoles, "ADMIN");

  const effectiveNoteTypes = useMemo(() => {
    if (isManagerOrAdmin) {
      const allTypes = ["PUBLIC", "CONSULTATION", "BILLING", "FORMS", "ADMIN"];
      return Array.from(new Set([...noteTypes, ...allTypes]));
    }
    return noteTypes;
  }, [isManagerOrAdmin, noteTypes]);

  const { notes: rawNotes, refetch } = useVisitDepartmentNotes(
    active ? visitId : null,
    active ? visitDepartmentId : null,
  );
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();

  const [text, setText] = useState("");
  const [selectedType, setSelectedType] = useState(
    effectiveNoteTypes[0] || "PUBLIC",
  );
  const [submitting, setSubmitting] = useState(false);
  // In-flight "mark as read" request — prevents duplicate markNotesViewed calls.
  const [markingRead, setMarkingRead] = useState(false);

  // Reset input when switching departments
  useEffect(() => {
    setText("");
  }, [visitDepartmentId]);

  // Refetch when tab becomes active
  useEffect(() => {
    if (active) refetch?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, visitDepartmentId]);

  // Keep selectedType valid if noteTypes list changes
  useEffect(() => {
    if (!effectiveNoteTypes.includes(selectedType))
      setSelectedType(effectiveNoteTypes[0] || "PUBLIC");
  }, [effectiveNoteTypes, selectedType]);

  const visibleNotes = useMemo(() => {
    const all = rawNotes || [];
    if (isManagerOrAdmin) return all; // Admins and managers can see ALL note types!
    if (!allowedDisplayTypes || allowedDisplayTypes.length === 0) return all;
    const allowed = new Set(allowedDisplayTypes);
    return all.filter(
      (n: any) => n?.noteType && allowed.has(String(n.noteType)),
    );
  }, [rawNotes, allowedDisplayTypes, isManagerOrAdmin]);

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      const result = await addVisitDepartmentNote(
        visitDepartmentId,
        trimmed,
        selectedType,
      );
      if (result?.status !== "SUCCESS")
        throw new Error(result?.message || "Failed to add note");
      setText("");
      await refetch?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save note");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsViewed = async (_noteId: string) => {
    if (markingRead) return;
    setMarkingRead(true);
    try {
      await markNotesViewed(visitDepartmentId);
      await refetch?.();
    } catch {
      /* silent */
    } finally {
      setMarkingRead(false);
    }
  };

  const addBulletPrefix = () => setText((p) => (p ? `${p}\n- ` : "- "));
  const addNumberPrefix = () =>
    setText((p) => {
      if (!p) return "1. ";
      const lines = p.split("\n");
      const last = lines[lines.length - 1] || "";
      const match = last.match(/^(\d+)\.\s/);
      return `${p}\n${match ? Number(match[1]) + 1 : 1}. `;
    });

  return (
    <div className="space-y-3">
      {/* Notes list */}
      <div className="max-h-52 overflow-y-auto rounded-xl border border-border/70 bg-background/70 p-3 space-y-2">
        {visibleNotes.length === 0 ? (
          <p className="text-xs text-muted-foreground">No notes yet.</p>
        ) : (
          visibleNotes.map((note: any, idx: number) => (
            <div
              key={`${note.id || note.noteType || "note"}-${idx}`}
              className="rounded-lg border border-border bg-card p-2 cursor-default"
              onClick={() =>
                !note.viewed && note.id && !markingRead
                  ? handleMarkAsViewed(note.id)
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {note.noteType || "PUBLIC"}
                  {!note.viewed && (
                    <span className="ml-1 text-[10px] bg-primary text-primary-foreground px-1 rounded-full animate-pulse">
                      NEW
                    </span>
                  )}
                </p>
                {(() => {
                  const cb = note.createdBy;
                  if (!cb)
                    return (
                      <span className="text-[11px] text-muted-foreground">
                        Unknown
                      </span>
                    );
                  if (doctor && cb.id === doctor.id)
                    return (
                      <span className="text-[11px] text-muted-foreground italic">
                        You
                      </span>
                    );
                  const name = [cb.firstName?.trim(), cb.lastName?.trim()]
                    .filter(Boolean)
                    .join(" ");
                  return name ? (
                    <span className="text-[11px] text-muted-foreground">
                      {name}
                    </span>
                  ) : null;
                })()}
              </div>
              {formatLineBlocks(note.content || "")}
            </div>
          ))
        )}
      </div>

      {/* Add note form */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="h-7 rounded-full px-3 text-[12px]"
            onClick={addBulletPrefix}
          >
            • List
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-7 rounded-full px-3 text-[12px]"
            onClick={addNumberPrefix}
          >
            1. Numbered
          </Button>
          {noteTypes.length > 1 ? (
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-7 min-h-0 w-auto rounded-full border-border/70 bg-background/80 px-3 py-0 text-[12px] font-semibold text-muted-foreground leading-none [&>svg]:hidden">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="min-w-30 rounded-xl p-1">
                {noteTypes.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    className="h-7 text-[12px] leading-none px-2"
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="inline-flex rounded-full border border-border/70 px-3 py-1 text-[12px] font-semibold text-muted-foreground">
              {selectedType}
            </div>
          )}
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || e.shiftKey) return;
            const ta = e.currentTarget;
            const pos = ta.selectionStart;
            const before = text.slice(0, pos);
            const lines = before.split("\n");
            const cur = lines[lines.length - 1] || "";
            const bullet = cur.match(/^(\s*)-\s/);
            if (bullet) {
              e.preventDefault();
              const indent = bullet[1];
              const updated = `${before}\n${indent}- ${text.slice(pos)}`;
              setText(updated);
              setTimeout(() => {
                ta.selectionStart = ta.selectionEnd = pos + indent.length + 3;
              }, 0);
              return;
            }
            const numbered = cur.match(/^(\s*)(\d+)\.\s/);
            if (numbered) {
              e.preventDefault();
              const indent = numbered[1];
              const next = Number(numbered[2]) + 1;
              const updated = `${before}\n${indent}${next}. ${text.slice(pos)}`;
              setText(updated);
              setTimeout(() => {
                ta.selectionStart = ta.selectionEnd =
                  pos + indent.length + String(next).length + 3;
              }, 0);
            }
          }}
          rows={4}
          placeholder="Write note..."
          className="bg-background/80 border-border/80"
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-full"
            onClick={() => setText("")}
          >
            Clear
          </Button>
          <Button
            type="button"
            className="h-8 rounded-full"
            onClick={handleAdd}
            disabled={submitting || text.trim().length === 0}
          >
            {submitting ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main wrapper ───────────────────────────────────────────────────────────────

export default function DepartmentNotesFloating({
  visitId,
  visitDepartments,
  noteTypes = ["PUBLIC"],
  allowedDisplayTypes,
}: DepartmentNotesFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const { doctor } = useAuth();
  const userRoles = doctor?.roles || [];
  const isManagerOrAdmin =
    hasRole(userRoles, "MANAGER") || hasRole(userRoles, "ADMIN");

  const depts = visitDepartments.filter((d) => !!d.id);
  const activeDept = depts.find((d) => d.id === activeTabId) ?? depts[0];

  // Fetch all visit notes to compute total unread notes badge
  const { notes: allVisitNotes } = useVisitDepartmentNotes(visitId, null);

  const unreadCount = useMemo(() => {
    if (!allVisitNotes) return 0;
    if (isManagerOrAdmin) {
      return (allVisitNotes as any[]).filter((n: any) => !n?.viewed).length;
    }
    const allowed = allowedDisplayTypes ? new Set(allowedDisplayTypes) : null;
    return (allVisitNotes as any[]).filter(
      (n: any) => !n?.viewed && (!allowed || allowed.has(String(n?.noteType))),
    ).length;
  }, [allVisitNotes, isManagerOrAdmin, allowedDisplayTypes]);

  // Initialise / update the active tab when departments change
  useEffect(() => {
    if (depts.length === 0) return;
    // If the current active tab is no longer present, reset to the first
    if (!activeTabId || !depts.find((d) => d.id === activeTabId)) {
      setActiveTabId(depts[0].id);
    }
  }, [depts.map((d) => d.id).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Nothing to show if there are no departments
  if (depts.length === 0) return null;

  return (
    <>
      {/* ── Toggle button ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle department notes"
          title="Department Notes"
          className="relative rounded-full h-12 w-12 flex items-center justify-center border-2 border-white bg-card text-foreground hover:bg-card shadow-lg"
        >
          {/* sticky-note icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
            <path d="M15 3v6h6" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Floating panel ── */}
      {isOpen && (
        <div className="fixed right-20 top-1/2 -translate-y-1/2 w-90 max-w-[calc(100vw-7rem)] z-40 bg-card border border-border rounded-2xl shadow-2xl p-4 flex flex-col gap-3">
          {/* 1. Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>Department Notes</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Notes are scoped per department
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
              aria-label="Close notes"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Department tabs — always at top, above notes */}
          {depts.length > 1 && (
            <div className="flex flex-wrap gap-1.5 pb-1 border-b border-border/50">
              {depts.map((dept) => {
                const label = dept.department?.name || dept.id;
                const isActive = dept.id === activeDept.id;
                const deptUnread = (allVisitNotes || []).filter(
                  (n: any) => n.visitDepartmentId === dept.id && !n.viewed,
                ).length;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setActiveTabId(dept.id)}
                    className={[
                      "h-7 rounded-full px-3 text-[12px] font-semibold transition-colors border flex items-center gap-1.5",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:border-primary/60 hover:text-foreground",
                    ].join(" ")}
                  >
                    <span>{label}</span>
                    {deptUnread > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center">
                        {deptUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Single-department label */}
          {depts.length === 1 && (
            <div className="inline-flex rounded-full border border-border/70 px-3 py-1 text-[12px] font-semibold text-muted-foreground self-start">
              {depts[0].department?.name || "Department"}
            </div>
          )}

          {/* 3. Notes content for the active department tab */}
          <DeptNotesPanel
            key={activeDept.id}
            visitId={visitId}
            visitDepartmentId={activeDept.id}
            noteTypes={noteTypes}
            allowedDisplayTypes={allowedDisplayTypes}
            active={isOpen}
          />
        </div>
      )}
    </>
  );
}
