# Woody & Co Tree Services — website

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons. No other runtime dependencies.

## Easiest way to run it (Windows)

Double-click **`START-WEBSITE.bat`** in this folder (the same folder as `package.json`).
It installs everything the first time, starts the site and opens your browser at http://localhost:3000.
Keep its black window open while you look at the site; close it to stop.

## Run it (any computer, using the terminal)

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
npm run lint && npm run typecheck && npm test
```

## Updating the site (no coding needed)

Everything editable lives in `config/`. Anything left empty is **hidden** on the live site.

| File | What it controls |
| --- | --- |
| `config/site.ts` | Business name, region (Armidale/Uralla), page title, phone, email, hours, social links, **insurance / experience / qualification wording**, and the owner confirmations (`freeQuotes`, `residentialAndCommercial`) |
| `config/services.ts` | The service cards, the form dropdown, footer links (set `enabled: false` to hide one) |
| `config/images.ts` | Hero, "Why choose us" and gallery photos. Drop files in `public/images/` and set `src`. The "Our Work" gallery stays hidden until you add at least one real photo |
| `config/reviews.ts` | Genuine Google reviews (exact wording, with the reviewer's OK). Empty = the section is hidden. Put your Google Business Profile link in `social.google` to show a "Read more reviews on Google" button |

**Do not** flip `freeQuotes` or `residentialAndCommercial` to `true` until they're accurate — they change headings, buttons and trust points.

## Make the quote form deliver emails

The form posts to `app/api/quote/route.ts`, which validates on the server and emails the enquiry via [Resend](https://resend.com) (plain `fetch`, no SDK).

1. Create a Resend account, verify your sending domain, create an API key.
2. Set these in `.env.local` and in your host's environment settings:
   - `RESEND_API_KEY` — the API key (server-only, never `NEXT_PUBLIC_`)
   - `QUOTE_TO_EMAIL` — the inbox that receives enquiries
   - `QUOTE_FROM_EMAIL` — a verified sender, e.g. `Woody & Co Website <enquiries@yourdomain.com.au>`
3. Set `NEXT_PUBLIC_SITE_URL` to the live address (canonical URLs, sitemap, share previews).

**No business domain yet?** Resend can't send from a @hotmail.com address. For a first test, sign up to Resend with the email you want enquiries delivered to, set `QUOTE_FROM_EMAIL=onboarding@resend.dev` and `QUOTE_TO_EMAIL` to that same email. (Resend's test sender only delivers to your own account email — check their docs for current rules.) For the live site, verify your own domain in Resend and use an address on it.

Until those three are set, submitting the form shows an honest "online enquiries aren't available" message (HTTP 503) and logs which variables are missing. It never pretends an enquiry was sent. To use a different email provider, replace `sendQuoteEmail` in `lib/email.ts`.

### Spam protection
- Always on: hidden honeypot field, minimum-fill-time check, per-IP rate limit (5 per 10 min), same-origin check, server-side validation, request size cap, HTML-escaped emails and header-injection protection.
- Optional (recommended before launch): free [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/). Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` and the widget appears and is enforced automatically.
- The built-in rate limiter is in-memory (per server instance). On serverless hosting it is a speed bump, not a wall — Turnstile or your host's firewall is the stronger control.

### Photo uploads
Not included. Safe uploads need file storage and malware/type checks beyond an email-only backend. The form invites a description instead; add uploads later with object storage (e.g. S3/R2/Vercel Blob).

## Before launch checklist
- [ ] Add real photos in `config/images.ts` (hero, about, gallery). Placeholders are shown until then.
- [ ] Fill in phone and email in `config/site.ts` (region is already Armidale/Uralla).
- [ ] Optional: add the insurance detail / full Certificate III name in `config/site.ts` (`credentials`) if you want them shown.
- [ ] Set the three email variables (and ideally Turnstile) on the host.
- [ ] Add real reviews (or leave the section hidden).
- [ ] Have the Privacy Policy (`app/privacy/page.tsx`) reviewed — it describes what the form actually does, but isn't legal advice.
- [ ] Set `NEXT_PUBLIC_SITE_URL` and submit `/sitemap.xml` to Google Search Console.
- [ ] Consider a Google Business Profile and add it under `social.google`.

## Structure
```
app/            pages, layout, metadata, sitemap, robots, OG image, API route
components/     Header, Hero, Services, WhyChoose, Gallery, Process, ServiceArea,
                Reviews, QuoteSection, QuoteForm, Footer, shared pieces
config/         business details, services, images, reviews
lib/            validation (shared client+server), email, rate limit, Turnstile
tests/          validation + API route tests (npm test)
```
