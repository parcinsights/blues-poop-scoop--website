import { SITE_URL } from "@/lib/routes";

/**
 * Where a link inside a post may point, decided here and never by the editor's stored
 * `target`/`rel`. Every link was reviewed by the agency before publishing, so they are editorial
 * links: no `nofollow`. The `Link` primitive then picks the element and the new-tab `rel`.
 *
 * Returns the href to render, or null when the text should render without a link at all.
 */
export function resolvePostHref(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const href = raw.trim();
  if (!href) return null;

  // Site-relative. Protocol-relative ("//evil.com") is NOT relative — it is another origin.
  if ((href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#")) return href;

  if (/^(mailto|tel):/i.test(href)) return href;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  // Same origin, www or not → a path, so it routes client-side and survives a domain move.
  const bare = (host: string) => host.replace(/^www\./, "");
  if (bare(url.hostname) === bare(new URL(SITE_URL).hostname)) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return url.toString();
}
