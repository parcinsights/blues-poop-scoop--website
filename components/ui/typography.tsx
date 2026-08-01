import { Fragment, type ElementType, type ReactNode } from "react";

import { cx } from "@/lib/cx";

/**
 * Typography primitives. Every heading, paragraph, list, and quote on the site comes from here —
 * no page or block writes a raw `<h2>` or `<p>`.
 *
 * The point is not styling. app/base.css already styles bare `<h2>` and `<p>` correctly, and these
 * components emit no classes at all in their default form. The point is that *outline level* and
 * *visual size* stop being the same decision. A page that needs a smaller-looking section title
 * still has to nest correctly for screen readers and for Google, and `<Heading level={2}
 * size="h4">` says so out loud, where `<h4>` used because it "looked right" silently breaks the
 * document outline.
 *
 * Tone is the other reason: `text-ink-muted` was being retyped at 20 call sites, and a dark band
 * needs `text-ink-inverse` on every child. Both are now a prop with a fixed set of answers.
 */

// ── Shared vocabulary ────────────────────────────────────────────────────────

/** Which token colour the text takes. `inverse` is for the dark section band only. */
export type Tone = "default" | "muted" | "inverse" | "brand";

const tones: Record<Tone, string> = {
  default: "text-ink",
  muted: "text-ink-muted",
  inverse: "text-ink-inverse",
  brand: "text-brand",
};

// ── Heading ──────────────────────────────────────────────────────────────────

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** `display` is the oversized hero treatment — larger than h1, and only ever used on one. */
export type HeadingSize = "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const headingSizes: Record<HeadingSize, string> = {
  display: "text-display font-bold",
  h1: "text-h1 font-bold",
  h2: "text-h2 font-bold",
  h3: "text-h3 font-semibold",
  h4: "text-h4 font-semibold",
  h5: "text-h5 font-semibold",
  h6: "text-h6 font-semibold",
};

/**
 * HOUSE RULE — a heading that titles a whole section band is CENTRED ON MOBILE and left-aligned
 * from `md` up: `align="center-mobile"`. On a phone the band is one narrow column and a left-hung
 * title reads as the first line of the paragraph under it; centred, it reads as a title. On a
 * laptop the same centring would float the title away from the content it labels, so it snaps
 * back to the left edge.
 *
 * It is opt-in rather than the default for `level={2}` because plenty of h2s are not band titles —
 * the card headings on /services and /locations are `level={2} size="h4"` and must stay left.
 * Every NEW section band should pass it.
 */
const headingAligns = {
  start: "",
  center: "text-center",
  "center-mobile": "text-center md:text-left",
} as const;

