import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { PublicationsGrid } from '@/components/PublicationsGrid';

export const metadata: Metadata = {
  title: 'Publications - Mumbai London AF Clinic',
  description:
    'Peer-reviewed research on atrial fibrillation ablation, left atrial appendage occlusion, and arrhythmia outcomes by Professor Dhiraj Gupta.',
};

export default function PublicationsPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Publications</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Published in the journals that <em className="text-brass-deep">shape AF care</em>.
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft">
            A selection of peer-reviewed work on catheter ablation, stroke prevention, and outcomes in atrial
            fibrillation, from the operator who wrote them.
          </p>
        </Reveal>
        <div className="mt-12">
          <PublicationsGrid />
        </div>
      </section>
    </main>
  );
}
