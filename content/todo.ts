/**
 * Marks copy that is a PLACEHOLDER awaiting real facts from the client.
 *
 * Two reasons this exists rather than a `// TODO` comment:
 *
 *  1. It is greppable and countable — `pnpm test` reports exactly how much invented-sounding copy
 *     is still in the repo, so "how much content is left" is a number, not a guess.
 *  2. It throws on a production build. Placeholder text physically cannot reach the live site.
 *
 * The rule behind it: this is a real business, and a page's value is its first-party facts — real
 * jobs, real prices, real photos, real neighbourhoods. Plausible-sounding filler is worse than an
 * empty slot, because an empty slot gets filled and filler gets forgotten.
 */

/**
 * Evaluated per call rather than once at module load, so a test can stub the environment.
 *
 * Test runs are exempt: the guard exists to stop placeholder content reaching a real deployment,
 * not to make the production code path untestable. lib/seo.test.ts stubs VERCEL_ENV=production to
 * exercise indexability, and without this exemption merely importing the content would throw.
 */
function isProductionDeploy(): boolean {
  if (process.env.VITEST) return false;
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_ALLOW_PLACEHOLDERS === "never"
  );
}

export function todo<T>(value: T): T {
  if (isProductionDeploy()) {
    throw new Error(
      `Placeholder content reached a production build: "${String(value).slice(0, 60)}…"\n` +
        `Replace every todo() call in content/ with the client's real facts before launch.`,
    );
  }
  return value;
}
