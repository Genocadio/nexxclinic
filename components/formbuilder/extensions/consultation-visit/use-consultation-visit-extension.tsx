"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VisitDepartment } from "@/hooks/types";
import type { FormAction } from "@/lib/form-storage";
import type { SavedForm } from "@/lib/formbuilder-storage";
import { isVisitOrDepartmentClosedForProducts } from "@/lib/visit-product-lock";
import {
  useAddActionToVisitDepartment,
  useAddConsumableToVisitDepartment,
  useAddDiagnosisToVisitDepartment,
  useAddMedicationToVisitDepartment,
  useRemoveProductFromVisitDepartment,
  useUpdateProductQuantity,
} from "@/hooks/visits";
import AddVisitDepartmentProductModal from "@/components/visit/add-visit-department-product-modal";
import type { FormAnswers } from "../../renderer/types";
import type { FormRendererExtension, MedicalBlockHandlers } from "../types";
import {
  addedProductToFormAction,
  buildLongMedicationInstructions,
  extractProductIdentifiers,
  findSyncBlocks,
  formActionToAddedProduct,
  hydrateClinicalAnswers,
  hydrateProductAnswers,
  markRemovedVisitProducts,
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
  /** Live answers — kept in sync by FormRenderer */
  answers: FormAnswers;
  setAnswers: (
    updater: FormAnswers | ((prev: FormAnswers) => FormAnswers),
  ) => void;
  edit?: boolean;
  onVisitRefetch?: () => void;
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
      price: line.price,
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
    form,
    visitId,
    visitDepartmentId,
    departmentId,
    visitDepartments = [],
    visitStatus,
    visitDepartmentStatus,
    existingProducts = [],
    answers,
    setAnswers,
    edit = true,
    onVisitRefetch,
  } = options;

  const { addDiagnosis } = useAddDiagnosisToVisitDepartment();
  const { addMedication } = useAddMedicationToVisitDepartment();
  const { addAction } = useAddActionToVisitDepartment();
  const { addConsumable } = useAddConsumableToVisitDepartment();
  const { removeProduct } = useRemoveProductFromVisitDepartment();
  const { updateQuantity } = useUpdateProductQuantity();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [activeProductBlockId, setActiveProductBlockId] = useState<
    string | null
  >(null);
  const [fieldActions, setFieldActions] = useState<
    Record<string, FormAction[]>
  >({});
  const hydrationDoneRef = useRef(false);
  const syncNoticeRef = useRef<{
    level: "info" | "warning";
    message: string;
  } | null>(null);

  const activeDepartment = useMemo(
    () => resolveVisitDepartment(visitDepartments, visitDepartmentId),
    [visitDepartments, visitDepartmentId],
  );

  const visitProducts = useMemo(() => {
    const fromDept = mapDepartmentProducts(activeDepartment);
    if (fromDept.length > 0) return fromDept;
    return existingProducts;
  }, [activeDepartment, existingProducts]);

  const productsLocked = useMemo(
    () =>
      isVisitOrDepartmentClosedForProducts(visitStatus, visitDepartmentStatus),
    [visitStatus, visitDepartmentStatus],
  );

  const syncFieldActionsFromAnswers = useCallback(() => {
    if (!form) return;
    const productBlocks = findSyncBlocks(form.blocks).filter(
      (b) => b.type === "product_listener",
    );
    if (productBlocks.length === 0) return;

    setFieldActions((prev) => {
      const next = { ...prev };
      productBlocks.forEach((block) => {
        const items = (
          Array.isArray(answers[block.id]) ? answers[block.id] : []
        ) as ReturnType<typeof formActionToAddedProduct>[];
        next[block.id] = items.map(addedProductToFormAction);
      });
      return next;
    });
  }, [answers, form]);

  useEffect(() => {
    syncFieldActionsFromAnswers();
  }, [syncFieldActionsFromAnswers]);

  // Hydrate missing clinical + product data from visit → form
  useEffect(() => {
    if (!form || !visitDepartmentId || hydrationDoneRef.current) return;
    if (!activeDepartment && visitProducts.length === 0) return;

    setAnswers((prev) => {
      let next = prev;
      let changed = false;
      if (activeDepartment) {
        const clinical = hydrateClinicalAnswers(
          form.blocks,
          next,
          activeDepartment,
        );
        if (clinical) {
          next = clinical;
          changed = true;
        }
      }
      const products = hydrateProductAnswers(form.blocks, next, visitProducts);
      if (products) {
        next = products;
        changed = true;
      }
      if (changed) {
        syncNoticeRef.current = {
          level: "info",
          message: "Existing consultation data was synced into this form.",
        };
      }
      return next === prev ? prev : next;
    });

    hydrationDoneRef.current = true;
  }, [form, visitDepartmentId, activeDepartment, visitProducts, setAnswers]);

  // Mark products removed from visit
  useEffect(() => {
    if (!form || visitProducts.length === 0) return;
    setAnswers((prev) => {
      const patch = markRemovedVisitProducts(prev, form.blocks, visitProducts);
      return patch ?? prev;
    });
  }, [form, visitProducts, setAnswers]);

  const extractBackendProductId = useCallback(
    (
      result: {
        data?: { products?: Array<{ id?: string; product?: { id?: string } }> };
      },
      catalogId: string,
    ) => {
      if (Array.isArray(result.data?.products)) {
        const match = result.data.products.find(
          (p) => String(p?.product?.id) === String(catalogId),
        );
        if (match?.id) return String(match.id);
      }
      return String(catalogId);
    },
    [],
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
      if (!activeProductBlockId || productsLocked) return;

      const blockId = activeProductBlockId;
      const catalogId = String(item.id);
      const currentList = fieldActions[blockId] || [];
      const duplicate = currentList.find((a) =>
        extractProductIdentifiers(a).includes(catalogId),
      );

      if (duplicate) {
        const newQty = (duplicate.quantity || 0) + quantity;
        setFieldActions((prev) => ({
          ...prev,
          [blockId]:
            prev[blockId]?.map((a) =>
              a.id === duplicate.id ? { ...a, quantity: newQty } : a,
            ) || [],
        }));
        setAnswers((prev) => {
          const items = (
            Array.isArray(prev[blockId]) ? prev[blockId] : []
          ) as ReturnType<typeof formActionToAddedProduct>[];
          return {
            ...prev,
            [blockId]: items.map((p) =>
              p.id === duplicate.id ? { ...p, qty: newQty } : p,
            ),
          };
        });
        if (duplicate.backendId) {
          await updateQuantity(duplicate.backendId, newQty);
        }
        return;
      }

      const result =
        type === "action"
          ? await addAction(visitId, departmentId, catalogId, quantity)
          : await addConsumable(visitId, departmentId, catalogId, quantity);

      if (result?.status !== "SUCCESS") return;

      const backendId = extractBackendProductId(result, catalogId);
      const newAction: FormAction = {
        id: `${type}-${catalogId}-${Date.now()}`,
        name: item.name,
        type,
        quantity,
        privatePrice: item.privatePrice ?? 0,
        isQuantifiable: item.isQuantifiable !== false,
        backendId,
        rawData: item,
        source: "local",
      };

      setFieldActions((prev) => ({
        ...prev,
        [blockId]: [...(prev[blockId] || []), newAction],
      }));
      setAnswers((prev) => {
        const items = (
          Array.isArray(prev[blockId]) ? prev[blockId] : []
        ) as ReturnType<typeof formActionToAddedProduct>[];
        return {
          ...prev,
          [blockId]: [...items, formActionToAddedProduct(newAction)],
        };
      });
    },
    [
      activeProductBlockId,
      productsLocked,
      fieldActions,
      visitId,
      departmentId,
      addAction,
      addConsumable,
      updateQuantity,
      extractBackendProductId,
      setAnswers,
      onVisitRefetch,
    ],
  );

  const handleRemoveProduct = useCallback(
    async (blockId: string, actionId: string) => {
      const action = fieldActions[blockId]?.find((a) => a.id === actionId);
      if (!action) return;

      if (!action.backendId || action.removedFromVisit) {
        setFieldActions((prev) => ({
          ...prev,
          [blockId]: prev[blockId]?.filter((a) => a.id !== actionId) || [],
        }));
        setAnswers((prev) => {
          const items = (
            Array.isArray(prev[blockId]) ? prev[blockId] : []
          ) as ReturnType<typeof formActionToAddedProduct>[];
          return { ...prev, [blockId]: items.filter((p) => p.id !== actionId) };
        });
        return;
      }

      const result = await removeProduct(action.backendId);
      const ok =
        result?.status === "SUCCESS" ||
        (typeof result?.message === "string" &&
          /not found/i.test(result.message));

      if (ok) {
        setFieldActions((prev) => ({
          ...prev,
          [blockId]: prev[blockId]?.filter((a) => a.id !== actionId) || [],
        }));
        setAnswers((prev) => {
          const items = (
            Array.isArray(prev[blockId]) ? prev[blockId] : []
          ) as ReturnType<typeof formActionToAddedProduct>[];
          return { ...prev, [blockId]: items.filter((p) => p.id !== actionId) };
        });
      }
    },
    [fieldActions, removeProduct, setAnswers, onVisitRefetch],
  );

  const handleUpdateProductQuantity = useCallback(
    async (blockId: string, actionId: string, quantity: number) => {
      const action = fieldActions[blockId]?.find((a) => a.id === actionId);
      if (!action?.backendId) return;

      await updateQuantity(action.backendId, quantity);
      setFieldActions((prev) => ({
        ...prev,
        [blockId]:
          prev[blockId]?.map((a) =>
            a.id === actionId ? { ...a, quantity } : a,
          ) || [],
      }));
      setAnswers((prev) => {
        const items = (
          Array.isArray(prev[blockId]) ? prev[blockId] : []
        ) as ReturnType<typeof formActionToAddedProduct>[];
        return {
          ...prev,
          [blockId]: items.map((p) =>
            p.id === actionId ? { ...p, qty: quantity } : p,
          ),
        };
      });
    },
    [fieldActions, updateQuantity, setAnswers],
  );

  const handleAddDiagnosis = useCallback(
    async (blockId: string, diagnosis: string, description?: string) => {
      if (!visitDepartmentId) return false;
      const result = await addDiagnosis(visitDepartmentId, diagnosis.trim());
      if (result?.status !== "SUCCESS") return false;

      const added = Array.isArray(result.data?.diagnostics)
        ? result.data.diagnostics[result.data.diagnostics.length - 1]
        : undefined;

      const entry = {
        id: String(added?.id || `diag_${Date.now()}`),
        diagnosis: String(added?.diagnosisName || diagnosis),
        description: description?.trim() || undefined,
      };

      setAnswers((prev) => {
        const existing = Array.isArray(prev[blockId]) ? prev[blockId] : [];
        if (existing.some((r: { id?: string }) => String(r.id) === entry.id)) {
          return prev;
        }
        return { ...prev, [blockId]: [...existing, entry] };
      });
      return true;
    },
    [visitDepartmentId, addDiagnosis, setAnswers, onVisitRefetch],
  );

  const handleAddMedicationFull = useCallback(
    async (
      blockId: string,
      entry: Omit<import("../../renderer/types").MedFullEntry, "id">,
    ) => {
      if (!visitDepartmentId) return false;
      const instructions = buildLongMedicationInstructions(entry);
      const result = await addMedication(
        visitDepartmentId,
        entry.name.trim(),
        instructions,
      );
      if (result?.status !== "SUCCESS") return false;

      const added = Array.isArray(result.data?.medications)
        ? result.data.medications[result.data.medications.length - 1]
        : undefined;

      const record = {
        id: String(added?.id || `med_full_${Date.now()}`),
        name: String(added?.medicationName || entry.name),
        frequency: entry.frequency,
        amount: entry.amount,
        days: entry.days,
        notes: entry.notes,
      };

      setAnswers((prev) => {
        const existing = Array.isArray(prev[blockId]) ? prev[blockId] : [];
        if (existing.some((r: { id?: string }) => String(r.id) === record.id)) {
          return prev;
        }
        return { ...prev, [blockId]: [...existing, record] };
      });
      return true;
    },
    [visitDepartmentId, addMedication, setAnswers, onVisitRefetch],
  );

  const handleAddMedicationMini = useCallback(
    async (blockId: string, name: string, notes?: string) => {
      if (!visitDepartmentId) return false;
      const instructions = notes?.trim() || "No additional notes";
      const result = await addMedication(
        visitDepartmentId,
        name.trim(),
        instructions,
      );
      if (result?.status !== "SUCCESS") return false;

      const added = Array.isArray(result.data?.medications)
        ? result.data.medications[result.data.medications.length - 1]
        : undefined;

      const record = {
        id: String(added?.id || `med_mini_${Date.now()}`),
        name: String(added?.medicationName || name),
        notes: String(added?.instructions || notes || "") || undefined,
      };

      setAnswers((prev) => {
        const existing = Array.isArray(prev[blockId]) ? prev[blockId] : [];
        if (existing.some((r: { id?: string }) => String(r.id) === record.id)) {
          return prev;
        }
        return { ...prev, [blockId]: [...existing, record] };
      });
      return true;
    },
    [visitDepartmentId, addMedication, setAnswers, onVisitRefetch],
  );

  const existingProductReferenceIds = useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(fieldActions).flatMap((actions) =>
            actions.flatMap(extractProductIdentifiers),
          ),
        ),
      ),
    [fieldActions],
  );

  const getBlockHandlers = useCallback(
    (
      block: import("@/lib/formbuilder-storage").FormBlock,
    ): MedicalBlockHandlers | null => {
      if (!edit) return { productsLocked: true };

      switch (block.type) {
        case "product_listener":
          return {
            productActions: fieldActions[block.id] || [],
            onOpenProductPicker: () => {
              setActiveProductBlockId(block.id);
              setProductModalOpen(true);
            },
            onRemoveProduct: (actionId) => {
              void handleRemoveProduct(block.id, actionId);
            },
            onUpdateProductQuantity: (actionId, qty) => {
              void handleUpdateProductQuantity(block.id, actionId, qty);
            },
            productsLocked,
            visitId,
            departmentId,
          };
        case "diagnostic_record":
          return {
            onAddDiagnosis: (diagnosis, description) =>
              handleAddDiagnosis(block.id, diagnosis, description),
          };
        case "medication_full":
          return {
            onAddMedicationFull: (entry) =>
              handleAddMedicationFull(block.id, entry),
          };
        case "medication_mini":
          return {
            onAddMedicationMini: (name, notes) =>
              handleAddMedicationMini(block.id, name, notes),
          };
        default:
          return null;
      }
    },
    [
      edit,
      fieldActions,
      productsLocked,
      visitId,
      departmentId,
      handleRemoveProduct,
      handleUpdateProductQuantity,
      handleAddDiagnosis,
      handleAddMedicationFull,
      handleAddMedicationMini,
    ],
  );

  const renderOverlay = useCallback(
    () => (
      <AddVisitDepartmentProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setActiveProductBlockId(null);
        }}
        visitDepartments={visitDepartments}
        currentCatalogDepartmentId={departmentId}
        viewMode="service"
        onAdd={handleAddProduct}
        existingProductReferenceIds={existingProductReferenceIds}
      />
    ),
    [
      productModalOpen,
      visitDepartments,
      departmentId,
      handleAddProduct,
      existingProductReferenceIds,
    ],
  );

  return useMemo(
    () => ({
      id: "consultation-visit",
      getBlockHandlers,
      renderOverlay,
    }),
    [getBlockHandlers, renderOverlay],
  );
}
