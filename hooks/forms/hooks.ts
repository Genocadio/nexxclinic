// @ts-nocheck
import { useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_FORMS_QUERY,
  GET_FORM_QUERY,
  GET_FORM_VERSION_HISTORY_QUERY,
} from "../queries";
import {
  CREATE_FORM_MUTATION,
  UPDATE_FORM_MUTATION,
  FINALIZE_FORM_MUTATION,
} from "../mutations";
import React from "react";
import type { FormField, FormSection, FormAction, BackendForm } from "../types";
import {
  normalizeFormField,
  normalizeFormSection,
  normalizeFormAction,
} from "./normalize";

const mapBackendForm = (form: any): BackendForm => ({
  id: String(form?.id || ""),
  departmentId: String(form?.departmentId || ""),
  title: form?.title || "",
  description: form?.description || "",
  status: form?.status === "FINAL" ? "FINAL" : "DRAFT",
  version: String(form?.version || ""),
  fields: Array.isArray(form?.fields)
    ? form.fields.map((field: any, idx: number) =>
        normalizeFormField(field, idx),
      )
    : [],
  sections: Array.isArray(form?.sections)
    ? form.sections.map((section: any, idx: number) =>
        normalizeFormSection(section, idx),
      )
    : [],
  actions: Array.isArray(form?.actions)
    ? form.actions.map((action: any, idx: number) =>
        normalizeFormAction(action, idx),
      )
    : [],
  createdAt: String(form?.createdAt || ""),
  updatedAt: String(form?.updatedAt || ""),
});

export function useForms(departmentId: string | null) {
  const [loadForms, { loading, error, data }] = useLazyQuery(GET_FORMS_QUERY, {
    fetchPolicy: "network-only",
  });

  const forms = React.useMemo(() => {
    const rawData = data?.getForms?.data || [];
    return rawData.map((form: any) => mapBackendForm(form));
  }, [data]);

  const load = React.useCallback(
    (options?: Parameters<typeof loadForms>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
      const nextDepartmentId = options?.variables?.departmentId || departmentId;
      if (!nextDepartmentId) {
        return Promise.resolve(undefined);
      }

      return loadForms({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
        },
      });
    },
    [departmentId, loadForms],
  );

  return { forms, loading, error: error?.message || null, loadForms: load };
}

export function useForm(departmentId: string | null, formId: string | null) {
  const [loadForm, { loading, error, data }] = useLazyQuery(GET_FORM_QUERY, {
    fetchPolicy: "network-only",
  });

  const form = React.useMemo(() => {
    const rawData = data?.getForm?.data;
    return rawData ? mapBackendForm(rawData) : null;
  }, [data]);

  const load = React.useCallback(
    (options?: Parameters<typeof loadForm>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
      const nextDepartmentId = options?.variables?.departmentId || departmentId;
      const nextFormId = options?.variables?.formId || formId;

      if (!nextDepartmentId || !nextFormId) {
        return Promise.resolve(undefined);
      }

      return loadForm({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
          formId: nextFormId,
        },
      });
    },
    [departmentId, formId, loadForm],
  );

  return { form, loading, error: error?.message || null, loadForm: load };
}

export function useFormVersionHistory(
  departmentId: string | null,
  formId: string | null,
) {
  const [loadVersionHistory, { loading, error, data }] = useLazyQuery(
    GET_FORM_VERSION_HISTORY_QUERY,
    {
      fetchPolicy: "network-only",
    },
  );

  const versions = React.useMemo(() => {
    const rawData = data?.getFormVersionHistory?.data || [];
    return rawData.map((form: any) => mapBackendForm(form));
  }, [data]);

  const load = React.useCallback(
    (options?: Parameters<typeof loadVersionHistory>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {};
      const nextDepartmentId = options?.variables?.departmentId || departmentId;
      const nextFormId = options?.variables?.formId || formId;

      if (!nextDepartmentId || !nextFormId) {
        return Promise.resolve(undefined);
      }

      return loadVersionHistory({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
          formId: nextFormId,
        },
      });
    },
    [departmentId, formId, loadVersionHistory],
  );

  return {
    versions,
    loading,
    error: error?.message || null,
    loadVersionHistory: load,
  };
}

