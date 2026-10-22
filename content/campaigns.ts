import { home } from "./pages/home";
import { perVisit, startingPrice } from "./pricing";
import { featuredReviews, reviews } from "./reviews";
import { site } from "./site";
import { todo } from "./todo";
import type { Campaign, Review } from "./types";

/**
 * THE AD LANDING PAGES. One record per campaign, each served at `routes.campaign(slug)` —
 * /lp/<slug>/ — and nowhere else. See `Campaign` in ./types.ts for what each field fills.
 *
 * WHAT IS IN HERE IS THE CLIENT'S OWN RECORD, rearranged. The ticks, the guarantee, the promise to
 * text, the pet-safety policy, the prices and the reviews are all things the site already says on
 * the client's behalf, and they are pulled from the same records where they can be — a campaign
 * page that quietly promised something the rest of the site does not is a page that gets a
 * complaint. Only the HEADLINE is new, and it is wrapped in `todo()` until it is matched to the
 * ad it sits behind.
 *
 * To run a second campaign — a fall clean-up offer, a different audience, an A/B headline — copy a
 * record, give it a new slug and point the new ad at its URL. Every lead it produces reaches the CRM
 * tagged with that slug, so the two can be compared without anyone reading UTM strings.
 */

/** A quote looked up by the reviewer's name, so it is never retyped. Throws on a typo — at build. */
function reviewBy(name: string): Review {
  const review = reviews.find((candidate) => candidate.name === name);
  if (!review) throw new Error(`content/campaigns.ts: no review by "${name}" in content/reviews.ts`);
  return review;
}

export const campaigns: Campaign[] = [
  {
    slug: "poop-free-yard",
    seo: {
      title: "Weekly Dog Poop Removal — Free Quote",
      description: `Weekly yard scooping across ${site.baseCity} and the Main Line from $${startingPrice} a month. No contracts, a text before and after every visit, and a 30-day money-back guarantee.`,
    },

    hero: {
      // The homepage's line, not a retyped copy: "where do you come" has one answer on this site.
      serviceLine: home.hero.serviceLine,
      // OUTSTANDING — match this to the ad. The h1 should repeat the promise the ad made, in close
      // to the ad's own words; that continuity is what tells a visitor they tapped the right thing.
      heading: todo("Never scoop your own yard"),
      highlight: todo("again"),
      subheading: `Weekly poop scooping from $${startingPrice} a month — that's ${perVisit(startingPrice)} a visit. Tell us about your yard and we'll text you a price, usually within the hour.`,
      // Three of the homepage's four assurances and the residential page's text promise. Each is a
      // commitment the client has already made in public.
      points: [
        "No contracts — pause or cancel anytime",
        "30-day money-back guarantee",
        "A text before and after every visit",
      ],
      cta: "Get my free quote",
    },

    form: {
      heading: "Get your free quote",
      intro:
        "Six quick questions — about a minute. We'll come back with a price and a first visit date.",
      submit: "Get my free quote",
      note: "No contract, no sign-up fee. Cancel whenever you like.",
    },

    /**
     * Beside the form, because it answers the question a visitor has at the form: is it worth
     * switching? It is short enough to be read in the time it takes to reach for the first field,
     * and it is the one quote that compares us with someone they may already be paying.
     */
    spotlight: reviewBy("Thomas DePaul"),

    trust: [
      { icon: "local", label: "Locally owned & operated" },
      { icon: "safety", label: "Never while your dog's out" },
      { icon: "insured", label: "Fully insured" },
    ],

    reviews: {
      heading: "Your neighbors already handed over the scooper",
      intro: "From our Google reviews, in their own words.",
      // The six the rest of the site shows — chosen to make six different arguments. See
      // `featuredReviews` for which carries what.
      items: featuredReviews,
    },

    process: {
      eyebrow: "How it works",
      heading: "What working with us looks like",
      intro:
        "Two owners, one very good dog, and the same day every week. Here's what happens after you press the button.",
      image: "whyUs",
      caption: `${site.owner}, Sophie and Blue — the whole crew.`,
      // The thank-you page's three steps, run on to the part that happens every week. Every line is
      // a promise the client already makes: the reply within the hour, the up-front price, the text
      // on the way, the dog rule, the double-bagging.
      steps: [
        {
          title: "Tell us about your yard",
          detail: "Six quick questions. It takes about a minute.",
        },
        {
          title: "Get your price by text",
          detail:
            "Usually within the hour — for the weekly visits and the first clean-up, both up front.",
        },
        {
          title: "We come the same day every week",
          detail:
            "We text when we're on the way, and we never enter while your dog is outside.",
        },
        {
          title: "Enjoy a poop-free yard",
          detail: "We check every inch, double-bag everything, and text you when it's done.",
        },
      ],
    },

    close: {
      heading: "Ready to hand over the scooper?",
      detail:
        "No contract and you can cancel whenever you like. Not happy in your first 30 days? We refund it in full.",
    },
  },
];

/** The record for a slug, or undefined — the page turns that into a 404. */
export function campaignBySlug(slug: string): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}

/**
 * The words the campaign chrome needs. No navigation lives here on purpose — see
 * app/(campaign)/layout.tsx.
 */
export const campaignChrome = {
  /** Under the business name in the footer: what it is and where. */
  footerLine: `Pet waste removal for ${site.baseCity}, ${site.baseRegion} and the surrounding area.`,
} as const;
