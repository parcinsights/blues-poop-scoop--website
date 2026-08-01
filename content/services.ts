/**
 * What the business sells. One entry = one page at /services/[slug]/.
 *
 * FOUR services, and that is the whole menu: the scooping plan, and the three extras bought
 * alongside it. Commercial is listed last and is a different segment — it has its own top-level
 * page at /commercial/ and does not appear in the services menu.
 *
 * Every one of these renders through a SINGLE shared template (app/services/[service]/page.tsx) —
 * identical layout, identical styling, service to service. What differs is only what is written
 * here: the copy and the image keys. Read that file's header before adding a field.
 *
 * CORRECTION, 2026-08-01: weekly and bi-weekly are NOT separate services. They are two frequencies
 * of one job, and they used to have a page each — which meant two near-identical pages competing
 * for the same query, and a visitor being asked to choose a frequency before being told what the
 * service is. Both are now the Poop Scoop page, which explains the work once and offers the two
 * schedules inside it. The prices for both still live in content/pricing.ts and are shown together
 * in the pricing band, which is where a frequency is actually a decision.
 *
 * `hasCityPages` decides which services also generate /locations/[city]/[service]/ money pages —
 * the pages that catch local intent ("dog poop removal ardmore pa"). Only the core scooping plan
 * has them. Generating every service × every city is how a doorway network appears by accident.
 */

import { todo } from "./todo";
import type { Service } from "./types";

export const services: Service[] = [
  {
    /**
     * The core service, and the only one anyone searches for by itself. It absorbed the two
     * frequency pages (see the correction above), so it now owns both the "weekly dog poop
     * removal" and "every other week" intent as well as the local money-pages.
     */
    slug: "poop-scoop",
    name: "Poop Scoop",
    heading: "Dog poop removal, done right",
    summary:
      "Regular yard scooping, weekly or every other week. We text before we come and again when the yard is clear, double-bag everything, and never enter while your dog is outside.",
    seo: {
      title: "Dog Poop Removal & Pooper Scooper Service | Philadelphia",
      description:
        "Weekly or every-other-week dog poop removal across Chestnut Hill, Mt. Airy, Ardmore, Bryn Mawr and more. From $70 a month. No contracts.",
    },
    assurances: ["No contracts", "Cancel anytime", "We reply by text"],
    /**
     * Five promises, and every one is something the client has actually committed to — the
     * schedule, the double-bagging, the texts, the pet-safety policy, the no-contract terms. Not
     * one of them is a sentence a franchise site could not also write; what makes them worth
     * printing is that they are true here and someone will be held to them.
     *
     * OUTSTANDING, and this band is where they go the moment George supplies them: the sweep
     * pattern (does he do edges and fence lines, or open lawn only), what he does with a gate left
     * unlatched, and where the waste finally ends up. Those are the three details a competitor
     * cannot copy, and this list stays generic until they arrive.
     */
    includes: {
      heading: "What every visit includes",
      intro:
        "Two schedules, one standard of work. Whether we're out weekly or every other week, this is what happens each time we're in your yard.",
      items: [
        "A visit every week, or every other week — whichever suits your yard and your dogs.",
        "All waste collected and double-bagged, for sanitation and odor control.",
        "A text before we arrive, and another once the yard is clear.",
        "We never enter while your dog is outside. No exceptions, whatever the schedule says.",
        "No contract. Pause or cancel any time by text.",
      ],
    },
    /**
     * Four questions, and the first one is the one this page created by merging the frequency
     * pages: a visitor now has to pick a schedule here rather than by clicking a different page,
     * so the page has to help them do it. The answer refuses to guess which is right for them —
     * it removes the cost of guessing wrong instead, which is a fact rather than an opinion.
     */
    faq: [
      {
        question: "Weekly or every other week — which do I need?",
        answer:
          "You can switch between the two whenever you like, so it costs nothing to guess. There's no contract either way: start with whichever sounds closer and tell us by text if it turns out to be wrong.",
      },
      {
        question: "Do I need to be home?",
        answer:
          "For your first visit, yes — we'll need you home to walk us through the yard and sort out gate access. After that you're free to come and go. We text before and after every visit.",
      },
      {
        question: "What if my dog is outside when you arrive?",
        answer:
          "We coordinate around your dog's schedule and never enter while pets are out. If we turn up and your dog is in the yard, we'll text you rather than let ourselves in.",
      },
      {
        question: "What happens to the waste?",
        answer:
          "It's collected and double-bagged for sanitation and odor control. If you'd rather it left the property altogether instead of going in your bin, add Haul Away to your plan.",
      },
    ],
    body: [],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "deodorizer",
    // OUTSTANDING: needs the product used, whether it is pet- and lawn-safe (the first question
    // every customer asks), the coverage area per treatment, and the price. Until those land, this
    // page has no `includes` band — an add-on whose whole pitch is "it's safe around your dog"
    // cannot have that sentence invented for it.
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
    summary: todo(
      "An add-on that removes the waste from your property instead of leaving it in your bin.",
    ),
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

/** The plan someone buys on its own — what the services index leads with. */
export const coreServices = residentialServices.filter((s) => !s.addOn);

/** The extras bought alongside a plan. Shown as a second, quieter group. */
export const addOnServices = residentialServices.filter((s) => s.addOn);

/** Only these get city×service pages. See the note at the top of this file. */
export const cityPageServices = services.filter((s) => s.hasCityPages);
