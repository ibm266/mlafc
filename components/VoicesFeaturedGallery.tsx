'use client';

import { useCallback, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import type { Testimonial } from '@/data/types';

type FeaturedSlide = {
  id: string;
  eyebrow: string;
  title: string;
  testimonial: Testimonial;
  seeAllLabel: string;
  sectionId: string;
};

type Props = {
  slides: FeaturedSlide[];
};

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
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

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function VoicesFeaturedGallery({ slides }: Props) {
  const [active, setActive] = useState(0);
  const count = slides.length;
  const slide = slides[active];
  const t = slide?.testimonial;

  const goTo = useCallback(
    (index: number) => {
      setActive(Math.max(0, Math.min(index, count - 1)));
    },
    [count],
  );

  if (!slide || !t) return null;

  return (
    <section aria-label="Featured voices" className="border-b border-line bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_56px_rgba(18,43,58,0.08)] lg:min-h-[22rem]">
            <div className="flex flex-col justify-between gap-8 p-8 md:p-12 lg:flex-row lg:items-center lg:gap-16 lg:p-14">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
                  <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                  {slide.eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-2xl leading-snug text-ink md:text-3xl lg:max-w-3xl lg:text-[2rem] lg:leading-tight">
                  {slide.title}
                </h2>
                <blockquote className="mt-6 border-l-2 border-brass pl-5">
                  <p className="font-serif text-lg leading-relaxed text-ink md:text-xl lg:text-[1.35rem] lg:leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-5 text-sm">
                    <strong className="block text-ink">{t.attribution}</strong>
                    {t.detail ? <span className="text-ink-mute">{t.detail}</span> : null}
                  </footer>
                </blockquote>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
                <button
                  type="button"
                  onClick={() => scrollToSection(slide.sectionId)}
                  className="interactive rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-night"
                >
                  {slide.seeAllLabel}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {count > 1 ? (
          <div
            className="mt-6 flex items-center justify-center gap-3"
            role="group"
            aria-label="Featured voices pagination"
          >
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous featured voice"
              className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronIcon direction="left" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Featured voice categories">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={s.eyebrow}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === active ? 'w-6 bg-brass' : 'w-2 bg-line hover:bg-brass/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              aria-label="Next featured voice"
              className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
