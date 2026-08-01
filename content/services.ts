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
    // The umbrella page for the core service, and the one the header points at. Weekly and
    // bi-weekly below are FREQUENCIES of this work, and they keep their own pages because they
    // carry the city money-pages and match how people search ("weekly dog poop removal"). This
    // page's job is different: it explains the work itself and hands the visitor off to whichever
    // frequency fits. It must not restate their copy — two pages about scooping that say the same
    // thing compete with each other.
    slug: "poop-scoop",
    name: "Poop Scoop",
    heading: "Dog poop removal, done right",
    // OUTSTANDING: this needs George's actual routine — the sweep pattern, what he does with a
    // gate left unlatched, where the waste goes. The summary below is a placeholder shape.
    summary: todo("Regular yard scooping on a schedule that suits you. Weekly or every other week."),
    seo: {
      title: todo("Dog Poop Removal & Pooper Scooper Service | Blue's Poop Scoop"),
      description: todo(
        "Regular dog poop removal across Philadelphia and the Main Line. Weekly or every-other-week visits, from $70 a month.",
      ),
    },
    body: [],
    // The frequency pages own the local intent. Generating a third set for the umbrella would put
    // three near-identical pages per town in the index, competing for the same query.
    hasCityPages: false,
    segment: "residential",
  },
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
    name: todo("One-Time Cleans"),
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
    // Sold both ways: on its own for a yard that has gotten away from someone, and as the first
    // visit on a new plan. That is why it appears under add-ons in the menu but still reads as a
    // standalone service on its own page.
    addOn: true,
  },
  {
    slug: "deodorizer",
    // OUTSTANDING: needs the product used, whether it is pet- and lawn-safe (the first question
    // every customer asks), the coverage area per treatment, and the price.
    name: todo("Deodorizer"),
    heading: todo("Yard deodorizing treatment"),
    summary: todo("An add-on treatment that neutralizes odor after the yard is cleared."),
    seo: {
      title: todo("Yard Deodorizer Treatment | Blue's Poop Scoop"),
      description: todo(
        "A pet-safe deodorizing treatment added to any scooping visit. Philadelphia and the Main Line.",
      ),
    },
    body: [],
    hasCityPages: false,
    segment: "residential",
    addOn: true,
  },
  {
    slug: "haul-away",
    // OUTSTANDING: the key fact is what this actually removes — waste taken off-site rather than
    // left in the customer's own bin — plus the price and whether it is per visit or monthly.
    name: todo("Haul Away"),
    heading: todo("We take the waste with us"),
    summary: todo("An add-on that removes the waste from your property instead of leaving it in your bin."),
    seo: {
      title: todo("Pet Waste Haul Away Service | Blue's Poop Scoop"),
      description: todo(
        "Add haul-away to any plan and the waste leaves with us — nothing sits in your trash can between pickups.",
      ),
    },
    body: [],
    hasCityPages: false,
    segment: "residential",
    addOn: true,
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

/** The plans someone buys on their own — what the services index leads with. */
export const coreServices = residentialServices.filter((s) => !s.addOn);

/** The extras bought alongside a plan. Shown as a second, quieter group. */
export const addOnServices = residentialServices.filter((s) => s.addOn);

/** Only these get city×service pages. See the note at the top of this file. */
export const cityPageServices = services.filter((s) => s.hasCityPages);
