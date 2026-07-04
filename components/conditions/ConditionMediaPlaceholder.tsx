export function ConditionMediaPlaceholder() {
  return (
    <div className="flex aspect-video items-center justify-center bg-paper-soft p-8" aria-hidden="true">
      <svg viewBox="0 0 400 220" className="h-auto w-full max-w-[320px]" fill="none">
        <line x1="16" y1="16" x2="16" y2="196" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="16" y1="196" x2="384" y2="196" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="10" y1="16" x2="22" y2="16" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="10" y1="106" x2="22" y2="106" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="200" y1="190" x2="200" y2="202" stroke="var(--color-line)" strokeWidth="1" />
        <line x1="378" y1="190" x2="378" y2="202" stroke="var(--color-line)" strokeWidth="1" />
        <path
          d="M40 110 H140 L152 70 L166 150 L178 90 L188 110 H236 L248 60 L262 160 L274 80 L286 110 H360"
          stroke="var(--color-brass)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="4 7"
          opacity="0.55"
        />
        <circle cx="40" cy="110" r="3.5" fill="var(--color-brass)" opacity="0.7" />
        <circle cx="360" cy="110" r="3.5" fill="var(--color-brass)" opacity="0.7" />
      </svg>
    </div>
  );
}
