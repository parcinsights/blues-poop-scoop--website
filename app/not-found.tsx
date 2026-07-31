import { Button } from "@/components/ui/Button";
import { Cluster, Container, Section, Stack } from "@/components/ui/layout";
import { routes } from "@/lib/routes";

/**
 * A real 404 — Next returns the correct HTTP status for this file, which matters: a "not found"
 * page that returns 200 is a soft 404, and Google will index it or, worse, treat other pages as
 * unreliable.
 *
 * It offers routes onward rather than a dead end, because after the WordPress migration some
 * share of visitors will land here from an old link we failed to redirect.
 */
export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container>
        <Stack gap={6}>
          <h1>We couldn&apos;t find that page</h1>
          <p className="text-lead text-ink-muted max-w-prose">
            The link may be out of date. Here&apos;s where most people are headed.
          </p>
          <Cluster gap={3}>
            <Button href={routes.home()}>Home</Button>
            <Button href={routes.services()} variant="ghost">
              Services
            </Button>
            <Button href={routes.locations()} variant="ghost">
              Areas we serve
            </Button>
            <Button href={routes.contact()} variant="ghost">
              Contact
            </Button>
          </Cluster>
        </Stack>
      </Container>
    </Section>
  );
}
