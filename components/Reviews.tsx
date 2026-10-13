import { Star } from "lucide-react";
import { reviews } from "@/config/reviews";
import { site } from "@/config/site";

const isProd = process.env.NODE_ENV === "production";

export function Reviews() {
  // No genuine reviews yet → hide the whole section on the live site.
  if (reviews.length === 0) {
    if (isProd) return null;
    return (
      <section aria-labelledby="reviews-title" className="section bg-white">
        <div className="wrap">
          <div className="max-w-2xl rounded-md border-2 border-dashed border-stone/50 p-6">
            <h2 id="reviews-title" className="font-heading text-xl font-bold text-forest">
              Developer note: reviews section
            </h2>
            <p className="mt-2 text-stone">
              This block is only visible in development. Add genuine customer reviews to{" "}
              <code className="rounded bg-paper px-1">config/reviews.ts</code> and the &ldquo;What Our
              Customers Say&rdquo; section will appear on the live site. Until then it stays hidden.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const single = reviews.length === 1;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section bg-white">
      <div className="wrap">
        <h2 id="reviews-title" className="section-title text-forest">
          What Our Customers Say
        </h2>

        <ul
          className={
            single ? "mt-12 max-w-3xl" : "mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {reviews.map((r, i) => (
            <li key={`${r.name}-${i}`}>
              <figure className="flex h-full flex-col border-t-2 border-forest pt-6">
                {r.rating ? (
                  <span role="img" aria-label={`${r.rating} out of 5 stars`} className="flex gap-1 text-forest">
                    {Array.from({ length: r.rating }, (_, n) => (
                      <Star key={n} aria-hidden="true" size={20} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                ) : null}
                <blockquote
                  className={
                    single
                      ? "mt-5 flex-1 font-heading text-[1.5rem] font-semibold leading-snug text-forest sm:text-[1.9rem]"
                      : "mt-5 flex-1 text-[1.05rem] leading-relaxed text-ink"
                  }
                >
                  <p>&ldquo;{r.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-5 text-[0.95rem]">
                  <span className="font-heading font-bold text-forest">{r.name}</span>
                  {r.location ? <span className="text-stone">, {r.location}</span> : null}
                  {r.source ? <span className="block text-stone">{r.source}</span> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {site.social.google ? (
          <a
            href={site.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline mt-10"
          >
            Read more reviews on Google
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
