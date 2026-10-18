
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { Button, ResponsiveImage } from '../components/ui';
import { images } from '../data/site';
import { supabase } from '../lib/supabase';

type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
};

const benefits = [
  'A solution planned around your property and requirements.',
  'Clear discussion of the recommended scope before work begins.',
  'Support with the next steps and a quote for your project.',
];

export default function ServiceDetailPage() {
  const { slug } = useParams();

  const [service, setService] = useState<ServiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadService() {
      setLoading(true);
      setLoadError(false);
      setService(null);

      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .select('id, title, slug, description, image_url, is_published')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setLoadError(true);
      } else {
        setService(data);
      }

      setLoading(false);
    }

    void loadService();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#06191F] px-6 text-center text-white">
        <div>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#49B765]" />
          <p className="mt-5 text-sm text-white/70">
            Loading service details...
          </p>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#06191F] px-6 text-center text-white">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-bold">
            Unable to load this service
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Please check your internet connection and try again, or contact
            our team for assistance.
          </p>
          <div className="mt-6">
            <Button to="/services">Explore our services</Button>
          </div>
        </div>
      </section>
    );
  }

  if (!service) {
    return <Navigate to="/not-found" replace />;
  }

  const description =
    service.description?.trim() ||
    'Contact our team to discuss your requirements and learn more about this service.';

  const image = service.image_url?.trim() || images.solar;

  return (
    <>
      {/* SERVICE HERO */}
      <section className="relative overflow-hidden bg-[#06191F] text-white">
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#27934F]/15 blur-3xl" />

        <div className="site-container relative z-10 grid gap-10 py-16 sm:py-20 lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="flex flex-col items-start">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
              Raynoid Global Energy
            </p>

            <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              {service.title}
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              {description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button to="/contact">Request a quote</Button>

              <Button
                to="/services"
                variant="outline"
                className="border-white/25 text-white hover:bg-white/10"
              >
                Explore our services
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium text-white/60 sm:gap-x-8">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#49B765]" />
                Residential solutions
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#49B765]" />
                Commercial projects
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -bottom-3 -left-3 h-1/2 w-1/2 rounded-2xl border border-[#49B765]/40 sm:-bottom-4 sm:-left-4" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#102B30] sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[560px]">
              <ResponsiveImage
                src={image}
                alt={service.title}
                eager
              />
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/15 bg-[#06191F]/85 p-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#49B765]">
                Raynoid Global Energy
              </p>

              <p className="mt-2 text-sm leading-6 text-white/85">
                Practical solutions designed around your property and your
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE OVERVIEW */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Understanding the service
            </p>

            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold leading-tight tracking-tight text-[#06191F] sm:text-4xl lg:text-5xl">
              A solution built around what matters to you.
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#06191F]/70 sm:text-base sm:leading-8">
              {description}
            </p>

            <div className="mt-8">
              <Button to="/contact">Discuss your requirements</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#06191F]/10 bg-white p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
              Key benefits
            </p>

            <h3 className="mt-3 font-display text-2xl font-bold text-[#06191F]">
              What you can expect
            </h3>

            <div className="mt-5">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[#06191F]/10 py-5 last:border-b-0 last:pb-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F3E9] text-xs font-bold text-[#27934F]">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <p className="pt-1 text-sm font-medium leading-6 text-[#06191F]/80 sm:text-base">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
                  Let's get started
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Need help with your next project?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                  Tell us about your property, your requirements and the
                  solution you're looking for. Our team can help you explore
                  the next steps.
                </p>
              </div>

              <div className="shrink-0">
                <Button to="/contact">Request a quote</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
