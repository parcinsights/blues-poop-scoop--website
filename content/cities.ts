/**
 * The places this business serves. One entry = one page at /locations/[slug]/.
 *
 * Zip codes are verified from the client's existing site. Copy is placeholder until the owner
 * supplies real, local specifics — route days, parking and gate access, soil and yard types,
 * actual jobs done there. That specificity is the entire reason a city page can rank; a page that
 * swaps the town name into the same paragraph is the doorway pattern with extra steps.
 *
 * NOTE on Philadelphia: Chestnut Hill, Mount Airy and East Falls are neighbourhoods of Philadelphia,
 * not municipalities. They are sections of ONE Philadelphia page rather than three URLs. See
 * PLAN.md §2.
 *
 * ROXBOROUGH AND MANAYUNK ARE THE EXCEPTIONS, at the client's request (2026-08-13). They are
 * neighbourhoods by the same definition, and they have pages of their own anyway, because both are
 * how people there name where they live and both carry a zip nobody else on this list does —
 * 19128 and 19127. Their zips came OFF the Philadelphia entry when they got pages; a zip listed on
 * two pages is two pages claiming the same ground, and the "zip codes we cover in X" band on each
 * would then be lying on one of them.
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
    /**
     * Three zips, not five. Roxborough (19128) and Manayunk (19127) moved to their own entries on
     * 2026-08-13 — see the note at the top of this file. The city page keeps the three
     * neighbourhoods that do not have a page to go to.
     */
    zips: ["19118", "19119", "19129"],
    coords: { lat: 40.045, lng: -75.2 },
    neighborhoods: ["Chestnut Hill", "Mount Airy", "East Falls"],
    seo: {
      title: todo("Dog Poop Removal in Philadelphia, PA | Blue's Poop Scoop"),
      description: todo(
        "Weekly pooper scooper service in Chestnut Hill, Mount Airy and East Falls. Reliable, insured, and local.",
      ),
    },
    body: [],
  },
  /**
   * ── TEN TOWNS ADDED 2026-08-13, at the client's request ────────────────────
   * Abington, Ambler, Blue Bell, Flourtown, Fort Washington, Jenkintown, Manayunk, Plymouth
   * Meeting, Roxborough and Willow Grove. Every one of them was already in the coverage list in
   * content/neighborhoods.ts — the client asked for the ten they get asked about by name to have a
   * page, a chip in "Where we scoop", and a line in the footer, which is what an entry here buys.
   *
   * THEY SHIP NOINDEXED, exactly like the ten that came before them, and that is the guard working
   * rather than a thing left undone: `body: []` renders the page for review, marks it noindex and
   * keeps it out of the sitemap until somebody writes the part that is actually about the town.
   * Twenty pages differing only in a swapped place name is the pattern this whole file argues
   * against — see the note in content/pages/city-page.ts for what a body has to contain to count.
   * The links work today; the pages earn the index one at a time.
   */
  {
    slug: "abington",
    name: "Abington",
    region: "PA",
    county: "Montgomery County",
    zips: ["19001"],
    coords: { lat: 40.1204, lng: -75.118 },
    seo: {
      title: todo("Dog Poop Removal in Abington, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Abington. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "ambler",
    name: "Ambler",
    region: "PA",
    county: "Montgomery County",
    zips: ["19002"],
    coords: { lat: 40.1548, lng: -75.2213 },
    seo: {
      title: todo("Dog Poop Removal in Ambler, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Ambler. Local, insured, and reliable."),
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
    slug: "blue-bell",
    name: "Blue Bell",
    region: "PA",
    county: "Montgomery County",
    zips: ["19422"],
    coords: { lat: 40.152, lng: -75.2663 },
    seo: {
      title: todo("Dog Poop Removal in Blue Bell, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Blue Bell. Local, insured, and reliable."),
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
    slug: "flourtown",
    name: "Flourtown",
    region: "PA",
    county: "Montgomery County",
    zips: ["19031"],
    coords: { lat: 40.1043, lng: -75.2119 },
    seo: {
      title: todo("Dog Poop Removal in Flourtown, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Flourtown. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "fort-washington",
    name: "Fort Washington",
    region: "PA",
    county: "Montgomery County",
    zips: ["19034"],
    coords: { lat: 40.1418, lng: -75.2093 },
    seo: {
      title: todo("Dog Poop Removal in Fort Washington, PA | Blue's Poop Scoop"),
      description: todo(
        "Weekly pet waste removal in Fort Washington. Local, insured, and reliable.",
      ),
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
    slug: "jenkintown",
    name: "Jenkintown",
    region: "PA",
    county: "Montgomery County",
    /** 19046 is Jenkintown and Rydal both — the pair the client sent together, and one zip. */
    zips: ["19046"],
    coords: { lat: 40.0954, lng: -75.1252 },
    seo: {
      title: todo("Dog Poop Removal in Jenkintown, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Jenkintown. Local, insured, and reliable."),
    },
    body: [],
  },
  {
    slug: "manayunk",
    name: "Manayunk",
    region: "PA",
    /**
     * A Philadelphia neighbourhood with its own page — see the note at the top of this file. The
     * county is the city, and the standfirst reads "Manayunk and the rest of Philadelphia County",
     * which is the true sentence: this is not a township.
     */
    county: "Philadelphia County",
    zips: ["19127"],
    coords: { lat: 40.0257, lng: -75.2262 },
    seo: {
      title: todo("Dog Poop Removal in Manayunk, Philadelphia | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Manayunk. Local, insured, and reliable."),
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
    slug: "plymouth-meeting",
    name: "Plymouth Meeting",
    region: "PA",
    county: "Montgomery County",
    zips: ["19462"],
    coords: { lat: 40.1043, lng: -75.2757 },
    seo: {
      title: todo("Dog Poop Removal in Plymouth Meeting, PA | Blue's Poop Scoop"),
      description: todo(
        "Weekly pet waste removal in Plymouth Meeting. Local, insured, and reliable.",
      ),
    },
    body: [],
  },
  {
    slug: "roxborough",
    name: "Roxborough",
    region: "PA",
    /** Philadelphia, like Manayunk below it on the map and above it on this list. */
    county: "Philadelphia County",
    zips: ["19128"],
    coords: { lat: 40.0399, lng: -75.2247 },
    seo: {
      title: todo("Dog Poop Removal in Roxborough, Philadelphia | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Roxborough. Local, insured, and reliable."),
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
    slug: "willow-grove",
    name: "Willow Grove",
    region: "PA",
    county: "Montgomery County",
    zips: ["19090"],
    coords: { lat: 40.144, lng: -75.1146 },
    seo: {
      title: todo("Dog Poop Removal in Willow Grove, PA | Blue's Poop Scoop"),
      description: todo("Weekly pet waste removal in Willow Grove. Local, insured, and reliable."),
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
 * Philadelphia's zips all carry one USPS city name — "Philadelphia" — and that name standing alone
 * tells a Chestnut Hill resident nothing about whether we cross the Schuylkill. So the city entry
 * is expanded into the neighbourhoods its page actually names, and every other entry is itself.
 * Roxborough and Manayunk are no longer among the expanded ones; they have pages of their own now,
 * so they arrive here as towns rather than as sections of Philadelphia's.
 *
 * ── What this list still understates ────────────────────────────────────────
 * This is the twenty places with a PAGE, not the sixty-odd we serve. Someone in Elkins Park is
 * inside `servicedZips`, is named on /locations/ from content/neighborhoods.ts, and still will not
 * find themselves in these chips — which is why the band that renders them says so, and why the
 * full coverage list sits directly underneath it.
 */
export const servicedPlaces: { name: string; slug: string }[] = cities.flatMap((city) => [
  { name: city.name, slug: city.slug },
  ...(city.neighborhoods ?? []).map((name) => ({ name, slug: city.slug })),
]);
