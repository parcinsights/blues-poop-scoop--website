import { ChevronDown } from "lucide-react";
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

/**
 * `font-medium` — one step up from body text, and it applies to the VALUE and the PLACEHOLDER
 * alike, since a placeholder inherits weight. Every form on the site gets it.
 *
 * The reason is the pill variant. A round transparent control carrying its label as a placeholder
 * has no box and no fill doing the work of saying "this is a thing you type in"; at normal weight
 * the words inside it sit at the same weight as the paragraph above and the field stops reading as
 * a field. Medium, not semibold: the labels above the boxed variant are already `font-semibold`,
 * and a value as heavy as its own label reads as a filled-in answer before anyone has typed.
 */
const control =
  "w-full border border-line-strong py-3 text-body font-medium text-ink placeholder:text-ink-muted";

/**
 * Two shapes for the same control.
 *
 * `boxed` is a rounded rectangle on white under a visible label — the shape people have filled in
 * ten thousand times, and the least likely to be misread. It is what a form uses when it has the
 * room to spell every question out.
 *
 * `pill` is the shape the site actually wears: the card on the service pages, /locations/ and
 * /contact/. Fully round, transparent, centred, and its label carried as the placeholder, so a
 * form reads as a few soft lines rather than as a stack of boxes competing with the copy beside
 * it. The trade is real — a placeholder disappears the moment someone types — so it belongs on
 * short, obvious questions and nowhere else. The `<label>` is still there either way; see
 * `hideLabel`.
 */
export type FieldVariant = "boxed" | "pill";

const variants: Record<FieldVariant, string> = {
  boxed: "rounded-md bg-surface-raised",
  // `text-center` centres the value AND the placeholder — a placeholder inherits text alignment.
  pill: "rounded-pill bg-transparent text-center",
};

/**
 * Horizontal padding is per-shape and per-CONTROL, which is why it is not in `control` above: a
 * select has to leave room for its chevron, and an input does not.
 *
 * The pill's select is padded EQUALLY on both sides, not just on the right. Its text is centred,
 * and centred text in a box with 44px of padding on one side and 16px on the other is centred on
 * the wrong midline — it drifts left by exactly the difference. Equal padding keeps the value in
 * the middle of the pill and puts the chevron in the space that is already there.
 */
const inputPadding = "px-4";

const selectPadding: Record<FieldVariant, string> = {
  boxed: "pl-4 pr-11",
  pill: "px-11",
};

/**
 * Where the chevron sits. Further in on the pill: that shape's corner is a half-circle, so an icon
 * on the same inset as the boxed variant's would sit against the curve rather than inside it.
 */
const chevronInset: Record<FieldVariant, string> = {
  boxed: "right-4",
  pill: "right-5",
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
      className={cx(control, inputPadding, variants[variant], invalid && "border-danger-ink")}
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

/**
 * A select, with OUR chevron rather than the browser's.
 *
 * `appearance-none` drops the native arrow, and the reason is not decoration: every browser draws
 * it hard against the right edge of the control, which on a pill means it sits in the curve of a
 * 999px radius and on a centred field means the one thing at the right edge is not the thing the
 * eye is centred on. Drawing it ourselves puts it on the same inset the padding uses, so it reads
 * as part of the control instead of as something clipped to it.
 *
 * `pointer-events-none` on the icon: it is decoration over a real `<select>`, and swallowing the
 * click on the right-hand quarter of a control is worse than no icon at all.
 */
export function Select({ id, invalid, variant = "boxed", options, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        id={id}
        name={rest.name ?? id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cx(
          control,
          selectPadding[variant],
          variants[variant],
          "appearance-none",
          invalid && "border-danger-ink",
        )}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={18}
        className={cx(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-muted",
          chevronInset[variant],
        )}
      />
    </div>
  );
}

/**
 * A single checkbox with its label BESIDE it, not above it.
 *
 * It is not a `Field` with a checkbox inside: every other control on the site is a box under a
 * label, and a checkbox under a label is a lone tick mark with a sentence floating over it. The
 * label is also the hit target here — clicking the words toggles the box, which is most of why
 * anyone ever hits one on a phone.
 *
 * Never pass `defaultChecked`. The only checkbox on the site is an SMS consent, and consent that
 * arrives pre-ticked is not consent — the FCC's express-written-consent rule says so in as many
 * words, and it is the single thing that makes a texting list defensible.
 */
export function Checkbox({
  id,
  label,
  hint,
  error,
  name,
  align = "start",
}: {
  id: string;
  /** Read as a sentence, not as a field name — it is what the person is agreeing to. */
  label: ReactNode;
  hint?: string;
  error?: string;
  name?: string;
  /**
   * `center` for the `pill` card, where every other control is centred and a tick box hanging off
   * the left edge is the one thing in the panel that is not. The label itself stays left-aligned
   * inside the row — a centred sentence that wraps to three ragged lines is harder to read than a
   * left-hung one, and this is the only sentence in the card someone has to actually read.
   */
  align?: "start" | "center";
}) {
  const describedBy = cx(hint && `${id}-hint`, error && `${id}-error`) || undefined;
  const centered = align === "center";

  return (
    <div className="flex flex-col gap-2">
      <div className={cx("flex items-start gap-3", centered && "justify-center text-left")}>
        {/* `mt-1` sits the box on the first line's baseline rather than centred against a label
            that may wrap to three lines. `shrink-0` keeps it square when it does. */}
        <input
          id={id}
          name={name ?? id}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className="mt-1 h-5 w-5 shrink-0 rounded-sm border border-line-strong accent-brand"
        />
        <label htmlFor={id} className="text-small text-ink">
          {label}
        </label>
      </div>
      {/* Indented to the label's column — the fine print belongs under the sentence it qualifies,
          not under the tick box. Centred instead when the row is. */}
      {hint && (
        <p
          id={`${id}-hint`}
          className={cx("text-caption text-ink-muted", centered ? "text-center" : "pl-8")}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className={cx("text-caption text-danger-ink", centered ? "text-center" : "pl-8")}
        >
          {error}
        </p>
      )}
    </div>
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
