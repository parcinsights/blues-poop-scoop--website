/**
 * Site-wide FAQ. Feeds both the visible /faq/ page and its FAQPage structured data — one array,
 * so the markup can never claim an answer the page does not show.
 *
 * Answers derived from confirmed facts are plain strings. Anything the client has not told us is
 * wrapped in todo() and will fail a production build. Guessing here is the worst place to guess:
 * an FAQ is where a buyer goes to resolve a doubt, and a wrong answer costs the sale and the trust.
 */

import { priceTiers } from "./pricing";
import { todo } from "./todo";
import type { FaqItem } from "./types";

const [firstTier] = priceTiers;

export const faqs: FaqItem[] = [
  {
    question: "How much does pet waste removal cost?",
    answer: `Pricing depends on how many dogs you have and how often you want us out. Weekly service starts at $${firstTier?.weekly} a month for one or two dogs, and every-other-week service starts at $${firstTier?.biweekly} a month. Larger households are priced by the number of dogs.`,
  },
  {
    question: "How often do you come out?",
    answer:
      "Weekly or every other week. Weekly suits most households, especially with more than one dog or a smaller yard. Every other week works well for a single dog with plenty of space.",
  },
  {
    question: "What happens if my dog is outside when you arrive?",
    answer:
      "We never enter the yard while your dog is outside. Your pet's safety comes first, with no exceptions.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Chestnut Hill, Mt. Airy, Roxborough and East Falls in Philadelphia, plus Ardmore, Bryn Mawr, Haverford, Narberth, Gladwyne and Glenside on the Main Line. If you are nearby but not on the list, get in touch and we will tell you honestly whether we can reach you.",
  },

  // ── Outstanding. Every one of these is a question real customers ask. ──────
  {
    question: "Do I need to be home?",
    answer: todo(""),
  },
  {
    question: "Where does the waste go?",
    answer: todo(""),
  },
  {
    question: "Is there a contract?",
    answer: todo(""),
  },
  {
    question: "What happens in snow or heavy rain?",
    answer: todo(""),
  },
  {
    question: "Do you clean up after the first visit if the yard has built up?",
    answer: todo(""),
  },
];

/** Only answered questions are shown or marked up. An empty answer is not an FAQ entry. */
export const answeredFaqs = faqs.filter((faq) => faq.answer.trim().length > 0);
