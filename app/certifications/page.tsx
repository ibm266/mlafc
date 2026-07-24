import type { Metadata } from 'next';
import { CertificateWall } from '@/components/certifications/CertificateWall';
import { NightCtaCard } from '@/components/NightCtaCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { certifications } from '@/data/certifications';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Certifications - Mumbai London AF Clinic',
  description:
    'The degrees, fellowships and awards of Professor Dhiraj Gupta, from medical school in India to fellowship of the Royal College of Physicians and the European Society of Cardiology.',
};

const credentialLd = {
  '@context': 'https://schema.org',
  '@type': 'Physician',
  '@id': `${site.url}#physician`,
  name: 'Professor Dhiraj Gupta',
  url: `${site.url}/certifications`,
  hasCredential: certifications.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.title,
    credentialCategory: c.category === 'recognition' ? 'award' : 'degree or certification',
    dateCreated: c.year,
    recognizedBy: { '@type': 'Organization', name: c.awardingBody },
  })),
};

export default function CertificationsPage() {
  return (
    <main id="main" className="bg-paper">
      <PageHeader
        idPrefix="certifications"
        eyebrow="The record · 1994 to 2022"
        title="Every letter after the name, earned."
        description="Degrees, fellowships and awards, in the order they were conferred. Click any frame to read the story behind it."
      />

      <section aria-label="Certificate wall" className="bg-night pb-24 pt-10 text-paper md:pb-28 md:pt-14">
        <div className="mx-auto max-w-6xl px-5">
          <CertificateWall />
        </div>
      </section>

      <section aria-labelledby="catalogue-heading" className="mx-auto max-w-4xl px-5 py-20">
        <Reveal>
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
            The full record
          </p>
          <h2 id="catalogue-heading" className="mt-3 font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-ink">
            Qualifications, in full.
          </h2>
        </Reveal>
        <ul className="mt-8">
          {certifications.map((c) => (
            <li
              key={c.id}
              className="flex items-baseline justify-between gap-6 border-t border-line py-4 last:border-b"
            >
              <div>
                <p className="font-serif text-lg leading-snug text-ink">{c.title}</p>
                <p className="mt-0.5 text-sm text-ink-mute">
                  {c.awardingBody}
                  {c.location ? `, ${c.location}` : ''}
                </p>
              </div>
              <p className="shrink-0 font-semibold text-brass-deep">{c.year}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <NightCtaCard
          idPrefix="certifications-cta"
          title={
            <>
              A record you can <em className="text-brass">verify</em>.
            </>
          }
          description="Professor Gupta's UK registration and specialist training are on the public GMC register. The same standard of care now runs at the Mumbai London AF Clinic."
          footnote={site.gmcLine}
        />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialLd) }}
      />
    </main>
  );
}
