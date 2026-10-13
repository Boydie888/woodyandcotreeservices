import Link from "next/link";
import { site, navLinks } from "@/config/site";
import { enabledServices } from "@/config/services";
import { mailHref, telHref } from "@/lib/contact";
import { Wordmark } from "./Wordmark";
import { EnquireLink } from "./EnquireLink";

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google Business Profile",
};

export function Footer() {
  const tel = telHref(site.phone);
  const mail = mailHref(site.email);
  const socials = Object.entries(site.social).filter(([, url]) => Boolean(url));
  const hasContact = Boolean(tel || mail || site.serviceAreas.length || site.hours.length);
  const year = new Date().getFullYear();

  const headingCls = "font-heading text-base font-bold text-white";
  const linkCls = "inline-flex min-h-9 items-center text-white/80 hover:text-white hover:underline";

  return (
    <footer className="on-dark bg-deep text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Wordmark light />
          <p className="mt-5 max-w-xs text-[0.97rem] text-white/80">
            Tree removal, pruning, stump grinding and ongoing tree maintenance in {site.region}.
          </p>
          {socials.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {socialLabels[key] ?? key}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="Footer">
          <h2 className={headingCls}>Navigation</h2>
          <ul className="mt-4 space-y-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className={headingCls}>Services</h2>
          <ul className="mt-4 space-y-1">
            {enabledServices.map((s) => (
              <li key={s.id}>
                <EnquireLink service={s.id} className={linkCls}>
                  {s.title}
                </EnquireLink>
              </li>
            ))}
          </ul>
        </nav>

        {hasContact ? (
          <div>
            <h2 className={headingCls}>Contact</h2>
            <ul className="mt-4 space-y-1 text-white/80">
              {tel ? (
                <li>
                  <a href={tel} className={linkCls}>
                    {site.phone}
                  </a>
                </li>
              ) : null}
              {mail ? (
                <li>
                  <a href={mail} className={`${linkCls} break-all`}>
                    {site.email}
                  </a>
                </li>
              ) : null}
              {site.serviceAreas.length > 0 ? (
                <li className="pt-2">
                  <span className="block font-semibold text-white">Service area</span>
                  {site.serviceAreas.join(", ")}
                </li>
              ) : null}
              {site.hours.length > 0 ? (
                <li className="pt-2">
                  <span className="block font-semibold text-white">Hours</span>
                  {site.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.hours}
                    </span>
                  ))}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-white hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
