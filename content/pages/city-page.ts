import type { City } from "../types";

/**
 * THE CITY PAGE — the words every /locations/[city]/ page shares, and the only place they are
 * written. One template, ten towns; see app/locations/[city]/page.tsx.
 *
 * WHAT VARIES PER TOWN, and it is deliberately a short list:
 *
 *   · the h1 and the standfirst, built from the town's own name, county and neighbourhoods
 *   · that town's zip codes, which are already on file and are different on every page
 *   · `city.body` — the authored middle, and the only part that has to be written by a human
 *
 * EVERYTHING ELSE IS IDENTICAL ON ALL TEN, on purpose: the three steps, the prices, the reviews,
 * the questions, the closing CTA. Repeated blocks are boilerplate — a search engine works out what
 * a page is about from what is NOT repeated, and no site is penalised for having one guarantee.
 * What gets a site discounted is ten pages whose only difference is a swapped place name, which is
 * exactly what `city.body` exists to prevent: a town with nothing real to say about it stays
 * unpublished rather than shipping as the same page with a different noun in it. See
 * content/cities.ts and lib/content.ts.
 *
 * So the bar for authoring a body is not "write 300 words about Ardmore". It is: the route day, the
 * yards and gates and fences actually found there, where the van parks, jobs genuinely done. If a
 * sentence would be true of any town on the list, it is not worth publishing.
 */
export const cityPage = {
  /**
   * The h1. "Dog poop removal in Ardmore, PA" — the query, not a slogan. The state is on the end
   * because the search almost always carries it, and because Ardmore, PA is not the only Ardmore.
   */
  heading: (city: City) => `Dog poop removal in ${city.name}, ${city.region}`,

  /**
   * The standfirst. Neighbourhoods where we have them — Philadelphia's page covers four and naming
   * them is the whole reason that page is one URL instead of four — and the county everywhere else,
   * which is the next most specific true thing we hold about a town.
   */
  intro: (city: City) =>
    city.neighborhoods && city.neighborhoods.length > 0
      ? `Weekly and every-other-week yard cleanups across ${city.neighborhoods.join(", ")} — same crew, same route, every week.`
      : `Weekly and every-other-week yard cleanups across ${city.name} and the rest of ${city.county}, on a route we already drive.`,

  /**
   * The town's OWN zips, not the site-wide list /pricing/ carries. One or four numbers rather than
   * fifty-six, and it is the most specific true thing on the page before a word of it is authored:
   * a reader either finds their own zip or is told to ask, on the page for their own town.
   */
  zips: {
    heading: (city: City) => `Zip codes we cover in ${city.name}`,
    note: {
      before: "Not the zip you're in?",
      link: "Ask us",
      after: " — the route grows, and we'll tell you honestly whether we can reach you.",
    },
  },

  /** The homeowner's questions, trimmed to five. The rest are on /faq/, which the band links to. */
  faq: {
    heading: "Questions homeowners ask",
    cta: "See all questions",
  },

  reviews: {
    heading: "What our customers say",
  },

  /**
   * The band of sibling towns at the foot of the page. It is the only cross-link between the ten,
   * and it is what keeps every location one hop from every other rather than making /locations/ the
   * sole way across.
   */
  nearby: {
    heading: "Other towns on our route",
  },

  cta: {
    heading: (city: City) => `Let's get your ${city.name} yard sorted`,
    detail:
      "Tell us your zip and how many dogs you have, and we'll come back with a price and a first visit date. No contract, cancel whenever you like.",
  },
};
