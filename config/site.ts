/**
 * ─────────────────────────────────────────────────────────────
 *  WOODY & CO TREE SERVICES — BUSINESS DETAILS
 * ─────────────────────────────────────────────────────────────
 *  This is the ONE place to update business information.
 *  Anything left empty ("" or []) is hidden on the live site.
 *  Nothing here is invented — fill in only what is true.
 */

import { showGallery } from "./images";

export const site = {
  name: "Woody & Co Tree Services",
  shortName: "Woody & Co",
  tagline: "Professional Tree Care. Done Right.",

  /** Where you work. Used in the page title, headings, footer and search data. */
  region: "Armidale and Uralla", // used in sentences
  regionShort: "Armidale/Uralla", // used in page titles
  /** The main service searched for — leads the page title. */
  primaryService: "Tree Removal",

  description:
    "Tree removal, pruning, stump grinding, firewood and lawn maintenance in Armidale and Uralla. Public liability insured and Certificate III qualified. Request a quote.",

  /** Public website address. Set NEXT_PUBLIC_SITE_URL in the environment for production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  /** Phone number, e.g. "0400 000 000" or "+61 400 000 000". Leave "" until confirmed. */
  phone: "0428 356 872",

  /** Business email shown on the site (not the form destination — that is QUOTE_TO_EMAIL). */
  email: "jamiewoodward77@hotmail.com",

  /**
   * Suburbs, cities or regions you actually service, e.g. ["Parramatta", "Blacktown"].
   * Leave empty until confirmed. When empty, no areas are listed anywhere.
   */
  serviceAreas: ["Armidale", "Uralla"] as string[],

  /** Opening hours, e.g. [{ days: "Mon–Fri", hours: "7:00am – 5:00pm" }]. Leave empty until confirmed. */
  hours: [] as { days: string; hours: string }[],

  /** Full URLs to real social accounts. Empty ones are hidden. */
  social: {
    facebook: "",
    instagram: "",
    google: "", // Google Business Profile link
  },

  /**
   * Insurance, experience and qualifications — wording is deliberate:
   * the 20+ years refers to chainsaw experience, and the Certificate III is
   * stated separately (it was not held for the whole 20 years).
   * Set a value to ""/false to hide that item.
   */
  credentials: {
    publicLiability: true,
    /** Cover amount, e.g. "$10 million". Leave "" to just say "insured". */
    publicLiabilityCover: "$10 million",
    /** Years of chainsaw experience, e.g. "20+". */
    chainsawYears: "20+",
    certificateIII: true,
    /** Full name of the qualification. Leave "" to just say "Certificate III". */
    certificateDetail: "Certificate III in Arboriculture",
  },

  /**
   * Owner confirmations. Flip these to true ONLY once they are accurate.
   * They control claims made in headings, buttons and trust points.
   */
  confirmed: {
    /** Quotes are free of charge → changes "Request a Quote" to "Get a Free Quote". */
    freeQuotes: false,
    /** Both homes and businesses are serviced → adds the residential & commercial trust point. */
    residentialAndCommercial: false,
  },
} as const;

/** Button / link wording that depends on owner confirmations. */
export const quoteLabel = site.confirmed.freeQuotes ? "Get a Free Quote" : "Request a Quote";

export const announcement = [
  "Reliable Tree Care",
  `Serving ${site.region}`,
  site.confirmed.freeQuotes ? "Free Quote Requests" : "Request a Quote",
];

/** Search-focused page title, e.g. "Tree Removal in Armidale/Uralla | Woody & Co Tree Services" */
export const homeTitle = `${site.primaryService} in ${site.regionShort} | ${site.name}`;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/#services" },
  { label: "About Us", href: "/#about" },
  // "Our Work" only appears once real project photos have been added (see config/images.ts)
  ...(showGallery ? [{ label: "Our Work", href: "/#work" }] : []),
  { label: "Contact", href: "/#quote" },
];
