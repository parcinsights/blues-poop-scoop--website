import type { ElementType, ReactNode } from "react";

import { cx } from "@/lib/cx";

/**
 * Layout primitives. These own ARRANGEMENT — width, rhythm, and alignment — and nothing else.
 * They hold no color, no type size, and no business meaning.
 *
 * The reason they exist: without them, every page reinvents `mx-auto max-w-… px-…` slightly
 * differently, and a site ends up with five container widths nobody chose.
 */

// ── Container ────────────────────────────────────────────────────────────────

export function Container({
  children,
  width = "page",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** `prose` is the readable measure for long-form text — roughly 70 characters. */
  width?: "page" | "prose";
  as?: ElementType;
}) {
  return (
    <Tag
      className={cx(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        width === "page" ? "max-w-page" : "max-w-prose",
      )}
    >
      {children}
    </Tag>
  );
}

// ── Split ────────────────────────────────────────────────────────────────────

/**
 * Text on the left, a picture that runs off the right edge of the screen on the right.
 *
 * It replaces `Container` rather than sitting inside one — a Container would stop the picture at
 * the page width, and stopping it there is the whole thing this exists to avoid.
 *
 * The alignment is not approximate. The text box is capped at `max-w-page-half` and pushed to the
 * right of a half-viewport column, which puts its left edge at `(100vw - page) / 2` — the same
 * line `Container` sits on, so the h1 here and the h2 of the section below it stack flush. Under
 * `lg` the two collapse to one column and the box behaves exactly like a Container.
 *
 * That is also why there is NO column gap at `lg`: a gap narrows each column by half its width and
 * drags the text box off the container line by that much. The air between the words and the
 * picture is `pr-16` on the text column instead, which leaves the midline — and the alignment —
 * untouched.
 *
 * `media` is a separate prop rather than a second child so the stacking order on a phone is fixed
 * here — words first, picture second — and cannot be got wrong at a call site.
 */
