import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client for reading this client's published blog posts.
 *
 * Anon key + RLS: the policy on `posts` exposes published rows only — the same rows this site is
 * about to put on the open web anyway. None of these values is NEXT_PUBLIC_: every read runs on the
 * server during build or ISR, and `server-only` turns an accidental client import into a build
 * error rather than a key in the browser bundle.
 *
 * If a read ever returns a draft, that is an RLS bug in the database. Report it; do not filter it
 * away here.
 */

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");

export const SUPABASE_URL = url.replace(/\/$/, "");

export const supabase = createClient(SUPABASE_URL, key, {
  auth: { persistSession: false },
});

export const BLOG_CLIENT_SLUG = (() => {
  const slug = process.env.BLOG_CLIENT_SLUG;
  if (!slug) throw new Error("BLOG_CLIENT_SLUG is required");
  return slug;
})();
