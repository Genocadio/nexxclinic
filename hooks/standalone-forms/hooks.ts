// @ts-nocheck
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_STANDALONE_FORMS_QUERY,
  GET_STANDALONE_FORM_QUERY,
  GET_STANDALONE_FORM_ANSWERS_QUERY,
} from "../queries/standalone-forms";
import {
  CREATE_STANDALONE_FORM_MUTATION,
  UPDATE_STANDALONE_FORM_MUTATION,
  DELETE_STANDALONE_FORM_MUTATION,
  DUPLICATE_STANDALONE_FORM_MUTATION,
  SAVE_STANDALONE_ANSWER_MUTATION,
} from "../mutations/standalone-forms";
import type { FormBlock, FormTemplateType } from "@/lib/formbuilder-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StandaloneFormVersion {
  id: string;
  formId: string;
  versionLabel: string;
  majorVersion: number;
  minorVersion: number;
  blocks: FormBlock[];
  theme?: Record<string, unknown>;
  status: string;
  createdAt: string;
}

export interface StandaloneForm {
  id: string;
  name: string;
  description?: string;
  type: FormTemplateType;
  category?: string;
  isTemplate: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  activeVersion?: StandaloneFormVersion;
}

export interface StandaloneFormInput {
  name: string;
  description?: string;
  type: string;
  category?: string;
  isTemplate?: boolean;
  blocks: FormBlock[];
  theme?: Record<string, unknown>;
}

export interface StandaloneAnswerListItem {
  id: string;
  answers?: Record<string, unknown> | string | null;
  score?: number | null;
  status: string;
  patientId?: string | null;
  visitId?: string | null;
  submittedBy?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  form?: { id: string; name: string } | null;
  formVersion?: {
    id: string;
    versionLabel?: string | null;
    majorVersion?: number | null;
    minorVersion?: number | null;
  } | null;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all standalone forms, optionally filtered by isTemplate / category */
export function useGetStandaloneForms(options?: {
  isTemplate?: boolean;
  category?: string;
  name?: string;
  skip?: boolean;
}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  console.log(
    "[useGetStandaloneForms] skip:",
    options?.skip,
    "| authToken:",
    token ? `${token.slice(0, 20)}...` : "MISSING",
  );

  const { data, loading, error, refetch } = useQuery(
    GET_STANDALONE_FORMS_QUERY,
    {
      variables: {
        isTemplate: options?.isTemplate,
        category: options?.category,
        name: options?.name,
      },
      skip: options?.skip,
      fetchPolicy: "cache-and-network",
    },
  );

  const forms: StandaloneForm[] = data?.getStandaloneForms?.data ?? [];

  return { forms, loading, error: error?.message ?? null, refetch };
}

/** Fetch a single standalone form by id */
export function useGetStandaloneForm(
  id: string | null,
  options?: { skip?: boolean },
) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  console.log(
    "[useGetStandaloneForm] id:",
    id,
    "| skip:",
    !id || options?.skip,
    "| authToken:",
    token ? `${token.slice(0, 20)}...` : "MISSING",
  );

  const { data, loading, error, refetch } = useQuery(
    GET_STANDALONE_FORM_QUERY,
    {
      variables: { id },
      skip: !id || options?.skip,
      fetchPolicy: "cache-and-network",
    },
  );

  const form: StandaloneForm | null = data?.getStandaloneForm?.data ?? null;

  return { form, loading, error: error?.message ?? null, refetch };
}

/** Fetch answers for a standalone form */
export function useGetStandaloneAnswers(
  formId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(
    GET_STANDALONE_FORM_ANSWERS_QUERY,
    {
      variables: { formId },
      skip: !formId || options?.skip,
      fetchPolicy: "cache-and-network",
    },
  );

  const answers: StandaloneAnswerListItem[] =
    data?.getStandaloneFormAnswers?.data ?? [];

  return { answers, loading, error: error?.message ?? null, refetch };
}

