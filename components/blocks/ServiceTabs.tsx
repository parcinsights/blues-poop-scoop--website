"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { chipClasses } from "@/components/ui/surfaces";

/**
 * The chip toggles on a service page — About / Includes / Benefits — and the panel under them.
 *
 * It holds STATE and nothing else. Every panel is passed in already rendered, from the server, so
 * this file never learns what a service is, never imports the content layer, and adds only the
 * toggle itself to the client bundle. That is also why the panels are props rather than children:
 * a server component can hand a client component finished markup, and doing it that way keeps the
 * words, the ticks and the authored body on the server where the rest of the site lives.
 *
 * ALL THREE PANELS ARE IN THE HTML. The inactive ones carry the `hidden` attribute rather than
 * being left unrendered, which costs nothing and is the difference between a crawler seeing one
 * third of this page's copy and seeing all of it. On a site whose whole point is ranking for what
 * it says, a tab that only exists after a click is a tab that does not exist.
 *
 * The pattern is the ARIA tabs one, with automatic activation: arrow keys move focus AND selection,
 * Home and End jump to the ends, and the tablist is one tab stop — the roving `tabIndex` is what
 * makes a keyboard user pass three chips in one press instead of three.
 */

export type ServiceTab = {
  /** Stable within the page — it is half of the tab's and the panel's DOM ids. */
  id: string;
  label: string;
  panel: ReactNode;
};

export function ServiceTabs({ label, tabs }: { label: string; tabs: readonly ServiceTab[] }) {
  const [active, setActive] = useState(0);
  // Unique per instance, so two of these on one page cannot collide on an id.
  const uid = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  /** Select and focus, wrapping at both ends — arrowing off the last chip lands on the first. */
  function move(next: number) {
    const index = (next + tabs.length) % tabs.length;
    setActive(index);
    buttons.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowRight":
        move(active + 1);
        break;
      case "ArrowLeft":
        move(active - 1);
        break;
      case "Home":
        move(0);
        break;
      case "End":
        move(tabs.length - 1);
        break;
      default:
        // Everything else — Tab included — behaves normally.
        return;
    }
    event.preventDefault();
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`${uid}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls={`${uid}-panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={chipClasses(index === active ? "selected" : "quiet")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        // `tabIndex={0}` because a panel's content is usually plain text with nothing focusable in
        // it: without it, a keyboard user tabs off the chips and straight past what they just chose.
        <div
          key={tab.id}
          id={`${uid}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
