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

/** Rates as of 2026-08-06 — the top two tiers were cut from 160/100 and 220/130 by the client. */
export const priceTiers: PriceTier[] = [
  { id: "1-2-dogs", name: "The Sidekick", dogs: "1–2 dogs", weekly: 100, biweekly: 70, featured: true },
  { id: "3-4-dogs", name: "The Squad", dogs: "3–4 dogs", weekly: 145, biweekly: 100 },
  { id: "5-6-dogs", name: "The Full House", dogs: "5–6 dogs", weekly: 190, biweekly: 120 },
];

/**
 * The two standing discounts, supplied by the client 2026-08-06.
 *
 * They live here rather than in a page record because they are PRICES — the same fact as the table
 * above, said as a percentage — and the one rule this file exists to enforce is that a rate is
 * edited in exactly one place. Both /pricing/ and the homepage band render this array; neither
 * types a number.
 *
 * The percentages are `number`, not "10% off" strings, so the copy around them can change without
 * anyone having to find and retype the figure inside a sentence.
 */
export const discounts = [
  {
    id: "prepay",
    percent: 10,
    title: "Pay 6 months up front",
    detail:
      "Pay for six months or more in full and take 10% off the whole thing. No contract comes with it — it is a discount, not a commitment.",
  },
  {
    id: "service",
    percent: 5,
    title: "First responders, military & teachers",
    detail:
      "5% off every plan, every month, for as long as you're with us. Just tell us when you get in touch.",
  },
] as const;

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
