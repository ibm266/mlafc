import Link from 'next/link';
import { ConditionMedia } from '@/components/conditions/ConditionMedia';
import { ConditionMediaPlaceholder } from '@/components/conditions/ConditionMediaPlaceholder';
import { EcgComparisonAnimation } from '@/components/conditions/EcgComparisonAnimation';
import { RelatedPublications } from '@/components/conditions/RelatedPublications';
import { Reveal } from '@/components/Reveal';
import publicationsJson from '@/data/publications.json';
import type { Condition, Publication } from '@/data/types';

const publicationsById = new Map((publicationsJson as Publication[]).map((p) => [p.id, p]));

type Props = {
  condition: Condition;
  index: number;
};

export function ConditionSection({ condition, index }: Props) {
  const band = index % 2 === 0 ? 'bg-paper' : 'bg-paper-soft';
  const textFirst = index % 2 === 0;
  const relatedPubs = (condition.publicationIds ?? [])
    .map((id) => publicationsById.get(id))
    .filter((p): p is Publication => Boolean(p));

  const figure = (
    <div className="md:sticky md:top-24">
      {condition.ecgVariant ? (
        <Reveal className="w-full">
          <EcgComparisonAnimation variant={condition.ecgVariant} alt={condition.videoAlt} />
        </Reveal>
      ) : condition.videoSrc && condition.posterSrc ? (
        <Reveal className="w-full">
          <ConditionMedia videoSrc={condition.videoSrc} posterSrc={condition.posterSrc} alt={condition.videoAlt} />
        </Reveal>
      ) : (
        <Reveal className="w-full">
          <figure className="overflow-hidden rounded-lg border border-line bg-paper-soft">
            <ConditionMediaPlaceholder />
            <figcaption className="border-t border-line px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
                Animation in production
              </p>
              <p className="mt-1 text-sm text-ink-mute">{condition.videoAlt}</p>
            </figcaption>
          </figure>
        </Reveal>
      )}
    </div>
  );

  const copy = (
    <div className="min-w-0">
      <Reveal delay={90}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">
          {condition.isProcedure ? 'Procedure' : condition.isSymptom ? 'Symptom guide' : 'Condition'}
        </p>
        <h2 id={`${condition.id}-heading`} className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
          {condition.title}
        </h2>
        {condition.isSymptom ? (
          <p className="mt-3 text-sm font-medium text-ink-mute">
            A symptom, not a single diagnosis. Many possible causes.
          </p>
        ) : null}
        {condition.isProcedure ? (
          <p className="mt-3 text-sm font-medium text-ink-mute">
            A specialist procedure. Rarely available in India.
          </p>
        ) : null}
        {condition.milestone ? (
          <Link
            href={condition.milestone.href}
            className="interactive mt-2 inline-flex items-center gap-2 rounded-full border border-brass/50 bg-brass/10 px-3 py-1 text-xs font-semibold text-brass-deep hover:bg-brass/20"
          >
            <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
            {condition.milestone.label} &rarr;
          </Link>
        ) : null}
      </Reveal>

      <Reveal delay={150}>
        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-brass-deep">What it can feel like</h3>
        <ul className="mt-3 space-y-2 text-ink-soft">
          {condition.feelsLike.map((item) => (
            <li key={item} className="border-b border-line pb-2">
              {item}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={210}>
        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-brass-deep">What is happening</h3>
        <p className="mt-3 text-ink-soft">{condition.happening}</p>
      </Reveal>

      <Reveal delay={270}>
        <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-brass-deep">
          How Professor Gupta can help
        </h3>
        <p className="mt-3 text-ink-soft">{condition.help}</p>
      </Reveal>

      {condition.id === 'af' ? (
        <Reveal delay={330}>
          <Link href="/evidence" className="mt-6 inline-block font-semibold text-brass-deep hover:underline">
            See why experience matters &rarr;
          </Link>
        </Reveal>
      ) : null}
    </div>
  );

  const hasPapers = relatedPubs.length > 0;

  return (
    <section id={condition.id} aria-labelledby={`${condition.id}-heading`} className={`border-t border-line ${band}`}>
      <div
        className={`mx-auto grid max-w-6xl items-start gap-10 px-5 pt-16 md:grid-cols-2 md:gap-12 md:pt-20 ${
          hasPapers ? 'pb-10 md:pb-12' : 'pb-16 md:pb-20'
        }`}
      >
        {textFirst ? (
          <>
            {copy}
            {figure}
          </>
        ) : (
          <>
            {figure}
            {copy}
          </>
        )}
      </div>
      {/* The papers run the full width under both columns, so the gallery has
          room for three cards on a desktop and a swipeable row on a phone. */}
      {hasPapers ? (
        <div className="mx-auto max-w-6xl px-5 pb-16 md:pb-20">
          <Reveal>
            <RelatedPublications topic={condition.publicationTopic ?? condition.title} publications={relatedPubs} />
          </Reveal>
        </div>
      ) : null}
    </section>
  );
}
