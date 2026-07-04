import type { Testimonial } from '@/data/types';

const TAGS: Record<Testimonial['category'], string> = {
  hospital: 'Hospital · Letter',
  patient: 'Patient',
  peer: 'Peer',
  news: 'News',
};

export function TestimonialCard({
  t,
  onOpenLetter,
}: {
  t: Testimonial;
  onOpenLetter?: (t: Testimonial) => void;
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
        {t.category === 'news' ? (
          <span className="flex items-baseline justify-between gap-2 normal-case tracking-normal">
            <span className="font-serif text-base text-ink">{t.masthead}</span>
            <span className="text-ink-mute">{t.date}</span>
          </span>
        ) : (
          TAGS[t.category]
        )}
      </div>
      {t.headline && <p className="mt-3 font-serif text-xl leading-snug">&ldquo;{t.headline}&rdquo;</p>}
      <p className={`mt-3 flex-1 ${t.category === 'hospital' ? 'font-serif text-lg leading-relaxed' : 'text-ink-soft'}`}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <footer className="mt-4 text-sm">
        <strong className="block text-ink">{t.attribution}</strong>
        {t.detail && <span className="text-ink-mute">{t.detail}</span>}
      </footer>
      {t.letter && onOpenLetter && (
        <button
          type="button"
          onClick={() => onOpenLetter(t)}
          className="mt-4 self-start text-sm font-semibold text-brass-deep hover:underline"
        >
          Read full letter &rarr;
        </button>
      )}
    </article>
  );
}
