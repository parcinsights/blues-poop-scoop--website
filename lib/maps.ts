/**
 * The service-area map: the real outline of every zip code we serve, drawn as one shape.
 *
 * Google's **Maps Static API** — a PNG requested by the browser as a plain `<img>`. The two
 * alternatives were both worse here:
 *
 *   - The **Embed API** (an iframe) is free, but it is only a viewport. It cannot draw a polygon
 *     or more than one pin, so it can show where Philadelphia is and not where we go.
 *   - The **Maps JavaScript API** can draw anything, and costs ~200KB of client JavaScript plus a
 *     billed map load per view, for a picture nobody on this page will pan or zoom. This site
 *     renders its FAQ with `<details>` rather than React state; a quarter-megabyte of Google on
 *     a page for a map that answers one yes-or-no question would be the heaviest thing on it.
 *
 * The static image is requested BY THE BROWSER, not by us on the server, and that is deliberate:
 * a browser sends a `Referer` header, so the same HTTP-referrer restriction that protects the key
 * on the Embed API protects it here. Fetching it server-side and proxying the bytes would strip
 * that header and force an unrestricted key — a strictly worse trade for a saved request.
 *
 * ── Where the shape comes from ───────────────────────────────────────────────
 * No Maps API knows what a zip code looks like; they all take coordinates. So the boundary is
 * built ahead of time from US Census ZCTA data by scripts/build-service-area.mjs, dissolved into
 * a single region, and checked in as one encoded string. Nothing is computed here at request time
 * and nothing is fetched from the Census at runtime — see content/service-area.ts.
 *
 * This replaced a convex hull drawn around the ten town centres. The hull was a guess with a
 * fudge factor in it that claimed ground we do not cover and cut corners off ground we do; this is
 * the actual footprint, to about fifty metres.
 *
 * ── DEFERRED: the key ────────────────────────────────────────────────────────
 * Needs: NEXT_PUBLIC_GOOGLE_MAPS_KEY, with **Maps Static API** enabled and listed in the key's
 * API restrictions, and an HTTP-referrer restriction locking it to the production domain. It is
 * public by design (it ships in the page source), so that restriction is the only thing protecting
 * it and is not optional.
 *
 * As of writing the key exists but the API is NOT enabled on its Cloud project — a request comes
 * back 403 with "This API is not activated". An unauthorised static map is not a blank space: it
 * is a grey tile with Google's error text baked into the PNG, which looks like a broken site. That
 * is what `NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED` below is for.
 */

import { serviceAreaOutlines } from "@/content/service-area";
import { BRAND_HEX } from "@/lib/tokens";

/** The brand navy, restated in the `0xRRGGBB` form Google's colour parameters want. */
const brand = BRAND_HEX.replace("#", "0x");

/** Google's documented ceiling on a Maps Static API request. */
const MAX_URL_LENGTH = 16_384;

export type MapSize = {
  /** CSS pixels. Google caps a free static map at 640 in either direction before `scale`. */
  width: number;
  height: number;
};

/**
 * The image URL for one size, or `null` when the map is switched off.
 *
 * Null rather than a broken image: the caller drops the map and keeps the town list, which is the
 * half that was doing the real work anyway.
 */
export function serviceAreaMapUrl({ width, height }: MapSize): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  if (!key || !serviceAreaMapIsConfigured()) return null;

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
   * The territory, as ONE PATH PER DISJOINT REGION. `enc:` is the encoded-polyline form — the same
   * points spelled out as `lat,lng` pairs would be a 30KB URL, and this is about 3KB.
   *
   * Several paths rather than one because the coverage area is not contiguous — Media and
   * Swarthmore are separated from the rest by unserved ground. A single path could only have been
   * the largest piece, which silently dropped two places we actually serve. See
   * scripts/build-service-area.mjs.
   *
   * `fillcolor` carries an alpha byte: `33` is 20%, dark enough to read as a region and light
   * enough that the road names and town labels underneath still show through, which is the entire
   * point of drawing it on a map rather than on a blank rectangle. `weight:2` keeps the edge
   * legible where the fill against cream is not.
   *
   * No `center` and no `zoom`: given paths and no viewport, Google fits the frame to all of them.
   * The map therefore re-frames itself when the boundary changes, and no number in this file
   * secretly decides what you can see.
   */
  for (const outline of serviceAreaOutlines) {
    params.append(
      "path",
      [`color:${brand}ff`, "weight:2", `fillcolor:${brand}33`, `enc:${outline}`].join("|"),
    );
  }

  const url = `https://maps.googleapis.com/maps/api/staticmap?${params}`;

  /**
   * Google rejects a static-map request over 16,384 characters, and every added region spends the
   * budget. Returning null rather than a URL that 4xxs keeps the failure in the shape every other
   * failure here already takes: the band drops the map and keeps the town list, which was the half
   * doing the real work. If this ever fires, raise `TOLERANCE` in the build script.
   */
  if (url.length > MAX_URL_LENGTH) return null;

  return url;
}

/**
 * Whether a map can be drawn at all.
 *
 * Two gates, not one, because a key being present does not mean the API behind it answers. The
 * Static API is enabled per Cloud project and billing has to be attached; until someone has done
 * that in the console, the key in .env.local produces a 403 image rather than no image. There is
 * no way to find that out from here without making the request, and the request is the browser's.
 *
 * So switching the map on is deliberate: set NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED=true once the
 * API is actually activated. The default is off, which is the state that fails safe.
 */
export function serviceAreaMapIsConfigured(): boolean {
  return (
    Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED === "true"
  );
}
