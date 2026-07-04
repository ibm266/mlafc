'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Location, LocationRole } from '@/data/types';
import {
  INDIA_GEOMETRY,
  MAP_VIEWBOX,
  UK_GEOMETRY,
  projectToMap,
  type MapGeometry,
} from './mapGeometry';

type CountryRegion = 'uk' | 'india';

const ROLE_LABELS = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
} as const satisfies Record<LocationRole, string>;

const ROLE_ORDER: LocationRole[] = ['operated', 'taught', 'proctored'];

const CITY_LABELS: Record<string, string> = {
  liverpool: 'Liverpool',
  'london-imperial': 'London',
  manchester: 'Manchester',
  leeds: 'Leeds',
  birmingham: 'Birmingham',
  mumbai: 'Mumbai',
};

const GEOMETRY: Record<CountryRegion, MapGeometry> = {
  uk: UK_GEOMETRY,
  india: INDIA_GEOMETRY,
};

const COUNTRY_TITLES: Record<CountryRegion, string> = {
  uk: 'Map of the United Kingdom and Ireland',
  india: 'Map of India',
};

/* Pin artwork is a 28x36 shape whose tip is at (14, 36). It is scaled and
   translated so the tip lands exactly on the projected city coordinate. */
const PIN_SCALE = 0.85;
const PIN_W = 28;
const PIN_H = 36;

function cityLabel(location: Location) {
  return CITY_LABELS[location.id] ?? location.name.split(',')[0];
}

function regionForLocation(location: Location): CountryRegion | null {
  if (location.country === 'United Kingdom') return 'uk';
  if (location.country === 'India') return 'india';
  return null;
}

function MapPin({
  location,
  geometry,
  active,
  onSelect,
}: {
  location: Location;
  geometry: MapGeometry;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const { x, y } = projectToMap(geometry.projection, location.lat, location.lng);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${location.name}, ${ROLE_LABELS[location.role]}`}
      className={`mlafc-svg-pin mlafc-pin-${location.role} ${active ? 'mlafc-svg-pin-active' : ''}`}
      onClick={() => onSelect(location.id)}
      onMouseEnter={() => {
        if (window.matchMedia('(hover: hover)').matches) onSelect(location.id);
      }}
      onFocus={() => onSelect(location.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(location.id);
        }
      }}
    >
      {/* generous invisible hit area, always aligned with the map */}
      <circle cx={x} cy={y - 14} r={18} fill="transparent" stroke="none" />
      <g
        transform={`translate(${x - (PIN_W / 2) * PIN_SCALE}, ${y - PIN_H * PIN_SCALE}) scale(${PIN_SCALE})`}
      >
        <path
          className="mlafc-pin-shape"
          d="M14 0C6.3 0 0 6.3 0 14c0 10 14 22 14 22s14-12 14-22C28 6.3 21.7 0 14 0z"
        />
        <circle cx="14" cy="14" r="5" className="fill-night" />
      </g>
      {active ? (
        <text x={x} y={y + 16} textAnchor="middle" className="mlafc-pin-label">
          {cityLabel(location).toUpperCase()}
        </text>
      ) : null}
    </g>
  );
}

export default function LocationsMap({
  locations,
  height = '480px',
}: {
  locations: Location[];
  height?: string;
}) {
  const [country, setCountry] = useState<CountryRegion>('uk');

  const mapLocations = useMemo(
    () => locations.filter((location) => regionForLocation(location) === country),
    [country, locations],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const active =
    mapLocations.find((location) => location.id === activeId) ?? mapLocations[0] ?? null;

  const selectCountry = (next: CountryRegion) => {
    setCountry(next);
    setActiveId(null);
  };

  const geometry = GEOMETRY[country];

  const bubbleBase =
    'interactive cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass';
  const bubbleActive = 'bg-brass text-night shadow-md';
  const bubbleIdle = 'border border-line-dark bg-night-soft text-paper hover:border-brass hover:text-brass';

  return (
    <div>
      {/* Country switch, directly under the section headline */}
      <div className="flex flex-wrap gap-3" role="group" aria-label="Choose country">
        {(
          [
            ['uk', 'United Kingdom'],
            ['india', 'India'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={country === id}
            onClick={() => selectCountry(id)}
            className={`${bubbleBase} min-h-11 ${country === id ? bubbleActive : bubbleIdle}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid items-center gap-10 md:grid-cols-2 md:gap-12">
        {/* Map column */}
        <div key={country} className="mlafc-panel-in mx-auto w-full max-w-sm md:max-w-md">
          <svg
            viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            className="h-auto w-full"
            style={{ maxHeight: height }}
            role="img"
            aria-label={COUNTRY_TITLES[country]}
          >
            {geometry.paths.map((p) => (
              <path key={p.name} d={p.d} className="mlafc-landmass" />
            ))}
            {mapLocations.map((location) => (
              <MapPin
                key={location.id}
                location={location}
                geometry={geometry}
                active={active?.id === location.id}
                onSelect={setActiveId}
              />
            ))}
          </svg>
        </div>

        {/* Info column */}
        <div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={`Cities in ${country === 'uk' ? 'the United Kingdom' : 'India'}`}
          >
            {mapLocations.map((location) => (
              <button
                key={location.id}
                type="button"
                aria-pressed={active?.id === location.id}
                onClick={() => setActiveId(location.id)}
                onMouseEnter={() => {
                  if (window.matchMedia('(hover: hover)').matches) setActiveId(location.id);
                }}
                className={`${bubbleBase} min-h-10 px-4 py-2 text-xs sm:text-sm ${
                  active?.id === location.id
                    ? bubbleActive
                    : 'border border-line-dark/80 bg-paper/10 text-paper hover:border-brass hover:text-brass'
                }`}
              >
                {cityLabel(location)}
              </button>
            ))}
          </div>

          <div
            aria-live="polite"
            className="mt-6 min-h-56 rounded-lg border border-line-dark bg-night-soft p-6 md:p-8"
          >
            {active ? (
              <div key={active.id} className="mlafc-panel-in">
                <p className="text-xs font-semibold uppercase tracking-widest text-brass">
                  {cityLabel(active)}, {active.country}
                </p>
                <p className="mt-2 font-serif text-2xl leading-snug text-paper">{active.name}</p>
                <p className="mt-3 text-sm text-paper/75">
                  <span className="mr-2 inline-block rounded-full bg-brass px-2.5 py-0.5 font-semibold text-night">
                    {ROLE_LABELS[active.role]}
                  </span>
                  {active.years}
                </p>
                <p className="mt-4 leading-relaxed text-paper/85">{active.blurb}</p>
                {active.readMore ? (
                  <Link
                    href={active.readMore}
                    className="interactive mt-4 inline-block font-semibold text-brass hover:underline"
                  >
                    Read more &rarr;
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <ul className="mt-5 flex flex-wrap gap-4 text-xs text-paper/80" aria-label="Location legend">
            {ROLE_ORDER.map((role) => (
              <li key={role} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={`mlafc-legend-dot mlafc-legend-dot-${role} inline-block h-2.5 w-2.5 rounded-full`}
                />
                {ROLE_LABELS[role]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
