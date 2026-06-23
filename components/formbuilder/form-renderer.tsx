"use client";

/**
 * FormRenderer — reusable answer-mode/view-mode form component.
 *
 * `initialAnswers` may contain both block answers and inline answers.
 * Inline answer keys use:
 * - paragraph inline fields → `blockId__fieldId`
 * - table inline fields → `blockId__ri__ci__fieldId`
 *
 * When `edit` is `false`, the component renders provided answers read-only.
 * When `edit` is `true` (default), the component allows editing them.
 */

import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnswerBlock } from "./renderer/answer-block";
import type { FormAnswers, FormRendererProps } from "./renderer/types";
import {
  collectAnswerableBlocks,
  isBlockViolating,
  splitInitialAnswers,
} from "./renderer/utils";

export type { FormAnswers } from "./renderer/types";

export function FormRenderer({
  form,
  showTitle = false,
  validate = true,
  onSubmit,
  onChange,
  submitLabel = "Submit",
  hideSubmit = false,
  className = "",
  initialAnswers,
  edit = true,
}: FormRendererProps) {
  const initial = useMemo(
    () => splitInitialAnswers(initialAnswers),
    [initialAnswers],
  );
  const [answers, setAnswers] = useState<FormAnswers>(initial.blockAnswers);
  const [inlineAnswers, setInlineAnswers] = useState<Record<string, string>>(
    initial.inlineAnswers,
  );
  const [showErrors, setShowErrors] = useState(false);

  const notifyChange = useCallback(
    (ans: FormAnswers, inline: Record<string, string>) => {
      onChange?.({ ...ans, ...inline });
    },
    [onChange],
  );

  const handleAnswerChange = useCallback(
    (blockId: string, value: unknown) => {
      if (!edit) return;
      setAnswers((prev) => {
        const next = { ...prev, [blockId]: value };
        notifyChange(next, inlineAnswers);
        return next;
      });
    },
    [edit, inlineAnswers, notifyChange],
  );

  const handleInlineChange = useCallback(
    (key: string, value: string) => {
      if (!edit) return;
      setInlineAnswers((prev) => {
        const next = { ...prev, [key]: value };
        notifyChange(answers, next);
        return next;
      });
    },
    [answers, edit, notifyChange],
  );

  const allBlocks = useMemo(
    () => collectAnswerableBlocks(form?.blocks ?? []),
    [form?.blocks],
  );
  const hasViolations = useMemo(
    () => allBlocks.some((b) => isBlockViolating(b, answers)),
    [allBlocks, answers],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    if (validate && hasViolations) {
      setShowErrors(true);
      return;
    }
    onSubmit?.({ ...answers, ...inlineAnswers });
  };

  if (!form) return null;

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      {showTitle && form.name && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{form.name}</h1>
          {form.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {form.description}
            </p>
          )}
        </div>
      )}

      {form.blocks.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-2xl mb-2">📄</p>
          <p>No blocks in this form yet.</p>
        </div>
      ) : (
        form.blocks.map((block) => (
          <AnswerBlock
            key={block.id}
            block={block}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            showErrors={showErrors}
            inlineAnswers={inlineAnswers}
            onInlineChange={handleInlineChange}
            edit={edit}
          />
        ))
      )}

      {edit && showErrors && hasViolations && (
        <p className="text-sm text-red-500 mt-4 font-medium">
          Please fill in all required fields before submitting.
        </p>
      )}

      {edit && !hideSubmit && (
        <div className="mt-8">
          <Button
            type="submit"
            className="bg-[#FF6900] hover:bg-[#e05f00] text-white px-8"
          >
            {submitLabel}
          </Button>
        </div>
      )}
    </form>
  );
}