export function Heading({
  level,
  size,
  tone,
  align = "start",
  id,
  children,
}: {
  /** The outline level. Exactly one `level={1}` per page; never skip a level going down. */
  level: HeadingLevel;
  /** Visual size, when it must differ from the level. Defaults to matching the level. */
  size?: HeadingSize;
  tone?: Tone;
  /** See the house rule above — section band titles take `center-mobile`. */
  align?: keyof typeof headingAligns;
  /** Set when something links to this heading — breadcrumbs, in-page anchors, `aria-labelledby`. */
  id?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as ElementType;

  // No size override and no tone override means no classes: base.css already styles the element.
  const overridesSize = size !== undefined && size !== (`h${level}` as HeadingSize);

  return (
    <Tag
      id={id}
      className={
        cx(overridesSize && headingSizes[size], tone && tones[tone], headingAligns[align]) ||
        undefined
      }
    >
      {children}
    </Tag>
  );
}

// ── Text ─────────────────────────────────────────────────────────────────────

export type TextSize = "lead" | "body" | "small" | "caption";

const textSizes: Record<TextSize, string> = {
  lead: "text-lead",
  body: "text-body",
  small: "text-small",
  caption: "text-caption",
};

/**
 * A paragraph. Renders `<p>` unless told otherwise — `as="span"` for text inside a `<figcaption>`
 * or a table cell, where a `<p>` would be wrong or invalid.
 */
export function Text({
  size,
  tone,
  weight,
  measure = false,
  as: Tag = "p",
  id,
  children,
}: {
  size?: TextSize;
  tone?: Tone;
  weight?: "normal" | "semibold";
  /** Cap the line length at the readable measure. Wanted on any paragraph in a full-width band. */
  measure?: boolean;
  as?: ElementType;
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={
        cx(
          size && size !== "body" && textSizes[size],
          tone && tones[tone],
          weight === "semibold" && "font-semibold",
          weight === "normal" && "font-normal",
          measure && "max-w-prose",
        ) || undefined
      }
    >
      {children}
    </Tag>
  );
}

// ── Eyebrow ──────────────────────────────────────────────────────────────────

/**
 * The small uppercase kicker above a heading. Deliberately not an `<h6>`: it is a label for the
 * heading that follows, not a level of its own, and putting it in the outline would mean every
 * section that has one reports a heading level it does not actually have.
 */
export function Eyebrow({ children, tone = "muted" }: { children: ReactNode; tone?: Tone }) {
  return (
    <p className={cx("text-caption font-semibold uppercase tracking-wide", tones[tone])}>
      {children}
    </p>
  );
}

// ── List ─────────────────────────────────────────────────────────────────────

/**
 * A bulleted or numbered list. `plain` drops the markers for lists that are really just stacked
 * lines — footer links, service-area names — where a bullet is visual noise.
 */
export function List({
  items,
  variant = "bullet",
  tone,
}: {
  items: readonly ReactNode[];
  variant?: "bullet" | "number" | "plain";
  tone?: Tone;
}) {
  const Tag: ElementType = variant === "number" ? "ol" : "ul";

  return (
    <Tag
      className={cx(variant === "plain" && "list-none pl-0", tone && tones[tone]) || undefined}
    >
      {items.map((item, index) => (
        // Items are plain content with no stable id of their own, and the list is static —
        // it is never reordered or filtered on the client, so the index is a safe key.
        <li key={index}>{item}</li>
      ))}
    </Tag>
  );
}

// ── InlineList ───────────────────────────────────────────────────────────────

/**
 * A short run of phrases on one line, separated by a dot — the reassurance strip under a CTA.
 *
 * Not a `<List>`: these are not items of anything, they are one sentence's worth of objections
 * answered, and marking them up as a list makes a screen reader announce "list, three items"
 * before reading three fragments. The dots are decorative and hidden for the same reason.
 */
export function InlineList({
  items,
  tone = "muted",
}: {
  items: readonly string[];
  tone?: Tone;
}) {
  return (
    <div className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-small", tones[tone])}>
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 && (
            <span aria-hidden="true" className="text-line-strong">
              •
            </span>
          )}
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}

// ── Quote ────────────────────────────────────────────────────────────────────

/**
 * A pulled quote with its attribution. `<figure>`/`<figcaption>` rather than a bare `<blockquote>`
 * plus a `<p>`, because the attribution is *about* the quote — the pairing is the whole point, and
 * this is the markup that says so.
 */
export function Quote({
  children,
  attribution,
  detail,
}: {
  children: ReactNode;
  /** Who said it. */
  attribution: string;
  /** Where they are, or anything else qualifying the name. */
  detail?: string;
}) {
  return (
    <figure className="flex flex-col gap-3 h-full">
      {/* base.css dresses a bare `blockquote` as a pulled quote in long-form prose — brand rule,
          grey italic. All three are undone here: this is a testimonial, not an aside, and italic
          grey is the styling of something the page is quoting *at* you rather than a customer's
          own words. The card and the star row already say "quote". */}
      <blockquote className="grow border-0 pl-0 not-italic text-ink">{children}</blockquote>
      <figcaption className="text-small font-semibold text-ink">
        {attribution}
        {detail && <span className="font-normal text-ink-muted">{` — ${detail}`}</span>}
      </figcaption>
    </figure>
  );
}
