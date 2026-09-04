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

/**
 * Rates as of 2026-09-04.
 *
 * ONE FREQUENCY AND TWO TIERS, and both of those are cuts the client asked for — the every-other-week
 * column and the 5–6 dog row came off together. The reasoning was the same for each: a price grid is
 * read in the two seconds before somebody decides whether to keep reading, and every extra cell in it
 * is another decision taken before the only one that matters ("is this worth it"). Bi-weekly is still
 * sold — it is quoted on request rather than advertised — and so is anything above four dogs. Both
 * routes out are `customQuote` below, which is why removing them from the grid loses no business.
 *
 * The 3–4 dog rate moved 145 → 135 at the same time.
 *
 * History: the top two tiers were cut from 160/100 and 220/130 on 2026-08-06.
 */
export const priceTiers: PriceTier[] = [
  { id: "1-2-dogs", name: "The Sidekick", dogs: "1–2 dogs", weekly: 100, featured: true },
  { id: "3-4-dogs", name: "The Squad", dogs: "3–4 dogs", weekly: 135 },
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

/**
 * The way out of the grid, for the two customers the grid no longer describes: somebody who wants a
 * schedule other than weekly, and somebody with a fifth dog.
 *
 * It is a FIELD rather than a sentence typed under the cards, and it renders in both places the
 * prices do (the homepage/pricing band and the money-page table). That is the whole point of cutting
 * rows out of a table — the moment a visitor is not on it, the page has to say so itself rather than
 * leave them to conclude they are not served. Client's own wording, 2026-09-04.
 */
export const customQuote = {
  heading: "Want another frequency? Have more than 4 dogs?",
  detail: "No problem — reach out and we'll put a quote together for you.",
} as const;

export const pricing = {
  currency: "USD",
  /** Every price above is a monthly total, not per visit. Saying so prevents the obvious misread. */
  unit: "per month",
  /** The compact form, for the card where the price and its unit are one glyph run: "$100/month". */
  unitShort: "/month",
  /** What the monthly price buys, said as a schedule rather than as a plan name. */
  cadence: "Serviced once per week",

  /**
   * OUTSTANDING — needed before the pricing page can ship:
   *   · the one-time / initial cleanup price
   *   · whether a first-time deep clean is required when signing up for a recurring plan
   *   · whether there is a contract or it is month-to-month
   * Each is wrapped so a production build fails rather than shipping a guess.
   *
   * "What happens above 6 dogs" came off this list on 2026-09-04: `customQuote` answers it, and the
   * grid stops at four.
   */
  oneTimeCleanup: todo<number | null>(null),
  initialCleanupRequired: todo<boolean | null>(null),
  commitment: todo("Month-to-month"),
} as const;

/**
 * How many visits a monthly price is divided by to get the per-visit figure.
 *
 * FOUR, not 4.33. Weekly service actually averages ~4.33 visits a month, so dividing by four gives
 * the CEILING — the most a visit can ever cost on a flat monthly plan. In a five-visit month the
 * customer pays less per visit than the site advertises, never more, which is the only direction a
 * published per-visit figure is safe to be wrong in.
 */
export const VISITS_PER_MONTH = 4;

/**
 * The monthly price restated as one visit — "just $25 per visit".
 *
 * DERIVED, never typed. It is the same fact as `weekly` said a second way, and the failure this
 * prevents is the obvious one: a rate change lands in `priceTiers` and the per-visit line beside it
 * quietly keeps the old arithmetic.
 *
 * Whole dollars where it divides evenly ("$25"), cents where it does not ("$33.75"). Rounding to
 * "$34" would overstate what a visit costs, which is a strange thing to do to your own price.
 */
export function perVisit(monthly: number): string {
  const value = monthly / VISITS_PER_MONTH;
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/**
 * The cheapest entry point, for "starting at" copy. Derived, never typed twice.
 *
 * It reads `weekly` because weekly is now the only published frequency — it used to read the
 * bi-weekly column, which is why the "from $70" figure appeared in metadata around the site.
 */
export const startingPrice = Math.min(...priceTiers.map((tier) => tier.weekly));
