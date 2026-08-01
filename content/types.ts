/**
 * The shape of every piece of content on the site.
 *
 * These types are the intake form. A missing field is a build error, which is the point: it is not
 * possible to ship a service page with no meta description, or an image with no alt text, by
 * forgetting. The compiler asks for the fact.
 */

// Type-only, and circular by design: assets.ts imports `Asset` from here. Erased at compile, so it
// costs nothing — and it is what lets a content record name a picture by key instead of by path.
import type { AssetKey } from "./assets";

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

/**
 * One service the business sells. Drives /services/[service]/ and the city×service pages.
 *
 * Every service page is the SAME template — same bands, same order, same styling. So the fields
 * below are not "some copy for the page", they are the page: each one fills a specific band, and
 * the optional ones simply drop their band when absent. Anything that would need a NEW band on one
 * service and not another belongs here as another optional field, never as a second layout.
 * See app/services/[service]/page.tsx.
 */
export type Service = {
  slug: string;
  /** The client's own name for this work. */
  name: string;
  /** The <h1>. May differ from `name` — the h1 targets a query, the name is a label. */
  heading: string;
  /** One sentence, used in grids and link previews — and as the hero standfirst on its own page. */
  summary: string;
  seo: Seo;
  /**
   * The hero photograph, as a key into the image registry. Absent until the client supplies a photo
   * of THIS work: the hero falls back to the plain centred treatment, which is a smaller page but
   * an honest one. A stock lawn, or the same owners-and-dog shot on all four services, is worth
   * less than no picture — the photo is only doing a job if it shows the thing being sold.
   */
  image?: AssetKey;
  /**
   * The reassurance strip under the hero buttons — "No contracts", "Cancel anytime". Per service
   * because the objections differ: a recurring plan has to answer "am I locked in", and a one-off
   * clean does not.
   */
  assurances?: readonly string[];
  /**
   * The "what's included" band, directly under the hero. This is the band that does the selling —
   * a visitor who clicked a service wants to know what actually happens, and everything below it
   * (why us, how it works, prices) is the same on every page.
   *
   * Items are single sentences, and each one has to be a FACT the business will stand behind.
   */
  includes?: {
    heading: string;
    intro?: string;
    items: readonly string[];
    image?: AssetKey;
  };
  /**
   * Questions specific to THIS service. Absent falls back to the site-wide set, because a service
   * page with no FAQ band reads as less answered than the homepage — which is backwards.
   */
  faq?: readonly FaqItem[];
  /** Ordered body content for the service page. Also the publish gate — see lib/content.ts. */
  body: ContentBlock[];
  /** Whether this service gets city×service pages generated for it. */
  hasCityPages: boolean;
  segment: "residential" | "commercial";
  /**
   * An extra bought ALONGSIDE a plan rather than instead of one — deodorizing, haul-away.
   *
   * It is a flag rather than a third `segment` because an add-on is still residential work; what
   * differs is how it is sold. The services index groups on it, and it is why an add-on never
   * gets city pages: nobody searches "deodorizer ardmore pa", they search for scooping and add
   * this at signup.
   */
  addOn?: boolean;
};

/**
 * One blog post. Same `ContentBlock` body as every other page, so a post cannot smuggle in raw
 * HTML and cannot skip its meta description.
 *
 * Posts are the one part of the site with a genuine publication date, which is why `date` is
 * required and ISO: it drives the ordering, the visible byline, and the `datePublished` in
 * structured data, and those three must never disagree.
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** One or two sentences for the index card and link previews. */
  excerpt: string;
  /** ISO `YYYY-MM-DD`, the day it went live. Newest first on the index. */
  date: string;
  /** Who wrote it. A real person — an unattributed post is worth less than no post. */
  author: string;
  seo: Seo;
  body: ContentBlock[];
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
   * Roughly the middle of the town — a pin on the service-area map, and one vertex of the shape
   * drawn around all of them. Four decimal places is about 10 metres, which is far more precision
   * than a map at this zoom can show; it is written that way only because that is the form you get
   * back when you look a place up.
   */
  coords: { lat: number; lng: number };
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
