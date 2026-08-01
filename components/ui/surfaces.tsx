import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

/** Raised content block. Service cards, plan cards, review cards. */
export function Card({
  children,
  tone = "default",
  as: _as,
}: {
  children: ReactNode;
  tone?: "default" | "featured" | "canvas";
  as?: never;
}) {
  return (
    <div
      className={cx(
        // `relative` so a card can position its own decoration — see the paw on a review card.
        "relative rounded-lg p-6 h-full",
        // White on the cream page background — the card lifts by going lighter, not darker.
        tone === "default" && "bg-surface-raised border border-line shadow-sm",
        tone === "featured" && "bg-surface-raised border-2 border-amber shadow-md",
        // The inverse, for a white band: the card carries the off-white the hero band uses, so a
        // review card and the top of the page are the same colour. No border and no shadow — the
        // fill alone separates it, and a hairline on top of a colour change reads as doubled.
        tone === "canvas" && "bg-canvas",
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
  tone?: "brand" | "accent" | "neutral" | "featured";
}) {
  const tones = {
    brand: "bg-brand-tint text-brand",
    accent: "bg-amber-tint text-ink",
    neutral: "bg-surface-alt text-ink-muted",
    /**
     * The solid amber, for the chip on a `Card tone="featured"` — same hue as that card's rim, so
     * the badge reads as part of the card rather than as a sticker from somewhere else. Ink text
     * only: white on amber is 1.64:1. See the palette note at the top of theme.css.
     */
    featured: "bg-amber text-ink",
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
