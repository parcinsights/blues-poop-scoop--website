import { site } from "../site";
import { todo } from "../todo";
import type { ContentBlock, Feature, Seo } from "../types";

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

/**
 * /pricing/.
 *
 * The page answers the question in the order a buyer actually asks it: what does it cost, why
 * should I trust you with the money, do you even come to my street, has anyone else done this, and
 * what happens after I click. The plans, the reviews and the three steps are the SAME blocks the
 * homepage runs — a visitor who arrives here from search gets the landing page's argument without
 * having to go and find the landing page.
 */
export const pricingPage = {
  seo: {
    title: "Pricing | Blue's Poop Scoop",
    description:
      "Straightforward monthly pricing by number of dogs. Weekly from $100 a month, every other week from $70.",
  } satisfies Seo,
  /**
   * NO `heading` AND NO `intro`. The page opens on the photograph, directly under the header, and
   * the first words on it are the pricing band's own title — which is therefore the h1, and comes
   * from `home.pricing.heading` so that the homepage band and this page cannot end up calling the
   * same three plans two different things. See app/pricing/page.tsx.
   */

  /**
   * The guarantees, directly under the prices. That placement is the point: a number is the moment
   * doubt arrives, and these are the three things that cost the business money if they turn out to
   * be false — a re-clean, a reply, an insurance certificate. Claims with a price attached are the
   * only kind worth printing next to one.
   *
   * Three, not four. The 30-day refund on the homepage is a stronger promise than any of these and
   * is already said twice above — once in the plans' own promise line, once in the intro here.
   */
  guarantee: {
    heading: "The Blue's Poop Scoop Guarantee",
    intro:
      "We'd rather fix it than argue about it. Every plan comes with the same three promises, and none of them has fine print.",
    points: [
      {
        icon: "guarantee",
        title: "100% Satisfaction",
        detail: "Not happy? We'll come back and re-clean for free.",
      },
      {
        icon: "reachable",
        title: "Always Reachable",
        detail: "Text or call us anytime. We respond within the hour.",
      },
      {
        icon: "insured",
        title: "Insured",
        detail: "Fully insured for your peace of mind.",
      },
    ] satisfies Feature[],
  },

  /**
   * The coverage band. Zips rather than town names — see the note on `ServiceZips` for why this
   * page uses a different currency from the homepage's band.
   *
   * The list itself is NOT written here. It comes from `servicedZips` in content/cities.ts, which
   * is the same list the lead form is validated against, so the page cannot advertise a zip the
   * form would then reject.
   */
  serviceArea: {
    heading: "Where we scoop",
    intro:
      "We cover most of Philadelphia and the Main Line. Find your zip below and you're in our route.",
    note: {
      before: "Don't see your zip?",
      link: "Contact us",
      after: " — we may still be able to help!",
    },
  },

  /** The wall, trimmed to the homepage's set. Proof sits under coverage: it is worth most to someone who has just found their own zip. */
  reviews: {
    heading: "See what our friends are saying about us",
  },

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
