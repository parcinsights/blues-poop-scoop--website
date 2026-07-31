/**
 * What the business sells. One entry = one page at /services/[slug]/.
 *
 * CORRECTION, 2026-07-31: the second plan is BI-weekly (every other week), not twice-weekly. The
 * scaffold had it backwards, and the two mean opposite things — one is 26 visits a year and the
 * other is 104. Client pricing confirms every-other-week.
 *
 * `hasCityPages` decides which services also generate /locations/[city]/[service]/ money pages —
 * the pages that catch local intent ("dog poop removal ardmore pa"). Only the two recurring plans
 * have them. Generating every service × every city is how a doorway network appears by accident.
 */

import { todo } from "./todo";
import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "weekly-scooping",
    name: "Weekly Scooping",
    heading: "Weekly dog poop removal",
    summary: "One visit every week. From $100 a month for one or two dogs.",
    seo: {
      title: "Weekly Dog Poop Removal | Philadelphia & the Main Line",
      description:
        "Weekly pooper scooper service across Chestnut Hill, Mt. Airy, Ardmore, Bryn Mawr and more. $100 a month for one or two dogs.",
    },
    body: [],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "biweekly-scooping",
    name: "Bi-Weekly Scooping",
    heading: "Every-other-week dog poop removal",
    summary: "One visit every other week. From $70 a month for one or two dogs.",
    seo: {
      title: "Bi-Weekly Dog Poop Removal | Philadelphia & the Main Line",
      description:
        "Every-other-week pet waste removal across Chestnut Hill, Mt. Airy, Ardmore, Bryn Mawr and more. $70 a month for one or two dogs.",
    },
    body: [],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "one-time-cleanup",
    // OUTSTANDING: no price supplied, and it is unclear whether a first-time deep clean is
    // required when starting a recurring plan. Both are needed before this page can ship.
    name: todo("One-Time Cleanup"),
    heading: todo("One-time yard cleanup"),
    summary: todo("A single deep clean — for move-outs, spring thaw, or before company arrives."),
    seo: {
      title: todo("One-Time Yard Cleanup for Dog Waste | Blue's Poop Scoop"),
      description: todo(
        "A single deep clean of a backyard that has gotten away from you. Philadelphia and the Main Line.",
      ),
    },
    body: [],
    hasCityPages: false,
    segment: "residential",
  },
  {
    slug: "commercial",
    // OUTSTANDING: the current site lists commercial as "Coming Soon". If they have never done a
    // commercial job, this page can offer the service but must not imply evidence of one.
    name: todo("Commercial Service"),
    heading: todo("Pet waste removal for properties and communities"),
    summary: todo("Apartment communities, HOAs, and dog parks on a schedule that fits the property."),
    seo: {
      title: todo("Commercial Pet Waste Removal | HOAs & Apartments | Blue's Poop Scoop"),
      description: todo(
        "Scheduled pet waste removal and station servicing for apartment communities, HOAs and dog parks around Philadelphia.",
      ),
    },
    body: [],
    hasCityPages: false,
    segment: "commercial",
  },
];

export const serviceBySlug = new Map(services.map((service) => [service.slug, service]));

export const residentialServices = services.filter((s) => s.segment === "residential");

/** Only these get city×service pages. See the note at the top of this file. */
export const cityPageServices = services.filter((s) => s.hasCityPages);
