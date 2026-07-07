'use client';

import dynamic from 'next/dynamic';

export const LocationsMapLazy = dynamic(() => import('./LocationsMap'), {
  ssr: false,
  loading: () => (
    <div aria-busy="true" aria-label="Loading locations map">
      <div className="h-11 rounded-full bg-night-soft/80" />
      <div className="mt-6 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="h-[clamp(320px,48vh,460px)] rounded-xl bg-night-soft text-paper/60 flex items-center justify-center">
          Loading map...
        </div>
        <div className="h-[clamp(320px,48vh,460px)] rounded-xl bg-night-soft/60" />
      </div>
    </div>
  ),
});
