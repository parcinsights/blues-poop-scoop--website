import { todo } from "../todo";

/**
 * The words shared by EVERY service page.
 *
 * There are far fewer of them than there used to be. The old template ran six bands under the hero
 * — the guarantee, the three steps, the price grid, the coverage list, the FAQ — and five of those
 * were word-for-word identical whichever service you had landed on. They lived here so a change
 * landed once instead of four times, which was the right answer to the wrong page: a visitor who
 * clicked "Deodorizer" was scrolling past the homepage to reach the two paragraphs about the
 * deodorizer.
 *
 * The page is now the hero, the details section and the closing CTA, so what is shared is only the
 * furniture: the three tab labels, the words around the quote form, and the closing ask. The
 * per-service half — the heading, the chips, the photograph, what's included, the benefits, the
 * authored body — lives on the service record in content/services.ts.
 *
 * The bands themselves are not gone, only unused here: `WhyUs`, `HowItWorks`, `PricingBand`,
 * `ServiceAreaList` and `FaqBand` still exist and still run on the homepage.
 */
export const servicePage = {
  /**
   * The three chip toggles, in this order: what it is, what happens, what you get. Fixed on every
   * service page — a tab row that changed service to service would stop reading as one template.
   *
   * `tablist` is the name a screen reader announces for the group. It is not printed: the section
   * has no visible title, because the chips are what says where you are.
   */
  tabs: {
    tablist: "Service details",
    about: "About",
    includes: "Includes",
    benefits: "Benefits",
  },

  /**
   * Shown in a tab whose content the client has not supplied yet — a single quiet line instead of
   * an empty panel, and `todo()` so it cannot reach a production build. It says nothing about the
   * service on purpose: the point of an unfilled slot is that it gets filled, and plausible filler
   * is what stops that happening.
   */
  pending: todo("We're still writing this part. Ask us and we'll tell you now."),

  /**
   * The form beside the tabs. Same ask as the closing band below it, in fewer words — someone
   * reading a service page has not yet been told what it costs, so the promise is a price rather
   * than a call.
   */
  form: {
    heading: "Get a free quote",
    intro: "Zip code and how many dogs. We'll text you back with a price.",
  },

  /** The words on the pricing button in the hero. The quote button is the site-wide `primaryCta`. */
  hero: {
    pricingCta: "Check pricing",
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