/** Create a new standalone form */
export function useCreateStandaloneForm() {
  const [mutate, { loading, error }] = useMutation(
    CREATE_STANDALONE_FORM_MUTATION,
  );

  const createForm = async (
    input: StandaloneFormInput,
  ): Promise<StandaloneForm> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log(
      "[createStandaloneForm] input:",
      input,
      "| authToken:",
      token ? `${token.slice(0, 20)}...` : "MISSING",
    );
    const { data } = await mutate({ variables: { input } });
    if (data?.createStandaloneForm?.status === "ERROR") {
      throw new Error(
        data.createStandaloneForm.message ?? "Failed to create form",
      );
    }
    return data.createStandaloneForm.data;
  };

  return { createForm, loading, error: error?.message ?? null };
}

/** Update an existing standalone form */
export function useUpdateStandaloneForm() {
  const [mutate, { loading, error }] = useMutation(
    UPDATE_STANDALONE_FORM_MUTATION,
  );

  const updateForm = async (
    id: string,
    input: StandaloneFormInput,
    markFinal?: boolean,
  ): Promise<StandaloneForm> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log(
      "[updateStandaloneForm] id:",
      id,
      "| markFinal:",
      markFinal,
      "| authToken:",
      token ? `${token.slice(0, 20)}...` : "MISSING",
    );
    const { data } = await mutate({ variables: { id, input, markFinal } });
    if (data?.updateStandaloneForm?.status === "ERROR") {
      throw new Error(
        data.updateStandaloneForm.message ?? "Failed to update form",
      );
    }
    return data.updateStandaloneForm.data;
  };

  return { updateForm, loading, error: error?.message ?? null };
}

/** Delete a standalone form */
export function useDeleteStandaloneForm() {
  const [mutate, { loading, error }] = useMutation(
    DELETE_STANDALONE_FORM_MUTATION,
  );

  const deleteForm = async (
    id: string,
    confirmDeleteAnswers = false,
  ): Promise<void> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log(
      "[deleteStandaloneForm] id:",
      id,
      "| authToken:",
      token ? `${token.slice(0, 20)}...` : "MISSING",
    );
    const { data } = await mutate({ variables: { id, confirmDeleteAnswers } });
    if (data?.deleteStandaloneForm?.status === "ERROR") {
      throw new Error(
        data.deleteStandaloneForm.message ?? "Failed to delete form",
      );
    }
  };

  return { deleteForm, loading, error: error?.message ?? null };
}

/** Duplicate a standalone form */
export function useDuplicateStandaloneForm() {
  const [mutate, { loading, error }] = useMutation(
    DUPLICATE_STANDALONE_FORM_MUTATION,
  );

  const duplicateForm = async (
    sourceFormId: string,
  ): Promise<StandaloneForm> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log(
      "[duplicateStandaloneForm] sourceFormId:",
      sourceFormId,
      "| authToken:",
      token ? `${token.slice(0, 20)}...` : "MISSING",
    );
    const { data } = await mutate({ variables: { sourceFormId } });
    if (data?.duplicateStandaloneForm?.status === "ERROR") {
      throw new Error(
        data.duplicateStandaloneForm.message ?? "Failed to duplicate form",
      );
    }
    return data.duplicateStandaloneForm.data;
  };

  return { duplicateForm, loading, error: error?.message ?? null };
}

/** Save an answer for a standalone form version */
export function useSaveStandaloneAnswer() {
  const [mutate, { loading, error }] = useMutation(
    SAVE_STANDALONE_ANSWER_MUTATION,
  );

  const saveAnswer = async (
    formVersionId: string,
    answers: Record<string, unknown>,
    status?: string,
    score?: number,
  ) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    console.log(
      "[saveStandaloneAnswer] formVersionId:",
      formVersionId,
      "| authToken:",
      token ? `${token.slice(0, 20)}...` : "MISSING",
    );
    const { data } = await mutate({
      variables: { formVersionId, answers, status, score },
    });
    if (data?.saveStandaloneAnswer?.status === "ERROR") {
      throw new Error(
        data.saveStandaloneAnswer.message ?? "Failed to save answer",
      );
    }
    return data.saveStandaloneAnswer.data;
  };

  return { saveAnswer, loading, error: error?.message ?? null };
}
