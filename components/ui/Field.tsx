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

const control = "w-full border border-line-strong px-4 py-3 text-body text-ink placeholder:text-ink-muted";

/**
 * Two shapes for the same control.
 *
 * `boxed` is the default and the one to reach for on a page whose job is the form — /get-started/.
 * A rounded rectangle on white, under a label, is the shape people have filled in ten thousand
 * times, and it is the least likely to be misread.
 *
 * `pill` is the compact form dropped INSIDE another page — the card beside the tabs on a service
 * page. Fully round, transparent, centred, and its label carried as the placeholder, so five fields
 * read as five soft lines rather than as a stack of boxes competing with the copy next to them.
 * The trade is real: a placeholder disappears the moment someone types, so this shape belongs on
 * short, obvious forms and nowhere else. The `<label>` is still there either way — see `hideLabel`.
 */
export type FieldVariant = "boxed" | "pill";

const variants: Record<FieldVariant, string> = {
  boxed: "rounded-md bg-surface-raised",
  // `text-center` centres the value AND the placeholder — a placeholder inherits text alignment.
  pill: "rounded-pill bg-transparent text-center",
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  hideLabel = false,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /**
   * Hide the label VISUALLY — never remove it. `sr-only` keeps it in the DOM, so it is still the
   * control's accessible name, still what a screen reader announces, and still there when the
   * placeholder vanishes under the first keystroke. A `placeholder` alone is not a label: it is
   * announced inconsistently, it fails at 3:1 against most backgrounds, and it is gone exactly when
   * someone needs to check what they are typing.
   *
   * Set it only alongside a `placeholder` that repeats the label word for word.
   */
  hideLabel?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-2", hideLabel && "text-center")}>
      <label
        htmlFor={htmlFor}
        className={cx(hideLabel ? "sr-only" : "text-small font-semibold text-ink")}
      >
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
  variant?: FieldVariant;
};

export function Input({ id, invalid, variant = "boxed", ...rest }: InputProps) {
  return (
    <input
      id={id}
      name={rest.name ?? id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(control, variants[variant], invalid && "border-danger-ink")}
      {...rest}
    />
  );
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "children"> & {
  id: string;
  invalid?: boolean;
  variant?: FieldVariant;
  options: { value: string; label: string }[];
};

export function Select({ id, invalid, variant = "boxed", options, ...rest }: SelectProps) {
  return (
    <select
      id={id}
      name={rest.name ?? id}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className={cx(control, variants[variant], invalid && "border-danger-ink")}
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
