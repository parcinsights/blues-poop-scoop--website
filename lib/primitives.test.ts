import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The primitive layer is only a single source of truth for as long as nothing routes around it.
 * A raw `<h2>` or a hand-rolled `<a>` still renders correctly — base.css styles both — which is
 * exactly why the drift is invisible in review and why it needs a test rather than a convention.
 *
 * Each rule below names the primitive that replaces the thing it bans, so a failure tells you what
 * to write instead.
 */

const ROOT = join(import.meta.dirname, "..");
const UI = join(ROOT, "components/ui");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

/** Everything that renders markup: pages, blocks, forms — but not the primitives themselves. */
const CONSUMER_FILES = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components"))].filter(
  (file) => !file.startsWith(UI),
);

/** Collect `file:line — source` for every line matching `pattern`. */
function offenders(files: string[], pattern: RegExp): string[] {
  const found: string[] = [];
  for (const file of files) {
    for (const [index, line] of readFileSync(file, "utf8").split("\n").entries()) {
      if (pattern.test(line)) found.push(`${file.replace(ROOT, "")}:${index + 1} — ${line.trim()}`);
    }
  }
  return found;
}

describe("nothing outside components/ui writes raw markup a primitive owns", () => {
  it("uses <Heading level={n}> rather than a literal <h1>–<h6>", () => {
    // The literal tag conflates outline level with visual size. Heading separates them.
    expect(offenders(CONSUMER_FILES, /<h[1-6][\s>]/)).toEqual([]);
  });

  it("uses <Text> rather than a literal <p>", () => {
    expect(offenders(CONSUMER_FILES, /<p[\s>]/)).toEqual([]);
  });

  it("uses <Link> or <Button> rather than a literal <a>", () => {
    // A hand-rolled anchor is where a missing rel="noopener" on an off-site link comes from.
    // app/layout.tsx is exempt for one anchor: the skip link is a bare in-page jump that must
    // render before anything else and carries its own .skip-link rule from base.css.
    const files = CONSUMER_FILES.filter((file) => file !== join(ROOT, "app/layout.tsx"));
    expect(offenders(files, /<a[\s>]/)).toEqual([]);
  });

  it("imports next/link only inside the Link and Button primitives", () => {
    const allowed = new Set([join(UI, "Link.tsx"), join(UI, "Button.tsx")]);
    const files = [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components"))].filter(
      (file) => !allowed.has(file),
    );
    expect(offenders(files, /from "next\/link"/)).toEqual([]);
  });
});

describe("the primitives stay declarative", () => {
  it("exposes no className prop, so a call site cannot restyle one from outside", () => {
    // Image is the exception: it forwards sizing to next/image, which owns its own layout.
    const files = walk(UI).filter((file) => !file.endsWith("Image.tsx"));
    expect(offenders(files, /\bclassName\??:/)).toEqual([]);
  });
});
