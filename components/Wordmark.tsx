import Link from "next/link";
import { site } from "@/config/site";

/** Text-based wordmark with a small ring mark. Not an official logo. */
export function Wordmark({ light = false }: { light?: boolean }) {
  const main = light ? "text-white" : "text-forest";
  const sub = light ? "text-sage" : "text-stone";
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — home`}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" className={main}>
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="16.6" cy="15.6" r="8.6" stroke="currentColor" strokeWidth="2.2" />
        <circle cx="17" cy="15.4" r="3.2" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-heading text-[1.2rem] font-extrabold tracking-tight ${main}`}>
          {site.shortName}
        </span>
        <span className={`mt-1 text-[0.72rem] font-semibold tracking-wide ${sub}`}>Tree Services</span>
      </span>
    </Link>
  );
}
