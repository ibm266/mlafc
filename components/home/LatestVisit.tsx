import Link from 'next/link';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { Reveal } from '@/components/Reveal';
import { TripCard } from '@/components/home/TripCard';
import { latestTrip } from '@/data/trips';

type Props = {
  /** Chapter number shown in the eyebrow, so the home page can renumber freely. */
  chapter?: string;
};

/**
 * The most recent visit in one card: the route, the numbers, and the headline
 * moment with a way through to the full case study. Everything comes from
 * `latestTrip`, so the next visit is a data change.
 */
export function LatestVisit({ chapter = '02' }: Props) {
  const trip = latestTrip;

  return (
    <section id="latest-visit" aria-labelledby="latest-visit-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <ChapterEyebrow chapter={chapter} label="Latest visit" />
        </Reveal>
        <Reveal delay={80}>
          <h2 id="latest-visit-heading" className="mt-3 max-w-3xl font-serif text-4xl leading-tight">
            {trip.title}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            <span className="font-semibold text-ink">{trip.dates}.</span> {trip.summary}
          </p>
        </Reveal>

        <div className="mt-10">
          <TripCard trip={trip} />
        </div>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="#in-action-heading"
              className="arrow-link interactive inline-block font-semibold text-brass-deep hover:underline"
            >
              The photographs from the road &darr;
            </Link>
            <Link
              href="/testimonials#press"
              className="arrow-link interactive inline-block font-semibold text-brass-deep hover:underline"
            >
              Every report, in the press &rarr;
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
