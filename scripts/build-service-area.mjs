/**
 * Turns the zip list in content/cities.ts into the actual shape of the territory.
 *
 * Google has no idea what a zip code looks like. Every Maps API takes coordinates, so "draw 19118"
 * is not a request any of them can answer — the boundary has to come from somewhere else and be
 * handed to Google as a path. That somewhere else is the US Census Bureau, which publishes ZCTA
 * polygons (ZIP Code Tabulation Areas: the Census's own areal approximation of a USPS delivery
 * route, and the only free authoritative shape a zip code has).
 *
 * What this does, in order:
 *   1. Downloads Pennsylvania's ZCTA boundaries (~48MB, so it is cached in .cache/ and downloaded
 *      once — the file is the whole state and we want fifty-six of eighteen hundred shapes).
 *   2. Keeps only the zips `servicedZips` actually names.
 *   3. Dissolves them into ONE polygon. This is the step that matters: fifty-six outlined zips are
 *      a mesh of lines nobody can read, and a static map cannot label them. Unioned, the internal
 *      borders vanish and what is left is a single region — which is the claim the page is making.
 *   4. Simplifies it, then encodes it as a Google polyline.
 *
 * Output: content/service-area.ts, checked in. The site never does any of this at runtime; it
 * reads one string.
 *
 * Re-run with `node scripts/build-service-area.mjs` whenever the zip list changes. There is a test
 * that fails if you forget (see lib/maps.test.ts) — the generated file carries the zip list it was
 * built from, and the test compares it against the live one.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

import { featureCollection } from "@turf/helpers";
import simplify from "@turf/simplify";
import { union } from "@turf/union";

/**
 * Census ZCTA boundaries for Pennsylvania, via the OpenDataDE mirror.
 *
 * The Census's own TIGER downloads are a national shapefile — a zip of a binary format that needs
 * a converter before any of this can start. This mirror is the same data, per state, already
 * GeoJSON. If it ever disappears, the equivalent is `tl_2020_us_zcta520.zip` from
 * https://www2.census.gov/geo/tiger/, converted with `ogr2ogr -f GeoJSON`.
 */
const SOURCE =
  "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/pa_pennsylvania_zip_codes_geo.min.json";

const CACHE_DIR = ".cache";
const CACHE_FILE = `${CACHE_DIR}/pa-zcta.json`;
const OUT = "content/service-area.ts";

/**
 * How much detail is thrown away, in degrees. 0.0005° is about 55 metres at this latitude.
 *
 * The whole territory is roughly 40km across and the map it draws is 640px wide, so one pixel is
 * about 60 metres — the tolerance is deliberately set at the point where removing a vertex cannot
 * move the line by a whole pixel. It takes the outline from 4,000 points to ~300, and the encoded
 * string from 18KB to 1.3KB, for a shape that is pixel-identical at the size anyone will see it.
 */
const TOLERANCE = 0.0005;

// ── The zip list, read out of content/cities.ts rather than repeated ─────────

/**
 * `servicedZips` is derived at runtime from two arrays and a Set, so it cannot simply be imported
 * into a plain .mjs script without a TypeScript loader. Re-deriving it here by the same rule keeps
 * the script dependency-free; the test in lib/maps.test.ts is what guarantees the two agree.
 */
function readServicedZips() {
  const source = readFileSync("content/cities.ts", "utf8");
  const quoted = (block) => [...block.matchAll(/"(\d{5})"/g)].map((m) => m[1]);

  const cityZips = [...source.matchAll(/zips:\s*\[([^\]]*)\]/g)].flatMap((m) => quoted(m[1]));
  const philadelphia = quoted(
    source.match(/export const philadelphiaZips[^=]*=\s*\[([\s\S]*?)\]/)?.[1] ?? "",
  );

  const all = [...new Set([...cityZips, ...philadelphia])].sort();
  if (all.length < 10) throw new Error(`Only found ${all.length} zips in content/cities.ts`);
  return all;
}

// ── Source data ──────────────────────────────────────────────────────────────

async function loadBoundaries() {
  if (existsSync(CACHE_FILE)) return JSON.parse(readFileSync(CACHE_FILE, "utf8"));

  process.stdout.write(`Downloading ${SOURCE}\n`);
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`${response.status} from the boundary source`);
  const body = await response.text();

  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, body);
  return JSON.parse(body);
}