export function Split({ children, media }: { children: ReactNode; media: ReactNode }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-0">
      <div className="mx-auto w-full max-w-page px-5 sm:px-6 lg:mr-0 lg:max-w-page-half lg:pl-8 lg:pr-16">
        {children}
      </div>
      {/* `self-stretch` hands the picture the row's height; the floor keeps it from going letterbox
          when the text beside it is short. */}
      <div className="lg:min-h-160 lg:self-stretch">{media}</div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

/**
 * The surfaces a band can take. Shared by `Section` and `SectionDivider` — a divider has to be able
 * to paint the same colour as the two bands it sits between, or it shows up as a stripe.
 */
const sectionTones = {
  default: "bg-surface text-ink",
  alt: "bg-surface-alt text-ink",
  brand: "bg-brand-tint text-ink",
  // The house off-white. See --color-canvas in theme.css.
  canvas: "bg-canvas text-ink",
  /**
   * Plain white — the one band with no cream in it. It is the page taking a breath, so use it
   * where the content itself carries the colour (the review wall's cream cards) rather than as a
   * general-purpose alternate. Cards inside it must NOT be `tone="default"`: white on white is
   * an invisible card. See `Card tone="tint"`.
   */
  raised: "bg-surface-raised text-ink",
  dark: "bg-surface-dark text-ink-inverse",
} as const;

export type SectionTone = keyof typeof sectionTones;

/**
 * One band of the page. `tone` selects a surface — alternating bands are how a long landing page
 * stays readable without a border on everything.
 */
export function Section({
  children,
  tone = "default",
  spacing = "md",
  as: Tag = "section",
  id,
}: {
  children: ReactNode;
  tone?: SectionTone;
  spacing?: "none" | "sm" | "md" | "lg" | "lg-tight-top" | "hero" | "hero-media";
  as?: ElementType;
  id?: string;
}) {
  const tones = sectionTones;

  const spacings = {
    /**
     * No padding at all. For a band that IS one object — a photograph, a rule — where the air
     * around it belongs to whatever sits above and below rather than to the object itself.
     *
     * It still has to be a `<section>`, and that is the reason this exists rather than the block
     * simply rendering a bare element: `main` is pulled up by the height of the header and the
     * FIRST SECTION gives that row back as a transparent top border (see base.css). Anything else
     * at the top of a page slides under the bar.
     */
    none: "",
    sm: "py-10 md:py-14",
    md: "py-14 md:py-20",
    lg: "py-20 md:py-28",
    /**
     * `lg`, with the top half taken back on a phone. Use it where the band's own first element is
     * a photograph: the picture carries its own visual weight, so a full `pt-20` above it on a
     * narrow screen is dead space you have to scroll past before anything starts.
     */
    "lg-tight-top": "pt-10 pb-20 md:py-28",
    /**
     * The FIRST band of a page, sitting directly under the header. Asymmetric on purpose: the
     * header already supplies the air above, so a symmetric `lg` reads as a gap rather than as
     * breathing room and pushes the h1 below the fold on a laptop. Bottom stays full-size,
     * because the band below it has nothing overlapping to borrow from.
     */
    hero: "pt-6 pb-20 md:pt-10 md:pb-28",
    /**
     * The hero WITH a photograph. Same top, but no bottom padding at all while the layout is
     * stacked: the picture is the end of the band, and a strip of cream under it reads as a gap
     * rather than as spacing. The bottom padding returns at `lg`, which is exactly where `Split`
     * puts the picture beside the words instead of under them.
     */
    "hero-media": "pt-6 pb-0 md:pt-10 lg:pb-28",
  } as const;

  return (
    <Tag id={id} className={cx(tones[tone], spacings[spacing])}>
      {children}
    </Tag>
  );
}

// ── Section divider ──────────────────────────────────────────────────────────

/**
 * A hairline between two bands of the SAME tone, drawn to the container width rather than to the
 * edge of the screen.
 *
 * It exists because a tone change is the site's normal way of ending a band, and two white bands in
 * a row have none — the seam between them reads as one enormous section. A full-bleed rule would
 * say something different again: it would cut the page in half. This one starts and stops on the
 * same line the words above and below it do, so it reads as punctuation inside one page.
 *
 * `tone` must match its neighbours, and it carries the colour itself rather than sitting on a
 * transparent background: the divider is a band of its own in the flow, and an unpainted one shows
 * up as a stripe of whatever is behind the page.
 */
export function SectionDivider({ tone = "default" }: { tone?: SectionTone }) {
  return (
    <div className={sectionTones[tone]}>
      <Container>
        {/* Styled in base.css — a bare `hr` is already a `--color-line` hairline. */}
        <hr />
      </Container>
    </div>
  );
}

// ── Stack ────────────────────────────────────────────────────────────────────

/** Vertical rhythm. Replaces `space-y-*` scattered through pages. */
export function Stack({
  children,
  gap = 4,
  align,
  as: Tag = "div",
}: {
  children: ReactNode;
  gap?: 2 | 3 | 4 | 5 | 6 | 8 | 10;
  align?: "start" | "center";
  as?: ElementType;
}) {
  const gaps = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    5: "gap-5",
    6: "gap-6",
    8: "gap-8",
    10: "gap-10",
  } as const;

  return (
    <Tag
      className={cx(
        "flex flex-col",
        gaps[gap],
        align === "center" && "items-center text-center",
        align === "start" && "items-start",
      )}
    >
      {children}
    </Tag>
  );
}

// ── Cluster ──────────────────────────────────────────────────────────────────

/** Horizontal group that wraps rather than overflows. Button rows, tag lists, footer links. */
export function Cluster({
  children,
  gap = 3,
  justify = "start",
}: {
  children: ReactNode;
  gap?: 2 | 3 | 4 | 6;
  justify?: "start" | "center" | "between";
}) {
  const gaps = { 2: "gap-2", 3: "gap-3", 4: "gap-4", 6: "gap-6" } as const;
  const justifies = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
  } as const;

  return (
    <div className={cx("flex flex-wrap items-center", gaps[gap], justifies[justify])}>
      {children}
    </div>
  );
}

// ── Grid ─────────────────────────────────────────────────────────────────────

export function Grid({
  children,
  columns = 3,
  gap = 6,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  gap?: 4 | 6 | 8;
}) {
  const cols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  } as const;
  const gaps = { 4: "gap-4", 6: "gap-6", 8: "gap-8" } as const;

  return <div className={cx("grid", cols[columns], gaps[gap])}>{children}</div>;
}

// ── Prose ────────────────────────────────────────────────────────────────────

/** Wraps authored long-form content so vertical rhythm applies without per-element classes. */
export function Prose({ children, width = "prose" }: { children: ReactNode; width?: "page" | "prose" }) {
  return <div className={cx("prose", width === "prose" && "max-w-prose")}>{children}</div>;
}
