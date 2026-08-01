import { startingPrice } from "../pricing";
import { todo } from "../todo";
import type { Seo, WhyUsPoint } from "../types";

/**
 * The homepage.
 *
 * The three value props are the client's own words, lifted from their current site. They are kept
 * verbatim on purpose: "We never enter when your dog is outside" is a real operating policy, and a
 * specific policy is worth more than any amount of "reliable, professional, affordable" — which
 * every competitor in Philadelphia is already saying.
 *
 * Still outstanding: how long they have been doing this, how many yards they service now, what
 * happens if they miss a visit, and where the waste actually goes. Those are the details that make
 * a homepage impossible for a franchise to copy.
 */
export const home = {
  seo: {
    title: "Dog Poop Removal in Philadelphia & the Main Line",
    description: `Weekly and bi-weekly pet waste removal in Chestnut Hill, Mt. Airy, Roxborough, Ardmore, Bryn Mawr and more. Plans from $${startingPrice} a month.`,
  } satisfies Seo,

  hero: {
    heading: "We scoop, so you don't have to",
    /**
     * Not a price and not a service list — both of those are a click away, and neither is the
     * reason someone hires this. The problem is the chore and the low-grade guilt around it, so
     * the copy names that, then answers it with the one operating policy that is actually theirs:
     * they never enter while the dog is outside. See `valueProps` below — it is the same promise,
     * and it is repeated here on purpose.
     */
    subheading:
      "Your yard should be somewhere you and your dog actually want to be. We keep it that way — on schedule, every week, and never while your pup is outside.",

    /**
     * The objections a homeowner has in the two seconds before clicking, answered in three
     * fragments. Client-supplied — these are commitments the business is making, so they belong
     * here rather than being invented as copy.
     */
    assurances: ["No contracts", "Cancel anytime", "We reply by text"],
  },

  /** Verbatim from the client. Do not smooth these out — the specificity is the value. */
  valueProps: [
    {
      title: "Honest & Dependable",
      detail:
        "We show up when we say we will. No excuses, no surprises. Just a clean yard, every time.",
    },
    {
      title: "Pet Safety First",
      detail:
        "We never enter when your dog is outside. Your pet's safety always comes first — no exceptions.",
    },
    {
      title: "Locally Owned",
      detail:
        "We live and work in the neighborhoods we serve. This is our community, and we treat every yard like it's our own.",
    },
  ],

  /**
   * The "why us" band. Three of the four points are the client's existing commitments restated —
   * the pet-safety policy, being locally owned, and the no-contract terms already promised in the
   * hero. The guarantee is the new one, and it is the strongest thing on the page: it is the only
   * claim here that costs the business money if it turns out to be false.
   */
  whyUs: {
    heading: "Why your yard is in good hands",
    intro:
      "We're a small local outfit, not a franchise — the people who scoop your yard are the same ones who answer the phone. If we ever leave you unhappy, we'd rather give the money back than argue about it.",
    points: [
      {
        icon: "guarantee",
        title: "30-day satisfaction guarantee",
        detail:
          "Not happy with the work in your first 30 days? We refund it in full, no questions asked.",
      },
      {
        icon: "safety",
        title: "Your dog's safety comes first",
        detail:
          "We never enter the yard while your dog is outside. No exceptions, no matter the schedule.",
      },
      {
        icon: "local",
        title: "Your actual neighbors",
        detail:
          "We live and work in the same neighborhoods we serve, and we treat every yard like our own.",
      },
      {
        icon: "flexible",
        title: "No contracts, ever",
        detail: "Cancel any time, and reach a real person by text when something changes.",
      },
    ] satisfies WhyUsPoint[],
    cta: "About us",
  },

  /** OUTSTANDING — the owner interview. See the note above. */
  story: todo(""),
} as const;
