/**
 * The places this business serves. One entry = one page at /locations/[slug]/.
 *
 * Zip codes are verified from the client's existing site. Copy is placeholder until the owner
 * supplies real, local specifics — route days, parking and gate access, soil and yard types,
 * actual jobs done there. That specificity is the entire reason a city page can rank; a page that
 * swaps the town name into the same paragraph is the doorway pattern with extra steps.
 *
 * NOTE on Philadelphia: Chestnut Hill, Mount Airy, Roxborough and East Falls are neighbourhoods of
 * Philadelphia, not municipalities. They are sections of ONE Philadelphia page, not four URLs.
 * See PLAN.md §2.
 */

import { servedAreaZips } from "./neighborhoods";
import { todo } from "./todo";
import type { City } from "./types";

export const cities: City[] = [
  {
    slug: "philadelphia",
    name: "Philadelphia",
    region: "PA",
    county: "Philadelphia County",
    zips: ["19118", "19119", "19127", "19128", "19129"],
    coords: { lat: 40.045, lng: -75.2 },
    /**
     * Manayunk joined the four on 2026-08-13, with its zip. It was already in the coverage list in
     * content/neighborhoods.ts and already inside the drawn map; the only place it was missing was
     * the page that names Philadelphia's neighbourhoods, which is the one a Manayunk resident
     * actually reads.
     */
    neighborhoods: ["Chestnut Hill", "Mount Airy", "Roxborough", "Manayunk", "East Falls"],
    seo: {
      title: todo("Dog Poop Removal in Philadelphia, PA | Blue's Poop Scoop"),
      description: todo(
        "Weekly pooper scooper service in Chestnut Hill, Mount Airy, Roxborough, Manayunk and East Falls. Reliable, insured, and local.",
      ),
    },
    body: [],
  },
  {
    slug: "ardmore",
    name: "Ardmore",
    region: "PA",
    county: "Montgomery County",
    zips: ["19003"],
    coords: { lat: 40.0068, lng: -75.2899 },
    seo: {
      title: todo("Dog Poop Removal in Ardmore, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Ardmore. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "bala-cynwyd",
    name: "Bala Cynwyd",
    region: "PA",
    county: "Montgomery County",
    zips: ["19004"],
    coords: { lat: 40.009, lng: -75.2338 },
    seo: {
      title: todo("Dog Poop Removal in Bala Cynwyd, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Bala Cynwyd. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "bryn-mawr",
    name: "Bryn Mawr",
    region: "PA",
    county: "Montgomery County",
    zips: ["19010"],
    coords: { lat: 40.0232, lng: -75.3157 },
    seo: {
      title: todo("Dog Poop Removal in Bryn Mawr, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Bryn Mawr. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "gladwyne",
    name: "Gladwyne",
    region: "PA",
    county: "Montgomery County",
    zips: ["19035"],
    coords: { lat: 40.0437, lng: -75.2779 },
    seo: {
      title: todo("Dog Poop Removal in Gladwyne, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Gladwyne. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "glenside",
    name: "Glenside",
    region: "PA",
    county: "Montgomery County",
    zips: ["19038"],
    coords: { lat: 40.1023, lng: -75.1524 },
    seo: {
      title: todo("Dog Poop Removal in Glenside, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Glenside. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "haverford",
    name: "Haverford",
    region: "PA",
    county: "Delaware County",
    zips: ["19041"],
    coords: { lat: 40.0104, lng: -75.3063 },
    seo: {
      title: todo("Dog Poop Removal in Haverford, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Haverford. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "narberth",
    name: "Narberth",
    region: "PA",
    county: "Montgomery County",
    zips: ["19072"],
    coords: { lat: 40.009, lng: -75.261 },
    seo: {
      title: todo("Dog Poop Removal in Narberth, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Narberth. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "villanova",
    name: "Villanova",
    region: "PA",
    county: "Delaware County",
    zips: ["19085"],
    coords: { lat: 40.0373, lng: -75.3438 },
    seo: {
      title: todo("Dog Poop Removal in Villanova, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Villanova. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "wynnewood",
    name: "Wynnewood",
    region: "PA",
    county: "Montgomery County",
    zips: ["19096"],
    coords: { lat: 40.0079, lng: -75.2732 },
    seo: {
      title: todo("Dog Poop Removal in Wynnewood, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Wynnewood. Local, insured, and reliable."),
    },
    body: [],
  },
];

export const cityBySlug = new Map(cities.map((city) => [city.slug, city]));

/**
 * `philadelphiaZips` USED TO LIVE HERE — all forty-seven zips inside the city line, on the theory
 * that the van reached the whole city. It was removed on 2026-08-07, when the client sent the
 * actual coverage list: ten Philadelphia NEIGHBOURHOODS, not the city. South Philadelphia, the
 * Northeast and Center City were never served, and the site had been drawing them on the map and
 * accepting their zips on the quote form for months.
 *
 * The footprint now lives in `servedAreaZips` (content/neighborhoods.ts), which carries the whole
 * territory — the ten neighbourhoods and the thirty-odd suburbs — as one list with a name against
 * every zip. That is the file to edit when a route changes.
 */

/**
 * Every zip the business serves: the city pages' own zips UNIONED with the coverage list,
 * de-duplicated and sorted. Derived — never maintained as a separate list.
 *
 * This is what the lead form is checked against (see lib/validation.ts), so an entry missing here
 * is a real customer being told we do not come to their street — and an entry that should not be
 * here is a lead we cannot actually service being told we can.
 *
 * The union is not redundant: every city page's zip is also in the coverage list today, but a city
 * page is allowed to exist for a place the coverage list has not caught up with, and the form
 * should never reject a zip the site has a whole page about.
 */
export const servicedZips: string[] = [
  ...new Set([...cities.flatMap((city) => city.zips), ...servedAreaZips]),
].sort();

/** Plain-language coverage summary, for schema `areaServed` and the footer. */
export const areaServedNames: string[] = cities.map((city) => `${city.name}, ${city.region}`);

/**
 * Every place we serve, by NAME, each pointing at the page that covers it.
 *
 * This is the zip list said in English, and it exists because a zip code is a terrible thing to
 * ask somebody to recognise. "Do you come to Narberth?" is the question people actually have;
 * "is 19072 on the list?" is a lookup they have to perform.
 *
 * ── Why this is not just `cities.map(c => c.name)` ───────────────────────────
 * Every one of the fifty-six serviced zips resolves, at USPS city level, to one of the ten towns
 * in `cities` — checked, not assumed: the forty-seven Philadelphia zips all carry the preferred
 * city name "Philadelphia". So a list of town names is COMPLETE and also nearly useless, because
 * "Philadelphia" standing alone tells a Roxborough resident nothing about whether we cross the
 * Schuylkill. Philadelphia is therefore expanded into the neighbourhoods its page actually names.
 *
 * ── What this list still understates ────────────────────────────────────────
 * The footprint is the whole city; the four neighbourhoods here are the four `philadelphia` has
 * written copy for. Someone in Fishtown is inside `servicedZips` and will not find their name
 * below. That gap is why the band that renders this carries a "don't see yours, ask us" line, and
 * it closes properly only when the client tells us which neighbourhoods they actually want named.
 * Guessing at forty more from a zip map would be inventing coverage claims on their behalf.
 */
export const servicedPlaces: { name: string; slug: string }[] = cities.flatMap((city) => [
  { name: city.name, slug: city.slug },
  ...(city.neighborhoods ?? []).map((name) => ({ name, slug: city.slug })),
]);
