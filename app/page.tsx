import Link from 'next/link';
import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { OperatorTrace } from '@/components/home/OperatorTrace';
import { StatsBand } from '@/components/StatsBand';
import { ConsultantProfile } from '@/components/home/ConsultantProfile';
import { TopDoctorsRating } from '@/components/home/TopDoctorsRating';
import { Steps } from '@/components/Steps';
import { TestimonialCard } from '@/components/TestimonialCard';
import { PublicationCard } from '@/components/PublicationCard';
import { VisitDates } from '@/components/VisitDates';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { FloatingBookingPill } from '@/components/FloatingBookingPill';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { HorizontalCardGallery } from '@/components/HorizontalCardGallery';
import { LocationsMapLazy } from '@/components/map/LocationsMapLazy';
import testimonialsJson from '@/data/testimonials.json';
import publicationsJson from '@/data/publications.json';
import locationsJson from '@/data/locations.json';
import linksJson from '@/data/links.json';
import visitsJson from '@/data/visits.json';
import { conditions } from '@/data/conditions';
import type { Location, Publication, SiteLinks, Testimonial, Visit } from '@/data/types';

export const metadata: Metadata = {
  title: 'AF Ablation in Mumbai | London Consultant Electrophysiologist',
  description:
    'Expert atrial fibrillation care in Mumbai from Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital. Book a consultation.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AF Ablation in Mumbai | Mumbai London AF Clinic',
    description:
      'London-level AF ablation expertise in Mumbai. Professor Dhiraj Gupta offers RFA and PFA with continuous local follow-up.',
    url: '/',
  },
};

const testimonials = testimonialsJson as Testimonial[];
const publications = publicationsJson as Publication[];
const locations = locationsJson as Location[];
const visits = visitsJson as Visit[];
const links = linksJson as SiteLinks;

const CONDITION_LINKS = conditions.map((c) => ({ id: c.id, title: c.title }));
const PROCEDURES = [
  'Catheter ablation for atrial fibrillation',
  'Ablation for SVT and other arrhythmias',
  'Left atrial appendage occlusion (LAAO)',
  'Pacemaker implantation',
  'Implantable defibrillators (ICDs)',
  'Cardiac resynchronisation therapy',
];

export default function Home() {
  const hospitalLetter = testimonials.find((t) => t.id === 'hosp1');
  const patientPeer = ['pat1', 'pat2', 'peer1', 'peer2']
    .map((id) => testimonials.find((t) => t.id === id))
    .filter(Boolean) as Testimonial[];
  const topDoctorsProfile = links.profiles.find((p) => p.label === 'Top Doctors');

  const publicationTeasers = publications.filter((p) => p.featured);

  return (
    <main id="main">
      <ScrollProgress />
      <FloatingBookingPill />
      <Hero />
      <OperatorTrace />
      <StatsBand />
      <ConsultantProfile />

      <section aria-labelledby="services-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="02" label="Conditions &amp; treatments" />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="services-heading" className="mt-3 font-serif text-4xl">
              What we look after.
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">Put your heart in the most experienced hands.</p>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-semibold text-brass-deep">Conditions we treat</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {CONDITION_LINKS.map((c) => (
                  <li key={c.id} className="border-b border-line pb-2">
                    <Link href={`/conditions#${c.id}`} className="hover:text-ink hover:underline">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={90}>
              <h3 className="font-semibold text-brass-deep">Procedures offered</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {PROCEDURES.map((p) => (
                  <li key={p} className="border-b border-line pb-2">
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <Link href="/conditions" className="arrow-link interactive mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Understand each condition &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="03" label="How the Mumbai clinic works" />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="how-heading" className="mt-3 font-serif text-4xl">
              London expertise. Mumbai care. Continuous follow-up.
            </h2>
          </Reveal>
          <div className="mt-12">
            <Steps />
          </div>
          <Reveal delay={120}>
            <Link href="/book" className="arrow-link interactive mt-10 inline-block font-semibold text-brass-deep hover:underline">
              Book a consultation &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="map-heading" className="bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="04" label="Where he works" dark />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="map-heading" className="mt-3 max-w-xl font-serif text-4xl leading-tight">
              Trusted by heart centres <em className="text-brass">across three continents</em>.
            </h2>
            <p className="mt-3 max-w-xl text-paper/80">
              Where Professor Gupta has operated, taught, and proctored fellow consultants.
            </p>
          </Reveal>
          <div className="mt-10">
            <LocationsMapLazy locations={locations} />
          </div>
        </div>
      </section>

      <section aria-label="In their words" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="05" label="In their words" />
          </Reveal>
          {hospitalLetter ? (
            <Reveal delay={80}>
              <blockquote className="mt-9 max-w-4xl">
                <p className="font-serif text-[clamp(1.5rem,2.9vw,2.2rem)] leading-snug text-ink">
                  &ldquo;{hospitalLetter.quote}&rdquo;
                </p>
                <footer className="mt-5 flex items-center gap-3.5 text-sm text-ink-soft">
                  <span aria-hidden className="inline-block h-0.5 w-9 bg-brass" />
                  <span>
                    <strong className="text-ink">{hospitalLetter.attribution}</strong>
                    {hospitalLetter.detail ? ` · ${hospitalLetter.detail}` : ''}
                    {hospitalLetter.letter?.date ? ` · ${hospitalLetter.letter.date}` : ''}
                  </span>
                </footer>
              </blockquote>
            </Reveal>
          ) : null}
          <div className="md:hidden">
            <HorizontalCardGallery ariaLabel="Patient and peer testimonials">
              {patientPeer.map((t) => (
                <div key={t.id} className="card-lift h-full">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </HorizontalCardGallery>
          </div>
          <div className="mt-10 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
            {patientPeer.map((t) => (
              <div key={t.id} className="card-lift h-full min-w-0">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
          <Reveal delay={120}>
            <Link href="/testimonials" className="arrow-link interactive mt-8 inline-block font-semibold text-brass-deep hover:underline">
              More voices: hospitals, patients, peers, and the press &rarr;
            </Link>
          </Reveal>
          {topDoctorsProfile?.url ? <TopDoctorsRating url={topDoctorsProfile.url} /> : null}
        </div>
      </section>

      <section aria-labelledby="publications-heading" className="bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="06" label="Research" />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="publications-heading" className="mt-3 font-serif text-4xl">
              Published evidence.
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">
              Peer-reviewed work on AF ablation, stroke prevention, and outcomes, from the journals that set the
              standard.
            </p>
          </Reveal>
          <div className="md:hidden">
            <HorizontalCardGallery ariaLabel="Published evidence highlights" itemsPerPage={1}>
              {publicationTeasers.map((p) => (
                <div key={p.id} className="h-full">
                  <PublicationCard p={p} />
                </div>
              ))}
            </HorizontalCardGallery>
          </div>
          <div className="mt-10 hidden gap-5 md:grid md:grid-cols-3">
            {publicationTeasers.map((p) => (
              <div key={p.id} className="h-full">
                <PublicationCard p={p} />
              </div>
            ))}
          </div>
          <Reveal delay={200}>
            <Link href="/evidence#publications" className="arrow-link interactive mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Browse all publications &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="visits-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Reveal>
            <ChapterEyebrow chapter="07" label="Plan ahead" />
          </Reveal>
          <Reveal delay={80}>
            <h2 id="visits-heading" className="mt-3 font-serif text-4xl">
              Upcoming Mumbai visits.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">Limited slots. Plan ahead.</p>
          </Reveal>
          <div className="mt-10">
            <VisitDates visits={visits} />
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
