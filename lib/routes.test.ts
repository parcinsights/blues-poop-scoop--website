import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { cities } from "@/content/cities";
import { headerCta, headerNav, footerNav, primaryCta } from "@/content/nav";
import { services } from "@/content/services";
import { redirects } from "./redirects.mjs";
import { SITE_URL, absoluteUrl, allRoutes, publishedRoutes, routes } from "./routes";

const ROOT = join(import.meta.dirname, "..");

/** Does a static route file serve this path? */
function staticRouteExists(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  return existsSync(join(ROOT, "app", ...segments, "page.tsx"));
}

/** Dynamic segments serve a whole family of paths from one file. */
const DYNAMIC_FAMILIES: { test: (path: string) => boolean; file: string }[] = [
  { test: (p) => /^\/services\/[^/]+\/$/.test(p), file: "app/services/[service]/page.tsx" },
  { test: (p) => /^\/locations\/[^/]+\/$/.test(p), file: "app/locations/[city]/page.tsx" },
  {
    test: (p) => /^\/locations\/[^/]+\/[^/]+\/$/.test(p),
    file: "app/locations/[city]/[service]/page.tsx",
  },
  { test: (p) => /^\/blog\/[^/]+\/$/.test(p), file: "app/blog/[slug]/page.tsx" },
];

function isServable(path: string): boolean {
  if (staticRouteExists(path)) return true;
  const family = DYNAMIC_FAMILIES.find((f) => f.test(path));
  return family ? existsSync(join(ROOT, family.file)) : false;
}

describe("route registry", () => {
  it("produces canonical, absolute URLs on one origin", () => {
    expect(SITE_URL).not.toMatch(/\/$/);
    expect(absoluteUrl(routes.home())).toBe(`${SITE_URL}/`);
  });

  it("gives every path a trailing slash, matching next.config", () => {
    for (const entry of allRoutes()) {
      expect(entry.path.endsWith("/"), `${entry.path} has no trailing slash`).toBe(true);
    }
  });

  it("has no duplicate paths", () => {
    const paths = allRoutes().map((entry) => entry.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("covers every service and city from content", () => {
    const paths = new Set(allRoutes().map((entry) => entry.path));
    for (const service of services) expect(paths.has(routes.service(service.slug))).toBe(true);
    for (const city of cities) expect(paths.has(routes.city(city.slug))).toBe(true);
  });

  /**
   * The important one. A sitemap listing URLs that 404 teaches Google the sitemap is unreliable,
   * so `implemented: true` must mean a route file genuinely exists.
   */
  it("only marks a route implemented when its page file exists", () => {
    const liars = publishedRoutes()
      .filter((entry) => !isServable(entry.path))
      .map((entry) => entry.path);
    expect(liars).toEqual([]);
  });
});

describe("navigation", () => {
  const known = new Set(allRoutes().map((entry) => entry.path));

  /** Every href in the header, top-level items and dropdown children alike. */
  const headerHrefs = headerNav.flatMap((item) => [
    ...(item.href ? [item.href] : []),
    ...(item.children ?? []).map((child) => child.href),
  ]);

  it("points every header link at a route in the registry", () => {
    for (const href of headerHrefs) expect(known.has(href), href).toBe(true);
  });

  /**
   * A top-level item with neither a page nor a menu is a dead word in the nav bar — it renders,
   * it looks clickable, and it does nothing. The types allow either one to be missing; this
   * forbids both being missing.
   */
  it("gives every header item either a destination or a dropdown", () => {
    const dead = headerNav
      .filter((item) => !item.href && !item.children?.length)
      .map((item) => item.label);
    expect(dead).toEqual([]);
  });

  it("points every footer link at a route in the registry", () => {
    for (const group of footerNav) {
      for (const link of group.links) expect(known.has(link.href), `${link.href}`).toBe(true);
    }
  });

  it("points the primary CTA at a route in the registry", () => {
    expect(known.has(primaryCta.href)).toBe(true);
  });

  it("points the header CTA at a route in the registry", () => {
    expect(known.has(headerCta.href)).toBe(true);
  });
});

describe("301 map", () => {
  const known = new Set(allRoutes().map((entry) => entry.path));

  it("sends every redirect to a real route", () => {
    const broken = redirects
      .filter((rule) => !rule.destination.includes(":"))
      .filter((rule) => !known.has(rule.destination))
      .map((rule) => `${rule.source} -> ${rule.destination}`);
    expect(broken).toEqual([]);
  });

  it("never redirects a source to itself, which would loop", () => {
    for (const rule of redirects) {
      expect(rule.source.replace(/\/$/, "")).not.toBe(rule.destination.replace(/\/$/, ""));
    }
  });
});
