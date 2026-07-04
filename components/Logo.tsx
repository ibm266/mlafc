import Image from 'next/image';

// Flipped to true in Task 15 once brand PNGs exist in public/brand/.
export const USE_IMAGE_ASSETS = false;

type Props = {
  variant: 'mark' | 'full' | 'dark';
  className?: string;
};

const FILES = {
  mark: '/brand/logo-mark.png',
  full: '/brand/logo-full.png',
  dark: '/brand/logo-dark.png',
} as const;

export function Logo({ variant, className = '' }: Props) {
  if (USE_IMAGE_ASSETS) {
    return (
      <Image
        src={FILES[variant]}
        alt="Mumbai London AF Clinic"
        width={variant === 'mark' ? 44 : 220}
        height={44}
        className={className}
        priority
      />
    );
  }

  const markColor = variant === 'dark' ? 'text-brass' : 'text-brass-deep';
  const textColor = variant === 'dark' ? 'text-paper' : 'text-ink';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg className={markColor} width="44" height="28" viewBox="0 0 44 28" aria-hidden="true">
        <circle cx="4" cy="14" r="3" fill="currentColor" />
        <path
          d="M7 14h8l3-8 5 16 3-8h11"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <circle cx="40" cy="14" r="3" fill="currentColor" />
      </svg>
      {variant !== 'mark' && (
        <span className={`font-serif text-lg tracking-wide ${textColor}`}>
          Mumbai London AF Clinic
        </span>
      )}
    </span>
  );
}
