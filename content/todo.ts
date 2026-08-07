/**
 * Marks copy that is a PLACEHOLDER awaiting real facts from the client.
 *
 * It exists rather than a `// TODO` comment because it is greppable and countable —
 * `grep -rc "todo(" content` reports exactly how much invented-sounding copy is still in the repo,
 * so "how much content is left" is a number, not a guess.
 *
 * The rule behind it: this is a real business, and a page's value is its first-party facts — real
 * jobs, real prices, real photos, real neighbourhoods. Plausible-sounding filler is worse than an
 * empty slot, because an empty slot gets filled and filler gets forgotten.
 *
 * This used to throw on a production build so placeholder text physically could not reach the live
 * site. That block was removed deliberately: the site ships before the facts land. The marker still
 * stands, and every call below is copy nobody at Blue's has confirmed. Clear them.
 */
export function todo<T>(value: T): T {
  return value;
}
