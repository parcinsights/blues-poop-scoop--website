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

/** The sitemap reads posts from Supabase; tests never touch the network. */
const blog = vi.hoisted(() => ({ listPosts: vi.fn(async () => [] as unknown[]) }));
vi.mock("./blog/posts", () => blog);

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  blog.listPosts.mockClear();
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
    const meta = buildMetadata({ ...page, path: "/services/poop-scoop/" });
    expect(meta.alternates?.canonical).toBe("https://bluespoopscoop.com/services/poop-scoop/");
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
    expect(await sitemap()).toEqual([]);
    expect(blog.listPosts).not.toHaveBeenCalled();
  });

  it("lists only published routes in production, and no empty blog", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    const sitemap = (await import("../app/sitemap")).default;
    const { publishedRoutes } = await import("./routes");
    const entries = await sitemap();
    expect(entries.length).toBe(publishedRoutes().length);
    expect(entries.some((entry) => entry.url.includes("/blog/"))).toBe(false);
  });

  it("adds the blog index and each post, with the post's real edit date", async () => {
    vi.resetModules();
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://bluespoopscoop.com");
    blog.listPosts.mockResolvedValueOnce([
      {
        slug: "spring-thaw",
        title: "Spring thaw",
        excerpt: null,
        publishedAt: "2026-03-01T12:00:00Z",
        updatedAt: "2026-03-04T12:00:00Z",
        hero: null,
      },
    ]);
    const sitemap = (await import("../app/sitemap")).default;
    const entries = await sitemap();
    expect(entries.find((e) => e.url === "https://bluespoopscoop.com/blog/")).toBeTruthy();
    const post = entries.find((e) => e.url === "https://bluespoopscoop.com/blog/spring-thaw/");
    expect(post?.lastModified).toEqual(new Date("2026-03-04T12:00:00Z"));
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
