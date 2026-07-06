'use client';

import { useMemo, useState } from 'react';
import { PublicationCard } from '@/components/PublicationCard';
import publicationsJson from '@/data/publications.json';
import type { Publication } from '@/data/types';

const publications = publicationsJson as Publication[];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'original', label: 'Original research' },
  { id: 'review', label: 'Reviews' },
  { id: 'trial', label: 'Clinical trials' },
  { id: 'guideline', label: 'Guidelines' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export function PublicationsGrid() {
  const [filter, setFilter] = useState<FilterId>('all');

  const shown = useMemo(
    () => (filter === 'all' ? publications : publications.filter((p) => p.category === filter)),
    [filter],
  );

  const countFor = (id: FilterId) =>
    id === 'all' ? publications.length : publications.filter((p) => p.category === id).length;

  return (
    <div>
      <div role="group" aria-label="Filter publications" className="flex flex-wrap gap-3">
        {FILTERS.map((filterOption) => (
          <button
            key={filterOption.id}
            type="button"
            aria-pressed={filter === filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`interactive rounded-full border px-4 py-2 text-sm font-semibold ${
              filter === filterOption.id
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-ink-soft hover:border-ink-soft'
            }`}
          >
            {filterOption.label} <span className="opacity-70">{countFor(filterOption.id)}</span>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-ink-soft" aria-live="polite">
        {`${shown.length} publications shown`}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((publication) => (
          <PublicationCard key={publication.id} p={publication} />
        ))}
      </div>

      {shown.length === 0 && <p className="mt-10 text-ink-mute">No publications in this category yet.</p>}
    </div>
  );
}
