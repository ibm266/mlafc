'use client';

import { useEffect, useRef } from 'react';
import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';
import { Reveal } from '@/components/Reveal';
import type { Milestone } from '@/data/types';

function PhotoFrame({ m }: { m: Milestone }) {
  return (
    <figure className="rounded-xl border border-line bg-paper-soft p-4 md:p-0 md:border-0 md:bg-transparent">
      <div className="overflow-hidden rounded-xl border border-line bg-paper-soft">
        <MilestonePlaceholder />
      </div>
      <figcaption className="mt-3">
        <p className="text-sm text-ink-mute">{m.photoCaption}</p>
      </figcaption>
    </figure>
  );
}

function MilestoneContent({ m }: { m: Milestone }) {
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="font-serif text-[2.6rem] leading-none text-brass">{m.yearLabel}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">{m.tag}</span>
      </div>
      <h2 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">{m.title}</h2>
      {m.body ? <p className="mt-4 text-ink-soft">{m.body}</p> : null}
      {m.variant === 'awards-band' && m.awards ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {m.awards.map((award) => (
            <div
              key={award.title}
              className={`rounded-xl border p-7 ${
                award.highlight ? 'border-brass/50 bg-paper-soft' : 'border-line bg-paper-soft'
              }`}
            >
              <p className={`font-serif text-2xl ${award.highlight ? 'text-brass-deep' : ''}`}>{award.title}</p>
              <p className="mt-2.5 text-ink-soft">{award.body}</p>
            </div>
          ))}
        </div>
      ) : null}
      {m.meta ? <p className="mt-4 text-sm font-semibold text-brass-deep">{m.meta}</p> : null}
    </>
  );
}

export function JourneyTimeline({ milestones }: { milestones: Milestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lifelineRef = useRef<HTMLDivElement>(null);
  const articleRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const container = containerRef.current;
    const lifeline = lifelineRef.current;
    if (!container || !lifeline) return;

    const articles = Array.from(container.querySelectorAll<HTMLElement>('[data-ms]'));
    const blips = Array.from(container.querySelectorAll<HTMLElement>('[data-blip]'));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const height = container.offsetHeight;
      const scrollMid = window.scrollY + window.innerHeight * 0.45;
      const progress = Math.max(0, Math.min(1, (scrollMid - top) / height));
      lifeline.style.height = `${progress * height}px`;

      articles.forEach((article, i) => {
        const blip = blips[i];
        if (!blip) return;
        const aTop = article.getBoundingClientRect().top;
        if (aTop < window.innerHeight * 0.55) {
          blip.classList.add('lit');
        } else {
          blip.classList.remove('lit');
        }
      });
    };

    if (reduce) {
      lifeline.style.height = `${container.offsetHeight}px`;
      blips.forEach((b) => b.classList.add('lit'));
      return;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [milestones]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-6xl px-5 pb-10">
      <div aria-hidden className="absolute bottom-0 left-11 top-0 w-0.5 bg-brass/20" />
      <div
        ref={lifelineRef}
        aria-hidden
        className="absolute left-11 top-0 w-0.5 bg-gradient-to-b from-brass via-brass to-transparent"
        style={{ height: 0 }}
      />

      {milestones.map((m, index) => {
        const photoFirst = m.photoFirst ?? index % 2 === 1;
        const showPhoto = m.variant !== 'awards-band';
        return (
          <article
            key={m.markerYear}
            data-ms
            ref={(el) => {
              if (el) articleRefs.current.set(m.markerYear, el);
            }}
            className="relative py-16 pl-16 md:pl-24"
          >
            <span
              data-blip
              aria-hidden
              className="blip absolute left-[18.5px] top-[86px] h-[15px] w-[15px] rounded-full border-2 border-brass bg-paper transition-colors duration-300"
            />
            <div
              className={
                showPhoto
                  ? `grid items-center gap-10 md:gap-12 ${
                      photoFirst ? 'md:grid-cols-[0.9fr_1.1fr]' : 'md:grid-cols-[1.1fr_0.9fr]'
                    }`
                  : ''
              }
            >
              <Reveal className={showPhoto && photoFirst ? 'md:order-1' : ''}>
                <MilestoneContent m={m} />
              </Reveal>
              {showPhoto ? (
                <Reveal delay={120} className={photoFirst ? 'md:order-2' : 'md:order-1'}>
                  <PhotoFrame m={m} />
                </Reveal>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
