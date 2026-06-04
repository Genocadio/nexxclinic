// @ts-nocheck
import { useMutation, useLazyQuery } from '@apollo/client'
import { GET_FORMS_QUERY, GET_FORM_QUERY, GET_FORM_VERSION_HISTORY_QUERY, GET_LATEST_FORM_QUERY, GET_CONSULTATION_ANSWERS_QUERY } from '../queries'
import { CREATE_FORM_MUTATION, UPDATE_FORM_MUTATION, FINALIZE_FORM_MUTATION } from '../mutations'
import React from 'react'
import type { FormField, FormSection, FormAction, BackendForm } from '../types'

const normalizeTableMode = (mode: unknown) => {
  const normalized = String(mode || '').toUpperCase()
  return normalized === 'DYNAMIC' || mode === 'variableRows' || mode === 'variableColumns' ? 'DYNAMIC' : 'STATIC'
}

const normalizeFormField = (field: any, index: number): FormField => ({
  id: field?.id || `field_${Date.now()}_${index}`,
  label: field?.label || 'Untitled',
  type: field?.type || 'text',
  placeholder: field?.placeholder || undefined,
  required: Boolean(field?.required),
  hideLabel: Boolean(field?.hideLabel),
  boldLabel: Boolean(field?.boldLabel),
  centerLabel: Boolean(field?.centerLabel),
  italicLabel: Boolean(field?.italicLabel),
  underlineLabel: Boolean(field?.underlineLabel),
  options: Array.isArray(field?.options) ? field.options.filter(Boolean) : undefined,
  tableConfig: field?.tableConfig
    ? {
        mode: normalizeTableMode(field.tableConfig.mode),
        rows: Number(field.tableConfig.rows) || 3,
        columns: Number(field.tableConfig.columns) || 3,
        headerPlacement: field.tableConfig.headerPlacement || 'none',
        columnHeaders: Array.isArray(field.tableConfig.columnHeaders) ? field.tableConfig.columnHeaders : [],
        rowHeaders: Array.isArray(field.tableConfig.rowHeaders) ? field.tableConfig.rowHeaders : [],
      }
    : undefined,
  labRecordConfig: field?.labRecordConfig
    ? {
        layout: field.labRecordConfig.layout === 'result' ? 'result' : 'valueUnit',
        rows: Array.isArray(field.labRecordConfig.rows)
          ? field.labRecordConfig.rows.map((row: any, rowIndex: number) => ({
              id: row?.id || `lab_row_${Date.now()}_${rowIndex}`,
              name: row?.name || `Row ${rowIndex + 1}`,
              unitMode: row?.unitMode === 'none' ? 'none' : 'dropdown',
              unitOptions: Array.isArray(row?.unitOptions) ? row.unitOptions.filter(Boolean) : [],
              defaultUnit: row?.defaultUnit || undefined,
              resultOptions: Array.isArray(row?.resultOptions) ? row.resultOptions.filter(Boolean) : [],
            }))
          : [],
      }
    : undefined,
  conditionalRendering: field?.conditionalRendering
    ? {
        dependsOn: field.conditionalRendering.dependsOn,
        condition: field.conditionalRendering.condition,
        value: field.conditionalRendering.value || undefined,
        itemType: field.conditionalRendering.itemType || undefined,
      }
    : undefined,
  order: typeof field?.order === 'number' ? field.order : index,
})

const normalizeFormSection = (section: any, index: number): FormSection => ({
  id: section?.id || `section_${Date.now()}_${index}`,
  title: section?.title || 'Untitled Section',
  boldTitle: Boolean(section?.boldTitle),
  italicTitle: Boolean(section?.italicTitle),
  underlineTitle: Boolean(section?.underlineTitle),
  centerTitle: Boolean(section?.centerTitle),
  columns: section?.columns === 1 || section?.columns === 2 || section?.columns === 3 || section?.columns === 4 ? section.columns : 2,
  order: typeof section?.order === 'number' ? section.order : index,
  fields: Array.isArray(section?.fields)
    ? section.fields.map((field: any, fieldIndex: number) => normalizeFormField(field, fieldIndex))
    : [],
})

