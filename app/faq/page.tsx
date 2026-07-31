import type { Metadata } from "next";

import { CtaBand, FaqAccordion } from "@/components/blocks/blocks";
import { PageShell } from "@/components/blocks/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { answeredFaqs } from "@/content/faq";
import { routes } from "@/lib/routes";
import { faqPageGraph, type Crumb } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const seo = {
  title: "Frequently Asked Questions",
  description:
    "How pricing works, how often we visit, what happens if your dog is outside, and which areas we cover.",
};

const crumbs: Crumb[] = [
  { name: "Home", path: routes.home() },
  { name: "FAQ", path: routes.faq() },
];

export const metadata: Metadata = buildMetadata({ ...seo, path: routes.faq() });

/**
 * The FAQPage graph is built from `answeredFaqs` — the same array the page renders. An unanswered
 * question is in neither, so the structured data can never promise an answer the page does not
 * show, which is exactly the mismatch that gets FAQ rich results pulled.
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
      <PageShell crumbs={crumbs} heading="Frequently asked questions" intro={seo.description} />
      <FaqAccordion heading="Questions we get a lot" items={answeredFaqs} />
      <CtaBand heading="Still have a question?" detail="Give us a call — we'll answer straight." />
    </>
  );
}
