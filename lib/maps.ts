/**
 * The service-area map: a shape drawn around the towns we serve, with a pin on each one.
 *
 * Google's **Maps Static API** — a PNG requested by the browser as a plain `<img>`. The two
 * alternatives were both worse here:
 *
 *   - The **Embed API** (an iframe) is free, but it is only a viewport. It cannot draw a polygon
 *     or more than one pin, so it can show where Philadelphia is and not where we go.
 *   - The **Maps JavaScript API** can draw anything, and costs ~200KB of client JavaScript plus a
 *     billed map load per view, for a picture nobody on this page will pan or zoom. This site
 *     renders its FAQ with `<details>` rather than React state; a quarter-megabyte of Google on
 *     the landing page for a decorative map would be the single heaviest thing on it.
 *
 * The static image is requested BY THE BROWSER, not by us on the server, and that is deliberate:
 * a browser sends a `Referer` header, so the same HTTP-referrer restriction that protects the key
 * on the Embed API protects it here. Fetching it server-side and proxying the bytes would strip
 * that header and force an unrestricted key — a strictly worse trade for a saved request.
 *
 * ── DEFERRED: the key ────────────────────────────────────────────────────────
 * Needs: NEXT_PUBLIC_GOOGLE_MAPS_KEY, with **Maps Static API** enabled and listed in the key's
 * API restrictions, and an HTTP-referrer restriction locking it to the production domain. It is
 * public by design (it ships in the page source), so that restriction is the only thing protecting
 * it and is not optional.
 * On arrival: set the env var. No code change — the band renders its map instead of skipping it.
 */

import { cities } from "@/content/cities";
import { BRAND_HEX } from "@/lib/tokens";

type Point = { lat: number; lng: number };

/** The brand navy, restated in the `0xRRGGBB` form Google's colour parameters want. */
const brand = BRAND_HEX.replace("#", "0x");

/**
 * How far the drawn shape is pushed out past the towns themselves, as a multiple of each town's
 * distance from the middle of the territory.
 *
 * It is not decoration. A polygon whose corners sit exactly on ten town centres claims we stop at
 * the town hall, which is both wrong and unhelpful — the shape is meant to read as "this area",
 * and an area has to contain the towns rather than touch them. The value is judged by eye: enough
 * that no pin sits on the boundary, little enough that the shape does not swallow Center City.
 */
const OUTWARD_PAD = 1.3;

/**
 * The corners of the territory, in order, as a convex hull of the town centres.
 *
 * Andrew's monotone chain. Ten points, so the sort dominates and the algorithm is irrelevant to
 * performance; it is here because it is the one that is short enough to read.
 *
 * Convex is a real simplification: a genuine route map has dents in it, and this shape will always
 * include ground between the towns that we may not actually cover. That is why the map is never
 * the answer on its own — the band under it lists the towns by name, and the copy tells anyone in
 * between to ask. A shape that is honestly approximate beats a shape that is precisely wrong.
 */
function convexHull(points: readonly Point[]): Point[] {
  // x = longitude, y = latitude. Sorted west to east, then south to north.
  const sorted = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat);
  if (sorted.length < 3) return sorted;

  /** > 0 when the turn from a to b to c is counter-clockwise. */
  const cross = (a: Point, b: Point, c: Point) =>
    (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng);

  const half = (input: readonly Point[]) => {
    const chain: Point[] = [];
    for (const point of input) {
      // Drop the last corner for as long as it is a right turn — i.e. a dent, not a corner.
      for (;;) {
        const last = chain[chain.length - 1];
        const previous = chain[chain.length - 2];
        if (!previous || !last || cross(previous, last, point) > 0) break;
        chain.pop();
      }
      chain.push(point);
    }
    // The last point of each half is the first point of the other. Dropping it here is what keeps
    // the joined ring from naming both corners twice.
    chain.pop();
    return chain;
  };

  return [...half(sorted), ...half([...sorted].reverse())];
}

/**
 * Push every corner away from the middle of the territory.
 *
 * A degree of longitude at this latitude is about 77% of a degree of latitude on the ground, so
 * scaling both axes by the same number pads east-west slightly less than north-south. That is
 * left alone: the correction is smaller than the guesswork in `OUTWARD_PAD` itself, and this is a
 * soft blob around ten suburbs, not a survey.
 */
function padOutward(hull: readonly Point[]): Point[] {
  const middle = {
    lat: hull.reduce((sum, p) => sum + p.lat, 0) / hull.length,
    lng: hull.reduce((sum, p) => sum + p.lng, 0) / hull.length,
  };
  return hull.map((point) => ({
    lat: middle.lat + (point.lat - middle.lat) * OUTWARD_PAD,
    lng: middle.lng + (point.lng - middle.lng) * OUTWARD_PAD,
  }));
}

/** `40.0068,-75.2899`. Five decimals is about a metre — past that the URL grows for nothing. */
const asPair = (point: Point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`;

export type MapSize = {
  /** CSS pixels. Google caps a free static map at 640 in either direction before `scale`. */
  width: number;
  height: number;
};

/**
 * The image URL for one size, or `null` when no key is configured.
 *
 * Null rather than a broken image: an unauthorised static map comes back as a grey tile with
 * Google's own error text baked into the PNG, which looks like the site is broken rather than like
 * a feature that has not been switched on. The caller drops the map and keeps the town list, which
 * is the half that was doing the real work anyway.
 */
export function serviceAreaMapUrl({ width, height }: MapSize): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key) return null;

  const towns = cities.map((city) => city.coords);
  const outline = padOutward(convexHull(towns));

  const params = new URLSearchParams({
    size: `${width}x${height}`,
    /** Twice the pixels for the same map, so it is not soft on a phone or a retina laptop. */
    scale: "2",
    maptype: "roadmap",
    format: "png",
    language: "en",
    region: "US",
    key,
  });

  /**
   * The shape. `fillcolor` carries an alpha byte — `33` is 20%, dark enough to read as a region
   * and light enough that the road names and town labels underneath still show through, which is
   * the entire point of drawing it on a map rather than on a blank rectangle.
   *
   * No `center` and no `zoom`: given features and no viewport, Google fits the frame to the
   * features. That means the map re-frames itself when a town is added to content/cities.ts, and
   * nobody has to remember that a number in this file also decides what you can see.
   */
  params.append(
    "path",
    [`color:${brand}ff`, "weight:2", `fillcolor:${brand}33`, ...outline.map(asPair)].join("|"),
  );

  /**
   * A pin per town, appended after the shape so the pins draw on top of the fill.
   *
   * `size:small` is the dot without the teardrop: eleven full-size markers on a 640px map is a
   * pile of overlapping pins around Ardmore, and the label they would carry is unreadable at that
   * size anyway. The names are in the list under the map, where they are also links.
   */
  params.append("markers", [`size:small`, `color:${brand}`, ...towns.map(asPair)].join("|"));

  return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

/** Whether a map can be drawn at all. Lets a caller skip the frame without building a URL. */
export function serviceAreaMapIsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
}
