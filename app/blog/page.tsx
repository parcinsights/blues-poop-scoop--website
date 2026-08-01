import type { Metadata } from "next";

import { CtaBand } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Container, Grid, Section, Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
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

      <Section tone="alt">
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
          <Container width="prose">
            <Stack gap={4}>
              <Heading level={2} size="h4" align="center-mobile">
                Nothing here yet
              </Heading>
              <Text tone="muted">
                We would rather write something worth reading than fill this page up. In the
                meantime, the FAQ answers most of what people actually ask us.
              </Text>
              <div>
                <Button href={routes.faq()} variant="secondary">
                  Read the FAQ
                </Button>
              </div>
            </Stack>
          </Container>
        )}
      </Section>

      <CtaBand heading="Ready for a clean yard?" />
    </>
  );
}
