import { describe, expect, it } from "vitest";

import { cities } from "@/content/cities";
import { answeredFaqs, faqs } from "@/content/faq";
import { moneyPage } from "@/content/money-pages";
import { reviews } from "@/content/reviews";
import { cityPageServices, services } from "@/content/services";
import { isPublishable, wordCount } from "./content";
import { allRoutes, publishedRoutes, routes } from "./routes";

describe("the thin-content guard", () => {
  it("treats an unauthored page as unpublishable", () => {
    expect(isPublishable([])).toBe(false);
  });

  it("treats an authored page as publishable", () => {
    expect(isPublishable([{ kind: "prose", paragraphs: ["Real copy."] }])).toBe(true);
  });

  it("counts words across every block kind", () => {
    const words = wordCount([
      { kind: "prose", paragraphs: ["one two three"] },
      { kind: "list", items: ["four five"] },
      { kind: "steps", steps: [{ title: "t", detail: "six seven eight" }] },
      { kind: "faq", items: [{ question: "q", answer: "nine ten" }] },
    ]);
    expect(words).toBe(10);
  });
});

/**
 * The specific failure this protects against: 10 cities × 2 services is 20 pages that, unwritten,
 * differ only by a place name. Publishing those is the doorway-page pattern, which Google treats
 * as manipulation rather than as an unfinished site.
 */
describe("unwritten pages stay out of the index", () => {
  const published = new Set(publishedRoutes().map((entry) => entry.path));

  it("publishes the pages that stand on their own without local copy", () => {
    for (const path of [
      routes.home(),
      routes.services(),
      routes.locations(),
      routes.pricing(),
      routes.faq(),
      routes.about(),
      routes.contact(),
      routes.getStarted(),
    ]) {
      expect(published.has(path), path).toBe(true);
    }
  });

  it("withholds every city page until its body is written", () => {
    for (const city of cities) {
      if (city.body.length > 0) continue;
      expect(published.has(routes.city(city.slug)), city.slug).toBe(false);
    }
  });

  it("withholds every city × service page until that pair is written", () => {
    for (const city of cities) {
      for (const service of cityPageServices) {
        if ((moneyPage(city.slug, service.slug)?.body.length ?? 0) > 0) continue;
        const path = routes.cityService(city.slug, service.slug);
        expect(published.has(path), path).toBe(false);
      }
    }
  });

  it("withholds every service page until its body is written", () => {
    for (const service of services) {
      if (service.body.length > 0) continue;
      expect(published.has(routes.service(service.slug)), service.slug).toBe(false);
    }
  });

  it("withholds the commercial page until the client confirms they sell it", () => {
    expect(published.has(routes.commercial())).toBe(false);
  });

  it("still routes every withheld page, so it can be reviewed and filled in", () => {
    // Withheld means noindex + absent from the sitemap. It does not mean the route is missing.
    expect(allRoutes().length).toBeGreaterThan(published.size);
  });
});

describe("FAQ", () => {
  it("marks up only questions that have an answer", () => {
    expect(answeredFaqs.length).toBeLessThanOrEqual(faqs.length);
    for (const faq of answeredFaqs) expect(faq.answer.trim().length).toBeGreaterThan(0);
  });

  it("has no duplicate questions", () => {
    const questions = faqs.map((faq) => faq.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe("reviews", () => {
  /**
   * Every review that exists must be attributable. The list being empty is fine and correct —
   * the components render nothing rather than inventing a testimonial.
   *
   * `city` is optional and usually absent, because a Google review does not carry one and the
   * alternative is guessing a town on a real person's behalf. What it may not be is present and
   * blank, which renders as a dangling em dash after the name.
   */
  it("attributes every quote to a person", () => {
    for (const review of reviews) {
      expect(review.quote.trim().length).toBeGreaterThan(0);
      expect(review.name.trim().length).toBeGreaterThan(0);
      if (review.city !== undefined) expect(review.city.trim().length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate quotes", () => {
    const quotes = reviews.map((review) => review.quote);
    expect(new Set(quotes).size).toBe(quotes.length);
  });
});
