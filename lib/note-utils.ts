import { hasRole, hasAdminOrManagerAccess } from "./role-utils";

export interface NoteLike {
  id?: string;
  content?: string | null;
  noteType?: string | null;
  createdBy?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
  } | null;
  targetUsers?: Array<{ id?: string }> | null;
  createdAt?: string | null;
  viewed?: boolean;
}

export interface DepartmentLike {
  id?: string;
  status?: string | null;
  completedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * Checks whether the user roles include billing privileges (FINANCE, ADMIN, MANAGER, CLINIC_ADMIN).
 */
export function canUserViewBillingNotes(userRoles: string[] = []): boolean {
  return (
    hasAdminOrManagerAccess(userRoles) ||
    hasRole(userRoles, "FINANCE") ||
    hasRole(userRoles, "CASHIER")
  );
}

/**
 * Checks whether the user has admin or manager privileges.
 */
export function isAdminOrManager(userRoles: string[] = []): boolean {
  return hasAdminOrManagerAccess(userRoles);
}

/**
 * Rule 1: A user not in billing should NEVER see billing notes anywhere,
 * unless they were the creator of that note.
 * Rule 2: Admin/managers can fetch and see all notes.
 */
export function canUserViewNote(
  note: NoteLike,
  userRoles: string[] = [],
  currentUserId?: string
): boolean {
  if (!note) return false;

  const creatorId = note.createdBy?.id;
  const isCreator = Boolean(currentUserId && creatorId && currentUserId === creatorId);
  if (isCreator) {
    return true;
  }

  if (isAdminOrManager(userRoles)) {
    return true;
  }

  const type = String(note.noteType || "PUBLIC").toUpperCase();
  if (type === "BILLING" && !canUserViewBillingNotes(userRoles)) {
    return false;
  }

  if (note.targetUsers && note.targetUsers.length > 0) {
    if (!currentUserId) return false;
    const inTargets = note.targetUsers.some((u) => u.id === currentUserId);
    if (!inTargets) return false;
  }

  return true;
}

/**
 * Attention & Unread rules:
 * - If user cannot view note -> false (never unread, no warning, no dot).
 * - Creator's own note is never unread for them.
 * - For Admin/Manager: apart from ADMIN (and PUBLIC) notes, no other notes should show unread dot marker or count as unread.
 * - For other users: if a visitdepartment is completed or finalised, notes created before or at completion time
 *   are no longer enforced for reading (not unread). Notes created after completion still require attention.
 */
export function isNoteUnreadForUser(
  note: NoteLike,
  userRoles: string[] = [],
  currentUserId?: string,
  department?: DepartmentLike | null
): boolean {
  if (!note) return false;
  if (!canUserViewNote(note, userRoles, currentUserId)) {
    return false;
  }

  const creatorId = note.createdBy?.id;
  if (currentUserId && creatorId && currentUserId === creatorId) {
    return false;
  }

  const type = String(note.noteType || "PUBLIC").toUpperCase();

  // Admin/Manager rule:
  // "apart from admin notes no any other notes they should see unread dot marker anywhere irregardless of whether read or not the unread for them is global notes or admin only"
  if (isAdminOrManager(userRoles)) {
    if (type !== "ADMIN" && type !== "PUBLIC") {
      return false;
    }
  } else {
    // Completed department rule for all other users:
    const status = String(department?.status || "").toUpperCase();
    if (status === "COMPLETED" || status === "FINALISED") {
      const completionTimeStr =
        department?.completedAt || department?.updatedAt || department?.createdAt;
      if (completionTimeStr && note.createdAt) {
        const completionTime = new Date(completionTimeStr).getTime();
        const noteTime = new Date(note.createdAt).getTime();
        if (!isNaN(completionTime) && !isNaN(noteTime) && noteTime <= completionTime) {
          return false;
        }
      }
    }
  }

  return !note.viewed;
}

/**
 * Computes unread notes count for a list of notes.
 */
export function countUnreadNotes(
  notes: NoteLike[] = [],
  userRoles: string[] = [],
  currentUserId?: string,
  department?: DepartmentLike | null
): number {
  return (notes || []).filter((note) =>
    isNoteUnreadForUser(note, userRoles, currentUserId, department)
  ).length;
}
