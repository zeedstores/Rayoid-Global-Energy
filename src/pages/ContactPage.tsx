
import { QuoteForm } from '../components/QuoteForm';
import { Button } from '../components/ui';
import { company } from '../data/site';

export default function ContactPage() {
  return (
    <>
      {/* CONTACT HERO */}
      <section className="relative overflow-hidden bg-[#06191F] pb-16 pt-20 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#27934F]/10 blur-3xl" />

        <div className="site-container relative z-10 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
              Talk to Raynoid
            </p>

            <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              Let's talk about
              <span className="block text-[#49B765]">
                what you need.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Tell us about your property, the service you need and what
              you're trying to achieve. We'll help you understand the next
              steps.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#49B765]">
              Need a quick conversation?
            </p>

            <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              Speak with our team.
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/65">
              Call or message us directly if you'd prefer to discuss your
              requirements before filling in the form.
            </p>

            <Button to={company.whatsappHref} className="mt-6">
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS AND QUOTE FORM */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">

          {/* Contact information */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Get in touch
            </p>

            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-[#06191F] sm:text-4xl">
              Tell us a little about your project.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#06191F]/65 sm:text-base">
              Share your questions or requirements through any of the
              contact channels below.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white/70">
              {[
                {
                  label: 'Phone',
                  value: company.phone,
                },
                {
                  label: 'WhatsApp',
                  value: company.whatsapp,
                },
                {
                  label: 'Email',
                  value: company.email,
                },
                {
                  label: 'Office',
                  value: company.address,
                },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`p-5 sm:p-6 ${
                    index !== 3 ? 'border-b border-[#06191F]/10' : ''
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#27934F]">
                    {item.label}
                  </p>

                  <p className="mt-2 break-words text-sm leading-7 text-[#06191F] sm:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#06191F] p-6 text-white sm:p-7">
              <p className="font-display text-xl font-semibold">
                Not sure what you need?
              </p>

              <p className="mt-3 text-sm leading-7 text-white/65">
                Start with the problem you're facing. We can discuss the
                available services and clarify what information is needed
                for a quote.
              </p>

              <Button to="/services" className="mt-5">
                Explore our services
              </Button>
            </div>
          </div>

          {/* Quote form */}
          <div className="overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white shadow-sm">
            <div className="bg-[#06191F] px-6 py-7 text-white sm:px-9 sm:py-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#49B765]">
                Request a quote
              </p>

              <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                Tell us what you have in mind.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/65">
                Provide a few details about your project so we can better
                understand your requirements.
              </p>
            </div>

            <div className="p-5 sm:p-9">
              <QuoteForm />
            </div>
          </div>

        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-white py-12 sm:py-16">
        <div className="site-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-[#06191F] sm:text-2xl">
              Prefer to speak directly?
            </p>

            <p className="mt-2 text-sm leading-7 text-[#06191F]/60">
              Reach out to Raynoid to discuss your requirements.
            </p>
          </div>

          <Button to={company.whatsappHref}>
            Message us on WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}

