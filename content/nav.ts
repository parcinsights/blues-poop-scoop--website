/**
 * Site navigation. Header and footer link structure, in one place.
 *
 * Every href comes from `routes`, so a URL change cannot leave a nav link pointing at a 404.
 */

import { routes } from "@/lib/routes";
import type { NavGroup, NavLink } from "./types";

/**
 * The header, split the way a customer decides rather than the way the site is filed.
 *
 * "Services" is ONE dropdown: the core service first, then the three extras. It replaced an
 * earlier "Residential" menu that listed the two frequencies (weekly, bi-weekly) alongside a
 * separate "Services" link — two menus covering the same ground, with One-Time appearing in both.
 *
 * The frequency pages are gone entirely as of 2026-08-01 (see the note in content/services.ts).
 * Weekly and every-other-week are two prices for one job, and the Poop Scoop page carries both —
 * a visitor who has not read anything yet does not know which they want, and a nav is the wrong
 * place to make them choose.
 *
 * Every item here has a page behind it, so there is no menu-label-only group at present. The
 * `href`-less shape is still supported — see `NavGroup` in ./types.
 */
export const headerNav: NavGroup[] = [
  {
    label: "Services",
    href: routes.services(),
    children: [
      { label: "Poop Scoop", href: routes.service("poop-scoop") },
      // The three add-ons, in the order they get sold: the extra everyone asks about first, then
      // the one that changes what happens to the waste, then the one-off.
      { label: "Deodorizer", href: routes.service("deodorizer") },
      { label: "Haul Away", href: routes.service("haul-away") },
      { label: "One-Time Cleans", href: routes.service("one-time-cleanup") },
    ],
  },
  { label: "Pricing", href: routes.pricing() },
  { label: "Commercial", href: routes.commercial() },
  { label: "Reviews", href: routes.reviews() },
  {
    label: "About",
    href: routes.about(),
    children: [
      { label: "About Us", href: routes.about() },
      { label: "Blog", href: routes.blog() },
      { label: "Areas We Serve", href: routes.locations() },
      { label: "FAQ", href: routes.faq() },
      // Hiring sits under About rather than in the bar: it is a page for one visitor in a
      // hundred, and a top-level "Opportunities" spends bar width on them at the cost of everyone
      // else. It is still one hop from every page.
      { label: "Opportunities", href: routes.opportunities() },
    ],
  },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    // The whole menu, in the order it is sold: the plan, then the three things bought alongside
    // it. Same four items as the header dropdown — the footer is the fallback for someone who has
    // scrolled past the bar, not a second, different menu.
    heading: "Services",
    links: [
      { label: "Poop Scoop", href: routes.service("poop-scoop") },
      { label: "Deodorizer", href: routes.service("deodorizer") },
      { label: "Haul Away", href: routes.service("haul-away") },
      { label: "One-Time Cleans", href: routes.service("one-time-cleanup") },
    ],
  },
  {
    // Commercial sits here rather than under "Services": it is a different buyer on a different
    // page, and putting it in the residential list invites a homeowner to click it.
    heading: "Get a quote",
    links: [
      { label: "Pricing", href: routes.pricing() },
      { label: "Get a free quote", href: routes.getStarted() },
      { label: "Commercial", href: routes.commercial() },
      { label: "Areas We Serve", href: routes.locations() },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: routes.about() },
      { label: "Reviews", href: routes.reviews() },
      { label: "Blog", href: routes.blog() },
      { label: "FAQ", href: routes.faq() },
      { label: "Opportunities", href: routes.opportunities() },
      { label: "Contact", href: routes.contact() },
    ],
  },
];

/** The one primary conversion action, referenced by every CTA on the site. */
export const primaryCta = {
  label: "Get my free quote",
  href: routes.getStarted(),
} as const;

/**
 * The phone CTA's words where the number itself is not what sells the click — the hero, which
 * already carries the number in the header above it. The dark CTA band still spells the number
 * out, because by then the visitor has read the page and is dialling rather than deciding.
 */
export const phoneCtaLabel = "Call us now";

/**
 * The header's own button, deliberately NOT `primaryCta`.
 *
 * The in-page CTAs ask for the quote form, because a visitor who has just read a pricing table is
 * ready to fill one in. The header follows someone who has read nothing yet, so it offers the
 * lower-commitment ask — talk to a person — and points at /contact/ instead.
 */
export const headerCta = {
  label: "Get in touch",
  href: routes.contact(),
} as const;
