export function MilestonePlaceholder() {
  return (
    <div
      className="flex aspect-[4/3] items-center justify-center rounded border border-line bg-night-soft p-8"
      aria-hidden
    >
      <svg viewBox="0 0 240 140" className="h-auto w-full max-w-[220px]" fill="none">
        <path
          d="M20 70 Q 120 20 220 90"
          stroke="var(--color-brass)"
          strokeWidth="1.5"
          strokeDasharray="3 8"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="20" cy="70" r="3" fill="var(--color-brass)" opacity="0.55" />
        <circle cx="220" cy="90" r="3" fill="var(--color-brass)" opacity="0.55" />
        <path
          d="M30 90 H50 L58 55 L68 105 L76 72 L86 90 H110 L118 62 L128 98 L136 78 L146 90 H210"
          stroke="var(--color-brass)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line x1="16" y1="120" x2="224" y2="120" stroke="var(--color-line-dark)" strokeWidth="1" opacity="0.5" />
        <line x1="16" y1="24" x2="16" y2="120" stroke="var(--color-line-dark)" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
}
