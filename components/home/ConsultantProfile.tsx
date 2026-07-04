import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

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
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[2fr_3fr]">
        <Reveal>
          <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-line bg-paper text-sm uppercase tracking-widest text-ink-mute">
            portrait placeholder
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Meet your consultant</p>
            <h2 id="profile-heading" className="mt-3 font-serif text-4xl">
              Professor Dhiraj Gupta
            </h2>
            <p className="mt-1 font-semibold text-ink-soft">MB BS, MD, DM, FRCP (London)</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-ink-soft">
              Professor Gupta has been a consultant at Liverpool Heart and Chest Hospital &mdash; the United
              Kingdom&rsquo;s largest specialist cardiothoracic centre &mdash; since 2007. He is honorary Professor of
              Cardiology at the University of Liverpool, Senior Lecturer at Imperial College London, and a medical
              advisor to the AF Association, the UK&rsquo;s national charity for arrhythmia patients.
            </p>
            <p className="mt-4 text-ink-soft">
              He has earned national repute in the UK for his expertise in treating atrial fibrillation, and proctors
              cardiologists across the United Kingdom, United States and Europe in complex procedures. Consultations
              available in English, Hindi and Punjabi.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.n} delay={i * 70}>
                <p className="text-sm font-semibold text-brass-deep">{c.n}</p>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-ink-mute">{c.sub}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <Link href="/journey" className="mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Follow the journey, 1988 &mdash; 2026 &rarr;
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
