import "server-only";

import { cache } from "react";

import { BLOG_CLIENT_SLUG, SUPABASE_URL, supabase } from "./client";
import type { Post, PostNode, PostSummary } from "./types";

export type { Post, PostSummary } from "./types";

const SUMMARY_COLUMNS =
  "slug,title,excerpt,published_at,updated_at,hero_path,hero_w,hero_h,hero_alt";

type SummaryRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string;
  updated_at: string;
  hero_path: string | null;
  hero_w: number | null;
  hero_h: number | null;
  hero_alt: string | null;
};

type PostRow = SummaryRow & {
  body: PostNode;
  seo_title: string | null;
  meta_description: string | null;
  author_name: string | null;
  tags: string[] | null;
};

/** `hero_path` is an object path inside the public `blog-images` bucket. */
function heroUrl(path: string | null): string | null {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/blog-images/${path}`;
}

function toSummary(row: SummaryRow): PostSummary {
  const url = heroUrl(row.hero_path);
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    // A hero without real dimensions is dropped rather than rendered — an image without
    // width/height is a layout shift.
    hero:
      url && row.hero_w && row.hero_h
        ? { url, width: row.hero_w, height: row.hero_h, alt: row.hero_alt ?? row.title }
        : null,
  };
}

/**
 * Every published post, newest first. Used by the index, the sitemap, generateStaticParams and
 * "More from the blog". `cache` dedupes the several calls one render makes.
 */
export const listPosts = cache(async (): Promise<PostSummary[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(SUMMARY_COLUMNS)
    .eq("client_slug", BLOG_CLIENT_SLUG)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .returns<SummaryRow[]>();

  // Fail the build loudly. A silent [] ships a sitemap that has quietly lost every blog URL.
  if (error) throw new Error(`Failed to list posts: ${error.message}`);
  return (data ?? []).map(toSummary);
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(`${SUMMARY_COLUMNS},body,seo_title,meta_description,author_name,tags`)
    .eq("client_slug", BLOG_CLIENT_SLUG)
    .eq("status", "published")
    .eq("slug", slug)
    .returns<PostRow[]>()
    .maybeSingle();

  if (error) throw new Error(`Failed to load post ${slug}: ${error.message}`);
  if (!data) return null;

  const row = data as PostRow;
  return {
    ...toSummary(row),
    body: row.body,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    authorName: row.author_name,
    tags: row.tags ?? [],
  };
});
