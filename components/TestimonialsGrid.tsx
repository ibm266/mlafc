'use client';

import { useMemo, useRef, useState } from 'react';
import { TestimonialCard } from '@/components/TestimonialCard';
import testimonialsJson from '@/data/testimonials.json';
import type { Testimonial } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'patient', label: 'Patients' },
  { id: 'peer', label: 'Peers' },
  { id: 'news', label: 'News' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export function TestimonialsGrid() {
  const [filter, setFilter] = useState<FilterId>('all');
  const [letter, setLetter] = useState<Testimonial | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shown = useMemo(
    () => (filter === 'all' ? testimonials : testimonials.filter((t) => t.category === filter)),
    [filter],
  );

  const countFor = (id: FilterId) =>
    id === 'all' ? testimonials.length : testimonials.filter((t) => t.category === id).length;

  const openLetter = (testimonial: Testimonial) => {
    setLetter(testimonial);
    dialogRef.current?.showModal();
  };

  const closeLetter = () => {
    dialogRef.current?.close();
    setLetter(null);
  };

  return (
    <div>
      <div role="group" aria-label="Filter testimonials" className="flex flex-wrap gap-3">
        {FILTERS.map((filterOption) => (
          <button
            key={filterOption.id}
            type="button"
            aria-pressed={filter === filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`interactive rounded-full border px-4 py-2 text-sm font-semibold ${
              filter === filterOption.id
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-ink-soft hover:border-ink-soft'
            }`}
          >
            {filterOption.label} <span className="opacity-70">{countFor(filterOption.id)}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-ink-soft" aria-live="polite">
        {`${shown.length} testimonials shown`}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((testimonial) => (
          <TestimonialCard key={testimonial.id} t={testimonial} onOpenLetter={openLetter} />
        ))}
      </div>

      {shown.length === 0 && <p className="mt-10 text-ink-mute">No testimonials in this category yet.</p>}

      <dialog
        ref={dialogRef}
        onClose={() => setLetter(null)}
        className="m-auto w-[min(640px,92vw)] rounded-lg border border-line bg-paper p-0 backdrop:bg-night/70"
      >
        {letter?.letter && (
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{letter.letter.tag}</p>
                <p className="mt-2 font-serif text-2xl">{letter.letter.org}</p>
                <p className="text-sm text-ink-mute">
                  {letter.letter.subtitle} &middot; {letter.letter.date}
                </p>
              </div>
              <button
                type="button"
                onClick={closeLetter}
                aria-label="Close letter"
                className="interactive rounded-full border border-line px-3 py-1 text-ink-soft hover:text-ink"
              >
                &times;
              </button>
            </div>
            <div className="mt-6 space-y-4 text-ink-soft">
              {letter.letter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 font-semibold">{letter.letter.sigName}</p>
            <p className="text-sm text-ink-mute">{letter.letter.sigRole}</p>
            <button
              type="button"
              onClick={closeLetter}
              className="interactive mt-6 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-night"
            >
              Close
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
