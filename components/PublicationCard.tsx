import type { Publication } from '@/data/types';

const TAGS: Record<Publication['category'], string> = {
  original: 'Original research',
  review: 'Review & editorial',
  trial: 'Clinical trial',
  guideline: 'Guideline',
};

export function PublicationCard({ p }: { p: Publication }) {
  return (
    <article className="card-hover flex h-full flex-col rounded-lg border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{TAGS[p.category]}</div>
      <h2 className="mt-3 font-serif text-xl font-semibold leading-snug text-ink">{p.title}</h2>
      <p className="mt-3 flex-1 text-ink-soft">{p.summary}</p>
      <footer className="mt-4 text-sm">
        <strong className="block text-ink">{p.authors}</strong>
        <span className="text-ink-mute">
          {p.journal} &middot; {p.year}
        </span>
      </footer>
      {p.url ? (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="interactive mt-4 self-start text-sm font-semibold text-brass-deep hover:underline"
        >
          Read paper &rarr;
        </a>
      ) : (
        <span className="mt-4 self-start text-sm text-ink-mute">Paper link coming soon</span>
      )}
    </article>
  );
}
