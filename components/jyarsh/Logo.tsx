// Jyarsh wordmark: a diamond sitting on the J, printed in gold foil.
// <FoilDefs /> must be rendered once on the page for the diamond stroke.
export function FoilDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="jy-foil" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#7A5218" />
          <stop offset=".45" stopColor="#D9B465" />
          <stop offset="1" stopColor="#8A5F22" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label="Jyarsh"
      className={`foil-text inline-flex items-end whitespace-nowrap font-semibold leading-none tracking-[0.16em] ${className}`}
      style={{ fontSize: size }}
    >
      <span className="relative mr-[0.08em] inline-block translate-y-[0.16em]">
        <svg viewBox="0 0 24 18" className="absolute bottom-[92%] left-1/2 h-[0.75em] w-[1em] -translate-x-[38%] overflow-visible" aria-hidden="true">
          <path
            d="M5 1h14l4 5-11 11L1 6z M1 6h22 M9 1 7 6l5 11 5-11-2-5 M12 1v5"
            fill="none"
            stroke="url(#jy-foil)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </svg>
        J
      </span>
      YARSH
    </span>
  );
}
