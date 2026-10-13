import { gallery, showGallery } from "@/config/images";
import { ImageSlot } from "./ImageSlot";

const TONES = ["forest", "deep", "sage"] as const;

export function Gallery() {
  if (!showGallery) return null;
  return (
    <section id="work" aria-labelledby="work-title" className="section bg-paper">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 id="work-title" className="section-title text-forest">
            Tree Work That Speaks for Itself
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, i) => (
            <li key={item.id}>
              <figure className="group">
                <ImageSlot
                  src={item.src}
                  alt={item.alt}
                  aspect="aspect-[4/3]"
                  sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw"
                  placeholderLabel={item.category}
                  placeholderNote="Project photo coming soon"
                  seed={i + 2}
                  rings={8}
                  tone={TONES[i % TONES.length]}
                  className="rounded-md"
                />
                {item.src ? (
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3 text-[0.95rem]">
                    <span className="font-semibold text-forest">{item.category}</span>
                    {item.isStock ? <span className="text-stone">Illustrative image</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
