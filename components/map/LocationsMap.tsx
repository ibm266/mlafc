'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { Location, LocationRole } from '@/data/types';

const ROLE_LABELS = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
} as const satisfies Record<LocationRole, string>;

const ROLE_ORDER: LocationRole[] = ['operated', 'taught', 'proctored'];

const UK_BOUNDS: L.LatLngBoundsExpression = [
  [49.9, -8.6],
  [58.7, 1.8],
];
const INDIA_BOUNDS: L.LatLngBoundsExpression = [
  [8.0, 68.0],
  [28.0, 88.0],
];
const WORLD_BOUNDS: L.LatLngBoundsExpression = [
  [5.0, -100.0],
  [60.0, 90.0],
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const pinIcon = (role: LocationRole) =>
  L.divIcon({
    className: `mlafc-pin mlafc-pin-${role}`,
    html: '<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path class="mlafc-pin-shape" d="M14 0C6.3 0 0 6.3 0 14c0 10 14 22 14 22s14-12 14-22C28 6.3 21.7 0 14 0z" /><circle cx="14" cy="14" r="5" /></svg>',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -34],
  });

function popupHtml(location: Location) {
  const images = location.images
    .slice(0, 2)
    .map(
      (src) =>
        `<img src="${escapeHtml(src)}" alt="" loading="lazy" class="mlafc-popup-img" />`,
    )
    .join('');
  const readMore = location.readMore
    ? `<a href="${escapeHtml(location.readMore)}" class="mlafc-popup-more">Read more &rarr;</a>`
    : '';

  return `
    <div class="mlafc-popup">
      <h3>${escapeHtml(location.name)}</h3>
      <p class="mlafc-popup-meta"><span class="mlafc-chip">${ROLE_LABELS[location.role]}</span> ${escapeHtml(location.years)}</p>
      <p>${escapeHtml(location.blurb)}</p>
      ${images}${readMore}
    </div>`;
}

function Pins({ locations }: { locations: Location[] }) {
  const map = useMap();

  useEffect(() => {
    const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });
    const hoverable = window.matchMedia('(hover: hover)').matches;

    for (const location of locations) {
      const marker = L.marker([location.lat, location.lng], {
        icon: pinIcon(location.role),
        keyboard: true,
        alt: `${location.name} - ${ROLE_LABELS[location.role]}`,
      });

      marker.bindPopup(popupHtml(location), { maxWidth: 280 });
      if (hoverable) {
        marker.on('mouseover', () => marker.openPopup());
      }
      marker.on('popupopen', () => marker.getElement()?.classList.add('mlafc-pin-active'));
      marker.on('popupclose', () => marker.getElement()?.classList.remove('mlafc-pin-active'));
      cluster.addLayer(marker);
    }

    map.addLayer(cluster);

    return () => {
      map.removeLayer(cluster);
    };
  }, [map, locations]);

  return null;
}

export default function LocationsMap({
  locations,
  height = '480px',
}: {
  locations: Location[];
  height?: string;
}) {
  const mapRef = useRef<L.Map | null>(null);

  const fly = (bounds: L.LatLngBoundsExpression) => {
    const map = mapRef.current;
    if (!map) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      map.fitBounds(bounds, { padding: [30, 30] });
    } else {
      map.flyToBounds(bounds, { padding: [30, 30], duration: 1.2 });
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fly(UK_BOUNDS)}
          className="rounded-full border border-line-dark px-4 py-1.5 text-sm font-semibold text-paper hover:border-brass hover:text-brass"
        >
          UK
        </button>
        <button
          type="button"
          onClick={() => fly(INDIA_BOUNDS)}
          className="rounded-full border border-line-dark px-4 py-1.5 text-sm font-semibold text-paper hover:border-brass hover:text-brass"
        >
          India
        </button>
        <ul className="ml-auto flex gap-4 text-xs text-paper/80" aria-label="Map legend">
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
      <MapContainer
        ref={mapRef}
        bounds={WORLD_BOUNDS}
        scrollWheelZoom={false}
        style={{ height, width: '100%' }}
        className="mlafc-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Pins locations={locations} />
      </MapContainer>
    </div>
  );
}
