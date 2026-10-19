import { Button, SectionHeading } from '../components/ui';

export default function AboutPage() {
  return (
    <>
      {/* ABOUT HERO */}
      <section className="relative overflow-hidden bg-[#06191F] pb-16 pt-20 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#27934F]/10 blur-3xl" />

        <div className="site-container relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
              About Raynoid
            </p>

            <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5.2rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              Built for the way
              <span className="block text-[#49B765]">
                Nigeria lives.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              From family homes to busy businesses and larger properties,
              Raynoid brings power, security, automation and maintenance
              together through practical solutions designed around your needs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contact">Discuss a project</Button>

              <a
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:border-[#49B765] hover:text-[#49B765]"
              >
                Explore our services
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:aspect-[5/4]">
              <img
                src="/assets/about-hero.PNG"
                alt="Raynoid energy installation"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#0B252B]/95 p-4 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#49B765]">
                Our focus
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-white sm:text-xl">
                Practical solutions. Dependable support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Who we work with
            </p>

            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-tight tracking-[-0.04em] text-[#06191F]">
              Different properties.
              <span className="block text-[#27934F]">
                One practical approach.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#06191F]/65 sm:text-base">
              Every property has different priorities. We start by
              understanding yours before discussing the right solution.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Homes',
                copy: 'Power for daily living, security around the compound and easier control of access.',
              },
              {
                number: '02',
                title: 'Shops & offices',
                copy: 'Solutions that help protect equipment, support business operations and improve security.',
              },
              {
                number: '03',
                title: 'Larger sites',
                copy: 'Coordinated conversations around power, perimeter protection, access and maintenance.',
              },
            ].map((item) => (
              <article
                key={item.number}
                className="group rounded-2xl border border-[#06191F]/10 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#27934F]/40 hover:bg-white sm:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06191F] text-sm font-bold text-[#49B765] transition-colors group-hover:bg-[#27934F] group-hover:text-white">
                  {item.number}
                </div>

                <h3 className="mt-7 font-display text-xl font-bold text-[#06191F] sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#06191F]/65">
                  {item.copy}
                </p>

                <div className="mt-6 h-1 w-10 rounded-full bg-[#49B765] transition-all duration-300 group-hover:w-16" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
        <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-3xl border-l-2 border-t-2 border-[#49B765] sm:-left-6 sm:-top-6 sm:h-32 sm:w-32" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#E8E9E2]">
              <img
                src="/assets/about-controls.JPG"
                alt="Raynoid electrical control system"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-4 -right-3 rounded-xl bg-[#06191F] px-5 py-4 text-white shadow-xl sm:-right-5 sm:px-7 sm:py-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#49B765]">
                Our principle
              </p>
              <p className="mt-1 font-display text-lg font-semibold sm:text-xl">
                Clarity first.
              </p>
            </div>
          </div>

          <div className="pt-4 lg:py-8">
            <SectionHeading
              eyebrow="Our approach"
              title="Clarity before complexity."
              copy="The right system begins with a useful conversation about your property, your challenges and the outcome you need. We aim to make the options, scope and next steps easier to understand."
            />

            <div className="mt-8 space-y-5">
              {[
                {
                  title: 'Understand your needs',
                  copy: 'Start with your property, priorities and practical requirements.',
                },
                {
                  title: 'Discuss suitable solutions',
                  copy: 'Explore relevant services and the scope of the work.',
                },
                {
                  title: 'Plan the next steps',
                  copy: 'Move forward with a clearer understanding of the project.',
                },
              ].map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8E9E2] text-sm font-bold text-[#27934F]">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#06191F] sm:text-base">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#06191F]/60">
                      {step.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button to="/contact" className="mt-8">
              Let's discuss your project
            </Button>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[#06191F] py-14 text-white sm:py-20">
        <div className="site-container flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#49B765]">
              Let's get started
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Tell us what your property needs.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
              Let's talk through your requirements and explore a practical
              solution for your home, business or site.
            </p>
          </div>

          <div className="shrink-0">
            <Button to="/contact">Request a quote</Button>
          </div>
        </div>
      </section>
    </>
  );
}