const normalizeFormAction = (action: any, index: number): FormAction => ({
  id: action?.id || `action_${Date.now()}_${index}`,
  name: action?.name || 'Unnamed item',
  type: action?.type === 'consumable' ? 'consumable' : 'action',
  quantity: Number(action?.quantity) || 1,
  price: Number(action?.price) || 0,
  isQuantifiable: action?.isQuantifiable !== false,
  backendId: action?.backendId ? String(action.backendId) : undefined,
})

const mapBackendForm = (form: any): BackendForm => ({
  id: String(form?.id || ''),
  departmentId: String(form?.departmentId || ''),
  title: form?.title || '',
  description: form?.description || '',
  status: form?.status === 'FINAL' ? 'FINAL' : 'DRAFT',
  version: String(form?.version || ''),
  fields: Array.isArray(form?.fields) ? form.fields.map((field: any, idx: number) => normalizeFormField(field, idx)) : [],
  sections: Array.isArray(form?.sections) ? form.sections.map((section: any, idx: number) => normalizeFormSection(section, idx)) : [],
  actions: Array.isArray(form?.actions) ? form.actions.map((action: any, idx: number) => normalizeFormAction(action, idx)) : [],
  createdAt: String(form?.createdAt || ''),
  updatedAt: String(form?.updatedAt || ''),
})

const parseConsultationAnswersPayload = (value: unknown): Record<string, any> | null => {
  if (!value) return null

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === 'object') {
        if ('values' in parsed && parsed.values && typeof parsed.values === 'object') {
          return parsed.values as Record<string, any>
        }

        return parsed as Record<string, any>
      }
    } catch {
      return null
    }

    return null
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, any>
    if (objectValue.values && typeof objectValue.values === 'object') {
      return objectValue.values as Record<string, any>
    }

    return objectValue
  }

  return null
}

const pickConsultationAnswer = (rawData: any, preferredFormId?: string | null) => {
  if (!rawData) return null

  if (Array.isArray(rawData)) {
    const answers = rawData.filter(Boolean)

    if (preferredFormId) {
      const preferred = answers.find((item: any) => {
        const responseFormId = item?.dedicatedForm?.id ?? item?.form?.id ?? item?.formId
        return String(responseFormId || '') === String(preferredFormId)
      })

      if (preferred) {
        return preferred
      }
    }

    return answers.slice().sort((left: any, right: any) => {
      const leftStamp = String(left?.updatedAt || left?.submittedAt || '')
      const rightStamp = String(right?.updatedAt || right?.submittedAt || '')
      return rightStamp.localeCompare(leftStamp)
    })[0] ?? null
  }

  if (typeof rawData === 'object') {
    if (rawData.answer || rawData.form) {
      return rawData.answer ?? null
    }

    return rawData
  }

  return null
}

export const normalizeConsultationAnswersResult = (response: any, preferredFormId?: string | null) => {
  const rawData = response?.data?.getConsultationAnswers?.data ?? response?.getConsultationAnswers?.data ?? response?.data ?? response ?? null
  const responseAnswer = pickConsultationAnswer(rawData, preferredFormId)
  const responseForm = responseAnswer?.dedicatedForm ?? responseAnswer?.form ?? rawData?.form ?? null
  const rawAnswers = responseAnswer?.answers ?? rawData?.answers ?? null

  return {
    form: responseForm ? mapBackendForm(responseForm) : null,
    answer: responseAnswer
      ? {
          id: responseAnswer?.id ? String(responseAnswer.id) : null,
          consultationId: responseAnswer?.consultationId ? String(responseAnswer.consultationId) : null,
          visitId: responseAnswer?.visitId ? String(responseAnswer.visitId) : null,
          patientId: responseAnswer?.patientId ? String(responseAnswer.patientId) : null,
          departmentId: responseAnswer?.departmentId ? String(responseAnswer.departmentId) : null,
          formId: responseAnswer?.formId ? String(responseAnswer.formId) : responseForm?.id ? String(responseForm.id) : null,
          formVersion: responseAnswer?.formVersion
            ? String(responseAnswer.formVersion)
            : responseAnswer?.dedicatedForm?.version
              ? String(responseAnswer.dedicatedForm.version)
              : null,
          status: responseAnswer?.status || null,
          submittedAt: responseAnswer?.submittedAt || null,
          updatedAt: responseAnswer?.updatedAt || null,
          answers: rawAnswers,
        }
      : null,
    answersMap: parseConsultationAnswersPayload(rawAnswers),
  }
}

