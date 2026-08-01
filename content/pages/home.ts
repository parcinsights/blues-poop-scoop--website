import { cities } from "../cities";
import { startingPrice } from "../pricing";
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
const elsewhere = cities.filter((city) => city.slug !== "philadelphia").map((city) => city.name);

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
    heading: "We scoop, so you don't have to",
    /**
     * Not a price and not a service list — both of those are a click away, and neither is the
     * reason someone hires this. The problem is the chore and the low-grade guilt around it, so
     * the copy names that, then answers it with the one operating policy that is actually theirs:
     * they never enter while the dog is outside. See `valueProps` below — it is the same promise,
     * and it is repeated here on purpose.
     */
    subheading:
      "Your yard should be somewhere you and your dog actually want to be. We keep it that way — on schedule, every week, and never while your pup is outside.",

    /**
     * The objections a homeowner has in the two seconds before clicking, answered in three
     * fragments. Client-supplied — these are commitments the business is making, so they belong
     * here rather than being invented as copy.
     */
    assurances: ["No contracts", "Cancel anytime", "We reply by text"],
  },

  /** Verbatim from the client. Do not smooth these out — the specificity is the value. */
  valueProps: [
    {
      title: "Honest & Dependable",
      detail:
        "We show up when we say we will. No excuses, no surprises. Just a clean yard, every time.",
    },
    {
      title: "Pet Safety First",
      detail:
        "We never enter when your dog is outside. Your pet's safety always comes first — no exceptions.",
    },
    {
      title: "Locally Owned",
      detail:
        "We live and work in the neighborhoods we serve. This is our community, and we treat every yard like it's our own.",
    },
  ],

  /**
   * The "why us" band. Three of the four points are the client's existing commitments restated —
   * the pet-safety policy, being locally owned, and the no-contract terms already promised in the
   * hero. The guarantee is the new one, and it is the strongest thing on the page: it is the only
   * claim here that costs the business money if it turns out to be false.
   */
  whyUs: {
    heading: "Why your yard is in good hands",
    intro:
      "We're a small local outfit, not a franchise — the people who scoop your yard are the same ones who answer the phone. If we ever leave you unhappy, we'd rather give the money back than argue about it.",
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
    heading: "Ready for a yard you don't think about?",
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
      {
        title: "Enjoy your yard",
        detail:
          "After the first visit, no need to be home — we scoop, double-bag, and text you when done.",
      },
    ],
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
    /** The three objections a price raises, answered before they are asked. */
    assurances: ["No hidden fees", "No contracts", "Pause anytime"],
    promise:
      "Every plan backed by our 30-day promise. Full refund, no questions asked — and you only pay for visits we actually complete.",
    cta: "Get my free quote",
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
      {
        question: "Where do you service?",
        answer: `${sentenceList(philadelphia?.neighborhoods ?? [])} in Philadelphia, plus ${sentenceList(elsewhere)}. If you're nearby but not on that list, ask us — we'll tell you honestly whether we can reach you.`,
      },
    ] satisfies FaqItem[],
    cta: "See all questions",
  },

  /** OUTSTANDING — the owner interview. See the note above. */
  story: todo(""),
} as const;
