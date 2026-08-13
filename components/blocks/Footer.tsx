import { cities } from "@/content/cities";
import { footerNav } from "@/content/nav";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { Text } from "@/components/ui/typography";

/**
 * Site footer.
 *
 * It carries the canonical NAP — the same name, phone and coverage that appear in structured data
 * and on the Google Business Profile, written once here and read from `content/site.ts`. No street
 * address: this is a service-area business (see lib/schema.ts).
 *
 * The coverage list links to every city page, which is how those pages stay crawlable from any
 * page on the site. It links to city hubs only, never to every city × service leaf — a sitewide
 * link block containing dozens of URLs is a footprint, not internal linking.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-ink-inverse">
      <Container>
        {/* THE TOP ROW IS THE NAV, AND ONLY THE NAV. Five columns: the brand block over two of
            them, then the three `footerNav` groups one each. The brand block holds the name, a
            phone number and an email — the longest lines in the footer — and in a single column it
            sat hard against "Services" with its own text wrapping to make room. Two columns give
            those lines somewhere to go and put real space at the seam.

            The coverage list is NOT in this row any more; twenty towns is a directory, not a nav
            group, and it has its own strip below. The count is pinned to `footerNav.length + 2` in
            the class below — adding a fourth nav group means changing it here too.

            Two-up on a tablet rather than four, because four 160px columns of small links is a
            wall. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pt-14 pb-10">
          <div className="flex flex-col gap-3 lg:col-span-2 lg:pr-10">
            <span className="font-display font-bold text-h5">{site.name}</span>
            <Text size="small">{site.tagline}</Text>
            <Link href={`tel:${site.phone.e164}`} variant="quiet" weight="semibold">
              {site.phone.display}
            </Link>
            <Link href={`mailto:${site.email}`} variant="quiet" size="small">
              {site.email}
            </Link>
            <Text size="caption">
              Serving {site.baseCity}, {site.baseRegion} and the surrounding area.
            </Text>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="flex flex-col gap-3">
              <span className="font-display font-semibold text-h6 text-ink-inverse">
                {group.heading}
              </span>
              <ul className="list-none pl-0 flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} variant="quiet" size="small">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* THE COVERAGE STRIP, ON ITS OWN ROW. Twenty towns in a nav column ran three times the
            depth of the groups beside it and squeezed everything else; across the full width it is
            four short columns and the row above it gets its space back.

            A hairline above it, the same one the copyright bar uses. The strip is a different kind
            of thing from the nav groups — a directory rather than a menu — and the rule is what
            says so without a second heading style.

            CSS `columns`, not a grid: a grid fills across the row, so an alphabetical list would
            read Abington, Ambler / Ardmore, Bala Cynwyd across the page. This reads DOWN the first
            column and then down the next, which is the order the list is in. `break-inside-avoid`
            keeps a name off a column boundary, and the margin on the item replaces the flex `gap`
            this used to have. */}
        <nav
          aria-label="Areas we serve"
          className="flex flex-col gap-4 border-t border-line-strong py-10"
        >
          <span className="font-display font-semibold text-h6 text-ink-inverse">
            Areas We Serve
          </span>
          <ul className="list-none pl-0 columns-2 gap-x-8 sm:columns-3 lg:columns-5">
            {cities.map((city) => (
              <li key={city.slug} className="mb-2 break-inside-avoid">
                <Link href={routes.city(city.slug)} variant="quiet" size="small">
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* The bottom bar. Stacked on a phone and a row from `sm`, with the copyright hard left and
            the social icons hard right — the two things on this line have nothing to do with each
            other, and pushing them apart is what stops the row reading as one sentence.

            THE ICONS ARE THE LAST THING ON THE PAGE, which is the correct place for them. A social
            link is the one link on this site that sends a visitor somewhere we do not control, so
            it belongs after every other exit has been offered rather than in the middle of them. */}
        <div className="flex flex-col items-center gap-4 border-t border-line-strong py-6 text-caption sm:flex-row sm:justify-between">
          <span>
            © {year} {site.legalName}. All rights reserved.
          </span>
          {/* `-mr-1` gives back the icons' own hover padding, so the last glyph's EDGE lands on the
              container line rather than its hit target. */}
          <div className="sm:-mr-1">
            <SocialLinks tone="inverse" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
