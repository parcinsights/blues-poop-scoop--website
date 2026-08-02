import { describe, expect, it } from "vitest";

import { servicedZips } from "@/content/cities";
import { serviceAreaBounds, serviceAreaOutline, serviceAreaZips } from "@/content/service-area";
import { serviceAreaMapUrl } from "@/lib/maps";

/**
 * The service-area outline is generated, checked in, and therefore able to go quietly stale: add a
 * zip to content/cities.ts, forget to re-run scripts/build-service-area.mjs, and the site keeps
 * drawing yesterday's territory while the zip list under it claims today's. Nothing about that
 * fails a build or looks wrong on screen.
 *
 * This is what fails instead.
 */
describe("service area outline", () => {
  it("was built from the zip list the site actually serves", () => {
    expect(serviceAreaZips).toEqual(servicedZips);
  });

  it("frames Philadelphia and the Main Line and nothing else", () => {
    // A sanity box, not a measurement: it catches a swapped lat/lng or a wrong state file, both of
    // which produce a perfectly valid polygon somewhere nobody lives.
    expect(serviceAreaBounds.south).toBeGreaterThan(39.5);
    expect(serviceAreaBounds.north).toBeLessThan(40.5);
    expect(serviceAreaBounds.west).toBeGreaterThan(-75.7);
    expect(serviceAreaBounds.east).toBeLessThan(-74.6);
  });
});

describe("serviceAreaMapUrl", () => {
  /** `vi.stubEnv` cannot reach NEXT_PUBLIC_* here — Next inlines them — so assign directly. */
  function withMapEnabled<T>(run: () => T): T {
    const previous = {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      enabled: process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED,
    };
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY = "test-key";
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED = "true";
    try {
      return run();
    } finally {
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY = previous.key;
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_ENABLED = previous.enabled;
    }
  }

  it("draws the outline as an encoded path", () => {
    const url = withMapEnabled(() => serviceAreaMapUrl({ width: 640, height: 360 }));
    // Compared decoded: a polyline is full of backslashes, braces and `@`, all of which a query
    // string has to escape. That escaping is correct and Google undoes it — the assertion is that
    // the path survives the round trip, not that it travels raw.
    expect(decodeURIComponent(url!)).toContain(`enc:${serviceAreaOutline}`);
  });

  it("stays inside Google's URL limit", () => {
    // The Maps Static API rejects anything over 16,384 characters outright, and the encoded path is
    // the only part of this URL that grows when the territory does. Measured ESCAPED, because that
    // is the length that actually goes over the wire and percent-escaping a polyline is not cheap:
    // roughly a third of its characters become three.
    const url = withMapEnabled(() => serviceAreaMapUrl({ width: 640, height: 360 }));
    expect(url!.length).toBeLessThan(16384);
  });

  it("is null unless the API has been switched on, key or no key", () => {
    // A key alone is not enough: the Static API is enabled per Cloud project, and an unauthorised
    // request returns a grey PNG with Google's error text baked into it rather than nothing.
    expect(serviceAreaMapUrl({ width: 640, height: 360 })).toBeNull();
  });
});
