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

  /**
   * WHAT THE BUSINESS IS, in three words, sitting under the wordmark in the header lockup.
   *
   * Client-supplied 2026-08-06, and it is doing a real job rather than decorating the logo: "Blue's
   * Poop Scoop" is a name that could belong to a groomer, a dog walker or a boarding kennel, and a
   * visitor who lands on an inner page from search has nothing else above the fold that says which.
   * It is deliberately the generic trade term and not `tagline` — a slogan is a claim, and this
   * slot needs a category.
   */
  descriptor: "Pet Waste Removal",

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
   *
   * Client-supplied 2026-08-07 and no longer placeholders — the social icon row in the header and
   * footer renders straight off this record, and a production build no longer throws on it.
   */
  profiles: {
    /**
     * A `share.google` SHORTENER, exactly as the client sent it, and it works: it 302s to the
     * business on Google Maps.
     *
     * TWO THINGS WORTH KNOWING before anyone tidies this up.
     *
     * First, it resolves to a REVIEW url — the "leave us a review" flow rather than the profile
     * page. That may well be deliberate, and it is a fine destination for a Google icon on a
     * service business. It is worth confirming it is what George wants, because a visitor clicking
     * the Google mark expecting hours and directions lands on a review form instead.
     *
     * Second, a shortener is the weaker form for `sameAs`. Entity matching wants the canonical URL,
     * and a redirect is one more hop that can rot. The canonical form is derivable — the redirect
     * carries the CID `0x8e2c21ab21bea186`, which in decimal is
     * https://www.google.com/maps?cid=10244600271250301318 — but that has NOT been opened and
     * confirmed to be this business, and Maps renders in JavaScript so it cannot be checked from a
     * script. Open it once, and if it is Blue's Poop Scoop, swap this line for it.
     */
    googleBusiness: "https://share.google/nAiNmQYW0HSiAIPAk",
    yelp: "https://www.yelp.com/biz/blues-poop-scoop-philadelphia",
    facebook: "https://www.facebook.com/profile.php?id=61579027144315",
    instagram: "https://www.instagram.com/bluespoopscoop/",
    tiktok: "https://www.tiktok.com/@blues.poop.scoop",
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

/**
 * The four profiles that get an ICON, in the order the client named them — header row and footer
 * row alike, so the two can never fall out of step.
 *
 * It is deliberately NOT `Object.values(site.profiles)`. Yelp is a real owned profile and belongs
 * in `sameAs`, but it is not one of the four the client asked to show, and a fifth icon nobody
 * asked for is the kind of thing that quietly appears in a footer and stays for years.
 *
 * `label` is the accessible name, and it names the PLACE rather than the network — "Blue's Poop
 * Scoop on Instagram" is what a screen reader should say, because four links called "Instagram",
 * "TikTok", "Facebook" and "Google" in a row tell you the networks and not whose they are.
 *
 * All four are real as of 2026-08-07. The `.filter` below is kept anyway: it is what makes adding a
 * fifth network — or temporarily blanking one — a one-line change rather than a component edit.
 */
export const socialProfiles: { id: string; label: string; url: string }[] = [
  { id: "instagram", label: `${site.name} on Instagram`, url: site.profiles.instagram },
  { id: "tiktok", label: `${site.name} on TikTok`, url: site.profiles.tiktok },
  { id: "facebook", label: `${site.name} on Facebook`, url: site.profiles.facebook },
  { id: "google", label: `${site.name} on Google`, url: site.profiles.googleBusiness },
].filter((profile) => profile.url.length > 0);
