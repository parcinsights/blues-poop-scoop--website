import { ratingSummary } from "../reviews";
import { site } from "../site";
import { todo } from "../todo";
import type {
  ContentBlock,
  FaqItem,
  Feature,
  PointIcon,
  Seo,
  Stat,
  TeamMember,
} from "../types";

/**
 * The standing pages — /about/, /contact/, /pricing/, /commercial/.
 *
 * `/about/` is worth more attention than it looks. An about page is the first thing that goes
 * generic across a trade, and a generic one is worth nothing: "we're passionate about pets" is a
 * sentence on ten thousand sites. What belongs here are the specifics — who these two people are,
 * what the dog is called, what they will and will not do in your yard. Facts a franchise cannot
 * copy, told in the client's own voice.
 */

export const about = {
  seo: {
    title: "About Blue's Poop Scoop",
    description: `Locally owned pet waste removal serving Philadelphia and the Main Line. Meet ${site.owner}, Sophie and Blue.`,
  } satisfies Seo,
  heading: "Meet the team behind the scoop",
  intro:
    "We're a small, local team that genuinely loves what we do — keeping Philadelphia yards clean so families can get back out in them.",

  /**
   * The origin story. Two paragraphs and an aside, and every sentence in it is the client's own —
   * the idea, the two names, the dog, the promise to show up on time. Nothing here is a claim the
   * business would have to defend, which is exactly why it can be told plainly.
   */
  story: {
    eyebrow: "Our story",
    heading: "How it all started",
    paragraphs: [
      "Blue's Poop Scoop was born out of a simple idea: we scoop, so you don't have to. As dog owners ourselves, we know how fast a yard gets out of hand — and we wanted to give Philadelphia families one less thing to worry about.",
      `We're ${site.owner} and Sophie, a two-person team right here in the Philadelphia area. What started with our own dog Blue quickly became a mission to help our neighbors enjoy their yards again. We take pride in showing up on time, doing a thorough job, and treating every yard like it's our own.`,
    ],
    note: "Named after our dog Blue, who supervises every operation from the couch.",
  },

  /**
   * The three promises. The titles and details are VERBATIM from the client — down to the title
   * case, which is theirs and not the house style — and they moved here from `home.valueProps`
   * when this band was built. Do not smooth them out; the specificity is the value.
   *
   * The heading is `site.tagline` rather than a retyped copy of it: it is the line already on their
   * own site, and two versions of a tagline is how a business ends up with two.
   *
   * The medallions are new. On the homepage these ran as three plain cards; here they are the
   * page's only band of icons, and three bare cards between a photograph and three portraits read
   * as the gap between them.
   */
  values: {
    eyebrow: "What we stand for",
    heading: site.tagline,
    points: [
      {
        icon: "guarantee",
        title: "Honest & Dependable",
        detail:
          "We show up when we say we will. No excuses, no surprises. Just a clean yard, every time.",
      },
      {
        icon: "safety",
        title: "Pet Safety First",
        detail:
          "We never enter when your dog is outside. Your pet's safety always comes first — no exceptions.",
      },
      {
        icon: "local",
        title: "Locally Owned",
        detail:
          "We live and work in the neighborhoods we serve. This is our community, and we treat every yard like it's our own.",
      },
    ] satisfies Feature[],
  },

  /**
   * The crew. Two owners and the dog, in that order, because the dog is the punchline and a
   * punchline goes last.
   *
   * The bios are the client's own and say what each person actually does — one runs the route, one
   * runs everything around it. That division of labour is the fact worth printing: it tells a
   * customer who texts them back and who turns up.
   */
  team: {
    eyebrow: "The crew",
    heading: "Two owners and one very good dog",
    members: [
      {
        name: site.owner,
        role: "Co-Owner & Lead Scooper",
        bio: "George is the visionary and systems master. He built the systems that keep the business running smoothly, and he handles the day-to-day scooping. If there's a mess, he'll find it.",
        image: "teamGeorge",
      },
      {
        name: "Sophie",
        role: "Co-Owner & Operations",
        bio: "Sophie runs operations — customer messages, social media, scheduling, and making sure every client feels taken care of.",
        image: "teamSophie",
      },
      {
        name: "Blue",
        role: "Fearless Leader & Mascot",
        bio: "Blue is the reason we started this company. He keeps morale high and naps on schedule. True leadership.",
        image: "teamBlue",
      },
    ] satisfies TeamMember[],
  },

  /**
   * The strip under the crew. Four figures, and the last one is a joke — that is what stops it
   * reading as a corporate stat block on a page about two people and a dog.
   *
   * The star count comes from `ratingSummary`, the same record the hero and the review cards use,
   * so the page cannot advertise a rating the rest of the site disagrees with. "Locally owned" and
   * "no contracts" are stated across the site already; both are the client's own terms.
   */
  stats: [
    { value: `${ratingSummary.stars}★`, label: "Google rating" },
    { value: "100%", label: "Locally owned & operated" },
    { value: "0", label: "Contracts required" },
    { value: "1", label: "Bestest boy" },
  ] satisfies Stat[],

  cta: {
    heading: "Let's get your yard sorted",
    detail:
      "Tell us where you are and how many dogs you have — we'll do the rest.",
  },

  /** OUTSTANDING — a longer authored piece, if the client ever wants one. See the note above. */
  body: [] as ContentBlock[],
};

