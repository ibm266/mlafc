'use client';

import { useId, useState } from 'react';
import { HorizontalCardGallery } from '@/components/HorizontalCardGallery';
import { PublicationCard } from '@/components/PublicationCard';
import type { Publication } from '@/data/types';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 text-brass-deep transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = {
  /** What the papers are about, in the reader's words, e.g. "atrial flutter". */
  topic: string;
  /** In display order: the papers most likely to reassure a patient come first. */
  publications: Publication[];
};

/**
 * Professor Gupta's papers on one condition, folded away under its guide and
 * shown as the card gallery the evidence page uses: three to a page on a
 * desktop, a swipeable row on a phone. Each card leads with the paper's
 * plain-language name and keeps the published title in small print.
 */
export function RelatedPublications({ topic, publications }: Props) {
  const panelId = `${useId()}-panel`;
  const [open, setOpen] = useState(false);

  const count = publications.length;
  if (count === 0) return null;

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="interactive flex w-full items-center justify-between gap-4 border-y border-line py-4 text-left"
        >
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-semibold uppercase tracking-widest text-brass-deep">Related publications</span>
            <span className="rounded-full border border-brass/40 bg-brass/10 px-2.5 py-0.5 text-xs font-semibold text-brass-deep">
              {count} {count === 1 ? 'paper' : 'papers'}
            </span>
          </span>
          <ChevronIcon open={open} />
        </button>
      </h3>

      {/* Folded away, the panel is also hidden from assistive tech and the tab
          order, so nobody lands on a link they cannot see. The inner clips for
          the fold, so it takes over the container's side padding and the
          gallery can still run to the edge of a phone screen. */}
      <div
        id={panelId}
        aria-hidden={!open}
        inert={!open}
        className={`faq-panel ${open ? 'faq-panel-open' : 'faq-panel-closed'}`}
      >
        <div className="faq-panel-inner -mx-5 px-5">
          <p className="pt-4 text-sm text-ink-soft">
            Peer-reviewed research Professor Gupta has co-authored on {topic}, explained in plain language.
          </p>
          <HorizontalCardGallery ariaLabel={`Papers on ${topic}`} itemsPerPage={3} className="mt-6">
            {publications.map((p) => (
              <div key={p.id} className="h-full">
                <PublicationCard p={p} plain headingLevel="h4" />
              </div>
            ))}
          </HorizontalCardGallery>
        </div>
      </div>
    </div>
  );
}
