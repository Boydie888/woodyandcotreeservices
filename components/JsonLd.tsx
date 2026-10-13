import { site } from "@/config/site";
import { enabledServices } from "@/config/services";
import { isValidEmail, isValidPhone, toE164 } from "@/lib/contact";

/**
 * Structured data — only includes facts that are actually configured.
 * No address, geo, hours, ratings or reviews are ever invented.
 */
export function JsonLd() {
  const hasPhone = Boolean(site.phone) && isValidPhone(site.phone);
  const hasEmail = Boolean(site.email) && isValidEmail(site.email);
  const sameAs = Object.values(site.social).filter(Boolean);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": hasPhone || hasEmail ? "LocalBusiness" : "Organization",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    description: site.description,
  };
  if (hasPhone) data.telephone = toE164(site.phone);
  if (hasEmail) data.email = site.email;
  if (site.serviceAreas.length > 0) {
    data.areaServed = site.serviceAreas.map((name) => ({ "@type": "City", name }));
  }
  if (sameAs.length > 0) data.sameAs = sameAs;
  data.makesOffer = enabledServices.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.title, description: s.description },
  }));

  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
