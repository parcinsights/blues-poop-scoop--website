import type { Metadata } from "next";

import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Cluster, Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Badge, Card, Chip } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { formatPostDate, postsByDate } from "@/content/blog";
import { blogIndex } from "@/content/pages/standing";
import { routes } from "@/lib/routes";
import { standardPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "About", path: routes.about() },
  { name: "Blog", path: routes.blog() },
];

export const metadata: Metadata = buildMetadata({
  ...blogIndex.seo,
  path: routes.blog(),
  // An archive with nothing in it is a soft 404 to a crawler. It renders — the route has to exist
  // for the first post to land somewhere — but it is not offered to the index until it lists
  // something. Same rule, same reason, as every unauthored page here.
  noindex: postsByDate.length === 0,
});

/**
 * The blog index.
 *
 * There are no posts yet, deliberately — content/blog.ts explains what is worth publishing on a
 * site this size and why a padded archive costs more than an empty one. So the empty state below
 * is not a placeholder waiting to be replaced; it is what this page correctly shows until someone
 * has something real to say.
 */
export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        graph={standardPageGraph({
          path: routes.blog(),
          name: blogIndex.heading,
          description: blogIndex.seo.description,
          type: "CollectionPage",
          crumbs,
        })}
      />
      <PageShell crumbs={crumbs} heading={blogIndex.heading} intro={blogIndex.intro} />

      <Section tone={postsByDate.length > 0 ? "alt" : "raised"}>
        {postsByDate.length > 0 ? (
          <Container>
            <Grid columns={3}>
              {postsByDate.map((post) => (
                <Card key={post.slug}>
                  <Stack gap={3}>
                    {/* The date as a real <time>, so the machine-readable value and the words a
                        person reads are the same fact rather than two copies of it. */}
                    <Text size="caption" tone="muted">
                      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    </Text>
                    <Heading level={2} size="h4">
                      {post.title}
                    </Heading>
                    <Text tone="muted">{post.excerpt}</Text>
                    <Button href={routes.blogPost(post.slug)} variant="link">
                      Read more
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Container>
        ) : (
          /* THE EMPTY STATE, as one centred object on white.

             White rather than the cream `alt` the post grid runs on, because there is no grid: a
             single short panel on a tinted full-width band reads as a card that failed to load its
             neighbours. On white the band disappears and the panel is the only thing there, which
             is the honest picture of this page — one thing to say, said once. The card keeps the
             cream, so the colour that used to be the band is now the object. */
          <Container width="prose">
            <Card tone="canvas">
              <Stack gap={6} align="center">
                {/* The mark in a disc of its own amber. It is the site's one decorative image that
                    is not a photograph, and it is here because an empty page needs something to
                    look at — the alternative is a heading floating in a box. The tint ring keeps it
                    from reading as a logo stamped on the card: it is a medallion, the same move the
                    guarantee cards make. */}
                <div className="rounded-full bg-amber-tint p-6">
                  <Image asset="logoMark" sizes="64px" className="h-16 w-auto" />
                </div>

                {/* `text-center` on a wrapper, not `align` on each child: the Stack centres the
                    blocks, this centres the lines inside them, and the detail runs to two. */}
                <div className="text-center">
                  <Stack gap={3} align="center">
                    <Badge tone="accent">{blogIndex.empty.badge}</Badge>
                    <Heading level={2} size="h3" align="center">
                      {blogIndex.empty.heading}
                    </Heading>
                    <Text tone="muted">{blogIndex.empty.detail}</Text>
                  </Stack>
                </div>

                {/* The topics, over a DASHED rule — the one dashed line on the site, and it is
                    doing the work the words are: this is the part of the page that is not written
                    yet. Chips rather than a list, because four subjects in a row read as a spread
                    of things coming and four bullets read as a to-do list nobody has started. */}
                <div className="w-full border-t border-dashed border-line-strong pt-6">
                  <Stack gap={4} align="center">
                    <Text size="caption" tone="muted">
                      {blogIndex.empty.topicsHeading}
                    </Text>
                    <Cluster gap={2} justify="center">
                      {blogIndex.empty.topics.map((topic) => (
                        <Chip key={topic}>{topic}</Chip>
                      ))}
                    </Cluster>
                  </Stack>
                </div>

                {/* Two exits, not one. A visitor who came looking for reading has to be handed
                    something that exists today, and the FAQ is the page this blog would otherwise
                    duplicate; pricing is where they were probably heading anyway. */}
                <Cluster gap={3} justify="center">
                  <Button href={routes.faq()} variant="secondary">
                    {blogIndex.empty.faqLabel}
                  </Button>
                  <Button href={routes.pricing()} variant="ghost">
                    {blogIndex.empty.pricingLabel}
                  </Button>
                </Cluster>
              </Stack>
            </Card>
          </Container>
        )}
      </Section>

      {/* `canvas`, not the default navy: the quote button is navy and disappears into it — see
          CtaBand. Cream under the white band above also keeps the seam visible. */}
      <CtaBand heading="Ready for a clean yard?" tone="canvas" />
    </>
  );
}
