'use client';

import { useEffect, useRef, useState } from 'react';
import type { Milestone } from '@/data/types';

function PhotoFrame({ m }: { m: Milestone }) {
  return (
    <figure className="rounded-lg border border-line bg-paper-soft p-6">
      <div className="flex aspect-[4/3] items-center justify-center rounded border border-dashed border-line text-xs uppercase tracking-widest text-ink-mute">
        photograph
      </div>
      <figcaption className="mt-4">
        <p className="font-serif text-xl">{m.photoTitle}</p>
        <p className="mt-1 text-sm text-ink-soft">{m.photoCaption}</p>
      </figcaption>
    </figure>
  );
}

export function JourneyTimeline({ milestones }: { milestones: Milestone[] }) {
  const [activeYear, setActiveYear] = useState(milestones[0].markerYear);
  const refs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const year = (e.target as HTMLElement).dataset.year;
            if (year) setActiveYear(year);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [milestones]);

  const active = milestones.find((m) => m.markerYear === activeYear) ?? milestones[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[2fr_3fr]">
      {/* Sticky panel - desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-28 space-y-6">
          <ol className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Years">
            {milestones.map((m) => (
              <li
                key={m.markerYear}
                className={`text-sm font-semibold ${m.markerYear === activeYear ? 'text-brass-deep' : 'text-ink-mute'}`}
              >
                {m.markerYear}
                {m.markerYear === activeYear && (
                  <span className="ml-1 font-normal text-ink-soft">· {m.markerSub}</span>
                )}
              </li>
            ))}
          </ol>
          <PhotoFrame m={active} />
        </div>
      </div>

      {/* Scrolling milestones */}
      <div>
        {milestones.map((m) => (
          <article
            key={m.markerYear}
            data-year={m.markerYear}
            ref={(el) => {
              if (el) refs.current.set(m.markerYear, el);
            }}
            className="border-b border-line py-12 last:border-none"
          >
            <div className="lg:hidden">
              <PhotoFrame m={m} />
            </div>
            <p className="mt-6 text-sm font-semibold text-brass-deep lg:mt-0">{m.yearLabel}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-mute">
              {m.tag}
            </p>
            <h2 className="mt-3 font-serif text-3xl">{m.title}</h2>
            <p className="mt-4 text-ink-soft">{m.body}</p>
            {m.meta && <p className="mt-4 text-sm font-semibold text-ink-soft">{m.meta}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
