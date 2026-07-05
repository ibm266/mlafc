import Link from 'next/link';
import { ConditionMedia } from '@/components/conditions/ConditionMedia';
import { ConditionMediaPlaceholder } from '@/components/conditions/ConditionMediaPlaceholder';
import { EcgComparisonAnimation } from '@/components/conditions/EcgComparisonAnimation';
import { Reveal } from '@/components/Reveal';
import type { Condition } from '@/data/types';

type Props = {
  condition: Condition;
  index: number;
};

export function ConditionSection({ condition, index }: Props) {
  const band = index % 2 === 0 ? 'bg-paper' : 'bg-paper-soft';

  return (
    <section
      id={condition.id}
      aria-labelledby={`${condition.id}-heading`}
      className={`border-t border-line ${band}`}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-12 md:py-20">
        <div className="flex w-full items-center justify-center md:justify-center">
          {condition.ecgVariant ? (
            <Reveal className="w-full max-w-lg">
              <EcgComparisonAnimation variant={condition.ecgVariant} alt={condition.videoAlt} />
            </Reveal>
          ) : condition.videoSrc && condition.posterSrc ? (
            <Reveal className="w-full max-w-lg">
              <ConditionMedia
                videoSrc={condition.videoSrc}
                posterSrc={condition.posterSrc}
                alt={condition.videoAlt}
              />
            </Reveal>
          ) : (
            <Reveal className="w-full max-w-lg">
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

        <div className="min-w-0">
          <Reveal delay={90}>
            <h2 id={`${condition.id}-heading`} className="font-serif text-3xl leading-tight md:text-4xl">
              {condition.title}
            </h2>
            {condition.isSymptom ? (
              <p className="mt-3 text-sm font-medium text-ink-mute">
                A symptom, not a single diagnosis. Many possible causes.
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={150}>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-brass-deep">
              What it can feel like
            </h3>
            <ul className="mt-3 space-y-2 text-ink-soft">
              {condition.feelsLike.map((item) => (
                <li key={item} className="border-b border-line pb-2">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={210}>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-widest text-brass-deep">
              What is happening
            </h3>
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
      </div>
    </section>
  );
}
