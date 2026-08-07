/**
 * EVERY PLACE THE VAN GOES, by name and by zip. Client-supplied 2026-08-06; the zips were resolved
 * and verified 2026-08-07 (see "Where the zips came from" below).
 *
 * ── Why this file exists rather than forty more city pages ───────────────────
 * The client asked what the best way to handle a long coverage list is. This is the answer, and
 * the reasoning matters more than the list:
 *
 * A page per town is the obvious move and it is the wrong one at this size. Ten town pages with
 * real, different copy on them is an asset; forty-four pages that differ only in which name got
 * swapped into the same three paragraphs is the doorway-page pattern, which Google names in its
 * spam policies and which — more to the point — is forty-four pages a small business now has to
 * keep true. The moment a route changes, thirty of them are lying.
 *
 * So coverage is split into two things that are genuinely different:
 *
 *   · `content/cities.ts` — the places with a PAGE. Ten today, each earning its URL by saying
 *     something only true of that town. Adding an eleventh is a decision, and it costs somebody an
 *     afternoon of writing.
 *   · this file — the places we SERVE. Forty-odd names, no pages, rendered as a plain list on
 *     /locations/. It costs one line to add a town and it can never go stale in more than one
 *     place.
 *
 * A visitor gets the same answer either way: they scan for their own town and find it. What they
 * do not get is a thin page pretending to be about Ambler.
 *
 * ── THIS FILE IS THE SERVICE AREA ────────────────────────────────────────────
 * The zips here are not decoration. Three things read them, and they are the three places coverage
 * has to agree with itself:
 *   · `servicedZips` in cities.ts, which is what the lead form checks a submission against.
 *   · the Google map on /locations/ and the homepage — scripts/build-service-area.mjs dissolves
 *     these zips into the shape it draws.
 *   · the zip chips on /pricing/.
 * Add a town here and all three follow. There is no second list to remember.
 *
 * ── Where the zips came from ─────────────────────────────────────────────────
 * Not from memory, and not from a lookup anybody has to trust:
 *   · Suburban towns: USPS place→zip via api.zippopotam.us, queried by the client's own spelling.
 *   · Philadelphia neighbourhoods have no USPS name of their own — every one of them is "PHILADELPHIA"
 *     to the Post Office — so each was geocoded with OpenStreetMap and the resulting point tested
 *     against the Census ZCTA polygons. Roxborough and West Oak Lane resolved that way and no other.
 *   · Where a town returned several zips, the PO-box-only ones were dropped by checking which have
 *     a Census ZCTA polygon at all. That is why Norristown keeps 19401 and 19403 but not 19404,
 *     and why Wayne is 19087 alone out of six.
 * A zip with no Census polygon cannot be drawn, so the build script throws rather than silently
 * shrinking the map — see scripts/build-service-area.mjs.
 */

/** One place we serve. `zips` is every ZCTA the name covers — usually one, occasionally two. */
export type ServedPlace = { name: string; zips: readonly string[] };

/**
 * The list, grouped the way somebody looks for themselves on it: their own side of the region
 * first. Groups are geography, not counties — "Montgomery County" is not how a person in Glenside
 * describes where they live, but "north of the city" is.
 *
 * Names are the client's own spellings. Where they sent a pair — "Rydal/Jenkintown",
 * "Narberth/Penn Valley" — the two are split, because a person scanning for "Penn Valley" should
 * find "Penn Valley" and not a compound they have to parse. Both halves carry the same zip, which
 * is exactly why the client wrote them as a pair.
 */
