import { HERO_MONITOR_TRACE } from '@/lib/ecg/design-paths';

export function EcgHeroMonitor() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
      className="ecg-layer pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="hp-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2A4254" strokeWidth="0.5" opacity="0.4" />
        </pattern>
        <linearGradient id="hp-win" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="52%" stopColor="#fff" stopOpacity="0" />
          <stop offset="80%" stopColor="#fff" stopOpacity="1" />
          <stop offset="94%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hp-sweep-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="720">
          <rect className="ecg-sweep" x="0" y="0" width="420" height="720" fill="url(#hp-win)" />
        </mask>
        <filter id="hp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="hp-vig" cx="34%" cy="46%" r="78%">
          <stop offset="0%" stopColor="#0C1F2B" stopOpacity="0" />
          <stop offset="55%" stopColor="#0C1F2B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0C1F2B" stopOpacity="0.86" />
        </radialGradient>
      </defs>
      <rect width="1440" height="720" fill="url(#hp-grid)" opacity="0.5" />
      {[
        [20, 20],
        [1420, 20],
        [20, 700],
        [1420, 700],
      ].map(([cx, cy], i) => (
        <g key={i} stroke="#3A5468" strokeWidth="0.75" opacity="0.7">
          <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
        </g>
      ))}
      <g className="ecg-hero-trace">
        <path
          d={HERO_MONITOR_TRACE}
          fill="none"
          stroke="#B08D3E"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.18"
        />
        <g mask="url(#hp-sweep-mask)">
          <path
            d={HERO_MONITOR_TRACE}
            fill="none"
            stroke="#D8B15A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#hp-glow)"
          />
        </g>
      </g>
      <rect width="1440" height="720" fill="url(#hp-vig)" />
    </svg>
  );
}
