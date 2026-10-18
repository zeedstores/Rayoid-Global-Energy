
import { DemoBadge, ResponsiveImage, Button } from '../components/ui';
import { images } from '../data/site';

const projects = [
  {
    title: 'Solar Installation',
    category: 'Solar energy',
    image: images.solar,
    number: '01',
    description:
      'Solar energy solutions for properties looking for a more dependable power supply.',
  },
  {
    title: 'CCTV Installation',
    category: 'Security systems',
    image: images.cctv,
    number: '02',
    description:
      'Security camera systems designed to improve visibility around homes and businesses.',
  },
  {
    title: 'Gate Automation',
    category: 'Access control',
    image: images.gate,
    number: '03',
    description:
      'Automated access solutions for more convenient and controlled property entry.',
  },
];

export default function ProjectsPage() {
  return (
    <>
      {/* PROJECTS HERO */}
      <section className="relative overflow-hidden bg-[#06191F] pb-16 pt-20 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#27934F]/10 blur-3xl" />

        <div className="site-container relative z-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#49B765]">
            Selected work
          </p>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <h1 className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em]">
              Solutions for
              <span className="block text-[#49B765]">
                real-world needs.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              Explore the kinds of solar, security and access-control
              solutions Raynoid provides. Verified project case studies
              will be added as project photographs and details become
              available.
            </p>
          </div>

          <div className="mt-7">
            <DemoBadge />
          </div>
        </div>
      </section>

      {/* PROJECT GALLERY */}
      <section className="bg-[#E8E9E2] py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#27934F]">
                Project categories
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#06191F] sm:text-4xl">
                Work worth exploring.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#06191F]/60">
              Explore the services and solutions available for homes,
              businesses and larger properties.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {projects.map((project, index) => (
              <article
                key={project.number}
                className={`group overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white ${
                  index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
                }`}
              >
                {/* Project image */}
                <div className="aspect-[5/3] overflow-hidden bg-[#DDE3DD]">
                  <ResponsiveImage
                    src={project.image}
                    alt={`${project.category} for residential and commercial properties`}
                  />
                </div>

                {/* Project details */}
                <div className="p-5 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#27934F]">
                    {project.number} / {project.category}
                  </p>

                  <h3 className="mt-3 font-display text-xl font-bold text-[#06191F] sm:text-2xl">
                    {project.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-7 text-[#06191F]/65">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT ENQUIRY */}
      <section className="bg-white py-16 sm:py-20">
        <div className="site-container">
          <div className="relative overflow-hidden rounded-3xl bg-[#06191F] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#27934F]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#49B765]">
                  Have a project in mind?
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  Let's talk about your property.
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/65 sm:text-base">
                  Tell us what you need and let's explore a suitable
                  solution for your home, business or site.
                </p>
              </div>

              <div className="shrink-0">
                <Button to="/contact">
                  Discuss your project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
