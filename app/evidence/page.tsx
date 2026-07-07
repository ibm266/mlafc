import type { Metadata } from 'next';
import { CountUp } from '@/components/CountUp';
import { EvidenceChart } from '@/components/EvidenceChart';
import { FaqConversation } from '@/components/FaqConversation';
import { FloatingBookingPill } from '@/components/FloatingBookingPill';
import { NightCtaCard } from '@/components/NightCtaCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { PublicationsList } from '@/components/PublicationsList';
import { citations } from '@/data/citations';
import { faqs } from '@/data/faqs';
import publicationsJson from '@/data/publications.json';
import type { Publication } from '@/data/types';

const publications = publicationsJson as Publication[];

export const metadata: Metadata = {
  title: 'The Evidence - Mumbai London AF Clinic',
  description:
    'What published research says about PFA, RFA, and why the experience of the operator matters, in plain English, with citations.',
};

export default function EvidencePage() {
  return (
    <main id="main">
      <ScrollProgress />
      <FloatingBookingPill />
      <PageHeader
        idPrefix="evidence"
        eyebrow="The evidence"
        title={
          <>
            Whatever the machine, it is safer in <em className="text-brass">experienced hands</em>.
          </>
        }
        description="What published research says about PFA, RFA, and the doctor holding the catheter. In plain English, with citations."
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20 md:max-w-[768px]">
          <Reveal>
            <p className="text-lg text-ink-soft">
              You may have been offered PFA, pulsed field ablation, because it is a newer way to treat atrial
              fibrillation. RFA, radiofrequency ablation, uses carefully controlled heat; PFA uses short electrical
              pulses instead. Both treat the same small areas of heart tissue that trigger AF.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-4 text-lg text-ink-soft">
              In 2025, large trials directly comparing the two reported their results: PFA and RFA performed broadly
              comparably; the right choice depends on the patient.
              <sup>
                <a href="#ref-1">1</a>
              </sup>
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="volume-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-20 md:max-w-[768px]">
          <Reveal>
            <ChapterEyebrow label="The volume effect" />
          </Reveal>
          <Reveal delay={60}>
            <h2 id="volume-heading" className="mt-3 font-serif text-3xl md:text-4xl">
              The number that does change your outcome.
            </h2>
            <p className="mt-4 text-ink-soft">
              Across published studies, one factor shows up again and again: how often the centre, and the doctor,
              performs the procedure.
              <sup>
                <a href="#ref-2">2</a>
              </sup>
            </p>
          </Reveal>
          <div className="mt-12">
            <EvidenceChart />
          </div>
          <Reveal>
            <p className="mx-auto mt-9 max-w-xl text-center font-serif text-xl italic text-ink">
              Professor Gupta has performed over 200 a year, every year since 2009.
              <sup>
                <a href="#ref-3" className="not-italic">3</a>
              </sup>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20 md:max-w-[768px]">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl">What this means for you.</h2>
            <p className="mt-4 text-ink-soft">
              The right question is not &ldquo;which technology?&rdquo; It is &ldquo;who is holding the
              catheter?&rdquo; Professor Gupta offers both RFA and PFA, and chooses the right tool for each patient.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-14 font-serif text-3xl md:text-4xl">His numbers, in context.</h2>
            <div className="mt-8 grid gap-0 sm:grid-cols-3">
              <div className="border-line sm:border-r sm:pr-6">
                <div className="font-serif text-4xl text-ink">
                  <CountUp to={200} suffix="+" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  ablations a year, every year since 2009
                  <sup>
                    <a href="#ref-3">3</a>
                  </sup>
                </p>
              </div>
              <div className="mt-6 border-line sm:mt-0 sm:border-r sm:px-6">
                <div className="font-serif text-4xl text-ink">
                  <CountUp to={1} prefix="<" suffix="%" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  published complication rate
                  <sup>
                    <a href="#ref-3">3</a>
                  </sup>
                </p>
              </div>
              <div className="mt-6 sm:mt-0 sm:pl-6">
                <div className="font-serif text-4xl text-ink">
                  <CountUp to={10000} suffix="+" />
                </div>
                <p className="mt-2 text-sm text-ink-soft">procedures across his career</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="publications" aria-labelledby="publications-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-20 md:max-w-[768px]">
          <Reveal>
            <ChapterEyebrow label="Selected publications" />
          </Reveal>
          <Reveal delay={60}>
            <h2 id="publications-heading" className="mt-3 font-serif text-3xl md:text-4xl">
              The work behind the numbers.
            </h2>
            <p className="mt-4 text-ink-soft">
              Peer-reviewed work on AF ablation, stroke prevention, and outcomes, from the journals that set the
              standard of care.
            </p>
          </Reveal>
          <PublicationsList publications={publications} />
          <Reveal>
            <p className="mt-7 text-sm text-ink-mute">
              Nine of more than 350 peer-reviewed publications, cited over 13,000 times.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20 md:max-w-[768px]">
          <Reveal>
            <ChapterEyebrow label="Common questions" />
          </Reveal>
          <Reveal delay={60}>
            <h2 id="faq-heading" className="mt-3 font-serif text-3xl md:text-4xl">
              Your questions, plainly answered.
            </h2>
          </Reveal>
          <FaqConversation faqs={faqs} />
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-20">
          <NightCtaCard
            idPrefix="evidence-cta"
            title={
              <>
                Convinced by the evidence? <em className="text-brass">Ask the questions that matter to you.</em>
              </>
            }
            description="A short enquiry costs nothing, and every one is answered."
            footnote="Next Mumbai visit: March 2026 · Booking open"
          />
        </div>
      </section>

      <section id="references" aria-labelledby="ref-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-14 md:max-w-[768px]">
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
    </main>
  );
}
