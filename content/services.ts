/**
 * What the business sells. One entry = one page at /services/[slug]/.
 *
 * `hasCityPages` decides which services also generate /locations/[city]/[service]/ money pages —
 * the pages that actually catch local intent ("dog poop removal ardmore pa"). Only the core
 * recurring service should have them; generating every service × every city is how a 90-page
 * doorway network appears by accident.
 *
 * Service names are placeholders until the client confirms what THEY call this work. Their words
 * beat our words: it is what their customers already say back to them on the phone.
 */

import { todo } from "./todo";
import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "weekly-scooping",
    name: todo("Weekly Scooping"),
    heading: todo("Weekly dog poop removal"),
    summary: todo("We show up on the same day every week and leave the yard clean."),
    seo: {
      title: todo("Weekly Dog Poop Removal Service | Blue's Poop Scoop"),
      description: todo(
        "Same-day-every-week pooper scooper service across Philadelphia and the Main Line. Flat monthly rate, no contracts.",
      ),
    },
    body: [],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "twice-weekly-scooping",
    name: todo("Twice-Weekly Scooping"),
    heading: todo("Twice-weekly dog poop removal"),
    summary: todo("For multi-dog homes and smaller yards that fill up fast."),
    seo: {
      title: todo("Twice-Weekly Pooper Scooper Service | Blue's Poop Scoop"),
      description: todo(
        "Two visits a week for multi-dog households in Philadelphia and the Main Line. Flat monthly rate.",
      ),
    },
    body: [],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "one-time-cleanup",
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
