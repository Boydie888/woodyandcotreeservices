import { MapPin } from "lucide-react";
import { site } from "@/config/site";
import { EnquireLink } from "./EnquireLink";

export function ServiceArea() {
  const areas = site.serviceAreas;
  return (
    <section id="service-area" aria-labelledby="area-title" className="section bg-sage/15">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="area-title" className="section-title text-forest">
            Local Tree Services
          </h2>
          <p className="lede mt-4 max-w-xl text-ink/80">
            Looking for reliable tree care in your area? Get in touch with {site.name} to check
            availability for your property.
          </p>
          <EnquireLink className="btn btn-primary mt-8">Check Our Service Area</EnquireLink>
        </div>

        {/* Only rendered once real service areas are set in config/site.ts */}
        {areas.length > 0 ? (
          <div className="rounded-md border border-forest/20 bg-white p-8 sm:p-10">
            <h3 className="font-heading text-base font-bold text-stone">Areas we service</h3>
            <ul className="mt-2 divide-y divide-line">
              {areas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-4 py-5 font-heading text-[2rem] font-extrabold leading-none text-forest sm:text-[2.4rem]"
                >
                  <MapPin aria-hidden="true" size={26} strokeWidth={1.75} className="shrink-0 text-sage" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
