import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Container, Section, Stack } from "@/components/ui/layout";
import { Heading, Text } from "@/components/ui/typography";
import type { Crumb } from "@/lib/schema";

/**
 * The page header every route except the homepage uses: breadcrumb trail, one h1, an optional
 * standfirst.
 *
 * It takes the same `crumbs` array that builds the page's BreadcrumbList structured data, so the
 * markup describes a trail the visitor can actually see — which is what Google asks for, and the
 * thing that silently breaks when the two are maintained separately.
 */
export function PageShell({
  crumbs,
  heading,
  intro,
  children,
}: {
  crumbs: Crumb[];
  heading: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    // `canvas`, matching the homepage hero and the header above it. Every page's first band is the
    // same off-white, which is what lets the header carry no border at the top of the page without
    // a colour seam appearing under it on ten of the eleven routes.
    <Section tone="canvas" spacing="md">
      <Container>
        <Stack gap={5}>
          <Breadcrumbs crumbs={crumbs} />
          <Heading level={1}>{heading}</Heading>
          {intro && (
            <Text size="lead" tone="muted" measure>
              {intro}
            </Text>
          )}
          {children}
        </Stack>
      </Container>
    </Section>
  );
}
