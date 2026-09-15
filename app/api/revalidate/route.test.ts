import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cache = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => cache);

import { POST } from "./route";

const SECRET = "s".repeat(64);

function post(body: unknown, secret?: string) {
  return POST(
    new Request("https://bluespoopscoop.com/api/revalidate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(secret ? { "x-revalidate-secret": secret } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

beforeEach(() => vi.stubEnv("BLOG_REVALIDATE_SECRET", SECRET));
afterEach(() => {
  vi.unstubAllEnvs();
  cache.revalidatePath.mockClear();
});

describe("blog revalidation", () => {
  it("refuses a missing or wrong secret and revalidates nothing", async () => {
    expect((await post({ slug: "a" })).status).toBe(401);
    expect((await post({ slug: "a" }, "wrong")).status).toBe(401);
    expect(cache.revalidatePath).not.toHaveBeenCalled();
  });

  it("refuses everything when no secret is configured", async () => {
    vi.stubEnv("BLOG_REVALIDATE_SECRET", "");
    expect((await post({ slug: "a" }, "")).status).toBe(401);
  });

  it("revalidates the index, the sitemap and the post", async () => {
    const res = await post({ slug: "spring-thaw" }, SECRET);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, revalidated: "spring-thaw" });
    expect(cache.revalidatePath).toHaveBeenCalledWith("/blog");
    expect(cache.revalidatePath).toHaveBeenCalledWith("/sitemap.xml");
    expect(cache.revalidatePath).toHaveBeenCalledWith("/blog/spring-thaw");
  });

  it("never interpolates a slug that is not a slug", async () => {
    const res = await post({ slug: "../../etc" }, SECRET);
    expect(await res.json()).toEqual({ ok: true, revalidated: null });
    expect(cache.revalidatePath).not.toHaveBeenCalledWith(expect.stringContaining(".."));
  });
});
