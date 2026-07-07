'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion, useReveal } from '@/lib/useReveal';

const STAR_COUNT = 5;
const STAR_STAGGER_MS = 180;
const STAR_ANIM_MS = 450;

function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-[clamp(3.5rem,16vw,13.75rem)] w-[clamp(3.5rem,16vw,13.75rem)] text-brass"
    >
      <path
        fill="currentColor"
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z"
      />
    </svg>
  );
}

export function TopDoctorsRating({ url }: { url: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (reducedMotion) {
      setShowCopy(true);
      return;
    }

    const delay = (STAR_COUNT - 1) * STAR_STAGGER_MS + STAR_ANIM_MS + 140;
    const timer = window.setTimeout(() => setShowCopy(true), delay);
    return () => window.clearTimeout(timer);
  }, [visible, reducedMotion]);

  return (
    <div ref={ref} className="mt-11 border-t border-line pt-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">Top Doctors</p>

      <div
        className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-center gap-[clamp(0.15rem,1.2vw,0.65rem)]"
        role="img"
        aria-label="Five-star rating on Top Doctors, over 40 patient reviews"
      >
        {Array.from({ length: STAR_COUNT }, (_, i) => (
          <span
            key={i}
            className={`top-doctors-star inline-flex shrink-0 ${visible ? 'top-doctors-star-visible' : ''}`}
            style={visible && !reducedMotion ? { animationDelay: `${i * STAR_STAGGER_MS}ms` } : undefined}
          >
            <StarIcon />
          </span>
        ))}
      </div>

      <div
        className={`top-doctors-copy mx-auto max-w-lg ${showCopy ? 'top-doctors-copy-visible' : ''}`}
        aria-hidden={!showCopy}
      >
        <p className="mt-6 font-serif text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug text-ink">
          Five-star rating on Top Doctors
        </p>
        <p className="mt-2 text-base text-ink-soft">40+ patient reviews</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="arrow-link interactive mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brass-deep hover:underline"
          tabIndex={showCopy ? undefined : -1}
        >
          Read them in full
          <span aria-hidden className="text-brass">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
