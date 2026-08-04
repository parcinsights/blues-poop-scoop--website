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
  /**
   * Residential and Commercial, side by side, because that is the one fork a visitor makes before
   * anything else on this site is relevant to them: my yard, or the grounds I manage.
   *
   * This is NOT the old "Residential" menu the note above describes. That one listed the two
   * frequencies and duplicated Services; this is a single link to a single page, and the frequencies
   * are still a price on it rather than a choice in a nav bar.
   */
  { label: "Residential", href: routes.residential() },
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
      // Same destination as "Contact" in the column to the right, and deliberately kept: they are
      // two different intents — "give me a price" and "let me reach a person" — that now land on
      // one page, and a footer that only answers one of them loses the other's scan path.
      { label: "Get a free quote", href: routes.contact() },
      // The same fork the header makes, kept together for the same reason.
      { label: "Residential", href: routes.residential() },
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

/**
 * The one primary conversion action, referenced by every CTA on the site.
 *
 * It points at /contact/, and since 2026-08-02 so does every other CTA — the header's, the
 * commercial one, the footer's quote link. There used to be two quote pages and therefore two
 * answers to "where does a button go"; there is now one page, one form, and one destination. See
 * lib/routes.ts.
 */
export const primaryCta = {
  label: "Get started now",
  href: routes.contact(),
} as const;

/**
 * The phone CTA's words. The number itself is not what sells the click — the header already
 * carries it — so the button sells the two ways to reach us instead, text being the one most
 * people actually use. Every phone button on the site says this; the number rides along in the
 * accessible name.
 */
export const phoneCtaLabel = "Call/text us now";

/**
 * The header's own button. Same destination as `primaryCta` now that there is only one, and a
 * different LABEL on purpose: the header follows someone who has read nothing yet, so it makes the
 * lower-commitment ask — talk to a person — where an in-page CTA, which catches a visitor who has
 * just read a pricing table, asks for the quote outright.
 */
export const headerCta = {
  label: "Get in touch",
  href: routes.contact(),
} as const;

/**
 * /commercial/'s ask. A third set of words for the same page, and a different visitor: a property
 * manager cannot answer "how many dogs do you have" about a 200-unit community, so the button
 * offers the walkthrough that actually starts a commercial sale rather than the residential quote.
 */
export const consultationCta = {
  label: "Get a free property consultation",
  href: routes.contact(),
} as const;