export const contact = {
  seo: {
    title: "Contact Blue's Poop Scoop",
    description: `Call ${site.phone.display} or send us a message. Pet waste removal across Philadelphia and the Main Line.`,
  } satisfies Seo,
  heading: "Get in touch",
  intro: "Call, email, or send a message and we'll get back to you.",

  /**
   * The quote form's own words. The page's h1 is the greeting above; this is the title of the
   * thing you fill in, and it says what the form is for rather than repeating "contact us" — a
   * form under a heading that names it twice reads as two forms.
   *
   * The intro exists to price the form in TIME. Six fields is more than the short form asks for,
   * and the honest answer to "how long is this going to take" is the cheapest thing on the page to
   * print — it is what stops someone counting the boxes and leaving.
   */
  form: {
    heading: "Tell us about your yard",
    intro:
      "Six quick questions — about a minute. We'll come back with a price and a first visit date.",
  },

  /**
   * The column beside the form, for the two kinds of visitor it does not suit: the one who would
   * rather talk to a person, and the one who wants to know what happens after they press the
   * button. Both are on the page anyway; saying so out loud costs three lines.
   *
   * The steps are what the business actually does — no promise of a timeframe we have not agreed.
   */
  aside: {
    /**
     * Three steps, each a title you can read at a glance and one line under it. Titled rather than
     * bare sentences because they are rendered as the same numbered cards the homepage uses for
     * "how it works" — see `NextSteps` — and a card with no title is a paragraph in a box.
     */
    stepsHeading: "What happens next",
    steps: [
      {
        title: "We check your zip",
        detail: "If we don't reach your street yet, we'll tell you straight away.",
      },
      {
        title: "You get a price",
        detail: "For the regular visits and for the first clean-up, both up front.",
      },
      {
        title: "You pick a start date",
        detail: "No contract, no sign-up fee. Cancel whenever you like.",
      },
    ],
    heading: "Prefer to talk?",
    detail: "Call or text and you'll get one of us — no phone tree, no sales script.",
  },

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
/**
 * /thank-you/ — where every form on the site lands after a successful submit.
 *
 * A PAGE rather than an inline success message, and the reason is counting. A conversion here is
 * now one page view of one URL, which is the only thing an analytics property and a CRM
 * automation can both be pointed at without either being taught about four different forms in
 * three different card shapes. The inline callout also had a second problem: it left someone
 * sitting on a page whose entire job had just finished, with nothing to do next.
 *
 * It is `noindex` and it is absent from the sitemap — see lib/routes.ts. A thank-you page in the
 * index is a page people arrive at without having submitted anything, which quietly poisons the
 * one number it exists to produce.
 */
export const thankYou = {
  seo: {
    title: "Thanks — we've got your request",
    description:
      "Your request is in. We'll be back to you shortly with a price for your yard and a first visit date.",
  } satisfies Seo,
  heading: "Thanks — we've got it.",
  intro:
    "Your request is in and one of us has it. We'll be back to you shortly with a price for your yard and a date for the first visit.",

  /**
   * The same three steps /contact/ prints beside its form, said in the past tense of someone who
   * has now pressed the button. They are repeated on purpose: the promise made next to the form
   * is the promise that has to be kept on the page after it, and a thank-you that says only
   * "thanks" makes the visitor wonder what they actually signed up for.
   */
  stepsHeading: "What happens next",
  steps: [
    {
      title: "We check your zip",
      detail: "If we don't reach your street yet, we'll tell you straight away — no waiting.",
    },
    {
      title: "You get a price",
      detail: "For the regular visits and for the first clean-up, both up front. Usually a text back within the hour.",
    },
    {
      title: "You pick a start date",
      detail: "No contract, no sign-up fee. Pause or cancel whenever you like.",
    },
  ],

  /** For the visitor who does not want to wait for the text. */
  aside: {
    heading: "Need us sooner?",
    detail: "Call or text and you'll get one of us — no phone tree, no sales script.",
  },
};

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
    /**
     * "We'd rather fix it than argue about it" opened this line until 2026-08-06, when the client
     * cut it. They were right to: it is a sentence about a dispute, printed directly under a price,
     * and it introduces the idea of arguing with us to a reader who was not thinking about it.
     * What is left is the promise and its terms, which is all this line was ever for.
     */
    intro: "Every plan comes with the same three promises. None of them have fine print.",
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
   * The coverage band — THE MAP, since 2026-08-07.
   *
   * It used to be forty-five zip-code chips (`ServiceZips`, which still exists and is no longer
   * rendered anywhere). The client asked for the same map the other pages carry, and it is the
   * better object: a zip is a number you look up, and a shape is something you recognise. See the
   * note on `CoverageMap`.
   *
   * Nothing here names a place. The map draws itself from the generated outline and the two buttons
   * hand off to the pages that do — which is why this copy cannot go stale when a route changes.
   */
  serviceArea: {
    heading: "Where we scoop",
    /**
     * The client's own sentence, 2026-08-06. It replaced "We cover most of Philadelphia and the
     * Main Line" — a claim that had drifted twice over: "most of" understated a footprint that is
     * forty-odd towns, and "the Main Line" named one corner of it as though it were the other half.
     */
    intro:
      "We service Philadelphia and the surrounding areas. If you're inside the shape below, we come to you.",
    listLabel: "See every place we cover",
    contactLabel: "Don't see your area? Ask us",
  },

  /** The wall, trimmed to the homepage's set. Proof sits under coverage: it is worth most to someone who has just found their own zip. */
  reviews: {
    heading: "See what our friends are saying about us",
  },

  body: [] as ContentBlock[],
};

