
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { company, images, process } from '../data/site';
import { Button, ResponsiveImage } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useCompanySettings } from '../hooks/useCompanySettings';

type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
};

type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_published: boolean;
};

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </svg>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#52734A]">
      {children}
    </p>
  );
}

function getServiceDescription(description: string | null) {
  if (description?.trim()) return description.trim();

  return 'Contact our team to learn more about this service and how it can support your property or project.';
}

function getShortDescription(description: string | null) {
  const text = getServiceDescription(description);
  const firstSentence = text.match(/^.*?[.!?](?:\s|$)/)?.[0];

  return (firstSentence || text).trim();
}

export default function HomePage() {
  const companySettings = useCompanySettings();

  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [projectsError, setProjectsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageContent() {
      const [servicesResult, projectsResult] = await Promise.all([
        supabase
          .from('services')
          .select('id, title, slug, description, image_url, is_published')
          .eq('is_published', true)
          .order('created_at', { ascending: true }),

        supabase
          .from('projects')
          .select(
            'id, title, slug, description, location, image_url, is_published',
          )
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (servicesResult.error) {
        console.error(
          'Unable to load homepage services:',
          servicesResult.error,
        );
        setServicesError(true);
      } else {
        setServices((servicesResult.data ?? []) as ServiceRecord[]);
      }

      if (projectsResult.error) {
        console.error(
          'Unable to load homepage projects:',
          projectsResult.error,
        );
        setProjectsError(true);
      } else {
        setProjects((projectsResult.data ?? []) as ProjectRecord[]);
      }

      setServicesLoading(false);
      setProjectsLoading(false);
    }

    void loadHomepageContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const officeAddress =
    companySettings.address?.trim() ||
    'Contact us for our current office address';

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    officeAddress,
  )}`;

  return (
    <main className="bg-canvas text-[#202720]">
      {/* HERO */}
      <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#101B2A] text-white sm:min-h-[600px] lg:min-h-[680px]">
        <div className="absolute inset-0 -z-20">
          <ResponsiveImage
            src="/solar-hero.png"
            alt="Solar panels on a modern rooftop at sunset"
            eager
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071321]/95 via-[#071321]/75 to-[#071321]/20"
        />

        <div className="site-container relative z-10 w-full py-28 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#D9E3ED] sm:text-sm">
              Clean Energy Solutions
            </p>

            <h1 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
              Powering a
              <br />
              brighter, more
              <br />
              reliable <span className="text-[#1677FF]">Nigeria.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
              Raynoid Global Energy Ltd provides reliable solar energy
              solutions for homes, businesses and institutions across Nigeria.
            </p>
            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white/65">
  RC 9574580
</p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button to="/contact" className="rounded-xl bg-[#27934F]">
                Get a Solar Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Curved white bottom edge */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-[85px] w-full sm:h-[115px]"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 100 C250 125 440 140 690 112 C930 85 1110 65 1440 0 L1440 140 L0 140 Z"
            fill="#E8E9E2"
          />
        </svg>

        {/* Decorative dots */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-20 h-28 w-36 sm:h-36 sm:w-48"
          style={{
            backgroundImage: 'radial-gradient(#17212B 2px, transparent 2px)',
            backgroundSize: '11px 11px',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          }}
        />
      </section>

      {/* INTRODUCTION */}
      <section className="relative overflow-hidden bg-canvas">
        <div className="site-container px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#398653]">
              About Us
            </p>

            <h2 className="font-display text-[clamp(2.8rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-[#172333]">
              Who We Are
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#46515D] sm:text-base sm:leading-8">
              Raynoid Global Energy Ltd delivers clean, reliable and
              affordable energy solutions for homes, businesses and
              communities across Nigeria. We combine practical solar
              technology with dependable service to help our customers take
              control of their energy needs.
            </p>

            <Link
              to="/about"
              className="group mt-4 inline-flex items-center gap-3 text-sm font-semibold text-[#287B45]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27934F] text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES — LOADED FROM SUPABASE */}
      <section className="relative overflow-hidden bg-[#06191F] pb-14 pt-20 text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <div className="absolute inset-x-0 top-0 h-10 -translate-y-px overflow-hidden sm:h-14">
          <svg
            aria-hidden="true"
            className="h-full w-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 H1440 V0 C1190 8 1080 75 850 78 C590 82 390 8 170 15 C100 17 45 25 0 35 Z"
              fill="#E8E9E2"
            />
          </svg>
        </div>

        <div className="site-container relative z-10 px-1">
          <div className="max-w-2xl">
            <SectionLabel>Our Services</SectionLabel>

            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.045em]">
              Solutions for
              <span className="block text-[#49B765]">Every Need</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
              From clean energy to smarter, safer properties, we provide
              reliable systems designed around your needs.
            </p>
          </div>

          {servicesLoading ? (
            <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center text-sm text-white/70">
              Loading services...
            </p>
          ) : servicesError ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
              <p className="font-semibold">
                Our services couldn't be loaded right now.
              </p>
              <p className="mt-2 text-sm text-white/60">
                Please refresh the page or visit our Services page.
              </p>
              <Link
                to="/services"
                className="mt-4 inline-flex text-sm font-semibold text-[#49B765] hover:underline"
              >
                Visit Services
              </Link>
            </div>
          ) : services.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
              <p className="font-semibold">Our services are being updated.</p>
              <p className="mt-2 text-sm text-white/60">
                Please check back soon or contact our team.
              </p>
            </div>
          ) : (
            <div className="mt-7 space-y-3 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to="/services"
                  className="group flex min-h-[116px] items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-3 transition-all duration-300 hover:border-[#27934F]/60 hover:bg-white/[0.055] sm:min-h-[230px] sm:flex-col sm:items-start sm:justify-between sm:p-5"
                >
                  <div className="h-[82px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-[#142C31] sm:h-36 sm:w-full">
                    {service.image_url ? (
                      <ResponsiveImage
                        src={service.image_url}
                        alt={service.title}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-xs text-white/50">
                        Image coming soon
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 sm:pr-1">
                    <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-[1.6] text-white/60 sm:text-sm">
                      {getShortDescription(service.description)}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#27934F]/80 text-[#49B765] transition-all duration-300 group-hover:bg-[#27934F] group-hover:text-white sm:ml-auto">
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-7 flex justify-center sm:mt-9 sm:justify-start">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 text-sm font-semibold text-[#49B765] transition-all hover:gap-5"
            >
              Explore all services
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS — LOADED FROM SUPABASE */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-8 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <SectionLabel>Featured Projects</SectionLabel>

              <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.045em] text-[#172333]">
                Solutions for
                <span className="block text-[#278747]">
                  everyday challenges.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#59665C] sm:text-base sm:leading-8">
                Explore published projects and solutions delivered by
                Raynoid for homes, businesses and properties.
              </p>
            </div>

            <Link
              to="/projects"
              className="group inline-flex shrink-0 items-center gap-3 text-sm font-bold text-[#278747]"
            >
              View all projects
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-[#278747] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          {projectsLoading ? (
            <p className="py-10 text-center text-sm text-[#59665C]">
              Loading projects...
            </p>
          ) : projectsError ? (
            <p className="rounded-2xl border border-[#06191F]/10 bg-white p-8 text-center text-sm text-[#59665C]">
              Projects couldn't be loaded right now. Please visit our Projects
              page.
            </p>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-[#06191F]/10 bg-white p-8 sm:p-10">
              <h3 className="font-display text-xl font-bold text-[#172333]">
                Our projects are being updated.
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#59665C]">
                Published projects will appear here once they have been added
                through the website manager.
              </p>
              <Link
                to="/projects"
                className="mt-4 inline-flex text-sm font-bold text-[#278747] hover:underline"
              >
                Visit all projects
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {projects.slice(0, 3).map((project, index) => (
                <Link
                  key={project.id}
                  to="/projects"
                  className="group overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#06191F]/5"
                >
                  <div className="relative aspect-[5/3] overflow-hidden bg-[#DDE3DD]">
                    {project.image_url ? (
                      <ResponsiveImage
                        src={project.image_url}
                        alt={project.title}
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#59665C]">
                        Image coming soon
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-[#06191F]/85 px-3 py-1.5 text-xs font-bold text-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    {project.location && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#278747] sm:text-xs">
                        {project.location}
                      </p>
                    )}

                    <h3 className="mt-3 line-clamp-2 font-display text-xl font-bold text-[#172333] sm:text-2xl">
                      {project.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#59665C]">
                      {getShortDescription(project.description)}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#278747]">
                      Explore projects
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY SOLAR */}
      <section className="relative overflow-hidden bg-[#E8E9E2] py-16 text-[#17251D] sm:py-24 lg:py-28">
        <div className="site-container">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <div>
              <SectionLabel>Why Solar</SectionLabel>

              <h2 className="max-w-3xl font-display text-[clamp(2.7rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.055em]">
                A smarter choice
                <span className="block text-[#278747]">for Nigeria.</span>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="max-w-lg text-sm leading-7 text-[#59665C] sm:text-base sm:leading-8">
                Unreliable electricity can interrupt work, business and
                everyday life. Solar energy offers a practical way to take
                greater control of your power supply.
              </p>

              <Link
                to="/contact"
                className="group mt-6 inline-flex items-center gap-3 text-sm font-bold text-[#237A40] transition-all hover:gap-5"
              >
                Find the right solution
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-[#D5DBD0] bg-[#F7F8F3] sm:mt-16 lg:mt-20">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="relative flex flex-col justify-between overflow-hidden bg-[#DCE9D9] p-6 sm:p-10 lg:p-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[35px] border-[#278747]/10 sm:h-72 sm:w-72"
                />

                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#278747]">
                    Power on your terms
                  </p>

                  <h3 className="mt-5 max-w-sm font-display text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-4xl">
                    More control.
                    <span className="block text-[#5B715E]">
                      Fewer interruptions.
                    </span>
                  </h3>

                  <p className="mt-5 max-w-md text-sm leading-7 text-[#59665C]">
                    A properly designed solar and backup system can help keep
                    essential appliances running when grid power is
                    unreliable.
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:p-12">
                {[
                  {
                    number: '01',
                    title: 'Reliable power',
                    description:
                      'Keep essential equipment and everyday activities running with a system designed around your needs.',
                  },
                  {
                    number: '02',
                    title: 'Greater energy control',
                    description:
                      'Choose a suitable solar and battery setup to help manage grid interruptions and energy use.',
                  },
                  {
                    number: '03',
                    title: 'Long-term value',
                    description:
                      'Reduce reliance on alternative power sources with equipment selected for your property and usage.',
                  },
                ].map((benefit) => (
                  <div
                    key={benefit.number}
                    className="group grid grid-cols-[40px_1fr] gap-4 border-b border-[#E0E5DC] py-6 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[48px_1fr] sm:gap-6 sm:py-8"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#278747]/40 text-xs font-bold text-[#278747] transition-colors group-hover:bg-[#278747] group-hover:text-white sm:h-11 sm:w-11">
                      {benefit.number}
                    </span>

                    <div>
                      <h4 className="line-clamp-1 font-display text-lg font-bold sm:text-xl">
                        {benefit.title}
                      </h4>

                      <p className="mt-2 line-clamp-3 max-w-lg text-sm leading-6 text-[#687368]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#D2D9CE] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-xs leading-6 text-[#687368] sm:text-sm">
              The right solution depends on your energy consumption, budget
              and backup requirements.
            </p>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-3 text-sm font-bold text-[#17251D] transition-colors hover:text-[#278747]"
            >
              Talk to our team
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-[#278747]">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE RAYNOID */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
            <div>
              <SectionLabel>Why Choose Raynoid Energy</SectionLabel>

              <h2 className="max-w-2xl font-display text-[clamp(2.3rem,5vw,4.5rem)] font-bold leading-[1.04] tracking-[-0.045em] text-[#172333]">
                Reliable power.
                <span className="block text-[#278747]">
                  Smarter property solutions.
                </span>
              </h2>
            </div>

            <div>
              <p className="text-sm leading-7 text-[#59665C] sm:text-base sm:leading-8">
                We bring energy, security, automation and maintenance services
                together, helping customers discuss their property needs with
                one team.
              </p>

              <Link
                to="/why-choose-us"
                className="group mt-5 inline-flex items-center gap-3 text-sm font-bold text-[#278747]"
              >
                Discover why Raynoid
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {[
              {
                number: '01',
                title: 'Connected services',
                description:
                  'Solar, security and automation solutions in one service range.',
              },
              {
                number: '02',
                title: 'Needs-led planning',
                description:
                  'Recommendations start with your property and requirements.',
              },
              {
                number: '03',
                title: 'Maintenance support',
                description:
                  'Ongoing maintenance is part of our service offering.',
              },
              {
                number: '04',
                title: 'Clear next steps',
                description:
                  'A straightforward process from enquiry to project planning.',
              },
            ].map((item) => (
              <article
                key={item.number}
                className="flex min-w-0 flex-col rounded-2xl border border-[#06191F]/10 bg-[#F7F8F3] p-4 sm:p-6 lg:p-7"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0EDE0] text-xs font-bold text-[#278747]">
                  {item.number}
                </span>

                <h3 className="mt-4 line-clamp-2 font-display text-base font-bold leading-snug text-[#172333] sm:mt-5 sm:text-xl">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#687368] sm:text-sm sm:leading-6">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT PROCESS */}
      <section className="py-2 sm:py-10 lg:py-14">
        <div className="site-container">
          <SectionLabel>Working together</SectionLabel>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              From the first conversation to the finished project.
            </h2>

            <p className="max-w-md text-sm leading-7 text-[#687067]">
              We keep the process straightforward, with clear communication
              about your requirements and the next steps.
            </p>
          </div>

          <div className="mt-10 grid border-l border-t border-[#DDE1D8] sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {process.map((step, index) => (
              <div
                key={`${step}-${index}`}
                className="min-h-[160px] border-b border-r border-[#DDE1D8] p-5 sm:p-6 lg:min-h-[190px] lg:p-7"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#52734A]">
                  Step {String(index + 1).padStart(2, '0')}
                </p>

                <h3 className="mt-7 max-w-[230px] font-display text-lg font-semibold leading-snug sm:text-xl">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="pb-12 sm:pb-16 lg:pb-20">
        <div className="site-container">
          <div className="grid gap-8 bg-[#203126] p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:p-14">
            <div className="max-w-2xl">
              <SectionLabel>Let's discuss your project</SectionLabel>

              <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                Tell us what you need.
                <span className="block text-[#C7D8B9]">
                  Let's plan the next step.
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
                Whether you are planning a solar installation, improving
                security or exploring automation, start with a conversation
                about your requirements.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[190px] lg:flex-col">
              <Button to="/contact">Request a quote</Button>

              <Button to={company.whatsappHref} variant="light">
                Chat on WhatsApp
              </Button>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-white/60 sm:flex-row sm:justify-between lg:col-span-2">
              <span>Raynoid Global Energy Ltd</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATE US — ADDRESS LOADED FROM COMPANY SETTINGS */}
      <section className="relative overflow-hidden bg-canvas text-[#172333]">
        <div className="site-container px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:pb-16 lg:pt-24">
          <div className="max-w-xl">
            <SectionLabel>Locate Us</SectionLabel>

            <h2 className="mt-3 max-w-lg font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.05em]">
              Find Us
              <span className="block">
                Across <span className="text-[#278747]">Nigeria.</span>
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#59665C] sm:text-base sm:leading-8">
              We are strategically located to serve you better. Visit our
              office or get in touch, and we’ll be happy to help.
            </p>
          </div>

          <div className="relative mt-10 sm:mt-12 lg:mt-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 z-0 h-32 w-28 opacity-50 sm:h-44 sm:w-36"
              style={{
                backgroundImage:
                  'radial-gradient(#718576 1.5px, transparent 1.5px)',
                backgroundSize: '10px 10px',
              }}
            />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              {/* NIGERIA MAP */}
              <div className="relative mx-auto flex h-[290px] w-full max-w-[520px] items-center justify-center sm:h-[360px] lg:h-[400px]">
                <div
                  aria-hidden="true"
                  className="absolute left-[12%] top-[12%] h-[75%] w-[75%] rounded-full bg-[#DCE9D9]/70 blur-2xl"
                />

                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <img
                    src="/assets/nigeria-map.svg"
                    alt="Map outline of Nigeria"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>

                <div
                  className="absolute left-[25%] top-[69%] z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  aria-label="Approximate office location on the Nigeria map"
                  title="Approximate office location"
                >
                  <span className="absolute h-12 w-12 animate-ping rounded-full bg-[#278747]/20" />

                  <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#071F22] text-[#49B765] shadow-xl sm:h-12 sm:w-12">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2.5a7 7 0 0 0-7 7c0 5.1 7 12 7 12s7-6.9 7-12a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                  </span>
                </div>

                <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#DDE5DA] bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#278747] shadow-sm sm:bottom-0">
                  Our office · Nigeria
                </div>
              </div>

              {/* ADDRESS CARD */}
              <div className="relative z-20 mx-auto w-full max-w-md border border-[#d7dfd1] p-5 shadow-[0_18px_55px_rgba(20,45,25,0.08)] sm:p-7 lg:mx-0">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#278747]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#278747]">
                      Visit Our Office
                    </p>

                    <h3 className="mt-2 font-display text-xl font-bold sm:text-2xl">
                      Our Office Address
                    </h3>

                    <p className="mt-1 break-words text-sm leading-7 text-[#667067]">
                      {officeAddress}
                    </p>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-2 inline-flex items-center gap-3 text-sm font-bold text-[#278747] hover:text-[#165C30]"
                    >
                      Get directions

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E4F0E3] transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowIcon />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
