'use client';

import { truncateQuote, QUOTE_PREVIEW_LENGTH } from '@/lib/truncate-quote';
import type { Testimonial } from '@/data/types';

const CATEGORY_TAGS: Record<Testimonial['category'], string> = {
  hospital: 'Hospital reference',
  patient: 'Patient',
  peer: 'Peer',
  news: 'News',
};

type Props = {
  t: Testimonial;
  onReadMore: (t: Testimonial) => void;
  quoteClassName?: string;
};

export function VoicesQuoteCard({ t, onReadMore, quoteClassName = 'text-ink-soft' }: Props) {
  const { text: preview, truncated } = truncateQuote(t.quote, QUOTE_PREVIEW_LENGTH);
  const showReadMore = truncated || Boolean(t.letter);
  const tag = t.letter?.tag ?? CATEGORY_TAGS[t.category];

  return (
    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-deep">{tag}</div>
      <p className={`mt-3 flex-1 ${quoteClassName}`}>&ldquo;{preview}&rdquo;</p>
      <footer className="mt-4 text-sm">
        <strong className="block text-ink">{t.attribution}</strong>
        <span className="text-ink-mute">
          {t.detail}
          {t.letter?.date ? ` · ${t.letter.date.replace('Issued ', '')}` : ''}
        </span>
      </footer>
      {showReadMore ? (
        <button
          type="button"
          onClick={() => onReadMore(t)}
          className="interactive mt-4 self-start text-sm font-semibold text-brass-deep hover:underline"
        >
          Read more
        </button>
      ) : null}
    </article>
  );
}
