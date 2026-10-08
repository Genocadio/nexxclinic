"use client";

import { useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "react-toastify";
import type { VisitDepartment } from "@/hooks/types";
import type { FormAction } from "@/lib/form-storage";
import type { SavedForm } from "@/lib/formbuilder-storage";
import type { PatientInsurance } from "@/lib/api-types";
import { isVisitOrDepartmentClosedForProducts } from "@/lib/visit-product-lock";
import {
  useAddActionToVisitDepartment,
  useAddConsumableToVisitDepartment,
  useAddDiagnosisToVisitDepartment,
  useAddMedicationToVisitDepartment,
  useRemoveDiagnosisFromVisitDepartment,
  useUpdateDiagnosisNotes,
  useRemoveProductFromVisitDepartment,
  useUpdateProductQuantity,
} from "@/hooks/visits";
import type { DiagEntry, FormAnswers, MedFullEntry, MedMiniEntry } from "../../renderer/types";
import type { FormRendererExtension, MedicalBlockHandlers } from "../types";
import {
  buildLongMedicationInstructions,
  extractProductIdentifiers,
  parseMedicationInstructions,
  visitProductToFormAction,
} from "./utils";

export interface ConsultationVisitExtensionOptions {
  form: SavedForm | null;
  visitId: string;
  visitDepartmentId: string;
  /** Catalog department id used when adding products */
  departmentId: string;
  visitDepartments?: VisitDepartment[];
  visitStatus?: string;
  visitDepartmentStatus?: string;
  /** Pre-mapped visit products (from page-level visit fetch) */
  existingProducts?: FormAction[];
  answers?: FormAnswers;
  setAnswers?: (
    updater: FormAnswers | ((prev: FormAnswers) => FormAnswers),
  ) => void;
  edit?: boolean;
  onVisitRefetch?: () => void;
  linkedInsurances?: PatientInsurance[];
}

function resolveVisitDepartment(
  visitDepartments: VisitDepartment[] | undefined,
  visitDepartmentId: string,
) {
  return (
    visitDepartments?.find(
      (dept) => String(dept.id) === String(visitDepartmentId),
    ) ?? null
  );
}

function mapDepartmentProducts(dept: VisitDepartment | null): FormAction[] {
  if (!dept?.products?.length) return [];
  return dept.products.map((line) =>
    visitProductToFormAction({
      id: String(line.id),
      quantity: line.quantity,
      billingConfirmationStatus: line.billingConfirmationStatus,
      confirmedBy: line.confirmedBy,
      product: {
        id: String(line.product.id),
        name: line.product.name,
        type: line.product.type,
        clinicPrice: line.product.clinicPrice,
        privateRhicPrice: line.product.privateRhicPrice,
      },
    }),
  );
}

export function useConsultationVisitExtension(
  options: ConsultationVisitExtensionOptions,
): FormRendererExtension {
  const {
    visitId,
    visitDepartmentId,
    departmentId,
    visitDepartments = [],
    visitStatus,
    visitDepartmentStatus,
    existingProducts = [],
    edit = true,
    onVisitRefetch,
    linkedInsurances = [],
  } = options;

  const { doctor } = useAuth();
  const { addDiagnosis } = useAddDiagnosisToVisitDepartment();
  const { removeDiagnosis } = useRemoveDiagnosisFromVisitDepartment();
  const { updateDiagnosisNotes } = useUpdateDiagnosisNotes();
  const { addMedication } = useAddMedicationToVisitDepartment();
  const { addAction } = useAddActionToVisitDepartment();
  const { addConsumable } = useAddConsumableToVisitDepartment();
  const { removeProduct } = useRemoveProductFromVisitDepartment();
  const { updateQuantity } = useUpdateProductQuantity();

  const activeDepartment = useMemo(
    () => resolveVisitDepartment(visitDepartments, visitDepartmentId),
    [visitDepartments, visitDepartmentId],
  );

  // Live products viewport — derived directly from visit department
  const visitProducts = useMemo(() => {
    const fromDept = mapDepartmentProducts(activeDepartment);
    if (fromDept.length > 0) return fromDept;
    return existingProducts;
  }, [activeDepartment, existingProducts]);

  // Live diagnoses viewport — derived directly from visit department
  const visitDiagnostics = useMemo((): DiagEntry[] => {
    if (!activeDepartment?.diagnostics?.length) return [];
    return activeDepartment.diagnostics.map((d) => ({
      id: String(d.id),
      diagnosis: String(d.diagnosisName || ""),
      icd11Code: d.icd11Code || undefined,
      type: d.type,
      notes: d.notes || "",
    }));
  }, [activeDepartment?.diagnostics]);

  // Live medications viewport — derived directly from visit department
  const visitMedicationsFull = useMemo((): MedFullEntry[] => {
    if (!activeDepartment?.medications?.length) return [];
    return activeDepartment.medications.map((m) => {
      const parsed = parseMedicationInstructions(m.instructions || "");
      return {
        id: String(m.id),
        name: String(m.medicationName || ""),
        frequency: parsed.frequency,
        amount: parsed.amount,
        days: parsed.days,
        notes: parsed.notes || undefined,
      };
    });
  }, [activeDepartment?.medications]);

  const visitMedicationsMini = useMemo((): MedMiniEntry[] => {
    if (!activeDepartment?.medications?.length) return [];
    return activeDepartment.medications.map((m) => ({
      id: String(m.id),
      name: String(m.medicationName || ""),
      notes: m.instructions || undefined,
    }));
  }, [activeDepartment?.medications]);

  const productsLocked = useMemo(
    () =>
      isVisitOrDepartmentClosedForProducts(visitStatus, visitDepartmentStatus),
    [visitStatus, visitDepartmentStatus],
  );

  const handleAddProduct = useCallback(
    async (
      type: "action" | "consumable",
      item: {
        id: string;
        name: string;
        privatePrice?: number;
        isQuantifiable?: boolean;
      },
      quantity: number,
    ) => {
      if (productsLocked) return false;

      const catalogId = String(item.id);
      const existingProduct = visitProducts.find((a) =>
        extractProductIdentifiers(a).includes(catalogId),
      );

      if (existingProduct) {
        const newQty = (existingProduct.quantity || 0) + quantity;
        if (existingProduct.backendId) {
          try {
            const result = await updateQuantity(existingProduct.backendId, newQty);
            if (result?.status !== "SUCCESS") {
              toast.error(result?.message || "Failed to update product quantity");
              return false;
            }
            onVisitRefetch?.();
            return true;
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update quantity");
            return false;
          }
        }
        toast.error("Could not update the existing product quantity. Refresh and try again.");
        return false;
      }

      try {
        const result =
          type === "action"
            ? await addAction(visitId, departmentId, catalogId, quantity, doctor?.id)
            : await addConsumable(visitId, departmentId, catalogId, quantity, doctor?.id);

        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to add product");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add product");
        return false;
      }
    },
    [
      productsLocked,
      visitProducts,
      visitId,
      departmentId,
      doctor?.id,
      addAction,
      addConsumable,
      updateQuantity,
      onVisitRefetch,
    ],
  );

  const handleRemoveProduct = useCallback(
    async (actionId: string) => {
      const action = visitProducts.find((a) => a.id === actionId);
      if (!action?.backendId) return;

      try {
        const result = await removeProduct(action.backendId);
        const ok =
          result?.status === "SUCCESS" ||
          (typeof result?.message === "string" &&
            /not found/i.test(result.message));

        if (!ok) {
          toast.error(result?.message || "Failed to remove product");
          return;
        }
        onVisitRefetch?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to remove product");
      }
    },
    [visitProducts, removeProduct, onVisitRefetch],
  );

  const handleUpdateProductQuantity = useCallback(
    async (actionId: string, quantity: number) => {
      const action = visitProducts.find((a) => a.id === actionId);
      if (!action?.backendId) return;

      try {
        await updateQuantity(action.backendId, quantity);
        onVisitRefetch?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update quantity");
      }
    },
    [visitProducts, updateQuantity, onVisitRefetch],
  );

  const handleAddDiagnosis = useCallback(
    async (diagnosis: string, description?: string) => {
      if (!visitDepartmentId) return false;
      try {
        const result = await addDiagnosis(visitDepartmentId, diagnosis.trim(), description?.trim());
        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to add diagnosis");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add diagnosis");
        return false;
      }
    },
    [visitDepartmentId, addDiagnosis, onVisitRefetch],
  );

  const handleRemoveDiagnosis = useCallback(
    async (diagnosisId: string) => {
      try {
        const result = await removeDiagnosis(diagnosisId);
        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to remove diagnosis");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to remove diagnosis");
        return false;
      }
    },
    [removeDiagnosis, onVisitRefetch],
  );

  const handleUpdateDiagnosisNotes = useCallback(
    async (diagnosisId: string, notes: string) => {
      try {
        const result = await updateDiagnosisNotes(diagnosisId, notes);
        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to save diagnosis notes");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save diagnosis notes");
        return false;
      }
    },
    [updateDiagnosisNotes, onVisitRefetch],
  );

  const handleAddMedicationFull = useCallback(
    async (entry: Omit<MedFullEntry, "id">) => {
      if (!visitDepartmentId) return false;
      const instructions = buildLongMedicationInstructions(entry);
      try {
        const result = await addMedication(
          visitDepartmentId,
          entry.name.trim(),
          instructions,
        );
        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to add medication");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add medication");
        return false;
      }
    },
    [visitDepartmentId, addMedication, onVisitRefetch],
  );

  const handleAddMedicationMini = useCallback(
    async (name: string, notes?: string) => {
      if (!visitDepartmentId) return false;
      const instructions = notes?.trim() || "No additional notes";
      try {
        const result = await addMedication(
          visitDepartmentId,
          name.trim(),
          instructions,
        );
        if (result?.status !== "SUCCESS") {
          toast.error(result?.message || "Failed to add medication");
          return false;
        }
        onVisitRefetch?.();
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add medication");
        return false;
      }
    },
    [visitDepartmentId, addMedication, onVisitRefetch],
  );

  const existingProductReferenceIds = useMemo(
    () =>
      Array.from(
        new Set(
          visitProducts.flatMap(extractProductIdentifiers),
        ),
      ),
    [visitProducts],
  );

  const isVisitOrDeptFinalised = useMemo(() => {
    const vStatus = String(visitStatus || "").toUpperCase();
    const dStatus = String(visitDepartmentStatus || "").toUpperCase();
    return (
      vStatus === "FINALISED" ||
      vStatus === "CANCELLED" ||
      dStatus === "FINALISED" ||
      dStatus === "CANCELLED"
    );
  }, [visitStatus, visitDepartmentStatus]);

  const getBlockHandlers = useCallback(
    (
      block: import("@/lib/formbuilder-storage").FormBlock,
    ): MedicalBlockHandlers | null => {
      const canEditClinical = !isVisitOrDeptFinalised;

      switch (block.type) {
        case "product_listener":
          return {
            productActions: visitProducts,
            onAddProduct:
              !productsLocked && edit ? (type, item, quantity) => handleAddProduct(type, item, quantity) : undefined,
            onRemoveProduct:
              !productsLocked && edit
                ? (actionId) => {
                    void handleRemoveProduct(actionId);
                  }
                : undefined,
            onUpdateProductQuantity:
              !productsLocked && edit
                ? (actionId, qty) => {
                    void handleUpdateProductQuantity(actionId, qty);
                  }
                : undefined,
            productsLocked,
            visitId,
            departmentId,
            visitDepartmentId,
            linkedInsurances,
          };
        case "diagnostic_record":
          return {
            diagnostics: visitDiagnostics,
            onAddDiagnosis: canEditClinical
              ? (diagnosis, icd11Code) =>
                  handleAddDiagnosis(diagnosis, icd11Code)
              : undefined,
            onRemoveDiagnosis: canEditClinical
              ? (diagnosisId) => handleRemoveDiagnosis(diagnosisId)
              : undefined,
            onUpdateDiagnosisNotes: canEditClinical
              ? (diagnosisId, notes) => handleUpdateDiagnosisNotes(diagnosisId, notes)
              : undefined,
          };
        case "medication_full":
          return {
            medicationsFull: visitMedicationsFull,
            onAddMedicationFull: canEditClinical
              ? (entry) => handleAddMedicationFull(entry)
              : undefined,
          };
        case "medication_mini":
          return {
            medicationsMini: visitMedicationsMini,
            onAddMedicationMini: canEditClinical
              ? (name, notes) => handleAddMedicationMini(name, notes)
              : undefined,
          };
        default:
          return null;
      }
    },
    [
      edit,
      isVisitOrDeptFinalised,
      productsLocked,
      visitProducts,
      visitDiagnostics,
      visitMedicationsFull,
      visitMedicationsMini,
      visitId,
      departmentId,
      visitDepartmentId,
      linkedInsurances,
      handleAddProduct,
      handleRemoveProduct,
      handleUpdateProductQuantity,
      handleAddDiagnosis,
      handleRemoveDiagnosis,
      handleUpdateDiagnosisNotes,
      handleAddMedicationFull,
      handleAddMedicationMini,
    ],
  );

  return useMemo(
    () => ({
      id: "consultation-visit",
      getBlockHandlers,
    }),
    [getBlockHandlers],
  );
}