/**
 * /residential/ — the homeowner's front door, and the twin of /commercial/ below.
 *
 * Everything here is the client's own copy from their current site, restructured into the bands the
 * page renders. That is why so little of it is wrapped in `todo()`: it is not our invention, it is
 * what this business already tells homeowners in public.
 *
 * WHAT THIS RECORD DOES NOT CONTAIN, deliberately: the three steps, the prices, the guarantee, the
 * coverage sentence and the questions. Every one of those is already written for the homepage,
 * /pricing/ or content/faq.ts, and the residential page renders those SAME records — see
 * app/residential/page.tsx. A second copy of "how it works" that happens to live on the residential
 * page is a second version of the client's words waiting to drift from the first.
 *
 * So what is left is what only this page says: the claim at the top, the six reasons under it, and
 * the three CTAs that carry a homeowner between them.
 */
export const residential = {
  seo: {
    title: "Residential Dog Poop Removal | Philadelphia & the Main Line",
    description:
      "Weekly and bi-weekly yard scooping for Philadelphia homeowners. No contracts, a text before and after every visit, and we never enter while your dog is outside.",
  } satisfies Seo,

  /**
   * The client's own h1, kept verbatim — the same call /commercial/ makes about its own copy.
   *
   * "Most Trusted" IS THE ONE LINE ON THIS PAGE THAT NOTHING BACKS. It is ordinary trade puffery and
   * it is what they already say in public, so it stands; but it is also the opposite of how the rest
   * of this site argues, which is by printing specifics a franchise cannot copy — the reviews below
   * it, the safety policy, the refund. If George ever wants a defensible version, this is the field
   * to change, and the honest replacement is a fact rather than a softer adjective.
   */
  heading: "Philadelphia's most trusted residential poop scoop service",
  intro:
    "We scoop so you don't have to. Reliable weekly or bi-weekly service for your yard.",

  /**
   * The strip under the hero. Three facts and NO rating — the hero above already carries the stars,
   * and the same claim twice in touching bands reads as a site that only has the one thing to say.
   * /commercial/ splits it the other way round for exactly that reason: no rating in its hero, the
   * rating in its strip.
   */
  trust: [
    { icon: "local", label: "Philadelphia & the Main Line" },
    { icon: "safety", label: "Never while your dog's out" },
    { icon: "updates", label: "Text before and after" },
  ] satisfies { icon: PointIcon; label: string }[],

  /**
   * The six reasons, and they are the client's own six. Left-hung rather than centred, the call
   * `commercial.promise` makes at the same count: three items with a medallion each are a row of
   * equals you take in at a glance, six are a list you read down.
   *
   * Two of them restate promises the site makes elsewhere — the pet-safety policy and the
   * no-contract terms — and that repetition is the point on a page somebody can land on cold from
   * search without ever seeing the homepage.
   */
  whyUs: {
    eyebrow: "Why Blue's Poop Scoop",
    heading: "Why Philly homeowners choose us",
    features: [
      {
        icon: "guarantee",
        title: "Thorough & reliable",
        detail: "We double-check every inch of your yard so nothing gets missed.",
      },
      {
        icon: "schedule",
        title: "Flexible scheduling",
        detail: "Weekly or bi-weekly cleanups to fit your routine.",
      },
      {
        icon: "updates",
        title: "Text notifications",
        detail: "We text you when we're on the way and when the job's done.",
      },
      {
        icon: "safety",
        title: "Pet-safe visits",
        detail:
          "We never enter when your dog is outside. Your pet's safety always comes first.",
      },
      {
        icon: "disposal",
        title: "Double-bagged disposal",
        detail:
          "All waste is collected and double-bagged for sanitation and odor control.",
      },
      {
        icon: "flexible",
        title: "No contracts",
        detail: "Pause or cancel anytime. No hidden fees, no commitments.",
      },
    ] satisfies Feature[],
  },

  /**
   * The guarantee band is `pricingPage.guarantee` — the same heading, the same intro, the same three
   * promises. Only the kicker is this page's, because /pricing/ does not use one. See the page.
   */
  promise: {
    eyebrow: "Our promise",
  },

  /** The wall. Worded for this page's reader rather than reusing the homepage's line. */
  reviews: {
    heading: "What Philly dog owners say about us",
  },

  /**
   * The mid-page ribbon, between the prices and the guarantee. Same seam the homepage uses it at and
   * the same job — catch somebody who has just read a number — but not one shared line: two pages
   * running the identical ribbon is how a visitor who came via search reads the second one as the
   * first one repeating itself.
   */
  ctaBanner: {
    heading: "Ready to hand the scooping over?",
    detail: "Your zip and how many dogs. That's the whole form.",
  },

  /**
   * The close, under the coverage map — so it answers the map, exactly as the homepage's does: the
   * band above it can still turn a visitor away, and the phone number beside the quote button is
   * the only thing on the page that helps somebody whose street we do not reach yet.
   */
  cta: {
    heading: "Let's get your yard on the route",
    detail:
      "Tell us your zip and how many dogs, and we'll come back with a price and a first visit date. No contract, cancel whenever you like.",
  },

  /**
   * The questions are `residentialFaqs` from content/faq.ts, trimmed to the first five — that list
   * is ordered the way a homeowner's doubt actually arrives, so the first five are the earliest
   * ones. The band links out to /faq/ for the rest, which is also what stops this page and /faq/
   * printing the same eight answers at each other.
   */
  faq: {
    heading: "Questions homeowners ask",
    cta: "See all questions",
  },
};

