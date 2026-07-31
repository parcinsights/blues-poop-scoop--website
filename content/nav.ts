/**
 * Site navigation. Header and footer link structure, in one place.
 *
 * Every href comes from `routes`, so a URL change cannot leave a nav link pointing at a 404.
 */

import { routes } from "@/lib/routes";
import type { NavLink } from "./types";

export const headerNav: NavLink[] = [
  { label: "Services", href: routes.services() },
  { label: "Areas We Serve", href: routes.locations() },
  { label: "Pricing", href: routes.pricing() },
  { label: "FAQ", href: routes.faq() },
  { label: "About", href: routes.about() },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Services",
    links: [
      { label: "Weekly Scooping", href: routes.service("weekly-scooping") },
      { label: "Twice-Weekly Scooping", href: routes.service("twice-weekly-scooping") },
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
