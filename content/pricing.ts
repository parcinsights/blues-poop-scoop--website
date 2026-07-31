/**
 * Real prices, supplied by the client 2026-07-31.
 *
 * These are published on the site deliberately. "Call for a quote" is the default in this trade
 * and it is a mistake: what a scooping service costs is one of the highest-volume things people
 * actually search, and the page that answers it plainly is the page that earns the call. It is
 * also the single clearest way to look more legitimate than the franchises, which hide it.
 *
 * When the client changes rates, this file is the only place to edit.
 */

import { todo } from "./todo";
import type { PriceTier } from "./types";

export const priceTiers: PriceTier[] = [
  { id: "1-2-dogs", dogs: "1–2 dogs", weekly: 100, biweekly: 70, featured: true },
  { id: "3-4-dogs", dogs: "3–4 dogs", weekly: 160, biweekly: 100 },
  { id: "5-6-dogs", dogs: "5–6 dogs", weekly: 220, biweekly: 130 },
];

export const pricing = {
  currency: "USD",
  /** Every price above is a monthly total, not per visit. Saying so prevents the obvious misread. */
  unit: "per month",

  /**
   * OUTSTANDING — needed before the pricing page can ship:
   *   · the one-time / initial cleanup price
   *   · whether a first-time deep clean is required when signing up for a recurring plan
   *   · what happens above 6 dogs
   *   · whether there is a contract or it is month-to-month
   * Each is wrapped so a production build fails rather than shipping a guess.
   */
  oneTimeCleanup: todo<number | null>(null),
  initialCleanupRequired: todo<boolean | null>(null),
  aboveSixDogs: todo("Contact us for a quote"),
  commitment: todo("Month-to-month"),
} as const;

/** The cheapest entry point, for "starting at" copy. Derived, never typed twice. */
export const startingPrice = Math.min(...priceTiers.map((tier) => tier.biweekly));
