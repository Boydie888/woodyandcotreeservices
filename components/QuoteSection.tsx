import { Mail, Phone } from "lucide-react";
import { site } from "@/config/site";
import { mailHref, telHref } from "@/lib/contact";
import { QuoteForm } from "./QuoteForm";
import { RingsArt } from "./RingsArt";

export function QuoteSection() {
  const tel = telHref(site.phone);
  const mail = mailHref(site.email);

  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      className="on-dark relative isolate overflow-hidden bg-forest text-white"
    >
      <RingsArt
        seed={11}
        cx={120}
        cy={700}
        rings={14}
        color="#879B82"
        className="absolute inset-0 -z-10 h-full w-full opacity-40"
      />

      <div className="wrap section grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <h2 id="quote-title" className="section-title">
            Need Help With Your Trees?
          </h2>
          <p className="lede mt-4 max-w-md text-white/90">
            Tell us a little about your job and we&rsquo;ll get back to you to discuss the next steps.
          </p>

          {tel || mail ? (
            <ul className="mt-9 space-y-3 border-t border-white/20 pt-6">
              {tel ? (
                <li>
                  <a href={tel} className="inline-flex min-h-11 items-center gap-3 font-heading text-xl font-bold hover:underline">
                    <Phone aria-hidden="true" size={20} className="text-sage" />
                    {site.phone}
                  </a>
                </li>
              ) : null}
              {mail ? (
                <li>
                  <a href={mail} className="inline-flex min-h-11 items-center gap-3 break-all text-lg font-semibold hover:underline">
                    <Mail aria-hidden="true" size={20} className="shrink-0 text-sage" />
                    {site.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>

        <div className="rounded-md bg-white p-6 text-ink shadow-sm sm:p-9">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
