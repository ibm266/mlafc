import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { Reveal } from '@/components/Reveal';
import { TripFeatureCard } from '@/components/home/TripFeatureCard';
import type { TripFeature } from '@/data/types';

/**
 * A visit's headline case in full, sitting under the condition it belongs to
 * on /conditions: the story, the quote, the facts, and every report of it.
 * The home page only carries the headline and links here.
 */
export function CaseStudySection({ feature }: { feature: TripFeature }) {
  const headingId = `${feature.id}-case-heading`;

  return (
    <section aria-labelledby={headingId} className="border-t border-line-dark bg-night text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <Reveal>
          <ChapterEyebrow label={`Case report · ${feature.eyebrow}`} dark />
        </Reveal>
        <Reveal delay={80}>
          <h2 id={headingId} className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
            {feature.stamp}, <em className="text-brass">in practice</em>.
          </h2>
          <p className="mt-3 max-w-xl text-paper/80">
            The patient, the procedure, and the press coverage, in one place.
          </p>
        </Reveal>
        <div className="mt-10">
          <TripFeatureCard feature={feature} />
        </div>
      </div>
    </section>
  );
}
