import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

/** Raised content block. Service cards, plan cards, review cards. */
export function Card({
  children,
  tone = "default",
  aspect = "auto",
  as: _as,
}: {
  children: ReactNode;
  tone?: "default" | "featured" | "canvas";
  /**
   * `square` locks the card to a 1:1 box — but only from `lg`, and that qualifier is the whole
   * point. A square is a shape you can only afford when the card is WIDE: at the page width two
   * of them are ~580px across, so a square is 580px tall and everything inside it has room. In a
   * 300px tablet column the same rule gives a 300px box that its own contents overflow. Below
   * `lg` the card is therefore just as tall as what is in it, which is what a phone wants anyway.
   */
  aspect?: "auto" | "square";
  as?: never;
}) {
  return (
    <div
      className={cx(
        // `relative` so a card can position its own decoration — see the paw on a review card.
        "relative rounded-lg p-6 h-full",
        aspect === "square" && "lg:aspect-square lg:p-8",
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

// ── Chip ─────────────────────────────────────────────────────────────────────

/**
 * The outlined pill. A hairline border, a full radius, and a short phrase inside it — the service
 * hero's qualities ("Weekly or bi-weekly", "No contracts") and the tab toggles under it.
 *
 * Deliberately not `Badge`: a badge is a FILLED chip that labels the thing it sits on ("Most
 * popular" on a price card). This is an outline that reads as a tag in a row of tags, which is why
 * the two must not converge — a filled toggle row would look like four "most popular" stickers.
 *
 * `quiet` is the resting state and the only one a static chip ever takes. `selected` is the navy
 * fill, for the chosen tab: cream on navy is 8.18:1, and it is the one fill on this site that can
 * carry light text at all. See the palette note at the top of theme.css.
 */
const chipBase =
  "inline-flex items-center justify-center rounded-pill border px-4 py-1.5 " +
  "text-small font-semibold whitespace-nowrap";

const chipTones = {
  // `line-strong`, not `line`: this is a visible edge doing the work of a control, and the supplied
  // grey is 1.95:1 on cream — under the 3:1 non-text minimum. See theme.css.
  quiet: "border-line-strong bg-transparent text-ink",
  selected: "border-brand bg-brand text-ink-inverse",
} as const;

export type ChipTone = keyof typeof chipTones;

/**
 * The class shape, exported for the ONE case that cannot use `Chip` itself: a tab toggle is a real
 * `<button>` carrying `role="tab"`, its own ref and a roving tabindex, and wrapping a span in it
 * would put the border on the span while the focus ring landed on the button. See ServiceTabs.
 * Nothing else may reach for this — a new chip shape is a tone here, not a class at a call site.
 */
export function chipClasses(tone: ChipTone = "quiet"): string {
  return cx(chipBase, chipTones[tone]);
}

/** A static chip. For the interactive one, see the note on `chipClasses` above. */
export function Chip({ children, tone = "quiet" }: { children: ReactNode; tone?: ChipTone }) {
  return <span className={chipClasses(tone)}>{children}</span>;
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
