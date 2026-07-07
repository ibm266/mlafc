'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Location, LocationRole, MapRegion } from '@/data/types';
import { LinkNeededFlag } from '@/components/LinkNeededFlag';
import {
  MAP_REGIONS,
  countryBounds,
  countryStyle,
  countriesGeoJson,
  markerStyle,
  type WorldAtlas,
} from './mapHelpers';
import 'leaflet/dist/leaflet.css';

const ROLE_LABELS: Record<LocationRole, string> = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
};

const ROLE_BADGE: Record<LocationRole, string> = {
  operated: 'rounded-full bg-brass px-2.5 py-0.5 text-[0.72rem] font-semibold text-night',
  taught: 'rounded-full border-[1.5px] border-brass-bright px-2.5 py-0.5 text-[0.72rem] font-semibold text-brass-bright',
  proctored: 'rounded-full border-[1.5px] border-ink-mute px-2.5 py-0.5 text-[0.72rem] font-semibold text-ink-mute',
};

type MarkerMap = Record<string, L.CircleMarker>;

export default function LocationsMap({ locations }: { locations: Location[] }) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<{
    map: L.Map;
    markers: MarkerMap;
    countries: L.GeoJSON | null;
    L: typeof import('leaflet');
  } | null>(null);

  const [region, setRegion] = useState<MapRegion>('All');
  const [activeId, setActiveId] = useState<string | null>(locations[0]?.id ?? null);
  const [ready, setReady] = useState(false);

  const visibleLocations = useMemo(
    () => (region === 'All' ? locations : locations.filter((l) => l.region === region)),
    [locations, region],
  );

  const active = locations.find((l) => l.id === activeId) ?? visibleLocations[0] ?? null;

  const styleLabels = useCallback(
    (nextRegion: MapRegion, nextActiveId: string | null) => {
      const store = storeRef.current;
      if (!store) return;
      const { markers } = store;

      Object.entries(markers).forEach(([id, marker]) => {
        const loc = locations.find((l) => l.id === id);
        if (!loc) return;
        const inRegion = nextRegion !== 'All' && loc.region === nextRegion;
        const isActive = id === nextActiveId;
        marker.unbindTooltip();
        marker.bindTooltip(loc.city, {
          direction: 'top',
          offset: [0, -6],
          permanent: inRegion || isActive,
          opacity: 0.95,
        });
        const visible = nextRegion === 'All' || inRegion;
        if (visible) {
          marker.setStyle(markerStyle(loc.role, isActive));
        } else {
          marker.setStyle({ opacity: 0.18, fillOpacity: 0.1 });
        }
      });
    },
    [locations],
  );

  const styleCountries = useCallback((nextRegion: MapRegion) => {
    const store = storeRef.current;
    if (!store?.countries) return;
    store.countries.eachLayer((layer) => {
      const feature = (layer as L.Layer & { feature?: { properties: { name: string } } }).feature;
      if (!feature) return;
      (layer as L.Path).setStyle(countryStyle(feature.properties.name, nextRegion));
    });
  }, []);

  const styleMarkers = useCallback((nextActiveId: string | null) => {
    const store = storeRef.current;
    if (!store) return;
    Object.entries(store.markers).forEach(([id, marker]) => {
      const role = (marker as L.CircleMarker & { _role?: LocationRole })._role ?? 'operated';
      marker.setStyle(markerStyle(role, id === nextActiveId));
      if (id === nextActiveId) marker.bringToFront();
    });
  }, []);

  const selectCityRef = useRef<(id: string, fly?: boolean) => void>(() => {});

  const selectCity = useCallback(
    (id: string, fly = true) => {
      setActiveId(id);
      const loc = locations.find((l) => l.id === id);
      const store = storeRef.current;
      if (!store) return;

      styleMarkers(id);
      Object.values(store.markers).forEach((m) => m.unbindTooltip());

      if (loc && fly) {
        store.map.flyTo([loc.lat, loc.lng], Math.max(store.map.getZoom(), 5), { duration: 0.8 });
        store.map.once('moveend', () => styleLabels(region, id));
      } else {
        styleLabels(region, id);
      }
    },
    [locations, region, styleLabels, styleMarkers],
  );

  selectCityRef.current = selectCity;

  const selectRegion = useCallback(
    (nextRegion: MapRegion) => {
      const locs = nextRegion === 'All' ? locations : locations.filter((l) => l.region === nextRegion);
      const nextActiveId = locs[0]?.id ?? null;
      setRegion(nextRegion);
      setActiveId(nextActiveId);

      const store = storeRef.current;
      if (store && locs.length) {
        let bounds =
          nextRegion === 'All' ? null : countryBounds(nextRegion, store.countries!, store.L);
        if (!bounds || !bounds.isValid()) {
          bounds = store.L.latLngBounds(locs.map((l) => [l.lat, l.lng]));
          if (nextRegion !== 'All') bounds = bounds.pad(nextRegion === 'United Kingdom' ? 0.55 : 0.35);
        }
        if (bounds.isValid()) {
          store.map.flyToBounds(
            bounds,
            nextRegion === 'All'
              ? { padding: [56, 56], duration: 0.9 }
              : { padding: [20, 20], maxZoom: 6.5, duration: 0.9 },
          );
        }
      }

      styleMarkers(nextActiveId);
      styleCountries(nextRegion);
      if (store) {
        Object.values(store.markers).forEach((m) => m.unbindTooltip());
        store.map.once('moveend', () => styleLabels(nextRegion, nextActiveId));
      } else {
        styleLabels(nextRegion, nextActiveId);
      }
    },
    [locations, styleCountries, styleLabels, styleMarkers],
  );

  useEffect(() => {
    const el = mapElRef.current;
    if (!el || storeRef.current) return;

    let cancelled = false;

    (async () => {
      const [L, topojson] = await Promise.all([import('leaflet'), import('topojson-client')]);
      if (cancelled || !mapElRef.current) return;

      const map = L.map(el, {
        attributionControl: false,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomSnap: 0.25,
        maxZoom: 7,
        minZoom: 1.5,
      });
      map.setView([32, 10], 1.8);

      const markers: MarkerMap = {};
      storeRef.current = { map, markers, countries: null, L };

      locations.forEach((loc) => {
        const marker = L.circleMarker([loc.lat, loc.lng], markerStyle(loc.role, false)).addTo(map);
        (marker as L.CircleMarker & { _role: LocationRole })._role = loc.role;
        marker.bindTooltip(loc.city, { direction: 'top', offset: [0, -6], opacity: 0.95 });
        marker.on('click', () => selectCityRef.current(loc.id, false));
        markers[loc.id] = marker;
      });

      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [56, 56] });
      setActiveId(locations[0]?.id ?? null);
      styleMarkers(locations[0]?.id ?? null);

      try {
        const res = await fetch('/data/countries-110m.json');
        const world = (await res.json()) as WorldAtlas;
        if (cancelled) return;
        const geo = countriesGeoJson(world, topojson);
        const countries = L.geoJSON(geo, {
          style: (f) => countryStyle(f?.properties?.name ?? '', 'All'),
          interactive: false,
        }).addTo(map);
        countries.bringToBack();
        storeRef.current!.countries = countries;
      } catch {
        // map still works with pins only
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
      storeRef.current?.map.remove();
      storeRef.current = null;
    };
  }, [locations, styleMarkers]);

  const tabBase =
    'interactive cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass';
  const chipBase =
    'interactive cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm';

  return (
    <div>
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Choose region">
        {MAP_REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={region === r}
            onClick={() => selectRegion(r)}
            className={`${tabBase} min-h-11 ${
              region === r
                ? 'border border-brass bg-brass text-night'
                : 'border border-line-dark bg-transparent text-paper hover:border-brass hover:text-brass'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div
          ref={mapElRef}
          className="mlafc-map min-h-[clamp(320px,48vh,460px)] overflow-hidden rounded-xl border border-line-dark"
          aria-label="World map of locations"
          data-ready={ready || undefined}
        />

        <div className="flex min-w-0 flex-col gap-4">
          {visibleLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label={`Cities in ${region}`}>
              {visibleLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  aria-pressed={active?.id === loc.id}
                  onClick={() => selectCity(loc.id)}
                  className={`${chipBase} ${
                    active?.id === loc.id
                      ? 'border border-brass bg-brass text-night'
                      : 'border border-line-dark bg-paper/10 text-paper hover:border-brass hover:text-brass'
                  }`}
                >
                  {loc.city}
                </button>
              ))}
            </div>
          ) : null}

          <div
            aria-live="polite"
            className="flex-1 rounded-xl border border-line-dark bg-ink p-6 md:p-7"
          >
            {active ? (
              <div key={active.id} className="mlafc-panel-in">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                  {active.city}, {active.country}
                </p>
                <p className="mt-2 font-serif text-2xl leading-snug text-paper">{active.name}</p>
                <p className="mt-3 text-sm text-paper/75">
                  <span className={ROLE_BADGE[active.role]}>{ROLE_LABELS[active.role]}</span>
                  <span className="ml-2">{active.years}</span>
                </p>
                <p className="mt-4 leading-relaxed text-paper/85">{active.blurb}</p>
                {active.url ? (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arrow-link interactive mt-4 inline-block font-semibold text-brass hover:underline"
                  >
                    Visit hospital site ↗
                  </a>
                ) : (
                  <LinkNeededFlag
                    label="hospital link needed · locations.json"
                    className="mt-4 inline-block"
                  />
                )}
                {active.readMore ? (
                  <Link href={active.readMore} className="arrow-link interactive mt-4 inline-block font-semibold text-brass hover:underline">
                    Read more &rarr;
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <ul className="flex flex-wrap gap-4 text-xs text-paper/80" aria-label="Location legend">
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-brass" />
              Operated
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-2 border-brass-bright bg-night" />
              Taught
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink-mute bg-night" />
              Proctored
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
