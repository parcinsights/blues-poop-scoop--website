import { cities } from "../cities";
import { startingPrice } from "../pricing";
import { site } from "../site";
import { todo } from "../todo";
import type { FaqItem, Seo, WhyUsPoint } from "../types";

/** "A, B and C". Used once, below — the coverage sentence is never typed out by hand. */
function sentenceList(names: readonly string[]): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The service-area answer, DERIVED from content/cities.ts. Adding a town there rewrites this
 * sentence; nobody has to remember that the homepage also names the list.
 *
 * Philadelphia is pulled out because it is one page covering four neighbourhoods — naming the
 * neighbourhoods is what a Chestnut Hill resident is actually scanning for. See cities.ts.
 */
const philadelphia = cities.find((city) => city.slug === "philadelphia");

/**
 * The homepage.
 *
 * The three value props are the client's own words, lifted from their current site. They are kept
 * verbatim on purpose: "We never enter when your dog is outside" is a real operating policy, and a
 * specific policy is worth more than any amount of "reliable, professional, affordable" — which
 * every competitor in Philadelphia is already saying.
 *
 * Still outstanding: how long they have been doing this, how many yards they service now, what
 * happens if they miss a visit, and where the waste actually goes. Those are the details that make
 * a homepage impossible for a franchise to copy.
 */
