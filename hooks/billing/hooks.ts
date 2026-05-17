import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { GET_BILL_BY_VISIT_QUERY, GET_INVOICE_QUERY } from '../queries'
import { CREATE_BILL_MUTATION, GENERATE_INVOICE_MUTATION } from '../mutations'
import type { Bill, InvoiceResponse } from '../types'

export function useGetBillByVisit(visitId: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_BILL_BY_VISIT_QUERY, {
    variables: { visitId },
    skip: !visitId,
    fetchPolicy: 'cache-and-network'
  })

  const bill = data?.visitBillings?.data?.[data?.visitBillings?.data?.length - 1] || data?.visitBillings?.data?.[0]

  return {
    bill,
    loading,
    error,
    refetch,
  }
}

export function useCreateBill() {
  const [createBillMutation, { loading, error }] = useMutation(CREATE_BILL_MUTATION)

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
  }) => {
    try {
      const result = await createBillMutation({
        variables: { input }
      })
      return result.data.billVisit as any
    } catch (err) {
      console.error('Create bill error:', err)
      throw err
    }
  }

  return { createBill, loading, error }
}

export function useGenerateInvoice() {
  const [generateInvoiceMutation, { loading, error }] = useMutation(GENERATE_INVOICE_MUTATION)

  const generateInvoice = async (billId: string) => {
    try {
      const result = await generateInvoiceMutation({
        variables: { billId }
      })
      return result.data.generateInvoice as InvoiceResponse & {
        pdfBase64?: string
        messages?: { text: string; type: string }[]
      }
    } catch (err) {
      console.error('Generate invoice error:', err)
      throw err
    }
  }

  return { generateInvoice, loading, error }
}

export function useGetInvoiceLazy() {
  const [getInvoiceQuery, { loading, error }] = useLazyQuery(GET_INVOICE_QUERY, {
    fetchPolicy: 'network-only'
  })

  const getInvoice = async (billId: string) => {
    try {
      const result = await getInvoiceQuery({
        variables: { billId }
      })
      return result.data?.getInvoice as InvoiceResponse | undefined
    } catch (err) {
      console.error('Get invoice error:', err)
      throw err
    }
  }

  return { getInvoice, loading, error }
}
