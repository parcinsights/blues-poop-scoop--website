import { describe, expect, it } from "vitest";

import { resolvePostHref } from "./links";

describe("links inside a post", () => {
  it("keeps site-relative paths and in-page anchors", () => {
    expect(resolvePostHref("/pricing/")).toBe("/pricing/");
    expect(resolvePostHref("#why")).toBe("#why");
  });

  it("turns an absolute link to this site into a path, www or not", () => {
    expect(resolvePostHref("https://bluespoopscoop.com/faq/?a=1#b")).toBe("/faq/?a=1#b");
    expect(resolvePostHref("https://www.bluespoopscoop.com/about/")).toBe("/about/");
  });

  it("keeps off-site web links, mail and phone", () => {
    expect(resolvePostHref("https://example.com/x")).toBe("https://example.com/x");
    expect(resolvePostHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(resolvePostHref("tel:+12155550100")).toBe("tel:+12155550100");
  });

  it("drops anything that could run code or leave the origin unannounced", () => {
    expect(resolvePostHref("javascript:alert(1)")).toBeNull();
    expect(resolvePostHref("data:text/html,hi")).toBeNull();
    expect(resolvePostHref("//evil.com/")).toBeNull();
    expect(resolvePostHref("")).toBeNull();
    expect(resolvePostHref(42)).toBeNull();
  });
});
