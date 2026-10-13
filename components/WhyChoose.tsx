import { whyImage } from "@/config/images";
import { EnquireLink } from "./EnquireLink";
import { ImageSlot } from "./ImageSlot";

const points = [
  {
    title: "Clear communication",
    body: "Straightforward communication from enquiry to completion.",
  },
  {
    title: "Tailored solutions",
    body: "Recommendations based on the tree, property and customer's needs.",
  },
  {
    title: "Care for your property",
    body: "A considered approach to protecting surrounding areas during work.",
  },
  {
    title: "Professional approach",
    body: "Attention to planning, safety and quality workmanship.",
  },
];

export function WhyChoose() {
  return (
    <section id="about" aria-labelledby="about-title" className="section bg-white">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <ImageSlot
          src={whyImage.src}
          alt={whyImage.alt}
          aspect="aspect-[4/3] lg:aspect-[5/6]"
          sizes="(min-width: 1024px) 560px, 100vw"
          seed={7}
          tone="forest"
          className="rounded-md"
        />

        <div>
          <h2 id="about-title" className="section-title text-forest">
            Good People. Quality Tree Care.
          </h2>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {points.map((p) => (
              <div key={p.title} className="py-5">
                <dt className="font-heading text-[1.15rem] font-bold text-forest">{p.title}</dt>
                <dd className="mt-1 text-stone">{p.body}</dd>
              </div>
            ))}
          </dl>

          <EnquireLink className="btn btn-primary mt-9">Talk to Our Team</EnquireLink>
        </div>
      </div>
    </section>
  );
}
