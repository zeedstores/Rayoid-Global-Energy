import { Button } from '../components/ui';

export default function NotFoundPage() {
  return <section className="site-container grid min-h-[65vh] place-items-center py-20 text-center"><div><p className="eyebrow text-brand">404</p><h1 className="hero-title mt-4">Page not found.</h1><p className="mt-5 text-muted">The page may have moved or is not part of this preview.</p><Button to="/" className="mt-8">Return home</Button></div></section>;
}
