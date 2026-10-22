"use client";

import { Heart, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { Image } from "@/components/ui/Image";
import { fireConfetti } from "@/lib/confetti";

/**
 * BLUE'S VICTORY LAP — the top of /thank-you/. The logo dog drops in beside his poop pile, the
 * pile starts to shake, he leans in with the scooper and it's gone in a puff, the confetti goes off,
 * he does a celebratory flip, and a few hearts float up. Then he idles with the odd happy wiggle.
 *
 * About two and a half seconds, start to finish — long enough to be a moment, short enough that
 * nobody waits for it. Nothing on the page is held back until it ends.
 *
 * HOW THE POOP LEAVES WITHOUT A SECOND DRAWING. The logo is one flat image, so it is drawn TWICE
 * and each copy is clipped: one to everything except the pile in the bottom-right corner, one to
 * the pile alone. The two are animated separately but are the same file, so it downloads once. The
 * clip lines were measured off the artwork — see `.blue-party__dog` in base.css.
 *
 * All the motion is CSS (base.css, "Blue's victory lap"), so it starts the moment the page paints
 * and needs no script. The confetti is the one part drawn in script — see lib/confetti.ts — fired
 * on a timer matched to the moment the pile vanishes.
 *
 * REDUCED MOTION: someone who has asked their device for less movement gets Blue standing still
 * with a sparkle where the pile was, and no confetti at all. Same message, no motion.
 *
 * Decoration, all of it: hidden from assistive tech. The h1 underneath says "thanks"; this says it
 * with a dog.
 */

/** When the pile vanishes, in ms — keep in step with `blue-pile` in base.css. */
const POOF_AT = 1350;

export function BlueCelebration() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let stop = () => {};
    const timer = window.setTimeout(() => {
      if (!stage.current || !canvas.current) return;
      // From just above Blue's middle, so the burst comes out from behind him.
      const box = stage.current.getBoundingClientRect();
      stop = fireConfetti(canvas.current, {
        x: box.left + box.width * 0.45,
        y: box.top + box.height * 0.4,
      });
    }, POOF_AT);

    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, []);

  return (
    <>
      <div ref={stage} aria-hidden="true" className="blue-party mx-auto w-52 sm:w-64 lg:w-72">
        {/* The pile, under everything else so the scooper passes in front of it. */}
        <div className="blue-party__pile blue-party__layer">
          <Image asset="logoMark" decorative sizes="(min-width: 64rem) 288px, 256px" className="blue-party__pile-cut w-full" />
        </div>

        {/* The puff it leaves, and the sparkle that stays. */}
        <span className="blue-party__puff">
          <span className="bg-line" />
          <span className="bg-line" />
          <span className="bg-line" />
          <span className="bg-line" />
          <span className="bg-line" />
        </span>
        <Sparkles className="blue-party__sparkle fill-amber text-amber-dark" />

        {/* Blue. Three nested boxes so each motion owns one transform: the drop-in, the flip, and the
            lean with the scooper. The idle wiggle is on the image itself. */}
        <div className="blue-party__drop blue-party__layer">
          <div className="blue-party__flip blue-party__layer">
            <div className="blue-party__lean blue-party__layer">
              <Image asset="logoMark" decorative sizes="(min-width: 64rem) 288px, 256px" className="blue-party__dog w-full" />
            </div>
          </div>
        </div>

        <span className="blue-party__hearts">
          <Heart className="fill-accent-peach text-accent-peach-ink" />
          <Heart className="fill-accent-lilac text-accent-lilac-ink" />
          <Heart className="fill-accent-peach text-accent-peach-ink" />
        </span>
      </div>

      {/* The confetti's canvas: the whole screen, under nothing, above everything, untouchable. It
          is outside the stage on purpose — a `fixed` box inside a transformed one is fixed to that
          box, not to the screen. */}
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-60 size-full" />
    </>
  );
}
