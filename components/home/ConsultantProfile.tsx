import Link from 'next/link';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { Reveal } from '@/components/Reveal';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';

const CREDENTIALS = [
  { n: 'i.', title: 'NHS National Silver Clinical Excellence Award', sub: 'Awarded 2021. Earlier Bronze in 2017.' },
  {
    n: 'ii.',
    title: 'Arrhythmia Alliance Excellence in Practice Award',
    sub: 'Outstanding contribution to UK arrhythmia services',
  },
  {
    n: 'iii.',
    title: 'Chief Investigator, multi-centre AF trials',
    sub: 'PRESSURE · SMAAN-PAF · PRAISE · VISTAX · CRAFT',
  },
  { n: 'iv.', title: 'Author, British Heart Foundation AF booklet', sub: 'National patient education resource' },
];

export function ConsultantProfile() {
  return (
    <section aria-labelledby="profile-heading" className="bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <ChapterEyebrow chapter="03" label="Meet your consultant" />
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
            available in English, Hindi and Punjabi.
          </p>
        </Reveal>
        <Reveal delay={180} className="mt-10 max-w-3xl">
          <h3 className="font-serif text-2xl">Hear him explain heart health in plain language.</h3>
          <p className="mt-3 text-ink-soft">
            Professor Gupta on the Lilavati Hospital podcast series, discussing atrial fibrillation, ablation, and what
            patients should know before choosing a procedure.
          </p>
          <div className="mt-6">
            <YouTubeEmbed
              videoId="juKnv3sN2wM"
              title="Everything About Heart Health | Lilavati Hospital Podcast Series"
            />
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {CREDENTIALS.map((c, i) => (
            <Reveal key={c.n} delay={160 + i * 70} className="border-t border-line pt-5">
              <p className="text-sm font-semibold text-brass-deep">{c.n}</p>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-ink-mute">{c.sub}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300}>
          <Link href="/journey" className="arrow-link interactive mt-8 inline-block font-semibold text-brass-deep hover:underline">
            Follow the journey, 1988 to 2026 &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
