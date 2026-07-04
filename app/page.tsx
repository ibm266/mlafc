import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { StatsBand } from '@/components/StatsBand';
import { ComparisonCards } from '@/components/home/ComparisonCards';
import { ConsultantProfile } from '@/components/home/ConsultantProfile';
import { Steps } from '@/components/Steps';
import { TestimonialCard } from '@/components/TestimonialCard';
import { VisitDates } from '@/components/VisitDates';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { LocationsMapLazy } from '@/components/map/LocationsMapLazy';
import testimonialsJson from '@/data/testimonials.json';
import locationsJson from '@/data/locations.json';
import visitsJson from '@/data/visits.json';
import type { Location, Testimonial, Visit } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];
const locations = locationsJson as Location[];
const visits = visitsJson as Visit[];

const CONDITIONS = [
  'Atrial fibrillation (AF)',
  'Atrial flutter',
  'Supraventricular tachycardia (SVT)',
  'Palpitations & unexplained heart racing',
  'Unexplained blackouts & dizziness',
  'Bradycardia (slow heart rhythms)',
];
const PROCEDURES = [
  'Catheter ablation for atrial fibrillation',
  'Ablation for SVT and other arrhythmias',
  'Left atrial appendage occlusion (LAAO)',
  'Pacemaker implantation',
  'Implantable defibrillators (ICDs)',
  'Cardiac resynchronisation therapy',
];

export default function Home() {
  const teasers = ['pat1', 'peer1', 'hosp1']
    .map((id) => testimonials.find((t) => t.id === id))
    .filter(Boolean) as Testimonial[];

  return (
    <main id="main">
      <ScrollProgress />
      <Hero />
      <StatsBand />
      <ComparisonCards />
      <ConsultantProfile />

      {/* Map teaser - second and final night section */}
      <section aria-labelledby="map-heading" className="bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="map-heading" className="max-w-xl font-serif text-4xl leading-tight">
              Trusted in theatres across <em className="text-brass">two continents</em>.
            </h2>
          </Reveal>
          <div className="mt-10">
            <LocationsMapLazy locations={locations} />
          </div>
          <Reveal delay={120}>
            <Link href="/locations" className="interactive mt-6 inline-block font-semibold text-brass hover:underline">
              Explore every location &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
              How the Mumbai clinic works
            </p>
            <h2 id="how-heading" className="mt-3 font-serif text-4xl">
              London expertise. Mumbai care. Continuous follow-up.
            </h2>
          </Reveal>
          <div className="mt-12">
            <Steps />
          </div>
        </div>
      </section>

      <section aria-labelledby="services-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="services-heading" className="font-serif text-4xl">
              What we look after.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-semibold text-brass-deep">Conditions we treat</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {CONDITIONS.map((c) => (
                  <li key={c} className="border-b border-line pb-2">
                    {c}
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
        </div>
      </section>

      <section aria-labelledby="testimonials-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="testimonials-heading" className="font-serif text-4xl">
              In their words.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {teasers.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link href="/testimonials" className="interactive mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Read all 24 testimonials &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="visits-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="visits-heading" className="font-serif text-4xl">
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
