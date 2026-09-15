/**
 * The shapes of a blog post as this site sees it. Kept apart from `posts.ts` so that types can be
 * imported anywhere — schema, components, tests — without dragging the server-only client along.
 *
 * Posts are written in the Blog Poster app and live in a shared Supabase database. They are NOT
 * content/ entries: the words are the client's, reviewed and published by the agency, and they
 * reach this site as data at build and ISR time.
 */

export type PostHero = { url: string; width: number; height: number; alt: string };

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  /** ISO 8601 timestamp — a real content edit date, never a build date. */
  updatedAt: string;
  hero: PostHero | null;
};

export type Post = PostSummary & {
  body: PostNode;
  /** Set by the agency; falls back to `title`. */
  seoTitle: string | null;
  metaDescription: string | null;
  authorName: string | null;
  /** Agency-set topics. There are deliberately no tag archive pages. */
  tags: string[];
};

/** A ProseMirror/TipTap node. The editor's JSON, rendered by components/blog/PostBody. */
export type PostNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PostNode[];
  marks?: PostMark[];
  text?: string;
};

export type PostMark = { type: string; attrs?: Record<string, unknown> };
