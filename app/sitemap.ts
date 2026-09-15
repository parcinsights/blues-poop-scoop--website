import type { MetadataRoute } from "next";

import { listPosts } from "@/lib/blog/posts";
import { absoluteUrl, isIndexable, publishedRoutes, routes } from "@/lib/routes";

/**
 * The sitemap: the route registry, plus the blog from the Blog Poster database.
 *
 * Rules it enforces:
 *
 *  · Only pages that actually exist are listed. A sitemap full of 404s trains Google to distrust
 *    it, which is the opposite of the job.
 *  · A non-production deployment publishes an EMPTY sitemap. Combined with robots.ts, that keeps
 *    Vercel preview URLs out of the index, where they would otherwise compete with the real site.
 *  · `/blog/` is listed only once it lists a post; until then the index is noindexed.
 *
 * `lastModified` is absent on static routes: Google ignores lastmod once every URL claims to change
 * on every deploy, which is what a build timestamp does. Blog posts DO carry it, because
 * `posts.updated_at` is a real content edit date — exactly the signal the field exists for.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable) return [];

  const staticEntries: MetadataRoute.Sitemap = publishedRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = await listPosts();
  if (posts.length === 0) return staticEntries;

  return [
    ...staticEntries,
    { url: absoluteUrl(routes.blog()), changeFrequency: "weekly", priority: 0.5 },
    ...posts.map((post) => ({
      url: absoluteUrl(routes.blogPost(post.slug)),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
