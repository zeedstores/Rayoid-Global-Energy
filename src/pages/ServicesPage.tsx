
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ResponsiveImage, Button } from '../components/ui';
import { supabase } from '../lib/supabase';

type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
};

function getServiceShort(description: string | null) {
  if (!description?.trim()) {
    return 'Contact our team to learn more about this service and how it can support your property or project.';
  }

  const firstSentence = description.match(/^.*?[.!?](?:\s|$)/)?.[0];

  return (firstSentence || description).trim();
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, description, image_url, is_published')
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Unable to load published services:', error);
        setLoadError(true);
        setLoading(false);
        return;
      }

      setServices((data ?? []) as ServiceRecord[]);
      setLoading(false);
    }

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {/* SERVICES HERO */}
      <section className="relative overflow-hidden bg-[#06191F] pb-16 pt-20 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#27934F]/15 blur-3xl" />

        <div className="site-container relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
            What we do
          </p>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              Practical solutions.
              <span className="block text-[#49B765]">
                Built around you.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              From reliable solar power to property security and automation,
              we help homes and businesses find solutions that fit their
              needs.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span>
              {loading ? 'Loading services...' : `${services.length} service areas`}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#49B765]" />
            <span>Residential and commercial</span>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
                Explore our capabilities
              </p>

              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-[#06191F] sm:text-4xl lg:text-5xl">
                One team for more of your property needs.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#06191F]/60">
              Choose a service to learn more about what it involves and how
              we can help with your project.
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-[#06191F]/60">
              Loading our services...
            </p>
          ) : loadError ? (
            <div className="rounded-2xl bg-white p-8 text-center">
              <p className="font-semibold text-[#06191F]">
                We couldn't load our services right now.
              </p>
              <p className="mt-2 text-sm text-[#06191F]/60">
                Please refresh the page or contact our team for assistance.
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center">
              <p className="font-semibold text-[#06191F]">
                Our services are being updated.
              </p>
              <p className="mt-2 text-sm text-[#06191F]/60">
                Please check back soon or contact our team.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#27934F]/40 hover:shadow-xl hover:shadow-[#06191F]/5"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#DDE3DD]">
                    {service.image_url ? (
                      <ResponsiveImage
                        src={service.image_url}
                        alt={service.title}
                        className="transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-5 text-center text-sm text-[#06191F]/50">
                        Image coming soon
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#06191F]/80 px-3 py-1.5 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#27934F]">
                      Raynoid Energy Solutions
                    </p>

                    <h3 className="mt-3 font-display text-xl font-bold leading-snug text-[#06191F] sm:text-2xl">
                      {service.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-[#06191F]/65">
                      {getServiceShort(service.description)}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-[#06191F]/10 pt-4">
                      <span className="text-sm font-semibold text-[#06191F] transition-colors group-hover:text-[#27934F]">
                        Explore service
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F3E9] text-lg text-[#27934F] transition duration-300 group-hover:bg-[#27934F] group-hover:text-white">
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICE ENQUIRY CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl bg-[#06191F] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#27934F]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#49B765]">
                  Not sure what you need?
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Let's find the right solution.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Tell us about your property or project, and let's discuss
                  the most suitable way forward.
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
