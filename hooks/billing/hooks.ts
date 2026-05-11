import { useMutation, useQuery } from '@apollo/client'
import { GET_BILL_BY_VISIT_QUERY } from '../queries'
import { CREATE_BILL_MUTATION, GENERATE_INVOICE_MUTATION } from '../mutations'
import type { Bill, InvoiceResponse } from '../types'

export function useGetBillByVisit(visitId: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_BILL_BY_VISIT_QUERY, {
    variables: { visitId },
    skip: !visitId,
    fetchPolicy: 'cache-and-network'
  })

  const bill = data?.getBillByVisit?.data

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
    note?: string
    globalDiscount?: {
      type: 'NONE' | 'FIXED' | 'PERCENTAGE'
      value: number
    }
    billingItems: {
      departmentId: string
      actionId?: string
      items: {
        itemType: string
        itemId: string
        quantity: number
        insuranceId?: string
        itemDiscount?: {
          type: 'NONE' | 'FIXED' | 'PERCENTAGE'
          value: number
        }
      }[]
    }[]
  }) => {
    try {
      const result = await createBillMutation({
        variables: { input }
      })
      return result.data.createBill as any
    } catch (err) {
      console.error('Create bill error:', err)
      throw err
    }
  }

  return { createBill, loading, error }
}

export function useGenerateInvoice() {
  const [generateInvoiceMutation, { loading, error }] = useMutation(GENERATE_INVOICE_MUTATION)

  const generateInvoice = async (visitId: string) => {
    try {
      const result = await generateInvoiceMutation({
        variables: { visitId }
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
