import { useMutation, useQuery } from "@apollo/client";
import { GET_BILL_BY_VISIT_QUERY } from "../queries";
import {
  CREATE_BILL_MUTATION,
  EDIT_BILL_MUTATION,
  RECORD_VISIT_BILLING_PAYMENT_MUTATION,
  GENERATE_INVOICE_MUTATION,
  START_BILL_EDITING_MUTATION,
  COMPLETE_BILL_EDITING_MUTATION,
  CANCEL_BILL_EDITING_MUTATION,
  QUICK_BILL_MUTATION,
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

export interface RecordVisitBillingPaymentPayload {
  recordVisitBillingPayment: {
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

export interface QuickBillMutationData {
  quickBill: {
    status: string;
    message?: string;
  };
}

export type BillingPaymentMethod =
  | "CASH"
  | "MOBILE_MONEY"
  | "CARD"
  | "BANK_TRANSFER"
  | "CHEQUE"
  | "MIXED";

export interface CreateBillDepartmentInput {
  visitDepartmentId: string;
  products: {
    visitDepartmentProductId: string;
    parentVisitDepartmentId: string;
    /** REQUIRED — how the line is covered. PRIVATE or INSURANCE (see schema CoverageType). */
    coverageType: "PRIVATE" | "INSURANCE";
    /** ONLY with coverageType INSURANCE. Must be linked to the visit, active and cover the product. */
    patientInsuranceId?: string;
    quantity?: number;
    /** NONE, PATIENT_SHARE (patient waive, insurance still pays), or FULL (entire line zeroed). */
    exemptionType?: "NONE" | "PATIENT_SHARE" | "FULL";
    /** Optional override for the patient share percentage (0-100). Sent when the user manually picks a coverage tier. */
    patientSharePercentageOverride?: string;
  }[];
  payments?: {
    amount: number;
    paymentMethod: BillingPaymentMethod;
    reference?: string;
  }[];
  /**
   * Required when any product is exempted or the payment does not cover the
   * full patient payable amount. Optional otherwise.
   */
  note?: string;
  outstandingType?: "loan" | "giveaway";
  outstandingReason?: string;
}

export interface CreateBillInput {
  visitId: string;
  departments: CreateBillDepartmentInput[];
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

  const createBill = async (
    input: CreateBillInput,
  ): Promise<ApiResponse<VisitBilling>> => {
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
  /** Prevents a stale browser tab from replacing a newer billing version. */
  expectedBillingVersionId?: string;
  departments: {
    visitDepartmentId: string;
    addedProducts?: { productId: string; quantity: number; processorId?: string }[];
    removedProductIds?: string[];
    updatedProducts?: { productId: string; quantity?: number }[];
    billProducts: {
      productId: string;
      /** REQUIRED — how the line is covered. PRIVATE or INSURANCE (see schema CoverageType). */
      coverageType: "PRIVATE" | "INSURANCE";
      /** ONLY with coverageType INSURANCE. Must be linked to the visit, active and cover the product. */
      patientInsuranceId?: string;
      quantity?: number;
      /** NONE, PATIENT_SHARE (patient waive, insurance still pays), or FULL (entire line zeroed). */
      exemptionType?: "NONE" | "PATIENT_SHARE" | "FULL";
      /** Coverage ID reference for patient share percentage override. Backend resolves the actual value. */
      patientSharePercentageOverride?: string;
    }[];
    payments?: {
      amount: number;
      paymentMethod: BillingPaymentMethod;
      reference?: string;
    }[];
    note?: string;
    outstandingType?: "loan" | "giveaway";
    outstandingReason?: string;
  }[];
}

export function useEditBill() {
  const [editBillMutation, { loading, error }] =
    useMutation<EditBillPayload>(EDIT_BILL_MUTATION);

  const editBill = async (
    input: EditBillInput,
  ): Promise<ApiResponse<VisitBilling>> => {
    // Map the hook-level input to the GraphQL EditBillVisitInput shape.
    const gqlInput = {
      visitId: input.visitId,
      expectedBillingVersionId: input.expectedBillingVersionId,
      departments: input.departments.map((dept) => ({
        visitDepartmentId: dept.visitDepartmentId,
        addedProducts: dept.addedProducts?.map(({ processorId: _, ...rest }) => rest),
        removedProductIds: dept.removedProductIds,
        updatedProducts: dept.updatedProducts,
        billProducts: dept.billProducts,
        payments: dept.payments,
        note: dept.note,
        outstandingType: dept.outstandingType,
        outstandingReason: dept.outstandingReason,
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

export function useRecordVisitBillingPayment() {
  const [mutation, { loading, error }] =
    useMutation<RecordVisitBillingPaymentPayload>(
      RECORD_VISIT_BILLING_PAYMENT_MUTATION,
    );

  const recordPayment = async (input: {
    departmentInsuranceBillingId: string;
    amount: number;
    paymentMethod: BillingPaymentMethod;
    reference?: string;
    note?: string;
  }): Promise<ApiResponse<VisitBilling>> => {
    try {
      const result = await mutation({ variables: { input } });
      const payload = result?.data?.recordVisitBillingPayment;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        data: payload?.data ? mapGqlVisitBilling(payload.data) : undefined,
      };
    } catch (err) {
      console.error("Record billing payment error:", err);
      throw err;
    }
  };

  return { recordPayment, loading, error };
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

// ── Bill Editing Mode hooks ──────────────────────────────────────────────────

export interface BillEditingResponse {
  visitDepartmentId: string;
  status: string;
}

export function useStartBillEditing() {
  const [mutation, { loading, error }] = useMutation<{
    startBillEditing: { status: string; message?: string; data?: BillEditingResponse };
  }>(START_BILL_EDITING_MUTATION);

  const startBillEditing = async (visitDepartmentId: string): Promise<{ status: string; message?: string }> => {
    try {
      const result = await mutation({ variables: { visitDepartmentId } });
      const payload = result?.data?.startBillEditing;
      return { status: payload?.status || "ERROR", message: payload?.message };
    } catch (err) {
      console.error("Start bill editing error:", err);
      throw err;
    }
  };

  return { startBillEditing, loading, error };
}

export function useCompleteBillEditing() {
  const [mutation, { loading, error }] = useMutation<{
    completeBillEditing: { status: string; message?: string; data?: BillEditingResponse };
  }>(COMPLETE_BILL_EDITING_MUTATION);

  const completeBillEditing = async (visitDepartmentId: string): Promise<{ status: string; message?: string }> => {
    try {
      const result = await mutation({ variables: { visitDepartmentId } });
      const payload = result?.data?.completeBillEditing;
      return { status: payload?.status || "ERROR", message: payload?.message };
    } catch (err) {
      console.error("Complete bill editing error:", err);
      throw err;
    }
  };

  return { completeBillEditing, loading, error };
}

export function useCancelBillEditing() {
  const [mutation, { loading, error }] = useMutation<{
    cancelBillEditing: { status: string; message?: string; data?: BillEditingResponse };
  }>(CANCEL_BILL_EDITING_MUTATION);

  const cancelBillEditing = async (visitDepartmentId: string): Promise<{ status: string; message?: string }> => {
    try {
      const result = await mutation({ variables: { visitDepartmentId } });
      const payload = result?.data?.cancelBillEditing;
      return { status: payload?.status || "ERROR", message: payload?.message };
    } catch (err) {
      console.error("Cancel bill editing error:", err);
      throw err;
    }
  };

  return { cancelBillEditing, loading, error };
}

export function useQuickBill() {
  const [mutation, { loading, error }] = useMutation<QuickBillMutationData>(QUICK_BILL_MUTATION);

  const quickBill = async (visitId: string) => {
    try {
      const result = await mutation({ variables: { visitId } });
      const payload = result?.data?.quickBill;
      return { status: payload?.status || "ERROR", message: payload?.message };
    } catch (err) {
      console.error("Quick bill error:", err);
      throw err;
    }
  };

  return { quickBill, loading, error };
}
