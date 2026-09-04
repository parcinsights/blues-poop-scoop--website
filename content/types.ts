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
   * The hero photograph, as a key into the image registry. Absent and the hero drops to a single
   * column of words, which is a plainer page but an honest one: the same owners-and-dog shot on
   * every service is worth less than no picture, because a photo is only doing a job if it shows
   * the thing being sold.
   *
   * Unlike the homepage's, this picture stops at the container edge rather than bleeding off the
   * screen — the full-bleed treatment belongs to the front door alone. See `ServiceHero`.
   */
  image?: AssetKey;
  /**
   * The outlined chips above the h1 — two to four words each: "Weekly service", "No contracts",
   * "Pet-safe". They are read before the heading is, so they are qualities of the work rather than
   * a second summary, and every one has to be something the business will stand behind.
   */
  tags?: readonly string[];
  /**
   * The INCLUDES tab: what actually happens when we turn up. One string per PARAGRAPH — these are
   * sentences, not bullets.
   *
   * It was a ticked list until the tabs arrived, and the list was the wrong shape: five fragments
   * that each answered half a question. Every fact in here still has to be a fact, and the prose
   * makes that harder to fudge rather than easier — a bullet can imply a promise, a sentence has
   * to make one.
   */
  includes?: readonly string[];
  /**
   * The BENEFITS tab: what the customer gets out of it, as opposed to what we do. One string per
   * paragraph, as above.
   *
   * The one place on a service page where the copy talks about the yard rather than the work —
   * which is exactly why it is the easiest field on this type to fill with invented sentiment.
   * Wrap anything the client has not actually said in `todo()`.
   */
  benefits?: readonly string[];
  /**
   * Questions specific to THIS service.
   *
   * NOT RENDERED by the current template, which ends at the details section — this is real copy
   * kept against the FAQ band coming back, and it is deliberately not fed to `servicePageGraph` in
   * the meantime: FAQPage markup for questions a visitor cannot see is exactly what Google's
   * structured-data guidelines call out.
   */
  faq?: readonly FaqItem[];
  /**
   * The ABOUT tab — the long-form answer to "what is this". Also the publish gate: a service with
   * an empty body renders (so it can be reviewed and linked) but carries `noindex` and stays out of
   * the sitemap. See lib/content.ts.
   */
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
 * The glyph on a selling point. A KEY, not a component: content files describe what a point is
 * about and the block decides what that looks like, which is what keeps a lucide import out of the
 * content layer.
 *
 * Add a key here and it must be given a picture in `pointIcons` — that map is typed against this
 * union, so a key with no glyph is a compile error rather than a hole in a band.
 */
export type PointIcon =
  | "guarantee"
  | "safety"
  | "local"
  | "flexible"
  | "reachable"
  | "insured"
  // The commercial vocabulary: the equipment we install, the schedule we keep, and the message
  // that lands after a visit. Kept in the same union as the residential keys rather than in one of
  // its own — a medallion is a medallion, and two parallel icon registries is how the same idea
  // ends up drawn two different ways on two pages.
  | "stations"
  | "schedule"
  | "updates"
  // What happens to the waste after it leaves the yard. The residential page is the only one that
  // sells that as a point of its own — "double-bagged" is a specific promise, and none of the keys
  // above draws it without saying something else instead.
  | "disposal";

/** One reason to hire this business — the "why us" band, and the guarantees on /pricing/. */
export type WhyUsPoint = {
  icon: PointIcon;
  title: string;
  detail: string;
};

/**
 * One cell of a `FeatureGrid`. The icon is optional, and that is the difference between the two
 * bands built on it: /about/ runs the three value props as plain cards, /pricing/ runs the
 * guarantees as the same cards with a medallion on each.
 */
export type Feature = {
  title: string;
  detail: string;
  icon?: PointIcon;
};

/**
 * One member of the crew on /about/, the dog included.
 *
 * The photograph is required rather than optional, and that is the point of the band: a named
 * person with a face is the one thing on this site a franchise cannot copy. A crew card with no
 * picture is a bio, and a bio belongs in a paragraph.
 */
export type TeamMember = {
  name: string;
  /** The job title as they would say it out loud, not as HR would write it. */
  role: string;
  /** Two or three sentences. What they actually do, in the client's own voice. */
  bio: string;
  image: AssetKey;
};

/**
 * One figure in the stats strip. `value` is the thing read at a glance — two or three characters,
 * never a sentence — and `label` is what it counts.
 *
 * Every one of them has to be a fact. A number is the most believable thing on a page and therefore
 * the most expensive thing to make up.
 */
export type Stat = {
  value: string;
  label: string;
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
  /**
   * Shown in the six-quote wall every page except /reviews/ carries.
   *
   * A FLAG ON THE REVIEW, not a separate hand-picked array, because the alternative is a second
   * list of quotes that has to be kept in step with this one — and the day they drift, the site is
   * publishing a testimonial that is no longer in the source of truth. Here there is exactly one
   * copy of every quote and `featured` only decides where it appears.
   *
   * See `featuredReviews` in content/reviews.ts for what is picked and why.
   */
  featured?: boolean;
};

/**
 * Pricing is a LIST: one monthly rate per dog count, on the weekly schedule. It was a matrix of
 * dogs × frequency until 2026-09-04, when the client cut the second frequency to make the choice
 * simpler — the number of dogs you own is not a decision, so the grid now only asks the visitor to
 * find their own row rather than to pick a column as well.
 *
 * Publishing the real numbers is worth more than a "call for a quote" button — price is one of the
 * top query intents in this vertical, and a page that answers it is the page that gets the call.
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
  /**
   * Whole dollars per month, weekly visits — and the ONLY rate on the type.
   *
   * There was a `biweekly` beside it until 2026-09-04. It came off at the client's request, and the
   * field went with the column rather than being left as a number nothing renders: an unrendered
   * price is a price nobody checks, and the day it is wrong is the day someone puts the table back.
   * Bi-weekly is still sold on request — see `customQuote` in content/pricing.ts.
   */
  weekly: number;
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
