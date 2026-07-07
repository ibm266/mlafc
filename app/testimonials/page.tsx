import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { ScrollProgress } from '@/components/ScrollProgress';
import { VoicesContent } from '@/components/VoicesContent';

export const metadata: Metadata = {
  title: 'Voices - Mumbai London AF Clinic',
  description:
    'Letters from hospitals, messages from patients, endorsements from peers, and press coverage of Professor Dhiraj Gupta.',
};

export default function TestimonialsPage() {
  return (
    <main id="main" className="bg-paper">
      <ScrollProgress />
      <PageHeader
        idPrefix="voices"
        eyebrow="Voices"
        title={
          <>
            Hospitals, patients, and peers. <em className="text-brass">In their own words.</em>
          </>
        }
        description="Written references from the institutions Professor Gupta has served, and the people he has treated."
      />
      <VoicesContent />
    </main>
  );
}
