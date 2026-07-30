import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { NightCtaCard } from '@/components/NightCtaCard';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TeamProfile } from '@/components/team/TeamProfile';
import { site } from '@/data/site';
import { teamMembers } from '@/data/team';

export const metadata: Metadata = {
  title: 'Meet the Team - Mumbai London AF Clinic',
  description:
    'Professor Dhiraj Gupta leads every case at the Mumbai London AF Clinic. Dr Darshan Jhala and Dr Malav Jhala, consultant cardiologists at Lilavati Hospital, carry care between his Mumbai visits.',
  alternates: { canonical: '/team' },
};

const DIVISION = [
  {
    title: 'Professor Gupta sees you and operates',
    body: 'Every consultation and every ablation during a Mumbai visit is his own work. The procedure is not delegated to anybody.',
  },
  {
    title: 'The Jhalas hold the weeks in between',
    body: 'Clinic reviews, device checks, monitor downloads, anticoagulation and medication changes, all in Mumbai, without anybody getting on a plane.',
  },
  {
    title: 'One plan, three cardiologists reading it',
    body: 'Your notes, recordings and device data stay in a single thread. Anything that needs a decision about your rhythm goes to Professor Gupta.',
  },
] as const;

const teamLd = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  '@id': `${site.url}#clinic`,
  name: site.name,
  url: `${site.url}/team`,
  employee: [
    {
      '@type': 'Physician',
      name: 'Professor Dhiraj Gupta',
      medicalSpecialty: 'Cardiovascular',
      jobTitle: 'Consultant Cardiologist and Electrophysiologist',
    },
    ...teamMembers.map((member) => ({
      '@type': 'Physician',
      name: member.name,
      medicalSpecialty: 'Cardiovascular',
      jobTitle: member.role,
      url: `${site.url}/team#${member.id}`,
      alumniOf: member.training.map((entry) => ({
        '@type': 'EducationalOrganization',
        name: entry.institution,
      })),
    })),
  ],
};

export default function TeamPage() {
  return (
    <main id="main" className="bg-paper">
      <ScrollProgress />
      <PageHeader
        idPrefix="team"
        eyebrow="The team"
        title={
          <>
            Between visits, <em className="text-brass">somebody is still watching</em>.
          </>
        }
        description="Professor Dhiraj Gupta leads every case and performs every procedure himself. Two Mumbai consultants, a father and son at Lilavati Hospital, carry the clinic between his visits. Here is who they are, and what they have trained in."
      />

      <section aria-labelledby="lead-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              Who leads
            </p>
          </Reveal>

          <div className="mt-6 grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-12">
            <Reveal className="mx-auto w-full max-w-[240px] md:mx-0">
              <figure className="overflow-hidden rounded-xl border border-line bg-paper shadow-[0_12px_28px_rgba(6,15,21,0.08)]">
                <Image
                  src="/images/professor-gupta-profile.png"
                  alt="Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist"
                  width={450}
                  height={360}
                  sizes="(min-width: 768px) 240px, 60vw"
                  priority
                  className="aspect-[5/4] w-full object-cover object-top"
                />
              </figure>
            </Reveal>

            <Reveal delay={90}>
              <h2 id="lead-heading" className="font-serif text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight">
                Professor Dhiraj Gupta
              </h2>
              <p className="mt-2 font-semibold text-brass-deep">MB BS, MD, DM, FRCP (London)</p>
              <p className="mt-1 text-ink-soft">
                Consultant Cardiologist and Electrophysiologist, Liverpool Heart and Chest Hospital
              </p>
              <p className="mt-5 text-ink-soft">
                Consultant since 2007 at the United Kingdom&apos;s largest specialist cardiothoracic centre, honorary
                Professor of Cardiology at the University of Liverpool, and medical advisor to the AF Association. He
                has performed more than 10,000 catheter ablations and proctors cardiologists across the United
                Kingdom, United States and Europe.
              </p>
              <p className="mt-4 text-ink-soft">
                He runs the Mumbai clinic. He takes the consultations, plans the cases, and performs the procedures
                himself during each scheduled visit.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                <Link
                  href="/certifications"
                  className="arrow-link interactive font-semibold text-brass-deep hover:underline"
                >
                  Every qualification, framed &rarr;
                </Link>
                <Link href="/journey" className="arrow-link interactive font-semibold text-brass-deep hover:underline">
                  The journey, 1988 to 2026 &rarr;
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="division-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 id="division-heading" className="font-serif text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              How the care divides.
            </h2>
            <p className="mt-4 max-w-2xl text-ink-soft">
              An ablation is one day. Atrial fibrillation is the years either side of it. The clinic is arranged so
              that both are covered by someone who knows your heart.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {DIVISION.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="h-full">
                <div className="card-lift h-full rounded-lg border border-line bg-white p-6">
                  <span aria-hidden className="font-serif text-2xl leading-none text-brass">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold text-brass-deep">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {teamMembers.map((member, index) => (
        <section
          key={member.id}
          aria-label={member.name}
          className={index % 2 === 0 ? 'bg-paper' : 'border-t border-line bg-paper-soft'}
        >
          <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
            <TeamProfile member={member} />
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-5 py-16">
        <NightCtaCard
          idPrefix="team-cta"
          title={
            <>
              One enquiry reaches <em className="text-brass">all three</em>.
            </>
          }
          description="Tell us about the problem and the clinic team will come back to you. Whether the answer is a procedure with Professor Gupta or a change of plan managed in Mumbai, it starts with the same conversation."
          footnote={site.gmcLine}
        />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamLd) }} />
    </main>
  );
}
