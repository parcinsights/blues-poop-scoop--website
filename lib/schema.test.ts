import { describe, expect, it } from "vitest";

import { services } from "@/content/services";
import { home } from "@/content/pages/home";
import { SITE_URL, routes } from "./routes";
import { assertValidGraph, homeGraph, servicePageGraph, standardPageGraph } from "./schema";

function nodes(graph: Record<string, unknown>): Record<string, unknown>[] {
  return graph["@graph"] as Record<string, unknown>[];
}

function types(graph: Record<string, unknown>): string[] {
  return nodes(graph).map((node) => node["@type"] as string);
}

describe("the validator actually catches the failures it exists for", () => {
  it("rejects a duplicate @id", () => {
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", "@id": "https://x.test/#a" },
        { "@type": "WebSite", "@id": "https://x.test/#a" },
      ],
    };
    expect(() => assertValidGraph(graph)).toThrow(/duplicate @id/);
  });

  it("rejects a reference to a node that is not in the graph", () => {
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage", "@id": "https://x.test/#page", about: { "@id": "https://x.test/#ghost" } },
      ],
    };
    expect(() => assertValidGraph(graph)).toThrow(/resolves to no node/);
  });

  it("accepts a graph whose references all resolve", () => {
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "LocalBusiness", "@id": "https://x.test/#business" },
        { "@type": "WebPage", "@id": "https://x.test/#page", about: { "@id": "https://x.test/#business" } },
      ],
    };
    expect(() => assertValidGraph(graph)).not.toThrow();
  });
});

describe("homepage graph", () => {
  const graph = homeGraph(home.seo.description);

  it("validates", () => {
    expect(() => assertValidGraph(graph)).not.toThrow();
  });

  it("carries the business, the website and the page", () => {
    expect(types(graph)).toEqual(["LocalBusiness", "WebSite", "WebPage"]);
  });

  it("carries no BreadcrumbList — it is the root of the trail", () => {
    expect(types(graph)).not.toContain("BreadcrumbList");
  });

  it("publishes no street address, because this is a service-area business", () => {
    const business = nodes(graph)[0] as { address: Record<string, unknown> };
    expect(business.address).not.toHaveProperty("streetAddress");
    expect(business.address).toHaveProperty("addressLocality");
  });

  it("emits no self-serving review markup", () => {
    const serialized = JSON.stringify(graph);
    expect(serialized).not.toContain("aggregateRating");
    expect(serialized).not.toContain('"review"');
  });

  it("puts every @id on our own origin", () => {
    // The worst multi-site SEO bug is emitting some other host in a canonical or a schema @id.
    for (const node of nodes(graph)) {
      expect(String(node["@id"]).startsWith(SITE_URL), String(node["@id"])).toBe(true);
    }
  });
});

describe("service page graph", () => {
  const service = services[0]!;
  const path = routes.service(service.slug);
  const graph = servicePageGraph({
    path,
    service,
    crumbs: [
      { name: "Home", path: routes.home() },
      { name: "Services", path: routes.services() },
      { name: service.name, path },
    ],
  });

  it("validates", () => {
    expect(() => assertValidGraph(graph)).not.toThrow();
  });

  it("carries a Service node and a breadcrumb the page also renders", () => {
    expect(types(graph)).toContain("Service");
    expect(types(graph)).toContain("BreadcrumbList");
  });

  it("numbers breadcrumb positions from one, in order", () => {
    const crumb = nodes(graph).find((n) => n["@type"] === "BreadcrumbList") as {
      itemListElement: { position: number }[];
    };
    expect(crumb.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
  });
});

describe("standard page graph", () => {
  it("links its WebPage to the breadcrumb it declares", () => {
    const path = routes.about();
    const graph = standardPageGraph({
      path,
      name: "About",
      description: "About the business.",
      type: "AboutPage",
      crumbs: [
        { name: "Home", path: routes.home() },
        { name: "About", path },
      ],
    });
    expect(() => assertValidGraph(graph)).not.toThrow();
    expect(types(graph)).toContain("AboutPage");
  });
});
