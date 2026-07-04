import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand } from '@/components/CtaBand';
import { EvidenceChart } from '@/components/EvidenceChart';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Reveal } from '@/components/Reveal';
import { citations } from '@/data/citations';
import { faqs } from '@/data/faqs';

export const metadata: Metadata = {
  title: 'The Evidence - Mumbai London AF Clinic',
  description:
    'What published research says about PFA, RFA, and why the experience of the operator matters - in plain English, with citations.',
};

export default function EvidencePage() {
  return (
    <main id="main">
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
              The evidence
            </p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
              Whatever the machine, it is safer in{' '}
              <em className="text-brass-deep">experienced hands</em>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-lg text-ink-soft">
              You may have been offered PFA - pulsed field ablation - because it is a newer
              way to treat atrial fibrillation. RFA - radiofrequency ablation - uses carefully
              controlled heat; PFA uses short electrical pulses instead. Both treat the same
              small areas of heart tissue that trigger AF.
            </p>
            <p className="mt-4 text-lg text-ink-soft">
              In 2025, large trials directly comparing the two reported their results:
              PFA and RFA performed broadly comparably; the right choice depends on the patient.
              <sup>
                <a href="#ref-1">1</a>
              </sup>
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="volume-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <h2 id="volume-heading" className="font-serif text-3xl">
              The number that does change your outcome.
            </h2>
            <p className="mt-4 text-ink-soft">
              Across published studies, one factor shows up again and again: how often the
              centre - and the doctor - performs the procedure.
              <sup>
                <a href="#ref-2">2</a>
              </sup>
            </p>
          </Reveal>
          <div className="mt-12">
            <EvidenceChart />
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <h2 className="font-serif text-3xl">What this means for you.</h2>
            <p className="mt-4 text-ink-soft">
              The right question is not &ldquo;which technology?&rdquo; It is &ldquo;who is
              holding the catheter?&rdquo; Professor Gupta offers both RFA and PFA, and
              chooses the right tool for each patient.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-14 font-serif text-3xl">His numbers, in context.</h2>
            <ul className="mt-5 space-y-3 text-ink-soft">
              <li>
                200+ ablations a year, every year since 2009 - a high-volume UK operator.
                <sup>
                  <a href="#ref-3">3</a>
                </sup>
              </li>
              <li>
                A published complication rate below 1%.
                <sup>
                  <a href="#ref-3">3</a>
                </sup>
              </li>
              <li>More than 5,000 procedures across his career.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <h2 id="faq-heading" className="font-serif text-3xl">
              Your questions, plainly answered.
            </h2>
          </Reveal>
          <div className="mt-10">
            <FaqAccordion faqs={faqs} />
          </div>
          <Reveal delay={100}>
            <Link
              href="/book"
              className="mt-12 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper hover:bg-night"
            >
              Book a consultation
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="references" aria-labelledby="ref-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-14">
          <h2 id="ref-heading" className="font-serif text-2xl">
            References
          </h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
            {citations.map((c) => (
              <li key={c.id} id={`ref-${c.id}`}>
                {c.text}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
