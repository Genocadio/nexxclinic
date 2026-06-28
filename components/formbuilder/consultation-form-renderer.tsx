"use client";

import { useMemo, useState, forwardRef } from "react";
import { FormRenderer, type FormRendererHandle } from "./form-renderer";
import { useConsultationVisitExtension } from "./extensions/consultation-visit";
import type { ConsultationVisitExtensionOptions } from "./extensions/consultation-visit";
import type { FormAnswers, FormRendererProps } from "./renderer/types";
import type { VisitDepartment } from "@/hooks/types";
import type { FormAction } from "@/lib/form-storage";

type ConsultationFormRendererProps = Omit<
  FormRendererProps,
  "extensions" | "controlledAnswers" | "onControlledAnswersChange"
> & {
  visitId: string;
  visitDepartmentId: string;
  departmentId: string;
  visitDepartments?: VisitDepartment[];
  visitStatus?: string;
  visitDepartmentStatus?: string;
  existingProducts?: FormAction[];
  onVisitRefetch?: () => void;
  /** When provided, parent owns answer state (used by consultation view auto-save). */
  controlledAnswers?: FormAnswers;
  onControlledAnswersChange?: (answers: FormAnswers) => void;
};

/**
 * FormRenderer pre-wired with the consultation visit sync extension.
 * Keeps answers in controlled mode so products/diagnostics/medications
 * stay balanced with the visit department.
 */
export const ConsultationFormRenderer = forwardRef<
  FormRendererHandle,
  ConsultationFormRendererProps
>(function ConsultationFormRenderer(
  {
    visitId,
    visitDepartmentId,
    departmentId,
    visitDepartments,
    visitStatus,
    visitDepartmentStatus,
    existingProducts,
    onVisitRefetch,
    initialAnswers = {},
    onChange,
    form,
    controlledAnswers: controlledAnswersProp,
    onControlledAnswersChange,
    ...rest
  },
  ref,
) {
  const [internalAnswers, setInternalAnswers] = useState<FormAnswers>(() => ({
    ...initialAnswers,
  }));
  const isControlled = controlledAnswersProp !== undefined;
  const answers = isControlled ? controlledAnswersProp : internalAnswers;
  const setAnswers = isControlled
    ? (next: FormAnswers | ((prev: FormAnswers) => FormAnswers)) => {
        const resolved =
          typeof next === "function"
            ? (next as (prev: FormAnswers) => FormAnswers)(
                controlledAnswersProp,
              )
            : next;
        onControlledAnswersChange?.(resolved);
      }
    : setInternalAnswers;

  const extensionOptions = useMemo(
    (): Omit<
      ConsultationVisitExtensionOptions,
      "answers" | "setAnswers" | "form" | "edit"
    > => ({
      visitId,
      visitDepartmentId,
      departmentId,
      visitDepartments,
      visitStatus,
      visitDepartmentStatus,
      existingProducts,
      onVisitRefetch,
    }),
    [
      visitId,
      visitDepartmentId,
      departmentId,
      visitDepartments,
      visitStatus,
      visitDepartmentStatus,
      existingProducts,
      onVisitRefetch,
    ],
  );

  const consultationExtension = useConsultationVisitExtension({
    ...extensionOptions,
    form,
    answers,
    setAnswers,
    edit: rest.edit ?? true,
  });

  return (
    <>
      <FormRenderer
        ref={ref}
        form={form}
        initialAnswers={initialAnswers}
        controlledAnswers={answers}
        onControlledAnswersChange={(next) => {
          if (!isControlled) setInternalAnswers(next);
          else onControlledAnswersChange?.(next);
          onChange?.(next);
        }}
        onChange={onChange}
        extensions={[consultationExtension]}
        {...rest}
      />
      {consultationExtension.renderOverlay?.()}
    </>
  );
});
