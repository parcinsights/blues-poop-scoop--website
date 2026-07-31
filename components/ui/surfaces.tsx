import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

/** Raised content block. Service cards, plan cards, review cards. */
export function Card({
  children,
  tone = "default",
  as: _as,
}: {
  children: ReactNode;
  tone?: "default" | "featured";
  as?: never;
}) {
  return (
    <div
      className={cx(
        // White on the cream page background — the card lifts by going lighter, not darker.
        "rounded-lg p-6 h-full",
        tone === "default" && "bg-surface-raised border border-line shadow-sm",
        tone === "featured" && "bg-surface-raised border-2 border-amber shadow-md",
      )}
    >
      {children}
    </div>
  );
}

/** Small status or category label. Never interactive — use Button for that. */
export function Badge({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "accent" | "neutral";
}) {
  const tones = {
    brand: "bg-brand-tint text-brand",
    accent: "bg-amber-tint text-ink",
    neutral: "bg-surface-alt text-ink-muted",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-pill px-3 py-1 text-caption font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Pulled-out note — guarantees, service-area warnings, seasonal caveats. */
export function Callout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning";
}) {
  const tones = {
    info: "bg-brand-tint border-brand",
    success: "bg-sky-tint border-success-ink",
    warning: "bg-amber-tint border-amber-dark",
  } as const;

  return (
    <div className={cx("rounded-md border-l-4 p-4", tones[tone])}>
      {children}
    </div>
  );
}

/**
 * A labelled fact. Used for hours, coverage, and the "details" tables on service pages —
 * anywhere a page states a value against a name.
 */
export function Definitions({ items }: { items: { term: string; detail: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="text-caption font-semibold uppercase tracking-wide text-ink-muted">
            {item.term}
          </dt>
          <dd className="text-body text-ink">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