/**
 * /commercial/ — the second front door.
 *
 * Everything below is the client's own copy from their current site, restructured into the bands
 * the page renders. That is why almost none of it is wrapped in `todo()`: it is not our invention,
 * it is what this business already tells property managers in public. Where their wording claims
 * something the rest of this repo has not verified, the note on that field says so.
 *
 * WHAT THIS PAGE SELLS, and it is not the residential service with a different heading: stations.
 * We supply the dispensers and the cans, we install them, and we come back to restock and empty
 * them. A homeowner is buying a scooped lawn; a property manager is buying equipment they do not
 * have to own and a complaint that stops arriving. The two pages share a crew and nothing else.
 *
 * The page stays UNPUBLISHED — `body` is empty, so `isPublishable` is false, the page carries
 * noindex and lib/routes.ts keeps it out of the sitemap. That gate is deliberately independent of
 * how finished the page looks: it flips when the client confirms they are actually taking this
 * work, which is a business fact and not a design one. See lib/content.test.ts.
 */
export const commercial = {
  seo: {
    title: "Commercial Pet Waste Removal | HOAs & Apartments | Philadelphia",
    description:
      "We supply, install and service pet waste stations for apartment communities, HOAs and dog parks around Philadelphia. No contracts, all equipment included.",
  } satisfies Seo,

  /**
   * The h1 leads with the equipment rather than with the cleaning, because that is the part a
   * property manager does not already know they can buy. "Commercial pet waste removal" is what
   * they search; "stations, installed and serviced for you" is what makes them read the next line.
   */
  heading: "Pet waste stations, installed & serviced for you",
  intro:
    "We supply bag dispensers and trash cans, install them on your property, and keep them stocked — so your grounds stay clean and residents stay happy.",
  /** The three objections a manager has before clicking, answered in three fragments. */
  assurances: ["No contracts", "All equipment included", "Custom plans"],

  /**
   * The strip under the hero. Three facts, and the rating is the client's real Google standing —
   * the label is the same placeholder the homepage carries and needs the same fix: the actual
   * review count, so it can be checked. See `ratingSummary` in content/reviews.ts.
   */
  trust: [
    { icon: "local", label: "Philadelphia based" },
    { icon: "flexible", label: "No contracts" },
  ] satisfies { icon: PointIcon; label: string }[],

  /** What the service actually consists of — the three parts of the job, in the order they happen. */
  services: {
    heading: "Everything your property needs",
    intro:
      "We handle the full pet waste process — equipment, installation, restocking, and removal. Nothing on this list is something you buy or store yourself.",
    features: [
      {
        icon: "stations",
        title: "Station installation",
        detail:
          "We provide and install pet waste bag dispensers and trash cans in the spots across your property where they will actually get used.",
      },
      {
        icon: "schedule",
        title: "Ongoing servicing",
        detail:
          "Regular bag restocking, liner changes, and trash removal on a schedule that works for your community.",
      },
      {
        icon: "updates",
        title: "Visit confirmations",
        detail:
          "You'll hear from us after every visit, so you always know the work got done without having to go and check.",
      },
    ] satisfies Feature[],
  },

  /**
   * The eight property types, and the band's job is recognition rather than information: a manager
   * scanning for "condos & HOAs" needs to find those exact words, because the alternative is
   * deciding a page about "communities" is about somebody else.
   *
   * They are tags, not links — there are no pages behind them. See `AudienceBand`.
   */
  audiences: {
    eyebrow: "Who we serve",
    heading: "Built for properties with pet traffic",
    intro:
      "Whether you manage 20 units or 200, we build a plan that fits your grounds.",
    items: [
      "Apartment communities",
      "Condos & HOAs",
      "Dog parks",
      "Office parks",
      "Veterinary clinics",
      "Senior living",
      "Hotels",
      "Public parks",
    ],
  },

  /**
   * The same three-step band the homepage runs, with the commercial version of each step. The one
   * that earns the band is the second: "nothing for you to buy" is the answer to the question a
   * manager is actually holding, which is what this costs to start.
   */
  howItWorks: {
    heading: "Three easy steps",
    steps: [
      {
        title: "Free property walkthrough",
        detail:
          "We visit your property, assess foot traffic and pet areas, and recommend the right number and placement of stations.",
      },
      {
        title: "We install everything",
        detail:
          "Bag dispensers, trash cans, and signage — all provided and installed by our team. Nothing for you to buy.",
      },
      {
        title: "Sit back & relax",
        detail:
          "We return on schedule to restock bags, swap liners, and haul waste. You get a confirmation after every visit.",
      },
    ],
  },

  /**
   * The review wall, and the heading is careful on purpose: every quote on it is from a RESIDENTIAL
   * customer, because those are the reviews that exist. "What our customers say" is true. Anything
   * implying a property manager left one would not be, and this is the easiest place on the page to
   * do that by accident.
   */
  reviews: {
    heading: "What our customers say about us",
  },

  /**
   * The six promises, directly before the closing CTA. Five are terms the client already publishes;
   * the sixth is the one to watch.
   *
   * NOTE ON "insured": the client's own site says "licensed and insured". The word `licensed` is
   * dropped here because nothing in this repo records what licence that refers to, and a licence
   * claim on a commercial page is exactly the kind of thing a property manager's insurer asks to
   * see. `insured` alone is what /pricing/ already commits to. Put it back the moment George
   * supplies the licence.
   */
  promise: {
    eyebrow: "Our promise",
    heading: "Why property managers work with us",
    points: [
      {
        icon: "stations",
        title: "All equipment included",
        detail:
          "Stations, bags, trash cans, and signage — all provided and installed by us.",
      },
      {
        icon: "schedule",
        title: "Flexible scheduling",
        detail:
          "Weekly, bi-weekly, or a custom plan that fits your property's needs.",
      },
      {
        icon: "updates",
        title: "Visit confirmations",
        detail: "You hear from us after every single service visit.",
      },
      {
        icon: "flexible",
        title: "No contracts",
        detail:
          "Month-to-month service. Adjust or cancel anytime, no penalties.",
      },
      {
        icon: "insured",
        title: "Fully insured",
        detail:
          "Insured for your peace of mind, and happy to send the certificate.",
      },
      {
        icon: "local",
        title: "Locally owned",
        detail:
          "Philadelphia neighbors serving our own community — not a franchise territory.",
      },
    ] satisfies Feature[],
  },

  /** The close. The ask is the walkthrough, because that is the only thing being sold at this point. */
  cta: {
    heading: "Want to know what your property needs?",
    detail:
      "We'll walk the grounds, tell you how many stations it takes and where they go, and price it from there. No charge, and no obligation to book anything.",
  },

  /**
   * Five questions, and the first one is the whole objection: a manager reading this is assuming
   * there is a capital purchase hiding somewhere. There is not, and the answer says so first.
   */
  faq: {
    heading: "Common questions about commercial service",
    items: [
      {
        question: "Do we need to buy the bag dispensers and trash cans?",
        answer:
          "No. We provide, install, and maintain all equipment as part of your service plan. If anything breaks, we replace it.",
      },
      {
        question: "How often do you service the stations?",
        answer:
          "We customize the schedule based on your property's needs. Most communities choose weekly or bi-weekly service, which includes bag restocking, liner changes, and waste removal.",
      },
      {
        question: "Is there a contract or commitment?",
        answer:
          "No long-term contracts. We believe in earning your business every visit, so you can adjust or cancel at any time.",
      },
      {
        question: "How many stations does my property need?",
        answer:
          "That depends on the size of your property and where residents actually walk their dogs. During our free walkthrough we'll recommend the right number and placement.",
      },
      {
        // Deliberately not "What areas do you serve?" — the residential set already asks that and
        // answers it with a list of towns, and /faq/ renders both sets on one page. Two entries
        // with the same question and different answers is the worst version of this.
        question: "Which areas do you cover for commercial properties?",
        answer:
          "We serve commercial properties throughout the greater Philadelphia area. Call us to confirm availability for your property.",
      },
    ] satisfies FaqItem[],
  },

  /** The publish gate, and nothing else renders from it. See the note at the top of this record. */
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
 * /locations/ — the coverage page.
 *
 * The whole page answers one question, and the copy's job is to keep answering it in a different
 * currency each band: the map shows the shape, this band names the towns, the cards below link to
 * the page for each. Nothing here restates the guarantee or the prices — someone who has not yet
 * established that we come to their street is not reading either.
 *
 * The note is the same escape hatch as `pricingPage.serviceArea`, reworded for names rather than
 * zips. It is doing real work on this page: the town list is honestly incomplete inside
 * Philadelphia (see `servicedPlaces` in content/cities.ts), so the invitation to ask is the part
 * that keeps the band from turning away someone we would actually serve.
 */
export const locationsPage = {
  towns: {
    heading: "Towns and neighborhoods with their own page",
    /**
     * The heading gained "with their own page" on 2026-08-06, when the full forty-four-name list
     * arrived and went into the band below this one. Before that this was the whole answer and
     * "towns we cover" was true; with a longer list underneath it, the old heading made the shorter
     * list look like the coverage and the longer one like a mistake.
     */
    intro:
      "These ones have a page of their own. Find yours and you're already on a route we drive — the full coverage list is underneath.",
    note: {
      before: "Somewhere close by that isn't listed?",
      link: "Ask us",
      after: " — we'll tell you honestly whether we can reach you.",
    },
    form: {
      heading: "Get a free quote",
      intro: "Zip code and how many dogs. We'll text you back with a price.",
    },
  },

  /**
   * The full coverage list, under the band of town chips.
   *
   * The two bands are deliberately different answers to the same question, in the order a visitor
   * needs them: the chips above are the places with a PAGE, so somebody who finds their town there
   * gets taken somewhere; this is everywhere the van actually goes, so somebody who did not find
   * their town above still gets a yes. See content/neighborhoods.ts.
   */
  served: {
    heading: "Every place we scoop",
    intro:
      "The full list — Philadelphia and the surrounding areas. If you're on it, we come to you. There is no minimum and no sign-up fee.",
    note: {
      before: "Not on the list?",
      link: "Ask us anyway",
      after: " — we're still growing, and we'll tell you honestly whether we can reach you.",
    },
  },
};

/**
 * /opportunities/ — hiring.
 *
 * A hiring page on a small trade site is read by two people: someone deciding whether to apply,
 * and a customer checking whether the business is real. Both are served by the same thing —
 * specifics. Pay, hours, the vehicle situation, whether it is seasonal.
 *
 * ── WHY THE TERMS ARE VAGUE ─────────────────────────────────────────────────
 * The client was asked for the pay rate, the hours and the vehicle situation, and on 2026-08-06
 * said they do not have them settled yet and would rather the section stayed open than waited.
 * That is a legitimate answer, and it is the reason the `role` band below now says "we'll talk
 * about it on the call" instead of carrying six `todo()` strings that would fail a build.
 *
 * THE LINE THAT WAS HELD: nothing here invents a number, a schedule or a requirement. Every field
 * either states something the business already knows to be true — the towns, the outdoor work, the
 * dogs — or says plainly that the answer comes in conversation. "Competitive pay" and a made-up
 * hourly range are the two things this page will never say. When George settles the real terms,
 * this record is where they go, and each one replaces a sentence rather than being bolted on.
 */
export const opportunities = {
  seo: {
    title: "Now Hiring | Work With Blue's Poop Scoop",
    description:
      "We're hiring in Philadelphia and the surrounding areas. Outdoor work, your own route, and dogs all day.",
  } satisfies Seo,
  heading: "Come work with us",
  intro:
    "We're a small local crew, and we're growing. If you like dogs, working outside, and being trusted to run your own day, we'd like to hear from you.",

  /**
   * The three reasons to want this job, as a `FeatureGrid`.
   *
   * Note what is NOT in here: money. A perks band that leads with "competitive pay" and no number
   * is the sentence every applicant has learned to read as "below market", and the number itself
   * is George's to give. When it arrives it belongs in `role` below, stated plainly, not dressed
   * up as a benefit here.
   */
  perks: {
    eyebrow: "Why this job",
    heading: "What you get out of it",
    points: [
      {
        icon: "local",
        title: "A small crew, not a franchise",
        detail:
          "You would be working directly with the two people who own the business, on routes they run themselves. There is no regional manager and no script.",
      },
      {
        icon: "schedule",
        title: "Your own route",
        detail:
          "You get a list of yards and a day to do them in. How you order them is up to you, and nobody is tracking you between stops.",
      },
      {
        icon: "flexible",
        title: "Outside, with dogs",
        detail:
          "It is honest outdoor work in the same neighborhoods every week, and most of the customers have a dog that will be pleased to see you.",
      },
    ] satisfies Feature[],
  },

  /**
   * The role itself — what an applicant needs before they will spend a phone call on this.
   *
   * FOUR ENTRIES, NOT SIX. "Pay" and "Hours" used to sit at the top of this list as placeholders
   * and they are gone, because a careers page that names a heading called Pay and then does not
   * answer it is worse than one that never raised it — the reader draws the conclusion the silence
   * invites. Both are now handled once, honestly, by the `intro` and the last entry: we will tell
   * you on the call. When the real terms exist they come back as entries here, at the top.
   *
   * What is left is everything we DO know today, and it is not nothing: where the work is, what it
   * physically involves, and that no experience is needed. That is enough for somebody to decide
   * whether to pick up the phone, which is the only decision this page is asking for.
   */
  role: {
    eyebrow: "The role",
    heading: "What the job actually is",
    intro:
      "We're still working out the details on pay and schedule, and we'd rather tell you the real numbers on a call than post a range we might have to walk back. Here's everything we can tell you now.",
    points: [
      {
        title: "The work itself",
        detail:
          "You visit a list of yards, scoop them, double-bag what you collect, and text the customer before you arrive and after you finish. It is outdoors, on your feet, in whatever the weather is doing.",
      },
      {
        title: "Where you would work",
        detail:
          "Philadelphia and the surrounding areas — Chestnut Hill, Mt. Airy, Roxborough, Manayunk and East Falls in the city, and the towns north and west of it: Abington, Ambler, Flourtown, Jenkintown, Willow Grove, Fort Washington, Plymouth Meeting, Blue Bell and the rest. Routes are grouped, so you are not crossing the county twice in a day.",
      },
      {
        title: "Experience",
        detail:
          "None needed. We train on the route, and the part that actually takes learning is how to be around somebody else's dog and somebody else's gate — which is the part we would rather teach you ourselves anyway.",
      },
      {
        title: "Pay, hours and the rest",
        detail:
          "Ask us. We'll give you a straight answer on the phone about what the rate is, how many days there are, and whether you would be driving your own vehicle — before either of us spends any more time on it.",
      },
    ] satisfies Feature[],
  },

  /**
   * How to apply. Three steps, because the whole point of the band is that applying is short —
   * a numbered list with two entries reads as an afterthought and one with five reads as a process.
   *
   * The destination is the outstanding fact: there is no careers inbox on file, so step one points
   * at the phone number, which is real. Swap it for an address the day there is one.
   */
  apply: {
    heading: "How to apply",
    steps: [
      {
        title: "Get in touch",
        detail:
          "Call or text us. Tell us your name, which towns you can get to, and when you can start.",
      },
      {
        title: "Talk it through",
        detail:
          "A short call with George — what the days look like, what the pay is, and whatever you want to ask.",
      },
      {
        title: "Ride along",
        detail:
          "Come out on a route with us before either of us commits. You see the actual work, we see how you are around a dog.",
      },
    ],
  },

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
  intro:
    "Notes from the route — seasonal yard care, and the questions our customers actually ask.",

  /**
   * THE EMPTY STATE — what /blog/ shows until the first post lands, which is most of its life.
   *
   * It is written as a page, not as an apology. An empty archive that says "no posts found" tells
   * a visitor the site is unfinished; this one tells them why there is nothing here, which is a
   * position rather than an oversight, and then does the only useful thing an empty page can do:
   * hand them somewhere else to go.
   *
   * The topics are the subjects, not headlines and not dates. They say what this blog will be
   * about without promising a post that has to exist by Friday — and every one of them is a
   * question the route already answers out loud, so none of them is a commitment George would
   * have to invent something to keep.
   */
  empty: {
    badge: "First post on the way",
    heading: "Nothing here yet",
    detail:
      "We would rather write something worth reading than fill this page up. When we've got something useful to say, it lands here.",
    topicsHeading: "What we'll be writing about",
    topics: [
      "Seasonal yard care",
      "New puppy, new yard",
      "Why spring costs more",
      "Keeping a yard usable in winter",
    ],
    /** The two exits. The FAQ answers today what the blog would have; pricing is the next step. */
    faqLabel: "Read the FAQ",
    pricingLabel: "See our pricing",
  },
};

/**
 * /get-started/'s copy used to live here. The page was merged into /contact/ on 2026-08-02 — one
 * quote form, one destination for every CTA — and its words went with it. See `contact` above.
 */
