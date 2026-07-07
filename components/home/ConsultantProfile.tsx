import Image from 'next/image';
import Link from 'next/link';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { InterviewVideoSection } from '@/components/home/InterviewVideoSection';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import type { SiteLinks } from '@/data/types';

const links = linksJson as SiteLinks;

function ConsultantPortrait() {
  return (
    <figure className="h-full min-h-[280px] overflow-hidden rounded-xl border border-line bg-paper shadow-[0_12px_28px_rgba(6,15,21,0.08)]">
      <Image
        src="/images/professor-gupta-profile.png"
        alt="Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist"
        width={450}
        height={360}
        className="h-full w-full object-cover object-top"
      />
    </figure>
  );
}

export function ConsultantProfile() {
  return (
    <section aria-labelledby="profile-heading" className="bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <ChapterEyebrow chapter="01" label="Meet your consultant" />
        </Reveal>

        <div className="mt-3 grid items-stretch gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <Reveal delay={80}>
              <h2 id="profile-heading" className="font-serif text-4xl">
                Professor Dhiraj Gupta
              </h2>
              <p className="mt-1 font-semibold text-ink-soft">MB BS, MD, DM, FRCP (London)</p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 text-ink-soft">
                Professor Gupta has been a consultant at Liverpool Heart and Chest Hospital, the United Kingdom&apos;s
                largest specialist cardiothoracic centre, since 2007. He is honorary Professor of Cardiology at the
                University of Liverpool, Senior Lecturer at Imperial College London, and a medical advisor to the AF
                Association, the UK&apos;s national charity for arrhythmia patients.
              </p>
              <p className="mt-4 text-ink-soft">
                He has earned national repute in the UK for his expertise in treating atrial fibrillation, and proctors
                cardiologists across the United Kingdom, United States and Europe in complex procedures. Consultations
                are available in English, Hindi and Punjabi. See an introductory video below from Lilavati Hospital in
                Mumbai.
              </p>
              <Link
                href="/journey"
                className="arrow-link interactive mt-5 inline-block font-semibold text-brass-deep hover:underline"
              >
                Follow the journey, 1988 to 2026 &rarr;
              </Link>
            </Reveal>
          </div>

          <Reveal delay={160} className="h-full md:justify-self-end">
            <ConsultantPortrait />
          </Reveal>
        </div>

        <InterviewVideoSection interview={links.interview} />
      </div>
    </section>
  );
}
