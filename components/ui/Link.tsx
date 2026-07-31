import NextLink from "next/link";
import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

/**
 * THE link. Every anchor on the site that is not a `Button` is this component.
 *
 * It decides two things nobody should be deciding at the call site:
 *
 * 1. **Which element.** Internal routes render `next/link` so they prefetch and navigate client-
 *    side; `tel:`, `mailto:`, and off-site URLs render a plain `<a>`, because routing them through
 *    the app router is wrong and, for `tel:`, actively broken.
 * 2. **Whether `rel` is needed.** An off-site link opened in a new tab gets
 *    `rel="noopener noreferrer"`, always. That is a security property, not a style choice, and it
 *    is exactly the sort of thing that gets forgotten on the one link that matters.
 *
 * Variants exist because a link inside a paragraph and a link in the footer are different things:
 * an underline in body copy is what makes the link findable, and the same underline repeated down
 * a column of twelve navigation items is just noise.
 */

export type LinkVariant = "inline" | "nav" | "quiet";

const variants: Record<LinkVariant, string> = {
  // Underlined and brand-coloured — the base.css default, so it needs no classes of its own.
  inline: "",
  // Navigation: no underline, ink-coloured, weighted so it reads as a control.
  nav: "no-underline text-ink font-semibold",
  // Footer and other lists: no underline, inherits the surrounding colour.
  quiet: "no-underline text-inherit",
};

/** `true` for anything that leaves the app router: another origin, a phone number, an email. */
function isExternalHref(href: string): boolean {
  return !href.startsWith("/") && !href.startsWith("#");
}

/** `true` only for hrefs that open a real web page elsewhere — not `tel:` or `mailto:`. */
function isOffSiteUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function Link({
  href,
  variant = "inline",
  size,
  weight,
  block = false,
  newTab,
  ariaLabel,
  ariaCurrent,
  children,
}: {
  href: string;
  variant?: LinkVariant;
  size?: "small" | "caption";
  /** Weight the link up without borrowing `nav`'s colour — the footer phone number. */
  weight?: "semibold";
  /** Fill the width of the container, so the whole row is a click target in a stacked list. */
  block?: boolean;
  /**
   * Open elsewhere. Defaults to `true` for off-site URLs and `false` for our own pages — do not
   * set it on an internal link, which should never steal a tab from the visitor.
   */
  newTab?: boolean;
  /** Use when the visible text alone is not a description — "Read more", a bare phone number. */
  ariaLabel?: string;
  /** `"page"` on the nav item matching the current route. */
  ariaCurrent?: "page" | "true";
  children: ReactNode;
}) {
  const classes =
    cx(
      variants[variant],
      size === "small" && "text-small",
      size === "caption" && "text-caption",
      weight === "semibold" && "font-semibold",
      block && "block",
    ) || undefined;

  const opensNewTab = newTab ?? isOffSiteUrl(href);

  if (isExternalHref(href)) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={opensNewTab ? "_blank" : undefined}
        rel={opensNewTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} aria-label={ariaLabel} aria-current={ariaCurrent}>
      {children}
    </NextLink>
  );
}
