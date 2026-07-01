import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { GET_BILL_BY_VISIT_QUERY, GET_INVOICE_QUERY } from "../queries";
import {
  CREATE_BILL_MUTATION,
  EDIT_BILL_MUTATION,
  GENERATE_INVOICE_MUTATION,
} from "../mutations";
import type { VisitBilling, ApiResponse } from "../types";
import type { InvoiceResponse } from "../types";
import {
  mapGqlVisitBilling,
  type GqlVisitBilling,
} from "@/lib/visit-billing-utils";

export type { GqlVisitBilling } from "@/lib/visit-billing-utils";

export interface VisitBillingsQueryData {
  visitBilling: {
    status: string;
    message?: string;
    data?: GqlVisitBilling | null;
  };
}

export interface CreateBillPayload {
  billVisit: {
    status: string;
    message?: string;
    data?: GqlVisitBilling | null;
  };
}

export interface EditBillPayload {
  editBillVisit: {
    status: string;
    message?: string;
    data?: GqlVisitBilling | null;
  };
}

export interface GenerateInvoicePayload {
  generateInvoice: InvoiceResponse & {
    pdfBase64?: string;
    messages?: { text: string; type: string }[];
  };
}

export interface GetInvoicePayload {
  getInvoice: InvoiceResponse;
}

export function useGetVisitBilling(visitId: string | null) {
  const { data, loading, error, refetch } = useQuery<VisitBillingsQueryData>(
    GET_BILL_BY_VISIT_QUERY,
    {
      variables: { visitId },
      skip: !visitId,
      fetchPolicy: "cache-and-network",
    },
  );

  const gqlData = data?.visitBilling?.data;
  const visitBilling: VisitBilling | undefined = gqlData
    ? mapGqlVisitBilling(gqlData)
    : undefined;

  return {
    visitBilling,
    loading,
    error,
    refetch,
  };
}

/** @deprecated Use useGetVisitBilling */
export function useGetBillByVisit(visitId: string | null) {
  const result = useGetVisitBilling(visitId);
  return {
    ...result,
    bill: result.visitBilling,
  };
}

export function useCreateBill() {
  const [createBillMutation, { loading, error }] =
    useMutation<CreateBillPayload>(CREATE_BILL_MUTATION);

  const createBill = async (input: {
    visitId: string;
    notes?: string;
    departments: {
      visitDepartmentId: string;
      products: {
        visitDepartmentProductId: string;
        parentVisitDepartmentId: string;
        patientInsuranceId?: string;
        quantity?: number;
        unitPrice?: number;
        isExempted?: boolean;
      }[];
      payments?: {
        amount: number;
        paymentMethod:
          | "CASH"
          | "MOBILE_MONEY"
          | "CARD"
          | "BANK_TRANSFER"
          | "CHEQUE"
          | "MIXED";
        reference?: string;
      }[];
    }[];
  }): Promise<ApiResponse<VisitBilling>> => {
    try {
      const result = await createBillMutation({
        variables: { input },
      });
      const payload = result?.data?.billVisit;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data ? mapGqlVisitBilling(payload.data) : undefined,
      };
    } catch (err) {
      console.error("Create bill error:", err);
      throw err;
    }
  };

  return { createBill, loading, error };
}

export interface EditBillInput {
  visitId: string;
  notes?: string;
  departments: {
    visitDepartmentId: string;
    addedProducts?: { productId: string; quantity: number }[];
    removedProductIds?: string[];
    updatedProducts?: { productId: string; quantity?: number }[];
    billProducts: {
      productId: string;
      patientInsuranceId?: string;
      quantity?: number;
      unitPrice?: number;
      isExempted?: boolean;
    }[];
    payments?: {
      amount: number;
      paymentMethod:
        "CASH" | "MOBILE_MONEY" | "CARD" | "BANK_TRANSFER" | "CHEQUE" | "MIXED";
      reference?: string;
    }[];
  }[];
}

export function useEditBill() {
  const [editBillMutation, { loading, error }] =
    useMutation<EditBillPayload>(EDIT_BILL_MUTATION);

  const editBill = async (
    input: EditBillInput,
  ): Promise<ApiResponse<VisitBilling>> => {
    // Map the hook-level input to the GraphQL EditBillVisitInput shape.
    // Top-level `notes` is distributed as per-department `note`.
    const gqlInput = {
      visitId: input.visitId,
      departments: input.departments.map((dept) => ({
        visitDepartmentId: dept.visitDepartmentId,
        addedProducts: dept.addedProducts,
        removedProductIds: dept.removedProductIds,
        updatedProducts: dept.updatedProducts,
        billProducts: dept.billProducts,
        payments: dept.payments,
        note: input.notes || undefined,
      })),
    };
    try {
      const result = await editBillMutation({ variables: { input: gqlInput } });
      const payload = result?.data?.editBillVisit;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data ? mapGqlVisitBilling(payload.data) : undefined,
      };
    } catch (err) {
      console.error("Edit bill error:", err);
      throw err;
    }
  };

  return { editBill, loading, error };
}

export function useGenerateInvoice() {
  const [generateInvoiceMutation, { loading, error }] =
    useMutation<GenerateInvoicePayload>(GENERATE_INVOICE_MUTATION);

  const generateInvoice = async (departmentInsuranceBillingId: string) => {
    try {
      const result = await generateInvoiceMutation({
        variables: { departmentInsuranceBillingId },
      });
      return result?.data?.generateInvoice;
    } catch (err) {
      console.error("Generate invoice error:", err);
      throw err;
    }
  };

  return { generateInvoice, loading, error };
}

export function useGetInvoiceLazy() {
  const [getInvoiceQuery, { loading, error }] = useLazyQuery<GetInvoicePayload>(
    GET_INVOICE_QUERY,
    {
      fetchPolicy: "network-only",
    },
  );

  const getInvoice = async (departmentInsuranceBillingId: string) => {
    try {
      const result = await getInvoiceQuery({
        variables: { departmentInsuranceBillingId },
      });
      return result.data?.getInvoice;
    } catch (err) {
      console.error("Get invoice error:", err);
      throw err;
    }
  };

  return { getInvoice, loading, error };
}
