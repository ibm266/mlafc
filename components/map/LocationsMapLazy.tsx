'use client';

import dynamic from 'next/dynamic';

export const LocationsMapLazy = dynamic(() => import('./LocationsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-lg bg-night-soft text-paper/60">
      Loading map...
    </div>
  ),
});
