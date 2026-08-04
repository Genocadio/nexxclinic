/**
 * FieldError — tiny inline validation message used below form fields.
 * Rendered directly under the input (never as a toast). Imported by the
 * react-hook-form + zod powered forms.
 */
export function FieldError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className={`mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 ${
        className ?? ""
      }`}
    >
      {message}
    </p>
  );
}

/** True when a field has a validation error — used to tint the input border. */
export function hasError(message?: string): boolean {
  return Boolean(message);
}
