import Image from 'next/image';

type Props = {
  variant: 'mark' | 'full' | 'dark';
  className?: string;
};

const MARK_LOGO = '/brand/logo-mark.jpg';

export function Logo({ variant, className = '' }: Props) {
  if (variant === 'mark') {
    return (
      <Image
        src={MARK_LOGO}
        alt="Mumbai London AF Clinic"
        width={56}
        height={56}
        className={`h-12 w-12 object-contain sm:h-14 sm:w-14 ${className}`}
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
      <span className={`font-serif text-lg tracking-wide ${textColor}`}>
        Mumbai London AF Clinic
      </span>
    </span>
  );
}
