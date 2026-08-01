/**
 * Real customer quotes, rendered as visible content.
 *
 * They are deliberately NOT emitted as `review` or `aggregateRating` structured data. Marking up
 * reviews you collected yourself, on your own domain, is against Google's structured data
 * guidelines and is a manual-action risk. The quotes still do their real job, which is convincing
 * the human reading the page.
 *
 * These are the client's own Google reviews, kept in the customer's words. The only edits made are
 * obvious typo repairs ("his is" → "This is") and, where a review is long, a trim marked with an
 * ellipsis. Nothing is added, and no sentence is made to say something the reviewer did not.
 *
 * `city` is absent on all of them on purpose — see the note on `Review` in content/types.ts.
 */

import { todo } from "./todo";
import type { Review } from "./types";

export const reviews: Review[] = [
  {
    name: "JK",
    quote:
      "Great service! We have a large yard and our yard is cleaned regularly. Work is thorough and well done. Highly recommend Blue's!",
  },
  {
    name: "Deborah Gaylor",
    quote:
      "George is very friendly. My dog loves him. He lets me know he is coming and the yards are thoroughly checked. There is a special for 2 free weeks to give it a try. I hired him after the first visit.",
  },
  {
    name: "Hanna Mills",
    quote:
      "They are amazing! They came to the rescue when my poor fur baby had some big poops while I was away. They're honest, dependable, and they do great work! Poop be gone! Highly recommend!",
  },
  {
    name: "Jackie Sundy",
    quote:
      "This is such a wonderful service. I recently had my knee replaced and this has been a great alternative… very professional and thorough. So much so I will probably keep it after I heal.",
  },
  {
    name: "Karrie Rivera",
    quote:
      "Very prompt and courteous. They did a thorough job in rainy, unpleasant weather. Highly recommend! Thanks again!",
  },
  {
    name: "Daniel Cohen",
    quote:
      "This is the best poop scoop service I have used (have used others in the past). They are BEYOND thorough, clean, and attentive. Always leave the yard cleaner than it was before they got there. Great communicators and dog lovers.",
  },
  {
    name: "S. Nicole",
    quote:
      "Blue's Poop Scoop was AMAZING! I was very behind on cleanup, to say the least, and they went above and beyond. They cleaned everything — seriously, everything. After they finished, I walked the yard myself to see if I could find even one missed spot, and there wasn't any poop anywhere. The yard looked fantastic.",
  },
  {
    name: "Liv",
    quote:
      "We have a small side yard in Northern Liberties in Philly… other companies I reached out to never got back to me or didn't service the zip code. I called Blue's and George answered right away! I could tell immediately that I had found the right service. The waste removal service itself is excellent and thorough. So thrilled to have more time to enjoy our outdoor space with our pup!",
  },
];

/**
 * The star row in the hero. Same rule as above — it is visible trust, not structured data.
 *
 * OUTSTANDING — the label is a placeholder. It needs the real number and the place a visitor can
 * go and check it ("5.0 from 38 reviews on Google"), because an unsourced star row is the exact
 * thing every competitor's template also says, and a count that can be verified is not.
 */
export const ratingSummary = {
  stars: 5,
  label: todo("5-star rated"),
} as const;
