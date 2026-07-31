/**
 * JSON-LD. One `@graph` per page, assembled from the SAME data the page renders.
 *
 * That last part is the whole design. The usual failure with structured data is not that it is
 * absent — it is that it drifts: the page says one thing, the markup says what the page said six
 * months ago, and Google trusts neither. Here a node cannot describe a fact the page does not
 * hold, because both read the same `content/` module.
 *
 * Two deliberate omissions, both of which are tempting and both of which are penalties:
 *
 *  · NO `aggregateRating` or `review` on the business. Self-serving review markup — reviews you
 *    collected, marked up on your own site — violates Google's structured data guidelines and is a
 *    manual-action risk. Real quotes still render as visible content; they just aren't marked up.
 *  · NO `PostalAddress.streetAddress`. This is a service-area business run from a home. The
 *    address is deliberately unpublished, `areaServed` carries the coverage instead, and this must
 *    stay consistent with the Google Business Profile's hidden-address setting.
 */

import { cities, areaServedNames } from "@/content/cities";
import { sameAs, site } from "@/content/site";
import type { FaqItem, OpeningHours, Service } from "@/content/types";
import { SITE_URL, absoluteUrl, routes } from "./routes";

type JsonLdNode = Record<string, unknown>;

export type Crumb = { name: string; path: string };

const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Schema.org wants "Mo", "Tu", … full day names are also accepted; these are unambiguous. */
function openingHoursSpecification(hours: readonly OpeningHours[]): JsonLdNode[] {
  return hours
    .filter((slot) => !slot.closed)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
      opens: slot.opens,
      closes: slot.closes,
    }));
}

/**
 * The business entity. Referenced by @id from every other node rather than repeated, so there is
 * exactly one description of this business across the whole site.
 */
function businessNode(): JsonLdNode {
  return {
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl(routes.home()),
    telephone: site.phone.e164,
    email: site.email,
    foundingDate: String(site.foundedYear),
    priceRange: "$$",
    // Service-area business: locality and region only, never a street address.
    address: {
      "@type": "PostalAddress",
      addressLocality: site.baseCity,
      addressRegion: site.baseRegion,
      addressCountry: "US",
    },
    areaServed: areaServedNames.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: openingHoursSpecification(site.hours),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl(routes.home()),
    name: site.name,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-US",
  };
}

function webPageNode(args: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  hasBreadcrumb: boolean;
}): JsonLdNode {
  const url = absoluteUrl(args.path);
  return {
    "@type": args.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: args.name,
    description: args.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    inLanguage: "en-US",
    ...(args.hasBreadcrumb ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

function breadcrumbNode(path: string, crumbs: Crumb[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

function serviceNode(service: Service, areaNames: string[], path: string): JsonLdNode {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    provider: { "@id": BUSINESS_ID },
    areaServed: areaNames.map((name) => ({ "@type": "City", name })),
  };
}

function faqNode(path: string, items: FaqItem[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Wraps a node list as a graph. Every page's JSON-LD is exactly one of these. */
function graph(nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes };
}

// ── Per-page builders ────────────────────────────────────────────────────────

export function homeGraph(description: string): JsonLdNode {
  return graph([
    businessNode(),
    websiteNode(),
    // The homepage carries no BreadcrumbList — it is the root, and a one-item trail is noise.
    webPageNode({
      path: routes.home(),
      name: `${site.name} — ${site.tagline}`,
      description,
      hasBreadcrumb: false,
    }),
  ]);
}

export function standardPageGraph(args: {
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[];
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}): JsonLdNode {
  return graph([
    businessNode(),
    websiteNode(),
    webPageNode({ ...args, hasBreadcrumb: true }),
    breadcrumbNode(args.path, args.crumbs),
  ]);
}

export function servicePageGraph(args: {
  path: string;
  service: Service;
  crumbs: Crumb[];
  /** Which places this page claims. A service page claims the whole coverage area. */
  areaNames?: string[];
  faqs?: FaqItem[];
}): JsonLdNode {
  const nodes: JsonLdNode[] = [
    businessNode(),
    websiteNode(),
    webPageNode({
      path: args.path,
      name: args.service.heading,
      description: args.service.seo.description,
      hasBreadcrumb: true,
    }),
    breadcrumbNode(args.path, args.crumbs),
    serviceNode(args.service, args.areaNames ?? areaServedNames, args.path),
  ];
  if (args.faqs && args.faqs.length > 0) nodes.push(faqNode(args.path, args.faqs));
  return graph(nodes);
}

export function faqPageGraph(args: {
  path: string;
  name: string;
  description: string;
  crumbs: Crumb[];
  faqs: FaqItem[];
}): JsonLdNode {
  return graph([
    businessNode(),
    websiteNode(),
    webPageNode({ ...args, type: "FAQPage", hasBreadcrumb: true }),
    breadcrumbNode(args.path, args.crumbs),
    faqNode(args.path, args.faqs),
  ]);
}

/**
 * Build-time validation. Catches the two failures that are invisible in the browser and expensive
 * to find in Search Console: a duplicate @id, and an internal reference pointing at a node that
 * does not exist in the graph.
 */
export function assertValidGraph(node: JsonLdNode): JsonLdNode {
  const nodes = node["@graph"] as JsonLdNode[];
  const ids = new Set<string>();

  for (const entry of nodes) {
    const id = entry["@id"] as string | undefined;
    if (!id) continue;
    if (ids.has(id)) throw new Error(`JSON-LD: duplicate @id "${id}"`);
    ids.add(id);
  }

  const referenced: string[] = [];
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(walk);
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      const keys = Object.keys(record);
      if (keys.length === 1 && keys[0] === "@id") {
        referenced.push(record["@id"] as string);
        return;
      }
      Object.values(record).forEach(walk);
    }
  };
  walk(nodes);

  for (const id of referenced) {
    if (!ids.has(id)) throw new Error(`JSON-LD: reference to "${id}" resolves to no node in the graph`);
  }

  return node;
}

/** Every city, for pages that need the full coverage list. */
export const allCityNames = cities.map((city) => `${city.name}, ${city.region}`);
