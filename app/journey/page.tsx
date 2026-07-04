import type { Metadata } from 'next';
import Link from 'next/link';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { Reveal } from '@/components/Reveal';
import { milestones } from '@/data/milestones';

export const metadata: Metadata = {
  title: 'The Journey - Mumbai London AF Clinic',
  description:
    'From medical school in 1988 to the Mumbai London AF Clinic in 2026 - the journey of Professor Dhiraj Gupta.',
};

export default function JourneyPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 pb-4 pt-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
            The journey · 1988 - 2026
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Thirty-eight years, <em className="text-brass-deep">one specialty</em>.
          </h1>
        </Reveal>
      </section>
      <section className="py-10">
        <JourneyTimeline milestones={milestones} />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <Link
          href="/book"
          className="inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper hover:bg-night"
        >
          Book a consultation
        </Link>
      </section>
    </main>
  );
}
