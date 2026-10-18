import type { ButtonHTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';

export function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M4 10h11m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function Button({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'light';
  className?: string;
}) {
  const styles = {
    primary: 'bg-brand text-white hover:bg-deep',
    outline: 'border border-ink/20 text-ink hover:border-brand hover:text-brand',
    light: 'border border-white/25 text-white hover:bg-white hover:text-ink',
  };
  const cls = `button-base ${styles[variant]} ${className}`;
  const external = to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:');
  return external ? (
    <a href={to} className={cls} target={to.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      <span>{children}</span>
      <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
    </a>
  ) : (
    <Link to={to} className={cls}>
      <span>{children}</span>
      <ArrowIcon className="size-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`eyebrow ${light ? 'text-solar' : 'text-brand'}`}>{eyebrow}</p>
      <h2 className={`section-title mt-4 ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {copy && <p className={`body-lg mt-5 ${light ? 'text-white/65' : 'text-muted'}`}>{copy}</p>}
    </div>
  );
}

export function ResponsiveImage({
  className = '',
  eager = false,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { eager?: boolean }) {
  return (
    <img
      {...props}
      className={`block h-full w-full object-cover ${className}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        event.currentTarget.style.opacity = '0.2';
        event.currentTarget.alt = 'Image temporarily unavailable';
      }}
    />
  );
}

export function SubmitButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`button-base bg-brand text-white hover:bg-deep ${props.className ?? ''}`}>
      <span>{props.children}</span>
      <ArrowIcon className="size-5" />
    </button>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-2 border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
      <span className="size-1.5 bg-amber-500" />
      Development preview — changes are not saved
    </span>
  );
}
