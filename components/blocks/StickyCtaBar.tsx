"use client";

import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { phoneCtaLabel } from "@/content/nav";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";

/**
 * The ad landing page's bar along the bottom of a phone — the form button and the phone, always
 * one thumb away, which is the single most reliable thing a mobile landing page can add.
 *
 * IT GETS OUT OF THE WAY. Whenever a band that already holds those two buttons is on screen — the
 * hero with the form in it, the closing band, the footer — the bar slides away, so it never covers
 * the form somebody is filling in (or the keyboard that came up for it), and never shows the same
 * two buttons twice on one screen. Those bands carry `STICKY_CTA_HIDE`; this watches them.
 *
 * It starts hidden and stays hidden without JavaScript: at the top of the page the hero is on
 * screen anyway, and a bar that appears before the page can tell where it is would cover the form.
 *
 * `inert` while hidden, so a keyboard or a screen reader cannot reach two buttons that are parked
 * off the bottom of the screen. Phone-only — from `lg` the form sits beside the h1 and the header
 * carries the number.
 */
export function StickyCtaBar({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const watched = document.querySelectorAll("[data-sticky-cta-hide]");
    if (watched.length === 0 || !("IntersectionObserver" in window)) return;

    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setVisible(onScreen.size === 0);
    });
    watched.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={!visible}
      className={cx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised px-5 pb-4 pt-3 transition-transform duration-300 ease-out lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3">
        <Button href={href} variant="cta" block>
          {label}
        </Button>
        <Button
          href={`tel:${site.phone.e164}`}
          variant="secondary"
          icon={Phone}
          ariaLabel={`${phoneCtaLabel} — ${site.phone.display}`}
        />
      </div>
    </div>
  );
}