export function useForms(departmentId: string | null) {
  const [loadForms, { loading, error, data }] = useLazyQuery(GET_FORMS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const forms = React.useMemo(() => {
    const rawData = data?.getForms?.data || []
    return rawData.map((form: any) => mapBackendForm(form))
  }, [data])

  const load = React.useCallback(
    (options?: Parameters<typeof loadForms>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {}
      const nextDepartmentId = options?.variables?.departmentId || departmentId
      if (!nextDepartmentId) {
        return Promise.resolve(undefined)
      }

      return loadForms({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
        },
      })
    },
    [departmentId, loadForms],
  )

  return { forms, loading, error: error?.message || null, loadForms: load }
}

export function useForm(departmentId: string | null, formId: string | null) {
  const [loadForm, { loading, error, data }] = useLazyQuery(GET_FORM_QUERY, {
    fetchPolicy: 'network-only',
  })

  const form = React.useMemo(() => {
    const rawData = data?.getForm?.data
    return rawData ? mapBackendForm(rawData) : null
  }, [data])

  const load = React.useCallback(
    (options?: Parameters<typeof loadForm>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {}
      const nextDepartmentId = options?.variables?.departmentId || departmentId
      const nextFormId = options?.variables?.formId || formId

      if (!nextDepartmentId || !nextFormId) {
        return Promise.resolve(undefined)
      }

      return loadForm({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
          formId: nextFormId,
        },
      })
    },
    [departmentId, formId, loadForm],
  )

  return { form, loading, error: error?.message || null, loadForm: load }
}

export function useFormVersionHistory(departmentId: string | null, formId: string | null) {
  const [loadVersionHistory, { loading, error, data }] = useLazyQuery(GET_FORM_VERSION_HISTORY_QUERY, {
    fetchPolicy: 'network-only',
  })

  const versions = React.useMemo(() => {
    const rawData = data?.getFormVersionHistory?.data || []
    return rawData.map((form: any) => mapBackendForm(form))
  }, [data])

  const load = React.useCallback(
    (options?: Parameters<typeof loadVersionHistory>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {}
      const nextDepartmentId = options?.variables?.departmentId || departmentId
      const nextFormId = options?.variables?.formId || formId

      if (!nextDepartmentId || !nextFormId) {
        return Promise.resolve(undefined)
      }

      return loadVersionHistory({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
          formId: nextFormId,
        },
      })
    },
    [departmentId, formId, loadVersionHistory],
  )

  return { versions, loading, error: error?.message || null, loadVersionHistory: load }
}

export function useLatestForm(departmentId: string | null) {
  const [loadLatestForm, { loading, error, data }] = useLazyQuery(GET_LATEST_FORM_QUERY, {
    fetchPolicy: 'network-only',
  })

  const form = React.useMemo(() => {
    const rawData = data?.getLatestForm?.data
    return rawData ? mapBackendForm(rawData) : null
  }, [data])

  const load = React.useCallback(
    (options?: Parameters<typeof loadLatestForm>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {}
      const nextDepartmentId = options?.variables?.departmentId || departmentId

      if (!nextDepartmentId) {
        return Promise.resolve(undefined)
      }

      return loadLatestForm({
        ...restOptions,
        variables: {
          ...(restOptions.variables || {}),
          departmentId: nextDepartmentId,
        },
      })
    },
    [departmentId, loadLatestForm],
  )

  return { form, loading, error: error?.message || null, loadLatestForm: load }
}

