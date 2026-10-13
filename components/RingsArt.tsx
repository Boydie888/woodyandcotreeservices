/**
 * Tree-ring artwork: concentric, slightly uneven growth rings with a single
 * hairline check crack — the cross-section of a trunk. It's the brand's one
 * decorative motif and doubles as the designed placeholder until real photos
 * are added. Server-rendered, zero JavaScript.
 */

type Props = {
  /** Different seeds give different (but deterministic) ring shapes. */
  seed?: number;
  /** Ring colour. */
  color?: string;
  /** Centre of the rings in the 800×800 artboard. */
  cx?: number;
  cy?: number;
  rings?: number;
  className?: string;
};

const POINTS = 48;

function ringPath(i: number, seed: number, cx: number, cy: number, spacing: number) {
  // The pith drifts slightly as the tree grows, so rings are never perfectly concentric.
  const driftX = Math.sin(seed * 1.3) * i * 0.9;
  const driftY = Math.cos(seed * 0.7) * i * 0.6;
  const base = 18 + i * spacing;
  let d = "";
  for (let p = 0; p <= POINTS; p++) {
    const t = (p / POINTS) * Math.PI * 2;
    const wobble =
      1 +
      0.035 * Math.sin(3 * t + seed + i * 0.15) +
      0.022 * Math.sin(5 * t + seed * 2 + i * 0.4) +
      0.012 * Math.sin(7 * t + i * 0.9 + seed);
    const r = base * wobble;
    const x = (cx + driftX + Math.cos(t) * r).toFixed(1);
    const y = (cy + driftY + Math.sin(t) * r).toFixed(1);
    d += `${p === 0 ? "M" : "L"}${x} ${y} `;
  }
  return d + "Z";
}

function crackPath(seed: number, cx: number, cy: number, length: number) {
  const angle = (seed * 0.9) % (Math.PI * 2);
  let d = `M${cx.toFixed(1)} ${cy.toFixed(1)}`;
  const steps = 14;
  for (let s = 1; s <= steps; s++) {
    const dist = (s / steps) * length;
    const jitter = Math.sin(s * 2.1 + seed) * 4;
    const x = cx + Math.cos(angle) * dist + Math.cos(angle + Math.PI / 2) * jitter;
    const y = cy + Math.sin(angle) * dist + Math.sin(angle + Math.PI / 2) * jitter;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function RingsArt({
  seed = 1,
  color = "#879B82",
  cx = 400,
  cy = 400,
  rings = 20,
  className,
}: Props) {
  const spacing = 700 / rings;
  return (
    <svg
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke={color}
    >
      {Array.from({ length: rings }, (_, i) => (
        <path
          key={i}
          d={ringPath(i, seed, cx, cy, spacing)}
          strokeWidth={i % 4 === 3 ? 2.4 : 1.1}
          strokeOpacity={i % 4 === 3 ? 0.55 : 0.32}
          strokeLinejoin="round"
        />
      ))}
      <path d={crackPath(seed, cx, cy, 520)} strokeWidth={1.2} strokeOpacity={0.4} strokeLinecap="round" />
    </svg>
  );
}
