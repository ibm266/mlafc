import type { Publication } from '@/data/types';

const TAGS: Record<Publication['category'], string> = {
  original: 'Original research',
  review: 'Review & editorial',
  trial: 'Clinical trial',
  guideline: 'Guideline',
};

type Props = {
  p: Publication;
  /**
   * Lead with the plain-language title and give the published one in small
   * print beneath the summary. The guides on /conditions use this.
   */
  plain?: boolean;
  /** The evidence page runs cards under an h2; under a guide's h3 they take h4. */
  headingLevel?: 'h2' | 'h3' | 'h4';
};

export function PublicationCard({ p, plain = false, headingLevel = 'h2' }: Props) {
  const Heading = headingLevel;

  return (
    <article className="card-hover flex h-full flex-col rounded-lg border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{TAGS[p.category]}</div>
      <Heading className="mt-3 font-serif text-xl font-semibold leading-snug text-ink">
        {plain ? p.plainTitle : p.title}
      </Heading>
      <p className="mt-3 flex-1 text-ink-soft">{p.summary}</p>
      {plain ? (
        <p className="mt-3 text-xs text-ink-mute">
          Published as: <span className="italic">{p.title}</span>
        </p>
      ) : null}
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
