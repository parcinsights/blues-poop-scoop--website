import { FREQUENCIES, type Frequency } from "@/lib/validation";

/**
 * The WORDS every form uses, written once.
 *
 * `leadFields` in lib/validation.ts settles what the forms ask; this settles what they call it.
 * They were separate before and drifted exactly as you would expect — one form's "Email", the
 * other's "Email address"; one's "Weekly", the other's "Once a week" — so a visitor who filled in
 * the card on a service page and then landed on /contact/ was reading two forms, not one form
 * twice.
 *
 * Each label is ALSO the placeholder in the `pill` variant, which is the variant every card on the
 * site uses. That is the constraint the wording answers to: it has to work as a question with the
 * label hidden, and it has to be short enough not to clip at half a card's width.
 */
export const fieldLabels = {
  name: "Your name",
  email: "Email",
  phone: "Phone",
  zip: "Zip code",
  dogs: "How many dogs?",
  frequency: "How often?",
} as const;

/**
 * The words for the stored frequency values. A total `Record`, so adding a value to `FREQUENCIES`
 * without writing a label for it fails the build rather than rendering a blank line in a dropdown.
 */
const frequencyLabels: Record<Frequency, string> = {
  weekly: "Once a week",
  biweekly: "Every other week",
  monthly: "Once a month",
  "not-sure": "Not sure yet",
};

/**
 * The select opens on its own QUESTION as an empty option — this is the select's placeholder, and
 * it is what makes a round control readable with its label hidden. "" is not a valid value and the
 * schema rejects it, so an unanswered question stays unanswered instead of quietly becoming
 * whichever option happened to be first in the list.
 */
export const frequencyOptions = [
  { value: "", label: fieldLabels.frequency },
  ...FREQUENCIES.map((value) => ({ value, label: frequencyLabels[value] })),
];
