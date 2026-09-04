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
 * service is. Both became the Poop Scoop page, which explains the work once.
 *
 * FOLLOW-ON, 2026-09-04: the client then cut the second frequency from everything published. Weekly
 * is the offer; bi-weekly is quoted on request and is no longer sold from a page. This record was
 * rewritten accordingly — it no longer asks the reader to choose a schedule, because there is now
 * one. The old page still catches "every other week" intent through the FAQ below, which answers
 * that query honestly rather than by advertising a plan the client would rather not sell.
 *
 * `hasCityPages` decides which services also generate /locations/[city]/[service]/ money pages —
 * the pages that catch local intent ("dog poop removal ardmore pa"). Only the core scooping plan
 * has them. Generating every service × every city is how a doorway network appears by accident.
 */

import { perVisit, startingPrice } from "./pricing";
import { todo } from "./todo";
import type { Service } from "./types";

export const services: Service[] = [
  {
    /**
     * The core service, and the only one anyone searches for by itself. It absorbed the two
     * frequency pages (see the correction above), so it owns the "weekly dog poop removal" and
     * "every other week" intent as well as the local money-pages — the second of those is answered
     * in the FAQ rather than sold in the copy.
     */
    slug: "poop-scoop",
    name: "Poop Scoop",
    heading: "Dog poop removal, done right",
    summary:
      "Weekly yard scooping on a day you can count on. We text before we come and again when the yard is clear, double-bag everything, and never enter while your dog is outside.",
    seo: {
      title: "Dog Poop Removal & Pooper Scooper Service | Philadelphia",
      description:
        `Weekly dog poop removal across Chestnut Hill, Mt. Airy, Manayunk, Ardmore, Ambler, Jenkintown, Blue Bell and more. From $${startingPrice} a month — ${perVisit(startingPrice)} a visit. No contracts.`,
    },
    image: "servicePoopScoop",
    /**
     * Three chips, and not one of them is an adjective: "Weekly service" is the schedule, "No
     * contracts" is the terms, "Pet-safe" is the policy of never entering while a dog is out.
     * A chip is the first thing read on this page, so it is the last place to put a claim nobody
     * has committed to.
     */
    tags: ["Weekly service", "No contracts", "Pet-safe"],
    /**
     * The INCLUDES tab. Every sentence here is something the client has actually committed to —
     * the weekly schedule, the texts, the double-bagging, the pet-safety policy, the first-visit
     * walkthrough. Nothing in it is a claim a franchise site could not also make; what makes it
     * worth printing is that it is true here and someone will be held to it.
     *
     * OUTSTANDING, and this is where they go the moment George supplies them: the sweep pattern
     * (edges and fence lines, or open lawn only), what he does with a gate left unlatched, and
     * where the waste finally ends up. Those are the three details a competitor cannot copy, and
     * this stays general until they arrive.
     */
    includes: [
      "Every visit runs the same way, every week. You get a text before we set off, so nobody is surprised by a van in the driveway. We work through the yard and collect what's there, and everything we pick up is double-bagged for sanitation and odor control. When it's clear, you get a second text — so you know the job is done without having to go and look.",
      "The one thing we won't do is let ourselves in while your dog is outside. That holds every week without exception: if we arrive and your dog is in the yard, you get a text instead of a scooped lawn, and we sort out a better time. The only visit you need to be home for is the first one, so you can walk us around and get gate access set up. After that, come and go as you like.",
    ],
    /**
     * The BENEFITS tab, and the only part of this record that is not a fact somebody supplied.
     * These are reasonable things to say about a clean yard, but they are OURS rather than
     * George's, which is what `todo()` is for: it reads fine in review and throws on a production
     * build. Replace it with what his customers actually tell him they got out of it — that will
     * be better than this, and it will be true.
     */
    benefits: todo([
      "The obvious one is the chore itself: it stops being yours. No hunting around the yard on a Saturday morning, no putting it off in the rain until the job is twice the size, no arguments about whose turn it is.",
      "The less obvious one is that you start using the yard again. A lawn nobody has scooped in three weeks is somewhere you cross carefully on the way to the car; a clean one is somewhere the kids sit down and the dog gets played with. Through the summer it is also the difference between a garden with flies in it and one without.",
    ]),
    /**
     * Four questions, and the first one is here for the searcher rather than for the buyer: people
     * do look for "every other week dog poop removal", and the honest answer is that we will do it
     * but do not sell it off the shelf. Answering that plainly is worth more than either
     * advertising a plan the client would rather not sell, or pretending the option does not exist
     * and losing the visitor who came looking for it.
     */
    faq: [
      {
        question: "Do you offer every-other-week service?",
        answer:
          "Our published plans are weekly, because that is what keeps a yard genuinely clear and it is what almost everyone ends up on. If every other week suits your yard better, just ask — we'll quote it for you. There's no contract either way, so you can change your mind by text.",
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
    /**
     * The ABOUT tab, and the publish gate: this is the field that decides whether the page is
     * indexed at all (see lib/content.ts). It is written from the facts already in this record —
     * the weekly schedule, the no-contract terms, the coverage — rather than from anything new,
     * which is why it needs no `todo()` and why it is the shortest honest version of this page.
     *
     * It gets richer the moment George answers the outstanding questions: how long he has been
     * doing this, how many yards he is on now, and what happens the week it snows.
     */
    body: [
      {
        kind: "prose",
        paragraphs: [
          "Poop Scoop is the recurring service most of our customers are on. We come to your yard once a week, on the same day each week, and clear out everything the dogs have left behind since we were last there. One dog or four, a small city yard or half an acre on the Main Line — it is the same job and the same standard either way.",
          "There is not much to decide beyond how many dogs you have, and that decides the price rather than the plan. Weekly is the schedule we build every route around, and it is what keeps a yard clear rather than nearly clear. If your yard genuinely wants something different — a different frequency, or more dogs than our plans list — tell us and we'll quote it. There is no contract to renegotiate, and nothing to cancel beyond telling us to stop.",
          "We are a local outfit rather than a franchise, so the person scooping your yard is the person who answers your text. If we get it wrong in your first thirty days, we refund the lot and part on good terms.",
        ],
      },
    ],
    hasCityPages: true,
    segment: "residential",
  },
  {
    slug: "deodorizer",
    // OUTSTANDING: needs the product used, whether it is pet- and lawn-safe (the first question
    // every customer asks), the coverage area per treatment, and the price. EVERY tab below is
    // written around those gaps rather than filling them in — an add-on whose whole pitch is "it's
    // safe around your dog" cannot have that sentence invented for it, so the copy says what the
    // treatment is for and stops where the facts stop. All of it is `todo()`.
    name: todo("Deodorizer"),
    heading: todo("Yard deodorizing treatment"),
    summary: todo("An add-on treatment that neutralizes odor after the yard is cleared."),
    seo: {
      title: todo("Yard Deodorizer Treatment | Blue's Poop Scoop"),
      description: todo(
        "A pet-safe deodorizing treatment added to any scooping visit. Philadelphia and the Main Line.",
      ),
    },
    image: "serviceDeodorizer",
    tags: todo(["Add-on", "Pet-safe", "Per treatment"]),
    includes: todo([
      "The deodorizer is something we do at the end of a scooping visit rather than a trip of its own. Once the yard is clear, the areas the dogs actually use get treated — the patch of grass they favour, the run along the fence, the corner by the back door — because that is where the smell is, and treating the whole lawn would be spending your money on ground that does not need it.",
      "It goes on after the waste is gone, never instead of it. A deodorizer over a yard that has not been scooped is an air freshener in a room nobody has cleaned: it works for an afternoon and then you are back where you started.",
    ]),
    benefits: todo([
      "It is the difference between a yard that is clean and a yard that smells clean. Scooping deals with what you can see; hot weather brings the rest of it back out of the grass for days afterwards, and this is what handles that part.",
      "It matters most in exactly the situations where the yard has to be pleasant to be in — the stretch of summer when the back door is open, or the weekend you are having people over.",
    ]),
    body: todo([
      {
        kind: "prose",
        paragraphs: [
          "Deodorizing is an add-on rather than a service you book on its own. When the smell is the actual problem — and in July, in a yard with two dogs in it, the smell is usually the actual problem — clearing the waste is only half the answer. What is left in the grass keeps going long after the yard looks fine.",
          "Add it to any scooping plan and we treat the yard at the end of the visit. There is no separate appointment to be in for, and no commitment: it can go on one visit, every visit, or just the ones through the warm months.",
        ],
      },
    ]),
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
    image: "serviceHaulAway",
    tags: todo(["Add-on", "Off your property", "No bin smell"]),
    includes: todo([
      "Everything we collect is double-bagged, exactly as it is on a normal visit. The difference is what happens next: instead of the bags going into your trash can, they leave in the van with us and are disposed of off your property.",
      "Nothing else about the visit changes. Same schedule, same text before we arrive and after we finish, same policy about never entering while your dog is outside.",
    ]),
    benefits: todo([
      "Your own bin stops being part of the arrangement. Nothing sits in it through a warm week waiting for collection day, which is the point at which most people notice their trash can at all.",
      "It also solves the case where there is no good bin to use — a shared alley, a small building's cans, a pickup that only comes once a fortnight. If the waste never lands on your property, none of that is your problem.",
    ]),
    body: todo([
      {
        kind: "prose",
        paragraphs: [
          "Haul Away is the add-on for people whose objection was never the scooping — it was the bag of it sitting in their own trash can for the next five days.",
          "Add it to any plan and the waste leaves with us at the end of every visit. It is billed alongside your scooping plan and can be turned on or off by text, the same as everything else.",
        ],
      },
    ]),
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
    image: "serviceOneTimeClean",
    tags: todo(["One visit", "No plan needed", "Thorough"]),
    includes: todo([
      "A one-time clean is a single visit with no schedule attached. We work through the whole yard rather than the areas a regular visit would concentrate on, because on a yard that has been left a while there is no such thing as a light patch.",
      "Everything is collected and double-bagged as it would be on any other visit, and you get a text when the yard is clear. How long it takes depends on the size of the yard and how long it has been — we would rather tell you that honestly after seeing it than quote a number here.",
    ]),
    benefits: todo([
      "It is the fastest way out of a yard that has got away from you — after a winter, after a stretch of rain, or after the month when nobody quite got round to it.",
      "It also has nothing attached to it. No plan, no schedule, no phone call in a month asking whether you'd like to continue. Book it when you need it, and if the state of the yard afterwards makes a regular visit look worthwhile, that conversation can happen then.",
    ]),
    body: todo([
      {
        kind: "prose",
        paragraphs: [
          "A one-time clean is exactly what it sounds like: we come once, clear the whole yard, and that is the end of the arrangement unless you want more.",
          "It is what most people book before something — a party, a viewing, a family visit, the first warm weekend after a long winter — and it is also how a lot of our recurring customers started, because a yard that has been left for a few months is a bigger job than a normal visit and is priced as its own thing.",
        ],
      },
    ]),
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
    // No photograph: there is no picture of commercial work because there may be no commercial work
    // yet. The hero drops to a single column, which is the honest version of that.
    tags: todo(["HOAs & apartments", "On a schedule"]),
    /**
     * Note what none of this says: how many properties we look after, or how long we have been
     * doing it. The client's current site lists commercial as "Coming Soon", so the copy offers
     * the service and claims no track record — and the whole page stays unpublished (see
     * lib/routes.ts) until they confirm they actually sell it.
     */
    includes: todo([
      "Commercial work is quoted per property rather than per dog, because the thing that decides the job is the ground: how much of it there is, how much of it the dogs use, and how often people are walking across it.",
      "A visit covers the common areas the property manager nominates — the dog run, the lawns between buildings, the strip along the parking lot — and everything collected leaves with us. Frequency is whatever keeps the grounds presentable, from twice a week upwards.",
    ]),
    benefits: todo([
      "For a property manager the value is the complaints that stop arriving. Pet waste in common areas is one of the most reliable sources of them, and it is one of the few that a scheduled service simply removes.",
      "It is also visible in a way most maintenance is not. Grounds that are obviously looked after are part of what a prospective tenant is shown, and this is the cheapest part of that.",
    ]),
    body: todo([
      {
        kind: "prose",
        paragraphs: [
          "We service apartment communities, HOAs and dog parks around Philadelphia and the Main Line on a schedule that fits the property rather than a residential plan stretched to cover it.",
          "The arrangement is the same as it is for a homeowner in the ways that matter — a set schedule, no long contract, and a real person on the end of a phone — with the paperwork a managed property needs: one invoice, one point of contact, and proof of what was done and when.",
        ],
      },
    ]),
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
