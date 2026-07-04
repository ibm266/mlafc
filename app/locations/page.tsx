import type { Metadata } from 'next';
import { LocationList } from '@/components/LocationList';
import { LocationsMapLazy } from '@/components/map/LocationsMapLazy';
import { Reveal } from '@/components/Reveal';
import locationsJson from '@/data/locations.json';
import type { Location } from '@/data/types';

const locations = locationsJson as Location[];

export const metadata: Metadata = {
  title: 'Where He Works - Mumbai London AF Clinic',
  description:
    'Hospitals across the UK, Europe, the US and India where Professor Dhiraj Gupta has operated, taught and proctored.',
};

export default function LocationsPage() {
  return (
    <main id="main">
      <section className="bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">
              Where he works
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
              Trusted in theatres across <em className="text-brass">two continents</em>.
            </h1>
          </Reveal>
          <div className="mt-10">
            <LocationsMapLazy locations={locations} height="560px" />
          </div>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="mb-8 font-serif text-3xl">Every location, in plain text</h2>
          <LocationList locations={locations} />
        </div>
      </section>
    </main>
  );
}
