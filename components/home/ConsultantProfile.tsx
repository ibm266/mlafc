import Link from 'next/link';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { InterviewVideoSection } from '@/components/home/InterviewVideoSection';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import type { SiteLinks } from '@/data/types';

const links = linksJson as SiteLinks;

export function ConsultantProfile() {
  return (
    <section aria-labelledby="profile-heading" className="bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <ChapterEyebrow chapter="01" label="Meet your consultant" />
        </Reveal>
        <Reveal delay={80}>
          <h2 id="profile-heading" className="mt-3 font-serif text-4xl">
            Professor Dhiraj Gupta
          </h2>
          <p className="mt-1 font-semibold text-ink-soft">MB BS, MD, DM, FRCP (London)</p>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-3xl text-ink-soft">
            Professor Gupta has been a consultant at Liverpool Heart and Chest Hospital, the United Kingdom&apos;s
            largest specialist cardiothoracic centre, since 2007. He is honorary Professor of Cardiology at the
            University of Liverpool, Senior Lecturer at Imperial College London, and a medical advisor to the AF
            Association, the UK&apos;s national charity for arrhythmia patients.
          </p>
          <p className="mt-4 max-w-3xl text-ink-soft">
            He has earned national repute in the UK for his expertise in treating atrial fibrillation, and proctors
            cardiologists across the United Kingdom, United States and Europe in complex procedures. Consultations
            are available in English, Hindi and Punjabi. See an introductory video below from Lilavati Hospital in
            Mumbai.
          </p>
          <Link href="/journey" className="arrow-link interactive mt-5 inline-block font-semibold text-brass-deep hover:underline">
            Follow the journey, 1988 to 2026 &rarr;
          </Link>
        </Reveal>

        <InterviewVideoSection interview={links.interview} />
      </div>
    </section>
  );
}
