import type { Metadata } from "next";

import { CtaBand, FaqAccordion } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionDivider } from "@/components/ui/layout";
import { answeredCommercialFaqs, answeredFaqs, answeredResidentialFaqs } from "@/content/faq";
import { routes } from "@/lib/routes";
import { faqPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Frequently Asked Questions",
  description:
    "How pricing and billing work, how often we visit, what happens if your dog is outside, which areas we cover, and how service works for commercial properties.",
};

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "FAQ", path: routes.faq() },
];

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.faq() });

/**
 * /faq/ — every question the site asks anywhere, in one place.
 *
 * TWO ACCORDIONS, NOT ONE. The homeowner's questions and the property manager's questions are
 * different questions with different right answers — "what areas do you serve?" is answered by a
 * list of towns for one and by a phone call for the other — so interleaving them makes both look
 * wrong. Splitting them also means the commercial set can stay verbatim identical to the band on
 * /commercial/; see `commercialFaqs`.
 *
 * WHITE THROUGHOUT, cream only at the close. Every band here is a column of text on the same
 * surface, so the page reads as one continuous document and the single colour change at the bottom
 * is the only thing on it that says "stop reading, do something". That is why the two accordions
 * are separated by a `SectionDivider` rather than by a tone change — a colour swap mid-page would
 * spend the one signal the page has.
 *
 * The FAQPage graph is built from `answeredFaqs` — the union of the two arrays the page renders.
 * An unanswered question is in neither, so the structured data can never promise an answer the page
 * does not show, which is exactly the mismatch that gets FAQ rich results pulled.
 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        graph={faqPageGraph({
          path: routes.faq(),
          name: seo.title,
          description: seo.description,
          crumbs,
          faqs: answeredFaqs,
        })}
      />

      <PageShell
        crumbs={crumbs}
        heading="Frequently asked questions"
        intro={seo.description}
        tone="raised"
      />

      <FaqAccordion
        heading="Questions we get a lot"
        items={answeredResidentialFaqs}
        tone="raised"
      />

      {/* Both neighbours are white and nothing marks the seam between them. This is that mark — a
          hairline on the container line, the same device /commercial/ uses. */}
      <SectionDivider tone="raised" />

      <FaqAccordion
        heading="Commercial and multi-unit properties"
        items={answeredCommercialFaqs}
        tone="raised"
      />

      {/* `canvas`, not the site-default dark navy: on the dark band the navy buttons disappear into
          it, because --color-surface-dark and --color-brand are the same hex. See CtaBand. It is
          also the only band on this page that is not white, which is what makes it read as the end
          of the reading and the start of the asking. */}
      <CtaBand
        heading="Still have a question?"
        detail="Give us a call — we'll answer straight."
        tone="canvas"
      />
    </>
  );
}
