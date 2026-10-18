
import { Link } from 'react-router';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3"
      aria-label="Raynoid Global Energy home"
    >
      {/* Colored logo image */}
      <img
        src="/assets/logo.png"
        alt="Raynoid logo"
        className={`shrink-0 object-contain ${
          compact ? 'h-10 w-auto' : 'h-12 w-auto'
        }`}
      />

      {/* White text beside the logo */}
      <span className={compact ? 'hidden sm:block' : 'block'}>
        <span className="block font-display text-[0.96rem] font-bold leading-none tracking-[-0.03em] text-white">
          RAYNOID
        </span>

        <span className="mt-1 block text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/75">
          Global Energy Ltd
        </span>
      </span>
    </Link>
  );
}
