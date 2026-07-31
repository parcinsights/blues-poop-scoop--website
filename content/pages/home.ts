import { startingPrice } from "../pricing";
import { todo } from "../todo";
import type { Seo } from "../types";

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
    heading: "More than just a poop scoop service",
    subheading: `Weekly and every-other-week dog waste removal across Philadelphia and the Main Line. Plans from $${startingPrice} a month.`,
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

  /** OUTSTANDING — the owner interview. See the note above. */
  story: todo(""),
} as const;
