import { Link } from "@/components/ui/Link";
import type { Crumb } from "@/lib/schema";

/**
 * The visible breadcrumb trail. Rendered on every page except the homepage.
 *
 * It takes the SAME `Crumb[]` array that builds the page's BreadcrumbList structured data, so the
 * markup cannot claim a trail the user does not actually see — which is the specific thing Google
 * asks for and the specific thing that quietly breaks when the two are maintained separately.
 *
 * The last crumb is the current page: not a link, marked `aria-current`.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-small">
      <ol className="flex flex-wrap items-center gap-2 list-none pl-0">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-ink-muted">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path}>{crumb.name}</Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-ink-muted">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
