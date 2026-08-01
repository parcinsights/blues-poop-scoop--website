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

  /** OUTSTANDING — the owner interview. See the note above. */
  story: todo(""),
} as const;
