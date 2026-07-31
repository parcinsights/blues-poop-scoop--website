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
    seo: {
      title: todo("Dog Poop Removal in Wynnewood, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Wynnewood. Local, insured, and reliable."),
    },
    body: [],
  },
];

export const cityBySlug = new Map(cities.map((city) => [city.slug, city]));

/** Every zip the business serves, derived — never maintained as a second list. */
export const servicedZips: string[] = cities.flatMap((city) => city.zips).sort();

/** Plain-language coverage summary, for schema `areaServed` and the footer. */
export const areaServedNames: string[] = cities.map((city) => `${city.name}, ${city.region}`);
