import { Button } from '../components/ui';
import { process } from '../data/site';

const reasons = [
  {
    number: '01',
    title: 'Connected solutions',
    copy: 'From solar power and CCTV to automation and maintenance, customers can discuss related property needs with one service company.',
  },
  {
    number: '02',
    title: 'Designed around your needs',
    copy: 'Every property is different. We begin by understanding your requirements before defining a suitable project scope.',
  },
  {
    number: '03',
    title: 'Support beyond installation',
    copy: 'Maintenance is part of our service offering, helping customers plan for the ongoing care of their systems.',
  },
  {
    number: '04',
    title: 'A clear way forward',
    copy: 'From the first conversation to installation planning, we aim to make the next steps easier to understand.',
  },
];

export default function WhyChooseUsPage() {
  return (
    <>
      {/* WHY RAYNOID HERO */}
      <section className="relative overflow-hidden bg-[#06191F] pb-16 pt-20 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#27934F]/15 blur-3xl" />

        <div className="site-container relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
            Why Raynoid
          </p>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              Reliable Power. Smarter Security.
              <span className="block text-[#49B765]">
                One Team for Your Property.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              From solar energy and CCTV to automation and maintenance,
              Raynoid helps homes and businesses address essential property
              needs through one connected range of services.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE RAYNOID */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Why choose us
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#06191F] sm:text-4xl lg:text-5xl">
              Practical service. Clear priorities.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#06191F]/65 sm:text-base sm:leading-8">
              We focus on understanding what each property needs, defining
              the work clearly and considering the support required beyond
              installation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {reasons.map((reason) => (
              <article
                key={reason.number}
                className="rounded-2xl border border-[#06191F]/10 bg-white p-6 sm:p-8 lg:p-10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F3E9] text-sm font-bold text-[#27934F]">
                  {reason.number}
                </span>

                <h3 className="mt-6 font-display text-xl font-bold text-[#06191F] sm:text-2xl">
                  {reason.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#06191F]/65 sm:text-base">
                  {reason.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="bg-white py-12 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-7 max-w-2xl sm:mb-10 lg:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Our purpose and direction
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#06191F] sm:text-4xl lg:text-5xl">
              What drives us forward.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
            {/* MISSION */}
            <article className="relative overflow-hidden rounded-2xl bg-[#06191F] p-4 text-white sm:rounded-3xl sm:p-7 lg:p-12">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#27934F]/20 blur-3xl sm:h-48 sm:w-48" />

              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#49B765] sm:text-xs sm:tracking-[0.22em]">
                  Our mission
                </span>

                <h3 className="mt-4 font-display text-lg font-bold leading-snug sm:mt-6 sm:text-2xl lg:text-3xl">
                  Practical solutions for better living and working.
                </h3>

                <p className="mt-3 text-xs leading-6 text-white/70 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base lg:leading-8">
                  We provide energy, security and automation solutions
                  tailored to the needs of homes, businesses and
                  organisations. Through quality products, thoughtful
                  planning and responsive service, we aim to create safer,
                  more efficient and more comfortable spaces.
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-[#49B765] sm:mt-8 sm:w-16" />
              </div>
            </article>

            {/* VISION */}
            <article className="relative overflow-hidden rounded-2xl border border-[#06191F]/10 bg-[#E8E9E2] p-4 sm:rounded-3xl sm:p-7 lg:p-12">
              <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#27934F]/10 blur-3xl sm:h-48 sm:w-48" />

              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#27934F] sm:text-xs sm:tracking-[0.22em]">
                  Our vision
                </span>

                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-[#06191F] sm:mt-6 sm:text-2xl lg:text-3xl">
                  Smarter, safer and more energy-conscious properties.
                </h3>

                <p className="mt-3 text-xs leading-6 text-[#06191F]/70 sm:mt-5 sm:text-sm sm:leading-7 lg:text-base lg:leading-8">
                  We aspire to become a trusted provider of integrated
                  energy and property technology solutions, helping
                  communities and businesses embrace reliable power,
                  improved security and smarter ways of living and working.
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-[#27934F] sm:mt-8 sm:w-16" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              From conversation to solution
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-[#06191F] sm:text-4xl lg:text-5xl">
              A clear process from the start.
            </h2>
          </div>

          <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
            {process.map((step, index) => (
              <div
                key={step}
                className="relative border-l border-[#27934F]/30 py-5 pl-6 first:pt-0 sm:py-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pr-5 lg:pt-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06191F] text-xs font-bold text-[#49B765] lg:-mt-11">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-[#06191F]">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl bg-[#06191F] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#27934F]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#49B765]">
                  Let's discuss your needs
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Let's find a solution that works for you.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Tell us about your property, your priorities and what you
                  want to achieve. We'll help you explore the next steps.
                </p>
              </div>

              <div className="shrink-0">
                <Button to="/contact">Talk to our team</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}