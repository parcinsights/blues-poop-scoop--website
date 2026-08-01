import { home } from "./home";

/**
 * The words shared by EVERY service page.
 *
 * Service pages are one template, so most of a service page is not about that service: the
 * guarantee, the safety policy, the three steps, the prices and the coverage are the same
 * whichever one you landed on. Those bands are filled from here, so a change lands on all of them
 * at once rather than four times.
 *
 * The per-service half — the hero, what's included, the questions — lives on the service record in
 * content/services.ts.
 *
 * Note the re-exports rather than copies. "Why us" and "how it works" are the homepage's own bands,
 * word for word, and a second copy of the guarantee is a second thing to remember to update when
 * the terms change. The homepage is the source; this file only says which bands a service page
 * borrows.
 */
export const servicePage = {
  /** The trust band. Same four claims as the homepage — see the note above. */
  whyUs: home.whyUs,

  /** The three steps. Identical to the homepage: the process does not vary by service. */
  howItWorks: home.howItWorks,

  /**
   * The pricing band, borrowing the homepage's assurances and guarantee but retitled.
   *
   * "Simple, flat-rate pricing" is a homepage claim — it is arguing that the pricing model is
   * fair. Someone on a service page has already accepted that and is asking a narrower question,
   * so the title answers it literally.
   */
  pricing: {
    ...home.pricing,
    heading: "What it costs",
  },

  /** The coverage band. The town chips are read from content/cities.ts by the block itself. */
  area: {
    heading: "Where we offer it",
  },

  /**
   * The FAQ band. `items` is the FALLBACK — a service with its own questions overrides it, and
   * only a service that has none falls back to the homepage's four. An empty FAQ band on a service
   * page would leave it looking less answered than the homepage, which is backwards.
   */
  faq: {
    heading: "Questions we get a lot",
    items: home.faq.items,
    cta: "See all questions",
  },

  /**
   * The closing band. Deliberately NOT the homepage's wording: a visitor who has read a service
   * page start to finish has chosen the service, so the ask is the quote rather than another
   * round of persuasion.
   */
  cta: {
    heading: "Ready to get started?",
    detail: "Tell us your zip code and how many dogs. We'll text you back with a price.",
  },
} as const;
