import { Reveal } from '@/components/Reveal';
import type { Publication } from '@/data/types';

const TAGS: Record<Publication['category'], string> = {
  original: 'Original research',
  review: 'Review',
  trial: 'Randomised trial',
  guideline: 'Guideline',
};

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const sorted = [...publications].sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <ol className="mt-10 list-none">
      {sorted.map((p, i) => (
        <Reveal key={p.id} delay={i * 40} as="li" className="flex gap-6 border-t border-line py-6">
          <span className="w-14 shrink-0 font-serif text-lg text-brass">{p.year}</span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-deep">
              {TAGS[p.category]}
            </span>
            <h3 className="mt-1.5 font-serif text-lg leading-snug">{p.title}</h3>
            <p className="mt-2 text-sm text-ink-soft">{p.summary}</p>
            <p className="mt-2 text-sm text-ink-mute">
              <strong className="text-ink">{p.authors}</strong> · {p.journal}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
