import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { TestimonialsGrid } from '@/components/TestimonialsGrid';

export const metadata: Metadata = {
  title: 'Testimonials — Mumbai London AF Clinic',
  description:
    'Letters from hospitals, messages from patients, endorsements from peers, and press coverage of Professor Dhiraj Gupta.',
};

export default function TestimonialsPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Testimonials</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Don&rsquo;t take <em className="text-brass-deep">our word</em> for it.
          </h1>
        </Reveal>
        <div className="mt-12">
          <TestimonialsGrid />
        </div>
      </section>
    </main>
  );
}
