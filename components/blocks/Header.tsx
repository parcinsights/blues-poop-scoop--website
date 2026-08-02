import { ChevronDown } from "lucide-react";

import { headerCta, headerNav } from "@/content/nav";
import { site } from "@/content/site";
import type { NavGroup } from "@/content/types";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";
import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/Link";

/**
 * Site header. Sticky to the top of every page, and a SERVER component — there is no client
 * JavaScript in it at all, including the dropdowns.
 *
 * The dropdowns open on `group-hover` for a pointer and on `group-focus-within` for a keyboard,
 * which is the whole mechanism. Two consequences worth knowing before someone "fixes" this by
 * reaching for useState:
 *
 *  · The nav works before hydration, and on a page where hydration fails. On a marketing site
 *    whose only job is to get a visitor to a phone number, that is the correct trade.
 *  · `aria-expanded` is therefore absent — nothing can update it without JS. A menu trigger with
 *    a permanently wrong `aria-expanded="false"` is worse than none, so the trigger is marked
 *    `aria-haspopup` and the panel is a plain list that tab order reaches in the right order.
 *
 * The mobile menu below `lg` remains a `<details>` element for the same reason. It is the
 * unstyled-but-working version; the designed mobile nav is a separate piece of work.
 */

/** Top-level bar items — the trigger `<button>` matches `Link variant="nav"`. */
const triggerClasses =
  "inline-flex items-center gap-1 cursor-pointer bg-transparent text-control font-semibold " +
  "text-ink transition-colors duration-150 ease-out hover:text-brand group-hover:text-brand";

/**
 * The panel wrapper. `pt-3` sits INSIDE the hover area and outside the visible card, giving the
 * pointer a bridge to cross from the trigger to the menu — without it the menu closes in the gap.
 */
const panelClasses =
  "invisible absolute left-0 top-full z-50 pt-3 opacity-0 " +
  "transition duration-150 ease-out " +
  "group-hover:visible group-hover:opacity-100 " +
  "group-focus-within:visible group-focus-within:opacity-100";

/**
 * The card itself. No border: on cream, a white panel plus a soft shadow already reads as lifted,
 * and the extra hairline only made the corner look doubled. The shadow is the navy-tinted one from
 * theme.css, which is why it sits on the cream without looking grey.
 *
 * No padding at all: the rows are full-bleed, so the hover wash runs edge to edge and the card's
 * own rounding — with `overflow-hidden` to clip it — is what shapes the first and last row. Any
 * inset here reads as white space the highlight failed to reach.
 */
const panelCardClasses =
  "list-none pl-0 w-60 overflow-hidden rounded-lg bg-surface-raised shadow-lg";

function Dropdown({ item }: { item: NavGroup }) {
  return (
    <li className="group relative">
      {/* A group with its own page renders a real link; one without ("Residential") renders a
          button, so a keyboard lands on something that announces itself as a menu. */}
      {item.href ? (
        <span className="inline-flex items-center gap-1">
          <Link href={item.href} variant="nav">
            {item.label}
          </Link>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="text-ink-muted transition-transform duration-150 ease-out group-hover:rotate-180"
          />
        </span>
      ) : (
        <button type="button" aria-haspopup="true" className={triggerClasses}>
          {item.label}
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="transition-transform duration-150 ease-out group-hover:rotate-180"
          />
        </button>
      )}

      <div className={panelClasses}>
        <ul className={panelCardClasses}>
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link href={child.href} variant="menu">
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function Header() {
  return (
    // No border, and no background class: the bar is TRANSPARENT at the top of the page — the first
    // band runs up underneath it — and fades to white as the page moves, at the same moment the
    // shadow arrives. Both are one scroll-driven animation in base.css; see `.header-lift`.
    <header className="header-lift sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between gap-6 py-4">
          {/* The mark as an image, the wordmark as live text in the site face — so it stays crisp
              at any size and remains selectable, translatable, and readable to a screen reader. */}
          <Link href={routes.home()} variant="quiet">
            <span className="flex items-center gap-3">
              {/* NO `priority`, and the reason is worth keeping: this component is on every page,
                  so a `priority` here preloaded the logo AHEAD of each page's real LCP element —
                  two `<link rel="preload" as="image">` tags racing, with the 76px logo winning the
                  start. The mark is above the fold but it is not the largest thing there, and
                  `priority` is for exactly one image per page. See the note in ui/Image.

                  `sizes` because without it Next emits a 1x/2x srcset off the asset's intrinsic
                  483px width and the browser takes the 1080w file for a 76×64 slot — 27KB to draw
                  a thumbnail. The other two logoMark call sites already pass this.

                  `decorative` because the company name is live text immediately to the right; a
                  screen reader that reads the alt as well says the brand twice. */}
              <Image asset="logoMark" decorative sizes="80px" className="h-16 w-auto" />
              {/* 18px/600, the same as the nav items beside it — the lockup and the navigation are
                  one row of type, and the mark to its left is what gives the brand its size.
                  Fredoka is variable across 300–700, so 600 is a real design, not an interpolation
                  the browser faked. */}
              <span className="font-display font-semibold text-control text-brand leading-none">
                {site.name}
              </span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <nav aria-label="Main">
              <ul className="list-none pl-0 flex items-center gap-7">
                {headerNav.map((item) =>
                  item.children?.length ? (
                    <Dropdown key={item.label} item={item} />
                  ) : (
                    <li key={item.label}>
                      {/* A group with no children always has an href — see NavGroup. */}
                      <Link href={item.href!} variant="nav">
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* `md`, not `sm` — the header CTA is the only button on the page for the whole first
                screen, so it carries the same weight here as an in-page one. */}
            <Button href={headerCta.href} size="md">
              {headerCta.label}
            </Button>
          </div>

          <details className="lg:hidden">
            {/* The label is on the <summary>, not visible text — a screen reader still hears
                "Menu", and the bars are hidden from it as pure decoration. */}
            <summary className="nav-toggle" aria-label="Menu">
              <span className="nav-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </summary>

            <div className="nav-drawer">
              <Container>
                <nav aria-label="Main">
                  <ul className="list-none pl-0 flex flex-col gap-6">
                    {headerNav.map((item) => (
                      <li key={item.label}>
                        {item.href ? (
                          <Link href={item.href} variant="nav">
                            {item.label}
                          </Link>
                        ) : (
                          // A menu-only group is a heading here, not a dead link — there is no
                          // hover on a phone, so the dropdown it opens on desktop is just a list.
                          <span className="text-control font-semibold text-ink">{item.label}</span>
                        )}
                        {item.children?.length ? (
                          <ul className="list-none mt-3 flex flex-col gap-3 border-l border-line pl-4">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link href={child.href} variant="quiet" size="small">
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                    <li className="mt-2">
                      <Button href={headerCta.href} size="md" block>
                        {headerCta.label}
                      </Button>
                    </li>
                  </ul>
                </nav>
              </Container>
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
