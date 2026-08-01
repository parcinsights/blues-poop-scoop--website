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

// ── Section ──────────────────────────────────────────────────────────────────

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
  tone?: "default" | "alt" | "brand" | "canvas" | "dark";
  spacing?: "sm" | "md" | "lg";
  as?: ElementType;
  id?: string;
}) {
  const tones = {
    default: "bg-surface text-ink",
    alt: "bg-surface-alt text-ink",
    brand: "bg-brand-tint text-ink",
    // The house off-white. See --color-canvas in theme.css.
    canvas: "bg-canvas text-ink",
    dark: "bg-surface-dark text-ink-inverse",
  } as const;

  const spacings = {
    sm: "py-10 md:py-14",
    md: "py-14 md:py-20",
    lg: "py-20 md:py-28",
  } as const;

  return (
    <Tag id={id} className={cx(tones[tone], spacings[spacing])}>
      {children}
    </Tag>
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
