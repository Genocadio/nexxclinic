import { useMutation, useQuery } from "@apollo/client";
import {
  GET_DEPARTMENT_FORMS_QUERY,
  GET_STANDALONE_FORMS_QUERY,
} from "../queries/standalone-forms";
import {
  LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION,
  SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION,
  UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION,
} from "../mutations/standalone-forms";
import type { StandaloneForm } from "./hooks";

export interface DepartmentLinkedForm {
  form: StandaloneForm;
  isDefault: boolean;
}

export interface DepartmentFormsResult {
  forms: DepartmentLinkedForm[];
  defaultForm?: StandaloneForm | null;
}

function unwrapDepartmentForms(data: unknown): DepartmentFormsResult {
  const payload = (
    data as { getDepartmentForms?: { data?: DepartmentFormsResult } }
  )?.getDepartmentForms;
  return {
    forms: payload?.data?.forms ?? [],
    defaultForm: payload?.data?.defaultForm ?? null,
  };
}

export function useDepartmentForms(
  departmentId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery(
    GET_DEPARTMENT_FORMS_QUERY,
    {
      variables: { departmentId },
      skip: !departmentId || options?.skip,
      fetchPolicy: "cache-and-network",
    },
  );

  const result = unwrapDepartmentForms(data);
  return {
    linkedForms: result.forms,
    defaultForm: result.defaultForm,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSearchStandaloneForms(search: string) {
  const query = search.trim();
  const { data, loading } = useQuery(GET_STANDALONE_FORMS_QUERY, {
    variables: {
      isTemplate: false,
      name: query || undefined,
    },
    skip: !query,
    fetchPolicy: "cache-and-network",
  });

  const forms: StandaloneForm[] = data?.getStandaloneForms?.data ?? [];

  return { forms, loading: query ? loading : false };
}

export function useDepartmentFormLinking(departmentId: string | null) {
  const [linkMutation, { loading: linking }] = useMutation(
    LINK_STANDALONE_FORM_TO_DEPARTMENT_MUTATION,
  );
  const [unlinkMutation, { loading: unlinking }] = useMutation(
    UNLINK_STANDALONE_FORM_FROM_DEPARTMENT_MUTATION,
  );
  const [setDefaultMutation, { loading: settingDefault }] = useMutation(
    SET_DEFAULT_STANDALONE_FORM_FOR_DEPARTMENT_MUTATION,
  );

  const linkForm = async (formId: string) => {
    if (!departmentId) throw new Error("Department is required");
    const { data } = await linkMutation({
      variables: { departmentId, formId },
    });
    if (data?.linkStandaloneFormToDepartment?.status === "ERROR") {
      throw new Error(
        data.linkStandaloneFormToDepartment.message ?? "Failed to link form",
      );
    }
    return data?.linkStandaloneFormToDepartment?.data;
  };

  const unlinkForm = async (formId: string) => {
    if (!departmentId) throw new Error("Department is required");
    const { data } = await unlinkMutation({
      variables: { departmentId, formId },
    });
    if (data?.unlinkStandaloneFormFromDepartment?.status === "ERROR") {
      throw new Error(
        data.unlinkStandaloneFormFromDepartment.message ??
          "Failed to unlink form",
      );
    }
  };

  const setDefaultForm = async (formId: string) => {
    if (!departmentId) throw new Error("Department is required");
    const { data } = await setDefaultMutation({
      variables: { departmentId, formId },
    });
    if (data?.setDefaultStandaloneFormForDepartment?.status === "ERROR") {
      throw new Error(
        data.setDefaultStandaloneFormForDepartment.message ??
          "Failed to set default form",
      );
    }
    return data?.setDefaultStandaloneFormForDepartment?.data;
  };

  return {
    linkForm,
    unlinkForm,
    setDefaultForm,
    loading: linking || unlinking || settingDefault,
  };
}
