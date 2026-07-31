import { todo } from "../todo";
import type { Seo } from "../types";

/**
 * The homepage. PLACEHOLDER copy — every string here is waiting on the owner interview.
 *
 * What this page needs to earn its ranking, once the facts arrive: how long they have been doing
 * this, how many yards they service now, what happens if they miss a visit, what the gate/dog
 * protocol is, and where the waste actually goes. Specifics a franchise cannot copy. Not
 * "reliable, professional, affordable" — every competitor in Philadelphia says that already.
 */
export const home = {
  seo: {
    title: todo("Dog Poop Removal in Philadelphia & the Main Line | Blue's Poop Scoop"),
    description: todo(
      "Weekly pooper scooper service across Philadelphia, Ardmore, Bryn Mawr and the Main Line. Flat rate, no contracts, same day every week.",
    ),
  } satisfies Seo,

  hero: {
    heading: todo("Never scoop the yard again"),
    subheading: todo(
      "Weekly dog waste removal across Philadelphia and the Main Line. Same day, every week, flat rate.",
    ),
  },

  valueProps: [
    {
      title: todo("Same day every week"),
      detail: todo("You get a fixed route day, not a four-hour window and a maybe."),
    },
    {
      title: todo("Flat monthly rate"),
      detail: todo("No contracts, no per-visit surprises. Cancel any time."),
    },
    {
      title: todo("We haul it away"),
      detail: todo("Waste leaves with us. Nothing sits in your bin until trash day."),
    },
  ],
} as const;
