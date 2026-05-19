import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { GET_BILL_BY_VISIT_QUERY, GET_INVOICE_QUERY } from '../queries'
import { CREATE_BILL_MUTATION, GENERATE_INVOICE_MUTATION } from '../mutations'
import type { Bill, InvoiceResponse, ApiResponse } from '../types'

export interface GqlVisitBilling {
  id: string
  visitId: string
  totalAmount: number
  paidAmount: number
  status: string
  items?: Array<{
    id: string
    visitDepartmentProductId: string
    productId: string
    productName: string
    unitPriceSnapshot: number
    quantitySnapshot: number
    lineTotal: number
    insuranceCoveredAmount: number
    patientPayableAmount: number
    appliedPatientInsuranceId?: string | null
    createdAt: string
    updatedAt?: string
  }> | null
  createdAt: string
  updatedAt: string
}

export interface VisitBillingsQueryData {
  visitBillings: {
    status: string
    message?: string
    data: GqlVisitBilling[]
  }
}

export interface CreateBillPayload {
  billVisit: {
    status: string
    message?: string
    data?: GqlVisitBilling | null
  }
}

export interface GenerateInvoicePayload {
  generateInvoice: InvoiceResponse & {
    pdfBase64?: string
    messages?: { text: string; type: string }[]
  }
}

export interface GetInvoicePayload {
  getInvoice: InvoiceResponse
}

export function useGetBillByVisit(visitId: string | null) {
  const { data, loading, error, refetch } = useQuery<VisitBillingsQueryData>(GET_BILL_BY_VISIT_QUERY, {
    variables: { visitId },
    skip: !visitId,
    fetchPolicy: 'cache-and-network'
  })

  const bill: Bill | undefined = data?.visitBillings?.data?.[data?.visitBillings?.data?.length - 1] || data?.visitBillings?.data?.[0]

  return {
    bill,
    loading,
    error,
    refetch,
  }
}

export function useCreateBill() {
  const [createBillMutation, { loading, error }] = useMutation<CreateBillPayload>(CREATE_BILL_MUTATION)

  const createBill = async (input: {
    visitId: string
    billAllProducts?: boolean
    items?: {
      visitDepartmentProductId: string
      patientInsuranceId?: string
      quantity?: number
      unitPrice?: number
      isExempted?: boolean
    }[]
    paidAmount?: number
  }): Promise<ApiResponse<Bill>> => {
    try {
      const result = await createBillMutation({
        variables: { input }
      })
      const payload = result?.data?.billVisit
      return {
        status: payload?.status || 'ERROR',
        message: payload?.message,
        data: payload?.data || undefined,
      }
    } catch (err) {
      console.error('Create bill error:', err)
      throw err
    }
  }

  return { createBill, loading, error }
}

export function useGenerateInvoice() {
  const [generateInvoiceMutation, { loading, error }] = useMutation<GenerateInvoicePayload>(GENERATE_INVOICE_MUTATION)

  const generateInvoice = async (billId: string) => {
    try {
      const result = await generateInvoiceMutation({
        variables: { billId }
      })
      return result?.data?.generateInvoice
    } catch (err) {
      console.error('Generate invoice error:', err)
      throw err
    }
  }

  return { generateInvoice, loading, error }
}

export function useGetInvoiceLazy() {
  const [getInvoiceQuery, { loading, error }] = useLazyQuery<GetInvoicePayload>(GET_INVOICE_QUERY, {
    fetchPolicy: 'network-only'
  })

  const getInvoice = async (billId: string) => {
    try {
      const result = await getInvoiceQuery({
        variables: { billId }
      })
      return result.data?.getInvoice
    } catch (err) {
      console.error('Get invoice error:', err)
      throw err
    }
  }

  return { getInvoice, loading, error }
}