export const servedAreas: { group: string; places: readonly ServedPlace[] }[] = [
  {
    /**
     * TEN NEIGHBOURHOODS, NOT THE WHOLE CITY. This is the 2026-08-07 correction, and it shrank the
     * map rather than growing it: the site used to claim all forty-seven Philadelphia zips —
     * South Philly, the Northeast, Center City — none of which are on the client's list. The map
     * was drawing a territory the business does not actually serve.
     */
    group: "Philadelphia",
    places: [
      { name: "Chestnut Hill", zips: ["19118"] },
      { name: "Mount Airy", zips: ["19119"] },
      { name: "Roxborough", zips: ["19128"] },
      { name: "East Falls", zips: ["19129"] },
      { name: "Manayunk", zips: ["19127"] },
      { name: "Germantown", zips: ["19144"] },
      { name: "East Oak Lane", zips: ["19126"] },
      { name: "West Oak Lane", zips: ["19138"] },
      { name: "Ogontz", zips: ["19141"] },
      { name: "Overbrook", zips: ["19151"] },
    ],
  },
  {
    group: "The Main Line & Delaware County",
    places: [
      { name: "Ardmore", zips: ["19003"] },
      { name: "Bala Cynwyd", zips: ["19004"] },
      { name: "Bryn Mawr", zips: ["19010"] },
      { name: "Gladwyne", zips: ["19035"] },
      { name: "Haverford", zips: ["19041"] },
      { name: "Media", zips: ["19063"] },
      { name: "Merion Station", zips: ["19066"] },
      { name: "Narberth", zips: ["19072"] },
      { name: "Newtown Square", zips: ["19073"] },
      // Penn Valley shares Narberth's zip — the client named both, and both are what people call
      // where they live.
      { name: "Penn Valley", zips: ["19072"] },
      { name: "Swarthmore", zips: ["19081"] },
      { name: "Villanova", zips: ["19085"] },
      { name: "Wayne", zips: ["19087"] },
      { name: "Wynnewood", zips: ["19096"] },
    ],
  },
  {
    group: "North & west of the city",
    places: [
      { name: "Abington", zips: ["19001"] },
      { name: "Ambler", zips: ["19002"] },
      // Bethayres is a village inside Lower Moreland and shares Huntingdon Valley's zip.
      { name: "Bethayres", zips: ["19006"] },
      { name: "Blue Bell", zips: ["19422"] },
      { name: "Bryn Athyn", zips: ["19009"] },
      { name: "Cheltenham", zips: ["19012"] },
      { name: "Conshohocken", zips: ["19428"] },
      { name: "Dresher", zips: ["19025"] },
      { name: "Elkins Park", zips: ["19027"] },
      { name: "Flourtown", zips: ["19031"] },
      { name: "Fort Washington", zips: ["19034"] },
      { name: "Glenside", zips: ["19038"] },
      { name: "Hatboro", zips: ["19040"] },
      { name: "Huntingdon Valley", zips: ["19006"] },
      { name: "Jenkintown", zips: ["19046"] },
      { name: "Lansdale", zips: ["19446"] },
      { name: "Norristown", zips: ["19401", "19403"] },
      { name: "Oaks", zips: ["19456"] },
      { name: "Plymouth Meeting", zips: ["19462"] },
      // Rydal shares Jenkintown's zip — the client named them as a pair for that reason.
      { name: "Rydal", zips: ["19046"] },
      /**
       * "Springfield (Montco)" — the client's own qualifier, and it is load-bearing. A plain
       * "Springfield, PA" lookup returns 19064, which is Springfield in DELAWARE County and a
       * different township entirely. Springfield Township, Montgomery County is Oreland (19075),
       * Wyndmoor and Erdenheim, and Flourtown — which is already on this list in its own right.
       */
      { name: "Springfield", zips: ["19075"] },
      { name: "Willow Grove", zips: ["19090"] },
      { name: "Wyncote", zips: ["19095"] },
    ],
  },
];

/** Every name, flat. For counting and for anything that wants the list without the grouping. */
export const servedAreaNames: string[] = servedAreas.flatMap((area) =>
  area.places.map((place) => place.name),
);

/**
 * Every zip we serve, de-duplicated and sorted. THE service footprint — see the note above for
 * what reads it.
 */
export const servedAreaZips: string[] = [
  ...new Set(servedAreas.flatMap((area) => area.places.flatMap((place) => place.zips))),
].sort();
