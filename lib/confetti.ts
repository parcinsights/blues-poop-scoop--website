/**
 * CONFETTI, drawn on one canvas for a few seconds and then gone. Used once, on /thank-you/, when
 * Blue finishes scooping — see components/blocks/BlueCelebration.tsx.
 *
 * Hand-rolled rather than a package: it is sixty lines of physics, it runs for one burst, and a
 * dependency for it would ship more code than this to every visitor of the one page whose job is
 * to load fast after a form.
 *
 * THE COLOURS ARE THE THEME'S. They are read off the page's own custom properties at fire time, so
 * the confetti is the site's palette by construction and theme.css stays the only place a colour is
 * written. A property that comes back empty is skipped, never replaced with a guess.
 *
 * A few pieces are PAW PRINTS in the brand navy — the house stamp, the one the review cards wear.
 */

/** The fills, by token. Sky, amber, the brand green and the four medallion accents. */
const CONFETTI_TOKENS = [
  "--color-sky",
  "--color-amber",
  "--color-success",
  "--color-accent-peach",
  "--color-accent-lilac",
  "--color-accent-mint",
  "--color-accent-lemon",
] as const;

const PAW_TOKEN = "--color-brand";

type Shape = "strip" | "dot" | "paw";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: Shape;
  /** Spin in the plane of the screen. */
  angle: number;
  spin: number;
  /** Tumble — the flip that makes a strip catch the light. Drawn as a vertical squash. */
  tumble: number;
  tumbleSpeed: number;
  /** Sideways flutter as it falls. */
  sway: number;
};

/** Per-frame physics at 60fps; scaled by real elapsed time so a 120Hz screen is not twice as fast. */
const GRAVITY = 0.3;
const DRAG = 0.985;
/** How long the canvas lives, in ms. Everything has fallen off-screen or faded by then. */
const LIFETIME = 4200;
const FADE_FROM = 3200;

function readTokens(names: readonly string[]): string[] {
  const style = getComputedStyle(document.documentElement);
  return names.map((name) => style.getPropertyValue(name).trim()).filter(Boolean);
}

const random = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]!;

/**
 * A fan of pieces from one point. `angle` is the direction of the fan's middle in degrees (-90 is
 * straight up), `spread` its full width, `power` the launch speed in px per frame.
 */
function fan(
  count: number,
  origin: { x: number; y: number },
  angle: number,
  spread: number,
  power: number,
  colors: string[],
  paw: string | undefined,
): Piece[] {
  return Array.from({ length: count }, () => {
    const direction = ((angle + random(-spread / 2, spread / 2)) * Math.PI) / 180;
    const speed = power * random(0.55, 1.1);
    const shape: Shape = paw && Math.random() < 0.12 ? "paw" : Math.random() < 0.3 ? "dot" : "strip";
    return {
      x: origin.x,
      y: origin.y,
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      size: shape === "paw" ? random(13, 18) : random(7, 12),
      color: shape === "paw" ? paw! : pick(colors),
      shape,
      angle: random(0, Math.PI * 2),
      spin: random(-0.2, 0.2),
      tumble: random(0, Math.PI * 2),
      tumbleSpeed: random(0.08, 0.2),
      sway: random(0, Math.PI * 2),
    };
  });
}

function drawPaw(context: CanvasRenderingContext2D, size: number) {
  // The pad, then four toes in an arc over it.
  context.beginPath();
  context.ellipse(0, size * 0.18, size * 0.3, size * 0.24, 0, 0, Math.PI * 2);
  context.fill();
  for (const [x, y] of [
    [-0.32, -0.1],
    [-0.12, -0.3],
    [0.12, -0.3],
    [0.32, -0.1],
  ] as const) {
    context.beginPath();
    context.arc(x * size, y * size, size * 0.12, 0, Math.PI * 2);
    context.fill();
  }
}

/**
 * Fire one burst from `origin` (viewport coordinates), plus a cannon from each bottom corner a
 * beat later. Returns a function that stops it early — call it on unmount.
 */
export function fireConfetti(canvas: HTMLCanvasElement, origin: { x: number; y: number }): () => void {
  const context = canvas.getContext("2d");
  const colors = readTokens(CONFETTI_TOKENS);
  if (!context || colors.length === 0) return () => {};
  const [paw] = readTokens([PAW_TOKEN]);

  // Crisp on a retina screen, capped at 2x — a 3x canvas is a lot of pixels for paper.
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);

  // A phone's screen is short; the same launch speed would throw everything off the top of it.
  const power = Math.min(Math.max(height / 55, 11), 17);

  const pieces = fan(110, origin, -90, 110, power, colors, paw);
  let cannonsFired = false;

  let frame = 0;
  let start = 0;
  let last = 0;

  const tick = (now: number) => {
    if (!start) start = last = now;
    const elapsed = now - start;
    // Real time in 60fps frames, clamped so a backgrounded tab does not teleport everything.
    const step = Math.min((now - last) / (1000 / 60), 3);
    last = now;

    if (!cannonsFired && elapsed > 220) {
      cannonsFired = true;
      pieces.push(
        ...fan(45, { x: 0, y: height * 0.85 }, -62, 34, power * 1.05, colors, paw),
        ...fan(45, { x: width, y: height * 0.85 }, -118, 34, power * 1.05, colors, paw),
      );
    }

    context.clearRect(0, 0, width, height);
    context.globalAlpha = elapsed > FADE_FROM ? Math.max(0, 1 - (elapsed - FADE_FROM) / (LIFETIME - FADE_FROM)) : 1;

    for (const piece of pieces) {
      piece.vx *= Math.pow(DRAG, step);
      piece.vy = piece.vy * Math.pow(DRAG, step) + GRAVITY * step;
      piece.sway += 0.08 * step;
      piece.x += (piece.vx + Math.sin(piece.sway) * 0.6) * step;
      piece.y += piece.vy * step;
      piece.angle += piece.spin * step;
      piece.tumble += piece.tumbleSpeed * step;

      if (piece.y > height + 40) continue;

      context.save();
      context.translate(piece.x, piece.y);
      context.rotate(piece.angle);
      context.fillStyle = piece.color;
      if (piece.shape === "paw") {
        drawPaw(context, piece.size);
      } else if (piece.shape === "dot") {
        context.beginPath();
        context.arc(0, 0, piece.size * 0.4, 0, Math.PI * 2);
        context.fill();
      } else {
        // The tumble: a strip seen edge-on is a line, face-on is a rectangle.
        context.scale(1, Math.cos(piece.tumble));
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      }
      context.restore();
    }

    if (elapsed < LIFETIME) {
      frame = requestAnimationFrame(tick);
    } else {
      context.clearRect(0, 0, width, height);
    }
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    context.clearRect(0, 0, width, height);
  };
}
