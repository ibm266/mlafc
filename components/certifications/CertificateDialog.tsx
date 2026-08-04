'use client';

import Image from 'next/image';
import type { Certification } from '@/data/types';
import { CertificateArt } from '@/components/certifications/CertificateFrame';

type Props = {
  certification: Certification | null;
  position: { index: number; total: number };
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function CertificateDialog({
  certification: c,
  position,
  dialogRef,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const isScan = c?.kind === 'scan' && c.image;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-label="Certificate detail"
      className="cert-dialog m-auto max-h-[94vh] w-[min(1060px,95vw)] overflow-hidden rounded-xl border border-line bg-paper p-0 backdrop:bg-night/80"
    >
      {c ? (
        <>
          {/* A child of the dialog, not of the text pane. In the pane it landed
              halfway down the mobile layout instead of in the corner. */}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close certificate"
            className="interactive absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-paper/90 text-xl leading-none text-ink-soft shadow-sm backdrop-blur-sm hover:bg-paper hover:text-ink"
          >
            &times;
          </button>

          <div className="flex max-h-[94vh] w-full flex-col overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden">
            <div
              className={`flex shrink-0 items-center justify-center p-4 md:p-6 ${
                isScan ? 'bg-night' : 'bg-paper-soft'
              } md:w-[55%]`}
            >
              {isScan && c.image ? (
                <Image
                  src={c.image.src}
                  width={c.image.width}
                  height={c.image.height}
                  alt={c.image.alt}
                  sizes="(max-width: 768px) 92vw, 560px"
                  className="h-auto max-h-[30vh] w-auto max-w-full object-contain md:max-h-[82vh]"
                  style={{ filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.5))' }}
                />
              ) : (
                <div className="w-full overflow-hidden rounded-sm bg-white shadow-[0_10px_30px_rgba(6,15,21,0.16),inset_0_0_0_1px_rgba(18,43,58,0.14)]">
                  <CertificateArt certification={c} variant="dialog" />
                </div>
              )}
            </div>

            {/* Centred with my-auto rather than justify-center. A centred flex
                column that outgrows its pane spills past both ends, and the top
                of the story ended up painted over the certificate. */}
            <div className="flex min-h-0 flex-1 flex-col px-5 py-5 md:overflow-y-auto md:px-8 md:py-8">
              <div className="md:my-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep md:pr-10">
                  {c.awardingBody}
                </p>
                <h2 className="mt-2 font-serif text-xl leading-tight text-ink md:text-2xl">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm text-ink-mute">
                  {c.location ? `${c.location} · ${c.year}` : c.year}
                </p>

                <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-soft md:mt-4 md:text-[15px]">
                  {c.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {c.meta ? (
                  <p className="mt-3 text-sm font-semibold text-ink md:mt-4">{c.meta}</p>
                ) : null}

                {c.verify ? (
                  <a
                    href={c.verify.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive mt-3 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft hover:border-brass hover:text-ink md:mt-4 md:min-h-0"
                  >
                    Verify on the {c.verify.label}
                    <span aria-hidden className="text-xs text-brass">
                      ↗
                    </span>
                  </a>
                ) : null}

                <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 md:mt-6">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onPrev}
                      aria-label="Previous certificate"
                      className="interactive inline-flex min-h-11 items-center rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft hover:border-ink-soft hover:text-ink md:min-h-0"
                    >
                      <span aria-hidden>&larr;</span>&nbsp;Prev
                    </button>
                    <button
                      type="button"
                      onClick={onNext}
                      aria-label="Next certificate"
                      className="interactive inline-flex min-h-11 items-center rounded-full border border-line px-3.5 py-1.5 text-sm text-ink-soft hover:border-ink-soft hover:text-ink md:min-h-0"
                    >
                      Next&nbsp;<span aria-hidden>&rarr;</span>
                    </button>
                  </div>
                  <p className="text-xs text-ink-mute">
                    {position.index + 1} of {position.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
