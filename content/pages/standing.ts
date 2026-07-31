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

export const getStarted = {
  seo: {
    title: "Get a free quote | Blue's Poop Scoop",
    description:
      "Tell us your zip code and how many dogs you have, and we'll get back to you with a price.",
  } satisfies Seo,
  heading: "Get a free quote",
  intro: "Tell us a little about your yard and we'll be in touch.",
};
