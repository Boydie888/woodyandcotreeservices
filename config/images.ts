/**
 * ─────────────────────────────────────────────────────────────
 *  IMAGES — how to add your own photos
 * ─────────────────────────────────────────────────────────────
 *  1. Put photo files in  public/images/  (JPG, PNG or WebP).
 *     Aim for under ~400 KB each; the site resizes them for you.
 *  2. Set `src` below to the path, e.g. "/images/hero.jpg".
 *  3. Write a short, factual `alt` describing the photo.
 *
 *  While `src` is empty, the site shows a clean placeholder.
 *  Only use photos you own or are licensed to use. If a photo is
 *  stock rather than a real Woody & Co job, set `isStock: true`
 *  so it is labelled honestly on the site.
 */

export type SiteImage = {
  src: string; // "" = show placeholder
  alt: string;
};

export type GalleryItem = SiteImage & {
  id: string;
  category: "Tree pruning" | "Tree removal" | "Stump grinding" | "Finished property";
  isStock?: boolean;
};

/** Hero photo — ideally an arborist at work in a leafy property. Landscape, ~2400×1400. */
export const heroImage: SiteImage = {
  src: "",
  alt: "An arborist working in a tree on a leafy Australian property",
};

/** "Good People. Quality Tree Care." photo — portrait or square, ~1200×1400. */
export const whyImage: SiteImage = {
  src: "",
  alt: "The Woody & Co crew on site",
};

/** Project gallery — landscape 4:3 photos work best (~1200×900). */
export const gallery: GalleryItem[] = [
  { id: "g1", category: "Tree pruning", src: "", alt: "A tree after pruning" },
  { id: "g2", category: "Tree removal", src: "", alt: "A tree removal in progress" },
  { id: "g3", category: "Stump grinding", src: "", alt: "A stump being ground back" },
  { id: "g4", category: "Finished property", src: "", alt: "A tidy yard after tree work" },
  { id: "g5", category: "Tree pruning", src: "", alt: "Canopy work on a mature tree" },
  { id: "g6", category: "Finished property", src: "", alt: "A cleared and tidy garden" },
];

/**
 * The "Our Work" gallery is hidden on the live site until at least one real
 * photo is added above (so visitors never see empty boxes). In development
 * it always shows, with placeholders, so you can see the layout.
 */
export const showGallery =
  gallery.some((g) => Boolean(g.src)) || process.env.NODE_ENV !== "production";
