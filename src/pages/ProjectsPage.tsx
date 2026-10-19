
import { useEffect, useState } from 'react';
import { DemoBadge, ResponsiveImage, Button } from '../components/ui';
import { supabase } from '../lib/supabase';

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setLoading(true);
      setError(false);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('id, title, slug, description, location, image_url')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (fetchError) {
        console.error('Failed to load projects:', fetchError);
        setError(true);
        setProjects([]);
      } else {
        setProjects((data ?? []) as Project[]);
      }

      setLoading(false);
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

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
              Explore our solar, security and access-control projects.
              Discover solutions delivered for homes and businesses.
            </p>
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
              Explore our solutions for homes, businesses and larger
              properties.
            </p>
          </div>

          {loading ? (
            <div
              className="py-16 text-center text-sm text-[#06191F]/60"
              role="status"
            >
              Loading projects...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#06191F]/70">
                We couldn't load the projects right now.
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 font-semibold text-[#27934F] underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#06191F]/60">
              No published projects are available yet.
            </div>
          ) : (
            
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
  {projects.map((project, index) => (
    <article
      key={project.id}
      className="group overflow-hidden rounded-2xl border border-[#06191F]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#06191F]/10"
    >
      {/* Project image */}
      {project.image_url ? (
        <div className="aspect-[5/3] overflow-hidden bg-[#DDE3DD]">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <ResponsiveImage
              src={project.image_url}
              alt={project.title}
            />
          </div>
        </div>
      ) : (
        <div className="flex aspect-[5/3] items-center justify-center bg-[#DDE3DD] px-6 text-center text-sm text-[#06191F]/50">
          Project image coming soon
        </div>
      )}

      {/* Project details */}
      <div className="p-5 sm:p-7 lg:min-h-48">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#27934F]">
          {String(index + 1).padStart(2, '0')}
          {project.location
            ? ` / ${project.location}`
            : ' / Raynoid project'}
        </p>

        <h3 className="mt-3 font-display text-xl font-bold text-[#06191F] sm:text-2xl">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-3 text-sm leading-7 text-[#06191F]/65">
            {project.description}
          </p>
        )}
      </div>
    </article>
  ))}
</div>

          )}
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
