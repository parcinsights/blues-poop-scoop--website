import Link from "next/link";

import { cities } from "@/content/cities";
import { footerNav } from "@/content/nav";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { Container } from "@/components/ui/layout";

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-14">
          <div className="flex flex-col gap-3">
            <span className="font-display font-bold text-h5">{site.name}</span>
            <p className="text-small">{site.tagline}</p>
            <a href={`tel:${site.phone.e164}`} className="text-ink-inverse font-semibold">
              {site.phone.display}
            </a>
            <a href={`mailto:${site.email}`} className="text-ink-inverse text-small">
              {site.email}
            </a>
            <p className="text-caption">
              Serving {site.baseCity}, {site.baseRegion} and the surrounding area.
            </p>
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="flex flex-col gap-3">
              <span className="font-display font-semibold text-h6 text-ink-inverse">
                {group.heading}
              </span>
              <ul className="list-none pl-0 flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink-inverse no-underline text-small">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Areas we serve" className="flex flex-col gap-3">
            <span className="font-display font-semibold text-h6 text-ink-inverse">
              Areas We Serve
            </span>
            <ul className="list-none pl-0 flex flex-col gap-2">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={routes.city(city.slug)} className="text-ink-inverse no-underline text-small">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-line-strong py-6 text-caption">
          © {year} {site.legalName}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
