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
  taught: 'rounded-full border border-paper/40 bg-paper px-2.5 py-0.5 text-[0.72rem] font-semibold text-night',
  proctored: 'rounded-full bg-[#5BA4B5] px-2.5 py-0.5 text-[0.72rem] font-semibold text-night',
};

const CITY_CHIP_LIMIT = 5;

type MarkerMap = Record<string, L.CircleMarker>;

type MapStore = {
  map: L.Map;
  markers: MarkerMap;
  countries: L.GeoJSON | null;
  L: typeof import('leaflet');
};

function syncMapSize(store: MapStore) {
  store.map.invalidateSize({ animate: false });
}

export default function LocationsMap({ locations }: { locations: Location[] }) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<MapStore | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);

  const indiaLocations = useMemo(() => locations.filter((l) => l.region === 'India'), [locations]);
  const defaultIndiaId = indiaLocations[0]?.id ?? locations[0]?.id ?? null;

  const [region, setRegion] = useState<MapRegion>('India');
  const [activeId, setActiveId] = useState<string | null>(defaultIndiaId);
  const [ready, setReady] = useState(false);
  const [citiesExpanded, setCitiesExpanded] = useState(false);

  activeIdRef.current = activeId;

  const visibleLocations = useMemo(
    () => locations.filter((l) => l.region === region),
    [locations, region],
  );
  const cityCounts = useMemo(() => {
    const counts = new Map<string, number>();
    visibleLocations.forEach((l) => counts.set(l.city, (counts.get(l.city) ?? 0) + 1));
    return counts;
  }, [visibleLocations]);

  const shownLocations = useMemo(() => {
    if (citiesExpanded) return visibleLocations;
    const selected = visibleLocations.find((l) => l.id === activeId);
    const rest = visibleLocations.filter((l) => l.id !== activeId);
    if (!selected) return visibleLocations.slice(0, CITY_CHIP_LIMIT);
    return [selected, ...rest.slice(0, CITY_CHIP_LIMIT - 1)];
  }, [activeId, citiesExpanded, visibleLocations]);

  const hasMoreCities = visibleLocations.length > CITY_CHIP_LIMIT;

  const active = locations.find((l) => l.id === activeId) ?? visibleLocations[0] ?? null;

  const syncTooltips = useCallback((nextActiveId: string | null) => {
    const store = storeRef.current;
    if (!store) return;
    Object.entries(store.markers).forEach(([id, marker]) => {
      const show = id === nextActiveId || id === hoveredIdRef.current;
      if (show) marker.openTooltip();
      else marker.closeTooltip();
    });
  }, []);

  const styleMarkers = useCallback(
    (nextRegion: MapRegion, nextActiveId: string | null) => {
      const store = storeRef.current;
      if (!store) return;

      Object.entries(store.markers).forEach(([id, marker]) => {
        const loc = locations.find((l) => l.id === id);
        if (!loc) return;
        const inRegion = loc.region === nextRegion;
        const isActive = id === nextActiveId;

        if (inRegion) {
          marker.setStyle(markerStyle(loc.role, isActive));
          if (isActive) marker.bringToFront();
        } else {
          marker.setStyle({ ...markerStyle(loc.role, false), opacity: 0.22, fillOpacity: 0.15 });
        }
      });

      syncTooltips(nextActiveId);
    },
    [locations, syncTooltips],
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

  const selectCityRef = useRef<(id: string, fly?: boolean) => void>(() => {});

  const selectCity = useCallback(
    (id: string, fly = true) => {
      const loc = locations.find((l) => l.id === id);
      if (!loc) return;

      const nextRegion = loc.region;
      if (nextRegion !== region) {
        setRegion(nextRegion);
        setCitiesExpanded(false);
        styleCountries(nextRegion);
      }

      setActiveId(id);
      styleMarkers(nextRegion, id);

      const store = storeRef.current;
      if (!store || !fly) return;

      syncMapSize(store);
      store.map.flyTo([loc.lat, loc.lng], Math.max(store.map.getZoom(), 5), { duration: 0.8 });
    },
    [locations, region, styleCountries, styleMarkers],
  );

  selectCityRef.current = selectCity;

  const selectRegion = useCallback(
    (nextRegion: MapRegion) => {
      const locs = locations.filter((l) => l.region === nextRegion);
      const nextActiveId = locs[0]?.id ?? null;
      setRegion(nextRegion);
      setActiveId(nextActiveId);
      setCitiesExpanded(false);

      styleCountries(nextRegion);
      styleMarkers(nextRegion, nextActiveId);

      const store = storeRef.current;
      if (!store || !locs.length) return;

      let bounds = store.countries ? countryBounds(nextRegion, store.countries, store.L) : null;
      if (!bounds || !bounds.isValid()) {
        bounds = store.L.latLngBounds(locs.map((l) => [l.lat, l.lng]));
        bounds = bounds.pad(nextRegion === 'United Kingdom' ? 0.55 : 0.35);
      }
      if (bounds.isValid()) {
        syncMapSize(store);
        store.map.flyToBounds(bounds, { padding: [20, 20], maxZoom: 6.5, duration: 0.9 });
      }
    },
    [locations, styleCountries, styleMarkers],
  );

  useEffect(() => {
    const el = mapElRef.current;
    if (!el || storeRef.current) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const onResize = () => {
      const store = storeRef.current;
      if (!store) return;
      syncMapSize(store);
    };

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
      const store: MapStore = { map, markers, countries: null, L };
      storeRef.current = store;

      locations.forEach((loc) => {
        const marker = L.circleMarker([loc.lat, loc.lng], markerStyle(loc.role, false)).addTo(map);
        (marker as L.CircleMarker & { _role: LocationRole })._role = loc.role;
        marker.bindTooltip(loc.city, {
          direction: 'top',
          offset: [0, -12],
          permanent: false,
          opacity: 1,
          sticky: false,
          className: 'mlafc-city-tooltip',
        });
        marker.on('mouseover', () => {
          hoveredIdRef.current = loc.id;
          marker.openTooltip();
        });
        marker.on('mouseout', () => {
          if (hoveredIdRef.current === loc.id) hoveredIdRef.current = null;
          if (activeIdRef.current !== loc.id) marker.closeTooltip();
        });
        marker.on('click', (event) => {
          L.DomEvent.stopPropagation(event);
          selectCityRef.current(loc.id, true);
        });
        markers[loc.id] = marker;
      });

      const fitIndia = () => {
        if (cancelled) return;
        syncMapSize(store);
        let bounds = store.countries ? countryBounds('India', store.countries, L) : null;
        if (!bounds || !bounds.isValid()) {
          const indiaLocs = locations.filter((l) => l.region === 'India');
          bounds = L.latLngBounds(indiaLocs.map((l) => [l.lat, l.lng])).pad(0.35);
        }
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [20, 20], maxZoom: 6.5, duration: 0.9 });
        }
      };

      setActiveId(defaultIndiaId);
      styleMarkers('India', defaultIndiaId);

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(el);
      window.addEventListener('resize', onResize);

      try {
        const res = await fetch('/data/countries-110m.json');
        const world = (await res.json()) as WorldAtlas;
        if (cancelled) return;
        const geo = countriesGeoJson(world, topojson);
        const countries = L.geoJSON(geo, {
          style: (f) => countryStyle(f?.properties?.name ?? '', 'India'),
          interactive: false,
        }).addTo(map);
        countries.bringToBack();
        store.countries = countries;
        requestAnimationFrame(fitIndia);
        styleCountries('India');
        styleMarkers('India', defaultIndiaId);
      } catch {
        // map still works with pins only
      }

      setReady(true);
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      storeRef.current?.map.remove();
      storeRef.current = null;
    };
  }, [defaultIndiaId, locations, styleCountries, styleMarkers]);

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
        <div className="flex min-w-0 flex-col gap-3">
          <div
            ref={mapElRef}
            className="mlafc-map h-[clamp(320px,48vh,460px)] min-h-[clamp(320px,48vh,460px)] overflow-hidden rounded-xl border border-line-dark"
            aria-label="World map of locations"
            data-ready={ready || undefined}
          />
          <ul className="flex flex-wrap gap-4 text-xs text-paper/80" aria-label="Location legend">
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-brass" />
              Operated
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border border-paper/50 bg-paper" />
              Taught
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-[#5BA4B5]" />
              Proctored
            </li>
          </ul>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div
            aria-live="polite"
            className="rounded-xl border border-line-dark bg-ink p-6 md:p-7"
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
                    Hospital ↗
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

          {visibleLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label={`Cities in ${region}`}>
              {shownLocations.map((loc) => (
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
                  {(cityCounts.get(loc.city) ?? 0) > 1 ? loc.name : loc.city}
                </button>
              ))}
              {hasMoreCities ? (
                <button
                  type="button"
                  onClick={() => setCitiesExpanded((open) => !open)}
                  className={`${chipBase} border border-line-dark bg-transparent text-brass hover:border-brass`}
                  aria-expanded={citiesExpanded}
                >
                  {citiesExpanded ? 'See less' : 'See more'}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
