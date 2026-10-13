import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { mailHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects the information you send through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const mail = mailHref(site.email);
  return (
    <section className="section">
      <div className="wrap max-w-3xl">
        <h1 className="section-title text-forest">Privacy Policy</h1>
        <p className="mt-3 text-stone">
          This explains what happens to the information you send {site.name} through this website.
        </p>

        <div className="mt-10 space-y-9 [&_h2]:font-heading [&_h2]:text-[1.35rem] [&_h2]:font-bold [&_h2]:text-forest [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6">
          <section>
            <h2>What we collect</h2>
            <p>When you use the quote form, we collect the details you enter:</p>
            <ul>
              <li>your name, phone number and email address;</li>
              <li>your suburb or postcode;</li>
              <li>the service you need, your preferred contact method and any description you add.</li>
            </ul>
            <p>
              Our servers may also process your IP address briefly to limit spam and abuse. We don&rsquo;t
              ask for more than we need to respond to your enquiry.
            </p>
          </section>

          <section>
            <h2>How we use it</h2>
            <p>
              We use your details to respond to your enquiry, discuss your job and provide a quote. We
              don&rsquo;t sell your information.
            </p>
          </section>

          <section>
            <h2>Who handles it</h2>
            <p>
              Your enquiry is delivered to us by email through a third-party email delivery provider.
              {process.env.TURNSTILE_SECRET_KEY || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
                ? " We also use Cloudflare Turnstile to check that enquiries come from real people."
                : ""}{" "}
              These providers process your information only to deliver and protect the service.
            </p>
          </section>

          <section>
            <h2>Access and corrections</h2>
            <p>
              You can ask to see the personal information we hold about you, or ask us to correct or
              delete it.{" "}
              {mail ? (
                <>
                  Email us at{" "}
                  <a href={mail} className="font-semibold text-forest underline">
                    {site.email}
                  </a>
                  .
                </>
              ) : (
                <>
                  Get in touch through the{" "}
                  <Link href="/#quote" className="font-semibold text-forest underline">
                    contact form
                  </Link>
                  .
                </>
              )}
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>We may update this policy from time to time. The current version is always on this page.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
