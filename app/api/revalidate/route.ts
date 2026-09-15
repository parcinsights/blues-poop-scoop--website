import { timingSafeEqual } from "node:crypto";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Called by the Blog Poster app whenever a post's visible state changes — first publish, approved
 * edits, a scheduled post going live, unpublish/archive — so the page updates in about a second
 * instead of waiting for the hourly `revalidate`. Body is always `{ "slug": "<post slug>" }`; after
 * an unpublish the re-rendered route simply 404s.
 *
 * `BLOG_REVALIDATE_SECRET` must equal `clients.revalidate_secret` for this client in the poster
 * database, and `clients.revalidate_url` must be `https://<this site>/api/revalidate`.
 */
export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const slug =
    body && typeof body === "object" && "slug" in body && typeof body.slug === "string"
      ? body.slug
      : null;
  // It arrives over the network; validate before it goes anywhere near a path.
  const validSlug = slug && /^[a-z0-9-]+$/.test(slug) ? slug : null;

  // Route paths, not public URLs — no trailing slash regardless of next.config.
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  // Every post page, not just this one: each carries "More from the blog", which a publish or an
  // unpublish changes too.
  revalidatePath("/blog/[slug]", "page");
  if (validSlug) revalidatePath(`/blog/${validSlug}`);

  return NextResponse.json({ ok: true, revalidated: validSlug });
}

function secretMatches(given: string | null): boolean {
  const expected = process.env.BLOG_REVALIDATE_SECRET;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
