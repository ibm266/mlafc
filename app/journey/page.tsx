import type { Metadata } from 'next';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { NightCtaCard } from '@/components/NightCtaCard';
import { PageHeader } from '@/components/PageHeader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { finaleMilestone, milestones } from '@/data/milestones';

export const metadata: Metadata = {
  title: 'The Journey - Mumbai London AF Clinic',
  description:
    'From medical school in 1988 to the Mumbai London AF Clinic in 2026: the journey of Professor Dhiraj Gupta.',
};

export default function JourneyPage() {
  return (
    <main id="main" className="bg-paper">
      <ScrollProgress />
      <PageHeader
        idPrefix="journey"
        eyebrow="The journey · 1988 to 2026"
        title={
          <>
            Thirty-eight years, one specialty, <em className="text-brass">one line</em>.
          </>
        }
        description="From a medical student in India to one of the UK's highest-volume electrophysiologists, and now back to Mumbai. Follow the line."
      />
      <section className="py-6">
        <JourneyTimeline milestones={milestones} />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <NightCtaCard
          idPrefix="journey-finale"
          title={
            <>
              And now, <em className="text-brass">home</em>.
            </>
          }
          description={finaleMilestone.body}
          footnote={finaleMilestone.meta}
        />
      </section>
    </main>
  );
}
