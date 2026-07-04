import type { Metadata } from 'next';
import Link from 'next/link';
import { ConditionSection } from '@/components/conditions/ConditionSection';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { conditions } from '@/data/conditions';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Conditions We Treat - Mumbai London AF Clinic',
  description:
    'Plain-language guides to heart rhythm conditions Professor Dhiraj Gupta treats, starting with atrial fibrillation.',
};

export default function ConditionsPage() {
  return (
    <main id="main">
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
              Conditions we treat
            </p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
              Your heart, explained in <em className="text-brass-deep">plain language</em>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg text-ink-soft">
              Put your heart in the most experienced hands.
            </p>
            <p className="mt-4 text-ink-soft">
              These are general guides, not a diagnosis. Professor Gupta will explain your own
              situation at an unhurried consultation.
            </p>
          </Reveal>
        </div>
      </section>

      {conditions.map((condition, index) => (
        <ConditionSection key={condition.id} condition={condition} index={index} />
      ))}

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <Reveal>
            <p className="font-serif text-2xl">Every heart is different.</p>
            <p className="mt-4 text-ink-soft">
              If something here sounds familiar, book a consultation. Professor Gupta will review
              your history and explain what is happening in plain language, in English, Hindi, or
              Punjabi.
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
