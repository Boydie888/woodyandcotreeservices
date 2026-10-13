"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Phone } from "lucide-react";
import { navLinks, quoteLabel, site } from "@/config/site";
import { telHref } from "@/lib/contact";
import { Wordmark } from "./Wordmark";
import { EnquireLink } from "./EnquireLink";

export function Header() {
  const tel = telHref(site.phone);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and returns focus to the toggle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // If the window is resized up to desktop, make sure the mobile menu isn't left open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  className="py-2 text-[0.97rem] font-semibold text-ink underline-offset-8 decoration-2 decoration-forest hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {tel ? (
            <a
              href={tel}
              className="hidden min-h-11 items-center gap-2 font-heading text-[0.97rem] font-bold text-forest hover:underline sm:inline-flex"
            >
              <Phone aria-hidden="true" size={17} />
              {site.phone}
            </a>
          ) : null}
          <EnquireLink className="btn btn-primary btn-sm whitespace-nowrap">{quoteLabel}</EnquireLink>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-forest hover:bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-line bg-paper lg:hidden"
      >
        <ul className="wrap py-2">
          {navLinks.map((link) => (
            <li key={link.href + link.label} className="border-b border-line last:border-b-0">
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center text-lg font-semibold text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