export function useConsultationAnswers(visitId: string | null, visitDepartmentId: string | null, formId: string | null) {
  const [loadConsultationAnswers, { loading, error, data }] = useLazyQuery(GET_CONSULTATION_ANSWERS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const consultationAnswers = React.useMemo(() => normalizeConsultationAnswersResult(data, formId), [data, formId])

  const load = React.useCallback(
    (options?: Parameters<typeof loadConsultationAnswers>[0]) => {
      const { fetchPolicy: _fetchPolicy, ...restOptions } = options || {}
      const nextVisitId = options?.variables?.visitId || visitId
      const nextVisitDepartmentId = options?.variables?.visitDepartmentId || visitDepartmentId

      if (!nextVisitId || !nextVisitDepartmentId) {
        return Promise.resolve(undefined)
      }

      return loadConsultationAnswers({
        ...restOptions,
        variables: {
          visitId: nextVisitId,
          visitDepartmentId: nextVisitDepartmentId,
        },
      })
    },
    [loadConsultationAnswers, visitDepartmentId, visitId],
  )

  return { consultationAnswers, loading, error: error?.message || null, loadConsultationAnswers: load }
}

export function useCreateForm() {
  const [mutation, { loading, error }] = useMutation(CREATE_FORM_MUTATION)

  const createForm = async (departmentId: string, input: {
    title: string
    description?: string
    fields?: FormField[]
    sections?: FormSection[]
    actions?: FormAction[]
  }) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          input: {
            title: input.title,
            description: input.description,
            fields: input.fields?.map(field => ({
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
            sections: input.sections?.map(section => ({
              id: section.id,
              title: section.title,
              boldTitle: section.boldTitle,
              italicTitle: section.italicTitle,
              underlineTitle: section.underlineTitle,
              centerTitle: section.centerTitle,
              columns: section.columns,
              order: section.order,
              fields: section.fields.map(field => ({
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
            actions: input.actions?.map(action => ({
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
      })
      const rawData = result.data?.createForm?.data
      return rawData ? mapBackendForm(rawData) : null
    } catch (err) {
      console.error('Create form error:', err)
      throw err
    }
  }

  return { createForm, loading, error: error?.message || null }
}

export function useUpdateForm() {
  const [mutation, { loading, error }] = useMutation(UPDATE_FORM_MUTATION)

  const updateForm = async (departmentId: string, formId: string, input: {
    title?: string
    description?: string
    fields?: FormField[]
    sections?: FormSection[]
    actions?: FormAction[]
  }) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          formId,
          input: {
            title: input.title,
            description: input.description,
            fields: input.fields?.map(field => ({
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
            sections: input.sections?.map(section => ({
              id: section.id,
              title: section.title,
              boldTitle: section.boldTitle,
              italicTitle: section.italicTitle,
              underlineTitle: section.underlineTitle,
              centerTitle: section.centerTitle,
              columns: section.columns,
              order: section.order,
              fields: section.fields.map(field => ({
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
            actions: input.actions?.map(action => ({
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
      })
      const rawData = result.data?.updateForm?.data
      return rawData ? mapBackendForm(rawData) : null
    } catch (err) {
      console.error('Update form error:', err)
      throw err
    }
  }

  return { updateForm, loading, error: error?.message || null }
}

export function useFinalizeForm() {
  const [mutation, { loading, error }] = useMutation(FINALIZE_FORM_MUTATION)

  const finalizeForm = async (departmentId: string, formId: string) => {
    try {
      const result = await mutation({
        variables: {
          departmentId,
          formId,
        },
      })
      const rawData = result.data?.finalizeForm?.data
      return rawData ? mapBackendForm(rawData) : null
    } catch (err) {
      console.error('Finalize form error:', err)
      throw err
    }
  }

  return { finalizeForm, loading, error: error?.message || null }
}
