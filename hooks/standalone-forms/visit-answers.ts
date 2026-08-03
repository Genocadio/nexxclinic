import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_DEPARTMENT_FORMS_QUERY,
  GET_STANDALONE_ANSWER_QUERY,
} from "../queries/standalone-forms";
import {
  SAVE_VISIT_STANDALONE_ANSWER_MUTATION,
  UPDATE_STANDALONE_ANSWER_MUTATION,
} from "../mutations/standalone-forms";
import type { StandaloneForm, StandaloneFormVersion } from "./hooks";

export interface StandaloneFormAnswer {
  id: string;
  answers: Record<string, unknown>;
  score?: number | null;
  status: string;
  patientId?: string | null;
  visitId?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  form: StandaloneForm;
  formVersion: StandaloneFormVersion;
}

export function useStandaloneAnswer(
  answerId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(
    GET_STANDALONE_ANSWER_QUERY,
    {
      variables: { id: answerId },
      skip: !answerId || options?.skip,
      fetchPolicy: "network-only",
    },
  );

  const answer: StandaloneFormAnswer | null =
    data?.getStandaloneAnswer?.data ?? null;
  return { answer, loading, error: error?.message ?? null, refetch };
}

export function useSaveVisitStandaloneAnswer() {
  const [saveVisitMutate, { loading: savingVisit, error: saveVisitError }] =
    useMutation(SAVE_VISIT_STANDALONE_ANSWER_MUTATION);
  const [
    updateAnswerMutate,
    { loading: updatingAnswer, error: updateAnswerError },
  ] = useMutation(UPDATE_STANDALONE_ANSWER_MUTATION);

  const saveVisitAnswer = useCallback(async (input: {
    visitId: string;
    visitDepartmentId: string;
    formVersionId: string;
    answers: Record<string, unknown>;
    status?: "DRAFT" | "FINAL";
    score?: number;
    answerId?: string | null;
  }) => {
    if (input.answerId) {
      const { data } = await updateAnswerMutate({
        variables: {
          answerId: input.answerId,
          answers: input.answers,
          status: input.status,
          score: input.score,
        },
      });
      if (data?.updateStandaloneAnswer?.status === "ERROR") {
        throw new Error(
          data.updateStandaloneAnswer.message ?? "Failed to update answer",
        );
      }
      return {
        answer: data?.updateStandaloneAnswer?.data as StandaloneFormAnswer,
        visitDepartment: {
          id: input.visitDepartmentId,
          answerId: input.answerId,
        },
      };
    }

    const { data } = await saveVisitMutate({
      variables: {
        visitId: input.visitId,
        visitDepartmentId: input.visitDepartmentId,
        formVersionId: input.formVersionId,
        answers: input.answers,
        status: input.status,
        score: input.score,
      },
    });
    if (data?.saveVisitStandaloneAnswer?.status === "ERROR") {
      throw new Error(
        data.saveVisitStandaloneAnswer.message ?? "Failed to save answer",
      );
    }
    return data?.saveVisitStandaloneAnswer?.data as {
      answer: StandaloneFormAnswer;
      visitDepartment: { id: string; answerId?: string | null };
    };
  }, [saveVisitMutate, updateAnswerMutate]);

  return {
    saveVisitAnswer,
    loading: savingVisit || updatingAnswer,
    error: saveVisitError?.message ?? updateAnswerError?.message ?? null,
  };
}

export function useConsultationFormLoader(options: {
  departmentId: string | null;
  answerId?: string | null;
}) {
  const hasAnswer = Boolean(options.answerId);
  const {
    answer,
    loading: answerLoading,
    error: answerError,
    refetch: refetchAnswer,
  } = useStandaloneAnswer(options.answerId ?? null, { skip: !hasAnswer });

  // Always fetch the department's default form as well: it is the primary
  // source on a first-ever consultation (no answer yet) and the fallback when a
  // saved answer cannot be loaded or mapped — preventing the
  // "Could not load the saved consultation answer." dead-end.
  const {
    defaultForm,
    loading: deptFormsLoading,
    error: deptFormsError,
    refetch: refetchDeptForms,
  } = useDepartmentFormsForConsultation(options.departmentId, {
    skip: !options.departmentId,
  });

  const answerReady = hasAnswer && Boolean(answer);
  // With an answerId, keep loading until the answer is ready (or, if it fails,
  // until the default-form fallback is ready). Without an answerId, load the
  // default form as usual.
  const loading = hasAnswer
    ? answerLoading || (!answerReady && deptFormsLoading)
    : deptFormsLoading;

  // Surface an error only when there is nothing left to fall back to AND the
  // fallback query has settled (so we never flash an error while the default
  // form is still loading).
  const error = hasAnswer
    ? answerError && !answerReady && !defaultForm && !deptFormsLoading
      ? answerError
      : null
    : deptFormsError;

  return {
    answer,
    defaultForm,
    loading,
    error,
    refetch: hasAnswer ? refetchAnswer : refetchDeptForms,
    source: hasAnswer ? ("answer" as const) : ("department" as const),
  };
}

function useDepartmentFormsForConsultation(
  departmentId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(
    GET_DEPARTMENT_FORMS_QUERY,
    {
      variables: { departmentId },
      skip: !departmentId || options?.skip,
      fetchPolicy: "network-only",
    },
  );

  const defaultForm: StandaloneForm | null =
    data?.getDepartmentForms?.data?.defaultForm ?? null;

  return {
    defaultForm,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
