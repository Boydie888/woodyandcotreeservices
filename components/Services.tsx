import { ArrowRight } from "lucide-react";
import { enabledServices } from "@/config/services";
import { site } from "@/config/site";
import { EnquireLink } from "./EnquireLink";

// Pick a column count that leaves no empty cell in the last row.
const cols = (n: number) =>
  n % 3 === 0 ? "lg:grid-cols-3" : n % 4 === 0 ? "xl:grid-cols-4" : "lg:grid-cols-3";
import { ServiceIcon } from "./ServiceIcon";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section bg-paper">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 id="services-title" className="section-title text-forest">
            Tree Services You Can Rely On
          </h2>
          <p className="lede mt-4 text-stone">
            Practical tree care in {site.region}, tailored to your property and your needs.
          </p>
        </div>

        {/* One ruled grid. Each cell fills forest-green on hover/focus. */}
        <ul className={`mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line shadow-sm sm:grid-cols-2 ${cols(enabledServices.length)}`}>
          {enabledServices.map((service) => (
            <li
              key={service.id}
              className="group flex flex-col bg-white p-7 transition-colors duration-200 hover:bg-forest focus-within:bg-forest focus-within:[--focus:#ffffff] motion-reduce:transition-none sm:p-9 xl:p-8"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-md bg-forest text-white transition-colors duration-200 group-hover:bg-white group-hover:text-forest group-focus-within:bg-white group-focus-within:text-forest motion-reduce:transition-none">
                <ServiceIcon name={service.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-7 text-[1.4rem] font-bold text-forest transition-colors duration-200 group-hover:text-white group-focus-within:text-white motion-reduce:transition-none">
                {service.title}
              </h3>
              <p className="mt-3 flex-1 text-[1rem] text-stone transition-colors duration-200 group-hover:text-white/85 group-focus-within:text-white/85 motion-reduce:transition-none">
                {service.description}
              </p>
              <EnquireLink
                service={service.id}
                className="mt-7 inline-flex min-h-11 items-center gap-2 self-start font-heading font-bold text-forest underline-offset-4 transition-colors duration-200 group-hover:text-white group-focus-within:text-white hover:underline motion-reduce:transition-none"
              >
                Enquire Now
                <span className="sr-only"> about {service.title.toLowerCase()}</span>
                <ArrowRight
                  aria-hidden="true"
                  size={18}
                  className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </EnquireLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