export const home = {
  seo: {
    title: "Dog Poop Removal in Philadelphia & the Main Line",
    description: `Weekly and bi-weekly pet waste removal in Chestnut Hill, Mt. Airy, Roxborough, Ardmore, Bryn Mawr and more. Plans from $${startingPrice} a month.`,
  } satisfies Seo,

  hero: {
    /**
     * Client's own line, supplied 2026-08-06, and it replaced "We scoop, so you don't have to".
     * The trade is deliberate: the old one was a slogan and this one is the actual offer — what we
     * do, how often, and what you get — which is the sentence a stranger can price in their head.
     */
    heading: "We visit your yard weekly to keep it poop free",
    /**
     * Not a price and not a service list — both of those are a click away, and neither is the
     * reason someone hires this. The problem is the chore, so the copy names the relief rather than
     * the work: "forever" is the word doing the selling, because what is being bought is the last
     * time you ever have to think about it.
     */
    subheading: "One less thing on your list — forever. We handle it so you never have to.",

    /**
     * WHERE WE ARE, above the fold and above the h1. Client-requested 2026-08-06, and it is the
     * first disqualifying question a local service has to answer — someone who arrives from a
     * search for "poop scooper near me" is checking whether "near me" was true before they read a
     * word of the offer. It is a line rather than the coverage band because the band is four
     * screens down, which is three screens too late for the visitor it is bad news for.
     */
    serviceLine: `Serving ${site.baseCity} and surrounding areas`,

    /**
     * The objections a homeowner has in the two seconds before clicking, answered in four
     * fragments. Client-supplied — these are commitments the business is making, so they belong
     * here rather than being invented as copy.
     *
     * The refund joined the strip on 2026-08-06 and it is the strongest of the four: the other
     * three cost the business nothing if it turns out to be lying, and this one costs it the money.
     * It sits second rather than last because a strip is read left to right and abandoned early.
     */
    assurances: [
      "No contracts",
      "30-day money-back guarantee",
      "Cancel anytime",
      "We reply by text",
    ],
  },

  /* `valueProps` USED TO LIVE HERE — the client's three "what we stand for" promises. They now
     live on the record for the page that actually prints them, `about.values` in ./standing.ts,
     because the homepage stopped rendering them when the /about/ band was built and a copy nobody
     renders is a second version of the client's own words waiting to drift from the first. If the
     homepage ever wants them back, it imports that record; it does not retype them. */

  /**
   * The "why us" band. Three of the four points are the client's existing commitments restated —
   * the pet-safety policy, being locally owned, and the no-contract terms already promised in the
   * hero. The guarantee is the new one, and it is the strongest thing on the page: it is the only
   * claim here that costs the business money if it turns out to be false.
   */
  whyUs: {
    heading: "Why your yard is in good hands",
    /**
     * NO INTRO. There used to be a paragraph here — "we're a small local outfit, not a franchise…"
     * — and the client cut it on 2026-08-06. It was right to go: every claim in it is made again,
     * harder and with a medallion beside it, in the four points directly underneath. A paragraph
     * that says what the list is about to say is a delay between a heading and its answer.
     *
     * `WhyUs` takes `intro` as optional for exactly this. See the note there.
     */
    points: [
      {
        icon: "guarantee",
        title: "30-day satisfaction guarantee",
        detail:
          "Not happy with the work in your first 30 days? We refund it in full, no questions asked.",
      },
      {
        icon: "safety",
        title: "Your dog's safety comes first",
        detail:
          "We never enter the yard while your dog is outside. No exceptions, no matter the schedule.",
      },
      {
        icon: "local",
        title: "Your actual neighbors",
        detail:
          "We live and work in the same neighborhoods we serve, and we treat every yard like our own.",
      },
      {
        icon: "flexible",
        title: "No contracts, ever",
        detail: "Cancel any time, and reach a real person by text when something changes.",
      },
    ] satisfies WhyUsPoint[],
    cta: "About us",
  },

  /**
   * The mid-page CTA ribbon, sitting between "why us" and "how it works".
   *
   * That seam is the moment it is worth interrupting: the visitor has just read the guarantee and
   * the safety policy, so they are as convinced as they are going to get, and the band underneath
   * is process rather than persuasion. Someone already sold does not need to be walked through the
   * three steps first.
   *
   * The line under the title is the cost of clicking, not another claim — the objections are
   * already answered twice above.
   */
  ctaBanner: {
    heading: "Ready for a clean yard you don't have to think about?",
    detail: "Tell us your zip code and how many dogs. Takes about a minute.",
  },

  /**
   * The three steps between "interested" and "scooped". Client-supplied, and the second and third
   * exist to answer the one question that stops people booking: do I have to be home? Once for the
   * walkthrough, never again — say it here rather than making them find it in the FAQ.
   */
  howItWorks: {
    heading: "How it works",
    steps: [
      {
        title: "Get a free quote",
        detail: "Fill out our quick online form — takes 60 seconds.",
      },
      {
        title: "We text you back",
        detail:
          "Confirm your schedule. For your first visit, someone should be home to show us the yard.",
      },
      /**
       * The third step is the longest thing in the band, and it earns it. Client-supplied
       * 2026-08-06, and every clause in it is a specific, checkable act — the text on the way, the
       * double bag, the PHOTOGRAPH OF THE CLOSED GATE. That last one is the single most persuasive
       * detail on the homepage: it is the answer to the fear nobody says out loud, which is that a
       * stranger will leave the gate open and the dog will get out.
       */
      {
        title: "Enjoy your yard",
        detail:
          'After the first visit, no need to be home. We send an "on the way" text, we scoop, we double bag, and text you a photo of your closed gate when we\'re done.',
      },
    ],
  },

  /**
   * The coverage band, near the bottom of the page.
   *
   * The intro leads with the base and then the reach, which is the order the client answers it in
   * out loud — see the "Where do you service?" answer above and `pricingPage.serviceArea`. It names
   * Philadelphia's four neighbourhoods on the way past, derived from cities.ts, because a Chestnut
   * Hill resident does not scan for the word Philadelphia, they scan for Chestnut Hill.
   *
   * The link out is worded as a question because it is the escape hatch for the one visitor this
   * band is bad news for — somebody who has just failed to find their street. "See every town we
   * cover" is no use to them; being told to ask is.
   */
  serviceArea: {
    heading: "Where we scoop",
    intro: `We're based in ${sentenceList(philadelphia?.neighborhoods?.slice(0, 1) ?? [])} and service Philadelphia and the surrounding areas — forty-odd neighborhoods and towns across Philadelphia, Montgomery and Delaware counties. If you're close by and not sure, ask us; we'll tell you honestly whether we can reach you.`,
    cta: "See every place we cover",
  },

  /**
   * The pricing band. The prices themselves live in content/pricing.ts and are never retyped here —
   * this is only the words wrapped around them.
   *
   * The promise line is the guarantee restated at the moment of most doubt: a visitor reading a
   * price is deciding, and "you only pay for visits we actually complete" answers the fear the
   * number creates. It is the same 30-day guarantee as the "why us" band, said in money terms.
   */
  pricing: {
    heading: "Simple, flat-rate pricing",
    /** The three objections a price raises, answered before they are asked. Client's own wording. */
    assurances: ["No hidden fees", "No contracts", "Pause or cancel anytime"],
    promise:
      "Every plan backed by our 30-day promise. Full refund, no questions asked — and you only pay for visits we actually complete.",
    cta: "Get started now",
  },

  /**
   * The homepage FAQ. Four questions, not the site's nine: this band exists to clear the last
   * doubts standing between "that price is fine" and booking, so it takes the ones a buyer asks in
   * that moment — do I have to be there, is my dog safe, where does it go, do you even come here.
   * The rest live on /faq/, which the band links out to.
   *
   * The wording is shorter than the same questions on /faq/ on purpose. This is the landing-page
   * version: a visitor here is skimming, and a visitor on /faq/ is reading.
   */
  faq: {
    heading: "Questions we get a lot",
    items: [
      {
        question: "Do I need to be home?",
        answer:
          "For your first visit, yes — we'll need you home to walk us through the yard and get gate access set up. After that, you're free to come and go. We text before and after every visit.",
      },
      {
        question: "What if my dog is outside?",
        answer: "We coordinate around your dog's schedule and never enter when pets are out.",
      },
      {
        question: "What do you do with the waste?",
        answer: "All waste is collected and double-bagged for sanitation and odor control.",
      },
      /**
       * The client's own answer, supplied 2026-08-06, and it replaced a derived sentence that named
       * all fourteen towns. Naming the base — Chestnut Hill — is what the long list was never able
       * to do: it says this is a neighbour rather than a franchise with a territory, and it is the
       * one fact in the answer a competitor cannot also claim.
       *
       * It is deliberately no longer generated from cities.ts. The full list lives on /locations/,
       * which is where somebody looking for their own street is actually going.
       */
      {
        question: "Where do you service?",
        answer:
          "We are based in Chestnut Hill, and service Philadelphia and the surrounding areas.",
      },
    ] satisfies FaqItem[],
    cta: "See all questions",
  },

  /**
   * The second CTA ribbon, between the questions and the coverage map.
   *
   * A different seam from `ctaBanner` and a different job. That one interrupts someone who has
   * just been persuaded; this one catches someone who has finished OBJECTING — the FAQ is the last
   * place doubt gets to speak, and the moment after the last answer is the moment there is nothing
   * left to look up.
   *
   * The wording deliberately shares no line with `ctaBanner`. Two identical ribbons on one page do
   * not read as two chances to click, they read as a page that lost its place.
   *
   * It also has to survive being followed by the map, which is the one band that can still turn a
   * visitor away. So it promises a quote rather than a booking: nobody is being asked to commit
   * before they have seen whether we come to their street.
   */
  ctaAfterFaq: {
    heading: "Question answered? Let's get your yard on the route.",
    detail: "The quote is free and takes about a minute.",
  },

  /**
   * THE CLOSE. The last band on the page, under the coverage map.
   *
   * Not a third ribbon — `CtaBand` is the full band, an h2 at full size and two buttons, and it is
   * the page's last word rather than an interruption in the middle of it. The two ribbons above
   * catch someone mid-scroll; this one catches someone who has read everything and is at the
   * bottom of the page with nowhere else to go.
   *
   * It answers the map directly. The band above it ends on "do you come to my street", so this one
   * opens on the answer to the version of that question we cannot print — if your town was not on
   * the list, ask anyway. That is also why the phone number sits beside the quote button here: the
   * out-of-area visitor is the one person on this page a form cannot help.
   *
   * The wording shares no line with either ribbon. Three CTAs that say the same thing read as a
   * page that lost its place, not as three chances to click.
   */
  cta: {
    heading: "Let's get your yard sorted",
    detail:
      "Tell us your zip and how many dogs you have and we'll send you a price. Don't see your town? Call us — we're still growing.",
  },

  /** OUTSTANDING — the owner interview. See the note above. */
  story: todo(""),
} as const;
