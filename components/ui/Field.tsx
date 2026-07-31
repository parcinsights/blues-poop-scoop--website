import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes } from "react";

import { cx } from "@/lib/cx";

/**
 * Form primitives.
 *
 * Every field has a real `<label>` bound by `htmlFor`, not a placeholder pretending to be one —
 * a placeholder disappears the moment someone types, which is exactly when they need to know what
 * the box is for, and screen readers do not reliably announce it.
 *
 * Errors are wired with `aria-describedby` and `aria-invalid` so they are announced rather than
 * merely turning something red, which is invisible to anyone who cannot distinguish the colour.
 */

const control =
  "w-full rounded-md border border-line-strong bg-surface-raised px-4 py-3 text-body " +
  "text-ink placeholder:text-ink-muted";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-small font-semibold text-ink">
        {label}
        {required && (
          <span className="text-danger-ink" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-caption text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-caption text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  id: string;
  invalid?: boolean;
};

export function Input({ id, invalid, ...rest }: InputProps) {
  return (
    <input
      id={id}
      name={rest.name ?? id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(control, invalid && "border-danger-ink")}
      {...rest}
    />
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "children"> & {
  id: string;
  invalid?: boolean;
  options: { value: string; label: string }[];
};

export function Select({ id, invalid, options, ...rest }: SelectProps) {
  return (
    <select
      id={id}
      name={rest.name ?? id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(control, invalid && "border-danger-ink")}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Spam honeypot. Visually hidden and hidden from assistive tech, so only a bot fills it in;
 * the API route rejects any submission where it has a value. No CAPTCHA, no third-party script,
 * no cost to a real user.
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-0 w-px h-px overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
