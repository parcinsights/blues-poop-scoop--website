import { site } from "../site";
import { todo } from "../todo";
import type { ContentBlock, Seo } from "../types";

/**
 * The standing pages — /about/, /contact/, /pricing/, /commercial/, /get-started/.
 *
 * `/about/` is worth more attention than it looks. An about page is the first thing that goes
 * generic across a trade, and a generic one is worth nothing: "we're passionate about pets" is a
 * sentence on ten thousand sites. What belongs here is George — how he started, how long he has
 * been doing this, what he drives, where the waste goes, how many yards he covers. Facts a
 * franchise cannot copy.
 */

export const about = {
  seo: {
    title: "About Blue's Poop Scoop",
    description: `Locally owned pet waste removal serving Philadelphia and the Main Line. Meet ${site.owner}.`,
  } satisfies Seo,
  heading: "About Blue's Poop Scoop",
  intro:
    "We live and work in the neighborhoods we serve. This is our community, and we treat every yard like it's our own.",
  /** OUTSTANDING — the owner interview. See the note above. */
  body: [] as ContentBlock[],
};

export const contact = {
  seo: {
    title: "Contact Blue's Poop Scoop",
    description: `Call ${site.phone.display} or send us a message. Pet waste removal across Philadelphia and the Main Line.`,
  } satisfies Seo,
  heading: "Get in touch",
  intro: "Call, email, or send a message and we'll get back to you.",
  body: [] as ContentBlock[],
};

export const pricingPage = {
  seo: {
    title: "Pricing | Blue's Poop Scoop",
    description:
      "Straightforward monthly pricing by number of dogs. Weekly from $100 a month, every other week from $70.",
  } satisfies Seo,
  heading: "Simple, honest pricing",
  intro:
    "Priced by how many dogs you have and how often you want us out. No hidden fees, no per-visit surprises.",
  body: [] as ContentBlock[],
};

export const commercial = {
  seo: {
    title: todo("Commercial Pet Waste Removal | Blue's Poop Scoop"),
    description: todo(
      "Scheduled pet waste removal for apartment communities, HOAs and dog parks around Philadelphia.",
    ),
  } satisfies Seo,
  heading: todo("Pet waste removal for properties and communities"),
  intro: todo(""),
  body: [] as ContentBlock[],
};

/**
 * /reviews/ — the whole wall, rather than the trimmed set the homepage carries.
 *
 * The page is real content the day it ships, because the quotes already exist. Note what it must
 * NOT do: emit `review` or `aggregateRating` markup. Self-collected reviews on your own domain are
 * against Google's guidelines and are a manual-action risk — the reason is written out at the top
 * of content/reviews.ts, and the temptation is strongest on exactly this page.
 */
export const reviewsPage = {
  seo: {
    title: "Reviews | Blue's Poop Scoop",
    description:
      "What our customers say about us, in their own words. Pet waste removal across Philadelphia and the Main Line.",
  } satisfies Seo,
  heading: "What our customers say",
  intro:
    "Every quote below is a real review left by a real customer. We have not edited them beyond fixing an obvious typo.",
  body: [] as ContentBlock[],
};

/**
 * /opportunities/ — hiring.
 *
 * A hiring page on a small trade site is read by two people: someone deciding whether to apply,
 * and a customer checking whether the business is real. Both are served by the same thing —
 * specifics. Pay, hours, the vehicle situation, whether it is seasonal.
 *
 * OUTSTANDING, and none of it can be guessed: George has to supply the pay rate, the hours, what
 * a route day looks like, whether a driver uses their own vehicle, and where an application goes.
 * Inventing a wage on a real business's careers page is the worst possible placeholder.
 */
export const opportunities = {
  seo: {
    title: todo("Now Hiring | Work With Blue's Poop Scoop"),
    description: todo(
      "We're hiring in Philadelphia and the Main Line. Outdoor work, your own route, and dogs all day.",
    ),
  } satisfies Seo,
  heading: todo("Come work with us"),
  intro: todo(
    "We're a small local crew, and we're growing. If you like dogs, working outside, and being trusted to run your own day, we'd like to hear from you.",
  ),
  body: [] as ContentBlock[],
};

/**
 * /blog/ — the index. Posts live in content/blog.ts and there are none yet, deliberately; the note
 * there explains what is worth publishing and why an empty blog beats a padded one.
 */
export const blogIndex = {
  seo: {
    title: "Blog | Blue's Poop Scoop",
    description:
      "Notes on yard care, pet waste, and dog ownership around Philadelphia and the Main Line.",
  } satisfies Seo,
  heading: "From the blog",
  intro: "Notes from the route — seasonal yard care, and the questions our customers actually ask.",
};

export const getStarted = {
  seo: {
    title: "Get a free quote | Blue's Poop Scoop",
    description:
      "Tell us your zip code and how many dogs you have, and we'll get back to you with a price.",
  } satisfies Seo,
  heading: "Get a free quote",
  intro: "Tell us a little about your yard and we'll be in touch.",
};
