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
 * `servicedZips` is derived at runtime from two files and a Set, so it cannot simply be imported
 * into a plain .mjs script without a TypeScript loader. Re-deriving it here by the same rule keeps
 * the script dependency-free; the test in lib/maps.test.ts is what guarantees the two agree.
 *
 * BOTH FILES, and they are different things. `content/cities.ts` holds the ten places with a page
 * of their own; `content/neighborhoods.ts` holds the whole coverage list. The union of the two is
 * the territory, exactly as `servicedZips` computes it. Every `zips:` array in either file counts,
 * which is the same rule read twice rather than a list maintained twice.
 */
function readServicedZips() {
  const sources = ["content/cities.ts", "content/neighborhoods.ts"].map((path) =>
    readFileSync(path, "utf8"),
  );

  const all = [
    ...new Set(
      sources.flatMap((source) =>
        [...source.matchAll(/zips:\s*\[([^\]]*)\]/g)].flatMap((m) =>
          [...m[1].matchAll(/"(\d{5})"/g)].map((z) => z[1]),
        ),
      ),
    ),
  ].sort();

  if (all.length < 10) throw new Error(`Only found ${all.length} zips across the content files`);
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
 * ── Every disjoint region, not just the biggest one ──────────────────────────
 *
 * The territory is no longer one blob. Until 2026-08-07 it was — the zip list was the whole of
 * Philadelphia plus a contiguous run of Main Line towns — so exporting `rings[0]` and calling it
 * "the territory" was true. The real coverage list is not contiguous: Media and Swarthmore sit
 * across a gap of unserved ground from everything else, and exporting only the largest ring
 * silently deleted them from the map. A place we serve, missing from the picture of where we
 * serve, is the one failure this map exists to prevent.
 *
 * So each POLYGON's outer ring is exported, and lib/maps.ts draws one `path=` per ring. Google's
 * Static API takes as many as the URL can hold.
 *
 * HOLES ARE STILL DROPPED, and that is a genuine limitation rather than a decision: the Static API
 * has no way to cut a hole out of a filled path — every path is drawn, none subtracts — so an
 * unserved pocket ringed by served ground gets painted over. Faking it means drawing the hole in
 * the map's own background colour, which on a road map means painting over the roads. The total
 * hole area is reported below; today it is about 2.5% of the territory, and the honest fix if that
 * ever grows is the zip list rather than the drawing.
 *
 * Slivers under MIN_AREA are dropped too. They are simplification artefacts — a few thousand square
 * metres, well under one pixel at the size anyone sees this — and each one costs URL budget.
 */
const MIN_AREA_KM2 = 0.25;

/** Shoelace, in square kilometres at this latitude. Only ever compared against MIN_AREA_KM2. */
const DEG2_TO_KM2 = 111.32 * 111.32 * Math.cos((40 * Math.PI) / 180);
function ringArea(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(sum / 2) * DEG2_TO_KM2;
}

const polygons =
  simplified.geometry.type === "MultiPolygon"
    ? simplified.geometry.coordinates
    : [simplified.geometry.coordinates];

const holes = polygons.flatMap((polygon) => polygon.slice(1));
const kept = polygons
  .map((polygon) => polygon[0])
  .filter((ring) => ringArea(ring) >= MIN_AREA_KM2)
  .sort((a, b) => ringArea(b) - ringArea(a));

if (kept.length === 0) throw new Error("No region survived the minimum-area filter");

const encodedRings = kept.map(encodePolyline);

const points = kept.flat();
const lats = points.map((p) => p[1]);
const lngs = points.map((p) => p[0]);
const round = (n) => Number(n.toFixed(5));

const file = `/**
 * GENERATED by scripts/build-service-area.mjs — do not edit by hand.
 *
 * The outline of every serviced zip, dissolved and encoded as Google polylines. Re-run the script
 * after changing a zip list in content/; lib/maps.test.ts fails if you don't.
 *
 * Source: US Census ZCTA (ZIP Code Tabulation Area) boundaries, simplified to ${TOLERANCE}°.
 */

/**
 * The territory, as one Google-encoded polyline PER DISJOINT REGION, largest first. Each feeds its
 * own \`path=enc:\` on the Maps Static API — see lib/maps.ts.
 *
 * More than one because the coverage area is not contiguous: ${encodedRings.length} separate pieces today.
 */
export const serviceAreaOutlines: string[] = [
${encodedRings.map((ring) => `  ${JSON.stringify(ring)},`).join("\n")}
];

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

const totalChars = encodedRings.reduce((sum, ring) => sum + ring.length, 0);
const holeArea = holes.reduce((sum, ring) => sum + ringArea(ring), 0);
const keptArea = kept.reduce((sum, ring) => sum + ringArea(ring), 0);

process.stdout.write(
  `${OUT}: ${zips.length} zips → ${kept.length} region(s), ` +
    `${points.length} points, ${totalChars} chars\n` +
    `  dropped ${polygons.length - kept.length} sliver(s) under ${MIN_AREA_KM2} km²\n` +
    `  ${holes.length} hole(s) painted over: ${holeArea.toFixed(1)} km² of ${keptArea.toFixed(0)} ` +
    `(${((100 * holeArea) / keptArea).toFixed(1)}% — the Static API cannot subtract a path)\n`,
);
