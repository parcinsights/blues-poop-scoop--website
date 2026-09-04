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
    // FEATURED — the knee replacement. Nobody else on the site says why they hired a scooping
    // service, and "I will probably keep it after I heal" is a renewal argument no marketing
    // sentence could make.
    featured: true,
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
    // FEATURED — the only quote that says we beat someone else he actually paid. "Have used
    // others in the past" is the sentence a shopper comparing three tabs is looking for.
    featured: true,
    name: "Daniel Cohen",
    quote:
      "This is the best poop scoop service I have used (have used others in the past). They are BEYOND thorough, clean, and attentive. Always leave the yard cleaner than it was before they got there. Great communicators and dog lovers.",
  },
  {
    // FEATURED — thoroughness, proven rather than asserted: she went out and inspected the yard
    // herself. That is evidence, where "very thorough" is just an adjective.
    featured: true,
    name: "S. Nicole",
    quote:
      "Blue's Poop Scoop was AMAZING! I was very behind on cleanup, to say the least, and they went above and beyond. They cleaned everything — seriously, everything. After they finished, I walked the yard myself to see if I could find even one missed spot, and there wasn't any poop anywhere. The yard looked fantastic.",
  },
  {
    // FEATURED — the local one. Names a Philly neighbourhood, and its real subject is that we
    // answered the phone when the competition did not return her calls.
    featured: true,
    name: "Liv",
    quote:
      "We have a small side yard in Northern Liberties in Philly… other companies I reached out to never got back to me or didn't service the zip code. I called Blue's and George answered right away! I could tell immediately that I had found the right service. The waste removal service itself is excellent and thorough. So thrilled to have more time to enjoy our outdoor space with our pup!",
  },

  // ── Added 2026-09-04, from the client's Google profile ──────────────────────
  // Newest first, which is the order they were supplied in. The wall is CSS multi-column and reads
  // top-of-column to bottom, so source order is not visual order — see `ReviewWall`. Nothing here
  // is ranked; it is simply the order Google listed them.
  //
  // Google's "Great price" / "Reasonable price" chips are NOT part of the review text — they are
  // the attribute tags a reviewer ticks — so they are not quoted here. Karrie Rivera's review came
  // in this batch too and is already above, unchanged; it is not repeated.
  {
    name: "Kelly Zwiebel",
    quote: "Did a great job cleaning out our yard.",
  },
  {
    // "Gorge" → "George" in the original. A misspelling of the owner's own name is exactly the
    // kind of obvious typo this file's header allows repairing.
    name: "Doug Perry Jr",
    quote:
      "Provided same-day service, which was absolutely amazing. George is very nice. He even came to our area because we needed him, but he usually doesn't service this area. I asked them to please do us a favor and he said yes. If you're looking for someone, I would 100% refer this company.",
  },
  {
    name: "Thomas DePaul",
    quote:
      "I switched to Blue's 4 months ago and the service vs the previous provider is soooooooo much better. Thank you George for keeping our back yard clean, we can enjoy it much better now.",
  },
  {
    // FEATURED — the strongest quote on the site. Multi-dog household, reliability ("no flaking
    // or rescheduling"), and a yard that went from unusable to usable. It is also the only review
    // that describes the exact household the $135 tier is priced for.
    featured: true,
    name: "Katherine Schneider",
    quote:
      "George has been cleaning up after our 3 dogs in our large backyard, and he's been fantastic. He's extremely reliable — always shows up on schedule, no flaking or rescheduling — and does a thorough job every single time. Before hiring him, our yard was like a minefield of dog poop, thanks to 3 dogs (and the occasional doggie play date!). Now we can actually use our backyard again without worrying about what we'll step in or being embarrassed when friends visit. If you've got multiple dogs and a yard that's gotten out of control, I highly recommend Blue's!",
  },
  {
    // FEATURED — the most ecstatic of the new batch, and the neglected-yard case: "hasn't been
    // cleaned in a long long time". That is the reader who has been putting this off, which is
    // most of them.
    featured: true,
    name: "Lexus Juele",
    quote:
      "He did an amazing job! Our yard hasn't been cleaned in a long long time and he went out of his way to help us! He did it so fast yet so thorough. If you've been looking for someone to give your yard the attention it needs and deserves (trash, dog poop, etc) your search ends here! Definitely book with him!",
  },
  {
    name: "Sandra Salvo",
    quote:
      "George was such a down to earth guy! Very professional and informative! Easy to work with and accommodating. If you are tired of picking up after your pooches Blue's Poop Scoop is the way to go! Thanks George!",
  },
  {
    name: "Andrew Williams",
    quote:
      "Professional, necessary, punctual and Excellent service! This company definitely needs to become NATIONAL!",
  },
  {
    name: "Christina Springrose",
    quote: "Great service for a reasonable price!",
  },
  {
    // Punctuated, not rewritten: the original is one unbroken run of words ("Highly recommend very
    // professional fantastic Service did an excellent job"), and the sentence breaks below are
    // where the reviewer's own pauses fall. No word is changed, added, or reordered.
    name: "Mary McKiernan",
    quote:
      "Highly recommend. Very professional, fantastic service, did an excellent job.",
  },
];

/**
 * The six quotes every page except /reviews/ carries.
 *
 * SIX, NOT SEVENTEEN. The full wall is the right page when someone has gone looking for reviews and
 * the wrong band when they have not: seventeen cards is a scroll between the price and the button
 * that closes the sale, and a reader who has to skim testimonials stops reading them at about the
 * fourth. The six below are chosen to make six DIFFERENT arguments rather than to be the six
 * warmest — a wall of "great service, highly recommend" persuades nobody past the first card.
 *
 * What each is carrying, and why the set stops here:
 *   · Katherine Schneider — multiple dogs, reliability, a yard made usable again
 *   · S. Nicole           — thoroughness she went out and verified herself
 *   · Daniel Cohen        — better than the competitors he had already paid
 *   · Liv                 — local, and we answered the phone when others did not
 *   · Jackie Sundy        — the one human reason nobody else on the page gives
 *   · Lexus Juele         — the long-neglected yard, rescued
 *
 * DERIVED, so a quote exists once. To change the set, move a `featured` flag above — there is no
 * second list to keep in step, which is the failure this shape exists to prevent.
 *
 * Source order, which is the order they were left. That costs nothing here: `ReviewWall` is CSS
 * multi-column and reads top-of-column to bottom, so the visual order is not the source order for
 * any set larger than one column. See the note on that component.
 */
export const featuredReviews: Review[] = reviews.filter(
  (review) => review.featured,
);

/** The way out of the trimmed wall — the button under it, pointing at /reviews/. */
export const allReviewsCta = {
  label: "Read more",
} as const;

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