// ── Google's polyline encoding ───────────────────────────────────────────────

/**
 * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 *
 * Deltas between successive points at five decimal places, zig-zagged so negatives stay small, and
 * base64-ish in 5-bit chunks. Successive points on a boundary are metres apart, so nearly every
 * coordinate encodes in two or three characters instead of the twenty a `lat,lng` pair costs. That
 * is the difference between a URL Google accepts and one it rejects.
 */
function encodePolyline(ring) {
  const chunk = (value) => {
    let v = value < 0 ? ~(value << 1) : value << 1;
    let out = "";
    while (v >= 0x20) {
      out += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
      v >>= 5;
    }
    return out + String.fromCharCode(v + 63);
  };

  let previousLat = 0;
  let previousLng = 0;
  let out = "";
  for (const [lng, lat] of ring) {
    const nextLat = Math.round(lat * 1e5);
    const nextLng = Math.round(lng * 1e5);
    out += chunk(nextLat - previousLat) + chunk(nextLng - previousLng);
    previousLat = nextLat;
    previousLng = nextLng;
  }
  return out;
}

// ── Build ────────────────────────────────────────────────────────────────────

const zips = readServicedZips();
const boundaries = await loadBoundaries();

const matched = boundaries.features.filter((f) => zips.includes(f.properties.ZCTA5CE10));
const missing = zips.filter((z) => !matched.some((f) => f.properties.ZCTA5CE10 === z));
if (missing.length) throw new Error(`No Census boundary for: ${missing.join(", ")}`);

const dissolved = union(featureCollection(matched));
const simplified = simplify(dissolved, { tolerance: TOLERANCE, highQuality: true });

/**
 * The rings, largest first. Ring 0 is the territory.
 *
 * A dissolved set of zips can come back with holes — a zip that is entirely surrounded by served
 * ones but is not itself served. Right now that is 19066, Merion Station, ringed by Bala Cynwyd,
 * Narberth and Wynnewood. Only the outer ring is exported, because the Maps Static API has no way
 * to cut a hole out of a filled path: every path is drawn, none subtracts. So a hole would have to
 * be faked by painting over the fill, which on a road map means painting over the roads.
 *
 * The count is reported so that an added hole is not silent. If one appears that is big enough to
 * matter, the honest fix is the zip list, not the drawing.
 */
const rings =
  simplified.geometry.type === "MultiPolygon"
    ? simplified.geometry.coordinates.flat()
    : simplified.geometry.coordinates;
const outer = rings[0];
const encoded = encodePolyline(outer);

const lats = outer.map((p) => p[1]);
const lngs = outer.map((p) => p[0]);
const round = (n) => Number(n.toFixed(5));

const file = `/**
 * GENERATED by scripts/build-service-area.mjs — do not edit by hand.
 *
 * The outline of every serviced zip, dissolved into one shape and encoded as a Google polyline.
 * Re-run the script after changing the zip list in cities.ts; lib/maps.test.ts fails if you don't.
 *
 * Source: US Census ZCTA (ZIP Code Tabulation Area) boundaries, simplified to ${TOLERANCE}°.
 */

/** The territory, as a Google-encoded polyline. Feeds \`path=enc:\` on the Maps Static API. */
export const serviceAreaOutline =
  ${JSON.stringify(encoded)};

/** South-west and north-east corners, for anything that needs to frame the shape itself. */
export const serviceAreaBounds = {
  south: ${round(Math.min(...lats))},
  west: ${round(Math.min(...lngs))},
  north: ${round(Math.max(...lats))},
  east: ${round(Math.max(...lngs))},
};

/** The zips this shape was built from. Compared against \`servicedZips\` by the test. */
export const serviceAreaZips: string[] = [
${zips.map((z) => `  "${z}",`).join("\n")}
];
`;

writeFileSync(OUT, file);

process.stdout.write(
  `${OUT}: ${zips.length} zips → ${outer.length} points, ${encoded.length} chars` +
    (rings.length > 1 ? `, ${rings.length - 1} hole(s) dropped` : "") +
    "\n",
);
