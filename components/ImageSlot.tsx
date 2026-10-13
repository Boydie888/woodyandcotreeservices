import Image from "next/image";
import { RingsArt } from "./RingsArt";

type Props = {
  src: string;
  alt: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[4/3]". Keeps layout stable (no CLS). */
  aspect: string;
  sizes: string;
  priority?: boolean;
  /** Visible label inside the placeholder, if any. */
  placeholderLabel?: string;
  placeholderNote?: string;
  seed?: number;
  /** Number of rings drawn in the placeholder (fewer = lighter page). */
  rings?: number;
  tone?: "forest" | "deep" | "sage";
  className?: string;
};

const TONES = {
  forest: { bg: "bg-forest", ring: "#879B82", text: "text-white" },
  deep: { bg: "bg-deep", ring: "#879B82", text: "text-white" },
  sage: { bg: "bg-sage/25", ring: "#183D2B", text: "text-deep" },
} as const;

/**
 * Shows a real photo when `src` is set, otherwise a designed placeholder.
 * Never renders a broken image.
 */
export function ImageSlot({
  src,
  alt,
  aspect,
  sizes,
  priority,
  placeholderLabel,
  placeholderNote,
  seed = 1,
  rings = 12,
  tone = "forest",
  className = "",
}: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-deep ${aspect} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
      </div>
    );
  }

  const t = TONES[tone];
  return (
    <div className={`relative overflow-hidden ${t.bg} ${aspect} ${className}`}>
      <RingsArt seed={seed} rings={rings} color={t.ring} cx={seed % 2 ? 560 : 260} cy={seed % 3 ? 300 : 520} className="absolute inset-0 h-full w-full" />
      {placeholderLabel ? (
        <div className={`absolute inset-x-0 bottom-0 p-5 ${t.text}`}>
          <p className="font-heading text-lg font-bold leading-tight">{placeholderLabel}</p>
          {placeholderNote ? <p className="mt-1 text-sm opacity-80">{placeholderNote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
