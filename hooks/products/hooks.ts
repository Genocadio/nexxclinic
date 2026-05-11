import { useMutation, useQuery } from '@apollo/client'
import { GET_PRODUCTS_QUERY } from '../queries'
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION, DELETE_PRODUCT_MUTATION, ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION, REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION } from '../mutations'

type ProductTypeFilter = 'DRUG' | 'MEDICAL_ACT' | 'BIOLOGICAL_ACT' | 'CONSUMABLE_DEVICE' | 'ALL'

interface UseProductSearchOptions {
  type?: ProductTypeFilter
  size?: number
}

export function useProducts() {
  const { data, loading, error, refetch: refetchQuery } = useQuery(GET_PRODUCTS_QUERY, {
    variables: { input: { page: 0, size: 200 } },
    fetchPolicy: 'cache-and-network',
  })

  const products = data?.products?.data || []
  const refetch = () => refetchQuery({ input: { page: 0, size: 200 } })

  return { products, loading, error: error?.message || null, refetch }
}

export function useProductSearch(searchQuery: string, options?: UseProductSearchOptions) {
  const pageSize = options?.size ?? 20
  const typeFilter = options?.type && options.type !== 'ALL' ? options.type : undefined

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS_QUERY, {
    variables: { 
      input: { 
        name: searchQuery || undefined,
        type: typeFilter,
        page: 0, 
        size: pageSize,
      } 
    },
    fetchPolicy: 'cache-and-network',
    skip: !searchQuery || searchQuery.length < 2,
  })

  const products = data?.products?.data || []
  const pagination = data?.products?.pagination
  const hasMore = Boolean(
    pagination &&
      typeof pagination.currentPage === 'number' &&
      typeof pagination.totalPages === 'number' &&
      pagination.currentPage + 1 < pagination.totalPages,
  )

  const loadMore = async () => {
    if (!hasMore || !pagination) return false

    const nextPage = pagination.currentPage + 1

    await fetchMore({
      variables: {
        input: {
          name: searchQuery || undefined,
          type: typeFilter,
          page: nextPage,
          size: pageSize,
        },
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.products) return previousResult

        const previousData = previousResult?.products?.data || []
        const nextData = fetchMoreResult.products.data || []
        const merged = [...previousData]

        for (const item of nextData) {
          if (!merged.some((existing: any) => String(existing.id) === String(item.id))) {
            merged.push(item)
          }
        }

        return {
          ...fetchMoreResult,
          products: {
            ...fetchMoreResult.products,
            data: merged,
          },
        }
      },
    })

    return true
  }

  const refresh = () =>
    refetch({
      input: {
        name: searchQuery || undefined,
        type: typeFilter,
        page: 0,
        size: pageSize,
      },
    })

  return { products, loading, error: error?.message || null, hasMore, loadMore, refresh, pagination }
}

export function useCreateProduct() {
  const [mutate, { loading, error }] = useMutation(CREATE_PRODUCT_MUTATION)
  const createProduct = async (input: {
    name: string
    code: string
    description: string
    type: string
    unit: string
    genericName?: string
    metadata?: Record<string, unknown>
    privateRhicPrice?: number
    clinicPrice?: number
    insuranceCoverages?: {
      insuranceProviderId: string
      cost?: number
      covered?: boolean
      requireMedicalAdvisor?: boolean
      mustPrescribedBy?: string
      drugAdministrationFrequency?: string
      authorizationRequestReasons?: string[]
    }[]
  }) => {
    const { data } = await mutate({ variables: { input } })
    return data?.createProduct?.data
  }
  return { createProduct, loading, error: error?.message || null }
}

export function useUpdateProduct() {
  const [mutate, { loading, error }] = useMutation(UPDATE_PRODUCT_MUTATION)
  const updateProduct = async (productId: string | number, input: any) => {
    const { data } = await mutate({ variables: { productId, input } })
    return data?.updateProduct?.data
  }
  return { updateProduct, loading, error: error?.message || null }
}

export function useDeleteProduct() {
  const [mutate, { loading, error }] = useMutation(DELETE_PRODUCT_MUTATION)
  const deleteProduct = async (productId: string | number) => {
    const { data } = await mutate({ variables: { productId } })
    return data?.deleteProduct?.status === 'SUCCESS'
  }
  return { deleteProduct, loading, error: error?.message || null }
}

export function useAddProductInsuranceCoverage() {
  const [mutate, { loading, error }] = useMutation(ADD_PRODUCT_INSURANCE_COVERAGE_MUTATION)
  const addCoverage = async (productId: string | number, insuranceProviderId: string, cost: number) => {
    const { data } = await mutate({ variables: { productId, input: { insuranceProviderId, cost } } })
    return data?.createProductInsuranceCoverage?.data
  }
  return { addCoverage, loading, error: error?.message || null }
}

export function useRemoveProductInsuranceCoverage() {
  const [mutate, { loading, error }] = useMutation(REMOVE_PRODUCT_INSURANCE_COVERAGE_MUTATION)
  const removeCoverage = async (productInsuranceCoverageId: string | number) => {
    const { data } = await mutate({ variables: { productInsuranceCoverageId } })
    return data?.deleteProductInsuranceCoverage?.status === 'SUCCESS'
  }
  return { removeCoverage, loading, error: error?.message || null }
}
