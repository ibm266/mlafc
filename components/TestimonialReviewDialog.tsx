'use client';

import type { Testimonial } from '@/data/types';

type Props = {
  testimonial: Testimonial | null;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

export function TestimonialReviewDialog({ testimonial, dialogRef, onClose }: Props) {
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(640px,92vw)] rounded-lg border border-line bg-paper p-0 backdrop:bg-night/70"
    >
      {testimonial ? (
        <div className="p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {testimonial.letter ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
                    {testimonial.letter.tag}
                  </p>
                  <p className="mt-2 font-serif text-2xl text-ink">{testimonial.letter.org}</p>
                  <p className="text-sm text-ink-mute">
                    {testimonial.letter.subtitle} · {testimonial.letter.date}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
                    {testimonial.category === 'patient'
                      ? 'Patient'
                      : testimonial.category === 'peer'
                        ? 'Peer'
                        : 'Hospital reference'}
                  </p>
                  <p className="mt-2 font-serif text-xl text-ink">{testimonial.attribution}</p>
                  {testimonial.detail ? <p className="text-sm text-ink-mute">{testimonial.detail}</p> : null}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close review"
              className="interactive shrink-0 rounded-full border border-line px-3 py-1 text-ink-soft hover:text-ink"
            >
              &times;
            </button>
          </div>

          {testimonial.letter ? (
            <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-ink-soft">
              {testimonial.letter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="mt-6 font-serif text-lg leading-relaxed text-ink-soft">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          )}

          {testimonial.letter ? (
            <div className="mt-6 text-sm">
              <p className="font-semibold text-ink">{testimonial.letter.sigName}</p>
              <p className="text-ink-mute">{testimonial.letter.sigRole}</p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="interactive mt-6 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-night"
          >
            Close
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
