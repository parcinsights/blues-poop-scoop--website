import { RemoteImage } from "@/components/ui/Image";
import { Link } from "@/components/ui/Link";
import { Stack } from "@/components/ui/layout";
import { Card } from "@/components/ui/surfaces";
import { Heading, Text } from "@/components/ui/typography";
import { formatPostDate } from "@/lib/blog/dates";
import type { PostSummary } from "@/lib/blog/types";
import { routes } from "@/lib/routes";

/**
 * One post in a grid — the index, and "More from the blog" under a post. Hero, date, title as the
 * link, excerpt. The title is the link rather than a "Read more" button, so the anchor text is the
 * post's own words.
 */
export function PostCard({ post, level = 2 }: { post: PostSummary; level?: 2 | 3 }) {
  return (
    // `bleed`: the picture runs edge to edge across the top, and only the words below are padded.
    // The title link is stretched over the card, so the whole card goes to the post.
    <Card bleed interactive>
      {post.hero && (
        <RemoteImage
          {...post.hero}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="w-full"
        />
      )}
      <div className="p-6">
        <Stack gap={3}>
          <Text size="caption" tone="muted">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          </Text>
          <Heading level={level} size="h4">
            <Link href={routes.blogPost(post.slug)} variant="quiet" stretched>
              {post.title}
            </Link>
          </Heading>
          {post.excerpt && <Text tone="muted">{post.excerpt}</Text>}
        </Stack>
      </div>
    </Card>
  );
}
