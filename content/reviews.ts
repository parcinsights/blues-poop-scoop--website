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

import type { Review } from "./types";

export const reviews: Review[] = [];
