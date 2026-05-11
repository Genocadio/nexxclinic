import { useMutation, useQuery } from '@apollo/client'
import { GET_DEPARTMENTS_QUERY } from '../queries'
import { CREATE_DEPARTMENT_MUTATION, UPDATE_DEPARTMENT_MUTATION, DELETE_DEPARTMENT_MUTATION, ADD_DEPARTMENT_INSURANCE_MUTATION, REMOVE_DEPARTMENT_INSURANCE_MUTATION, ADD_DEPARTMENT_PRODUCT_MUTATION, REMOVE_DEPARTMENT_PRODUCT_MUTATION } from '../mutations'
import type { Department } from '../types'

const mapDepartmentFromApi = (department: any) => ({
  id: department.id,
  name: department.name,
  insurancePolicyMode: department.insurancePolicyMode,
  insurancePolicies: (department.insurancePolicies || []).map((insurance: any) => ({
    id: insurance.id,
    insuranceName: insurance.insuranceName || 'Unknown Insurance',
    name: insurance.insuranceName || 'Unknown Insurance',
    acronym: insurance.acronym || '',
    defaultCoveragePercentage: insurance.defaultCoveragePercentage || 0,
    coveragePercentage: insurance.defaultCoveragePercentage || 0,
    supportedByClinic: insurance.supportedByClinic || false,
    iconUrl: insurance.iconUrl || null,
  })),
  defaultProducts: (department.defaultProducts || []).map((product: any) => ({
    id: product.id,
    name: product.name,
    genericName: product.genericName,
    code: product.code,
    description: product.description,
    type: product.type,
    unit: product.unit,
    privateRhicPrice: product.privateRhicPrice,
    clinicPrice: product.clinicPrice,
    insuranceCoverages: (product.insuranceCoverages || []).map((coverage: any) => {
      const provider = coverage.insuranceProvider || coverage.insurance
      return {
        id: coverage.id,
        insurance: {
          id: provider?.id,
          name: provider?.insuranceName || provider?.name,
          acronym: provider?.acronym,
          coveragePercentage: provider?.defaultCoveragePercentage ?? provider?.coveragePercentage,
        },
        cost: coverage.cost,
        covered: coverage.covered,
        requireMedicalAdvisor: coverage.requireMedicalAdvisor,
      }
    }),
  })),
})

export function useDepartments() {
  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { input: { page: 0, size: 200 } },
    fetchPolicy: 'cache-and-network'
  })

  const departments = (data?.departments?.data || []).map(mapDepartmentFromApi)

  return { departments, loading: loading || false, error: error?.message || null, refetch }
}

export function useCreateDepartment() {
  const [mutate, { loading, error }] = useMutation(CREATE_DEPARTMENT_MUTATION)
  const createDepartment = async (name: string, input?: { insuranceProviderIds?: string[]; defaultProductIds?: string[]; insurancePolicyMode?: string }) => {
    const { data } = await mutate({
      variables: {
        input: {
          name,
          insuranceProviderIds: input?.insuranceProviderIds,
          defaultProductIds: input?.defaultProductIds,
          insurancePolicyMode: input?.insurancePolicyMode,
        },
      },
    })
    return data?.createDepartment?.data ? mapDepartmentFromApi(data.createDepartment.data) : null
  }
  return { createDepartment, loading, error: error?.message || null }
}

export function useUpdateDepartment() {
  const [mutate, { loading, error }] = useMutation(UPDATE_DEPARTMENT_MUTATION)
  const updateDepartment = async (id: number | string, input: { name?: string; insuranceProviderIds?: string[]; defaultProductIds?: string[]; insurancePolicyMode?: string }) => {
    const { data } = await mutate({ variables: { departmentId: id, input } })
    return data?.updateDepartment?.data ? mapDepartmentFromApi(data.updateDepartment.data) : null
  }
  return { updateDepartment, loading, error: error?.message || null }
}

export function useDeleteDepartment() {
  const [mutate, { loading, error }] = useMutation(DELETE_DEPARTMENT_MUTATION)
  const deleteDepartment = async (id: number | string) => {
    const { data } = await mutate({ variables: { id } })
    return data?.deleteDepartment?.status === 'SUCCESS'
  }
  return { deleteDepartment, loading, error: error?.message || null }
}

export function useAddDepartmentInsurance() {
  const [mutate, { loading, error }] = useMutation(ADD_DEPARTMENT_INSURANCE_MUTATION)
  const addDepartmentInsurance = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    return data?.addDepartmentInsurance?.data ? mapDepartmentFromApi(data.addDepartmentInsurance.data) : null
  }
  return { addDepartmentInsurance, loading, error: error?.message || null }
}

export function useRemoveDepartmentInsurance() {
  const [mutate, { loading, error }] = useMutation(REMOVE_DEPARTMENT_INSURANCE_MUTATION)
  const removeDepartmentInsurance = async (departmentId: number | string, insuranceId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, insuranceId } })
    return data?.removeDepartmentInsurance?.data ? mapDepartmentFromApi(data.removeDepartmentInsurance.data) : null
  }
  return { removeDepartmentInsurance, loading, error: error?.message || null }
}

export function useAddDepartmentProduct() {
  const [mutate, { loading, error }] = useMutation(ADD_DEPARTMENT_PRODUCT_MUTATION)
  const addDepartmentProduct = async (departmentId: number | string, productId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, productId } })
    return data?.addDepartmentProduct?.data ? mapDepartmentFromApi(data.addDepartmentProduct.data) : null
  }
  return { addDepartmentProduct, loading, error: error?.message || null }
}

export function useRemoveDepartmentProduct() {
  const [mutate, { loading, error }] = useMutation(REMOVE_DEPARTMENT_PRODUCT_MUTATION)
  const removeDepartmentProduct = async (departmentId: number | string, productId: number | string) => {
    const { data } = await mutate({ variables: { departmentId, productId } })
    return data?.removeDepartmentProduct?.data ? mapDepartmentFromApi(data.removeDepartmentProduct.data) : null
  }
  return { removeDepartmentProduct, loading, error: error?.message || null }
}
