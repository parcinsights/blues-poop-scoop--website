import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer, CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Text } from "@/components/ui/typography";
import { formatPostDate, postBySlug, posts } from "@/content/blog";
import { isPublishable } from "@/lib/content";
import { routes } from "@/lib/routes";
import { blogPostGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/**
 * Statically generated from the posts that exist. There are none yet, so this returns an empty
 * list and the route builds to nothing — which is correct: a blog route with no posts should cost
 * the build nothing and serve a 404 for any URL guessed at it.
 */
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

function crumbsFor(title: string, path: string): Crumb[] {
  return [
    { name: "Home", path: routes.home() },
    { name: "Blog", path: routes.blog() },
    { name: title, path },
  ];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug.get(slug);
  if (!post) return {};
  return buildMetadata({
    ...post.seo,
    path: routes.blogPost(slug),
    noindex: !isPublishable(post.body),
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = postBySlug.get(slug);
  if (!post) notFound();

  const path = routes.blogPost(slug);
  const crumbs = crumbsFor(post.title, path);

  return (
    <>
      <JsonLd graph={blogPostGraph({ path, post, crumbs })} />
      <PageShell crumbs={crumbs} heading={post.title} intro={post.excerpt}>
        {/* The byline sits under the standfirst rather than above the h1, so the first thing on
            the page is still the headline. `dateTime` carries the same ISO value the BlogPosting
            node publishes — one fact, rendered twice, never maintained twice. */}
        <Text size="small" tone="muted">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time> · {post.author}
        </Text>
      </PageShell>
      <BlockRenderer blocks={post.body} />
      <CtaBand heading="Want your yard handled?" />
    </>
  );
}
