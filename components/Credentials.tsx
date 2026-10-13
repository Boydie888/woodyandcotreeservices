import { Clock, GraduationCap, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { RingsArt } from "./RingsArt";

/**
 * Insurance, experience and qualifications — only what's switched on in
 * config/site.ts. Wording keeps the chainsaw experience and the
 * Certificate III as separate facts.
 */
export function Credentials() {
  const c = site.credentials;

  const items = [
    c.publicLiability && {
      icon: ShieldCheck,
      big: c.publicLiabilityCover ? c.publicLiabilityCover.replace(/\s*million/i, "M") : "Insured",
      title: "Public liability insurance",
      body: c.publicLiabilityCover
        ? `We carry ${c.publicLiabilityCover} public liability insurance for the work we do on your property.`
        : "We carry public liability insurance for the work we do on your property.",
    },
    c.chainsawYears && {
      icon: Clock,
      big: `${c.chainsawYears} years`,
      title: "Chainsaw experience",
      body: `Over ${c.chainsawYears.replace("+", "")} years of hands-on experience using a chainsaw.`,
    },
    c.certificateIII && {
      icon: GraduationCap,
      big: "Cert III",
      title: "Qualified",
      body: c.certificateDetail
        ? `Backed by a ${c.certificateDetail}.`
        : "Backed by a Certificate III qualification.",
    },
  ].filter(Boolean) as { icon: typeof Clock; big: string; title: string; body: string }[];

  if (items.length === 0) return null;

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-title"
      className="on-dark section relative isolate overflow-hidden bg-deep text-white"
    >
      <RingsArt
        seed={3}
        cx={700}
        cy={140}
        rings={14}
        className="absolute inset-0 -z-10 h-full w-full opacity-50"
      />
      <div className="wrap">
        <h2 id="credentials-title" className="section-title max-w-xl">
          Insured, Experienced and Qualified
        </h2>
        <p className="lede mt-4 max-w-xl text-white/85">
          The people working on your trees know what they&rsquo;re doing, and you&rsquo;re covered if
          something goes wrong.
        </p>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/15 bg-white/15 md:grid-cols-3">
          {items.map(({ icon: Icon, big, title, body }) => (
            <li key={title} className="bg-deep/95 p-8">
              <Icon aria-hidden="true" size={28} strokeWidth={1.6} className="text-sage" />
              <p className="mt-6 font-heading text-[2.6rem] font-extrabold leading-none tracking-tight">
                {big}
              </p>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-white/80">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
