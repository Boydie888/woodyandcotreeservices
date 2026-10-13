import Image from "next/image";
import { Check } from "lucide-react";
import { site } from "@/config/site";
import { heroImage } from "@/config/images";
import { EnquireLink } from "./EnquireLink";
import { RingsArt } from "./RingsArt";

const c = site.credentials;
const trustPoints = [
  c.publicLiability ? "Public liability insured" : "Professional tree care",
  c.chainsawYears ? `${c.chainsawYears} years\u2019 chainsaw experience` : "Safety-focused approach",
  c.certificateIII ? "Certificate III qualified" : "Tailored to your property",
  // Only shown once the owner confirms it in config/site.ts
  ...(site.confirmed.residentialAndCommercial ? ["Residential and commercial services"] : []),
];

export function Hero() {
  const hasPhoto = Boolean(heroImage.src);

  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-deep text-white">
      {/* Background: real photo when supplied, otherwise the tree-ring artwork. */}
      {hasPhoto ? (
        <>
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-deep via-deep/80 to-deep/30" />
        </>
      ) : (
        <RingsArt
          seed={4}
          cx={620}
          cy={380}
          rings={18}
          className="absolute inset-y-0 right-[-18%] -z-10 h-full w-[130%] sm:right-[-6%] sm:w-[85%] lg:right-0 lg:w-[62%] [mask-image:linear-gradient(to_right,transparent_0%,#000_38%)]"
        />
      )}

      <div className="wrap flex min-h-[min(36rem,calc(100svh-6.5rem))] flex-col justify-center py-16 sm:py-20 lg:min-h-[min(44rem,calc(100svh-6.5rem))]">
        <h1 id="hero-title" className="display">
          <span className="block">Professional Tree Care.</span>
          <span className="block">Done Right.</span>
        </h1>

        <p className="lede mt-6 max-w-[34rem] text-white/90">
          From tree removal and pruning to ongoing tree maintenance, {site.name} helps keep your
          property safe, tidy and looking its best. Serving {site.region}.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <EnquireLink className="btn btn-light sm:min-w-48">Request a Quote</EnquireLink>
          <a href="#services" className="btn btn-outline-light sm:min-w-48">
            Explore Our Services
          </a>
        </div>

        <ul className="mt-12 flex flex-col gap-3 border-t border-white/20 pt-6 text-[0.97rem] font-medium sm:flex-row sm:flex-wrap sm:gap-x-9">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <Check aria-hidden="true" size={18} strokeWidth={2.5} className="shrink-0 text-sage" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