export function useCreateForm() {
  const [mutation, { loading, error }] = useMutation(CREATE_FORM_MUTATION);

  const createForm = async (
    departmentId: string,
    input: {
      title: string;
      description?: string;
      fields?: FormField[];
      sections?: FormSection[];
      actions?: FormAction[];
    },
  ) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          input: {
            title: input.title,
            description: input.description,
            fields:
              input.fields?.map((field) => ({
                id: field.id,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                required: field.required,
                order: field.order,
                hideLabel: field.hideLabel,
                boldLabel: field.boldLabel,
                italicLabel: field.italicLabel,
                underlineLabel: field.underlineLabel,
                centerLabel: field.centerLabel,
                options: field.options,
                tableConfig: field.tableConfig,
                conditionalRendering: field.conditionalRendering,
              })) || [],
            sections:
              input.sections?.map((section) => ({
                id: section.id,
                title: section.title,
                boldTitle: section.boldTitle,
                italicTitle: section.italicTitle,
                underlineTitle: section.underlineTitle,
                centerTitle: section.centerTitle,
                columns: section.columns,
                order: section.order,
                fields: section.fields.map((field) => ({
                  id: field.id,
                  label: field.label,
                  type: field.type,
                  placeholder: field.placeholder,
                  required: field.required,
                  order: field.order,
                  hideLabel: field.hideLabel,
                  boldLabel: field.boldLabel,
                  italicLabel: field.italicLabel,
                  underlineLabel: field.underlineLabel,
                  centerLabel: field.centerLabel,
                  options: field.options,
                  tableConfig: field.tableConfig,
                  conditionalRendering: field.conditionalRendering,
                })),
              })) || [],
            actions:
              input.actions?.map((action) => ({
                id: action.id,
                name: action.name,
                type: action.type,
                quantity: action.quantity,
                price: action.price,
                isQuantifiable: action.isQuantifiable,
                backendId: action.backendId,
              })) || [],
          },
        },
      });
      const rawData = result.data?.createForm?.data;
      return rawData ? mapBackendForm(rawData) : null;
    } catch (err) {
      console.error("Create form error:", err);
      throw err;
    }
  };

  return { createForm, loading, error: error?.message || null };
}

export function useUpdateForm() {
  const [mutation, { loading, error }] = useMutation(UPDATE_FORM_MUTATION);

  const updateForm = async (
    departmentId: string,
    formId: string,
    input: {
      title?: string;
      description?: string;
      fields?: FormField[];
      sections?: FormSection[];
      actions?: FormAction[];
    },
  ) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          formId,
          input: {
            title: input.title,
            description: input.description,
            fields:
              input.fields?.map((field) => ({
                id: field.id,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                required: field.required,
                order: field.order,
                hideLabel: field.hideLabel,
                boldLabel: field.boldLabel,
                italicLabel: field.italicLabel,
                underlineLabel: field.underlineLabel,
                centerLabel: field.centerLabel,
                options: field.options,
                tableConfig: field.tableConfig,
                conditionalRendering: field.conditionalRendering,
              })) || [],
            sections:
              input.sections?.map((section) => ({
                id: section.id,
                title: section.title,
                boldTitle: section.boldTitle,
                italicTitle: section.italicTitle,
                underlineTitle: section.underlineTitle,
                centerTitle: section.centerTitle,
                columns: section.columns,
                order: section.order,
                fields: section.fields.map((field) => ({
                  id: field.id,
                  label: field.label,
                  type: field.type,
                  placeholder: field.placeholder,
                  required: field.required,
                  order: field.order,
                  hideLabel: field.hideLabel,
                  boldLabel: field.boldLabel,
                  italicLabel: field.italicLabel,
                  underlineLabel: field.underlineLabel,
                  centerLabel: field.centerLabel,
                  options: field.options,
                  tableConfig: field.tableConfig,
                  conditionalRendering: field.conditionalRendering,
                })),
              })) || [],
            actions:
              input.actions?.map((action) => ({
                id: action.id,
                name: action.name,
                type: action.type,
                quantity: action.quantity,
                price: action.price,
                isQuantifiable: action.isQuantifiable,
                backendId: action.backendId,
              })) || [],
          },
        },
      });
      const rawData = result.data?.updateForm?.data;
      return rawData ? mapBackendForm(rawData) : null;
    } catch (err) {
      console.error("Update form error:", err);
      throw err;
    }
  };

  return { updateForm, loading, error: error?.message || null };
}

export function useFinalizeForm() {
  const [mutation, { loading, error }] = useMutation(FINALIZE_FORM_MUTATION);

  const finalizeForm = async (departmentId: string, formId: string) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          formId,
        },
      });
      const rawData = result.data?.finalizeForm?.data;
      return rawData ? mapBackendForm(rawData) : null;
    } catch (err) {
      console.error("Finalize form error:", err);
      throw err;
    }
  };

  return { finalizeForm, loading, error: error?.message || null };
}
