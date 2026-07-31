/**
 * The single source of truth for who this business is.
 *
 * The NAP block (name, address, phone) must match the Google Business Profile CHARACTER FOR
 * CHARACTER. Inconsistent NAP across a website, a GBP, and directory listings is one of the
 * few genuinely well-evidenced local ranking problems, and it is free to get right.
 *
 * Facts supplied by the client 2026-07-31. Anything still wrapped in todo() is outstanding and
 * will fail a production build rather than ship as a guess.
 */

import { todo } from "./todo";
import type { OpeningHours } from "./types";

export const site = {
  /** Trading name. Exactly as it appears on the Google Business Profile. */
  name: "Blue's Poop Scoop",
  legalName: "Blue's Poop Scoop",
  /** Their own headline, from the current site. Their words beat ours. */
  tagline: "More than just a poop scoop service",

  /** The owner. Named on the site because a name outperforms "our team" in a local trade. */
  owner: "George",

  /**
   * SERVICE-AREA BUSINESS. The owner works out of a home address, so no street address is
   * rendered anywhere on the site and none is published in structured data. This must match how
   * the Google Business Profile is configured — a GBP with a hidden address and a website
   * publishing that address is a mismatch that can cost the listing.
   */
  serviceAreaBusiness: true,
  baseCity: "Philadelphia",
  baseRegion: "PA",

  phone: {
    /** E.164, for tel: links and structured data. */
    e164: "+16104100506",
    /** ONE display format, used everywhere. */
    display: "(610) 410-0506",
  },
  email: "bluespoopscoop@gmail.com",

  foundedYear: todo(2021),

  /**
   * OUTSTANDING — real hours needed. These are a placeholder and will fail a production build.
   * They feed `openingHoursSpecification` in structured data and must match the GBP exactly.
   */
  hours: todo([
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
    { days: ["Sunday"], closed: true },
  ] satisfies OpeningHours[]),

  /**
   * Every profile the business genuinely owns. Feeds schema `sameAs`, which is how a search
   * engine connects this site to the GBP and the Yelp listing as one entity.
   */
  profiles: {
    googleBusiness: todo("https://www.google.com/maps/place/?q=place_id:TODO"),
    yelp: "https://www.yelp.com/biz/blues-poop-scoop-philadelphia",
    facebook: todo(""),
    instagram: todo(""),
  },

  /** Analytics identifiers. Empty until the properties exist (phase 7). */
  analytics: {
    ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  },
} as const;

/**
 * Every owned profile URL, with blanks and placeholders dropped — for schema `sameAs`.
 * An empty or fake URL in `sameAs` is worse than an absent one: it asserts an identity link
 * to something that does not exist.
 */
export const sameAs: string[] = (Object.values(site.profiles) as string[]).filter(
  (url) => url.length > 0 && !url.includes("TODO"),
);
