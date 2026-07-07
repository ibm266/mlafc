import type { Metadata } from 'next';
import { ConditionSection } from '@/components/conditions/ConditionSection';
import { CtaBand } from '@/components/CtaBand';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { conditions } from '@/data/conditions';
import { site } from '@/data/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions We Treat - Mumbai London AF Clinic',
  description:
    'Plain-language guides to heart rhythm conditions Professor Dhiraj Gupta treats, starting with atrial fibrillation.',
};

export default function ConditionsPage() {
  return (
    <main id="main">
      <ScrollProgress />
      <PageHeader
        idPrefix="conditions"
        eyebrow="Conditions we treat"
        title={
          <>
            Your heart, explained in <em className="text-brass">plain language</em>.
          </>
        }
        description="Put your heart in the most experienced hands. These are general guides, not a diagnosis."
      />

      {conditions.map((condition, index) => (
        <ConditionSection key={condition.id} condition={condition} index={index} />
      ))}

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <Reveal>
            <p className="font-serif text-2xl">Every heart is different.</p>
            <p className="mt-4 text-ink-soft">
              If something here sounds familiar, book a consultation. Professor Gupta will review your history and
              explain what is happening in plain language, in English, Hindi, or Punjabi.
            </p>
            <Link
              href="/book"
              className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper hover:bg-night"
            >
              Book a consultation
            </Link>
          </Reveal>
          <p className="mt-10 text-xs text-ink-mute">{site.disclaimer}</p>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
