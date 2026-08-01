/**
 * Real customer quotes, rendered as visible content.
 *
 * They are deliberately NOT emitted as `review` or `aggregateRating` structured data. Marking up
 * reviews you collected yourself, on your own domain, is against Google's structured data
 * guidelines and is a manual-action risk. The quotes still do their real job, which is convincing
 * the human reading the page.
 *
 * EMPTY until the client supplies real ones — first name, city, and words the customer actually
 * wrote. Every component that renders reviews returns null on an empty list, so the site simply
 * does not show a testimonials section rather than showing a fabricated one.
 *
 * Ask the client for 3-6, ideally pulled from their Google Business Profile so they are verifiable.
 */

import { todo } from "./todo";
import type { Review } from "./types";

export const reviews: Review[] = [];

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
