import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `isIndexable` is read from the environment at module load, so these tests stub the env and
 * re-import. That is the only way to exercise the production path — a real production build is
 * blocked by design while placeholder content remains (see content/todo.ts).
 */
async function loadSeo(vercelEnv?: string) {
  vi.resetModules();
  if (vercelEnv) vi.stubEnv("VERCEL_ENV", vercelEnv);
  else vi.stubEnv("VERCEL_ENV", "");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bluespoopscoop.com");
  const [{ buildMetadata }, { routes }] = await Promise.all([import("./seo"), import("./routes")]);
  return { buildMetadata, routes };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const page = { title: "T", description: "D" };

describe("indexability is decided by the deployment", () => {
  it("indexes a normal page on the production deployment", async () => {
    const { buildMetadata } = await loadSeo("production");
    const meta = buildMetadata({ ...page, path: "/pricing/" });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("noindexes an explicitly withheld page even in production", async () => {
    const { buildMetadata } = await loadSeo("production");
    const meta = buildMetadata({ ...page, path: "/locations/ardmore/", noindex: true });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  /**
   * The leak this prevents: Vercel gives every branch a public URL, those URLs get discovered,
   * and an indexed preview competes with the real site as a full duplicate.
   */
  it("noindexes everything on a preview deployment", async () => {
    const { buildMetadata } = await loadSeo("preview");
    const meta = buildMetadata({ ...page, path: "/pricing/" });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("noindexes everything on a local build", async () => {
    const { buildMetadata } = await loadSeo();
    const meta = buildMetadata({ ...page, path: "/pricing/" });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("canonical and social tags", () => {
  it("self-references the canonical on our own origin", async () => {
    const { buildMetadata } = await loadSeo("production");
    const meta = buildMetadata({ ...page, path: "/services/weekly-scooping/" });
    expect(meta.alternates?.canonical).toBe("https://bluespoopscoop.com/services/weekly-scooping/");
  });

  it("keeps og:url in agreement with the canonical", async () => {
    const { buildMetadata } = await loadSeo("production");
    const meta = buildMetadata({ ...page, path: "/faq/" });
    expect(meta.openGraph?.url).toBe(meta.alternates?.canonical);
  });

  it("gives the social card an absolute URL", async () => {
    const { buildMetadata } = await loadSeo("production");
    const meta = buildMetadata({ ...page, path: "/" });
    const images = meta.openGraph?.images as { url: string }[];
    expect(images[0]?.url).toMatch(/^https:\/\//);
  });
});

describe("the sitemap follows the same rule", () => {
  it("is empty on a non-production deployment", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "preview");
    const sitemap = (await import("../app/sitemap")).default;
    expect(sitemap()).toEqual([]);
  });

  it("lists only published routes in production", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    const sitemap = (await import("../app/sitemap")).default;
    const { publishedRoutes } = await import("./routes");
    expect(sitemap().length).toBe(publishedRoutes().length);
  });
});

describe("robots.txt", () => {
  it("disallows everything off production", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "preview");
    const robots = (await import("../app/robots")).default;
    expect(robots().rules).toMatchObject([{ userAgent: "*", disallow: "/" }]);
  });

  it("allows crawling and points at the sitemap in production", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    const robots = (await import("../app/robots")).default;
    const result = robots();
    expect(result.sitemap).toBe("https://bluespoopscoop.com/sitemap.xml");
    expect(result.rules).toMatchObject([{ userAgent: "*", allow: "/" }]);
  });
});
