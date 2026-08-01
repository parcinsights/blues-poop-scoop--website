/**
 * The shape of every piece of content on the site.
 *
 * These types are the intake form. A missing field is a build error, which is the point: it is not
 * possible to ship a service page with no meta description, or an image with no alt text, by
 * forgetting. The compiler asks for the fact.
 */

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours = {
  days: Weekday[];
  /** 24-hour, e.g. "08:00". Omitted when closed. */
  opens?: string;
  closes?: string;
  closed?: boolean;
};

/** Everything a page needs to describe itself to a search engine. */
export type Seo = {
  /** The <title>. Unique per page. ~50-60 chars before Google truncates. */
  title: string;
  /** The meta description. Unique per page. ~140-160 chars. Written to earn a click. */
  description: string;
};

/** One service the business sells. Drives /services/[service]/ and the city×service pages. */
export type Service = {
  slug: string;
  /** The client's own name for this work. */
  name: string;
  /** The <h1>. May differ from `name` — the h1 targets a query, the name is a label. */
  heading: string;
  /** One sentence, used in grids and link previews. */
  summary: string;
  seo: Seo;
  /** Ordered body content for the service page. */
  body: ContentBlock[];
  /** Whether this service gets city×service pages generated for it. */
  hasCityPages: boolean;
  segment: "residential" | "commercial";
};

/** One place served. Municipalities get their own page; neighbourhoods are sections of one. */
export type City = {
  slug: string;
  name: string;
  /** Two-letter state code. */
  region: string;
  county: string;
  zips: string[];
  /**
   * Neighbourhoods covered by this page. Deliberately NOT separate URLs — a set of
   * near-identical neighbourhood pages is the doorway-page pattern and gets sites discounted.
   * A neighbourhood earns its own URL when it has real distinct content behind it.
   */
  neighborhoods?: string[];
  seo: Seo;
  body: ContentBlock[];
};

/** The authored body of a page, as typed blocks rather than a slab of HTML. */
export type ContentBlock =
  | { kind: "prose"; heading?: string; paragraphs: string[] }
  | { kind: "list"; heading?: string; intro?: string; items: string[] }
  | { kind: "steps"; heading?: string; steps: { title: string; detail: string }[] }
  | { kind: "faq"; heading?: string; items: FaqItem[] }
  | { kind: "cta"; heading: string; detail?: string; buttonLabel: string; href: string };

export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * One reason to hire this business, for the "why us" band.
 *
 * `icon` is a KEY, not a component: content files describe what a point is about and the block
 * decides what that looks like, which is what keeps a lucide import out of the content layer.
 */
export type WhyUsPoint = {
  icon: "guarantee" | "safety" | "local" | "flexible";
  title: string;
  detail: string;
};

/** A real customer quote. Rendered as content — never as review structured data (see lib/schema.ts). */
export type Review = {
  quote: string;
  /** The reviewer's display name, exactly as it appears on the source profile. */
  name: string;
  /**
   * Optional, and usually absent. A Google review does not carry the reviewer's town, and a town
   * is not something to guess at — an invented "— Ardmore" under a real person's name is a
   * fabricated fact about a real customer. Set it only when the client confirms it.
   */
  city?: string;
  /** ISO date the review was left, when known. */
  date?: string;
};

/**
 * Pricing is a matrix: number of dogs × visit frequency. That is how the client actually quotes,
 * so it is how the site states it. Publishing the real grid is worth more than a "call for a
 * quote" button — price is one of the top query intents in this vertical, and a page that answers
 * it is the page that gets the call.
 */
export type PriceTier = {
  id: string;
  /**
   * The plan's cute name — "The Sidekick". It is a label for the card, never the fact: the row on
   * /pricing is titled by `dogs`, because a buyer comparing prices needs the dog count, not a joke.
   */
  name: string;
  /** Human label for the row, e.g. "1–2 dogs". */
  dogs: string;
  /** Whole dollars per month, weekly visits. */
  weekly: number;
  /** Whole dollars per month, every-other-week visits. */
  biweekly: number;
  featured?: boolean;
};

/**
 * An image. Note there is no `src` on the component that renders these — a page asks for an
 * asset by key, so alt text cannot be omitted or duplicated by accident.
 */
export type Asset = {
  /** Path under /public, or a Cloudflare Images key once phase 5 lands. */
  src: string;
  /**
   * REQUIRED. Describes the image for someone who cannot see it. Not a keyword dump —
   * a description. An empty string is only correct for purely decorative images, and there
   * are none in this registry.
   */
  alt: string;
  width: number;
  height: number;
};

export type NavLink = {
  label: string;
  href: string;
  children?: NavLink[];
};

/**
 * One TOP-LEVEL header item. Unlike `NavLink`, `href` is optional — a grouping label such as
 * "Residential" opens a dropdown and has no page of its own, and inventing a URL for it just so
 * the type is satisfied is how a nav ends up linking to a thin placeholder page.
 *
 * The three shapes, all valid:
 *   · href, no children      — a plain link.
 *   · href and children      — a link that also opens a menu ("About").
 *   · children, no href      — a menu trigger only ("Residential").
 * `routes.test.ts` fails the build on an item with neither.
 */
export type NavGroup = {
  label: string;
  href?: string;
  children?: NavLink[];
};
