"use client";

import VisitNotesFloating, {
  type VisitDepartmentOption,
} from "@/components/visit-notes-floating";
import {
  useVisitDepartmentNotes,
  useAddVisitDepartmentNote,
  useMarkVisitDepartmentNotesViewed,
} from "@/hooks/visits/hooks";

export interface DepartmentNotesFloatingProps {
  visitId: string;
  visitDepartments: VisitDepartmentOption[];
  noteTypes?: string[];
  allowedDisplayTypes?: string[];
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideToggleButton?: boolean;
}

export default function DepartmentNotesFloating({
  visitId,
  visitDepartments,
  noteTypes = ["PUBLIC", "CONSULTATION", "BILLING", "FORMS", "ADMIN"],
  allowedDisplayTypes = ["PUBLIC", "CONSULTATION", "BILLING", "FORMS", "ADMIN"],
  title = "Visit Notes",
  open,
  onOpenChange,
  hideToggleButton = false,
}: DepartmentNotesFloatingProps) {
  // Fetch all visit notes across all departments so managers and admins see the complete visit feed
  const { notes: allVisitNotes, refetch } = useVisitDepartmentNotes(visitId, null);
  const { addVisitDepartmentNote } = useAddVisitDepartmentNote();
  const { markNotesViewed } = useMarkVisitDepartmentNotesViewed();

  const handleAddNote = async (
    noteType: string,
    content: string,
    targetDeptId?: string,
  ) => {
    const deptId = targetDeptId || visitDepartments?.[0]?.id;
    if (!deptId) {
      throw new Error("No department found for this visit");
    }
    const result = await addVisitDepartmentNote(deptId, content, noteType);
    if (result?.status !== "SUCCESS") {
      throw new Error(result?.message || "Failed to add note");
    }
    await refetch();
  };

  const handleMarkAsViewed = async (
    _noteId?: string,
    targetDeptId?: string,
  ) => {
    if (targetDeptId) {
      await markNotesViewed(targetDeptId);
    } else {
      for (const d of visitDepartments || []) {
        if (d.id) {
          await markNotesViewed(d.id);
        }
      }
    }
    await refetch();
  };

  if (!visitDepartments || visitDepartments.length === 0) return null;

  return (
    <VisitNotesFloating
      title={title}
      notes={allVisitNotes}
      noteTypes={noteTypes}
      allowedDisplayTypes={allowedDisplayTypes}
      visitId={visitId}
      visitDepartmentId={visitDepartments[0]?.id}
      visitDepartments={visitDepartments}
      onAddNote={handleAddNote}
      onMarkAsViewed={handleMarkAsViewed}
      open={open}
      onOpenChange={onOpenChange}
      hideToggleButton={hideToggleButton}
    />
  );
}
