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

import { todo } from "./todo";
import type { City } from "./types";

export const cities: City[] = [
  {
    slug: "philadelphia",
    name: "Philadelphia",
    region: "PA",
    county: "Philadelphia County",
    zips: ["19118", "19119", "19128", "19129"],
    coords: { lat: 40.045, lng: -75.2 },
    neighborhoods: ["Chestnut Hill", "Mount Airy", "Roxborough", "East Falls"],
    seo: {
      title: todo("Dog Poop Removal in Philadelphia, PA | Blue's Poop Scoop"),
      description: todo(
        "Weekly pooper scooper service in Chestnut Hill, Mount Airy, Roxborough and East Falls. Reliable, insured, and local.",
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
 * Every zip inside the Philadelphia city line that the truck reaches — client-supplied, and much
 * wider than the four `philadelphia` carries above.
 *
 * The two lists are not the same fact and must not be merged into one. A `City.zips` array is what
 * that CITY PAGE is about: /locations/philadelphia/ covers Chestnut Hill, Mount Airy, Roxborough
 * and East Falls, and putting South Philly's 19148 in it would claim the page speaks for a
 * neighbourhood it never mentions. This is the SERVICE FOOTPRINT: where a van will actually drive,
 * whether or not a page exists for the street. Coverage is the bigger set, and the difference is
 * why /pricing/ lists zips rather than town names.
 *
 * There is no Main Line zip here — those live on their own city entries and arrive via the union
 * below.
 */
export const philadelphiaZips: string[] = [
  "19102", "19103", "19104", "19106", "19107", "19109", "19111", "19114",
  "19115", "19116", "19118", "19119", "19120", "19121", "19122", "19123",
  "19124", "19125", "19126", "19127", "19128", "19129", "19130", "19131",
  "19132", "19133", "19134", "19135", "19136", "19137", "19138", "19139",
  "19140", "19141", "19142", "19143", "19144", "19145", "19146", "19147",
  "19148", "19149", "19150", "19151", "19152", "19153", "19154",
];

/**
 * Every zip the business serves: the city pages' own zips UNIONED with the Philadelphia footprint,
 * de-duplicated and sorted. Derived — never maintained as a third list.
 *
 * This is what the lead form is checked against (see lib/validation.ts), so an entry missing here
 * is a real customer being told we do not come to their street.
 */
export const servicedZips: string[] = [
  ...new Set([...cities.flatMap((city) => city.zips), ...philadelphiaZips]),
].sort();

/** Plain-language coverage summary, for schema `areaServed` and the footer. */
export const areaServedNames: string[] = cities.map((city) => `${city.name}, ${city.region}`);
