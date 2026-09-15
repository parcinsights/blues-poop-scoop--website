import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostBody } from "@/components/blog/PostBody";
import { PostCard } from "@/components/blog/PostCard";
import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { RemoteImage } from "@/components/ui/Image";
import { Link } from "@/components/ui/Link";
import { Container, Grid, Prose, Section, Stack } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import { blogPostPage } from "@/content/pages/standing";
import { site } from "@/content/site";
import { formatPostDate, wasRevised } from "@/lib/blog/dates";
import { getPost, listPosts } from "@/lib/blog/posts";
import { routes } from "@/lib/routes";
import { blogPostGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

/**
 * Every published post is pre-rendered at build. `dynamicParams` stays true (the default): a post
 * published after this build renders on its first request and is then cached, so it is live even
 * if its revalidation webhook never arrives. The hourly `revalidate` is the same safety net for
 * edits and unpublishes.
 */
export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 3600;

function crumbsFor(title: string, path: string): Crumb[] {
  return [
    { name: "Home", path: routes.home() },
    { name: blogPostPage.crumb, path: routes.blog() },
    { name: title, path },
  ];
}

/** The layout's title template appends the brand; strip it if the agency already typed it. */
function withoutBrand(title: string): string {
  const suffix = ` | ${site.name}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: withoutBrand(post.seoTitle ?? post.title),
    description: post.metaDescription ?? post.excerpt ?? "",
    // Self-referencing canonical on THIS domain — never the poster app's.
    path: routes.blogPost(post.slug),
    ogImage: post.hero ?? undefined,
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), listPosts()]);
  // A real 404. A 200 saying "not found" is a soft 404, and Google counts it against the site.
  if (!post) notFound();

  const path = routes.blogPost(post.slug);
  const crumbs = crumbsFor(post.title, path);
  const more = posts.filter((other) => other.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd graph={blogPostGraph({ path, post, crumbs })} />
      <article>
        <PageShell crumbs={crumbs} heading={post.title} intro={post.excerpt ?? undefined}>
          {/* The dates shown here are the same values as datePublished / dateModified in the
              BlogPosting node — one fact, rendered twice, never maintained twice. */}
          <Text size="small" tone="muted">
            {blogPostPage.byline}{" "}
            <Link href={routes.about()}>{post.authorName ?? site.name}</Link>
            {" · "}
            {blogPostPage.published}{" "}
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            {wasRevised(post) && (
              <>
                {" · "}
                {blogPostPage.updated}{" "}
                <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt)}</time>
              </>
            )}
          </Text>
        </PageShell>

        {/* White under the article — the reading surface. */}
        <Section tone="raised" spacing="sm">
          <Container width="prose">
            <Stack gap={8}>
              {/* The LCP element, and the one `priority` image on this page. */}
              {post.hero && (
                <RemoteImage
                  {...post.hero}
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="w-full rounded-lg"
                />
              )}
              <Prose>
                <PostBody doc={post.body} />
              </Prose>
            </Stack>
          </Container>
        </Section>
      </article>

      {/* How a new post picks up internal links, and how Googlebot finds it between sitemap
          fetches. */}
      {more.length > 0 && (
        <Section tone="alt">
          <Container>
            <Stack gap={6}>
              <Heading level={2} align="center-mobile">
                {blogPostPage.moreHeading}
              </Heading>
              <Grid columns={3}>
                {more.map((other) => (
                  <PostCard key={other.slug} post={other} level={3} />
                ))}
              </Grid>
            </Stack>
          </Container>
        </Section>
      )}

      <CtaBand heading={blogPostPage.ctaHeading} />
    </>
  );
}
