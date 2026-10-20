import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { useCompanySettings } from '../hooks/useCompanySettings';
import { Brand } from './Brand';
import { Button } from './ui';

const navigation = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Projects', '/projects'],
  ['Why Choose Us', '/why-choose-us'],
  ['Contact', '/contact'],
];

type CompanyDetails = ReturnType<typeof useCompanySettings>;

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const company = useCompanySettings();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* HEADER */}
      <header className="absolute left-0 right-0 top-0 z-50 text-white">
        <div className="site-container flex h-20 items-center justify-between gap-6 sm:h-24">
          {/* Logo */}
          <Link to="/" className="relative z-10 shrink-0">
            <div className="w-fit brightness-90">
              <Brand />
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Primary navigation"
          >
            {navigation.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[#1677FF] ${
                    isActive ? 'text-white' : 'text-white/75'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button to="/contact">Get a solar quote</Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 backdrop-blur-md transition hover:bg-white/20 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-1 h-px w-5 bg-white transition-transform ${
                  open ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute bottom-1 left-0 h-px w-5 bg-white transition-transform ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile navigation */}
        {open && (
          <nav
            className="absolute left-4 right-4 top-[calc(100%-4px)] rounded-xl border border-white/10 bg-[#0B1728]/95 p-5 text-white shadow-2xl backdrop-blur-xl lg:hidden"
            aria-label="Mobile navigation"
          >
            {navigation.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `block border-b border-white/10 py-3 text-sm transition-colors hover:text-[#1677FF] ${
                    isActive ? 'text-[#1677FF]' : 'text-white/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="mt-5">
              <Button to="/contact" className="w-full">
                Get a solar quote
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer company={company} />

      {/* FLOATING WHATSAPP */}
      <FloatingWhatsApp company={company} />
    </div>
  );
}

function Footer({ company }: { company: CompanyDetails }) {
  return (
    <footer className="relative overflow-hidden bg-[#101B18] text-white">
      {/* TOP CTA */}
      <div className="site-container border-b border-white/10 py-12 sm:py-16">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#278747]">
              Powering a brighter future
            </p>

            <h2 className="mt-4 text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Ready to make the switch to solar?
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
              Let's find the right energy solution for your home or business.
            </p>
          </div>

          <a
            href={company.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-[#278747] px-6 py-3.5 text-sm font-semibold text-dark transition duration-300 hover:-translate-y-1 hover:brightness-110"
          >
            Talk to our team
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="site-container grid gap-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr] lg:gap-16">
        {/* BRAND */}
        <div>
          <div className="w-fit brightness-90">
            <Brand />
          </div>

          <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
            {company.tagline}
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span className="h-px w-10 bg-[#278747]" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              Clean energy. Smarter living.
            </span>
          </div>

          {/* COMPANY REGISTRATION */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
              Company registration
            </p>
            <p className="mt-2 text-sm font-medium tracking-wide text-white/80">
              RC 9574580
            </p>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#278747]">
            Explore
          </p>

          <div className="mt-6 grid gap-4">
            <Link
              to="/"
              className="w-fit text-sm text-white/65 transition hover:translate-x-1 hover:text-white"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="w-fit text-sm text-white/65 transition hover:translate-x-1 hover:text-white"
            >
              About us
            </Link>

            <Link
              to="/services"
              className="w-fit text-sm text-white/65 transition hover:translate-x-1 hover:text-white"
            >
              Our services
            </Link>

            <Link
              to="/contact"
              className="w-fit text-sm text-white/65 transition hover:translate-x-1 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#278747]">
            Get in touch
          </p>

          <div className="mt-6 grid gap-5">
            <a
              href={company.phoneHref}
              className="flex items-start gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <span className="mt-0.5 text-[#278747]" aria-hidden="true">
                ↗
              </span>
              <span>{company.phone}</span>
            </a>

            <a
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <span className="mt-0.5 text-[#278747]" aria-hidden="true">
                ↗
              </span>
              <span>WhatsApp: {company.whatsapp}</span>
            </a>

            <a
              href={`mailto:${company.email}`}
              className="flex items-start gap-3 break-all text-sm text-white/70 transition hover:text-white"
            >
              <span
                className="mt-0.5 shrink-0 text-[#278747]"
                aria-hidden="true"
              >
                ↗
              </span>
              <span>{company.email}</span>
            </a>

            <div className="flex items-start gap-3 text-sm leading-7 text-white/55">
              <span
                className="mt-0.5 shrink-0 text-[#278747]"
                aria-hidden="true"
              >
                ⌖
              </span>
              <span>{company.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-3 py-6 text-xs leading-6 text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>

          <p className="tracking-wide">
            RC 9574580
          </p>
        </div>

        {/* DISCREET ADMIN LOGIN */}
        <div className="site-container flex justify-end pb-3">
          <Link
            to="/admin"
            className="text-[9px] text-white/25 transition hover:text-white/60"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp({ company }: { company: CompanyDetails }) {
  return (
    <a
      href={company.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-5 z-[9999] flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#20BA5A] sm:bottom-8 sm:right-8"
    >
      <svg
        viewBox="0 0 32 32"
        fill="currentColor"
        className="h-6 w-6 shrink-0"
        aria-hidden="true"
      >
        <path d="M16.04 3C9.01 3 3.29 8.72 3.29 15.75c0 2.25.59 4.45 1.72 6.39L3.2 28.8l6.82-1.79a12.7 12.7 0 0 0 6.02 1.52h.01c7.03 0 12.75-5.72 12.75-12.75S23.07 3 16.04 3zm0 23.4h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.25-.4a10.58 10.58 0 0 1-1.63-5.65c0-5.87 4.78-10.65 10.66-10.65 2.84 0 5.52 1.11 7.53 3.12a10.58 10.58 0 0 1 3.12 7.53c0 5.87-4.78 10.65-10.66 10.65zm5.85-7.98c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.51-.16-.72.16-.22.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.61-1.9-1.8-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.21-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.62-.01c-.22 0-.57.08-.86.41-.3.32-1.13 1.1-1.13 2.68s1.16 3.11 1.32 3.33c.16.21 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.76.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37z" />
      </svg>

      <span>Contact Us</span>
    </a>
  );
}