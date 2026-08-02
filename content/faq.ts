/**
 * Site-wide FAQ. Feeds both the visible /faq/ page and its FAQPage structured data — one array,
 * so the markup can never claim an answer the page does not show.
 *
 * Answers derived from confirmed facts are plain strings. Anything the client has not told us is
 * wrapped in todo() and will fail a production build. Guessing here is the worst place to guess:
 * an FAQ is where a buyer goes to resolve a doubt, and a wrong answer costs the sale and the trust.
 *
 * TWO LISTS, ONE PAGE. The homepage band and the /commercial/ band each ask a subset of these, and
 * /faq/ is where the whole set lives. The split is by WHO IS ASKING, not by topic: a homeowner and
 * a property manager want different answers to "what areas do you serve?", and interleaving the
 * two makes both look wrong. The commercial questions are imported from the /commercial/ page's
 * own record rather than retyped, so the two pages cannot drift apart.
 */

import { commercial } from "./pages/standing";
import { priceTiers } from "./pricing";
import { todo } from "./todo";
import type { FaqItem } from "./types";

const [firstTier] = priceTiers;

/**
 * The homeowner's set. Ordered the way the doubt actually arrives — how it works, then what
 * happens in the yard, then money, then whether we come to your street.
 *
 * The wording is longer than the same questions on the homepage on purpose. This is the reading
 * version; the landing-page band is the skimming version. See `home.faq`.
 */
export const residentialFaqs: FaqItem[] = [
  {
    question: "Do I need to be home?",
    answer:
      "For your first visit, yes — we'll need you home to walk us through the yard and get gate access set up. After that, you're free to come and go. We text before and after every visit.",
  },
  {
    question: "How often do you come out?",
    answer:
      "Weekly or every other week. Weekly suits most households, especially with more than one dog or a smaller yard. Every other week works well for a single dog with plenty of space.",
  },
  {
    question: "What happens if my dog is outside when you arrive?",
    answer:
      "We never enter the yard while your dog is outside, and we coordinate around your dog's schedule so it rarely comes up. Your pet's safety comes first, with no exceptions.",
  },
  {
    question: "What do you do with the waste?",
    answer:
      "All waste is collected and double-bagged for sanitation and odor control, then hauled off your property.",
  },
  {
    question: "How much does pet waste removal cost?",
    answer: `Pricing depends on how many dogs you have and how often you want us out. Weekly service starts at $${firstTier?.weekly} a month for one or two dogs, and every-other-week service starts at $${firstTier?.biweekly} a month. Larger households are priced by the number of dogs.`,
  },
  {
    question: "How does billing work?",
    answer:
      "We bill monthly via invoice. You can pay online by credit card. No contracts — pause or cancel anytime.",
  },
  {
    question: "Can I add or remove dogs from my plan?",
    answer:
      "Absolutely. Just text or email us and we'll adjust your rate right away.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Chestnut Hill, Mt. Airy, Roxborough and East Falls in Philadelphia, plus Ardmore, Bryn Mawr, Haverford, Narberth, Gladwyne and Glenside on the Main Line. If you are nearby but not on the list, get in touch and we will tell you honestly whether we can reach you.",
  },

  // ── Outstanding. Both are questions real customers ask. ───────────────────
  // "Is there a contract?" used to sit here. It is answered now — see the billing answer above,
  // which is the client's own wording. A second entry saying "no contracts" is the same fact twice.
  {
    question: "What happens in snow or heavy rain?",
    answer: todo(""),
  },
  {
    question: "Do you clean up after the first visit if the yard has built up?",
    answer: todo(""),
  },
];

/**
 * The property manager's set, taken straight from /commercial/. Not retyped: the two pages answer
 * the same five questions, and the only way to guarantee they keep answering them the same way is
 * for there to be one copy of the words.
 */
export const commercialFaqs: FaqItem[] = [...commercial.faq.items];

/** Every question the site asks anywhere, in the order /faq/ renders them. */
export const faqs: FaqItem[] = [...residentialFaqs, ...commercialFaqs];

/** Only answered questions are shown or marked up. An empty answer is not an FAQ entry. */
const answered = (items: FaqItem[]) => items.filter((faq) => faq.answer.trim().length > 0);

export const answeredResidentialFaqs = answered(residentialFaqs);
export const answeredCommercialFaqs = answered(commercialFaqs);
export const answeredFaqs = answered(faqs);
