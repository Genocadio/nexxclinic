/**
 * use-debounced-validation.ts
 *
 * Debounces react-hook-form's live validation so complex schemas (cross-field
 * `superRefine` rules, conditional fields, arrays) aren't re-parsed on every
 * keystroke. Use it alongside `mode: "onSubmit"` on the forms it powers:
 *
 *   const form = useForm({ resolver, mode: "onSubmit" });
 *   useDebouncedValidation({ control: form.control, trigger: form.trigger });
 *
 * Behavior:
 * - Values still update instantly (no input lag) — only the validation pass is
 *   deferred until `delay` ms after the last change.
 * - Only fields the user has edited (or that already show an error) are
 *   re-validated, so untouched fields never flash errors while cross-field
 *   rules (superRefine) still re-run as you type.
 */
import { useEffect, useRef } from "react";
import { useFormState, useWatch } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface UseDebouncedValidationOptions<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  trigger: (
    name?: FieldPath<TFieldValues> | readonly FieldPath<TFieldValues>[],
  ) => Promise<boolean>;
  /** Pause (ms) after the last keystroke before re-validating. Default 350. */
  delay?: number;
}

export function useDebouncedValidation<TFieldValues extends FieldValues>({
  control,
  trigger,
  delay = 350,
}: UseDebouncedValidationOptions<TFieldValues>) {
  const values = useWatch({ control });
  const { dirtyFields, errors } = useFormState({ control });

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef(trigger);

  useEffect(() => {
    triggerRef.current = trigger;
  }, [trigger]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const dirtyNames = (
        Object.keys(dirtyFields) as FieldPath<TFieldValues>[]
      ).filter((key) => Boolean((dirtyFields as Record<string, unknown>)[key]));
      const errorNames = Object.keys(errors) as FieldPath<TFieldValues>[];
      const names = Array.from(new Set([...dirtyNames, ...errorNames]));

      if (names.length > 0) {
        void triggerRef.current(names);
      }
    }, delay);
    // Re-run only when the form values (or delay) change; dirtyFields/errors
    // are read from the same render the change was applied in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, delay]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
}
