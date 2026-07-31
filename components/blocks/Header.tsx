import { headerNav, primaryCta } from "@/content/nav";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Container, Cluster } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";

/**
 * Site header. Server component — no client JS at all on desktop.
 *
 * The mobile menu is a `<details>` element rather than React state, which means the navigation
 * works before hydration and costs zero kilobytes. On a marketing site whose whole job is speed,
 * shipping a JS bundle to open a menu is a bad trade.
 */
export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          {/* The mark as an image, the wordmark as live text in Bitter — the same face the logo
              uses, so it stays crisp at any size and remains selectable and translatable. */}
          <Link href={routes.home()} variant="quiet">
            <span className="flex items-center gap-3">
              <Image asset="logoMark" priority className="w-11 h-11 rounded-md" />
              <span className="font-display font-bold text-h5 text-brand leading-none">
                {site.name}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <Cluster gap={6}>
              {headerNav.map((link) => (
                <Link key={link.href} href={link.href} variant="nav" size="small">
                  {link.label}
                </Link>
              ))}
            </Cluster>
          </nav>

          <div className="hidden lg:block">
            <Button href={primaryCta.href} size="sm">
              {primaryCta.label}
            </Button>
          </div>

          <details className="lg:hidden relative">
            <summary className="list-none cursor-pointer rounded-md border border-line-strong px-3 py-2 text-small font-semibold">
              Menu
            </summary>
            <nav
              aria-label="Main"
              className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-line bg-surface p-4 shadow-lg"
            >
              <ul className="list-none pl-0 flex flex-col gap-3">
                {headerNav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} variant="nav">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Button href={primaryCta.href} size="sm" block>
                    {primaryCta.label}
                  </Button>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
