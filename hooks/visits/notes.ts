import { useMutation, useQuery } from "@apollo/client";
import { VISIT_DEPARTMENT_NOTES_QUERY } from "../queries";
import {
  ADD_VISIT_DEPARTMENT_NOTE_MUTATION,
  MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION,
  MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION,
} from "../mutations";
import type { ApiResponse } from "../types";

export function useVisitDepartmentNotes(
  visitId: string | null,
  visitDepartmentId: string | null,
) {
  const { data, loading, error, refetch } = useQuery(
    VISIT_DEPARTMENT_NOTES_QUERY,
    {
      variables: { visitId, visitDepartmentId },
      skip: !visitId || !visitDepartmentId,
      fetchPolicy: "cache-and-network",
    },
  );

  const notes = data?.visitDepartmentNotes?.data || [];
  const errorMessage = error?.message || null;

  return {
    notes,
    loading,
    error: errorMessage,
    refetch,
  };
}

export function useAddVisitDepartmentNote() {
  const [mutation, { loading, error }] = useMutation(
    ADD_VISIT_DEPARTMENT_NOTE_MUTATION,
  );

  const addVisitDepartmentNote = async (
    visitDepartmentId: string,
    content: string,
    noteType: string,
    targetUserIds: string[] = [],
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentId,
            content,
            noteType,
            targetUserId: targetUserIds,
          },
        },
      });
      return result.data?.addVisitDepartmentNote;
    } catch (err) {
      console.error("Add visit department note error:", err);
      throw err;
    }
  };

  return { addVisitDepartmentNote, loading, error };
}

export function useMarkVisitDepartmentNoteViewed() {
  const [mutation, { loading, error }] = useMutation(
    MARK_VISIT_DEPARTMENT_NOTE_VIEWED_MUTATION,
  );

  const markNoteViewed = async (noteId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { noteId } });
      return result.data?.markVisitDepartmentNoteViewed;
    } catch (err) {
      console.error("Mark note viewed error:", err);
      throw err;
    }
  };

  return { markNoteViewed, loading, error };
}

export function useMarkVisitDepartmentNotesViewed() {
  const [mutation, { loading, error }] = useMutation(
    MARK_VISIT_DEPARTMENT_NOTES_VIEWED_MUTATION,
  );

  const markNotesViewed = async (
    visitDepartmentId: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitDepartmentId } });
      return result.data?.markVisitDepartmentNotesViewed;
    } catch (err) {
      console.error("Mark notes viewed error:", err);
      throw err;
    }
  };

  return { markNotesViewed, loading, error };
}
