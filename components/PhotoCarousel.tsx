'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import type { GalleryPhoto } from '@/data/types';

/** The stage runs the full width of the 72rem container, less the page gutter. */
const STAGE_SIZES = '(min-width: 1200px) 1100px, (min-width: 640px) 92vw, 100vw';
const THUMB_SIZES = '112px';
/** Horizontal travel that counts as a swipe rather than a tap or a vertical scroll. */
const SWIPE_THRESHOLD = 44;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  photos: GalleryPhoto[];
  /** Accessible name for the carousel, e.g. "Professor Gupta in action". */
  label: string;
  /** Top margin, so a caller can sit the carousel tighter under its heading. */
  className?: string;
};

export function PhotoCarousel({ photos, label, className = 'mt-10' }: Props) {
  const total = photos.length;
  const [index, setIndex] = useState(0);
  // Only the slides near the current one are mounted, so arriving at the
  // section costs three requests rather than one per photograph. Once a slide
  // has been mounted it stays mounted, which makes stepping back instant.
  const [mounted, setMounted] = useState<Set<number>>(
    () => new Set([total - 1, 0, 1].filter((i) => i >= 0 && i < total)),
  );

  const railRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    setMounted((previous) => {
      const next = new Set(previous);
      for (const offset of [-1, 0, 1]) next.add((index + offset + total) % total);
      return next.size === previous.size ? previous : next;
    });
  }, [index, total]);

  // Keep the active thumbnail in view. Scrolling the rail directly rather than
  // via scrollIntoView avoids dragging the whole page along with it.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRefs.current[index];
    if (!rail || !thumb) return;

    const left = Math.max(0, thumb.offsetLeft - (rail.clientWidth - thumb.clientWidth) / 2);
    // Element.scrollTo is missing in jsdom, so fall back to the plain property.
    if (typeof rail.scrollTo === 'function') {
      rail.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    } else {
      rail.scrollLeft = left;
    }
  }, [index]);

  const active = photos[index];

  return (
    <Reveal delay={100}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className={className}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        <div
          className="relative overflow-hidden rounded-xl border border-line-dark bg-night"
          onTouchStart={(event) => {
            const touch = event.changedTouches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            if (!start) return;
            touchStart.current = null;

            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            // Ignore mostly-vertical drags so a swipe never fights the page scroll.
            if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
            step(dx < 0 ? 1 : -1);
          }}
        >
          <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
            {photos.map((photo, i) => {
              const isActive = i === index;
              if (!mounted.has(i)) return null;

              return (
                <div
                  key={photo.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                  aria-hidden={!isActive}
                  className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                    isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes={STAGE_SIZES}
                    className="h-full w-full object-contain"
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous photograph"
            className="interactive absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/25 bg-night/70 text-paper backdrop-blur-sm hover:border-brass hover:text-brass-bright md:left-4 md:h-12 md:w-12"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next photograph"
            className="interactive absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/25 bg-night/70 text-paper backdrop-blur-sm hover:border-brass hover:text-brass-bright md:right-4 md:h-12 md:w-12"
          >
            <ChevronIcon direction="right" />
          </button>

          <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-night/75 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-paper/80 backdrop-blur-sm md:bottom-4 md:right-4">
            {index + 1} / {total}
          </p>
        </div>

        {/* Reserving height keeps the rail from jumping as captions change length. */}
        <div aria-live="polite" className="mt-5 min-h-[6.5rem] sm:min-h-[5.5rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">
            {active.meta}
          </p>
          <h3 className="mt-1.5 font-serif text-xl leading-tight text-ink md:text-2xl">
            {active.title}
          </h3>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft md:text-[15px]">
            {active.caption}
          </p>
        </div>

        <div
          ref={railRef}
          className="-mx-5 mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              ref={(node) => {
                thumbRefs.current[i] = node;
              }}
              onClick={() => setIndex(i)}
              aria-label={`Show photograph ${i + 1}: ${photo.title}`}
              aria-current={i === index}
              className={`interactive relative block h-14 w-[74px] shrink-0 snap-center overflow-hidden rounded-md border transition-opacity md:h-16 md:w-[86px] ${
                i === index
                  ? 'border-brass opacity-100'
                  : 'border-line opacity-55 hover:opacity-90'
              }`}
            >
              <Image
                src={photo.src}
                alt=""
                width={photo.width}
                height={photo.height}
                sizes={THUMB_SIZES}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
