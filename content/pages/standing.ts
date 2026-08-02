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
 * The standing pages — /about/, /contact/, /pricing/, /commercial/, /get-started/.
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
    detail: "Tell us where you are and how many dogs you have — we'll do the rest.",
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
    intro: "Whether you manage 20 units or 200, we build a plan that fits your grounds.",
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
        detail: "Stations, bags, trash cans, and signage — all provided and installed by us.",
      },
      {
        icon: "schedule",
        title: "Flexible scheduling",
        detail: "Weekly, bi-weekly, or a custom plan that fits your property's needs.",
      },
      {
        icon: "updates",
        title: "Visit confirmations",
        detail: "You hear from us after every single service visit.",
      },
      {
        icon: "flexible",
        title: "No contracts",
        detail: "Month-to-month service. Adjust or cancel anytime, no penalties.",
      },
      {
        icon: "insured",
        title: "Fully insured",
        detail: "Insured for your peace of mind, and happy to send the certificate.",
      },
      {
        icon: "local",
        title: "Locally owned",
        detail: "Philadelphia neighbors serving our own community — not a franchise territory.",
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
        question: "What areas do you serve?",
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
    heading: "Towns and neighborhoods we cover",
    intro:
      "Northwest Philadelphia and the Main Line. Find yours below and you're already on a route we drive.",
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
