const steps = [
  { n: "1", title: "Get in Touch", body: "Tell us about your tree work and property." },
  {
    n: "2",
    title: "Discuss Your Needs",
    body: "We'll review the details and arrange any necessary assessment.",
  },
  {
    n: "3",
    title: "Get the Job Sorted",
    body: "Once the scope and quote are agreed, we'll arrange the work.",
  },
];

export function Process() {
  return (
    <section aria-labelledby="process-title" className="section bg-white">
      <div className="wrap">
        <h2 id="process-title" className="section-title text-forest">
          Getting Started Is Easy
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-10">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative flex gap-5 md:block md:after:absolute md:after:left-[4.25rem] md:after:right-[-1.5rem] md:after:top-[1.6rem] md:after:h-px md:after:bg-sage md:last:after:hidden"
            >
              <span
                aria-hidden="true"
                className="relative z-10 flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-forest font-heading text-xl font-extrabold text-white"
              >
                {s.n}
              </span>
              <div className="md:mt-6">
                <h3 className="text-[1.35rem] font-bold text-forest">
                  <span className="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p className="mt-2 max-w-xs text-stone">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
