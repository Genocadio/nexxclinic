import { useMutation } from "@apollo/client";
import {
  CREATE_VISIT_MUTATION,
  ADD_VISIT_NOTE_MUTATION,
  ADD_VISIT_VITAL_SIGNS_MUTATION,
  ADD_DEPARTMENT_NOTE_MUTATION,
  ADD_DIAGNOSIS_MUTATION,
  ADD_MEDICATION_MUTATION,
  UPSERT_CONSULTATION_ANSWERS_MUTATION,
  GENERATE_CONSULTATION_PDF_MUTATION,
  COMPLETE_VISIT_MUTATION,
  COMPLETE_CONSULTATION_VISIT_MUTATION,
} from "../mutations";
import type { Visit, ApiResponse } from "../types";
import { mapGqlVisit, type GqlVisit } from "@/lib/gql-mappers";
import { normalizeVisitVitalSigns } from "./vital-signs";
import type { CreateVisitPayload } from "./types";

export function useCreateVisit() {
  const [createVisitMutation, { loading, error }] =
    useMutation<CreateVisitPayload>(CREATE_VISIT_MUTATION);

  const createVisit = async (input: {
    patientId: string;
    insuranceIds?: string[];
    departmentIds: string[];
    visitNotes?: { type: string; text: string }[];
  }): Promise<ApiResponse<Visit>> => {
    try {
      const departments = (input.departmentIds || []).map((departmentId) => ({
        departmentId,
        products: [],
      }));

      const result = await createVisitMutation({
        variables: {
          input: {
            patientId: input.patientId,
            linkedPatientInsuranceIds: input.insuranceIds || [],
            departments,
          },
        },
      });
      const payload = result?.data?.createVisit;
      return {
        status: payload?.status || "ERROR",
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data ? mapGqlVisit(payload.data as GqlVisit) : undefined,
      };
    } catch (err) {
      console.error("Visit creation error:", err);
      throw err;
    }
  };

  return { createVisit, loading, error };
}

export function useAddVisitNote() {
  const [mutation, { loading, error }] = useMutation(ADD_VISIT_NOTE_MUTATION);

  const addVisitNote = async (
    visitId: string,
    type: string | null | undefined,
    text: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId, type, text } });
      return result.data?.addVisitNote;
    } catch (err) {
      console.error("Add visit note error:", err);
      throw err;
    }
  };

  return { addVisitNote, loading, error };
}

export function useAddVisitVitalSigns() {
  const [mutation, { loading, error }] = useMutation(
    ADD_VISIT_VITAL_SIGNS_MUTATION,
  );

  const addVisitVitalSigns = async (
    visitId: string,
    vitalSigns: Array<{ measurementName: string; value: string; unit: string }>,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitId,
            vitalSigns,
          },
        },
      });
      const payload = result.data?.addVisitVitalSigns;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data
          ? {
              ...payload.data,
              vitalSigns: normalizeVisitVitalSigns(
                payload.data.vitalSigns || [],
              ),
            }
          : undefined,
      };
    } catch (err) {
      console.error("Add visit vital signs error:", err);
      throw err;
    }
  };

  return { addVisitVitalSigns, loading, error };
}

export function useAddDepartmentNote() {
  const [mutation, { loading, error }] = useMutation(
    ADD_DEPARTMENT_NOTE_MUTATION,
  );

  const addDepartmentNote = async (
    visitId: string,
    departmentId: string,
    type: string | null | undefined,
    text: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { visitId, departmentId, type, text },
      });
      return result.data?.addDepartmentNote;
    } catch (err) {
      console.error("Add department note error:", err);
      throw err;
    }
  };

  return { addDepartmentNote, loading, error };
}

export function useAddDiagnosisToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_DIAGNOSIS_MUTATION);

  const addDiagnosis = async (
    visitDepartmentId: string,
    diagnosisName: string,
    icd11Code?: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentId,
            diagnosisName,
            icd11Code: icd11Code || undefined,
          },
        },
      });
      return result.data?.addDiagnosis;
    } catch (err) {
      console.error("Add diagnosis error:", err);
      throw err;
    }
  };

  return { addDiagnosis, loading, error };
}

export function useAddMedicationToVisitDepartment() {
  const [mutation, { loading, error }] = useMutation(ADD_MEDICATION_MUTATION);

  const addMedication = async (
    visitDepartmentId: string,
    medicationName: string,
    instructions: string,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: {
          input: {
            visitDepartmentId,
            medicationName,
            instructions,
          },
        },
      });
      return result.data?.addMedication;
    } catch (err) {
      console.error("Add medication error:", err);
      throw err;
    }
  };

  return { addMedication, loading, error };
}

export function useUpsertConsultationAnswers() {
  const [upsertMutation, { loading, error }] = useMutation(
    UPSERT_CONSULTATION_ANSWERS_MUTATION,
  );

  const upsertConsultationAnswers = async (input: {
    consultationId: string;
    visitId: string;
    patientId: string;
    departmentId: string;
    formId: string;
    formVersion: string;
    status: "DRAFT" | "FINAL";
    answers: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await upsertMutation({ variables: { input } });
      return result.data?.upsertConsultationAnswers;
    } catch (err) {
      console.error("Upsert consultation answers error:", err);
      throw err;
    }
  };

  return { upsertConsultationAnswers, loading, error };
}

export function useGenerateConsultationPdf() {
  const [generatePdfMutation, { loading, error }] = useMutation(
    GENERATE_CONSULTATION_PDF_MUTATION,
  );

  const generateConsultationPdf = async (input: {
    consultationId: string;
    departmentId: string;
    formId: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const result = await generatePdfMutation({
        variables: {
          consultationId: input.consultationId,
          departmentId: input.departmentId,
          formId: input.formId,
        },
      });
      return result.data?.generateConsultationPdf;
    } catch (err) {
      console.error("Generate consultation PDF error:", err);
      throw err;
    }
  };

  return { generateConsultationPdf, loading, error };
}

export function useCompleteVisit() {
  const [mutation, { loading, error }] = useMutation(COMPLETE_VISIT_MUTATION);

  const completeVisit = async (visitId: string): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({ variables: { visitId } });
      return result.data.completeVisit;
    } catch (err) {
      console.error("Complete visit error:", err);
      throw err;
    }
  };

  return { completeVisit, loading, error };
}

export function useCompleteConsultationVisit() {
  const [mutation, { loading, error }] = useMutation(
    COMPLETE_CONSULTATION_VISIT_MUTATION,
  );

  const completeConsultationVisit = async (
    input: {
      consultationId: string;
      visitId: string;
      patientId: string;
      departmentId: string;
      formId: string;
      formVersion?: string;
      status: "DRAFT" | "FINAL";
      answers: string;
    },
    final: boolean,
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await mutation({
        variables: { input, final },
      });
      const payload = result.data?.completeConsultationVisit;
      return {
        status: payload?.status || "ERROR",
        message: payload?.message,
        messages: payload?.message
          ? [{ text: payload.message, type: payload.status || "ERROR" }]
          : undefined,
        data: payload?.data,
      };
    } catch (err) {
      console.error("Complete consultation visit error:", err);
      throw err;
    }
  };

  return { completeConsultationVisit, loading, error };
}

