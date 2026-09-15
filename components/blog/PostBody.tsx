import { Fragment, type ReactNode } from "react";

import { Link } from "@/components/ui/Link";
import { Heading, Text } from "@/components/ui/typography";
import { resolvePostHref } from "@/lib/blog/links";
import type { PostMark, PostNode } from "@/lib/blog/types";

/**
 * Renders a post body — a ProseMirror/TipTap JSON tree — as React elements.
 *
 * The rules, and why:
 *  · No HTML string anywhere. The body is a node tree precisely so there is nothing to trust;
 *    React escapes every text node.
 *  · An unknown node renders nothing. The editor gaining a node type must never crash a live page.
 *  · Headings start at h2 and clamp to 2–4. The post title is the page's only h1.
 *  · Empty paragraphs are skipped — clients press Enter twice.
 *  · Link targets are decided in lib/blog/links.ts, never by the stored attrs.
 *
 * Wrap the output in `Prose` for rhythm and measure.
 */
export function PostBody({ doc }: { doc: PostNode }) {
  return <>{renderChildren(doc)}</>;
}

function renderChildren(node: PostNode): ReactNode {
  return (node.content ?? []).map((child, index) => (
    <Fragment key={index}>{renderNode(child)}</Fragment>
  ));
}

function renderNode(node: PostNode): ReactNode {
  switch (node.type) {
    case "doc":
      return renderChildren(node);
    case "paragraph":
      return node.content?.length ? <Text>{renderChildren(node)}</Text> : null;
    case "heading":
      return <Heading level={clampHeading(node.attrs?.level)}>{renderChildren(node)}</Heading>;
    case "bulletList":
      return <ul>{renderChildren(node)}</ul>;
    case "orderedList": {
      const start = Number(node.attrs?.start ?? 1);
      return (
        <ol start={Number.isInteger(start) && start !== 1 ? start : undefined}>
          {renderChildren(node)}
        </ol>
      );
    }
    case "listItem":
      return <li>{renderChildren(node)}</li>;
    case "blockquote":
      return <blockquote>{renderChildren(node)}</blockquote>;
    case "horizontalRule":
      return <hr />;
    case "hardBreak":
      return <br />;
    case "text":
      return renderText(node.text ?? "", node.marks ?? []);
    default:
      if (process.env.NODE_ENV !== "production") {
        console.warn(`PostBody: unknown node type "${node.type}" skipped`);
      }
      return null;
  }
}

function clampHeading(level: unknown): 2 | 3 | 4 {
  const n = Number(level);
  if (n >= 4) return 4;
  if (n === 3) return 3;
  return 2;
}

/**
 * Marks apply in one fixed order — strike innermost, link outermost — so the same text always
 * produces the same markup whatever order the editor stored them in.
 */
function renderText(text: string, marks: PostMark[]): ReactNode {
  const has = (type: string) => marks.some((mark) => mark.type === type);
  let out: ReactNode = text;

  if (has("strike")) out = <s>{out}</s>;
  if (has("underline")) out = <u>{out}</u>;
  if (has("italic")) out = <em>{out}</em>;
  if (has("bold")) out = <strong>{out}</strong>;

  const link = marks.find((mark) => mark.type === "link");
  const href = link ? resolvePostHref(link.attrs?.href) : null;
  if (href) out = <Link href={href}>{out}</Link>;

  return out;
}
