/**
 * Site navigation. Header and footer link structure, in one place.
 *
 * Every href comes from `routes`, so a URL change cannot leave a nav link pointing at a 404.
 */

import { routes } from "@/lib/routes";
import type { NavGroup, NavLink } from "./types";

/**
 * The header, split the way a customer decides rather than the way the site is filed: a homeowner
 * and a property manager want different things, so those are the first two items, and everything
 * else sits under a group instead of stretching the bar into eight links nobody reads.
 *
 * "Residential" has no page of its own — it is a menu label. See `NavGroup` in ./types.
 */
export const headerNav: NavGroup[] = [
  {
    label: "Residential",
    children: [
      { label: "Weekly Scooping", href: routes.service("weekly-scooping") },
      { label: "Bi-Weekly Scooping", href: routes.service("biweekly-scooping") },
      { label: "One-Time Cleanup", href: routes.service("one-time-cleanup") },
      { label: "Pricing", href: routes.pricing() },
    ],
  },
  { label: "Commercial", href: routes.commercial() },
  {
    label: "About",
    href: routes.about(),
    children: [
      { label: "About Us", href: routes.about() },
      { label: "Areas We Serve", href: routes.locations() },
      { label: "FAQ", href: routes.faq() },
    ],
  },
  { label: "Services", href: routes.services() },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Weekly Scooping", href: routes.service("weekly-scooping") },
      { label: "Bi-Weekly Scooping", href: routes.service("biweekly-scooping") },
      { label: "One-Time Cleanup", href: routes.service("one-time-cleanup") },
      { label: "Commercial", href: routes.commercial() },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: routes.about() },
      { label: "Pricing", href: routes.pricing() },
      { label: "FAQ", href: routes.faq() },
      { label: "Contact", href: routes.contact() },
    ],
  },
];

/** The one primary conversion action, referenced by every CTA on the site. */
export const primaryCta = {
  label: "Get a free quote",
  href: routes.getStarted(),
} as const;

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
