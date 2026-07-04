import type { Location } from '@/data/types';

const ROLE_LABELS = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
} as const satisfies Record<Location['role'], string>;

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function LocationList({ locations }: { locations: Location[] }) {
  const countries = [...new Set(locations.map((location) => location.country))];

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {countries.map((country) => (
        <section key={country} aria-labelledby={`country-${slug(country)}`}>
          <h3 id={`country-${slug(country)}`} className="font-serif text-2xl">
            {country}
          </h3>
          <ul className="mt-4 space-y-4 border-l border-line pl-5">
            {locations
              .filter((location) => location.country === country)
              .map((location) => (
                <li key={location.id}>
                  <p className="font-semibold text-ink">
                    {location.name}{' '}
                    <span className="ml-1 rounded-full bg-paper-soft px-2.5 py-0.5 text-xs font-semibold text-brass-deep">
                      {ROLE_LABELS[location.role]}
                    </span>
                  </p>
                  <p className="text-sm text-ink-mute">{location.years}</p>
                  <p className="mt-1 text-sm text-ink-soft">{location.blurb}</p>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
